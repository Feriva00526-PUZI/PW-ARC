<?php
class Conexion
{
    private $conexion;
    private $configuracion = [
        "driver" => "mysql",
        "host" => "localhost",
        "database" => "arcpw3",
        "port" => "3306",
        "username" => "GeneralARCPW3",
        "password" => "ARCPW3General",
        "charset" => "utf8mb4"
    ];

    public function conectar()
    {
        $url = "";
        try {
            extract($this->configuracion);

            $url = "{$driver}:host={$host};port={$port};dbname={$database};charset={$charset}";

            $this->conexion = new PDO($url, $username, $password);

            $this->conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            return $this->conexion;
        } catch (PDOException $e) {
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
