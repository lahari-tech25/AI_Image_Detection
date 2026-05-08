from pymongo import MongoClient

from dotenv import load_dotenv

import os

# Load environment variables
load_dotenv()

# Get MongoDB URL
MONGO_URL = os.getenv("MONGO_URL")

# Create MongoDB client
client = MongoClient(MONGO_URL)

# Database
db = client["ai_image_detection"]

# Collections
prediction_collection = db["predictions"]

user_collection = db["users"]