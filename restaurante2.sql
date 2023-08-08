-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 05-08-2023 a las 19:49:10
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

--
-- Volcado de datos para la tabla `caja`
--

INSERT INTO `caja` (`idCaja`, `Estado`, `SaldoInicial`, `Saldo`, `Fecha`) VALUES
(15, 'Activa', 100000, 599000, '2023-04-16'),
(16, 'Activa', 50000, 377000, '2023-04-21'),
(17, 'Activa', 100000, 923000, '2023-07-15'),
(18, 'Activa', 5000, 5000, '2023-07-20'),
(19, 'Activa', 5000, 5000, '2023-07-20'),
(20, 'Activa', 5000, 5000, '2023-07-20'),
(21, 'Activa', 5000, 5000, '2023-07-20'),
(22, 'Activa', 5000, 5000, '2023-07-20'),
(23, 'Activa', 5000, 5000, '2023-07-20'),
(24, 'Activa', 10000, 196000, '2023-07-22');

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
(1, '', 'Activo'),
(2, 'Tarjeta', 'Pago por tarjeta');

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

--
-- Volcado de datos para la tabla `factura`
--

INSERT INTO `factura` (`NumFactura`, `idPedido`, `idCaja`, `Subtotal`, `Descuento`, `IVA`, `Total`, `idMetodoPago`, `Recibido`, `Cambio`, `Usuario`, `Fecha`, `Estado`) VALUES
(1, 1, 15, 40000, 0, 0, 40000, 3, 40000, 0, 'JPEREZ', '2023-04-16 22:01:06', 'Pagado'),
(2, 2, 15, 12000, 0, 0, 12000, 2, 12000, 0, 'JPEREZ', '2023-04-16 22:06:53', 'Pagado'),
(3, 3, 15, 35000, 0, 0, 35000, 2, 35000, 0, 'JPEREZ', '2023-04-18 19:21:55', 'Pagado'),
(4, 4, 16, 63000, 0, 0, 63000, 3, 63000, 0, 'JPEREZ', '2023-04-21 16:35:46', 'Pagado'),
(5, 5, 16, 82000, 0, 0, 82000, 2, 82000, 0, 'JPEREZ', '2023-04-21 16:44:19', 'Pagado'),
(6, 6, 16, 12000, 0, 0, 12000, 1, 20000, 8000, 'JPEREZ', '2023-04-21 16:50:50', 'Pagado'),
(7, 7, 16, 5000, 0, 0, 5000, 2, 5000, 0, 'JPEREZ', '2023-04-21 17:41:47', 'Pagado'),
(8, 8, 16, 75000, 0, 0, 75000, 3, 75000, 0, 'JPEREZ', '2023-04-21 18:00:19', 'Pagado'),
(9, 9, 16, 40000, 0, 0, 40000, 1, 50000, 10000, 'JPEREZ', '2023-04-26 16:48:55', 'Pagado'),
(10, 11, 16, 22000, 0, 0, 22000, 1, 30000, 8000, 'JPEREZ', '2023-04-26 16:51:24', 'Pagado'),
(11, 13, 16, 28000, 0, 0, 28000, 2, 28000, 0, 'JPEREZ', '2023-07-08 19:29:31', 'Pagado'),
(12, 12, 17, 103000, 3000, 0, 100000, 1, 110000, 10000, 'JPEREZ', '2023-07-15 22:53:44', 'Pagado'),
(13, 14, 17, 29000, 2000, 0, 27000, 1, 30000, 3000, 'JPEREZ', '2023-07-16 17:04:19', 'Pagado'),
(14, 15, 17, 63000, 0, 0, 63000, 3, 63000, 0, 'JPEREZ', '2023-07-18 13:04:29', 'Pagado'),
(15, 16, 17, 5000, 0, 0, 5000, 1, 10000, 5000, 'JPEREZ', '2023-07-18 13:04:47', 'Pagado'),
(16, 20, 17, 35000, 0, 0, 35000, 2, 35000, 0, 'JPEREZ', '2023-07-18 13:13:42', 'Pagado'),
(17, 21, 17, 28000, 0, 0, 28000, 3, 28000, 0, 'JPEREZ', '2023-07-18 13:13:51', 'Pagado'),
(18, 23, 17, 108000, 0, 0, 108000, 2, 108000, 0, 'JPEREZ', '2023-07-18 13:18:23', 'Pagado'),
(19, 23, 17, 143000, 0, 0, 143000, 1, 150000, 7000, 'JPEREZ', '2023-07-18 13:19:19', 'Pagado'),
(20, 22, 17, 17000, 0, 0, 17000, 3, 17000, 0, 'JPEREZ', '2023-07-18 13:28:41', 'Pagado'),
(21, 24, 17, 70000, 0, 0, 70000, 2, 70000, 0, 'JPEREZ', '2023-07-18 13:28:49', 'Pagado'),
(22, 17, 17, 40000, 0, 0, 40000, 2, 40000, 0, 'JPEREZ', '2023-07-18 13:28:58', 'Pagado'),
(23, 18, 17, 58000, 0, 0, 58000, 2, 58000, 0, 'JPEREZ', '2023-07-18 13:30:50', 'Pagado'),
(24, 26, 17, 35000, 0, 0, 35000, 2, 35000, 0, 'JPEREZ', '2023-07-18 13:37:15', 'Pagado'),
(25, 29, 17, 47000, 0, 0, 47000, 2, 47000, 0, 'JPEREZ', '2023-07-18 14:27:13', 'Pagado'),
(26, 27, 17, 47000, 0, 0, 47000, 3, 47000, 0, 'JPEREZ', '2023-07-20 13:12:50', 'Pagado'),
(27, 25, 24, 70000, 5000, 0, 65000, 1, 30000, -35000, 'JPEREZ', '2023-07-31 17:44:22', 'Pagado'),
(28, 32, 24, 63000, 0, 0, 63000, 2, 63000, 0, 'JPEREZ', '2023-07-31 17:45:04', 'Pagado'),
(29, 28, 24, 58000, 0, 0, 58000, 3, 58000, 0, 'luigy23', '2023-07-31 17:48:34', 'Pagado');

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
(2, '2', 'Ocupado'),
(3, '3', 'Disponible'),
(4, '4', 'Disponible'),
(5, 'Mesa 5', 'Sin Pagar');

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

