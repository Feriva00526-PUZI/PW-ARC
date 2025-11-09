<?php

class Conexion{
    private $conexion;
    private $configuracion = [
        "driver" => "mysql",
        "host" => "localhost",
        "database" => "arcpw2",
        "port" => "3306",
        "username" => "GeneralARCPW2",
        "password" => "ARCPW2General",
        "charset" => "utf8mb4"
    ];

    public function conectar(){
        $url = "";
        try{
            extract($this->configuracion); 
            
            $url = "{$driver}:host={$host};port={$port};dbname={$database};charset={$charset}";

            $this->conexion = new PDO($url, $username, $password);
            
            $this->conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            return $this->conexion;
            
        } catch (PDOException $e){ 
            echo "Error de Conexión a la BD: " . $e->getMessage();
            return null;
        }
    }
     public function __destruct() {
		$this->conexion = NULL;
	}
    public function getConexion() {
    	return $this->conexion;
    }
}
?>