--------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION add_room(p_room_name VARCHAR)
    RETURNS TABLE(
        id INT,
        room_name VARCHAR
    )
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $$
    BEGIN
        RETURN QUERY
        INSERT INTO
            rooms(room_name)
        VALUES (p_room_name)
        RETURNING
            rooms.room_id,
            rooms.room_name;
    END
$$;

GRANT ALL ON FUNCTION add_room TO backend;

--------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_rooms()
    RETURNS TABLE(
        id INT,
        room_name VARCHAR

    )
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $$
    BEGIN
        RETURN QUERY
        SELECT
            rooms.room_id,
            rooms.room_name
        FROM rooms;
    END
$$;

GRANT ALL ON FUNCTION get_rooms TO backend;

--------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_room_by_id(p_room_id INT)
    RETURNS TABLE(
        id INT,
        room_name VARCHAR
    )
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $$
    BEGIN
        RETURN QUERY
        SELECT rooms.room_id, rooms.room_name
        FROM rooms
        WHERE rooms.room_id = p_room_id
        LIMIT 1;
    END
$$;

GRANT ALL ON FUNCTION get_room_by_id TO backend;