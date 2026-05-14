CREATE OR REPLACE FUNCTION notify_todo_changes()
RETURNS trigger AS $$
BEGIN
  PERFORM pg_notify(
    'todo_changes',
    json_build_object(
      'operation', TG_OP,
      'id', COALESCE(NEW.id, OLD.id),
      'text', NEW.text,
      'done', NEW.done
    )::text
  );
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'todo') THEN
    DROP TRIGGER IF EXISTS todo_changes_trigger ON todo;

    CREATE TRIGGER todo_changes_trigger
      AFTER INSERT OR UPDATE OR DELETE ON todo
      FOR EACH ROW EXECUTE FUNCTION notify_todo_changes();

    RAISE NOTICE 'Trigger notify_todo_changes was successfully added to table todo';
  ELSE
    RAISE NOTICE 'Todo table does not exists yet – trigger will be added later';
  END IF;
END $$;