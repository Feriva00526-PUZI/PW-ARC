<?php
require_once '.\..\conexion.php';
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

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
   Sanitización específica para usuario
   ===================================================== */
function sanitizarUsuario($usuario) {
    $usuario = strip_tags($usuario);
    $usuario = trim($usuario);
    $usuario = htmlspecialchars($usuario, ENT_QUOTES, 'UTF-8');
    $usuario = stripslashes($usuario);
    return $usuario;
}

/* =====================================================
   Sanitización específica para contraseña
   ===================================================== */
function sanitizarPassword($password) {
    $password = trim($password);
    // No aplicamos htmlspecialchars ni strip_tags a la contraseña
    // para mantener caracteres especiales que puedan ser válidos
    return $password;
}

/* =====================================================
   Iniciar sesión con tipo de usuario
   ===================================================== */
function iniciarSesion($usuario, $tipoUsuario, $datosUsuario = null) {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    
    $_SESSION['tipo_usuario'] = $tipoUsuario;
    $_SESSION['usuario'] = $usuario;
    
    // Guardar datos adicionales del usuario si se proporcionan
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