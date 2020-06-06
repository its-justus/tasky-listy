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

/* generate some seed data */
INSERT INTO tasks (task)
	VALUES ('End world hunger');
INSERT INTO tasks (task)
	VALUES ('Get more toilet paper');
INSERT INTO tasks (task)
	VALUES ('Finish singing the song that never ends');

/*
mark complete is a shorthand for marking a task complete.
the query should be called as "CALL mark_complete(id);"
where id is the id of the task being completed
*/

CREATE OR REPLACE PROCEDURE mark_complete(INT)
	LANGUAGE plpgsql
	AS $$
	BEGIN
		UPDATE tasks
			SET completed = NOW()
			WHERE id = $1;
		
		COMMIT;
	END;
	$$;

/* testing mark_complete*/
CALL mark_complete(1); 

/*
mark_incomplete is the same as mark_complete, but just marks the task incomplete
by setting the completed date to null
*/
CREATE OR REPLACE PROCEDURE mark_incomplete(INT)
	LANGUAGE plpgsql
	AS $$
	BEGIN
		UPDATE tasks
			SET completed = NULL
			WHERE id = $1;
		
		COMMIT;
	END;
	$$;
	
/* testing mark_incomplete */
CALL mark_incomplete(1);

/*
mark_deleted marks a task as deleted so the item is ignored by all subsequent queries
so long as the function get_all_tasks is used
*/
CREATE OR REPLACE PROCEDURE mark_deleted(INT)
	LANGUAGE plpgsql
	AS $$
	BEGIN
		UPDATE tasks
			SET deleted = TRUE
			WHERE id = $1;
		
		COMMIT;
	END;
	$$;
	
/* testing mark_deleted */
CALL mark_deleted(1);

/*
get_all_tasks returns a table of all tasks not marked deleted.
get_all_tasks should be used in place of referencing the table directly to ensure
"deleted" tasks are ignored. 
*/
CREATE OR REPLACE FUNCTION get_all_tasks()
	RETURNS TABLE (
		id  			INTEGER,
		task			TEXT,
		created			TIMESTAMPTZ,
		due				DATE,
		completed		TIMESTAMPTZ,
		deleted			BOOLEAN,
		color			VARCHAR(6)
	)
	LANGUAGE plpgsql
	AS $$
	BEGIN
		RETURN QUERY SELECT *
			FROM tasks
			WHERE tasks.deleted = FALSE;
	END;
	$$;

/* testing get_all_tasks. if all proceding queries have been run this should return 
a table with 2 task objects, starting at task id 2*/
SELECT * FROM get_all_tasks();