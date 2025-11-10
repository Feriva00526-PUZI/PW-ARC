<?php
    require_once "./../dao/adminDAO.php";
    header('Content-Type: application/json');
    $adminDAO = new adminDAO();
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        if($_SERVER['CONTENT_TYPE'] == 'application/json'){
            $data = json_decode(file_get_contents("php://input"), true);
            $user = $data['user'];
            $password = $data['password'];
            try{
                $admin = $adminDAO->validarAdmin($user, $password);
                if($admin != null){
                    $respuesta = ['correcto' => true, 'admin' => $admin];
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