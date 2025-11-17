<?php 
require_once "./../dao/viajesDAO.php";
require_once "./../dao/ReservacionesDAO.php"; 
header('Content-Type: application/json');

$viajesDAO = new viajesDAO();
$reservacionesDAO = new ReservacionesDAO(); 
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Validar que venga JSON
    if ($_SERVER['CONTENT_TYPE'] == 'application/json') {

        $data = json_decode(file_get_contents("php://input"), true);

        /* =============================
            CANCELAR UN VIAJE (EXISTENTE)
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
            CANCELAR UNA RESERVACIÓN (NUEVO)
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
                // Llama al método del nuevo DAO
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
            OBTENER HISTORIAL COMPLETO (MODIFICADO)
        ============================== */
        if (isset($data['id_cliente'])) {
            $id_cliente = intval($data['id_cliente']);

            try {
                // Obtiene el historial de viajes (Original)
                $viajes = $viajesDAO->obtenerHistorialDetallado($id_cliente);
                
                // Obtiene el historial de reservaciones (NUEVO)
                $reservaciones = $reservacionesDAO->obtenerHistorialDetallado($id_cliente);

                echo json_encode([
                    'correcto' => true,
                    'viajes' => $viajes,
                    'reservaciones' => $reservaciones // <--- NUEVO CAMPO RETORNADO
                ]);
            } catch (Exception $e) {
                echo json_encode([
                    'correcto' => false,
                    'mensaje' => 'Error en el servidor al obtener historiales: ' . $e->getMessage()
                ]);
            }

            exit;
        }
    }
}
