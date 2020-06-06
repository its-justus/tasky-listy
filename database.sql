/*
first create the "task_app" database
*/
CREATE DATABASE task_app;

/*
then run the following queries in order
*/
CREATE TABLE tasks (
	id  			INTEGER GENERATED ALWAYS AS IDENTITY,
	task			TEXT NOT NULL,
	created			TIMESTAMPTZ DEFAULT NOW(),
	due				DATE,
	completed		TIMESTAMPTZ,
	deleted			BOOLEAN DEFAULT FALSE,
	color			VARCHAR(6)
	);

INSERT INTO tasks (task)
	VALUES ('End world hunger');
INSERT INTO tasks (task)
	VALUES ('Get more toilet paper');
INSERT INTO tasks (task)
	VALUES ('Finish singing the song that never ends');