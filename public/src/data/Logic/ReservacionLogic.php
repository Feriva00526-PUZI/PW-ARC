<?php
require_once "./../dao/ReservacionesDAO.php"; 
header('Content-Type: application/json');

$reservacionesDAO = new ReservacionesDAO();

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Validar que venga JSON
    if ($_SERVER['CONTENT_TYPE'] == 'application/json') {

        $data = json_decode(file_get_contents("php://input"), true);
        
        /* =============================
            CANCELAR UNA RESERVACIÓN
        ============================== */
        if (isset($data['accion']) && $data['accion'] === 'cancelar_reservacion') {

            if (!isset($data['id_reservacion'])) {
                echo json_encode([
                    'correcto' => false,
                    'mensaje' => 'ID de reservación no recibido'
                ]);
                exit;
            }

            $id_reservacion = intval($data['id_reservacion']);

            try {
                $ok = $reservacionesDAO->cancelarReservacion($id_reservacion); 

                echo json_encode([
                    'correcto' => $ok,
                    'mensaje' => $ok ? 'Reservación cancelada correctamente' : 'No se pudo cancelar la reservación'
                ]);
            } catch (Exception $e) {
                echo json_encode([
                    'correcto' => false,
                    'mensaje' => 'Error al cancelar reservación: ' . $e->getMessage()
                ]);
            }

            exit;
        }


        /* =============================
            OBTENER HISTORIAL DE RESERVACIONES
        ============================== */
      
        if (isset($data['id_cliente'])) {
            $id_cliente = intval($data['id_cliente']);

            try {
                // Obtiene el historial de reservaciones
                $reservaciones = $reservacionesDAO->obtenerHistorialDetallado($id_cliente);

                echo json_encode([
                    'correcto' => true,
                    'reservaciones' => $reservaciones // Devuelve solo las reservaciones
                ]);
            } catch (Exception $e) {
                echo json_encode([
                    'correcto' => false,
                    'mensaje' => 'Error en el servidor al obtener historial de reservaciones: ' . $e->getMessage()
                ]);
            }

            exit;
        }
    }
}