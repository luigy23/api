SET @id = (SELECT idPedido FROM pedido WHERE idMesa= 3 ORDER BY Fecha DESC LIMIT 1);
SELECT 
ped.idPedido, 
ped.idMesa,
pro.Nombre,
det.Cantidad,
det.Estado
FROM pedido ped 
	INNER JOIN pedido_productos det ON ped.idPedido=det.idPedido
    INNER JOIN productos pro ON det.codProducto=pro.codProducto
    INNER JOIN usuarios usu ON ped.Usuario=usu.Usuario
WHERE ped.idPedido=@id AND det.Estado="Pendiente"

---------------------
