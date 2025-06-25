from werkzeug.security import generate_password_hash, check_password_hash

def user_schema(username, password, role, team=None):
    return {
        'username': username,
        'password': generate_password_hash(password),
        'role': role,  # 'manager' or 'employee'
        'team': team or [],
    }

def verify_password(stored_hash, password):
    return check_password_hash(stored_hash, password) 