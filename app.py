import json
from flask import Flask, jsonify, request
import os
from llama_index.core import (
    VectorStoreIndex,
    SimpleDirectoryReader,
)
from llama_index.core.postprocessor import MetadataReplacementPostProcessor
from llama_index.core.node_parser import SentenceSplitter
from llama_index.core.node_parser import SentenceWindowNodeParser
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.llms.openai import OpenAI
from llama_index.core import Settings
from tavily import TavilyClient
import shutil
from llama_index.embeddings.huggingface import HuggingFaceEmbedding

app = Flask(__name__)

query = ""
window_response = ""


@app.route('/response', methods=['GET'])
def get_response():
    settings()
    query = "What are the effects of parental involvement on academic performance?"
    Tavily(query=query)
    window_response = embedDocuments()
    return jsonify(window_response)

@app.route('/query', methods=['POST'])
def post_query():
    query = json.loads(request.data)
    settings()
    #query = "What are the effects of parental involvement on academic performance?"
    Tavily()
    window_response = embedDocuments()
    #printOutput(response)
    
    return jsonify(window_response)

def Tavily(query: str):
    # Getting content from tavily APIs
    tavily = TavilyClient(api_key=os.getenv('TAVILY_API_KEY'))
    response = tavily.search(query=query, 
                         search_depth="advanced", 
                         include_raw_content=True,
                         max_results=5)

    #store retrieved articles from tavily
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
    global documents 
    documents = SimpleDirectoryReader("tavily_data").load_data()



def settings():
    gpt4 = OpenAI(model="gpt-4", api_key=os.environ['OPENAI_API_KEY'])
    Settings.llm = gpt4
    Settings.embed_model = OpenAIEmbedding(api_key=os.environ['OPENAI_API_KEY'])
#     Settings.embed_model= HuggingFaceEmbedding(
#     model_name="sentence-transformers/all-mpnet-base-v2", max_length=512
# )
    Settings.text_splitter = SentenceSplitter()



def embedDocuments():
    #window and direct quote processing
    node_parser = SentenceWindowNodeParser.from_defaults(
        window_size=3,
        window_metadata_key="window",
        original_text_metadata_key="original_text",
    )
    

    nodes = node_parser.get_nodes_from_documents(documents)
    base_nodes = Settings.text_splitter.get_nodes_from_documents(documents)

    sentence_index = VectorStoreIndex(nodes)
    base_index = VectorStoreIndex(base_nodes)
    
    #get summarized answer from model
    query_engine = sentence_index.as_query_engine(
        similarity_top_k=2,
        node_postprocessors=[
        MetadataReplacementPostProcessor(target_metadata_key="window")
        ],
    )
    window_response = query_engine.query(query)
    return window_response

def printOutput():
    #output window and original sentence
    for window in window_response.source_nodes:
        print("Window: ")
        print(window.node.metadata["window"])
        print("Original Sentence: ")
        print(window.node.metadata["original_text"])
        print()
        #output summarized response
        print(window_response)


#use as template for each method
# members = [{ 'id': 1, 'name': 'Laksh' }, 
#                 { 'id': 2, 'name': 'Avik' }, 
#                 { 'id': 3, 'name': 'Harsha' }, 
#                 { 'id': 4, 'name': 'Arnav' }]

# nextMemberId = 4

# @app.route('/members', methods=['GET'])
# def get_members():
#  return jsonify(members)


# @app.route('/members/<int:id>', methods=['GET'])
# def get_member_by_id(id: int):
#     member = get_member(id)
#     if member is None:
#         return jsonify({ 'error': 'Member does not exist'}), 404
#     return jsonify(member)

# def get_member(id):
#     return next((m for m in members if m['id'] == id), None)

# def member_is_valid(member):
#     for key in member.keys():
#         if key != 'name':   
#             return False
#         return True
    


# @app.route('/members', methods=['POST'])
# def create_members():
#     member = json.loads(request.data)
#     if not member_is_valid(member):
#         return jsonify({ 'error': 'Invalid member properties.' }), 400

#     member['id'] = nextMemberId
#     nextMemberId += 1
#     members.append(member)

#     return '', 201, { 'location': f'/members/{member["id"]}' }


# @app.route('/members/<int:id>', methods=['PUT'])
# def update_member(id: int):
#     member = get_member(id)
#     if member is None:
#         return jsonify({ 'error': 'Member does not exist.' }), 404

#     updated_member = json.loads(request.data)
#     if not member_is_valid(update_member):
#         return jsonify({ 'error': 'Invalid member properties.' }), 400

#     member.update(update_member)

#     return jsonify(member)


# @app.route('/members/<int:id>', methods=['DELETE'])
# def delete_member(id: int):
#     member = get_member(id)
#     if member is None:
#         return jsonify({ 'error': 'Member does not exist.' }), 404

#     members = [m for m in members if m['id'] != id]
#     return jsonify(member), 200

if __name__ == '__main__':
   app.run(debug=True)
