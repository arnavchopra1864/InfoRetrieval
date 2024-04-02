import os.path
from llama_index.core import (
    VectorStoreIndex,
    SimpleDirectoryReader,
    StorageContext,
    load_index_from_storage,
)
#FOR THIS PROGRAM TO WORK RUN IN TERMINAL
#export OPENAI_API_KEY=<apikey>

# check if storage already exists
PERSIST_DIR = "./storage"
if not os.path.exists(PERSIST_DIR):
    # load the documents and create the index
    documents = SimpleDirectoryReader("data").load_data()
    index = VectorStoreIndex.from_documents(documents)
    # store it for later
    index.storage_context.persist(persist_dir=PERSIST_DIR)
else:
    # load the existing index
    storage_context = StorageContext.from_defaults(persist_dir=PERSIST_DIR)
    index = load_index_from_storage(storage_context)

# Either way we can now query the index
    
query_engine = index.as_query_engine(streaming=True, similarity_top_k=3) # change this parameter to add context
chat_engine = index.as_chat_engine(chat_mode="best", verbose=True, similarity_top_k=3)
#response = query_engine.query("What is critical for optimal performance?") 
#print(response)t
print('Ask a question')
userInput = input()
while (userInput != 'quit'):
    response = chat_engine.chat(userInput)
    #response = query_engine.query(userInput)
    print(response)
    userInput = input()
