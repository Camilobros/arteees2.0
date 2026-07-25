<?php
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

    require_once("../conexion.php");
    require_once("../modelos/pedido.php");

    $control = $_GET['control'];

    $pedido = new Pedido($conexion);

    switch ($control) {
        case 'consulta':
            $vec = $pedido->consulta();
            $res = json_encode($vec);
            echo $res;
            break;

        case 'insertar':
            $json = file_get_contents('php://input');
            $params = json_decode($json);
            $vec = $pedido->insertar($params);
            $res = json_encode($vec);
            echo $res;
            break;

        case 'editar':
            $json = file_get_contents('php://input');
            $params = json_decode($json);
            $id = $_GET['id'];
            $vec = $pedido->editar($id, $params);
            $res = json_encode($vec);
            echo $res;
            break;

        case 'eliminar':
            $id = $_GET['id'];
            $vec = $pedido->eliminar($id);
            $res = json_encode($vec);
            echo $res;
            break;
    }
?>