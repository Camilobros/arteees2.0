<?php 
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
    header('Content-Type: application/json');

    require_once('../modelos/conexion.php');
    require_once('../modelos/obra.php');

    $control = $_GET['control'];
    $obra = new obra($conexion);

    switch($control){
        case 'consulta':
            $vec = $obra->consulta();
            break;
        case 'insertar':
            $json = file_get_contents('php://input');
            $params = json_decode($json);

            $vec = $obra->insertar($params);
            break;
        case 'editar':
            $json = file_get_contents('php://input');
            $id = $_GET['id'];
            $params = json_decode($json);

            $vec = $obra->editar($id, $params);
            break;
        case 'eliminar':
            $id = $_GET['id'];

            $vec = $obra->eliminar($id);
            break;
    }

    $datos = json_encode($vec, JSON_UNESCAPED_UNICODE);
    echo $datos;

?>