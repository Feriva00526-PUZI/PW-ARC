<?php
require_once "./../dao/infoEventosDAO.php";
header('Content-Type: application/json');
$lugarDAO = new infoEventosDAO();
$RUTA_IMG_ESTANDAR = "./../../media/images/lugares/";
$RUTA_FISICA_GUARDADO = __DIR__ . "/../../media/images/lugares/";

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $filtro = isset($_GET['filtro']) ? $_GET['filtro'] : 'populares';
    try {
        $lugares = $lugarDAO->getLugares($filtro);
        if ($lugares != null) {
            foreach ($lugares as &$lugar) {
                $lugar['imagen_url'] = $RUTA_IMG_ESTANDAR . $lugar['imagen_url'];
            }
            $respuesta = ['correcto' => true, 'lugares' => $lugares];
        } else {
            $respuesta = ['correcto' => false];
        }
        echo json_encode($respuesta);
    } catch (Exception $e) {
        $respuesta = ['correcto' => false, 'mensaje' => 'Error - ' . $e->getMessage()];
        echo json_encode($respuesta);
    }
}
