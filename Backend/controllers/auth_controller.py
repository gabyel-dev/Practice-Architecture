from flask import Blueprint, request, jsonify, session
from models.database import get_db_connection
from utils.hash_util import hash_password, check_password
import re

auth_bp = Blueprint('auth', __name__)

# =================================
# Password Validation Configuration
# =================================
PASSWORD_REGEX = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$"

def validatePassword(password):
    return re.match(PASSWORD_REGEX, password)

# =================================
# Birth Validation Configuration
# =================================
def isValidMonth(month):
    fullMonths = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]
    
    return month.strip().capitalize() in fullMonths

# ==============================
# User Authentication - Login
# ==============================
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute('SELECT * FROM NPC WHERE email = %s', (email,))
        user = cursor.fetchone()
        
        if not user:
            return jsonify({'message': 'There is no such user'}), 404

        if user and check_password(user["password"], password):
            session["user"] = {"email": email, "id": user['id']} 
            return jsonify({'message': 'Login successful', 'redirect': "/dashboard"}), 200
        else:
            return jsonify({'error': 'Invalid username or password', 'redirect': '/'}), 401

    except Exception as e:
        return jsonify({'error': f'Login failed: {str(e)}'}), 500
    finally:
        cursor.close()
        conn.close()

# ==============================
# User Registration
# ==============================
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    fname = data.get('first_name')
    lname = data.get('last_name')
    birthday = data.get('birthday')  # Expecting "YYYY-MM-DD"
    email = data.get('email')
    password = data.get('password')

    # Validate that all required fields exist
    if not all([fname, lname, birthday, email, password]):
        return jsonify({"error": "All fields are required"}), 400

    # Split the birthday into year, month, and day
    try:
        b_year, b_month, b_day = birthday.split("-")
        b_day = int(b_day)
        b_year = int(b_year)
    except ValueError:
        return jsonify({"error": "Invalid birthday format"}), 400

    # Convert numeric month to full month name (January, February, etc.)
    MONTHS = ["January", "February", "March", "April", "May", "June", 
              "July", "August", "September", "October", "November", "December"]
    
    try:
        b_month = MONTHS[int(b_month) - 1]  # Convert "01" -> "January"
    except (IndexError, ValueError):
        return jsonify({"error": "Invalid month"}), 400

    # Validate birthday
    if not (1 <= b_day <= 31 and 1900 <= b_year <= 2025):
        return jsonify({'error': 'Invalid birthday'}), 400

    # Hash password
    if not validatePassword(password):
        return jsonify({"error": "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, and a number or special character."}), 400

    hashed_password = hash_password(password)

    # Connect to database
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    cursor = conn.cursor()

    try:
        cursor.execute(
            'INSERT INTO NPC (first_name, last_name, email, password, b_month, b_day, b_year) VALUES (%s, %s, %s, %s, %s, %s, %s)',
            (fname, lname, email, hashed_password, b_month, b_day, b_year)
        )
        conn.commit()

        return jsonify({'message': 'Registration successful'}), 200

    except Exception as e:
        return jsonify({'error': f'Registration failed: {str(e)}'}), 500

    finally:
        cursor.close()
        conn.close()

# ==============================
# Forgot Password
# ==============================
@auth_bp.route('/forgot_password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    newPassword = data.get('newPassword')
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('SELECT * FROM NPC WHERE email = %s', (email,))
        user = cursor.fetchone()
        
        if user and check_password(user['password'], password):
            hashed_password = hash_password(newPassword)
            cursor.execute('UPDATE NPC SET password = %s WHERE email = %s', (hashed_password, email,))
            conn.commit()
            return jsonify({'message': 'Password successfully changed'})
    except:
        return jsonify({'message': 'Password change failed'})

# ==============================
# User Session Check
# ==============================
@auth_bp.route('/user')
def user():
    if "user" in session:
        return jsonify({'user': session["user"], 'logged_in': True, 'redirect': '/rdc?=dashboard'}), 200
    return jsonify({'user': None, 'logged_in': False, 'redirect': '/rdc?=login'}), 200

# ==============================
# Dashboard Access
# ==============================
@auth_bp.route('/dashboard')
def dashboard():
    if "user" not in session:
        return jsonify({'message': 'Session expired', 'redirect': '/'}), 403
    return jsonify({'message': 'Welcome to the Dashboard', 'user': session['user']}), 200

# ==============================
# Logout function
# ==============================
@auth_bp.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'Logout successful', 'redirect': '/'})
