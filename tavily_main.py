from dotenv import load_dotenv

from tavily import TavilyClient
import os

from llama_index.core import ( # type: ignore
    VectorStoreIndex
)
from llama_index.llms.openai import OpenAI # type: ignore
from typing import List, Optional
# from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.core.chat_engine import CondenseQuestionChatEngine


# from llama_index.core.response.notebook_utils import display_source_node # type: ignore
from llama_index.core.query_engine import RetrieverQueryEngine # type: ignore
from llama_index.core import Settings # type: ignore
from llama_index.core.ingestion import IngestionPipeline
from llama_index.core.node_parser import SentenceSplitter
from llama_index.core import Document
from llama_index.core.chat_engine import CondenseQuestionChatEngine

import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

import json

load_dotenv()

# Fetch the service account key JSON file contents
# cred = credentials.Certificate(json.loads(os.getenv('FIREBASE_CREDS')))
cred = credentials.Certificate('creds.json')

# Initialize the app with a service account, granting admin privileges
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://fact-flow-ai-default-rtdb.firebaseio.com'
})

# user_query = "What are the effects of parental involvement on academic performance?"

class FactFlow:
    def __init__(self):
        # maybe unnecessary?
        self.id = {}

    def get_response(self, query, uid):
        # get Tavily response
        tavily = TavilyClient(api_key=os.getenv('TAVILY_API_KEY'))
        response = tavily.search(query=query, 
                                search_depth="advanced", 
                                include_raw_content=True,
                                max_results=5,
                                exclude_domains = ['https://en.wikipedia.org/'])

        # create maps from docIDs -> title & url
        meta_map = {}
        user_files = {}
        for count, result in enumerate(response['results']):
            user_files['file{}'.format(count)] = result['raw_content']
            meta_map[count] = {'title':result['title'], 'url':result['url']}


        # create and update firebase db
        ref = db.reference('DB%20Object%20name')
        users_ref = ref.child('users')
        users_ref.update({
            uid: user_files
        })


        # set up llama index settings
        Settings.chunk_size = 512
        # Settings.llm = OpenAI(model="gpt-4", api_key=os.getenv('OPENAI_API_KEY'))
        Settings.llm = OpenAI(model="gpt-3.5-turbo")

        text_splitter = SentenceSplitter(chunk_size=256, chunk_overlap=10)
        Settings.text_splitter = text_splitter


        # create llama index pipeline
        pipeline = IngestionPipeline(
            transformations=[
                SentenceSplitter(chunk_size=256, chunk_overlap=24)
            ]
        )
        documents = []
        for file in ref.get()['users'][uid]:
            documents.append(Document(text=ref.get()['users'][uid][file], id_=file, metadata={'id':file}))

        nodes = pipeline.run(documents=documents)
        index = VectorStoreIndex(nodes)

        gpt4 = OpenAI(model="gpt-3.5-turbo", api_key=os.getenv('OPENAI_API_KEY'))

        # retrieve nodes, and generate json response
        base_retriever = index.as_retriever(similarity_top_k=5)
        retrievals = base_retriever.retrieve(query)
        return_ans = {}
        i = 0
        for index, n in enumerate(retrievals):
            if 'https:/' not in n.text:
                return_ans['Reference{}: '.format(i)] = {'chunk':str(n.text), 
                'docID':str(n.metadata['id']),
                'title':str(meta_map[int(''.join(filter(str.isdigit, n.metadata['id'])))]['title']),
                'url':str(meta_map[int(''.join(filter(str.isdigit, n.metadata['id'])))]['url'])
                }
                i += 1
                
        query_engine_base = RetrieverQueryEngine.from_args(base_retriever, llm=gpt4)
        response = query_engine_base.query(query)
        return_ans['response'] = str(response)

        return return_ans
        
    
    # gets document content from firebase storage
    def get_document(self, docID, uid):
        ref = db.reference('DB%20Object%20name')

        doc_content = ref.get()['users'][uid][docID]
        
        return doc_content
    
    # gives AI response for querying a specific document using chat engine
    def get_reprompt_response(self, query, docID, uid):
        ref = db.reference('DB%20Object%20name')

        doc_content = [Document(text=ref.get()['users'][uid][docID], 
                               id_=docID, metadata={'id':docID})]

        # set up llama index settings
        Settings.chunk_size = 512
        # Settings.llm = OpenAI(model="gpt-4", api_key=os.getenv('OPENAI_API_KEY'))
        Settings.llm = OpenAI(model="gpt-3.5-turbo")

        text_splitter = SentenceSplitter(chunk_size=256, chunk_overlap=10)
        Settings.text_splitter = text_splitter


        # create llama index pipeline
        pipeline = IngestionPipeline(
            transformations=[
                SentenceSplitter(chunk_size=256, chunk_overlap=24)
            ]
        )

        nodes = pipeline.run(documents=doc_content)
        index = VectorStoreIndex(nodes)

        gpt4 = OpenAI(model="gpt-3.5-turbo", api_key=os.getenv('OPENAI_API_KEY'))
        base_retriever = index.as_retriever(similarity_top_k=5)
        query_engine_base = RetrieverQueryEngine.from_args(base_retriever, llm=gpt4)
        chat_engine = CondenseQuestionChatEngine.from_defaults(query_engine=query_engine_base)
        response = chat_engine.chat(query)

        return str(response)


        ## run through chat engine and return AI response in json file



if __name__ == '__main__':
    pass
    # user_query = "what are llms"
    # main = FactFlow()
    # print(main.get_reprompt_response('query', '0', '4e4bc471-eba8-43b6-9bd1-0a45c23a10d0'))
    # print(main.download_doc('0', '4e4bc471-eba8-43b6-9bd1-0a45c23a10d0'))
    # print(main.get_response(user_query, str(uuid.uuid4())))