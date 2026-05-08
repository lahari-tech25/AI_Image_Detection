from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from app.auth import router as auth_router

from app.database import prediction_collection
from app.services.predictionService import predict_image

from datetime import datetime

# Create FastAPI app
app = FastAPI()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)

# Home Route
@app.get("/")
def home():

    return {
        "message": "AI Image Detection API Running"
    }

# Prediction Route
@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    try:

        # Validate image file
        if not file.content_type.startswith("image/"):

            return {
                "error": "Only image files are allowed"
            }

        # Read uploaded image
        contents = await file.read()

        # Predict image
        result = predict_image(contents)

        # Save prediction to MongoDB
        prediction_collection.insert_one({

            "filename": file.filename,

            "prediction": result["prediction"],

            "confidence": result["confidence"],

            "created_at": datetime.utcnow()
        })

        # Return response
        return result

    except Exception as e:

        return {
            "error": str(e)
        }