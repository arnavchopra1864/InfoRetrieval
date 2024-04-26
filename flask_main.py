from flask import Flask, request, jsonify
from tavily_main import FactFlow
from flask_cors import CORS
from firebase import firebase



firebase = firebase.FirebaseApplication('https://fact-flow-ai-default-rtdb.firebaseio.com/', None)
app = Flask(__name__)
fact_flow = FactFlow()

CORS(app)


# first route, gets document nodes + summary response
@app.route('/query')
def print_query():
    query = request.args.get('q')
    uid = request.args.get('u')

    response = fact_flow.get_response(query, uid)
    return response

# gets document content
@app.route('/search')
def print_content():
    docID = request.args.get('d')
    uid = request.args.get('u')
    content = fact_flow.get_document(docID, uid)

    return content

# gets AI response for specific document
@app.route('/search/query')
def print_new_response():
    query = request.args.get('q')
    docID = request.args.get('d')
    uid = request.args.get('u')

    response = fact_flow.get_reprompt_response(query, docID, uid)
    return response

if __name__ == '__main__':
    app.run(debug=True)
