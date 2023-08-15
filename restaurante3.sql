-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 15-08-2023 a las 05:11:00
-- Versión del servidor: 10.4.24-MariaDB
-- Versión de PHP: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `restaurante2`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `caja`
--
DROP TABLE IF EXISTS caja;
CREATE TABLE `caja` (
  `idCaja` int(20) NOT NULL,
  `Estado` varchar(30) NOT NULL,
  `SaldoInicial` float NOT NULL,
  `Saldo` float NOT NULL,
  `Fecha` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cargo`
--

CREATE TABLE `cargo` (
  `idCargo` int(4) NOT NULL,
  `Nombre` varchar(30) NOT NULL,
  `Estado` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `cargo`
--

INSERT INTO `cargo` (`idCargo`, `Nombre`, `Estado`) VALUES
(1, 'Administrador', 'Activo'),
(2, 'Cajero', 'Activo'),
(3, 'Mesero', 'Activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria`
--

CREATE TABLE `categoria` (
  `idCategoria` int(11) NOT NULL,
  `Nombre` varchar(30) NOT NULL,
  `Descripcion` varchar(45) DEFAULT NULL,
  `Estado` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `categoria`
--

INSERT INTO `categoria` (`idCategoria`, `Nombre`, `Descripcion`, `Estado`) VALUES
(3, 'Carnes', 'Cerdo Res. etc', ''),
(4, 'Bebidas', 'Jugos, Gaseosas, Malteadas', ''),
(6, 'Otros', 'Aquí los que no tienen asignado', ''),
(9, 'Comida Rapida', 'Comida que es veloz', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cliente`
--

CREATE TABLE `cliente` (
  `Identificación` int(11) NOT NULL,
  `Nombres` varchar(30) NOT NULL,
  `Apellidos` varchar(30) NOT NULL,
  `Telefono` int(11) DEFAULT NULL,
  `Correo` varchar(40) DEFAULT NULL,
  `Estado` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `domicilio`
--

CREATE TABLE `domicilio` (
  `idDomicilio` int(11) NOT NULL,
  `idPedido` int(11) NOT NULL,
  `Direccion` varchar(45) NOT NULL,
  `Telefono` int(11) DEFAULT NULL,
  `UsuDomiciliario` varchar(30) NOT NULL,
  `FechaEntrega` date DEFAULT NULL,
  `Estado` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `factura`
--

CREATE TABLE `factura` (
  `NumFactura` int(11) NOT NULL,
  `idPedido` int(11) NOT NULL,
  `idCaja` int(20) NOT NULL,
  `Subtotal` float NOT NULL,
  `Descuento` float DEFAULT NULL,
  `IVA` float DEFAULT NULL,
  `Total` float NOT NULL,
  `idMetodoPago` int(4) NOT NULL,
  `Recibido` float NOT NULL,
  `Cambio` float DEFAULT NULL,
  `Usuario` varchar(30) NOT NULL,
  `Fecha` datetime NOT NULL,
  `Estado` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mesa`
--

CREATE TABLE `mesa` (
  `idMesa` int(4) NOT NULL,
  `Descripcion` varchar(30) DEFAULT NULL,
  `Estado` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `mesa`
--

INSERT INTO `mesa` (`idMesa`, `Descripcion`, `Estado`) VALUES
(1, '1', 'Disponible'),
(2, '2', 'Disponible'),
(3, '3', 'Sin Pagar'),
(4, '4', 'Ocupado'),
(5, 'Mesa 5', 'Disponible');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `metodospago`
--

CREATE TABLE `metodospago` (
  `idMetodoPago` int(4) NOT NULL,
  `Nombre` varchar(20) NOT NULL,
  `Descripcion` varchar(45) DEFAULT NULL,
  `Estado` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `metodospago`
--

INSERT INTO `metodospago` (`idMetodoPago`, `Nombre`, `Descripcion`, `Estado`) VALUES
(1, 'Efectivo', 'Efectivo', 'Disponible'),
(2, 'Tarjeta', 'Tarjeta', 'Disponible'),
(3, 'Transferencia', 'Transferencia', 'Disponible');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movimientos`
--

CREATE TABLE `movimientos` (
  `idMovimiento` int(11) NOT NULL,
  `NumFactura` int(11) DEFAULT NULL,
  `Monto` int(11) NOT NULL,
  `Descripcion` varchar(30) NOT NULL,
  `Tipo` varchar(20) NOT NULL,
  `idCaja` int(11) NOT NULL,
  `FechaHora` datetime NOT NULL,
  `idPedido` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedido`
--

CREATE TABLE `pedido` (
  `idPedido` int(11) NOT NULL,
  `idMesa` int(4) NOT NULL,
  `Usuario` varchar(30) NOT NULL,
  `idCliente` int(11) DEFAULT NULL,
  `idSede` int(11) NOT NULL,
  `Fecha` datetime NOT NULL,
  `Total` float NOT NULL,
  `Estado` varchar(30) NOT NULL,
  `Cambios` int(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `pedido`
--

INSERT INTO `pedido` (`idPedido`, `idMesa`, `Usuario`, `idCliente`, `idSede`, `Fecha`, `Total`, `Estado`, `Cambios`) VALUES
(1, 4, 'pacogomez', NULL, 123, '2023-08-14 15:07:17', 40000, 'Pendiente', 0),
(2, 3, 'rolo', NULL, 123, '2023-08-14 17:30:02', 17000, 'Entregado', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedido_productos`
--

CREATE TABLE `pedido_productos` (
  `idPedido` int(11) NOT NULL,
  `codProducto` varchar(15) NOT NULL,
  `Cantidad` int(10) NOT NULL DEFAULT 1,
  `Precio` float NOT NULL,
  `Comentario` varchar(45) DEFAULT NULL,
  `Estado` varchar(30) NOT NULL,
  `Total` float GENERATED ALWAYS AS (`Cantidad` * `Precio`) VIRTUAL,
  `idRegistro` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `pedido_productos`
--

INSERT INTO `pedido_productos` (`idPedido`, `codProducto`, `Cantidad`, `Precio`, `Comentario`, `Estado`, `idRegistro`) VALUES
(1, 'bbybeff2', 1, 23000, '', 'Pendiente', 0),
(1, 'buguer2', 1, 12000, '', 'Pendiente', 0),
(1, 'Cocacola1', 1, 5000, '', 'Pendiente', 0),
(2, 'buguer2', 1, 12000, '', 'Listo', 0),
(2, 'Cocacola1', 1, 5000, '', 'Listo', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `codProducto` varchar(15) NOT NULL,
  `Nombre` varchar(30) NOT NULL,
  `Descripcion` text DEFAULT NULL,
  `idCategoria` int(11) NOT NULL,
  `Precio` float NOT NULL,
  `Imagen` varchar(255) DEFAULT NULL,
  `Estado` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`codProducto`, `Nombre`, `Descripcion`, `idCategoria`, `Precio`, `Imagen`, `Estado`) VALUES
('bbybeff2', 'Baby Beef', 'carne, maduro con queso, papas a la francesa', 3, 23000, 'http://localhost:4000/productos/imagenes/bbybeff2', 'Disponible'),
('buguer2', 'Hamburguesa Criolla', 'Deliciosa hamburguesa con 250g de res queso tomate', 9, 12000, 'http://localhost:4000/productos/imagenes/buguer2', 'Disponible'),
('Cocacola1', 'Cocacola 1.5', '1.5 litros  retornable', 4, 5000, 'http://localhost:4000/productos/imagenes/Cocacola1', 'Disponible'),
('costillasbbq', 'Costillas bbq', 'Ricas Costillas con papas', 3, 35000, 'http://localhost:4000/productos/imagenes/costillasbbq', 'Disponible'),
('dev', 'un luigy', 'un luigy pues', 6, 1000000, '/productos/imagenes/dev', 'Disponible');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sedes`
--

CREATE TABLE `sedes` (
  `RegistroMercantil` int(11) NOT NULL,
  `NombreSede` varchar(30) NOT NULL,
  `Direccion` varchar(40) DEFAULT NULL,
  `Telefono` int(11) DEFAULT NULL,
  `Estado` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `sedes`
--

INSERT INTO `sedes` (`RegistroMercantil`, `NombreSede`, `Direccion`, `Telefono`, `Estado`) VALUES
(123, 'Sede A', 'Carrera 7 - Calle 16', 2147483647, 'Activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `Usuario` varchar(30) NOT NULL,
  `Nombres` varchar(30) NOT NULL,
  `Apellidos` varchar(30) NOT NULL,
  `FechaNacimiento` date DEFAULT NULL,
  `idCargo` int(4) NOT NULL,
  `Contraseña` varchar(75) NOT NULL,
  `Estado` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`Usuario`, `Nombres`, `Apellidos`, `FechaNacimiento`, `idCargo`, `Contraseña`, `Estado`) VALUES
('admin', 'Administrador', '', '2000-02-09', 1, '$2b$10$1BsoVrtCWgs7z834klnweeEgIcrCNaaFYHCONf6/uZ04lqlfqZXwq', 'Activo'),
('luigy', 'Luigy', 'Leonardo', '2003-02-23', 3, '$2b$10$M9exDp/nb3GjWTU.dkjg/.t0KheKw5p9MZYf4qci.JulgO55VJImO', 'Activo'),
('pacogomez', 'paco', 'gomez', '1998-02-23', 1, '$2b$10$NAwP4NuuSzeeo4x27kDTX.BvkphgO45USYAJYa61tD4T1U8wdOeiy', 'Eliminado'),
('rolo', 'Juan', 'Hernandez', '2000-12-31', 2, '$2b$10$ttTG3/99TtMgXR83l3AG2ehGqb8.UlZHZ3EYdTJKpx03S/vj71gPu', 'Activo');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `caja`
--
ALTER TABLE `caja`
  ADD PRIMARY KEY (`idCaja`);

--
-- Indices de la tabla `cargo`
--
ALTER TABLE `cargo`
  ADD PRIMARY KEY (`idCargo`);

--
-- Indices de la tabla `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`idCategoria`);

--
-- Indices de la tabla `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`Identificación`);

--
-- Indices de la tabla `domicilio`
--
ALTER TABLE `domicilio`
  ADD PRIMARY KEY (`idDomicilio`),
  ADD KEY `fk_Domicilio_Pedido1` (`idPedido`),
  ADD KEY `fk_Domicilio_Usuarios1` (`UsuDomiciliario`);

--
-- Indices de la tabla `factura`
--
ALTER TABLE `factura`
  ADD PRIMARY KEY (`NumFactura`),
  ADD KEY `fk_Factura_Pedido1` (`idPedido`),
  ADD KEY `fk_Factura_MetodosPago1` (`idMetodoPago`),
  ADD KEY `fk_Factura_Caja1` (`idCaja`),
  ADD KEY `fk_Factura_Usuarios1` (`Usuario`);

--
-- Indices de la tabla `mesa`
--
ALTER TABLE `mesa`
  ADD PRIMARY KEY (`idMesa`);

--
-- Indices de la tabla `metodospago`
--
ALTER TABLE `metodospago`
  ADD PRIMARY KEY (`idMetodoPago`);

--
-- Indices de la tabla `movimientos`
--
ALTER TABLE `movimientos`
  ADD PRIMARY KEY (`idMovimiento`),
  ADD KEY `NumFactura` (`NumFactura`),
  ADD KEY `idPedido` (`idPedido`);

--
-- Indices de la tabla `pedido`
--
ALTER TABLE `pedido`
  ADD PRIMARY KEY (`idPedido`),
  ADD KEY `fk_Pedido_Sedes1` (`idSede`),
  ADD KEY `fk_Pedido_Mesa1` (`idMesa`),
  ADD KEY `fk_Pedido_Cliente1` (`idCliente`),
  ADD KEY `fk_Pedido_Usuarios1` (`Usuario`);

--
-- Indices de la tabla `pedido_productos`
--
ALTER TABLE `pedido_productos`
  ADD PRIMARY KEY (`idRegistro`,`idPedido`,`codProducto`),
  ADD KEY `fk_Pedido_Productos_Pedido1` (`idPedido`),
  ADD KEY `fk_Pedido_Productos_Productos1` (`codProducto`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`codProducto`),
  ADD KEY `fk_Productos_Categoria1` (`idCategoria`);

--
-- Indices de la tabla `sedes`
--
ALTER TABLE `sedes`
  ADD PRIMARY KEY (`RegistroMercantil`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`Usuario`),
  ADD KEY `fk_Usuarios_Cargo` (`idCargo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `caja`
--
ALTER TABLE `caja`
  MODIFY `idCaja` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `categoria`
--
ALTER TABLE `categoria`
  MODIFY `idCategoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `factura`
--
ALTER TABLE `factura`
  MODIFY `NumFactura` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `metodospago`
--
ALTER TABLE `metodospago`
  MODIFY `idMetodoPago` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `movimientos`
--
ALTER TABLE `movimientos`
  MODIFY `idMovimiento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT de la tabla `pedido`
--
ALTER TABLE `pedido`
  MODIFY `idPedido` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `domicilio`
--
ALTER TABLE `domicilio`
  ADD CONSTRAINT `fk_Domicilio_Pedido1` FOREIGN KEY (`idPedido`) REFERENCES `pedido` (`idPedido`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Domicilio_Usuarios1` FOREIGN KEY (`UsuDomiciliario`) REFERENCES `usuarios` (`Usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `factura`
--
ALTER TABLE `factura`
  ADD CONSTRAINT `factura_ibfk_1` FOREIGN KEY (`idCaja`) REFERENCES `caja` (`idCaja`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_Factura_MetodosPago1` FOREIGN KEY (`idMetodoPago`) REFERENCES `metodospago` (`idMetodoPago`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_Factura_Pedido1` FOREIGN KEY (`idPedido`) REFERENCES `pedido` (`idPedido`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Factura_Usuarios1` FOREIGN KEY (`Usuario`) REFERENCES `usuarios` (`Usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `movimientos`
--
ALTER TABLE `movimientos`
  ADD CONSTRAINT `movimientos_ibfk_1` FOREIGN KEY (`NumFactura`) REFERENCES `factura` (`NumFactura`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `movimientos_ibfk_2` FOREIGN KEY (`idPedido`) REFERENCES `pedido` (`idPedido`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `pedido`
--
ALTER TABLE `pedido`
  ADD CONSTRAINT `fk_Pedido_Cliente1` FOREIGN KEY (`idCliente`) REFERENCES `cliente` (`Identificación`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Pedido_Mesa1` FOREIGN KEY (`idMesa`) REFERENCES `mesa` (`idMesa`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Pedido_Sedes1` FOREIGN KEY (`idSede`) REFERENCES `sedes` (`RegistroMercantil`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `usuarios` FOREIGN KEY (`Usuario`) REFERENCES `usuarios` (`Usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `pedido_productos`
--
ALTER TABLE `pedido_productos`
  ADD CONSTRAINT `fk_Pedido_Productos_Pedido1` FOREIGN KEY (`idPedido`) REFERENCES `pedido` (`idPedido`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Pedido_Productos_Productos1` FOREIGN KEY (`codProducto`) REFERENCES `productos` (`codProducto`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `fk_Productos_Categoria1` FOREIGN KEY (`idCategoria`) REFERENCES `categoria` (`idCategoria`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `fk_Usuarios_Cargo` FOREIGN KEY (`idCargo`) REFERENCES `cargo` (`idCargo`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
