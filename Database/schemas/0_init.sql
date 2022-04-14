--------------------------------------------------------------------------------
-- General init
CREATE USER backend WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE ostchat TO admin;

ALTER DATABASE ostchat SET log_statement = 'mod';