<?php
require_once '.\..\conexion.php';
session_start();

/* =====================================================
   Sanitización
   ===================================================== */
function sanitizar(&$DATOS) {
    foreach ($DATOS as $llave => &$valor) {
        $valor = strip_tags($valor);
        $valor = trim($valor);
        $valor = htmlspecialchars($valor, ENT_QUOTES, 'UTF-8');
        $valor = stripslashes($valor);
    }
}


/* =====================================================
   Validar Usuario según tipo
   ===================================================== */
function validarUsuarios($user, $password, $userType) {
    require_once '../DAO/adminDAO.php';
    require_once '../DAO/organizadoraDAO.php';
    require_once '../DAO/agenciaDAO.php';
    require_once '../DAO/usuarioDAO.php';

    $resultado = false;

    switch ($userType) {

        case "administrador":
            $dao = new AdminDAO();
            $resultado = $dao->login($user, $password);
            break;

        case "organizadora":
            $dao = new OrganizadoraDAO();
            $resultado = $dao->login($user, $password);
            break;

        case "agencia":
            $dao = new AgenciaDAO();
            $resultado = $dao->login($user, $password);
            break;

        case "usuario":
            $dao = new UsuarioDAO();
            $resultado = $dao->login($user, $password);
            break;

        default:
            return false; // Tipo inválido
    }

    // Si se encontró el usuario, guardar tipo en sesión GLOBAL
    if ($resultado) {
        $_SESSION['tipo_usuario'] = $userType;
        $_SESSION['usuario'] = $user;
        return true;
    }

    return false;
}


/* =====================================================
   Verificación de permisos
   ===================================================== */
function verificarPermisos($accion) {
    if (!isset($_SESSION['tipo_usuario'])) {
        return false; // No logueado
    }

    $tipo = $_SESSION['tipo_usuario'];

    /* Acciones disponibles segun el rol */
    $permisos = [

        "administrador" => [
            "crear_evento",
            "editar_evento",
            "eliminar_evento",
            "ver_reportes",
            "gestionar_usuarios",
        ],

        "organizadora" => [
            "crear_evento",
            "editar_evento",
            "ver_eventos",
        ],

        "agencia" => [
            "ver_eventos",
            "registrar_clientes",
        ],

        "usuario" => [
            "ver_eventos",
            "registrarse_evento",
        ]
    ];

    // Validar que exista el tipo
    if (!isset($permisos[$tipo])) {
        return false;
    }

    // Validar que la acción solicitada está permitida
    return in_array($accion, $permisos[$tipo]);
}