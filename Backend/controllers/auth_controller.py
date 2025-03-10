from flask import Blueprint, request, jsonify, session
from models.database import get_db_connection
from utils.hash_util import hash_password, check_password
import re

auth_bp = Blueprint('auth', __name__)
#
# 
# password validation
PASSWORD_REGEX = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$"

def validatePassword(password):
    return re.match(PASSWORD_REGEX, password)


#==========
# login
#==========
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
            session["user"] = {"username": username} 
            session["user"] = {"id": user['id']}
            return jsonify({'message': 'Logged in Successfully', 'redirect': "/dashboard"}), 200
        else:
            return jsonify({'error': 'Invalid username or password', 'redirect': '/login'}), 401

    except Exception as e:
        return jsonify({'error': f'Login failed: {str(e)}'}), 500
    finally:
        cursor.close()
        conn.close()

#
#
# register
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
    
    if not name or not username or not password:
        return jsonify({"error": "All fields are required"}), 400

    if not validatePassword(password):
        return jsonify({"error": "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, and a number or special character."}), 400

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


#
#
# check user if in session
@auth_bp.route('/user')
def user():
    if "user" in session:
        return jsonify({'user': session["user"], 'logged_in': True, 'redirect': '/dashboard'}), 200
    return jsonify({'user': None, 'logged_in': False, 'redirect': '/login'}), 200

@auth_bp.route('/dashboard')
def dashboard():
    if "user" not in session:
        return jsonify({'message': 'Session expired', 'redirect': '/login'}), 403
    return jsonify({'message': 'Welcome to the Dashboard', 'user': session['user']}), 200

#
#
# logout
@auth_bp.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'logout successful', 'redirect': '/login'})