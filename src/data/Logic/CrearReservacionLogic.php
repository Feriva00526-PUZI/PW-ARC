<?php
    require_once "./../dao/CrearReservacionDAO.php";

    header('Content-Type: application/json');
    $ReservacionDAO = new CrearReservacionDAO();
    $RUTA_IMG_ESTANDAR = "./../../media/images/lugares/";
    $RUTA_FISICA_GUARDADO = __DIR__ . "/../../media/images/lugares/";
    

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $id_evento = $_POST["id_evento"];
        $id_cliente = $_POST["id_cliente"];
        $estado = $_POST["estado"];
        
        try{
            $viaje = $ReservacionDAO->crearReservacion($id_evento, $id_cliente, $estado);

            $respuesta = ['correcto' => true, 'paquetes' => $viaje];
            echo json_encode($respuesta);
        } catch (Exception $e){
            $respuesta = ['correcto' => false, 'mensaje' => 'Error - ' . $e->getMessage()];
            echo json_encode($respuesta);
        }
    } 
