ALTER TABLE "goal_completions" ADD COLUMN "updated_at" timestamp with time zone;
ALTER TABLE "goals" ADD COLUMN "updated_at" timestamp with time zone;
UPDATE "goal_completions" SET "updated_at" = "created_at" WHERE "goal_completions"."id" = "goal_completions"."id";
UPDATE "goals" SET "updated_at" = "created_at" WHERE "goals"."id" = "goals"."id";
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE OR REPLACE TRIGGER set_updated_at_goals
BEFORE INSERT OR UPDATE ON goals
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER set_updated_at_goal_completions
BEFORE INSERT OR UPDATE ON goal_completions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();