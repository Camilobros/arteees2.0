<?php
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
    header('Content-Type: application/json');

    require_once('../modelos/conexion.php');
    require_once('../modelos/cliente.php');

    $control = $_GET['control'];
    $cliente = new cliente($conexion);

    switch($control){
        case 'consulta':
            $vec = $cliente->consulta();
            break;
        case 'insertar':
            $json = file_get_contents('php://input');
            $params = json_decode($json);

            $vec = $cliente->insertar($params);
            break;
        case 'editar':
            $json = file_get_contents('php://input');
            $id = $_GET['id'];
            $params = json_decode($json);

            $vec = $cliente->editar($id, $params);
            break;
        case 'eliminar':
            $id = $_GET['id'];

            $vec = $cliente->eliminar($id);
            break;

        case 'filtro':
            $dato = $_GET['dato'];
            // Solo guardamos la información en $vec y dejamos que el código de abajo haga el resto
            $vec = $cliente->filtro($dato); 
            break; 
    }

    $datos = json_encode($vec, JSON_UNESCAPED_UNICODE);
    echo $datos;
?>