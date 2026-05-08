from fastapi import APIRouter

from app.database import user_collection

from app.schemas.userSchema import UserRegister, UserLogin

import bcrypt

router = APIRouter()

@router.post("/register")
async def register(user: UserRegister):

    existing_user = user_collection.find_one({
        "email": user.email
    })

    if existing_user:
        return {
            "message": "User already exists"
        }

    hashed_password = bcrypt.hashpw(
        user.password.encode("utf-8"),
        bcrypt.gensalt()
    )

    new_user = {
        "name": user.name,
        "email": user.email,
        "password": hashed_password,
        "role": user.role
    }

    user_collection.insert_one(new_user)

    return {
        "message": "User registered successfully"
    }

@router.post("/login")
async def login(user: UserLogin):

    existing_user = user_collection.find_one({
        "email": user.email
    })

    if not existing_user:
        return {
            "message": "User not found"
        }

    valid_password = bcrypt.checkpw(
        user.password.encode("utf-8"),
        existing_user["password"]
    )

    if not valid_password:
        return {
            "message": "Invalid password"
        }

    return {
    "message": "Login successful",
    "name": existing_user["name"],
    "email": existing_user["email"],
    "role": existing_user["role"]
}