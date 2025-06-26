import os


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = os.environ.get('SQLALCHEMY_ECHO', 'False').lower() == 'true'

    db_url = os.environ.get('DATABASE_URL')

    if db_url:
        # Convert postgres:// to postgresql:// for SQLAlchemy compatibility
        db_url = db_url.replace('postgres://', 'postgresql://')
        SQLALCHEMY_DATABASE_URI = db_url
    else:
        # Default fallback for local SQLite dev (optional)
        SQLALCHEMY_DATABASE_URI = 'sqlite:///local.db'


class DevelopmentConfig(Config):
    FLASK_ENV = 'development'
    DEBUG = True
    SQLALCHEMY_ECHO = True


class ProductionConfig(Config):
    FLASK_ENV = 'production'
    DEBUG = False
    SQLALCHEMY_ECHO = False
