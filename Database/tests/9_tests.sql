-- For future reference: https://stackoverflow.com/questions/11299037/postgresql-if-statement
-- Test users
DO
$user_tests$ BEGIN
    IF NOT EXISTS(
        SELECT * FROM add_user('Nick')
    ) THEN
        RAISE EXCEPTION 'add_user failed';
    END IF;

    IF NOT EXISTS(
        SELECT * FROM get_user_by_name('Nick')
    ) THEN
        RAISE EXCEPTION 'get_user_by_name failed';
    END IF;

    IF NOT EXISTS(
        SELECT * FROM get_user_by_id(1)
    ) THEN
        RAISE EXCEPTION 'get_user_by_id failed';
    END IF;
END $user_tests$;

-- Room Tests
DO
$room_tests$ BEGIN
    IF NOT EXISTS(
        SELECT * FROM add_room('Dysys')
    ) THEN
        RAISE EXCEPTION 'add_room failed';
    END IF;

    IF NOT EXISTS(
        SELECT * FROM get_rooms()
    ) THEN
        RAISE EXCEPTION 'get_rooms failed';
    END IF;
    
    IF NOT EXISTS(
        SELECT * FROM get_room_by_id(1)
    ) THEN
        RAISE EXCEPTION 'add_room failed';
    END IF;
END $room_tests$;
