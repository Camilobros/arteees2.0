<?php
    class detalle_venta{
        private $conexion;

        public function __construct($conexion){
            $this->conexion = $conexion;
        }

        public function consulta(){
            $sql = "SELECT dv.*, o.titulo AS obra FROM detalle_venta dv
                    INNER JOIN obra o ON dv.id_obra = o.id_obra
                    ORDER BY dv.id_detalle;";
            $res = mysqli_query($this->conexion, $sql) or die('no se encontro la tabla detalle_venta');

            $vec = [];

            while($row = mysqli_fetch_array($res)){
                $vec[] = $row;
            }

            return $vec;
        }

        public function eliminar($id){
            $sql = "DELETE FROM detalle_venta WHERE id_detalle = $id";
            mysqli_query($this->conexion, $sql) or die('no elimino el registro');

            $vec = [];
            $vec['resultado']  = "OK";
            $vec['mensaje'] = "se elimino el registro";

            return $vec;
        }

        public function insertar($params){
            $sql = "INSERT INTO detalle_venta(cantidad, precio_unitario, id_venta, id_obra) 
            VALUES($params->cantidad, $params->precio_unitario, $params->id_venta, $params->id_obra)";
            mysqli_query($this->conexion, $sql) or die('no inserto el registro');

            $vec = [];
            $vec['resultado']  = "OK";
            $vec['mensaje'] = "se inserto el registro";

            return $vec;
        }

        public function editar($id, $params){
            $sql = "UPDATE detalle_venta SET cantidad = $params->cantidad, precio_unitario = $params->precio_unitario, id_venta = $params->id_venta, id_obra = $params->id_obra  
            WHERE id_detalle = $id";
            mysqli_query($this->conexion, $sql) or die('no edito el registro');

            $vec = [];
            $vec['resultado']  = "OK";
            $vec['mensaje'] = "se edito el registro";

            return $vec;
        }
    }
?>