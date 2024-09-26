CREATE TABLE IF NOT EXISTS "goal_completions_changes_history" (
	"id" uuid PRIMARY KEY NOT NULL,
	"completion_id" uuid NOT NULL,
	"field_name" varchar(25) NOT NULL,
	"old_value" text NOT NULL,
	"new_value" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
ALTER TABLE "goal_completions_changes_history" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "goal_completions_changes_history" ADD CONSTRAINT "goal_completions_changes_history_completion_id_goal_completions_id_fk" FOREIGN KEY ("completion_id") REFERENCES "public"."goal_completions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
CREATE EXTENSION IF NOT EXISTS hstore;
CREATE OR REPLACE FUNCTION log_changes_auto()
RETURNS TRIGGER AS $$
DECLARE
	oldh hstore;
	newh hstore;
    changes hstore;
    id uuid;
    field text;
    old_value text;
    new_value text;
    p_table_name text := TG_ARGV[0];
    p_fk_field text := TG_ARGV[1];
BEGIN
    id := OLD.id;
	oldh := hstore(OLD);
	newh := hstore(NEW);
    changes := oldh - newh;

    FOREACH field IN ARRAY akeys(changes) LOOP
        IF field = 'updated_at' THEN
            CONTINUE;
        END IF;
		
        old_value := oldh -> field;
        new_value := newh -> field;
        
        EXECUTE format(
            'INSERT INTO %I (%I, field_name, old_value, new_value, created_at) VALUES ($1, $2, $3, $4, NOW())',
            p_table_name,
			p_fk_field
        )
        USING id, field, old_value, new_value;
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE OR REPLACE TRIGGER trigger_goals_changes_auto
AFTER UPDATE ON goals
FOR EACH ROW
EXECUTE FUNCTION log_changes_auto('goals_changes_history', 'goal_id');
CREATE OR REPLACE TRIGGER trigger_goal_completions_changes_auto
AFTER UPDATE ON goal_completions
FOR EACH ROW
EXECUTE FUNCTION log_changes_auto('goal_completions_changes_history', 'completion_id');
DROP FUNCTION log_goals_changes_auto;
