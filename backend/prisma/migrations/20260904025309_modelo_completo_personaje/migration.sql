/*
  Warnings:

  - You are about to drop the `another_test_table` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `new_table` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `test_table` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[nombre]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `personaje` ADD COLUMN `armadura` VARCHAR(191) NULL,
    ADD COLUMN `iniciativa` INTEGER NULL,
    ADD COLUMN `manaMax` INTEGER NULL,
    ADD COLUMN `nivel` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `velocidad` INTEGER NULL,
    ADD COLUMN `vidaMax` INTEGER NULL;

-- DropTable
DROP TABLE `another_test_table`;

-- DropTable
DROP TABLE `new_table`;

-- DropTable
DROP TABLE `test_table`;

-- CreateIndex
CREATE UNIQUE INDEX `Usuario_nombre_key` ON `Usuario`(`nombre`);
