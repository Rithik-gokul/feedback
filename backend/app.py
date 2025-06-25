from flask import Flask, jsonify
from flask_pymongo import PyMongo
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()
app = Flask(__name__)
CORS(app, origins=["https://feedback-dashboard-71id.onrender.com"])

# Config
app.config['MONGO_URI'] = os.getenv("MONGO_URI")
app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY")

mongo = PyMongo(app)
app.mongo = mongo
jwt = JWTManager(app)

from controllers.auth_controller import auth_bp
from controllers.user_controller import user_bp
from controllers.feedback_controller import feedback_bp
from controllers.dashboard_controller import dashboard_bp
app.register_blueprint(auth_bp)
app.register_blueprint(user_bp)
app.register_blueprint(feedback_bp)
app.register_blueprint(dashboard_bp)

@app.route('/')
def index():
    return jsonify({'msg': 'Feedback Portal API running'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)