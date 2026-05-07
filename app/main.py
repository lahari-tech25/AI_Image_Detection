from fastapi import FastAPI, File, UploadFile
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
from PIL import Image
import io

# Create FastAPI app
app = FastAPI()

# Load trained CNN model
model = load_model("saved_models/model.keras")

# Home route
@app.get("/")
def home():
    return {"message": "AI Image Detection API Running"}

# Prediction route
@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    # Read uploaded image
    contents = await file.read()

    # Convert image
    img = Image.open(io.BytesIO(contents))

    # Resize image
    img = img.resize((128, 128))

    # Convert to array
    img_array = np.array(img)

    # Normalize
    img_array = img_array / 255.0

    # Add batch dimension
    img_array = np.expand_dims(img_array, axis=0)

    # Predict
    prediction = model.predict(img_array)

    # Result
    if prediction[0][0] > 0.5:
        result = "Fake Image"
    else:
        result = "Real Image"

    return {
        "prediction": result
    }