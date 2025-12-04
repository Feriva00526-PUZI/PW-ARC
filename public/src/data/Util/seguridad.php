<?php
require_once '.\..\conexion.php';
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function sanitizar(&$DATOS)
{
    foreach ($DATOS as $llave => &$valor) {
        $valor = strip_tags($valor);
        $valor = trim($valor);
        $valor = htmlspecialchars($valor, ENT_QUOTES, 'UTF-8');
        $valor = stripslashes($valor);
    }
}

function sanitizarUsuario($usuario)
{
    $usuario = strip_tags($usuario);
    $usuario = trim($usuario);
    $usuario = htmlspecialchars($usuario, ENT_QUOTES, 'UTF-8');
    $usuario = stripslashes($usuario);
    return $usuario;
}

function sanitizarPassword($password)
{
    $password = trim($password);

    return $password;
}

function sanitizarTexto($texto)
{
    $texto = strip_tags($texto);
    $texto = trim($texto);
    $texto = htmlspecialchars($texto, ENT_QUOTES, 'UTF-8');
    $texto = stripslashes($texto);
    return $texto;
}

function sanitizarEntero($numero)
{
    return filter_var($numero, FILTER_SANITIZE_NUMBER_INT);
}

function sanitizarDecimal($numero)
{
    return filter_var($numero, FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
}

function iniciarSesion($usuario, $tipoUsuario, $datosUsuario = null)
{
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    $_SESSION['tipo_usuario'] = $tipoUsuario;
    $_SESSION['usuario'] = $usuario;

    if ($datosUsuario !== null) {
        switch ($tipoUsuario) {
            case 'administrador':
                $_SESSION['id_admin'] = $datosUsuario['id_admin'] ?? null;
                $_SESSION['nombre'] = $datosUsuario['nombre'] ?? null;
                break;
            case 'organizadora':
                $_SESSION['id_organizadora'] = $datosUsuario['id_organizadora'] ?? null;
                break;
            case 'agencia':
                $_SESSION['id_agencia'] = $datosUsuario['id_agencia'] ?? null;
                break;
            case 'usuario':
                $_SESSION['id_cliente'] = $datosUsuario['id_cliente'] ?? null;
                $_SESSION['nombre'] = $datosUsuario['nombre'] ?? null;
                break;
        }
    }

    return true;
}

function verificarPermisos($accion)
{
    if (!isset($_SESSION['tipo_usuario'])) {
        return false; // No logueado
    }

    $tipo = $_SESSION['tipo_usuario'];

    $permisos = [

        "administrador" => [
            "ver_reportes",
            "crear_lugar",
            "editar_lugar",
            "eliminar_lugar",
        ],

        "organizadora" => [
            "crear_evento",
            "editar_evento",
            "ver_eventos",
        ],

        "agencia" => [
            "crear_paquete",
            "editar_paquete",
            "eliminar_paquete",
        ],

        "usuario" => [
            "ver_eventos",
            "crear_lugar",
            "editar_lugar",
            "registrarse_evento",
        ]
    ];

    if (!isset($permisos[$tipo])) {
        return false;
    }

    return in_array($accion, $permisos[$tipo]);
}


function redirigirAlIndex()
{
    header("Location: ./../../../index.html");
    exit;
}
