/*
  Warnings:

  - You are about to drop the column `usuarioId` on the `personajecampana` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `personajecampana` DROP FOREIGN KEY `PersonajeCampana_usuarioId_fkey`;

-- DropIndex
DROP INDEX `PersonajeCampana_usuarioId_fkey` ON `personajecampana`;

-- AlterTable
ALTER TABLE `personajecampana` DROP COLUMN `usuarioId`;
