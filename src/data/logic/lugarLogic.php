<?php
    require_once "./../dao/lugarDAO.php";
    header('Content-Type: application/json');
    $lugarDAO = new lugarDAO();
    if ($_SERVER["REQUEST_METHOD"] == "GET") {
        try{
            $lugares = $lugarDAO->getLugares();
            if($lugares != null){
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