from flask import Blueprint, request, jsonify
from flask_login import login_user, logout_user, current_user, login_required
from flask_wtf.csrf import generate_csrf

from app.models import db, User
from app.forms import LoginForm, SignUpForm

auth_routes = Blueprint('auth', __name__)


def validation_errors_to_error_messages(validation_errors):
    """
    Convert WTForm validation errors to a list of strings.
    """
    error_messages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            error_messages.append(f"{field} : {error}")
    return error_messages


@auth_routes.route('/csrf-token', methods=['GET'])
def get_csrf_token():
    """
    Provide CSRF token to frontend.
    """
    csrf = generate_csrf()
    print("✅ CSRF token generated:", csrf)
    return jsonify({'csrf_token': csrf}), 200


@auth_routes.route('/', methods=['GET'])
def authenticate():
    """
    Check if user is authenticated.
    """
    try:
        if current_user.is_authenticated:
            print("✅ Authenticated user:", current_user.email)
            return jsonify(current_user.to_dict()), 200
        else:
            print("❌ No user logged in")
            return jsonify({'errors': ['Unauthorized']}), 401
    except Exception as e:
        print("🔥 Error in auth check:", str(e))
        return jsonify({'errors': ['Internal server error']}), 500


@auth_routes.route('/login', methods=['POST'])
def login():
    """
    Log in a user with email and password.
    """
    form = LoginForm()
    form['csrf_token'].data = request.cookies.get('csrf_token')
    print("🔐 Login attempt for:", request.json.get('email'))

    if form.validate_on_submit():
        user = User.query.filter_by(email=form.data['email']).first()
        if user and user.check_password(form.data['password']):
            login_user(user)
            print("✅ Login successful:", user.email)
            return jsonify(user.to_dict()), 200
        else:
            print("❌ Invalid credentials")
            return jsonify({'errors': ['Invalid credentials']}), 401
    else:
        print("❌ Form validation failed:", form.errors)
        return jsonify({'errors': validation_errors_to_error_messages(form.errors)}), 400


@auth_routes.route('/logout', methods=['POST'])
@login_required
def logout():
    """
    Log out the current user.
    """
    try:
        print("👋 Logging out user:", current_user.email)
        logout_user()
        return jsonify({'message': 'User logged out successfully'}), 200
    except Exception as e:
        print("🔥 Error in logout:", str(e))
        return jsonify({'errors': ['Logout failed']}), 500


@auth_routes.route('/signup', methods=['POST'])
def sign_up():
    """
    Register and log in a new user.
    """
    form = SignUpForm()
    form['csrf_token'].data = request.cookies.get('csrf_token')
    print("📝 Signup attempt for:", request.json.get('email'))

    if form.validate_on_submit():
        user = User(
            username=form.data['username'],
            email=form.data['email'],
            password=form.data['password'],
            first_name=form.data['firstName'],
            last_name=form.data['lastName'],
            nickname=form.data['nickname']
        )
        db.session.add(user)
        db.session.commit()
        login_user(user)
        print("✅ Signup successful:", user.email)
        return jsonify(user.to_dict()), 201
    else:
        print("❌ Signup form errors:", form.errors)
        return jsonify({'errors': validation_errors_to_error_messages(form.errors)}), 400


@auth_routes.route('/unauthorized', methods=['GET'])
def unauthorized():
    """
    Return a consistent error if user is unauthorized.
    """
    print("❌ Unauthorized access attempt")
    return jsonify({'errors': ['Unauthorized']}), 401
