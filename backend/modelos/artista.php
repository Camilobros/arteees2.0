<?php
    class artista{
        //atributos
        private $conexion;

        public function __construct($conexion){
            $this->conexion = $conexion;
        }

        //metodos
        public function consulta(){
            $sql = "SELECT * FROM artista ORDER BY nombre";
            $res = mysqli_query($this->conexion, $sql) or die('no se encontro la tabla artista');

            $vec = [];

            while($row = mysqli_fetch_array($res)){
                $vec[] = $row;
            }

            return $vec;
        }

        public function eliminar($id){
            $sql = "DELETE FROM artista WHERE id_artista = $id";
            mysqli_query($this->conexion, $sql) or die('no elemino el registro');

            $vec = [];
            $vec['resultado']  = "OK";
            $vec['mensaje'] = "se elimino el registro";

            return $vec;
        }

        public function insertar($params){
            $sql = "INSERT INTO artista(nombre) VALUES('$params->nombre')";
            mysqli_query($this->conexion, $sql) or die('no inserto el registro');

            $vec = [];
            $vec['resultado']  = "OK";
            $vec['mensaje'] = "se inserto el registro";

            return $vec;
        }

        public function editar($id, $params){
            $sql = "UPDATE artista SET nombre = '$params->nombre' WHERE id_artista = $id";
            mysqli_query($this->conexion, $sql) or die('no edito el registro');

            $vec = [];
            $vec['resultado']  = "OK";
            $vec['mensaje'] = "se edito el registro";

        }

    }


?>