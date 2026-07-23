-- DropIndex
DROP INDEX "Notification_isRead_idx";

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "reminderSent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "scheduledAt" TIMESTAMP(3);
