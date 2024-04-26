from flask import Flask, request, jsonify, Response
from tavily_main import FactFlow
from flask_cors import CORS
from flask_sse import sse

app = Flask(__name__)
CORS(app)

@app.route('/query')
def print_query():
    query = request.args.get('q')
    if not query:
        return jsonify({'error': 'Query parameter "q" is required'}), 400
    
    try:
        new_query = FactFlow(query)
        def generate_response():
            try:
                output = new_query.get_nodes()
                for text in output:
                    yield f'{text} {output[text]}'
                    #print(output[text])
                response = new_query.get_response()
                # yield response
                for text in response:
                    #print(f"text: {text}")
                    yield text
            except Exception as error:
                yield str(error)
        
        #print(f'generate_response: {generate_response()}')

        #return jsonify(new_query.get_nodes())
        return Response(generate_response(), mimetype='text/event-stream')
    
        #return jsonify({'query': query, 'response': response})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)