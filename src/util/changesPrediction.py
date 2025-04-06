import joblib
import pandas as pd
from src.util.logger import setup_logger

logger = setup_logger()

model_path = 'models/changesModels/random_forest_model.pkl'

try:
    model = joblib.load(model_path)
except Exception as e:
    logger.error(f"Failed to load model from {model_path}. Error: {e}")
    raise


def predict_changes(distance):
    duration = distance / 550

    new_data = pd.DataFrame([[distance, duration]], columns=['Distance', 'Duration'])

    try:
        prob = model.predict_proba(new_data)[0]
    except Exception as e:
        logger.error(f"Error during prediction: {e}")
        raise

    if prob[1] < 0.5:
        changes = 1
    else:
        changes = 0

    return changes
