<?php
    class obra{
        //atributos
        private $conexion;

        public function __construct($conexion){
            $this->conexion = $conexion;
        }

        //metodos
        public function consulta(){
            $sql = "SELECT o.*, ar.nombre AS artista FROM obra o
                    INNER JOIN artista ar ON o.id_artista = ar.id_artista
                    ORDER BY o.titulo;";
            $res = mysqli_query($this->conexion, $sql) or die('no se encontro la tabla obra');

            $vec = [];

            while($row = mysqli_fetch_array($res)){
                $vec[] = $row;
            }

            return $vec;
        }

        public function eliminar($id){
            $sql = "DELETE FROM obra WHERE id_obra = $id";
            mysqli_query($this->conexion, $sql) or die('no elemino el registro');

            $vec = [];
            $vec['resultado']  = "OK";
            $vec['mensaje'] = "se elimino el registro";

            return $vec;
        }

        public function insertar($params){
            $sql = "INSERT INTO obra(titulo, descripcion, precio, estado, id_artista, stock) 
            VALUES('$params->titulo', '$params->descripcion', $params->precio, '$params->estado', $params->id_artista, $params->stock)";
            mysqli_query($this->conexion, $sql) or die('no inserto el registro');

            $vec = [];
            $vec['resultado']  = "OK";
            $vec['mensaje'] = "se inserto el registro";

            return $vec;
        }

        public function editar($id, $params){
            $sql = "UPDATE obra SET titulo = '$params->titulo', descripcion = '$params->descripcion', precio = $params->precio, estado = '$params->estado', id_artista = $params->id_artista, stock = $params->stock  
            WHERE id_obra = $id";
            mysqli_query($this->conexion, $sql) or die('no edito el registro');

            $vec = [];
            $vec['resultado']  = "OK";
            $vec['mensaje'] = "se edito el registro";

        }

    }


?>