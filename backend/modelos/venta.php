<?php
    class venta{
        private $conexion;

        public function __construct($conexion){
            $this->conexion = $conexion;
        }

        public function consulta(){
            $sql = "SELECT v.*, c.nombre AS cliente FROM venta v
                    INNER JOIN cliente c ON v.id_cliente = c.id_cliente
                    ORDER BY v.fecha DESC;";
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

        public function insertar($params){
            $sql = "INSERT INTO venta(fecha, total, id_cliente) 
            VALUES('$params->fecha', $params->total, $params->id_cliente)";
            mysqli_query($this->conexion, $sql) or die('no inserto el registro');

            $vec = [];
            $vec['resultado']  = "OK";
            $vec['mensaje'] = "se inserto el registro";

            return $vec;
        }

        public function editar($id, $params){
            $sql = "UPDATE venta SET fecha = '$params->fecha', total = $params->total, id_cliente = $params->id_cliente  
            WHERE id_venta = $id";
            mysqli_query($this->conexion, $sql) or die('no edito el registro');

            $vec = [];
            $vec['resultado']  = "OK";
            $vec['mensaje'] = "se edito el registro";

            return $vec;
        }
    }
?>