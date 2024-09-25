CREATE TABLE IF NOT EXISTS "goals_changes_history" (
	"id" uuid PRIMARY KEY NOT NULL,
	"goal_id" uuid NOT NULL,
	"field_name" varchar(25) NOT NULL,
	"old_value" text NOT NULL,
	"new_value" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
ALTER TABLE "goals_changes_history" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
--> statement-breakpoint
ALTER TABLE "goal_completions" DROP CONSTRAINT "goal_completions_goal_id_goals_id_fk";
--> statement-breakpoint
ALTER TABLE "goal_completions" ALTER COLUMN "goal_id" SET DATA TYPE uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "goals_changes_history" ADD CONSTRAINT "goals_changes_history_goal_id_goals_id_fk" FOREIGN KEY ("goal_id") REFERENCES "public"."goals"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "goal_completions" ADD CONSTRAINT "goal_completions_goal_id_goals_id_fk" FOREIGN KEY ("goal_id") REFERENCES "public"."goals"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
CREATE EXTENSION IF NOT EXISTS hstore;
CREATE OR REPLACE FUNCTION log_goals_changes_auto()
RETURNS TRIGGER AS $$
DECLARE
	oldh hstore;
	newh hstore;
    changes hstore;
    goal_id uuid;
    field text;
    old_value text;
    new_value text;
BEGIN
    goal_id := OLD.id;
	oldh := hstore(OLD);
	newh := hstore(NEW);
    changes := oldh - newh;

    FOREACH field IN ARRAY akeys(changes) LOOP
        IF field = 'updated_at' THEN
            CONTINUE;
        END IF;
		
        old_value := oldh -> field;
        new_value := newh -> field;
        
        INSERT INTO goals_changes_history (goal_id, field_name, old_value, new_value, created_at)
        VALUES (goal_id, field, old_value, new_value, NOW());
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE OR REPLACE TRIGGER trigger_goals_changes_auto
AFTER UPDATE ON goals
FOR EACH ROW
EXECUTE FUNCTION log_goals_changes_auto();
