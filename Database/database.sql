CREATE DATABASE ost_chat;

CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username VARCHAR(255) NOT NULL
);

CREATE TABLE messages
(
    username VARCHAR(255) NOT NULL,
    text     VARCHAR(255) NOT NULL,
    sent VARCHAR(255) NOT NULL
);


