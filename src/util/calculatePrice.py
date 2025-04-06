from src.util.createBestPath import create_best_path
from src.util.pricePrediction import predict_price


def calculate_flight_price(data):
    selected_countries = data.get("selected", [])
    find_best_path = data.get("best_path")
    adults = data.get("adults")
    children = data.get("children")
    airline = data.get("airline")

    if not selected_countries:
        return {'error': 'Žádné země nejsou vybrány'}

    if find_best_path:
        best_path = create_best_path(selected_countries)
        if 'error' in best_path:
            return {'error': best_path['error']}
    else:
        best_path = selected_countries + [selected_countries[0]]

    final_adult_price = 0
    final_children_price = 0
    ranges = 2 if int(children) > 0 else 1

    for j in range(ranges):
        price = 0
        for i in range(len(best_path) - 1):
            try:
                price += predict_price(best_path[i], best_path[i + 1], 1 - j, airline)
            except Exception as e:
                raise Exception(f"Chyba při predikci ceny pro {best_path[i]} -> {best_path[i + 1]}: {e}")
        if 1 - j == 1:
            final_adult_price += price * int(adults)
        else:
            final_children_price += price * int(children)

    total_price = final_adult_price + final_children_price

    return {
        "total_price": round(total_price, 2),
        "best_path": best_path,
        "adult_price": round(final_adult_price, 2),
        "child_price": round(final_children_price, 2)
    }
