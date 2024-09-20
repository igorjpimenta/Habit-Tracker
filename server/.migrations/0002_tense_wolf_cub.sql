ALTER TABLE "goal_completions" ADD COLUMN "uuid" uuid DEFAULT gen_random_uuid();
ALTER TABLE "goal_completions" ADD COLUMN "goal_uuid" uuid;
ALTER TABLE "goals" ADD COLUMN "uuid" uuid DEFAULT gen_random_uuid();
UPDATE "goal_completions" SET "goal_uuid" = (
    SELECT "uuid" FROM "goals" WHERE "goals"."id" = "goal_completions"."goal_id"
);
ALTER TABLE "goal_completions" DROP CONSTRAINT goal_completions_goal_id_goals_id_fk;
ALTER TABLE "goal_completions" DROP COLUMN "id";
ALTER TABLE "goal_completions" DROP COLUMN "goal_id";
ALTER TABLE "goals" DROP COLUMN "id";
ALTER TABLE "goal_completions" RENAME COLUMN "uuid" TO "id";
ALTER TABLE "goal_completions" RENAME COLUMN "goal_uuid" TO "goal_id";
ALTER TABLE "goals" RENAME COLUMN "uuid" TO "id";
ALTER TABLE "goal_completions" ADD CONSTRAINT goal_completions_id_pk PRIMARY KEY ("id");
ALTER TABLE "goals" ADD CONSTRAINT goals_id_pk PRIMARY KEY ("id");
ALTER TABLE "goal_completions" ADD CONSTRAINT goal_completions_goal_id_goals_id_fk FOREIGN KEY ("goal_id") REFERENCES "goals"("id");
