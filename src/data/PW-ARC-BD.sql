CREATE TABLE `default`.`Administradores`  (
  `id_admin` int NOT NULL,
  `user` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `ap1` varchar(255) NOT NULL,
  `telefono` varchar(255) NOT NULL,
  `correo` varchar(255) NOT NULL,
  PRIMARY KEY (`id_admin`)
);

CREATE TABLE `default`.`Agencias`  (
  `id_agencia` int NOT NULL,
  `descripcion` text NOT NULL,
  `nombre_agencia` varchar(255) NOT NULL,
  `fecha_registro` date NOT NULL,
  `direccion` varchar(255) NOT NULL,
  `imagen_url` varchar(255) NOT NULL,
  `user` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `telefono` varchar(10) NOT NULL,
  `correo` varchar(255) NOT NULL,
  PRIMARY KEY (`id_agencia`)
);

CREATE TABLE `default`.`Clientes`  (
  `id_cliente` int NOT NULL,
  `usuario` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `ap1` varchar(255) NOT NULL,
  `correo` varchar(255) NOT NULL,
  `telefono` varchar(10) NOT NULL,
  PRIMARY KEY (`id_cliente`)
);

CREATE TABLE `default`.`Eventos`  (
  `id_evento` int NOT NULL,
  `nombre_evento` varchar(255) NOT NULL,
  `descripcion` text NOT NULL,
  `fecha_evento` date NOT NULL,
  `hora_evento` time NOT NULL,
  `fecha_registro` date NOT NULL,
  `precio_boleto` decimal(10, 2) NOT NULL,
  `imagen_url` varchar(255) NOT NULL,
  `id_lugar` int NOT NULL,
  `id_tipo_actividad` int NOT NULL,
  `id_organizadora` int NOT NULL,
  PRIMARY KEY (`id_evento`)
);

CREATE TABLE `default`.`Favoritos`  ();

CREATE TABLE `default`.`Lugares`  (
  `id_lugar` int NOT NULL,
  `nombre_lugar` varchar(255) NOT NULL,
  `descripcion` text NOT NULL,
  `direccion` varchar(255) NOT NULL,
  `ciudad` varchar(255) NOT NULL,
  `zona` varchar(255) NOT NULL,
  `imagen_url` varchar(255) NOT NULL,
  `id_admin` int NOT NULL,
  PRIMARY KEY (`id_lugar`)
);

CREATE TABLE `default`.`Organizadoras`  (
  `id_organizadora` int NOT NULL,
  `user` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `descripcion_agencia` text NOT NULL,
  `nombre_agencia` varchar(255) NOT NULL,
  `fecha_registro` date NOT NULL,
  `direccion` varchar(255) NOT NULL,
  `imagen_url` varchar(255) NOT NULL,
  `telefono` varchar(10) NOT NULL,
  `correo` varchar(255) NOT NULL,
  PRIMARY KEY (`id_organizadora`)
);

CREATE TABLE `default`.`Paquetes`  (
  `id_paquete` int NOT NULL,
  `id_agencia` int NOT NULL,
  `id_lugar` int NOT NULL,
  `precio` decimal(10, 2) NOT NULL,
  `nombre_paquete` varchar(255) NOT NULL,
  `descripcion_paquete` text NOT NULL,
  `imagen_url` varchar(255) NOT NULL,
  PRIMARY KEY (`id_paquete`)
);

CREATE TABLE `default`.`Reservaciones`  (
  `id_reservacion` int NOT NULL,
  `id_evento` int NOT NULL,
  `id_cliente` int NOT NULL,
  `estado` varchar(255) NOT NULL,
  PRIMARY KEY (`id_reservacion`)
);

CREATE TABLE `default`.`TipoActividad`  (
  `id_tipo_actividad` int NOT NULL,
  `nombre_tipo_actividad` varchar(100) NOT NULL,
  `descripcion` text NOT NULL,
  PRIMARY KEY (`id_tipo_actividad`)
);

CREATE TABLE `default`.`Viajes`  (
  `id_viaje` int NOT NULL,
  `id_cliente` int NOT NULL,
  `id_paquete` int NOT NULL,
  `estado` varchar(255) NOT NULL,
  `fecha_viaje` date NOT NULL,
  `hora_viaje` time NOT NULL,
  PRIMARY KEY (`id_viaje`)
);

ALTER TABLE `default`.`Administradores` ADD CONSTRAINT `fk_Administradores_Lugares_1` FOREIGN KEY (`id_admin`) REFERENCES `default`.`Lugares` (`id_admin`);
ALTER TABLE `default`.`Agencias` ADD CONSTRAINT `fk_Agencias_Paquetes_1` FOREIGN KEY (`id_agencia`) REFERENCES `default`.`Paquetes` (`id_agencia`);
ALTER TABLE `default`.`Clientes` ADD CONSTRAINT `fk_Clientes_Viajes_1` FOREIGN KEY (`id_cliente`) REFERENCES `default`.`Viajes` (`id_cliente`);
ALTER TABLE `default`.`Clientes` ADD CONSTRAINT `fk_Clientes_Reservaciones_2` FOREIGN KEY (`id_cliente`) REFERENCES `default`.`Reservaciones` (`id_cliente`);
ALTER TABLE `default`.`Eventos` ADD CONSTRAINT `fk_Eventos_Reservaciones_1` FOREIGN KEY (`id_evento`) REFERENCES `default`.`Reservaciones` (`id_evento`);
ALTER TABLE `default`.`Lugares` ADD CONSTRAINT `fk_Lugares_Eventos_1` FOREIGN KEY (`id_lugar`) REFERENCES `default`.`Eventos` (`id_lugar`);
ALTER TABLE `default`.`Lugares` ADD CONSTRAINT `fk_Lugares_Paquetes_2` FOREIGN KEY (`id_lugar`) REFERENCES `default`.`Paquetes` (`id_lugar`);
ALTER TABLE `default`.`Organizadoras` ADD CONSTRAINT `fk_Organizadoras_Eventos_1` FOREIGN KEY (`id_organizadora`) REFERENCES `default`.`Eventos` (`id_organizadora`);
ALTER TABLE `default`.`Paquetes` ADD CONSTRAINT `fk_Paquetes_Viajes_1` FOREIGN KEY (`id_paquete`) REFERENCES `default`.`Viajes` (`id_paquete`);
ALTER TABLE `default`.`TipoActividad` ADD CONSTRAINT `fk_TipoActividad_Eventos_1` FOREIGN KEY (`id_tipo_actividad`) REFERENCES `default`.`Eventos` (`id_tipo_actividad`);

