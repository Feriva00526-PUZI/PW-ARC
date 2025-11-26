<?php
    require_once "./../dao/CrearViajeDAO.php";

    header('Content-Type: application/json');
    $viajeDAO = new CrearViajeDAO();
    $RUTA_IMG_ESTANDAR = "./../../media/images/lugares/";
    $RUTA_FISICA_GUARDADO = __DIR__ . "/../../media/images/lugares/";
    

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $id_cliente = $_POST["id_cliente"];
        $id_paquete = $_POST["id_paquete"];
        $estado = $_POST["estado"];
        $fecha_viaje = $_POST["fecha_viaje"];
        $hora_viaje = $_POST["hora_viaje"];
        
        try{
            $viaje = $viajeDAO->crearViaje($id_cliente, $id_paquete, $estado, $fecha_viaje, $hora_viaje);

            $respuesta = ['correcto' => true, 'paquetes' => $viaje];
            echo json_encode($respuesta);
        } catch (Exception $e){
            $respuesta = ['correcto' => false, 'mensaje' => 'Error - ' . $e->getMessage()];
            echo json_encode($respuesta);
        }
    } 
