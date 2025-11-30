<?php
require_once "./../dao/eventoDAO.php";
header('Content-Type: application/json');
$eventoDAO = new eventoDAO();
$RUTA_IMG_ESTANDAR = "./../../media/images/lugares/";
$RUTA_FISICA_GUARDADO = __DIR__ . "/../../media/images/lugares/";

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    try {
        $eventos = $eventoDAO->getEvento();
        if ($eventos != null) {
            foreach ($eventos as &$evento) {
                $evento['imagen_url'] = $RUTA_IMG_ESTANDAR . $evento['imagen_url'];
            }
            $respuesta = ['correcto' => true, 'eventos' => $eventos];
        } else {
            $respuesta = ['correcto' => false];
        }
        echo json_encode($respuesta);
    } catch (Exception $e) {
        $respuesta = ['correcto' => false, 'mensaje' => 'Error - ' . $e->getMessage()];
        echo json_encode($respuesta);
    }
}
