/*
  Warnings:

  - You are about to alter the column `Status` on the `Usuarios` table. The data in that column could be lost. The data in that column will be cast from `Char(2)` to `Char(1)`.

*/
-- AlterTable
ALTER TABLE "Usuarios" ALTER COLUMN "Status" SET DATA TYPE CHAR(1);
