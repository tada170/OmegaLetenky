from flask import request, jsonify
from src.util.locations import create_best_path
from src.util.pricePrediction import predict_price
from src.util.logger import setup_logger

logger = setup_logger()


def flight_route(app):
    @app.route('/data', methods=['POST'])
    def receive_data():
        try:
            data = request.json
            logger.info("Received data: %s", data)

            selected_countries = data.get("selected", [])
            find_best_path = data.get("best_path")
            adults = data.get("adults")
            children = data.get("children")

            if not selected_countries:
                logger.error("No countries selected")
                return jsonify({'error': 'No countries selected'}), 400

            logger.info(f"Selected countries: {selected_countries}")

            if find_best_path:
                best_path = create_best_path(selected_countries)
                if 'error' in best_path:
                    logger.error(f"Error in generating best path: {best_path['error']}")
                    return jsonify({'error': best_path['error']}), 400
            else:
                best_path = selected_countries + [selected_countries[0]]
            final_adult_price = 0
            final_children_price = 0
            ranges = 2 if int(children) > 0 else 1
            print(ranges)
            for j in range(ranges):
                price = 0
                for i in range(len(best_path) - 1):
                    try:
                        price += predict_price(best_path[i], best_path[i + 1],1 - j)
                    except Exception as e:
                        logger.error(f"Error during price prediction for {best_path[i]} -> {best_path[i + 1]}: {e}")
                        return jsonify(
                            {'error': f'Error predicting price for {best_path[i]} -> {best_path[i + 1]}'}), 500
                if 1-j == 1:
                    final_adult_price += price * int(adults)
                else:
                    final_children_price += price * int(children)
            total_price = final_adult_price + final_children_price

            return jsonify({"total_price": round(total_price, 2), "best_path": best_path, "adult_price": round(final_adult_price,2),"child_price": round(final_children_price,2)}), 200


        except Exception as e:
            logger.error(f"Error in processing the request: {e}")
            return jsonify({'error': 'An error occurred while processing the request'}), 500
