/*
  Warnings:

  - Made the column `name` on table `Coop` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Coop" ALTER COLUMN "name" SET NOT NULL;
