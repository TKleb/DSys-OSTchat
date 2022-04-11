-- General init
CREATE USER backend WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE ostchat TO admin;

-- Create Tables
CREATE TABLE users (
    user_id          INTEGER UNIQUE GENERATED ALWAYS AS IDENTITY,
    user_username    VARCHAR(255) UNIQUE NOT NULL
) TABLESPACE pg_default;

CREATE TABLE messages
(
    message_id              INTEGER UNIQUE GENERATED ALWAYS AS IDENTITY,
    message_sender_id       INT NOT NULL,
    message_content         VARCHAR(255) NOT NULL,
    message_timestamp       VARCHAR(255) NOT NULL,
    CONSTRAINT fk_sender
      FOREIGN KEY(message_sender_id)
      REFERENCES users(user_id)
) TABLESPACE pg_default;

-- Fetch User Function
CREATE OR REPLACE FUNCTION get_user(username VARCHAR)
    RETURNS TABLE (
        user_id         INT,
        user_username   VARCHAR
    )
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $$
    BEGIN
        RETURN QUERY
        SELECT users.user_id, users.user_username
        FROM users
        WHERE users.user_username = username;
    END
$$;

GRANT ALL ON FUNCTION get_user TO backend;

-- Add user Function
CREATE OR REPLACE FUNCTION add_user(username VARCHAR)
    RETURNS TABLE (
        user_id         INT,
        user_username   VARCHAR
    )
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $$
    BEGIN
        RETURN QUERY
        INSERT INTO
            users(user_username)
        VALUES (username)
        RETURNING users.user_id, users.user_username;
    END
$$;

GRANT ALL ON FUNCTION add_user TO backend;