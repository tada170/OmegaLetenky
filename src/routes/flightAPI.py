from flask import request, jsonify
from src.util.locations import create_best_path
from src.util.pricePrediction import predict_price

def flight_route(app):
    @app.route('/data', methods=['POST'])
    def receive_data():
        data = request.json

        selected_countries = data.get("selected", [])
        print(f"Received data for: {selected_countries}")
        best_path = create_best_path(selected_countries)

        if not best_path:
            return jsonify({'error': 'Nepodařilo se vygenerovat cestu'}), 400

        price = 0
        for i in range(len(best_path) - 1):
            price += predict_price(best_path[i], best_path[i + 1])

        return jsonify({"total_price": round(price,2),"best_path":best_path}), 200
