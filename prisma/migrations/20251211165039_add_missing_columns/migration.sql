-- AlterTable
ALTER TABLE "Completion" ADD COLUMN     "value" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Habit" ADD COLUMN     "dailyGoal" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "notificationTime" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "hasSeenTutorial" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPro" BOOLEAN NOT NULL DEFAULT false;
