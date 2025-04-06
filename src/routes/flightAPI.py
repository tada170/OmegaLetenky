from flask import request, jsonify
from src.util.calculatePrice import calculate_flight_price
from src.util.logger import setup_logger

logger = setup_logger()
data_storage = {}

def flight_route(app):
    @app.route('/data', methods=['POST'])
    def receive_data():
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
        try:
            data = data_storage.get('input')
            if not data:
                return jsonify({'error': 'Nejsou k dispozici žádná vstupní data'}), 400

            result = calculate_flight_price(data)
            return jsonify(result), 200

        except Exception as e:
            logger.error(f"Chyba při výpočtu: {e}")
            return jsonify({'error': 'Chyba při výpočtu'}), 500
