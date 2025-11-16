<?php
require_once "./../dao/viajesDAO.php";
header('Content-Type: application/json');

$viajesDAO = new viajesDAO();

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    if ($_SERVER['CONTENT_TYPE'] == 'application/json') {
        $data = json_decode(file_get_contents("php://input"), true);
        $id_cliente = $data['id_cliente'];

        try {
            $viajes = $viajesDAO->obtenerHistorialDetallado($id_cliente);

            echo json_encode([
                'correcto' => true,
                'viajes' => $viajes
            ]);

        } catch (Exception $e) {

            echo json_encode([
                'correcto' => false,
                'mensaje' => 'Error en el servidor: ' . $e->getMessage()
            ]);
        }
    }
}

?>
