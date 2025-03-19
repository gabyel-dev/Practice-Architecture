import os
import tempfile
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "default-secret-key")
    SESSION_TYPE = "filesystem"
    SESSION_PERMANENT = True
    SESSION_USE_SIGNER = True
    SESSION_KEY_PREFIX = "flask_session:"
    SESSION_FILE_DIR = tempfile.gettempdir()  # Stores session files in /tmp
    SESSION_COOKIE_NAME = "flask_session"
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = "None"  # Change to "Lax" if cross-site isn't needed
    SESSION_COOKIE_SECURE = os.getenv("FLASK_ENV") == "production"  # Secure only in production
