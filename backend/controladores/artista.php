<?php
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
    header('Content-Type: application/json');

    require_once('../modelos/conexion.php');
    require_once('../modelos/artista.php');

    $control = $_GET['control'];
    $artista = new artista($conexion);

    switch($control){
        case 'consulta':
            $vec = $artista->consulta();
            break;
        case 'insertar':
            $json = file_get_contents('php://input');
            $params = json_decode($json);

            $vec = $artista->insertar($params);
            break;
        case 'editar':
            $json = file_get_contents('php://input');
            $id = $_GET['id'];
            $params = json_decode($json);

            $vec = $artista->editar($id, $params);
            break;
        case 'eliminar':
            $id = $_GET['id'];

            $vec = $artista->eliminar($id);
            break;
    }

    $datos = json_encode($vec, JSON_UNESCAPED_UNICODE);
    echo $datos;
?>