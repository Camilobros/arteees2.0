<?php 
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
    header('Content-Type: application/json');

    require_once('../modelos/conexion.php');
    require_once('../modelos/pedido.php');

    $control = $_GET['control'];
    $pedido = new Pedido($conexion);

    switch($control){
        case 'consulta':
            $vec = $pedido->consulta();
            break;
        case 'insertar':
            $json = file_get_contents('php://input');
            $params = json_decode($json);
            $texto_arreglo = serialize($params->texto_arreglo);
            $params->productos = $texto_arreglo;

            $vec = $pedido->insertar($params);
            break;
        case 'editar':
            $json = file_get_contents('php://input');
            $id = $_GET['id'];
            $params = json_decode($json);

            $vec = $pedido->editar($id, $params);
            break;
        case 'eliminar':
            $id = $_GET['id'];

            $vec = $pedido->eliminar($id);
            break;
    }

    $datos = json_encode($vec, JSON_UNESCAPED_UNICODE);
    echo $datos;

?>