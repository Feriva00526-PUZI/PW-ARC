<?php
    require_once "./../dao/lugarDAO.php";
    header('Content-Type: application/json');
    $lugarDAO = new lugarDAO();
    $RUTA_IMG_ESTANDAR = "./../../media/images/lugares/";
    if ($_SERVER["REQUEST_METHOD"] == "GET") {
        try{
            $lugares = $lugarDAO->getLugares();
            if($lugares != null){
                foreach ($lugares as &$lugar) {
                    $lugar['imagen_url'] = $RUTA_IMG_ESTANDAR . $lugar['imagen_url'];
                }
                $respuesta = ['correcto' => true, 'lugares' => $lugares];
            } else {
                $respuesta = ['correcto' => false];
            }
            echo json_encode($respuesta);
        } catch (Exception $e){
            $respuesta = ['correcto' => false, 'mensaje' => 'Error en el servidor: ' . $e->getMessage()];
            echo json_encode($respuesta);
        }
    }