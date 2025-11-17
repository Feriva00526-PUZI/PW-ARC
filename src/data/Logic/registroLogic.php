<?php
require_once "./../dao/registroDAO.php";
header('Content-Type: application/json');
$registroDAO = new registroDAO();
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $respuesta = ['correcto' => false];
    if (!empty($_POST)) {

        $nombre = $_POST["nombre"];
        $apellido = $_POST["apellido"];
        $correo = $_POST["correo"];
        $telefono = $_POST["telefono"];
        $usuario = $_POST["usuario"];
        $contra = $_POST["contra"];
        $tipoRegistro = $_POST["tipo_registro"];


        if (empty($nombre) || empty($apellido) || empty($correo) || empty($telefono) || empty($usuario) || empty($contra) || empty($tipoRegistro)) {
            $error = "Datos incompletos.";
            $respuesta = array("correcto" => false, "mensaje" => $error);
            echo json_encode($respuesta);
            exit;
        }

        if (!preg_match('/^[A-Za-z\s]+$/', $nombre)) {
            $errores_formato[] = "1";
        }
        if (!preg_match('/^[A-Za-z\s]+$/', $apellido)) {
            $errores_formato[] = "2";
        }

        if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
            $errores_formato[] = "3";
        }

        if (!preg_match('/^\d{10}$/', $telefono)) {
            $errores_formato[] = "4";
        }

        if (!empty($errores_formato)) {
            $error_mensaje = "Errores de validación.";
            $respuesta = array("correcto" => false, "mensaje" => $error_mensaje);
            echo json_encode($respuesta);
            exit;
        }

        try {
            if ($registroDAO->existeRegistro($usuario)) {
                $respuesta = ["correcto" => false, "mensaje" => "Entidad ya registrada bajo ese nombre de usuario."];
                echo json_encode($respuesta);
                exit;
            }
            if ($tipoRegistro == 1) {
                $registroDAO->registroUsuario($nombre, $apellido, $correo, $telefono, $usuario, $contra);
                $respuesta = array("correcto" => true, "mensaje" => "Registro Exitoso");
                echo json_encode($respuesta);
                exit;
            } else if ($tipoRegistro == 3) {
                $registroDAO->registroOrganizadora($nombre, $apellido, $correo, $telefono, $usuario, $contra);
                $respuesta = array("correcto" => true, "mensaje" => "Registro Exitoso");
                echo json_encode($respuesta);
                exit;
            } else if ($tipoRegistro == 4) {
                $registroDAO->registroAgencia($nombre, $apellido, $correo, $telefono, $usuario, $contra);
                $respuesta = array("correcto" => true, "mensaje" => "Registro Exitoso");
                echo json_encode($respuesta);
                exit;
            } else {
                $error = "No se localizo el tipo de entidad a registrar";
                $respuesta = array("correcto" => false, "mensaje" => $error);
                echo json_encode($respuesta);
            }
        } catch (Exception $e) {
            $respuesta['mensaje'] = $e->getMessage();
            echo json_encode($respuesta);
        }
    }
}
