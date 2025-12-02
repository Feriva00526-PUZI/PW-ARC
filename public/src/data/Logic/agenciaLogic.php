<?php
    require_once "./../dao/agenciaDAO.php";
    require_once "./../util/seguridad.php";
    header('Content-Type: application/json');
    $agenciaDAO = new agenciaDAO();
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        if($_SERVER['CONTENT_TYPE'] == 'application/json'){
            $data = json_decode(file_get_contents("php://input"), true);
            // Sanitizar usuario y contraseña
            $user = Seguridad::sanitizar($data['user']);
            $password = Seguridad::sanitizar($data['password']);
            try{
                $agencia = $agenciaDAO->validarAgencia($user, $password);
                if($agencia != null){
                    // Iniciar sesión
                    Seguridad::establecerSesion('agencia', $agencia);
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