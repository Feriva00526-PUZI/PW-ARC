<?php
    require_once "./../dao/organizadorDAO.php";
    require_once "./../util/seguridad.php";
    header('Content-Type: application/json');
    $organizadorDAO = new organizadorDAO();
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        if($_SERVER['CONTENT_TYPE'] == 'application/json'){
            $data = json_decode(file_get_contents("php://input"), true);
            // Sanitizar usuario y contraseña
            $user = Seguridad::sanitizar($data['user']);
            $password = Seguridad::sanitizar($data['password']);
            try{
                $organizador = $organizadorDAO->validarOrganizador($user, $password);
                if($organizador != null){
                    // Iniciar sesión
                    Seguridad::establecerSesion('organizador', $organizador);
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