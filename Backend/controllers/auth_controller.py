from flask import Blueprint, request, jsonify, session
from models.database import get_db_connection
from utils.hash_util import hash_password, check_password

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    cursor = conn.cursor()

    try:
        cursor.execute('SELECT * FROM users WHERE username = %s', (username,))
        user = cursor.fetchone()

        if user and check_password(user['password'], password):
            session['user_id'] = user['id'] 
            return jsonify({'message': 'Logged in Successfully'}), 200
        return jsonify({'error': 'Invalid credentials'}), 401
    except:
        return jsonify({'error': 'Login failed'}), 500
    finally:
        cursor.close()
        conn.close()

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    username = data.get('username')
    password = data.get('password')

    hashed_password = hash_password(password)

    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    cursor = conn.cursor()

    try:
        cursor.execute(
            'INSERT INTO users (name, username, password) VALUES (%s, %s, %s)',
            (name, username, hashed_password)
        )
        conn.commit()
        return jsonify({'message': 'Registered successfully'}), 200
    except:
        return jsonify({'error': 'Registration failed'}), 500
    finally:
        cursor.close()
        conn.close()
