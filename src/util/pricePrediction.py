import joblib
import pandas as pd
from src.util.changesPrediction import predict_changes
from src.util.locations import haversine


model_path = 'models/priceModels/model.pkl'
scaler_path = 'models/priceModels/scaler.pkl'
label_encoders_path = 'models/priceModels/label_encoders.pkl'

model = joblib.load(model_path)
scaler = joblib.load(scaler_path)
label_encoders = joblib.load(label_encoders_path)

features = ['Duration', 'Changes', 'Distance', 'Airline', 'Arrival City']

def predict_price(arrival, departure):
    airline = "LH"
    distance = haversine(arrival["latitude"], arrival["longitude"], departure["latitude"], departure["longitude"])

    changes = predict_changes(distance)
    duration = distance / 550

    arrival_city = arrival.get("city")

    new_data = pd.DataFrame([[duration, changes, distance, airline, arrival_city]], columns=features)

    for col in ['Airline', 'Arrival City']:
        if col in label_encoders:
            new_data[col] = label_encoders[col].transform([new_data[col][0]])
        else:
            return {'error': f'Missing encoder for {col}'}

    new_data_scaled = scaler.transform(new_data)
    price = model.predict(new_data_scaled)[0]

    return price
