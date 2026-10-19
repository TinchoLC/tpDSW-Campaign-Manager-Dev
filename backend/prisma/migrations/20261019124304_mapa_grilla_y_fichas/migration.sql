/*
  Warnings:

  - A unique constraint covering the columns `[mapaId,personajeId]` on the table `FichaMapa` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mapaId,personajeCampanaId]` on the table `FichaMapa` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `columnas` to the `Mapa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `filas` to the `Mapa` table without a default value. This is not possible if the table is not empty.
  - Made the column `estado` on table `mapa` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `mapa` ADD COLUMN `activo` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `columnas` INTEGER NOT NULL,
    ADD COLUMN `filas` INTEGER NOT NULL,
    MODIFY `estado` ENUM('preparado', 'en_juego') NOT NULL DEFAULT 'preparado';

-- CreateIndex
CREATE UNIQUE INDEX `FichaMapa_mapaId_personajeId_key` ON `FichaMapa`(`mapaId`, `personajeId`);

-- CreateIndex
CREATE UNIQUE INDEX `FichaMapa_mapaId_personajeCampanaId_key` ON `FichaMapa`(`mapaId`, `personajeCampanaId`);
