<?php

class Pedido {
    // Atributos
    private $conexion;

    public function __construct($conexion) {
        $this->conexion = $conexion;
    }

    // Métodos
    public function consulta() {
        // Hacemos un JOIN para que PHP nos traiga los nombres reales del cliente y del artista
        $sql = "SELECT v.*, c.nombre AS nombre_cliente, a.nombre AS nombre_artista 
                FROM venta v 
                LEFT JOIN cliente c ON v.id_cliente = c.id_cliente
                LEFT JOIN artista a ON v.id_artista = a.id_artista
                ORDER BY v.id_venta DESC";
                
        $res = mysqli_query($this->conexion, $sql) or die("Fallo en la consulta: " . mysqli_error($this->conexion));
        
        $vec = [];
        while($row = mysqli_fetch_assoc($res)) {
            $vec[] = $row;
        }
        return $vec;
    }

    public function eliminar($id) {
        $sql = "DELETE FROM venta WHERE id_venta = $id";
        mysqli_query($this->conexion, $sql) or die("Error al eliminar: " . mysqli_error($this->conexion));
        return ['resultado' => 'ok'];
    }

    public function insertar($params) {
        // Atrapamos tus nuevas columnas de la base de datos
        $id_cliente = $params->id_cliente;
        $productos = $params->productos; 
        $subtotal = $params->subtotal;
        $total = $params->total;
        $id_artista = $params->id_artista;

        $sql = "INSERT INTO venta (id_cliente, productos, subtotal, total, id_artista) 
                VALUES ($id_cliente, '$productos', $subtotal, $total, $id_artista)";
        mysqli_query($this->conexion, $sql) or die("Error al insertar: " . mysqli_error($this->conexion));
        return ['resultado' => 'ok'];
    }

    public function editar($id, $params) {
        $id_cliente = $params->id_cliente;
        $productos = $params->productos;
        $subtotal = $params->subtotal;
        $total = $params->total;
        $id_artista = $params->id_artista;

        $sql = "UPDATE venta SET id_cliente = $id_cliente, productos = '$productos', subtotal = $subtotal, total = $total, id_artista = $id_artista 
                WHERE id_venta = $id";
        mysqli_query($this->conexion, $sql) or die("Error al editar: " . mysqli_error($this->conexion));
        return ['resultado' => 'ok'];
    }
}
?>