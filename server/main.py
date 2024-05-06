from flask import Flask, request, jsonify
from flask_cors import CORS
from gemni_api import *

app = Flask(__name__)
cors = CORS(app, origins='*')

@app.route('/api/get__first', methods=['POST'])
def create_chat():
    language = request.json.get('language')
    difficulty = request.json.get('difficulty')
    location = request.json.get('location')

    prompt = ("Act as a person at a/an {}. Please to the best of your ability speak to me in {} in the CEFR difficulty of {}. "
            "DO NOT TRANSLATE THE FOLLOWING TEXT: "
            "If I make a mistake, correct me by rephrasing my sentence in a correct manner. ").format(location, language, difficulty)    
    
    print(prompt)

    if not prompt:
        return jsonify({'error': 'No prompt provided'}), 400
    
    try:
        result = getResponse(prompt)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/get__response', methods=['POST'])
def get_response():
    prompt = request.json.get('prompt')
    print(prompt)

    if not prompt:
        return jsonify({'error': 'No prompt provided'}), 400
    
    try:
        result = getResponse(prompt)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=8080)

