<?php
    class Login {
        //atributos
        private $conexion;

        public function __construct($conexion){
            $this->conexion = $conexion;
        }

        //metodos
        public function consulta($correo, $contrasena){
            $sql = "SELECT * FROM usuario WHERE correo ='$correo' &&  contrasena = SHA1('$contrasena')";
                    
            $res = mysqli_query($this->conexion, $sql);

            $vec = [];

            while($row = mysqli_fetch_array($res)){
                $vec[] = $row;
            }

            if ($vec==[]) {
                $vec[0] = array("validar"=>"no validar");
            } else {
                $vec[0]['validar']="validar";
            }
            

            return $vec;
        }
    }
        


?>