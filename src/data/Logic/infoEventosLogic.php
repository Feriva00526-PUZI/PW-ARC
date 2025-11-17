<?php
require_once "./../dao/infoEventosDAO.php";
header('Content-Type: application/json');
$lugarDAO = new infoEventosDAO();
$RUTA_IMG_ESTANDAR = "./../../media/images/lugares/";
$RUTA_FISICA_GUARDADO = __DIR__ . "/../../media/images/lugares/";

if ($_SERVER["REQUEST_METHOD"] == "GET") {

    $query = isset($_GET['query']) ? $_GET['query'] : 'query1';
    $lugares = null;

    try {
        switch ($query) {
            case 'query1':
                $lugares = $lugarDAO->getMasPopulares();
                break;
            case 'query2':
            default:
                $lugares = $lugarDAO->getMenosPopulares();
                break;
        }

        if ($lugares !== null && !empty($lugares)) {
            // Procesamiento de la URL de la imagen si se encontraron lugares
            foreach ($lugares as &$lugar) {
                $lugar['imagen_url'] = $RUTA_IMG_ESTANDAR . $lugar['imagen_url'];
            }
            $respuesta = ['correcto' => true, 'lugares' => $lugares];
        } else {
            // Si la consulta no devolvió resultados
            $respuesta = ['correcto' => false, 'lugares' => []];
        }
        echo json_encode($respuesta);
    } catch (Exception $e) {
        $respuesta = ['correcto' => false, 'mensaje' => 'Error - ' . $e->getMessage()];
        echo json_encode($respuesta);
    }
}
