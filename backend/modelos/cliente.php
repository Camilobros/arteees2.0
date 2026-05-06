<?php
    class cliente{
    //atributos
        private $conexion;

        public function __construct($conexion){
            $this->conexion = $conexion;
        }

        //metodos
        public function consulta(){
            $sql = "SELECT * FROM cliente ORDER BY nombre";
            $res = mysqli_query($this->conexion, $sql) or die('no se encontro la tabla cliente');

            $vec = [];

            while($row = mysqli_fetch_array($res)){
                $vec[] = $row;
            }

            return $vec;
        }

                public function consulta2($id_direccion){
            $sql = "SELECT * FROM cliente WHERE direccion = $id_direccion ORDER BY nombre";
            $res = mysqli_query($this->conexion, $sql) or die('no se encontro la tabla cliente');

            $vec = [];

            while($row = mysqli_fetch_array($res)){
                $vec[] = $row;
            }

            return $vec;
        }

        public function eliminar($id){
            $sql = "DELETE FROM cliente WHERE id_cliente = $id";
            mysqli_query($this->conexion, $sql) or die('no elemino el registro');

            $vec = [];
            $vec['resultado']  = "OK";
            $vec['mensaje'] = "se elimino el registro";

            return $vec;
        }

        public function insertar($params){
            $sql = "INSERT INTO cliente(nombre, correo, direccion) VALUES('$params->nombre', 1, $params->direccion)";
            mysqli_query($this->conexion, $sql) or die('no inserto el registro');

            $vec = [];
            $vec['resultado']  = "OK";
            $vec['mensaje'] = "se inserto el registro";

            return $vec;
        }

        public function editar($id, $params){
            $sql = "UPDATE cliente SET nombre = '$params->nombre', direccion = $params ->direccion WHERE id_cliente = $id";
            mysqli_query($this->conexion, $sql) or die('no edito el registro');

            $vec = [];
            $vec['resultado']  = "OK";
            $vec['mensaje'] = "se edito el registro";

        }

    }



?>