from flask import Flask, request, jsonify
from tavily_main import FactFlow

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Use the application default credentials.
import firebase_admin
from firebase_admin import credentials
import uuid

app = Flask(__name__)

cred = credentials.Certificate("./creds.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

fact_flow = FactFlow()

def add_ref(response):
    db.collection("users").document(str(uuid.uuid4())).set(response)


@app.route('/query')
def print_query():
    query = request.args.get('q')
    # response=""
    response = fact_flow.get_response(query)
    # return '''Query: {}
    #         Response: {}''' .format(query, response)
    add_ref(response)
    return response

if __name__ == '__main__':
    app.run(debug=True)