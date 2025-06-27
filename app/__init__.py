import os
import re
from flask import Flask, request, redirect
from flask_cors import CORS
from flask_migrate import Migrate
from flask_wtf.csrf import CSRFProtect, generate_csrf
from flask_login import LoginManager
from .models import db, User
from .api.user_routes import user_routes
from .api.expense_routes import expense_routes
from .api.group_routes import group_routes
from .api.auth_routes import auth_routes
from .api.comments_routes import comments_routes
from .api.friend_routes import friends_routes
from .seeds import seed_commands
from .config import DevelopmentConfig, ProductionConfig

app = Flask(__name__)
csrf = CSRFProtect(app)

# Load environment-specific config
if os.getenv("FLASK_ENV") == "production":
    app.config.from_object(ProductionConfig)
else:
    app.config.from_object(DevelopmentConfig)

# Initialize extensions
db.init_app(app)
Migrate(app, db)

# CORS 
CORS(app, origins=[
    "http://localhost:3000",
    "https://splito.onrender.com",
    re.compile(r"^https:\/\/split-[a-zA-Z0-9\-]+\.vercel\.app$"),
], supports_credentials=True)

def allow_vercel_origin(origin):
    return origin and (
        origin.startswith("https://split-") and origin.endswith(".vercel.app")
    )

CORS(app, origins=allow_vercel_origin, supports_credentials=True)
# Login manager setup
login = LoginManager(app)
login.init_app(app)
login.login_view = 'auth.unauthorized'

@login.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# CLI seed commands
app.cli.add_command(seed_commands)

# Register Blueprints
app.register_blueprint(user_routes, url_prefix='/api/users')
app.register_blueprint(auth_routes, url_prefix='/api/auth')
app.register_blueprint(expense_routes, url_prefix='/api/expenses')
app.register_blueprint(friends_routes, url_prefix='/api/friends')
app.register_blueprint(group_routes, url_prefix='/api/groups')
app.register_blueprint(comments_routes, url_prefix='/api')

# Force HTTPS in production
@app.before_request
def https_redirect():
    if os.getenv("FLASK_ENV") == "production":
        if request.headers.get("X-Forwarded-Proto") == "http":
            url = request.url.replace("http://", "https://", 1)
            return redirect(url, code=301)
def log_origin():
    print("Origin:", request.headers.get("Origin"))
    
# Set CSRF token cookie on every response
@app.after_request
def inject_csrf_token(response):
    response.set_cookie(
        "csrf_token",
        generate_csrf(),
        secure=os.getenv("FLASK_ENV") == "production",
        samesite="None" if os.getenv("FLASK_ENV") == "production" else None,
        httponly=True
    )
    return response

@app.route("/api/docs")
def api_help():
    """
    Returns all API routes and their doc strings
    """
    acceptable_methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    route_list = {
        rule.rule: [
            [method for method in rule.methods if method in acceptable_methods],
            app.view_functions[rule.endpoint].__doc__
        ]
        for rule in app.url_map.iter_rules()
        if rule.endpoint != 'static'
    }
    return route_list
    
@app.route("/health")
def health():
    return {"status": "ok"}, 200
