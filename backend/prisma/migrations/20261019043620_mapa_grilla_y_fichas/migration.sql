/*
  Warnings:

  - You are about to drop the column `imagenId` on the `fichamapa` table. All the data in the column will be lost.
  - You are about to drop the column `imagenId` on the `mapa` table. All the data in the column will be lost.
  - You are about to drop the column `imagenId` on the `objeto` table. All the data in the column will be lost.
  - You are about to drop the column `imagenId` on the `personaje` table. All the data in the column will be lost.
  - You are about to drop the column `imagenId` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the `imagen` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `fichamapa` DROP FOREIGN KEY `FichaMapa_imagenId_fkey`;

-- DropForeignKey
ALTER TABLE `mapa` DROP FOREIGN KEY `Mapa_imagenId_fkey`;

-- DropForeignKey
ALTER TABLE `objeto` DROP FOREIGN KEY `Objeto_imagenId_fkey`;

-- DropForeignKey
ALTER TABLE `personaje` DROP FOREIGN KEY `Personaje_imagenId_fkey`;

-- DropForeignKey
ALTER TABLE `usuario` DROP FOREIGN KEY `Usuario_imagenId_fkey`;

-- DropIndex
DROP INDEX `FichaMapa_imagenId_fkey` ON `fichamapa`;

-- DropIndex
DROP INDEX `Mapa_imagenId_fkey` ON `mapa`;

-- DropIndex
DROP INDEX `Objeto_imagenId_fkey` ON `objeto`;

-- DropIndex
DROP INDEX `Personaje_imagenId_fkey` ON `personaje`;

-- DropIndex
DROP INDEX `Usuario_imagenId_fkey` ON `usuario`;

-- AlterTable
ALTER TABLE `campana` ADD COLUMN `imagenUrl` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `fichamapa` DROP COLUMN `imagenId`,
    ADD COLUMN `imagenUrl` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `mapa` DROP COLUMN `imagenId`,
    ADD COLUMN `imagenUrl` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `objeto` DROP COLUMN `imagenId`,
    ADD COLUMN `imagenUrl` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `personaje` DROP COLUMN `imagenId`,
    ADD COLUMN `imagenUrl` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `usuario` DROP COLUMN `imagenId`,
    ADD COLUMN `imagenUrl` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `imagen`;
