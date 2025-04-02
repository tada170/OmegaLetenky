import os
from flask import Flask, request, jsonify, render_template
from dotenv import load_dotenv

load_dotenv()

HOST = os.getenv('HOST', '127.0.0.1')
PORT = int(os.getenv('PORT', 8080))
DEBUG = os.getenv('DEBUG', 'True').lower() in ('true', '1', 't')

app = Flask(__name__,template_folder='../html',static_folder='../public')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/data', methods=['POST'])
def receive_data():
    data = request.json
    selected_countries = data.get("selected", [])
    print(f"Received data for: {selected_countries}")
    return jsonify({"received_countries": selected_countries}), 200

if __name__ == '__main__':
    app.run(host=HOST, port=PORT, debug=DEBUG)
