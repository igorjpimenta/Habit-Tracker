ALTER TABLE goal_completions DISABLE TRIGGER set_updated_at_goal_completions;
ALTER TABLE "goal_completions" ADD COLUMN "completed_at" timestamp with time zone DEFAULT now() NOT NULL;
UPDATE "goal_completions" SET "completed_at" = "created_at" WHERE "goal_completions"."id" = "goal_completions"."id";
ALTER TABLE goal_completions ENABLE TRIGGER set_updated_at_goal_completions;
