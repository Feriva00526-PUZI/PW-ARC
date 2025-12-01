<?php
require_once "./../dao/IndexCarruselDAO.php";
header('Content-Type: application/json');

$indexCarruselDAO = new IndexCarruselDAO();
// Ruta relativa desde index.html (./src/data/Logic/)
$RUTA_IMG_ESTANDAR = "./src/media/images/lugares/";

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    try {
        // Obtener los 10 lugares más populares
        $lugares = $indexCarruselDAO->getLugaresMasPopulares(10);
        
        if ($lugares != null && !empty($lugares)) {
            // Formatear las URLs de las imágenes (ruta relativa desde index.html)
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

