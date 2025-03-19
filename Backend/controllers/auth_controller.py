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
    return bool(re.match(PASSWORD_REGEX, password))

# =================================
# Birth Validation Configuration
# =================================
FULL_MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
]

def isValidMonth(month):
    return month.strip().capitalize() in FULL_MONTHS

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
            return jsonify({'error': 'Invalid email or password'}), 401
        
        stored_hashed_password = user["password"]  # Ensure this is correct
        if not check_password(stored_hashed_password, password):
            print("Password check failed!")  # Debugging
            return jsonify({'error': 'Invalid email or password'}), 401

        session["user"] = {"email": email, "id": user["id"]}
        return jsonify({'message': 'Login successful', 'redirect': "/dashboard"}), 200
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
    fname, lname, birthday, email, password = data.get('first_name'), data.get('last_name'), data.get('birthday'), data.get('email'), data.get('password')
    
    if not all([fname, lname, birthday, email, password]):
        return jsonify({"error": "All fields are required"}), 400
    
    try:
        b_year, b_month, b_day = map(int, birthday.split("-"))
        b_month = FULL_MONTHS[b_month - 1]
    except (ValueError, IndexError):
        return jsonify({"error": "Invalid birthday format"}), 400

    if not (1 <= b_day <= 31 and 1900 <= b_year <= 2025):
        return jsonify({'error': 'Invalid birthday'}), 400

    if not validatePassword(password):
        return jsonify({"error": "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, and a number or special character."}), 400

    hashed_password = hash_password(password)
    conn = get_db_connection()
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
    email, password, new_password = data.get('email'), data.get('password'), data.get('newPassword')

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('SELECT password FROM NPC WHERE email = %s', (email,))
        user = cursor.fetchone()
        if not user or not check_password(user['password'], password):
            return jsonify({'error': 'Invalid email or password'}), 401

        hashed_password = hash_password(new_password)
        cursor.execute('UPDATE NPC SET password = %s WHERE email = %s', (hashed_password, email))
        conn.commit()
        return jsonify({'message': 'Password successfully changed'}), 200
    except Exception as e:
        return jsonify({'error': f'Password change failed: {str(e)}'}), 500
    finally:
        cursor.close()
        conn.close()

# ==============================
# User Session Check
# ==============================
@auth_bp.route('/user')
def user():
    return jsonify({'user': session.get("user"), 'logged_in': "user" in session, 'redirect': '/dashboard' if "user" in session else '/'}), 200

# ==============================
# Logout function
# ==============================
@auth_bp.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'Logout successful', 'redirect': '/'}), 200

# ==============================
# Search Users
# ==============================
@auth_bp.route('/search', methods=['GET'])
def search():
    query = request.args.get('query', '').strip()
    print("Received query:", query)  # Debugging

    if not query:
        return jsonify({"users": []})

    conn = get_db_connection()
    cursor = conn.cursor()  # Use RealDictCursor

    try:
        cursor.execute(
            "SELECT id, first_name, last_name FROM NPC WHERE first_name ILIKE %s OR last_name ILIKE %s",
            (f"%{query}%", f"%{query}%")
        )
        users = cursor.fetchall()
        print("Users found:", users)  # Debugging

        return jsonify({"users": users})  # Directly return the dictionary list

    except Exception as e:
        print("Search error:", e)  # Debugging
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()


# ==============================
# Fetch User by ID
# ==============================
@auth_bp.route('/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    print("Fetching user with ID:", user_id)  # Debugging

    conn = get_db_connection()
    cursor = conn.cursor()  # Ensure RealDictCursor is used

    try:
        cursor.execute("SELECT id, first_name, last_name, email FROM NPC WHERE id = %s", (user_id,))
        user = cursor.fetchone()
        print("User found:", user)  # Debugging

        if user is None:
            return jsonify({"error": "User not found"}), 404

        return jsonify(user)

    except Exception as e:
        print("User fetch error:", e)  # Debugging
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()


# ==============================
# CREATE POSTS
# ==============================
@auth_bp.route('/post', methods=['POST'])
def create_post():
    data = request.json
    user_id = data.get("user_id")
    content = data.get("content")
    
    conn = get_db_connection()
    cursor = conn.cursor()

    if not user_id or not content:
        return jsonify({"error": "user_id and content are required"}), 400

    try:
        cursor.execute(
            "INSERT INTO posts (user_id, content) VALUES (%s, %s) RETURNING id, user_id, content, created_at",
            (user_id, content),
        )
        new_post = cursor.fetchone()
        conn.commit()
        return jsonify({"message": "Post created successfully", "post": new_post}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
        
# ==============================
# ==============================
# GET POSTS
# ==============================
@auth_bp.route('/posts', methods=['GET'])
def get_posts():
    conn = get_db_connection()
    cursor = conn.cursor()  # Use RealDictCursor

    try:
        cursor.execute('''
            SELECT posts.id, NPC.first_name, NPC.last_name, posts.content, posts.created_at
            FROM posts
            JOIN NPC ON posts.user_id = NPC.id
            ORDER BY posts.created_at DESC
        ''')
        posts = cursor.fetchall()

        # Ensuring proper datetime format
        for post in posts:
            if post['created_at']:
                post['created_at'] = post['created_at'].isoformat()

        return jsonify(posts), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()






        
        
# ==============================
# GET USER_POSTS
# ==============================
@auth_bp.route('/user_posts/<int:id>', methods=['GET'])
def get_user_posts(id):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Debugging: Print user ID before executing query
        print(f"Fetching posts for user ID: {id}") 

        # Ensure id is properly passed to the query
        cursor.execute('SELECT * FROM posts WHERE user_id = %s ORDER BY created_at DESC', (id,))
        posts = cursor.fetchall()

        # Debugging: Print fetched posts
        print(f"Fetched posts: {posts}") 

        return jsonify(posts)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

    
# ==============================
# DELETE POSTS
# ==============================
@auth_bp.route('/posts/<int:post_id>', methods=['DELETE'])
def del_post(post_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Check if post exists
        cursor.execute("SELECT * FROM posts WHERE id = %s", (post_id,))
        post = cursor.fetchone()

        if not post:
            return jsonify({"error": "Post not found"}), 404

        # Delete the post
        cursor.execute("DELETE FROM posts WHERE id = %s", (post_id,))
        conn.commit()

        return jsonify({"message": "Post deleted successfully", "post_id": post_id}), 200
    except Exception as e:
        print(f"Error deleting post {post_id}: {str(e)}")  # Debugging log
        return jsonify({"error": "An error occurred while deleting the post"}), 500
    finally:
        cursor.close()
        conn.close()


