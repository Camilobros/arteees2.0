<?php
$servidor = "localhost";
$usuario = "root";
$clave = "";
$bd = "ventas";

$conexion = mysqli_connect($servidor, $usuario, $clave) or die('no se conecto a mysql');
mysqli_selec_db($conexion, $bd) or die('no se conecto a la base de datos ventas');
mysqli_set_charset($conexion, 'utf8'); //codificacion


?>