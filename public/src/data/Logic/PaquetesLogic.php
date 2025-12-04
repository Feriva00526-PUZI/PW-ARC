<?php
require_once "./../dao/PaquetesDAO.php";

header('Content-Type: application/json');
$paqueteDAO = new PaquetesDAO();
$RUTA_IMG_ESTANDAR = "./../../media/images/lugares/";
$RUTA_FISICA_GUARDADO = __DIR__ . "/../../media/images/lugares/";


if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $id_lugar = $_GET["id_lugar"];
    try {
        $paquetes = $paqueteDAO->getPaquetes($id_lugar);


        $respuesta = ['correcto' => true, 'paquetes' => $paquetes];
        echo json_encode($respuesta);
    } catch (Exception $e) {
        $respuesta = ['correcto' => false, 'mensaje' => 'Error - ' . $e->getMessage()];
        echo json_encode($respuesta);
    }
}
