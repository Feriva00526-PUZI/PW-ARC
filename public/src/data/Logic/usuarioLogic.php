<?php
    require_once "./../dao/usuarioDAO.php";
    require_once "./../util/seguridad.php";
    header('Content-Type: application/json');
    $usuarioDAO = new usuarioDAO();
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        if($_SERVER['CONTENT_TYPE'] == 'application/json'){
            $data = json_decode(file_get_contents("php://input"), true);
            // Sanitizar usuario y contraseña
            $user = Seguridad::sanitizar($data['user']);
            $password = Seguridad::sanitizar($data['password']);
            try{
                $usuario = $usuarioDAO->validarUsuario($user, $password);
                if($usuario != null){
                    // Iniciar sesión
                    Seguridad::establecerSesion('usuario', $usuario);
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