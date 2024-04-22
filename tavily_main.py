## Getting content from tavily APIs


from dotenv import load_dotenv

load_dotenv()

from tavily import TavilyClient
import shutil
import os

## querying AI model

from pathlib import Path
from llama_index.core import ( # type: ignore
    VectorStoreIndex,
    SimpleDirectoryReader,
)
from llama_index.llms.openai import OpenAI # type: ignore
from typing import List, Optional
# from llama_index.llms.huggingface import ( # type: ignore
#     HuggingFaceInferenceAPI,
#     HuggingFaceLLM,
# )


from llama_index.core.response.notebook_utils import display_source_node # type: ignore
from llama_index.core.query_engine import RetrieverQueryEngine # type: ignore
from llama_index.core import Settings # type: ignore

user_query = "What are the effects of parental involvement on academic performance?"
user_query = "How can a father and mother influence a child's performance and grades in school?"

class FactFlow:
    def __init__(self):
        self.id = {}

    def get_response(self, query):
        tavily = TavilyClient(api_key=os.getenv('TAVILY_API_KEY'))

        response = tavily.search(query=query, 
                                search_depth="advanced", 
                                include_raw_content=True,
                                max_results=5,
                                exclude_domains = ['https://en.wikipedia.org/'])

        # if os.path.exists('tavily_data'):
        #     shutil.rmtree('tavily_data')
        #     os.makedirs('tavily_data')
        # else:
        #     os.makedirs('tavily_data')

        input_files = []
        meta_map = {}
        for count, result in enumerate(response['results']):
            n = len(self.id)
            self.id[result['title']] = n
            file = "tavily_data/file{}".format(n)
            input_files.append(file)
            meta_map[count] = {'title':result['title'], 'url':result['url']}
            f = open(file, "a", encoding="utf-8")
            f.write(result['raw_content'])
            f.close()

        Settings.chunk_size = 512
        Settings.llm = OpenAI(model="gpt-4", api_key=os.getenv('OPENAI_API_KEY'))

        documents = SimpleDirectoryReader(input_files=input_files).load_data()
        index = VectorStoreIndex.from_documents(documents)

        # HF_TOKEN: Optional[str] = os.getenv("HUGGING_FACE_TOKEN")
        gpt4 = OpenAI(model="gpt-4", api_key=os.getenv('OPENAI_API_KEY'))

        base_retriever = index.as_retriever(similarity_top_k=5)
        retrievals = base_retriever.retrieve(query)
        ans = {}
        for index, n in enumerate(retrievals):
            if 'https:/' not in n.text:
                # display_source_node(n, source_length=1500)
                file_name = n.metadata['file_name'][n.metadata['file_name'].rfind('/'):]
                curr_id = int(''.join(filter(str.isdigit, file_name)))
                ans['Reference {}: '.format(index+1)] = {"Node ID": n.node_id, 
                                                       "Text":n.text, 
                                                       "Score":n.score,
                                                       "Title":meta_map[curr_id]['title'],
                                                       "url":meta_map[curr_id]['url']}
            else:
                print("REMOVED CHUNK: ", n)
        query_engine_base = RetrieverQueryEngine.from_args(base_retriever, llm=gpt4)
        response = query_engine_base.query(query)

        # print(str(response))
        ans['Response'] = str(response)
        return ans
    
    def get_reprompt_response(self, query, title):
        title_id = self.id[title]
        title_file = "tavily_data/file{}".format(title_id)

        ## run through chat engine and return AI response in json file


if __name__ == '__main__':
    main = FactFlow(user_query)
    print(main.get_response())