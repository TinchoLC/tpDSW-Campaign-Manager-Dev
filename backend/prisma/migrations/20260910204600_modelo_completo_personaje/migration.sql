/*
  Warnings:

  - You are about to drop the column `personajeCampanaId` on the `accion` table. All the data in the column will be lost.
  - You are about to drop the column `dmId` on the `campana` table. All the data in the column will be lost.
  - You are about to drop the column `imagenId` on the `campana` table. All the data in the column will be lost.
  - You are about to alter the column `estado` on the `campana` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - You are about to drop the column `personajeCampanaId` on the `objeto` table. All the data in the column will be lost.
  - You are about to drop the column `eventoId` on the `personaje` table. All the data in the column will be lost.
  - The values [JUGABLE,NO_JUGABLE] on the enum `Personaje_tipo` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `personajeCampanaId` on the `rasgo` table. All the data in the column will be lost.
  - You are about to drop the `_campanajugadores` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_estadisticatopersonaje` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_objetotopersonaje` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `estadistica` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `evento` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `usuarioId` to the `Campana` table without a default value. This is not possible if the table is not empty.
  - Made the column `valor` on table `objeto` required. This step will fail if there are existing NULL values in that column.
  - Made the column `usuarioId` on table `personaje` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `nombre` to the `PersonajeCampana` table without a default value. This is not possible if the table is not empty.
  - Made the column `vidaMax` on table `personajecampana` required. This step will fail if there are existing NULL values in that column.
  - Made the column `vidaActual` on table `personajecampana` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `_campanajugadores` DROP FOREIGN KEY `_CampanaJugadores_A_fkey`;

-- DropForeignKey
ALTER TABLE `_campanajugadores` DROP FOREIGN KEY `_CampanaJugadores_B_fkey`;

-- DropForeignKey
ALTER TABLE `_estadisticatopersonaje` DROP FOREIGN KEY `_EstadisticaToPersonaje_A_fkey`;

-- DropForeignKey
ALTER TABLE `_estadisticatopersonaje` DROP FOREIGN KEY `_EstadisticaToPersonaje_B_fkey`;

-- DropForeignKey
ALTER TABLE `_objetotopersonaje` DROP FOREIGN KEY `_ObjetoToPersonaje_A_fkey`;

-- DropForeignKey
ALTER TABLE `_objetotopersonaje` DROP FOREIGN KEY `_ObjetoToPersonaje_B_fkey`;

-- DropForeignKey
ALTER TABLE `accion` DROP FOREIGN KEY `Accion_personajeCampanaId_fkey`;

-- DropForeignKey
ALTER TABLE `campana` DROP FOREIGN KEY `Campana_dmId_fkey`;

-- DropForeignKey
ALTER TABLE `campana` DROP FOREIGN KEY `Campana_imagenId_fkey`;

-- DropForeignKey
ALTER TABLE `estadistica` DROP FOREIGN KEY `Estadistica_personajeCampanaId_fkey`;

-- DropForeignKey
ALTER TABLE `evento` DROP FOREIGN KEY `Evento_campanaId_fkey`;

-- DropForeignKey
ALTER TABLE `evento` DROP FOREIGN KEY `Evento_imagenId_fkey`;

-- DropForeignKey
ALTER TABLE `evento` DROP FOREIGN KEY `Evento_personajeCampanaId_fkey`;

-- DropForeignKey
ALTER TABLE `objeto` DROP FOREIGN KEY `Objeto_catObjetoId_fkey`;

-- DropForeignKey
ALTER TABLE `objeto` DROP FOREIGN KEY `Objeto_personajeCampanaId_fkey`;

-- DropForeignKey
ALTER TABLE `personaje` DROP FOREIGN KEY `Personaje_eventoId_fkey`;

-- DropForeignKey
ALTER TABLE `personaje` DROP FOREIGN KEY `Personaje_usuarioId_fkey`;

-- DropForeignKey
ALTER TABLE `rasgo` DROP FOREIGN KEY `Rasgo_personajeCampanaId_fkey`;

-- DropIndex
DROP INDEX `Accion_personajeCampanaId_fkey` ON `accion`;

-- DropIndex
DROP INDEX `Campana_dmId_fkey` ON `campana`;

-- DropIndex
DROP INDEX `Campana_imagenId_fkey` ON `campana`;

-- DropIndex
DROP INDEX `Objeto_catObjetoId_fkey` ON `objeto`;

-- DropIndex
DROP INDEX `Objeto_personajeCampanaId_fkey` ON `objeto`;

-- DropIndex
DROP INDEX `Personaje_eventoId_fkey` ON `personaje`;

-- DropIndex
DROP INDEX `Personaje_usuarioId_fkey` ON `personaje`;

-- DropIndex
DROP INDEX `Rasgo_personajeCampanaId_fkey` ON `rasgo`;

-- AlterTable
ALTER TABLE `accion` DROP COLUMN `personajeCampanaId`,
    ADD COLUMN `activo` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `campanaId` INTEGER NULL,
    ADD COLUMN `costoMana` INTEGER NULL,
    ADD COLUMN `visibleAJugador` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `campana` DROP COLUMN `dmId`,
    DROP COLUMN `imagenId`,
    ADD COLUMN `activo` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `usuarioId` INTEGER NOT NULL,
    MODIFY `estado` ENUM('planificada', 'activa', 'pausada', 'finalizada') NOT NULL DEFAULT 'planificada';

-- AlterTable
ALTER TABLE `objeto` DROP COLUMN `personajeCampanaId`,
    ADD COLUMN `activo` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `campanaId` INTEGER NULL,
    ADD COLUMN `imagenId` INTEGER NULL,
    ADD COLUMN `visibleAJugador` BOOLEAN NOT NULL DEFAULT true,
    MODIFY `valor` INTEGER NOT NULL,
    MODIFY `catObjetoId` INTEGER NULL;

-- AlterTable
ALTER TABLE `personaje` DROP COLUMN `eventoId`,
    ADD COLUMN `activo` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `campanaId` INTEGER NULL,
    ADD COLUMN `carisma` INTEGER NULL,
    ADD COLUMN `constitucion` INTEGER NULL,
    ADD COLUMN `destreza` INTEGER NULL,
    ADD COLUMN `experiencia` INTEGER NULL,
    ADD COLUMN `fuerza` INTEGER NULL,
    ADD COLUMN `inteligencia` INTEGER NULL,
    ADD COLUMN `oro` INTEGER NULL,
    ADD COLUMN `sabiduria` INTEGER NULL,
    MODIFY `tipo` ENUM('jugable', 'no_jugable') NOT NULL,
    MODIFY `usuarioId` INTEGER NOT NULL,
    MODIFY `nivel` INTEGER NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `personajecampana` ADD COLUMN `activo` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `carisma` INTEGER NULL,
    ADD COLUMN `clase` VARCHAR(191) NULL,
    ADD COLUMN `constitucion` INTEGER NULL,
    ADD COLUMN `destreza` INTEGER NULL,
    ADD COLUMN `estado` ENUM('vivo', 'muerto', 'inconsciente') NOT NULL DEFAULT 'vivo',
    ADD COLUMN `fuerza` INTEGER NULL,
    ADD COLUMN `inteligencia` INTEGER NULL,
    ADD COLUMN `nombre` VARCHAR(191) NOT NULL,
    ADD COLUMN `sabiduria` INTEGER NULL,
    ADD COLUMN `usuarioId` INTEGER NULL,
    MODIFY `vidaMax` INTEGER NOT NULL,
    MODIFY `vidaActual` INTEGER NOT NULL,
    MODIFY `experiencia` INTEGER NULL,
    MODIFY `oro` INTEGER NULL;

-- AlterTable
ALTER TABLE `rasgo` DROP COLUMN `personajeCampanaId`,
    ADD COLUMN `activo` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `campanaId` INTEGER NULL,
    ADD COLUMN `nivelMinimo` INTEGER NULL,
    ADD COLUMN `visibleAJugador` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `usuario` ADD COLUMN `activo` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `imagenId` INTEGER NULL,
    ADD COLUMN `tipo` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `_campanajugadores`;

-- DropTable
DROP TABLE `_estadisticatopersonaje`;

-- DropTable
DROP TABLE `_objetotopersonaje`;

-- DropTable
DROP TABLE `estadistica`;

-- DropTable
DROP TABLE `evento`;

-- CreateTable
CREATE TABLE `Mapa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NULL,
    `estado` VARCHAR(191) NULL,
    `campanaId` INTEGER NOT NULL,
    `imagenId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FichaMapa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `posicionX` INTEGER NOT NULL,
    `posicionY` INTEGER NOT NULL,
    `estado` VARCHAR(191) NULL,
    `mapaId` INTEGER NOT NULL,
    `personajeId` INTEGER NULL,
    `personajeCampanaId` INTEGER NULL,
    `imagenId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PersonajeObjeto` (
    `personajeId` INTEGER NOT NULL,
    `objetoId` INTEGER NOT NULL,
    `cantidad` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`personajeId`, `objetoId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PersonajeCampanaObjeto` (
    `personajeCampanaId` INTEGER NOT NULL,
    `objetoId` INTEGER NOT NULL,
    `cantidad` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`personajeCampanaId`, `objetoId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PersonajeCampanaToRasgo` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_PersonajeCampanaToRasgo_AB_unique`(`A`, `B`),
    INDEX `_PersonajeCampanaToRasgo_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_AccionToPersonajeCampana` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_AccionToPersonajeCampana_AB_unique`(`A`, `B`),
    INDEX `_AccionToPersonajeCampana_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Usuario` ADD CONSTRAINT `Usuario_imagenId_fkey` FOREIGN KEY (`imagenId`) REFERENCES `Imagen`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Campana` ADD CONSTRAINT `Campana_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mapa` ADD CONSTRAINT `Mapa_campanaId_fkey` FOREIGN KEY (`campanaId`) REFERENCES `Campana`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mapa` ADD CONSTRAINT `Mapa_imagenId_fkey` FOREIGN KEY (`imagenId`) REFERENCES `Imagen`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FichaMapa` ADD CONSTRAINT `FichaMapa_mapaId_fkey` FOREIGN KEY (`mapaId`) REFERENCES `Mapa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FichaMapa` ADD CONSTRAINT `FichaMapa_personajeId_fkey` FOREIGN KEY (`personajeId`) REFERENCES `Personaje`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FichaMapa` ADD CONSTRAINT `FichaMapa_personajeCampanaId_fkey` FOREIGN KEY (`personajeCampanaId`) REFERENCES `PersonajeCampana`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FichaMapa` ADD CONSTRAINT `FichaMapa_imagenId_fkey` FOREIGN KEY (`imagenId`) REFERENCES `Imagen`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Personaje` ADD CONSTRAINT `Personaje_campanaId_fkey` FOREIGN KEY (`campanaId`) REFERENCES `Campana`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Personaje` ADD CONSTRAINT `Personaje_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PersonajeCampana` ADD CONSTRAINT `PersonajeCampana_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Objeto` ADD CONSTRAINT `Objeto_imagenId_fkey` FOREIGN KEY (`imagenId`) REFERENCES `Imagen`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Objeto` ADD CONSTRAINT `Objeto_catObjetoId_fkey` FOREIGN KEY (`catObjetoId`) REFERENCES `CatObjeto`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Objeto` ADD CONSTRAINT `Objeto_campanaId_fkey` FOREIGN KEY (`campanaId`) REFERENCES `Campana`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PersonajeObjeto` ADD CONSTRAINT `PersonajeObjeto_personajeId_fkey` FOREIGN KEY (`personajeId`) REFERENCES `Personaje`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PersonajeObjeto` ADD CONSTRAINT `PersonajeObjeto_objetoId_fkey` FOREIGN KEY (`objetoId`) REFERENCES `Objeto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PersonajeCampanaObjeto` ADD CONSTRAINT `PersonajeCampanaObjeto_personajeCampanaId_fkey` FOREIGN KEY (`personajeCampanaId`) REFERENCES `PersonajeCampana`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PersonajeCampanaObjeto` ADD CONSTRAINT `PersonajeCampanaObjeto_objetoId_fkey` FOREIGN KEY (`objetoId`) REFERENCES `Objeto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rasgo` ADD CONSTRAINT `Rasgo_campanaId_fkey` FOREIGN KEY (`campanaId`) REFERENCES `Campana`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Accion` ADD CONSTRAINT `Accion_campanaId_fkey` FOREIGN KEY (`campanaId`) REFERENCES `Campana`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PersonajeCampanaToRasgo` ADD CONSTRAINT `_PersonajeCampanaToRasgo_A_fkey` FOREIGN KEY (`A`) REFERENCES `PersonajeCampana`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PersonajeCampanaToRasgo` ADD CONSTRAINT `_PersonajeCampanaToRasgo_B_fkey` FOREIGN KEY (`B`) REFERENCES `Rasgo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AccionToPersonajeCampana` ADD CONSTRAINT `_AccionToPersonajeCampana_A_fkey` FOREIGN KEY (`A`) REFERENCES `Accion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AccionToPersonajeCampana` ADD CONSTRAINT `_AccionToPersonajeCampana_B_fkey` FOREIGN KEY (`B`) REFERENCES `PersonajeCampana`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
