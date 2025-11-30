<?php
require_once "./../dao/CarruselDAO.php";
header('Content-Type: application/json');

$carruselDAO = new CarruselDAO();
$RUTA_IMG_ESTANDAR = "./../../media/images/lugares/";

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    try {
        // Obtener los 10 lugares más populares
        $lugares = $carruselDAO->getLugaresMasPopulares(10);
        
        if ($lugares != null && !empty($lugares)) {
            // Formatear las URLs de las imágenes
            foreach ($lugares as &$lugar) {
                if (!empty($lugar['imagen_url']) && $lugar['imagen_url'] !== 'nourl') {
                    $lugar['imagen_url'] = $RUTA_IMG_ESTANDAR . $lugar['imagen_url'];
                } else {
                    // Si no hay imagen, usar una por defecto
                    $lugar['imagen_url'] = $RUTA_IMG_ESTANDAR . 'default.jpg';
                }
            }
            
            $respuesta = [
                'correcto' => true, 
                'lugares' => $lugares
            ];
        } else {
            $respuesta = [
                'correcto' => false, 
                'mensaje' => 'No se encontraron lugares populares',
                'lugares' => []
            ];
        }
        
        echo json_encode($respuesta);
    } catch (Exception $e) {
        $respuesta = [
            'correcto' => false, 
            'mensaje' => 'Error - ' . $e->getMessage(),
            'lugares' => []
        ];
        echo json_encode($respuesta);
    }
} else {
    $respuesta = [
        'correcto' => false, 
        'mensaje' => 'Método no permitido',
        'lugares' => []
    ];
    echo json_encode($respuesta);
}

