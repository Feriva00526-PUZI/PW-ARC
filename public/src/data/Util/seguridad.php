<?php
class Seguridad {
    
    public static function iniciarSesion() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }
    
    public static function sanitizar($input) {
        if (is_null($input)) {
            return '';
        }
        $input = trim($input);
        $input = htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
        return $input;
    }
    
    public static function establecerSesion($tipo, $datos) {
        self::iniciarSesion();
        $_SESSION['tipo_usuario'] = $tipo;
        $_SESSION['usuario'] = $datos;
        $_SESSION['autenticado'] = true;
    }
    
    public static function verificarPassword($password, $hash) {
        if (strlen($hash) === 60 && substr($hash, 0, 4) === '$2y$') {
            return password_verify($password, $hash);
        }
        return $password === $hash;
    }
    
    public static function cerrarSesion() {
        session_destroy();
    }
}
?>
