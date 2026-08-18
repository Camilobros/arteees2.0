<?php
    class Pedido {
        private $conexion;

        public function __construct($conexion){
            $this->conexion = $conexion;
        }

   
        public function consulta(){
            
            $sql = "SELECT v.*, c.nombre AS nombre_cliente, a.nombre AS nombre_artista 
                    FROM venta v
                    LEFT JOIN cliente c ON v.id_cliente = c.id_cliente
                    LEFT JOIN artista a ON v.id_artista = a.id_artista
                    ORDER BY v.id_venta DESC;";
            
            $res = mysqli_query($this->conexion, $sql) or die('no se encontro la tabla venta');

            $vec = [];

            
            while($row = mysqli_fetch_array($res)){
                $vec[] = $row;
            }

            return $vec;
        }

        public function eliminar($id){
            $sql = "DELETE FROM venta WHERE id_venta = $id";
            mysqli_query($this->conexion, $sql) or die('no elimino el registro');

            $vec = [];
            $vec['resultado']  = "OK";
            $vec['mensaje'] = "se elimino el registro";

            return $vec;
        }

        public function insertar($params) {
            
            $id_cliente = $params->id_cliente;
            $productos = $params->productos;
            $subtotal = $params->subtotal;
            $total = $params->total;
            $id_artista = $params->id_artista;
            
            
            $sql = "INSERT INTO venta (id_cliente, productos, subtotal, total, id_artista) 
                    VALUES ($id_cliente, '$productos', $subtotal, $total, $id_artista)";
            
            mysqli_query($this->conexion, $sql) or die("Fallo MySQL: " . mysqli_error($this->conexion));
            
            $vec = [];
            $vec['resultado'] = 'OK';
            $vec['mensaje'] = 'se inserto el registro';
            
            return $vec;
        }

        public function consultap($id){
            $con = "SELECT productos FROM venta WHERE id_venta = $id";
            $res = mysqli_query($this->conexion, $con);
            $row = mysqli_fetch_array($res);
            $vec = unserialize($row[0]);
            return $vec;

        }





        public function editar($id, $params){
            $sql = "UPDATE venta SET 
                        id_cliente = $params->id_cliente, 
                        productos = '$params->productos', 
                        subtotal = $params->subtotal, 
                        total = $params->total, 
                        id_artista = $params->id_artista 
                    WHERE id_venta = $id";
            
            mysqli_query($this->conexion, $sql) or die('no edito el registro');

            $vec = [];
            $vec['resultado']  = "OK";
            $vec['mensaje'] = "se edito el registro";

            
            return $vec; 
        }

    }
?>