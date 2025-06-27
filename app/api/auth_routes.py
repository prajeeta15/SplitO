from flask import Blueprint, request, jsonify, session
from app.models import User, db
from app.forms import LoginForm, SignUpForm
from flask_login import login_user, logout_user, current_user, login_required
from flask_wtf.csrf import generate_csrf

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


@auth_routes.route('/')
def authenticate():
    """
    If user is authenticated, return user dict, else error.
    """
    if current_user.is_authenticated:
        return current_user.to_dict()
    return {'errors': ['Unauthorized']}, 401


@auth_routes.route('/login', methods=['POST'])
def login():
    """
    Logs in a user.
    """
    form = LoginForm()
    form['csrf_token'].data = request.cookies.get('csrf_token')

    if form.validate_on_submit():
        user = User.query.filter_by(email=form.data['email']).first()
        if user:
            login_user(user)
            return user.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 400


@auth_routes.route('/logout', methods=['POST'])
@login_required
def logout():
    """
    Logs out the current user.
    """
    logout_user()
    return {'message': 'User logged out successfully'}, 200


@auth_routes.route('/signup', methods=['POST'])
def sign_up():
    """
    Signs up a new user and logs them in.
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
        return user.to_dict(), 201
    return {'errors': validation_errors_to_error_messages(form.errors)}, 400


@auth_routes.route('/unauthorized')
def unauthorized():
    """
    Returns unauthorized JSON if login required.
    """
    return {'errors': ['Unauthorized']}, 401


@auth_routes.route('/csrf-token', methods=['GET'])
def csrf_token():
    """
    Provides a CSRF token for the frontend.
    """
    return jsonify({'csrf_token': generate_csrf()})
