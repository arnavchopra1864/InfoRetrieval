from flask import Flask, request, jsonify
from tavily_main import FactFlow
from flask_cors import CORS
from firebase import firebase



firebase = firebase.FirebaseApplication('https://fact-flow-ai-default-rtdb.firebaseio.com/', None)
app = Flask(__name__)
CORS(app)


@app.route('/query')
def print_query():
    query = request.args.get('q')
    new_query = FactFlow(query)
    response = new_query.get_response()
    # return '''Query: {}
    #         Response: {}''' .format(query, response)
    return response

if __name__ == '__main__':
    app.run(debug=True)
