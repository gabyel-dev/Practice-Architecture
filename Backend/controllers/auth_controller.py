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
        cursor.execute('SELECT * FROM NPC WHERE username = %s', (username,))
        user = cursor.fetchone()

        if user and check_password(user['password'], password):
            session["user"] = {
                'name': user['name'],
                'username': user['username'],

            }
        redirect_url = "/dashboard"
        return jsonify({'message': 'Logged in Successfully', 'redirect': redirect_url}), 200

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
            'INSERT INTO NPC (name, username, password) VALUES (%s, %s, %s)',
            (name, username, hashed_password)
        )
        conn.commit()
        return jsonify({'message': 'Registered successfully'}), 200
    except:
        return jsonify({'error': 'Registration failed'}), 500
    finally:
        cursor.close()
        conn.close()

@auth_bp.route('/user')
def user():
    if "user" in session:
        return jsonify({'user': session["user"], 'logged_in': True}), 200
    return jsonify({'user': None, 'logged_in': False}), 200

@auth_bp.route('/dashboard')
def dashboard():
    if "user" not in session:
        return jsonify({'message': 'Session expired', 'redirect': '/login'}), 403
    return jsonify({'message': 'Welcome to the Dashboard', 'user': session['user']}), 200