--
-- Volcado de datos para la tabla `movimientos`
--

INSERT INTO `movimientos` (`idMovimiento`, `NumFactura`, `Monto`, `Descripcion`, `Tipo`, `idCaja`, `FechaHora`, `idPedido`) VALUES
(1, 1, 40000, '3', 'Ingreso', 15, '2023-04-16 22:01:06', NULL),
(2, 2, 12000, '2', 'Ingreso', 15, '2023-04-16 22:06:53', NULL),
(3, 3, 35000, '2', 'Ingreso', 15, '2023-04-18 19:21:56', NULL),
(4, 4, 63000, '3', 'Ingreso', 16, '2023-04-21 16:35:46', NULL),
(5, 5, 82000, '2', 'Ingreso', 16, '2023-04-21 16:44:19', NULL),
(6, 6, 12000, '1', 'Ingreso', 16, '2023-04-21 16:50:50', NULL),
(7, 7, 5000, '2', 'Ingreso', 16, '2023-04-21 17:41:47', NULL),
(8, 8, 75000, '3', 'Ingreso', 16, '2023-04-21 18:00:19', NULL),
(9, 9, 40000, '1', 'Ingreso', 16, '2023-04-26 16:48:55', NULL),
(10, 10, 22000, '1', 'Ingreso', 16, '2023-04-26 16:51:24', NULL),
(11, 11, 28000, '2', 'Ingreso', 16, '2023-07-08 19:29:31', NULL),
(12, 12, 100000, '1', 'Ingreso', 17, '2023-07-15 22:53:44', NULL),
(13, 13, 27000, '1', 'Ingreso', 17, '2023-07-16 17:04:19', NULL),
(14, 14, 63000, '3', 'Ingreso', 17, '2023-07-18 13:04:29', NULL),
(15, 15, 5000, '1', 'Ingreso', 17, '2023-07-18 13:04:47', NULL),
(16, 16, 35000, '2', 'Ingreso', 17, '2023-07-18 13:13:42', NULL),
(17, 17, 28000, '3', 'Ingreso', 17, '2023-07-18 13:13:51', NULL),
(18, 18, 108000, '2', 'Ingreso', 17, '2023-07-18 13:18:23', NULL),
(19, 19, 143000, '1', 'Ingreso', 17, '2023-07-18 13:19:19', NULL),
(20, 20, 17000, '3', 'Ingreso', 17, '2023-07-18 13:28:41', NULL),
(21, 21, 70000, '2', 'Ingreso', 17, '2023-07-18 13:28:49', NULL),
(22, 22, 40000, '2', 'Ingreso', 17, '2023-07-18 13:28:58', NULL),
(23, 23, 58000, '2', 'Ingreso', 17, '2023-07-18 13:30:50', NULL),
(24, 24, 35000, '2', 'Ingreso', 17, '2023-07-18 13:37:15', NULL),
(25, 25, 47000, '2', 'Ingreso', 17, '2023-07-18 14:27:13', NULL),
(26, 26, 47000, '3', 'Ingreso', 17, '2023-07-20 13:12:50', 27),
(27, 27, 65000, '1', 'Ingreso', 24, '2023-07-31 17:44:22', 25),
(28, 28, 63000, '2', 'Ingreso', 24, '2023-07-31 17:45:04', 32),
(29, 29, 58000, '3', 'Ingreso', 24, '2023-07-31 17:48:34', 28);

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
(1, 1, 'JPEREZ', NULL, 123, '2023-04-16 21:15:41', 40000, 'Facturado', 0),
(2, 2, 'JPEREZ', NULL, 123, '2023-04-16 22:04:32', 12000, 'Facturado', 0),
(3, 1, 'JPEREZ', NULL, 123, '2023-04-18 19:21:29', 35000, 'Facturado', 0),
(4, 1, 'JPEREZ', NULL, 123, '2023-04-21 16:34:52', 63000, 'Facturado', 0),
(5, 3, 'JPEREZ', NULL, 123, '2023-04-21 16:42:50', 17000, 'Facturado', 1),
(6, 1, 'JPEREZ', NULL, 123, '2023-04-21 16:50:17', 12000, 'Facturado', 0),
(7, 1, 'JPEREZ', NULL, 123, '2023-04-21 17:41:38', 5000, 'Facturado', 0),
(8, 4, 'JPEREZ', NULL, 123, '2023-04-21 17:59:11', 75000, 'Facturado', 0),
(9, 3, 'JPEREZ', NULL, 123, '2023-04-26 16:28:48', 28000, 'Facturado', 1),
(10, 1, 'JPEREZ', NULL, 123, '2023-04-26 16:30:35', 51000, 'Entregado', 0),
(11, 1, 'JPEREZ', NULL, 123, '2023-04-26 16:32:28', 12000, 'Facturado', 2),
(12, 2, 'JPEREZ', NULL, 123, '2023-04-26 16:39:14', 35000, 'Facturado', 4),
(13, 4, 'JPEREZ', NULL, 123, '2023-07-08 19:28:39', 28000, 'Facturado', 0),
(14, 3, 'JPEREZ', NULL, 123, '2023-07-16 15:53:50', 29000, 'Facturado', 0),
(15, 1, 'JPEREZ', NULL, 123, '2023-07-16 17:42:15', 63000, 'Facturado', 0),
(16, 2, 'JPEREZ', NULL, 123, '2023-07-17 18:04:48', 28000, 'Facturado', 0),
(17, 3, 'JPEREZ', NULL, 123, '2023-07-18 12:51:56', 40000, 'Facturado', 0),
(18, 4, 'JPEREZ', NULL, 123, '2023-07-18 12:52:16', 58000, 'Facturado', 0),
(19, 5, 'JPEREZ', NULL, 123, '2023-07-18 13:03:00', 17000, 'Entregado', 0),
(20, 1, 'JPEREZ', NULL, 123, '2023-07-18 13:05:22', 35000, 'Facturado', 0),
(21, 2, 'JPEREZ', NULL, 123, '2023-07-18 13:05:38', 28000, 'Facturado', 0),
(22, 1, 'JPEREZ', NULL, 123, '2023-07-18 13:14:29', 17000, 'Facturado', 0),
(23, 2, 'JPEREZ', NULL, 123, '2023-07-18 13:14:41', 108000, 'Facturado', 1),
(24, 2, 'JPEREZ', NULL, 123, '2023-07-18 13:27:18', 70000, 'Facturado', 0),
(25, 1, 'JPEREZ', NULL, 123, '2023-07-18 13:31:26', 70000, 'Facturado', 0),
(26, 2, 'JPEREZ', NULL, 123, '2023-07-18 13:31:35', 35000, 'Facturado', 0),
(27, 3, 'JPEREZ', NULL, 123, '2023-07-18 13:31:40', 47000, 'Facturado', 0),
(28, 4, 'JPEREZ', NULL, 123, '2023-07-18 13:35:01', 58000, 'Facturado', 0),
(29, 2, 'JPEREZ', NULL, 123, '2023-07-18 13:37:24', 47000, 'Facturado', 0),
(30, 3, 'JPEREZ', NULL, 123, '2023-07-31 16:26:32', 24000, 'Cancelado', 0),
(31, 2, 'luigy23', NULL, 123, '2023-07-31 17:35:45', 12000, 'Pendiente', 0),
(32, 3, 'luigy23', NULL, 123, '2023-07-31 17:37:52', 23000, 'Facturado', 2);

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
(1, 'bbybeff2', 1, 23000, '', 'Listo', 0),
(1, 'buguer2', 1, 12000, '', 'Listo', 0),
(1, 'Cocacola1', 1, 5000, '', 'Listo', 0),
(2, 'buguer2', 1, 12000, '', 'Listo', 0),
(3, 'bbybeff2', 1, 23000, 'bien asado', 'Listo', 0),
(3, 'buguer2', 1, 12000, '', 'Listo', 0),
(4, 'bbybeff2', 1, 23000, '', 'Listo', 0),
(4, 'Cocacola1', 1, 5000, '', 'Listo', 0),
(4, 'costillasbbq', 1, 35000, '', 'Listo', 0),
(5, 'buguer2', 1, 12000, '', 'Listo', 0),
(5, 'Cocacola1', 1, 5000, '', 'Listo', 0),
(6, 'buguer2', 1, 12000, '', 'Listo', 0),
(7, 'Cocacola1', 1, 5000, '', 'Listo', 0),
(8, 'bbybeff2', 1, 23000, '', 'Listo', 0),
(8, 'buguer2', 1, 12000, '', 'Listo', 0),
(8, 'Cocacola1', 1, 5000, '', 'Listo', 0),
(8, 'costillasbbq', 1, 35000, '', 'Listo', 0),
(9, 'bbybeff2', 1, 23000, '', 'Listo', 0),
(9, 'Cocacola1', 1, 5000, '', 'Pendiente', 0),
(10, 'bbybeff2', 2, 23000, 'bien asado\n undefined', 'Listo', 0),
(10, 'Cocacola1', 1, 5000, '', 'Listo', 0),
(11, 'buguer2', 1, 12000, '', 'Listo', 0),
(12, 'bbybeff2', 1, 23000, '', 'Listo', 0),
(12, 'buguer2', 1, 12000, '', 'Listo', 0),
(13, 'bbybeff2', 1, 23000, '', 'Listo', 0),
(13, 'Cocacola1', 1, 5000, 'bien fria', 'Listo', 0),
(14, 'buguer2', 2, 12000, '', 'Listo', 0),
(14, 'Cocacola1', 1, 5000, '', 'Listo', 0),
(15, 'bbybeff2', 1, 23000, '', 'Listo', 0),
(15, 'Cocacola1', 1, 5000, '', 'Listo', 0),
(15, 'costillasbbq', 1, 35000, '', 'Listo', 0),
(16, 'bbybeff2', 1, 23000, '', 'Cancelado', 0),
(16, 'Cocacola1', 1, 5000, '', 'Listo', 0),
(17, 'bbybeff2', 1, 23000, '', 'Listo', 0),
(17, 'buguer2', 1, 12000, '', 'Listo', 0),
(17, 'Cocacola1', 1, 5000, '', 'Listo', 0),
(18, 'bbybeff2', 1, 23000, '', 'Listo', 0),
(18, 'costillasbbq', 1, 35000, '', 'Listo', 0),
(19, 'buguer2', 1, 12000, '', 'Listo', 0),
(19, 'Cocacola1', 1, 5000, '', 'Listo', 0),
(20, 'bbybeff2', 1, 23000, '', 'Listo', 0),
(20, 'buguer2', 1, 12000, '', 'Listo', 0),
(21, 'bbybeff2', 1, 23000, '', 'Listo', 0),
(21, 'Cocacola1', 1, 5000, '', 'Listo', 0),
(22, 'buguer2', 1, 12000, '', 'Listo', 0),
(22, 'Cocacola1', 1, 5000, '', 'Listo', 0),
(23, 'bbybeff2', 2, 23000, '', 'Listo', 0),
(23, 'buguer2', 1, 12000, '', 'Listo', 0),
(23, 'Cocacola1', 3, 5000, '', 'Listo', 0),
(23, 'costillasbbq', 1, 35000, '', 'Listo', 0),
(24, 'bbybeff2', 1, 23000, '', 'Listo', 0),
(24, 'buguer2', 1, 12000, '', 'Listo', 0),
(24, 'costillasbbq', 1, 35000, '', 'Listo', 0),
(25, 'bbybeff2', 1, 23000, '', 'Listo', 0),
(25, 'buguer2', 1, 12000, '', 'Listo', 0),
(25, 'costillasbbq', 1, 35000, '', 'Pendiente', 0),
(26, 'bbybeff2', 1, 23000, '', 'Listo', 0),
(26, 'buguer2', 1, 12000, '', 'Listo', 0),
(27, 'buguer2', 1, 12000, '', 'Listo', 0),
(27, 'costillasbbq', 1, 35000, '', 'Listo', 0),
(28, 'bbybeff2', 1, 23000, '', 'Listo', 0),
(28, 'costillasbbq', 1, 35000, '', 'Listo', 0),
(29, 'buguer2', 1, 12000, '', 'Listo', 0),
(29, 'costillasbbq', 1, 35000, '', 'Listo', 0),
(30, 'buguer2', 2, 12000, NULL, 'Cancelado', 0),
(31, 'buguer2', 1, 12000, '', 'Pendiente', 0),
(32, 'bbybeff2', 1, 23000, '', 'Listo', 0),
(5, 'buguer2', 5, 12000, '', 'Listo', 1),
(5, 'Cocacola1', 1, 5000, '', 'Listo', 1),
(9, 'buguer2', 1, 12000, '', 'Pendiente', 1),
(11, 'Cocacola1', 1, 5000, '', 'Listo', 1),
(12, 'bbybeff2', 1, 23000, '', 'Listo', 1),
(12, 'buguer2', 1, 12000, '', 'Listo', 1),
(23, 'bbybeff2', 1, 23000, '', 'Listo', 1),
(23, 'buguer2', 1, 12000, '', 'Listo', 1),
(32, 'bbybeff2', 1, 23000, '', 'Listo', 1),
(32, 'Cocacola1', 1, 5000, '', 'Listo', 1),
(11, 'Cocacola1', 1, 5000, '', 'Listo', 2),
(12, 'bbybeff2', 1, 23000, '', 'Listo', 2),
(32, 'buguer2', 1, 12000, '', 'Listo', 2),
(12, 'Cocacola1', 1, 5000, 'con nharto hielp', 'Listo', 3),
(12, 'Cocacola1', 1, 5000, 'con nharto hielp', 'Listo', 4);

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
('JPEREZ', 'Juan', 'Perez', '2002-07-17', 1, 'Luigyelhacker', 'Activo'),
('luigy23', 'luigy', 'leonardo', '2003-02-23', 1, '$2b$10$1LqRsb0xzj0.pax75kmtxuVe60OKwH6IONBOjgF9BK3hk/5NNb7Yy', 'Activo');

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
  MODIFY `NumFactura` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT de la tabla `metodospago`
--
ALTER TABLE `metodospago`
  MODIFY `idMetodoPago` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `movimientos`
--
ALTER TABLE `movimientos`
  MODIFY `idMovimiento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT de la tabla `pedido`
--
ALTER TABLE `pedido`
  MODIFY `idPedido` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

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
  ADD CONSTRAINT `fk_Pedido_Usuarios1` FOREIGN KEY (`Usuario`) REFERENCES `usuarios` (`Usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

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
  ADD CONSTRAINT `fk_Usuarios_Cargo` FOREIGN KEY (`idCargo`) REFERENCES `cargo` (`idCargo`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
