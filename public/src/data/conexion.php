<?php
class Conexion
{
    private $conexion;

    // Configuración por defecto (usada si getenv() no devuelve valores, ej. en local)
    // NOTA: Se mantienen tus credenciales originales como fallback.
    private $configuracion = [
        "driver" => "mysql",
        "host" => 'localhost',
        "database" => 'arcpw2',
        "port" => '3306',
        "username" => 'GeneralARCPW2',
        "password" => 'ARCPW2General',
        "charset" => "utf8mb4"
    ];

    public function conectar()
    {
        // 1. OBTENER VARIABLES DE ENTORNO DE RAILWAY
        // Si la variable de entorno existe (en Railway), usa su valor. 
        // Si no existe (ej. local), usa el valor de la configuración por defecto (?:).
        $host = getenv('MYSQL_HOST') ?: $this->configuracion['host'];
        $port = getenv('MYSQL_PORT') ?: $this->configuracion['port'];
        $database = getenv('MYSQL_DATABASE') ?: $this->configuracion['database'];
        $username = getenv('MYSQL_USER') ?: $this->configuracion['username'];
        $password = getenv('MYSQL_PASSWORD') ?: $this->configuracion['password'];

        $driver = $this->configuracion['driver'];
        $charset = $this->configuracion['charset'];

        $url = "";
        try {
            // Construye la URL de conexión PDO
            $url = "{$driver}:host={$host};port={$port};dbname={$database};charset={$charset}";

            // Crea la conexión PDO
            $this->conexion = new PDO($url, $username, $password);

            $this->conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            return $this->conexion;
        } catch (PDOException $e) {
            // *** IMPORTANTE: Muestra el error de conexión directamente para debuggear en Railway ***
            // ESTO TE DIRÁ EL ERROR EXACTO. DEBES QUITAR EL 'die()' CUANDO SOLUCIONES EL PROBLEMA.
            die("💥 ERROR DE CONEXIÓN A LA BASE DE DATOS: " . $e->getMessage());
            // *** FIN DEL CÓDIGO TEMPORAL DE DEBUGGING ***

            error_log("Error en la conexion de la base de datos: " . $e->getMessage());
            return null;
        }
    }

    public function __destruct()
    {
        $this->conexion = NULL;
    }

    public function getConexion()
    {
        if ($this->conexion === NULL) {
            $this->conexion = $this->conectar();
        }
        return $this->conexion;
    }
}
