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
from llama_index.core import get_response_synthesizer

user_query = "What are the effects of parental involvement on academic performance?"
user_query = "How can a father and mother influence a child's performance and grades in school?"
tavily = ""
response = ""
documents = ""
index = ""
base_retriever = ""
retrievals = ""
query_engine_base = ""

class FactFlow:
    def __init__(self, query):
        self.user_query = query
        self.tavily = TavilyClient(api_key=os.getenv('TAVILY_API_KEY'))

        self.response = self.tavily.search(query=self.user_query, 
                                search_depth="advanced", 
                                include_raw_content=True,
                                max_results=5)

        if os.path.exists('tavily_data'):
            shutil.rmtree('tavily_data')
            os.makedirs('tavily_data')
        else:
            os.makedirs('tavily_data')

        for count, result in enumerate(self.response['results']):
            f = open("tavily_data/demofile{}.txt".format(count), "a", encoding="utf-8")
            f.truncate(0)
            f.write(result['raw_content'])
            f.close()


        gpt4 = OpenAI(model="gpt-3.5-turbo", api_key=os.getenv('OPENAI_API_KEY'))
        Settings.llm = gpt4

        self.documents = SimpleDirectoryReader("tavily_data").load_data()
        self.index = VectorStoreIndex.from_documents(self.documents)

        # HF_TOKEN: Optional[str] = os.getenv("HUGGING_FACE_TOKEN")

        self.base_retriever = self.index.as_retriever(similarity_top_k=5)
        synth = get_response_synthesizer(streaming=True)
        self.query_engine_base = RetrieverQueryEngine.from_args(self.base_retriever, response_synthesizer=synth)

    def get_nodes(self):
        #print(len(self.retrievals))
        ans = {}
        for index, n in enumerate(self.query_engine_base.nodes):
            if 'https:/' not in n.text:
                #display_source_node(n, source_length=1500)
                ans['Reference {}: '.format(index+1)] = {"Node ID": n.node_id, 
                                                       "Text":n.text, 
                                                       "Score":n.score}
            else:
                print("REMOVED CHUNK: ", n)
            #print("finsihed getting nodes")
        return ans

    def get_response(self):
        streaming_response = self.query_engine_base.query(self.user_query)
        return streaming_response.response_gen


if __name__ == '__main__':
    main = FactFlow("What are LLMs?")
    print(main.get_response())