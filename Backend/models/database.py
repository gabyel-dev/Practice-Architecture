import psycopg2
from psycopg2.extras import RealDictCursor
from config import Config

# ==============================
# Connect Database 
# ==============================
def get_db_connection():
    try:
        conn = psycopg2.connect(Config.DB_URL, cursor_factory=RealDictCursor)
        print('Database Connected')
        return conn
    except:
        print('Database Connection Failed')
        return None
    
