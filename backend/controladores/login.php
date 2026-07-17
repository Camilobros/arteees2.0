<?php 
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
    header('Content-Type: application/json');

    require_once('../modelos/conexion.php');
    require_once('../modelos/login.php');

    $correo = $_GET['correo'];
    $contrasena = $_GET['contrasena'];


    $login = new Login($conexion);

    $vec = $login->consulta($correo, $contrasena);

    

    $datos = json_encode($vec, JSON_UNESCAPED_UNICODE);
    echo $datos;
    header('Content-Type: application/json')

?>