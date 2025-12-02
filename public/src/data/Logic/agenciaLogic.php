<?php
    require_once "./../dao/agenciaDAO.php";
    header('Content-Type: application/json');
    $agenciaDAO = new agenciaDAO();
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        if($_SERVER['CONTENT_TYPE'] == 'application/json'){
            $data = json_decode(file_get_contents("php://input"), true);
            $user = $data['user'];
            $password = $data['password'];
            try{
                $agencia = $agenciaDAO->validarAgencia($user, $password);
                if($agencia != null){
                    $respuesta = ['correcto' => true, 'agencia' => $agencia];
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