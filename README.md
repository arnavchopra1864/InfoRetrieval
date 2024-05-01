# FactFlow [Click here!](https://fact-flow-three.vercel.app/query)
## Convergent AI Build team project Spring 2024  
This web app allows users to input a research related query, which will be answered with an AI generated response.
To reduce hallucination, this response is based on filtered and retrieved internet sources, and the text chunks from these sources that are found to be relevant to the query are included in the output. Users can also further explore on their own as the links to the supporting documents are provided.

## Front End
The frontend of the application is developed using React, and it is hosted on Vercell. The main related files are QueryPage.js, App.js, Header.js and their corresponding CSS files. Some invdividual components in the query page have their own files as well. 
## Back End
Our backend is in Python, and we use Flask API to communicate between the backend and the frontend. The flask code can be found in flask_main.py. The backend is hosted on Heroku. We also use firebase interaction which is done in our flask_main files and tavily_main files, which is commented out for live demonstration purposes.
## Query Pipeline
Once the flask recieves an HTTP request from the front end, it sends the query through our pipeline, which can be found in tavily_main.py. 
#### 1. Tavily API
Our pipeline uses Tavily API to find up to five relevant research papers/articles, which are stored in our firebase database. 
#### 2. LlamaIndex
Using the LlamaIndex framework, we embed each of the sources, and then retrieve five nodes (direct text chunks from the articles) that were found to be most relevant to the query.
Then, using these nodes and the user's query, the query engine generates an appropriate response, stating clearly if not enough information was found to answer the question. 


