<?php
    require_once "./../dao/organizadorDAO.php";
    header('Content-Type: application/json');
    $organizadorDAO = new organizadorDAO();
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        if($_SERVER['CONTENT_TYPE'] == 'application/json'){
            $data = json_decode(file_get_contents("php://input"), true);
            $user = $data['user'];
            $password = $data['password'];
            try{
                $organizador = $organizadorDAO->validarOrganizador($user, $password);
                if($organizador != null){
                    $respuesta = ['correcto' => true, 'organizador' => $organizador];
                } else {
                    $respuesta = ['correcto' => false];
                }
                echo json_encode($respuesta);
            } catch (Exception $e){
                $respuesta = ['correcto' => false, 'mensaje' => 'Error en el servidor: ' . $e->getMessage()];
                echo json_encode($respuesta);
            }
        }

}