<?php 
require_once "./../dao/viajesDAO.php";

header('Content-Type: application/json');

$viajesDAO = new viajesDAO();


if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Validar que venga JSON
    if ($_SERVER['CONTENT_TYPE'] == 'application/json') {

        $data = json_decode(file_get_contents("php://input"), true);

        /* =============================
           CANCELAR UN VIAJE
        ============================== */
        if (isset($data['accion']) && $data['accion'] === 'cancelar') {

            if (!isset($data['id_viaje'])) {
                echo json_encode([
                    'correcto' => false,
                    'mensaje' => 'ID de viaje no recibido'
                ]);
                exit;
            }

            $id_viaje = intval($data['id_viaje']);

            try {
                $ok = $viajesDAO->cancelarViaje($id_viaje);

                echo json_encode([
                    'correcto' => $ok,
                    'mensaje' => $ok ? 'Viaje cancelado correctamente' : 'No se pudo cancelar el viaje'
                ]);
            } catch (Exception $e) {
                echo json_encode([
                    'correcto' => false,
                    'mensaje' => 'Error al cancelar: ' . $e->getMessage()
                ]);
            }

            exit;
        }


        /* =============================
            OBTENER HISTORIAL
        ============================== */
        if (isset($data['id_cliente'])) {
            $id_cliente = intval($data['id_cliente']);

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

            exit;
        }
    }
}
