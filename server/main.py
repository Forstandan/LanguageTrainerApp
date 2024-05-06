from flask import Flask, request, jsonify
from flask_cors import CORS
from gemni_api import *

app = Flask(__name__)
cors = CORS(app, origins='*')

@app.route('api/get_response', methods=['POST'])
def create_chat():
    language = request.json.get('language')
    difficulty = request.json.get('difficulty')
    location = request.json.get('location')

    prompt = ("Please to the best of your ability speak to me in {} in the CEFR difficulty of {}. "
            "DO NOT TRANSLATE THE FOLLOWING TEXT: "
            "(If I make a mistake, correct me by rephrasing my sentence in a correct manner. "
            "Begin speaking to me as if we were at a/an {})").format(language, difficulty, location)    
    
    if not prompt:
        return jsonify({'error': 'No prompt provided'}), 400
    
    try:
        result = getResponse(prompt)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=8080)

