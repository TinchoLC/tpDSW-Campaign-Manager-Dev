/*
  Warnings:

  - You are about to drop the column `personajeId` on the `fichamapa` table. All the data in the column will be lost.
  - You are about to drop the column `campanaId` on the `personaje` table. All the data in the column will be lost.
  - You are about to drop the column `estadoAgresion` on the `personaje` table. All the data in the column will be lost.
  - You are about to drop the column `vidaActual` on the `personaje` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[mapaId,npcCampanaId]` on the table `FichaMapa` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `fichamapa` DROP FOREIGN KEY `FichaMapa_personajeId_fkey`;

-- DropForeignKey
ALTER TABLE `personaje` DROP FOREIGN KEY `Personaje_campanaId_fkey`;

-- DropIndex
DROP INDEX `FichaMapa_mapaId_personajeId_key` ON `fichamapa`;

-- DropIndex
DROP INDEX `FichaMapa_personajeId_fkey` ON `fichamapa`;

-- DropIndex
DROP INDEX `Personaje_campanaId_fkey` ON `personaje`;

-- AlterTable
ALTER TABLE `fichamapa` DROP COLUMN `personajeId`,
    ADD COLUMN `npcCampanaId` INTEGER NULL;

-- AlterTable
ALTER TABLE `personaje` DROP COLUMN `campanaId`,
    DROP COLUMN `estadoAgresion`,
    DROP COLUMN `vidaActual`;

-- CreateTable
CREATE TABLE `NpcCampana` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NULL,
    `especie` VARCHAR(191) NULL,
    `armadura` VARCHAR(191) NULL,
    `iniciativa` INTEGER NULL,
    `velocidad` INTEGER NULL,
    `vidaMax` INTEGER NULL,
    `imagenUrl` VARCHAR(191) NULL,
    `fuerza` INTEGER NULL,
    `destreza` INTEGER NULL,
    `constitucion` INTEGER NULL,
    `inteligencia` INTEGER NULL,
    `carisma` INTEGER NULL,
    `sabiduria` INTEGER NULL,
    `vidaActual` INTEGER NULL,
    `estadoAgresion` VARCHAR(191) NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `campanaId` INTEGER NOT NULL,
    `personajeId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NpcCampanaObjeto` (
    `npcCampanaId` INTEGER NOT NULL,
    `objetoId` INTEGER NOT NULL,
    `cantidad` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`npcCampanaId`, `objetoId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_NpcCampanaToRasgo` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_NpcCampanaToRasgo_AB_unique`(`A`, `B`),
    INDEX `_NpcCampanaToRasgo_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_AccionToNpcCampana` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_AccionToNpcCampana_AB_unique`(`A`, `B`),
    INDEX `_AccionToNpcCampana_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `FichaMapa_mapaId_npcCampanaId_key` ON `FichaMapa`(`mapaId`, `npcCampanaId`);

-- AddForeignKey
ALTER TABLE `FichaMapa` ADD CONSTRAINT `FichaMapa_npcCampanaId_fkey` FOREIGN KEY (`npcCampanaId`) REFERENCES `NpcCampana`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NpcCampana` ADD CONSTRAINT `NpcCampana_personajeId_fkey` FOREIGN KEY (`personajeId`) REFERENCES `Personaje`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NpcCampana` ADD CONSTRAINT `NpcCampana_campanaId_fkey` FOREIGN KEY (`campanaId`) REFERENCES `Campana`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NpcCampanaObjeto` ADD CONSTRAINT `NpcCampanaObjeto_npcCampanaId_fkey` FOREIGN KEY (`npcCampanaId`) REFERENCES `NpcCampana`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NpcCampanaObjeto` ADD CONSTRAINT `NpcCampanaObjeto_objetoId_fkey` FOREIGN KEY (`objetoId`) REFERENCES `Objeto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_NpcCampanaToRasgo` ADD CONSTRAINT `_NpcCampanaToRasgo_A_fkey` FOREIGN KEY (`A`) REFERENCES `NpcCampana`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_NpcCampanaToRasgo` ADD CONSTRAINT `_NpcCampanaToRasgo_B_fkey` FOREIGN KEY (`B`) REFERENCES `Rasgo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AccionToNpcCampana` ADD CONSTRAINT `_AccionToNpcCampana_A_fkey` FOREIGN KEY (`A`) REFERENCES `Accion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AccionToNpcCampana` ADD CONSTRAINT `_AccionToNpcCampana_B_fkey` FOREIGN KEY (`B`) REFERENCES `NpcCampana`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
