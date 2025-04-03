import joblib
import pandas as pd

model_path = 'models/changesModels/random_forest_model.pkl'
model = joblib.load(model_path)


def predict_changes(distance):
    duration = distance / 550
    new_data = pd.DataFrame([[distance, duration]],['Distance', 'Duration'] )
    prob = model.predict_proba(new_data)[0]

    if prob[1] < 0.5:
        changes = 1
    else:
        changes = 0

    print(changes)
    return changes

