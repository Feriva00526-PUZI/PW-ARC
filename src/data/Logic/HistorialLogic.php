<?php
require_once "./../dao/viajesDAO.php";
header('Content-Type: application/json');

$viajesDAO = new viajesDAO();

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    if ($_SERVER['CONTENT_TYPE'] == 'application/json') {
        $data = json_decode(file_get_contents("php://input"), true);
        $id_cliente = $data['id_cliente'];

        try {
            $viajes = $viajesDAO->obtenerViajesPorCliente($id_cliente);

            $respuesta = [
                'correcto' => true,
                'viajes' => $viajes
            ];

            echo json_encode($respuesta);

        } catch (Exception $e) {

            $respuesta = [
                'correcto' => false,
                'mensaje' => 'Error en el servidor: ' . $e->getMessage()
            ];

            echo json_encode($respuesta);
        }
    }
}
?>
