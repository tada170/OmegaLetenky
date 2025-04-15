import os
from flask import Flask
from dotenv import load_dotenv
from src.pages import index_route
from src.routes.flight_api import flight_route
from src.util.logger import setup_logger

load_dotenv()

HOST = os.getenv('HOST', '127.0.0.1')
PORT = int(os.getenv('PORT', 8080))
DEBUG = os.getenv('DEBUG', 'True') == 'True'

logger = setup_logger()
app = Flask(__name__, static_folder='static')
logger.info('Server is runnig')

index_route(app)
flight_route(app)

if __name__ == '__main__':
    app.run(host=HOST, port=PORT, debug=DEBUG)
