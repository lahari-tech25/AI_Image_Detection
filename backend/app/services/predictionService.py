from tensorflow.keras.models import load_model

import numpy as np

from PIL import Image

import io
import os

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.dirname(os.path.abspath(__file__))
    )
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "saved_models",
    "model.keras"
)

model = load_model(MODEL_PATH)

def predict_image(contents):

    img = Image.open(io.BytesIO(contents)).convert("RGB")

    img = img.resize((128, 128))

    img_array = np.array(img)

    img_array = img_array / 255.0

    img_array = np.expand_dims(img_array, axis=0)

    prediction = model.predict(img_array)

    confidence = float(prediction[0][0])

    if confidence > 0.5:

        result = "Fake Image"

        confidence_score = confidence * 100

    else:

        result = "Real Image"

        confidence_score = (1 - confidence) * 100

    return {
        "prediction": result,
        "confidence": round(confidence_score, 2)
    }