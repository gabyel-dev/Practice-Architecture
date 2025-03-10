from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()

# ========================
# hash users password
# ========================
def hash_password(password):
    return bcrypt.generate_password_hash(password, 12).decode('utf-8')

# ===========================
# check users hashed password
# ===========================
def check_password(hashed_password, plain_password):
    return bcrypt.check_password_hash(hashed_password, plain_password)
