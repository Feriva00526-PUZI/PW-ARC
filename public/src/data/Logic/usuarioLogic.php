<?php
    require_once "./../dao/usuarioDAO.php";
    header('Content-Type: application/json');
    $usuarioDAO = new usuarioDAO();
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        if($_SERVER['CONTENT_TYPE'] == 'application/json'){
            $data = json_decode(file_get_contents("php://input"), true);
            $user = $data['user'];
            $password = $data['password'];
            try{
                $usuario = $usuarioDAO->validarUsuario($user, $password);
                if($usuario != null){
                    $respuesta = ['correcto' => true, 'usuario' => $usuario];
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