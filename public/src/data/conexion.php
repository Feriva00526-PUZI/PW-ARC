<?php
class Conexion
{
    private $conexion;

    // NOTA: Usamos getenv() para leer las variables de entorno de Railway
    private $configuracion = [
        // Railway usa variables diferentes. Usamos getenv() para leerlas.
        "driver" => "mysql",
        "host" => 'localhost', // Valor por defecto local
        "database" => 'arcpw2', // Valor por defecto local
        "port" => '3306', // Valor por defecto local
        "username" => 'GeneralARCPW2', // Valor por defecto local
        "password" => 'ARCPW2General', // Valor por defecto local
        "charset" => "utf8mb4"
    ];

    public function conectar()
    {
        // 1. OBTENER VARIABLES DE ENTORNO DE RAILWAY
        // El host será MYSQL_HOST
        $host = getenv('MYSQL_HOST') ?: $this->configuracion['host'];
        // El puerto será MYSQL_PORT
        $port = getenv('MYSQL_PORT') ?: $this->configuracion['port'];
        // La base de datos será MYSQL_DATABASE
        $database = getenv('MYSQL_DATABASE') ?: $this->configuracion['database'];
        // El usuario será MYSQL_USER
        $username = getenv('MYSQL_USER') ?: $this->configuracion['username'];
        // La contraseña será MYSQL_PASSWORD
        $password = getenv('MYSQL_PASSWORD') ?: $this->configuracion['password'];

        $driver = $this->configuracion['driver'];
        $charset = $this->configuracion['charset'];

        $url = "";
        try {
            // Se usa el driver PDO que ya tienes
            $url = "{$driver}:host={$host};port={$port};dbname={$database};charset={$charset}";

            $this->conexion = new PDO($url, $username, $password);

            $this->conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            return $this->conexion;
        } catch (PDOException $e) {
            error_log("Error en la conexion de la base de datos: " . $e->getMessage());
            return null;
        }
    }

    // ... el resto de la clase (destruct y getConexion) es igual.
}
