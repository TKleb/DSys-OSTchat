--------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_user_by_name(p_username VARCHAR)
    RETURNS SETOF users
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $$
    BEGIN
        RETURN QUERY
        SELECT *
        FROM users
        WHERE users.username = p_username;
    END
$$;

GRANT ALL ON FUNCTION get_user_by_name TO backend;

--------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_user_by_id(p_user_id INT)
    RETURNS SETOF users
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $$
    BEGIN
        RETURN QUERY
        SELECT *
        FROM users
        WHERE users.id = p_user_id
        LIMIT 1;
    END
$$;

GRANT ALL ON FUNCTION get_user_by_id TO backend;

--------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION add_user(p_username VARCHAR)
    RETURNS SETOF users
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $$
    BEGIN
        RETURN QUERY
        INSERT INTO
            users(username)
        VALUES (p_username)
        RETURNING *;
    END
$$;

GRANT ALL ON FUNCTION add_user TO backend;

--------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_or_add_user(p_username VARCHAR)
    RETURNS SETOF users
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $$
    BEGIN
        DROP TABLE IF EXISTS existing_user;
        CREATE TEMP TABLE existing_user AS SELECT * FROM get_user_by_name(p_username);

        IF (SELECT COUNT(*) FROM existing_user) > 0 THEN
            RETURN QUERY
            SELECT * FROM existing_user;
        ELSE
            RETURN QUERY
            SELECT * FROM add_user(p_username);
        END IF;
    END
$$;

GRANT ALL ON FUNCTION get_or_add_user TO backend;
