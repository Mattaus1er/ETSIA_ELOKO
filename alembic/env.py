import sys
from os.path import abspath, dirname
from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

# 1. Ajout du chemin du projet pour qu'Alembic trouve le dossier 'app'
# On remonte d'un cran par rapport au dossier 'alembic/'
sys.path.insert(0, dirname(dirname(abspath(__file__))))

# 2. IMPORT DE VOS MODÈLES
# On importe la Base qui contient votre MLD
try:
    from app.models import Base
except ImportError:
    # Si app.models ne marche pas, on essaie l'import direct selon votre structure
    from app.models.models import Base

# 3. CONFIGURATION DES MÉTADONNÉES
# C'est la ligne que réclame l'erreur ERROR [alembic.util.messaging]
target_metadata = Base.metadata

# --- Le reste est le code standard d'Alembic ---
config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(
            connection=connection, 
            target_metadata=target_metadata
        )
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()