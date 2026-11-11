<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once('../modelos/conexion.php');
require_once('../modelos/compra.php');

$control = isset($_GET['control']) ? $_GET['control'] : '';
$compra = new Compra($conexion);
$vec = [];

switch ($control) {
    case 'comprar':
        $json = file_get_contents('php://input');
        $params = json_decode($json);
        $vec = $compra->comprarObra($params);
        break;

    case 'mis_compras':
        $correo = isset($_GET['correo']) ? $_GET['correo'] : '';
        $vec = $compra->misCompras($correo);
        break;

    case 'mis_ventas':
        $correo = isset($_GET['correo']) ? $_GET['correo'] : '';
        $vec = $compra->misVentasArtista($correo);
        break;

    case 'consulta':
        $vec = $compra->consultaGeneral();
        break;

    default:
        $vec = ['resultado' => 'ERROR', 'mensaje' => 'Acción no válida'];
        break;
}

echo json_encode($vec, JSON_UNESCAPED_UNICODE);
?>