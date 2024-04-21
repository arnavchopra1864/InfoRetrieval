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
from llama_index.embeddings.huggingface import HuggingFaceEmbedding


from llama_index.core.response.notebook_utils import display_source_node # type: ignore
from llama_index.core.query_engine import RetrieverQueryEngine # type: ignore
from llama_index.core import Settings # type: ignore

query = "What are the effects of parental involvement on academic performance?"
#query = "How can a father and mother influence a child's performance and grades in school?"

class FactFlow:
    def __init__(self, query):
        self.query = query

    def get_response(self):
        tavily = TavilyClient(api_key=os.getenv('TAVILY_API_KEY'))

        response = tavily.search(query=self.query, 
                                search_depth="advanced", 
                                include_raw_content=True,
                                max_results=5)

        if os.path.exists('tavily_data'):
            shutil.rmtree('tavily_data')
            os.makedirs('tavily_data')
        else:
            os.makedirs('tavily_data')

        for count, result in enumerate(response['results']):
            f = open("tavily_data/demofile{}.txt".format(count), "a", encoding="utf-8")
            f.truncate(0)
            f.write(result['raw_content'])
            f.close()

        gpt4 = OpenAI(model="gpt-4", api_key=os.getenv('OPENAI_API_KEY'))
        Settings.llm = gpt4

        Settings.embed_model = HuggingFaceEmbedding(
        model_name="BAAI/bge-base-en-v1.5"
        )

        documents = SimpleDirectoryReader("tavily_data").load_data()
        index = VectorStoreIndex.from_documents(documents)

        query = self.query

        base_retriever = index.as_retriever(similarity_top_k=5)
        retrievals = base_retriever.retrieve(query)
        ans = {}
        for index, n in enumerate(retrievals):
            if 'https:/' not in n.text:
                # display_source_node(n, source_length=1500)
                ans['Reference {}: '.format(index+1)] = {"Node ID": n.node_id, 
                                                       "Text":n.text, 
                                                       "Score":n.score}
            else:
                print("REMOVED CHUNK: ", n)
        query_engine_base = RetrieverQueryEngine.from_args(base_retriever)
        response = query_engine_base.query(query)

        # print(str(response))
        ans['Response'] = str(response)
        return ans


if __name__ == '__main__':
    main = FactFlow("What are LLMs?")
    print(main.get_response())