from flask import Blueprint, request, jsonify
from flask_login import login_user, logout_user, current_user, login_required
from flask_wtf.csrf import generate_csrf

from app.models import db, User
from app.forms import LoginForm, SignUpForm

auth_routes = Blueprint('auth', __name__)


def validation_errors_to_error_messages(validation_errors):
    error_messages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            error_messages.append(f'{field} : {error}')
    return error_messages


@auth_routes.route('/csrf-token', methods=['GET'])
def get_csrf_token():
    print("🔐 CSRF token requested")
    return jsonify({'csrf_token': generate_csrf()}), 200


@auth_routes.route('/', methods=['GET'])
def authenticate():
    print("🔍 Checking user authentication...")
    try:
        if current_user.is_authenticated:
            print(f"✅ Authenticated as: {current_user.username}")
            return jsonify(current_user.to_dict()), 200
        else:
            print("❌ Not authenticated")
            return jsonify({'errors': ['Unauthorized']}), 401
    except Exception as e:
        print(f"🔥 Error during authentication check: {str(e)}")
        return jsonify({'errors': ['Internal server error']}), 500


@auth_routes.route('/login', methods=['POST'])
def login():
    print("🔐 Login attempt started")
    form = LoginForm()
    csrf_token = request.cookies.get('csrf_token')
    print(f"📦 CSRF Token from cookies: {csrf_token}")
    form['csrf_token'].data = csrf_token

    if form.validate_on_submit():
        print("✅ Form validation passed")
        user = User.query.filter_by(email=form.data['email']).first()
        if user:
            print(f"🔍 User found: {user.email}")
            if user.check_password(form.data['password']):
                print("🔐 Password matched. Logging in...")
                login_user(user)
                return jsonify(user.to_dict()), 200
            else:
                print("❌ Password mismatch")
        else:
            print("❌ No user with that email")
        return jsonify({'errors': ['Invalid credentials']}), 401
    else:
        print(f"❌ Form validation errors: {form.errors}")
    return jsonify({'errors': validation_errors_to_error_messages(form.errors)}), 400


@auth_routes.route('/logout', methods=['POST'])
@login_required
def logout():
    print(f"🔓 Logging out user: {current_user.username}")
    logout_user()
    return jsonify({'message': 'User logged out successfully'}), 200


@auth_routes.route('/signup', methods=['POST'])
def sign_up():
    print("📝 Sign-up attempt started")
    form = SignUpForm()
    csrf_token = request.cookies.get('csrf_token')
    print(f"📦 CSRF Token from cookies: {csrf_token}")
    form['csrf_token'].data = csrf_token

    if form.validate_on_submit():
        print("✅ Signup form validated")
        try:
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
            print(f"🆕 New user created: {user.email}")
            login_user(user)
            return jsonify(user.to_dict()), 201
        except Exception as e:
            print(f"🔥 Error during signup: {str(e)}")
            return jsonify({'errors': ['Signup failed due to server error']}), 500
    else:
        print(f"❌ Signup validation failed: {form.errors}")
    return jsonify({'errors': validation_errors_to_error_messages(form.errors)}), 400


@auth_routes.route('/unauthorized', methods=['GET'])
def unauthorized():
    print("🔒 Unauthorized access attempt")
    return jsonify({'errors': ['Unauthorized']}), 401
