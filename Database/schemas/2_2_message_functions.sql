--------------------------------------------------------------------------------
-- Fetch Messages in Room
CREATE OR REPLACE FUNCTION get_messages(p_room_id INT)
    RETURNS TABLE (
        id        INTEGER,
        sender_id INT,
        sender_name VARCHAR,
        room_id   INT,
        content   VARCHAR,
        tmstmp VARCHAR
    )
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $$
    BEGIN
        RETURN QUERY
        SELECT  message_id,
                message_sender_id,
                username AS sender_name,
                message_room_id,
                message_content,
                message_timestamp
        FROM messages
        JOIN users on users.id = message_sender_id
        WHERE messages.message_room_id = p_room_id;
    END
$$;

GRANT ALL ON FUNCTION get_messages TO backend;

--------------------------------------------------------------------------------
-- Post message to room as user
CREATE OR REPLACE FUNCTION post_message(p_sender_id INT, p_room_id INT, p_message_content VARCHAR, p_message_timestamp VARCHAR)
    RETURNS TABLE (
        id        INTEGER,
        sender_id INT,
        room_id   INT,
        content   VARCHAR,
        tmstmp VARCHAR
    )
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $$
    BEGIN
        RETURN QUERY
        INSERT INTO messages(
            message_sender_id,
            message_room_id,
            message_content,
            message_timestamp
        )
        VALUES (
            p_sender_id,
            p_room_id,
            p_message_content,
            p_message_timestamp
        )
        RETURNING
            message_id AS id,
            message_sender_id AS sender_id,
            message_room_id AS room_id,
            message_content AS content,
            message_timestamp AS tmstmp;
    END
$$;

GRANT ALL ON FUNCTION post_message TO backend;

--------------------------------------------------------------------------------
-- Fetch Messages in Room
CREATE OR REPLACE FUNCTION get_messages_after(p_room_id INT, p_message_id INT)
    RETURNS TABLE (
        id        INTEGER,
        sender_id INT,
        sender_name VARCHAR,
        room_id   INT,
        content   VARCHAR,
        tmstmp VARCHAR
    )
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $$
    BEGIN
        RETURN QUERY
        SELECT  message_id,
                message_sender_id,
                username AS sender_name,
                message_room_id,
                message_content,
                message_timestamp
        FROM messages
        JOIN users on users.id = message_sender_id
        WHERE messages.message_room_id = p_room_id
        AND messages.message_id > p_message_id;
    END
$$;

GRANT ALL ON FUNCTION get_messages_after TO backend;
