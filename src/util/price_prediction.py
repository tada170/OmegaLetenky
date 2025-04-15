import joblib
import pandas as pd
from src.util.changes_prediction import predict_changes
from src.util.create_best_path import haversine
from src.util.logger import setup_logger

logger = setup_logger()

model_path = 'models/priceModels/model.pkl'
scaler_path = 'models/priceModels/scaler.pkl'
label_encoders_path = 'models/priceModels/label_encoders.pkl'

try:
    model = joblib.load(model_path)
except Exception as e:
    logger.error(f"Failed to load model: {e}")

try:
    scaler = joblib.load(scaler_path)
except Exception as e:
    logger.error(f"Failed to load scaler: {e}")

try:
    label_encoders = joblib.load(label_encoders_path)
except Exception as e:
    logger.error(f"Failed to load label encoders: {e}")

features = ['Duration', 'Changes', 'Distance', 'Airline', 'Arrival City','Adult']

def predict_price(arrival, departure, adult, airline):
    """
    This function predicts the price of a flight based on various parameters.

    Parameters:
    arrival (dict): A dictionary containing the arrival location details. It should have 'latitude', 'longitude', and 'city' keys.
    departure (dict): A dictionary containing the departure location details. It should have 'latitude', and 'longitude' keys.
    adult (int): The number of adult passengers for the flight.
    airline (str): The airline company for the flight.

    Returns:
    float or dict: The predicted price of the flight if successful. If an error occurs during the prediction process,
    it returns a dictionary with an 'error' key and a corresponding error message.
    """

    distance = haversine(arrival["latitude"], arrival["longitude"], departure["latitude"], departure["longitude"])
    logger.info(distance)
    changes = predict_changes(distance)
    logger.info(changes)
    duration = distance / 550
    arrival_city = arrival.get("city")
    logger.info(arrival_city)
    new_data = pd.DataFrame([[duration, changes, distance, airline, arrival_city, adult]], columns=features)
    logger.info(new_data)

    for col in ['Airline', 'Arrival City']:
        if col in label_encoders:
            try:
                logger.info(new_data[col])
                new_data[col] = label_encoders[col].transform([new_data[col][0]])
                logger.info(new_data[col])
            except Exception as e:
                logger.error(f"Error encoding {col}: {e}")
                return {'error': f'Missing encoder for {col}'}

    try:
        new_data_scaled = scaler.transform(new_data)
        logger.info(new_data_scaled)
    except Exception as e:
        logger.error(f"Error scaling data: {e}")
        return {'error': 'Error in scaling the data'}

    try:
        price = model.predict(new_data_scaled)[0]
        logger.info(f"price: {float(price)}")
        return price

    except Exception as e:
        logger.error(f"Error predicting price: {e}")
        return {'error': 'Error in price prediction'}
