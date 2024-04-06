## Getting content from tavily APIs

user_query = "What are the effects of parental involvement on academic performance?"
user_query = "How can a father and mother influence a child's performance and grades in school?"

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
from llama_index.llms.huggingface import ( # type: ignore
    HuggingFaceInferenceAPI,
    HuggingFaceLLM,
)


from llama_index.core.response.notebook_utils import display_source_node # type: ignore
from llama_index.core.query_engine import RetrieverQueryEngine # type: ignore
from llama_index.core import Settings # type: ignore

from dotenv import load_dotenv

load_dotenv()

tavily = TavilyClient(api_key=os.getenv('TAVILY_API_KEY'))

response = tavily.search(query=user_query, 
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


Settings.llm = OpenAI(model="gpt-3.5-turbo", api_key=os.getenv('OPENAI_API_KEY'))

documents = SimpleDirectoryReader("tavily_data").load_data()
index = VectorStoreIndex.from_documents(documents)

# HF_TOKEN: Optional[str] = os.getenv("HUGGING_FACE_TOKEN")
gpt4 = OpenAI(model="gpt-3.5-turbo", api_key=os.getenv('OPENAI_API_KEY'))
query = user_query

base_retriever = index.as_retriever(similarity_top_k=3)
retrievals = base_retriever.retrieve(query)
for n in retrievals:
    display_source_node(n, source_length=1500)
query_engine_base = RetrieverQueryEngine.from_args(base_retriever, llm=gpt4)
response = query_engine_base.query(query)

print(str(response))