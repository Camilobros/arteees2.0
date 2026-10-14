<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

//credenciales 
require_once('config.php');

$conexion = mysqli_connect($servidor, $usuario, $clave) or die('no se conecto a mysql');
mysqli_select_db($conexion, $bd) or die('no se conecto a la base de datos ventas');
mysqli_set_charset($conexion, 'utf8'); //codificacion


?>