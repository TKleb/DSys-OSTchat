--------------------------------------------------------------------------------
CREATE TABLE users (
    user_id          INTEGER UNIQUE GENERATED ALWAYS AS IDENTITY,
    user_username    VARCHAR UNIQUE NOT NULL
) TABLESPACE pg_default;

--------------------------------------------------------------------------------
CREATE TABLE rooms (
    room_id         INTEGER UNIQUE GENERATED ALWAYS AS IDENTITY,
    room_name       VARCHAR NOT NULL
) TABLESPACE pg_default;

--------------------------------------------------------------------------------
CREATE TABLE messages
(
    message_id              INTEGER UNIQUE GENERATED ALWAYS AS IDENTITY,
    message_sender_id       INT NOT NULL,
    message_room_id         INT NOT NULL,
    message_content         VARCHAR NOT NULL,
    message_timestamp       VARCHAR NOT NULL,
    CONSTRAINT fk_sender
      FOREIGN KEY(message_sender_id)
      REFERENCES users(user_id),
    CONSTRAINT fk_room
      FOREIGN KEY(message_room_id)
      REFERENCES rooms(room_id)
) TABLESPACE pg_default;
