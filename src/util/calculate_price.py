from src.util.create_best_path import create_best_path
from src.util.price_prediction import predict_price


def calculate_flight_price(data):
    """
    Calculates the total flight price based on selected countries, best path, number of adults and children, and airline.

    Parameters:
    data (dict): A dictionary containing the following keys:
        - "selected" (list): A list of selected countries.
        - "best_path" (bool): A boolean indicating whether to find the best path or not.
        - "adults" (int): The number of adults.
        - "children" (int): The number of children.
        - "airline" (str): The airline code.

    Returns:
    dict: A dictionary containing the following keys:
        - "total_price" (float): The total flight price.
        - "best_path" (list): The best path of countries.
        - "adult_price" (float): The price for adults.
        - "child_price" (float): The price for children.
        - "error" (str): An error message if any error occurs.
    """
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
