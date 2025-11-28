<?php
require_once "./../dao/infoEventosDAO.php";
header('Content-Type: application/json');
$lugarDAO = new infoEventosDAO();
$RUTA_IMG_ESTANDAR = "./../../media/images/lugares/";
$RUTA_IMG_ESTANDAR2 = "./../../media/images/events/";
$RUTA_IMG_ESTANDAR3 = "./../../media/images/paquetes/";
$RUTA_FISICA_GUARDADO = __DIR__ . "/../../media/images/lugares/";

if ($_SERVER["REQUEST_METHOD"] == "GET") {

    $query = isset($_GET['query']) ? $_GET['query'] : 'query1';
    $resultados = null;
    $respuesta = null;

    $is_stats_query = in_array($query, ['query5', 'query6', 'query7', 'query8']);
    if ($is_stats_query) {
        $totalGeneral = $lugarDAO->getReservacionesTotales();
    }

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
            case 'query5':
                $count = $lugarDAO->getAsistenciasCompletadas();
                $percentage = ($count / $totalGeneral) * 100;
                $resultados = ['count' => $count, 'percentage' => $percentage];
                $respuesta = ['correcto' => true, 'lugares' => $resultados];
                break;

            case 'query6':
                $count = $lugarDAO->getReservacionesPendientes();
                $percentage = ($count / $totalGeneral) * 100;
                $resultados = ['count' => $count, 'percentage' => $percentage];
                $respuesta = ['correcto' => true, 'lugares' => $resultados];
                break;

            case 'query7':
                $count = $lugarDAO->getReservacionesCanceladas();
                $percentage = ($count / $totalGeneral) * 100;
                $resultados = ['count' => $count, 'percentage' => $percentage];
                $respuesta = ['correcto' => true, 'lugares' => $resultados];
                break;

            case 'query8':
                $count = $totalGeneral;
                $percentage = ($count > 0) ? 100 : 0;
                $resultados = ['count' => $count, 'percentage' => $percentage];
                $respuesta = ['correcto' => true, 'lugares' => $resultados];
                break;
            default:
                $resultados = [];
                break;
        }
        if ("query1" === $query || "query2" === $query) {
            if ($resultados !== null && !empty($resultados)) {
                foreach ($resultados as &$item) {
                    $item['imagen_url'] = $RUTA_IMG_ESTANDAR . $item['imagen_url'];
                }
                $respuesta = ['correcto' => true, 'lugares' => $resultados];
            } else {
                $respuesta = ['correcto' => false, 'lugares' => []];
            }
        } else if ("query3" === $query || "query4" === $query) {
            if ($resultados !== null && !empty($resultados)) {
                foreach ($resultados as &$item) {
                    $item['imagen_url'] = $RUTA_IMG_ESTANDAR2 . $item['imagen_url'];
                }
                $respuesta = ['correcto' => true, 'lugares' => $resultados];
            } else {
                $respuesta = ['correcto' => false, 'lugares' => []];
            }
        }
        echo json_encode($respuesta);
    } catch (Exception $e) {
        $respuesta = [
            'correcto' => false,
            'lugares' => []
        ];
        echo json_encode($respuesta);
    }
}
