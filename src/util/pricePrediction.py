import joblib
import pandas as pd
from src.util.changesPrediction import predict_changes
from src.util.locations import haversine
from src.util.logger import setup_logger

logger = setup_logger()

model_path = 'models/priceModels/model.pkl'
scaler_path = 'models/priceModels/scaler.pkl'
label_encoders_path = 'models/priceModels/label_encoders.pkl'

try:
    model = joblib.load(model_path)
    logger.info(f"Model loaded from {model_path}")
except Exception as e:
    logger.error(f"Failed to load model: {e}")

try:
    scaler = joblib.load(scaler_path)
    logger.info(f"Scaler loaded from {scaler_path}")
except Exception as e:
    logger.error(f"Failed to load scaler: {e}")

try:
    label_encoders = joblib.load(label_encoders_path)
    logger.info(f"Label encoders loaded from {label_encoders_path}")
except Exception as e:
    logger.error(f"Failed to load label encoders: {e}")

features = ['Duration', 'Changes', 'Distance', 'Airline', 'Arrival City','Adult']

def predict_price(arrival, departure,adult):

    airline = "4U"
    distance = haversine(arrival["latitude"], arrival["longitude"], departure["latitude"], departure["longitude"])

    changes = predict_changes(distance)

    duration = distance / 550
    arrival_city = arrival.get("city")
    print(adult)
    new_data = pd.DataFrame([[duration, changes, distance, airline, arrival_city,adult]], columns=features)

    for col in ['Airline', 'Arrival City']:
        if col in label_encoders:
            try:
                new_data[col] = label_encoders[col].transform([new_data[col][0]])
            except Exception as e:
                logger.error(f"Error encoding {col}: {e}")
                return {'error': f'Missing encoder for {col}'}

    try:
        new_data_scaled = scaler.transform(new_data)
    except Exception as e:
        logger.error(f"Error scaling data: {e}")
        return {'error': 'Error in scaling the data'}

    try:
        price = model.predict(new_data_scaled)[0]
        logger.info(f"Predicted price: {price}")
        return price
    except Exception as e:
        logger.error(f"Error predicting price: {e}")
        return {'error': 'Error in price prediction'}
