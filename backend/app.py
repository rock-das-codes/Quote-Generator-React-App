from flask import Flask, jsonify, request
import requests
from flask_cors import CORS
import ssl

app = Flask(__name__)
CORS(app)

QUOTE_API_URL = "https://api.quotable.io/random"
TAGS_API_URL = "https://api.quotable.io/tags"

@app.route('/api/quote', methods=['GET'])
def get_quote():
    try:
        tag = request.args.get('tag')
        if tag:
            url = f"https://api.quotable.io/quotes?tags={tag}&limit=50"
        else:
            url = QUOTE_API_URL
        response = requests.get(url, verify=False)
        response.raise_for_status()
        data = response.json()
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/tags', methods=['GET'])
def get_tags():
    try:
        response = requests.get(TAGS_API_URL, verify=False)
        response.raise_for_status()
        data = response.json()
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
