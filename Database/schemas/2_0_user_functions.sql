--------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_user_by_name(p_username VARCHAR)
    RETURNS TABLE(
        id INT,
        username VARCHAR
    )
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $$
    BEGIN
        RETURN QUERY
        SELECT users.user_id, users.user_username
        FROM users
        WHERE users.user_username = p_username;
    END
$$;

GRANT ALL ON FUNCTION get_user_by_name TO backend;

--------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_user_by_id(p_user_id INT)
    RETURNS TABLE(
        id INT,
        username VARCHAR
    )
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $$
    BEGIN
        RETURN QUERY
        SELECT *
        FROM users
        WHERE users.user_id = p_user_id
        LIMIT 1;
    END
$$;

GRANT ALL ON FUNCTION get_user_by_id TO backend;

--------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION add_user(p_username VARCHAR)
    RETURNS TABLE(
        id INT,
        username VARCHAR
    )
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $$
    BEGIN
        RETURN QUERY
        INSERT INTO
            users(user_username)
        VALUES (p_username)
        RETURNING
            users.user_id,
            users.user_username;
    END
$$;

GRANT ALL ON FUNCTION add_user TO backend;
