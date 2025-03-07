"""Initial schema setup

Revision ID: 001_initial_schema
Revises: 
Create Date: 2024-03-06 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001_initial_schema'
down_revision = None
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Create schemas
    op.execute('CREATE SCHEMA IF NOT EXISTS auth')
    op.execute('CREATE SCHEMA IF NOT EXISTS core')
    op.execute('CREATE SCHEMA IF NOT EXISTS ai')
    
    # Create user types enum
    op.execute("CREATE TYPE user_role AS ENUM ('user_freelancer', 'user_client', 'admin', 'superadmin')")
    
    # Create users table in auth schema
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(), server_default=sa.text('gen_random_uuid()'), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('hashed_password', sa.String(), nullable=True),
        sa.Column('full_name', sa.String(), nullable=False),
        sa.Column('role', sa.Enum('user_freelancer', 'user_client', 'admin', 'superadmin', name='user_role'), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('is_verified', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email'),
        schema='auth'
    )
    
    # Create OAuth related tables
    op.create_table(
        'oauth_accounts',
        sa.Column('id', postgresql.UUID(), server_default=sa.text('gen_random_uuid()'), nullable=False),
        sa.Column('user_id', postgresql.UUID(), nullable=False),
        sa.Column('oauth_provider', sa.String(), nullable=False),
        sa.Column('oauth_id', sa.String(), nullable=False),
        sa.Column('access_token', sa.String(), nullable=True),
        sa.Column('refresh_token', sa.String(), nullable=True),
        sa.Column('expires_at', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['auth.users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('oauth_provider', 'oauth_id'),
        schema='auth'
    )
    
    # Create core tables
    op.create_table(
        'jobs',
        sa.Column('id', postgresql.UUID(), server_default=sa.text('gen_random_uuid()'), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('budget', sa.Numeric(10, 2), nullable=False),
        sa.Column('client_id', postgresql.UUID(), nullable=False),
        sa.Column('status', sa.String(), nullable=False, server_default='open'),
        sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['client_id'], ['auth.users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        schema='core'
    )
    
    # Create AI/ML related tables
    op.create_table(
        'embeddings',
        sa.Column('id', postgresql.UUID(), server_default=sa.text('gen_random_uuid()'), nullable=False),
        sa.Column('entity_type', sa.String(), nullable=False),
        sa.Column('entity_id', postgresql.UUID(), nullable=False),
        sa.Column('embedding', postgresql.ARRAY(sa.Float()), nullable=False),
        sa.Column('embedding_model', sa.String(), nullable=False),
        sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        schema='ai'
    )
    
    # Create indexes
    op.create_index('idx_users_email', 'users', ['email'], unique=True, schema='auth')
    op.create_index('idx_jobs_client', 'jobs', ['client_id'], schema='core')
    op.create_index('idx_embeddings_entity', 'embeddings', ['entity_type', 'entity_id'], schema='ai')

def downgrade() -> None:
    # Drop tables
    op.drop_table('embeddings', schema='ai')
    op.drop_table('jobs', schema='core')
    op.drop_table('oauth_accounts', schema='auth')
    op.drop_table('users', schema='auth')
    
    # Drop enums
    op.execute('DROP TYPE user_role')
    
    # Drop schemas
    op.execute('DROP SCHEMA IF EXISTS ai')
    op.execute('DROP SCHEMA IF EXISTS core')
    op.execute('DROP SCHEMA IF EXISTS auth') 