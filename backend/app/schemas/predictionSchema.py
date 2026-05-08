from pydantic import BaseModel

class PredictionSchema(BaseModel):

    filename: str

    prediction: str

    confidence: float