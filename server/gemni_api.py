from dotenv import load_dotenv
import os
import requests

load_dotenv()

api_key = os.getenv('GOOGLE_API_KEY')
url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'

headers = {'Content-Type': 'application/json'}
params = {'key': api_key}

def getResponse(query):
    data = {"contents":[{"parts":[{"text":query}]}]}

    try:
        response = requests.post(url, headers=headers, params=params, json=data)
        response.raise_for_status()  # Raise an exception for HTTP errors

        # Extract the text section from the JSON response directly
        response_data = response.json()
        text = response_data['candidates'][0]['content']['parts'][0]['text']

        # Print the text
        return(text)
    except Exception as e:
        return(f"Error: {e}")


