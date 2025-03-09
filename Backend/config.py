import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY')
    SESSION_TYPE = 'filesystem'
    SESSION_PERMANENT = True
    SESSION_USE_SIGNER = True
    SESSION_KEY_PREFIX = 'flask_session:'
    SESSION_FILE_DIR = './flask_session_data'
    SESSION_COOKIE_NAME = 'flask_session'
    DB_URL = os.getenv('DB_URL')
