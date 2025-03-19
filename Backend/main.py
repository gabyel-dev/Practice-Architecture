from flask import Flask
from flask_cors import CORS
from flask_session import Session
from config import Config
from controllers.auth_controller import auth_bp
from utils.hash_util import bcrypt

app = Flask(__name__)
app.config.from_object(Config)

CORS(app, supports_credentials=True)
Session(app)
bcrypt.init_app(app)

app.register_blueprint(auth_bp)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
