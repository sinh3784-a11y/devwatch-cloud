-- CreateEnum
CREATE TYPE "ErrorLevel" AS ENUM ('WARN', 'ERROR', 'FATAL');

-- CreateTable
CREATE TABLE "project_api_keys" (
    "id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "label" VARCHAR(60) NOT NULL,
    "key_hash" VARCHAR(40) NOT NULL,
    "expires_at" TIMESTAMPTZ(3) NOT NULL,
    "revoked_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "error_events" (
    "id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "level" "ErrorLevel" NOT NULL,
    "source" VARCHAR(80) NOT NULL,
    "message" TEXT NOT NULL,
    "stack" TEXT,
    "occurred_at" TIMESTAMPTZ(3) NOT NULL,
    "received_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "error_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "project_api_keys_project_id_idx" ON "project_api_keys"("project_id");

-- CreateIndex
CREATE INDEX "error_events_project_id_received_at_idx" ON "error_events"("project_id", "received_at");

-- AddForeignKey
ALTER TABLE "project_api_keys" ADD CONSTRAINT "project_api_keys_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "error_events" ADD CONSTRAINT "error_events_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
