from flask import request, jsonify
from src.util.calculate_price import calculate_flight_price
from src.util.logger import setup_logger

logger = setup_logger()
data_storage = {}

def flight_route(app):
    """
    This function sets up two routes for a Flask application: '/data' and '/result'.
    '/data' accepts POST requests with JSON data and stores it in the 'data_storage' dictionary.
    '/result' accepts GET requests and calculates a flight price based on the stored data.

    Parameters:
    app (Flask): The Flask application instance.

    Returns:
    None
    """

    @app.route('/data', methods=['POST'])
    def receive_data():
        """
        This route accepts POST requests with JSON data. It stores the data in the 'data_storage' dictionary.

        Returns:
        jsonify: A JSON response with a 'message' or 'error' field.
        """
        try:
            data = request.json
            logger.info("Uložena vstupní data: %s", data)
            data_storage['input'] = data
            return jsonify({'message': 'Data přijata'}), 200
        except Exception as e:
            logger.error(f"Chyba při ukládání dat: {e}")
            return jsonify({'error': 'Chyba při zpracování dat'}), 500

    @app.route('/result', methods=['GET'])
    def get_result():
        """
        This route accepts GET requests. It calculates a flight price based on the stored data.

        Returns:
        jsonify: A JSON response with the calculated price or an 'error' field.
        """
        try:
            data = data_storage.get('input')
            if not data:
                return jsonify({'error': 'Nejsou k dispozici žádná vstupní data'}), 400

            result = calculate_flight_price(data)
            return jsonify(result), 200

        except Exception as e:
            logger.error(f"Chyba při výpočtu: {e}")
            return jsonify({'error': 'Chyba při výpočtu'}), 500
