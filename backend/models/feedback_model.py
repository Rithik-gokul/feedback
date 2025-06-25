# feedback_model.py
# Placeholder for feedback DB access functions

from flask import current_app
from bson.objectid import ObjectId

def insert_feedback(feedback):
    return current_app.mongo.db.feedback.insert_one(feedback)

def get_feedback_by_employee(employee_id):
    feedbacks = list(current_app.mongo.db.feedback.find({'employee_id': employee_id}))
    return feedbacks

def update_feedback(feedback_id, update_fields):
    return current_app.mongo.db.feedback.update_one({'_id': ObjectId(feedback_id)}, {'$set': update_fields})

def acknowledge_feedback(feedback_id):
    return current_app.mongo.db.feedback.update_one({'_id': ObjectId(feedback_id)}, {'$set': {'acknowledged': True}})