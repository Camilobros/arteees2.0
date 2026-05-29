<?php
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
    header('Content-Type: application/json');

    require_once('../modelos/conexion.php');
    require_once('../modelos/detalle_venta.php');

    $control = $_GET['control'];
    $detalle_venta = new detalle_venta($conexion);

    switch($control){
        case 'consulta':
            $vec = $detalle_venta->consulta();
            break;
        case 'insertar':
            $json = file_get_contents('php://input');
            $params = json_decode($json);

            $vec = $detalle_venta->insertar($params);
            break;
        case 'editar':
            $json = file_get_contents('php://input');
            $id = $_GET['id'];
            $params = json_decode($json);

            $vec = $detalle_venta->editar($id, $params);
            break;
        case 'eliminar':
            $id = $_GET['id'];

            $vec = $detalle_venta->eliminar($id);
            break;
    }

    $datos = json_encode($vec, JSON_UNESCAPED_UNICODE);
    echo $datos;
?>