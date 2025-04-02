import os
import joblib
import pandas as pd
from flask import Flask, request, jsonify, render_template
from dotenv import load_dotenv
from geopy.distance import geodesic
from geopy.geocoders import Nominatim

load_dotenv()

HOST = os.getenv('HOST', '127.0.0.1')
PORT = int(os.getenv('PORT', 8080))
DEBUG = os.getenv('DEBUG', 'True') == 'True'

app = Flask(__name__, template_folder='../html', static_folder='../public')

geolocator = Nominatim(user_agent="geoapi")

@app.route('/')
def home():
    return render_template('index.html')


@app.route('/data', methods=['POST'])
def receive_data():
    data = request.json
    selected_countries = data.get("selected", [])
    print(f"Received data for: {selected_countries}")
    best_path = create_best_path(selected_countries)
    return jsonify(best_path), 200


def create_best_path(selected_countries):
    geocode_array = get_geocode(selected_countries)
    if not geocode_array:
        return {'error': 'Could not geocode all selected countries'}

    best_path, best_cost = branch_and_bound(geocode_array)

    return {'best_path': ' -> '.join([city['city'] for city in best_path])}


def get_geocode(selected_countries):
    geocode_array = []
    for city in selected_countries:
        location = geolocator.geocode(city)
        if location:
            geocode_array.append({'city': city, 'lat': location.latitude, 'lon': location.longitude})
        else:
            print(f"Could not geocode: {city}")
            return None
    return geocode_array


def branch_and_bound(cities):
    n = len(cities)
    best_path = None
    best_cost = float('inf')

    def search(path, visited, cost):
        nonlocal best_path, best_cost
        if len(path) == n:
            cost += geodesic((path[-1]['lat'], path[-1]['lon']), (path[0]['lat'], path[0]['lon'])).km
            if cost < best_cost:
                best_cost = cost
                best_path = path + [path[0]]
            return

        for i in range(n):
            if i not in visited:
                new_cost = cost + geodesic((path[-1]['lat'], path[-1]['lon']),
                                           (cities[i]['lat'], cities[i]['lon'])).km
                if new_cost < best_cost:
                    search(path + [cities[i]], visited | {i}, new_cost)

    search([cities[0]], {0}, 0)

    return best_path, best_cost


model_path = '../models/model.pkl'
scaler_path = '../models/scaler.pkl'
label_encoders_path = '../models/label_encoders.pkl'

model = joblib.load(model_path)
scaler = joblib.load(scaler_path)
label_encoders = joblib.load(label_encoders_path)

features = ['Duration', 'Changes', 'Distance', 'Airline', 'Arrival City']


@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    try:
        changes = int(data['changes'])
        airline = data['airline']
        arrival = data['arrival']
        distance = get_distance(data['departure'], arrival)
        duration = distance / 550

        new_data = pd.DataFrame([[duration, changes, distance, airline, arrival]], columns=features)

        for col in ['Airline', 'Arrival City']:
            if col in label_encoders:
                new_data[col] = label_encoders[col].transform([new_data[col][0]])
            else:
                return jsonify({'error': f'Missing encoder for {col}'}), 400

        new_data_scaled = scaler.transform(new_data)
        price = model.predict(new_data_scaled)[0]

        return jsonify({'price': price})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

def get_distance(city1, city2):
    loc1 = geolocator.geocode(city1)
    loc2 = geolocator.geocode(city2)
    if loc1 and loc2:
        return geodesic((loc1.latitude, loc1.longitude), (loc2.latitude, loc2.longitude)).km
    return None

if __name__ == '__main__':
    app.run(host=HOST, port=PORT, debug=DEBUG)
