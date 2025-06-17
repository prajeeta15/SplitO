from __future__ import with_statement
import os
import logging
from logging.config import fileConfig

from flask import current_app
from sqlalchemy import engine_from_config, pool
from alembic import context

# Environment Variables
environment = os.getenv("FLASK_ENV", "development")
SCHEMA = os.getenv("SCHEMA", "public")
DATABASE_URL = os.getenv("DATABASE_URL")

# Alembic Config
config = context.config
fileConfig(config.config_file_name)
logger = logging.getLogger("alembic.env")

# Override SQLAlchemy URL from environment variable (PostgreSQL)
if DATABASE_URL:
    config.set_main_option("sqlalchemy.url", DATABASE_URL)
else:
    config.set_main_option(
        "sqlalchemy.url",
        str(current_app.extensions["migrate"].db.get_engine().url).replace(
            "%", "%%")
    )

# Metadata
target_metadata = current_app.extensions["migrate"].db.metadata


def run_migrations_offline():
    """Run migrations in offline mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url, target_metadata=target_metadata, literal_binds=True
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    """Run migrations in online mode."""

    def process_revision_directives(context, revision, directives):
        if getattr(config.cmd_opts, "autogenerate", False):
            script = directives[0]
            if script.upgrade_ops.is_empty():
                directives[:] = []
                logger.info("No changes in schema detected.")

    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            process_revision_directives=process_revision_directives,
            **current_app.extensions["migrate"].configure_args
        )

        # PostgreSQL-specific: Set schema if in production
        if environment == "production":
            connection.execute(f"CREATE SCHEMA IF NOT EXISTS {SCHEMA}")

        with context.begin_transaction():
            if environment == "production":
                context.execute(f"SET search_path TO {SCHEMA}")
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
