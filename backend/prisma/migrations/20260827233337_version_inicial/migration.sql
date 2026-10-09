-- CreateTable
CREATE TABLE `Usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `contrasena` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Campana` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NULL,
    `estado` VARCHAR(191) NOT NULL,
    `dmId` INTEGER NOT NULL,
    `imagenId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Evento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NULL,
    `campanaId` INTEGER NOT NULL,
    `imagenId` INTEGER NULL,
    `personajeCampanaId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Imagen` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NULL,
    `archivo` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Personaje` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` ENUM('JUGABLE', 'NO_JUGABLE') NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NULL,
    `especie` VARCHAR(191) NULL,
    `clase` VARCHAR(191) NULL,
    `imagenId` INTEGER NULL,
    `usuarioId` INTEGER NULL,
    `estadoAgresion` VARCHAR(191) NULL,
    `eventoId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PersonajeCampana` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `personajeId` INTEGER NOT NULL,
    `campanaId` INTEGER NOT NULL,
    `nivel` INTEGER NOT NULL DEFAULT 1,
    `armadura` VARCHAR(191) NULL,
    `iniciativa` INTEGER NULL,
    `velocidad` INTEGER NULL,
    `vidaMax` INTEGER NULL,
    `vidaActual` INTEGER NULL,
    `manaMax` INTEGER NULL,
    `manaActual` INTEGER NULL,
    `experiencia` INTEGER NOT NULL DEFAULT 0,
    `oro` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `PersonajeCampana_personajeId_campanaId_key`(`personajeId`, `campanaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Objeto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NULL,
    `valor` INTEGER NULL,
    `catObjetoId` INTEGER NOT NULL,
    `personajeCampanaId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CatObjeto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Rasgo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NULL,
    `personajeCampanaId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Accion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NULL,
    `personajeCampanaId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Estadistica` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `valor` INTEGER NOT NULL,
    `modificador` VARCHAR(191) NULL,
    `personajeCampanaId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CampanaJugadores` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CampanaJugadores_AB_unique`(`A`, `B`),
    INDEX `_CampanaJugadores_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PersonajeToRasgo` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_PersonajeToRasgo_AB_unique`(`A`, `B`),
    INDEX `_PersonajeToRasgo_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ObjetoToPersonaje` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ObjetoToPersonaje_AB_unique`(`A`, `B`),
    INDEX `_ObjetoToPersonaje_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_AccionToPersonaje` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_AccionToPersonaje_AB_unique`(`A`, `B`),
    INDEX `_AccionToPersonaje_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_EstadisticaToPersonaje` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_EstadisticaToPersonaje_AB_unique`(`A`, `B`),
    INDEX `_EstadisticaToPersonaje_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Campana` ADD CONSTRAINT `Campana_dmId_fkey` FOREIGN KEY (`dmId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Campana` ADD CONSTRAINT `Campana_imagenId_fkey` FOREIGN KEY (`imagenId`) REFERENCES `Imagen`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evento` ADD CONSTRAINT `Evento_campanaId_fkey` FOREIGN KEY (`campanaId`) REFERENCES `Campana`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evento` ADD CONSTRAINT `Evento_imagenId_fkey` FOREIGN KEY (`imagenId`) REFERENCES `Imagen`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evento` ADD CONSTRAINT `Evento_personajeCampanaId_fkey` FOREIGN KEY (`personajeCampanaId`) REFERENCES `PersonajeCampana`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Personaje` ADD CONSTRAINT `Personaje_imagenId_fkey` FOREIGN KEY (`imagenId`) REFERENCES `Imagen`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Personaje` ADD CONSTRAINT `Personaje_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Personaje` ADD CONSTRAINT `Personaje_eventoId_fkey` FOREIGN KEY (`eventoId`) REFERENCES `Evento`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PersonajeCampana` ADD CONSTRAINT `PersonajeCampana_personajeId_fkey` FOREIGN KEY (`personajeId`) REFERENCES `Personaje`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PersonajeCampana` ADD CONSTRAINT `PersonajeCampana_campanaId_fkey` FOREIGN KEY (`campanaId`) REFERENCES `Campana`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Objeto` ADD CONSTRAINT `Objeto_catObjetoId_fkey` FOREIGN KEY (`catObjetoId`) REFERENCES `CatObjeto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Objeto` ADD CONSTRAINT `Objeto_personajeCampanaId_fkey` FOREIGN KEY (`personajeCampanaId`) REFERENCES `PersonajeCampana`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rasgo` ADD CONSTRAINT `Rasgo_personajeCampanaId_fkey` FOREIGN KEY (`personajeCampanaId`) REFERENCES `PersonajeCampana`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Accion` ADD CONSTRAINT `Accion_personajeCampanaId_fkey` FOREIGN KEY (`personajeCampanaId`) REFERENCES `PersonajeCampana`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Estadistica` ADD CONSTRAINT `Estadistica_personajeCampanaId_fkey` FOREIGN KEY (`personajeCampanaId`) REFERENCES `PersonajeCampana`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CampanaJugadores` ADD CONSTRAINT `_CampanaJugadores_A_fkey` FOREIGN KEY (`A`) REFERENCES `Campana`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CampanaJugadores` ADD CONSTRAINT `_CampanaJugadores_B_fkey` FOREIGN KEY (`B`) REFERENCES `Usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PersonajeToRasgo` ADD CONSTRAINT `_PersonajeToRasgo_A_fkey` FOREIGN KEY (`A`) REFERENCES `Personaje`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PersonajeToRasgo` ADD CONSTRAINT `_PersonajeToRasgo_B_fkey` FOREIGN KEY (`B`) REFERENCES `Rasgo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ObjetoToPersonaje` ADD CONSTRAINT `_ObjetoToPersonaje_A_fkey` FOREIGN KEY (`A`) REFERENCES `Objeto`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ObjetoToPersonaje` ADD CONSTRAINT `_ObjetoToPersonaje_B_fkey` FOREIGN KEY (`B`) REFERENCES `Personaje`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AccionToPersonaje` ADD CONSTRAINT `_AccionToPersonaje_A_fkey` FOREIGN KEY (`A`) REFERENCES `Accion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AccionToPersonaje` ADD CONSTRAINT `_AccionToPersonaje_B_fkey` FOREIGN KEY (`B`) REFERENCES `Personaje`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_EstadisticaToPersonaje` ADD CONSTRAINT `_EstadisticaToPersonaje_A_fkey` FOREIGN KEY (`A`) REFERENCES `Estadistica`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_EstadisticaToPersonaje` ADD CONSTRAINT `_EstadisticaToPersonaje_B_fkey` FOREIGN KEY (`B`) REFERENCES `Personaje`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
