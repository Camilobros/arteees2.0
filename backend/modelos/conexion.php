<?php
$servidor = "api-artes.infinityfreeapp.com";
$usuario = "if0_42772419";
$clave = "LINNimay18";
$bd = "if0_42772419_tienda_dibujos";

$conexion = mysqli_connect($servidor, $usuario, $clave) or die('no se conecto a mysql');
mysqli_select_db($conexion, $bd) or die('no se conecto a la base de datos ventas');
mysqli_set_charset($conexion, 'utf8'); //codificacion


?>