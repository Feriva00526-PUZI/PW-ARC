<?php
require_once "./../dao/infoEventosDAO.php";
header('Content-Type: application/json');
$lugarDAO = new infoEventosDAO();
$RUTA_IMG_ESTANDAR = "./../../media/images/lugares/";
$RUTA_FISICA_GUARDADO = __DIR__ . "/../../media/images/lugares/";

if ($_SERVER["REQUEST_METHOD"] == "GET") {

    $query = isset($_GET['query']) ? $_GET['query'] : 'query1';
    $resultados = null;
    $respuesta = null;

    try {
        switch ($query) {
            case 'query1':
                $resultados = $lugarDAO->getMasPopulares();
                break;
            case 'query2':
                $resultados = $lugarDAO->getMenosPopulares();
                break;
            case 'query3':
                $resultados = $lugarDAO->getEventosMasPopulares();
                break;
            case 'query4':
                $resultados = $lugarDAO->getEventosMenosPopulares();
                break;
            default:
                $resultados = [];
                break;
        }
        if ($resultados !== null && !empty($resultados)) {
            foreach ($resultados as &$item) {
                $item['imagen_url'] = $RUTA_IMG_ESTANDAR . $item['imagen_url'];
            }
            $respuesta = ['correcto' => true, 'lugares' => $resultados];
        } else {
            $respuesta = ['correcto' => 'gamboa', 'lugares' => []];
        }
        echo json_encode($respuesta);
    } catch (Exception $e) {
        $respuesta = [
            'correcto' => 'martin',
            'mensaje' => 'Error - ' . $e->getMessage(),
            'lugares' => []
        ];
        echo json_encode($respuesta);
    }
}
