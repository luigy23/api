 -- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 03-01-2025 a las 20:32:13
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
  `Estado` varchar(30) NOT NULL,
  `Direccion` text DEFAULT NULL
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
  `Estado` varchar(30) NOT NULL,
  `Propina` float NOT NULL DEFAULT 0,
  `Comentario` text DEFAULT NULL
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
-- Disparadores `pedido_productos`
--
DELIMITER $$
CREATE TRIGGER `update_pedido_total` AFTER UPDATE ON `pedido_productos` FOR EACH ROW BEGIN
    IF NEW.Estado = 'Listo' THEN
        UPDATE pedido
        SET Total = (
            SELECT COALESCE(SUM(Total), 0)
            FROM pedido_productos
            WHERE idPedido = NEW.idPedido
            AND Estado = 'Listo'
        )
        WHERE idPedido = NEW.idPedido;
    END IF;
END
$$
DELIMITER ;

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
  `Estado` varchar(30) NOT NULL,
  `Stock` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
  MODIFY `idCaja` int(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `categoria`
--
ALTER TABLE `categoria`
  MODIFY `idCategoria` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `factura`
--
ALTER TABLE `factura`
  MODIFY `NumFactura` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `mesa`
--
ALTER TABLE `mesa`
  MODIFY `idMesa` int(4) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `metodospago`
--
ALTER TABLE `metodospago`
  MODIFY `idMetodoPago` int(4) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `movimientos`
--
ALTER TABLE `movimientos`
  MODIFY `idMovimiento` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pedido`
--
ALTER TABLE `pedido`
  MODIFY `idPedido` int(11) NOT NULL AUTO_INCREMENT;

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
  ADD CONSTRAINT `fk_Pedido_Mesa1` FOREIGN KEY (`idMesa`) REFERENCES `mesa` (`idMesa`),
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