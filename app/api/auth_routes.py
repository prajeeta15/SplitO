from flask import Blueprint, request, jsonify
from flask_login import login_user, logout_user, current_user, login_required
from flask_wtf.csrf import generate_csrf

from app.models import db, User
from app.forms import LoginForm, SignUpForm

auth_routes = Blueprint('auth', __name__)


def validation_errors_to_error_messages(validation_errors):
    """
    Turns WTForms validation errors into a simple list.
    """
    error_messages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            error_messages.append(f'{field} : {error}')
    return error_messages


@auth_routes.route('/csrf-token', methods=['GET'])
def get_csrf_token():
    """
    Provides a CSRF token to frontend.
    """
    return jsonify({'csrf_token': generate_csrf()}), 200


@auth_routes.route('/', methods=['GET'])
def authenticate():
    """
    Verifies if a user is logged in.
    """
    if current_user.is_authenticated:
        return jsonify(current_user.to_dict()), 200
    return jsonify({'errors': ['Unauthorized']}), 401


@auth_routes.route('/login', methods=['POST'])
def login():
    """
    Logs in a user using email & password.
    """
    form = LoginForm()
    form['csrf_token'].data = request.cookies.get('csrf_token')

    if form.validate_on_submit():
        user = User.query.filter_by(email=form.data['email']).first()
        if user and user.check_password(form.data['password']):
            login_user(user)
            return jsonify(user.to_dict()), 200
        return jsonify({'errors': ['Invalid credentials']}), 401

    return jsonify({'errors': validation_errors_to_error_messages(form.errors)}), 400


@auth_routes.route('/logout', methods=['POST'])
@login_required
def logout():
    """
    Logs out the current user.
    """
    logout_user()
    return jsonify({'message': 'User logged out successfully'}), 200


@auth_routes.route('/signup', methods=['POST'])
def sign_up():
    """
    Registers and logs in a new user.
    """
    form = SignUpForm()
    form['csrf_token'].data = request.cookies.get('csrf_token')

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
        return jsonify(user.to_dict()), 201

    return jsonify({'errors': validation_errors_to_error_messages(form.errors)}), 400


@auth_routes.route('/unauthorized', methods=['GET'])
def unauthorized():
    """
    Returns 401 if a protected route is accessed without login.
    """
    return jsonify({'errors': ['Unauthorized']}), 401
