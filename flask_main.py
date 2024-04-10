from flask import Flask, request, jsonify
from tavily_main import FactFlow

app = Flask(__name__)

@app.route('/query')
def print_query():
    query = request.args.get('q')
    # response=""
    new_query = FactFlow(query)
    response = new_query.get_response()
    # return '''Query: {}
    #         Response: {}''' .format(query, response)
    return response

if __name__ == '__main__':
    app.run(debug=True)
