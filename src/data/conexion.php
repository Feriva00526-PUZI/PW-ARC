<?php
class Conexion{
    private $conexion;

    public function conectar(){
        $url = "";
        try{
            // OBTENER VARIABLES DE ENTORNO DEL APACHE (SetEnv)
            $driver   = "mysql";
            $host     = getenv("DB_HOST") ?: "localhost";
            $database = getenv("DB_NAME") ?: "arcpw2";
            $port     = getenv("DB_PORT") ?: "3306";
            $username = getenv("DB_USER") ?: "GeneralARCPW2";
            $password = getenv("DB_PASSWORD") ?: "ARCPW2General";
            $charset  = "utf8mb4";

            // URL de conexión
            $url = "{$driver}:host={$host};port={$port};dbname={$database};charset={$charset}";

            // Crear conexión PDO
            $this->conexion = new PDO($url, $username, $password);

            // Modo de errores
            $this->conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            return $this->conexion;

        } catch (PDOException $e){ 
            error_log("Error en la conexion de la base de datos: " . $e->getMessage());
            return null;
        }
    }
    
    public function __destruct() {
        $this->conexion = NULL;
    }
    
    public function getConexion() {
        if ($this->conexion === NULL) {
            $this->conexion = $this->conectar();
        }
        return $this->conexion;
    }
}
