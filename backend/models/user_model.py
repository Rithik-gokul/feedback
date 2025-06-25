from flask import current_app
from bson.objectid import ObjectId

def get_user_by_username(username):
    return current_app.mongo.db.users.find_one({'username': username})

def get_user_by_id(user_id):
    return current_app.mongo.db.users.find_one({'_id': ObjectId(user_id)})

def insert_user(user):
    return current_app.mongo.db.users.insert_one(user)