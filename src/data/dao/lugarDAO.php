<?php
require_once "./../conexion.php";

class lugarDAO{

    private $id;
    private $conexion;

    public function __construct(){
        $conn = new conexion();
        $this->conexion = $conn->getConexion();
    }

    public function getLugares(){
        try{
            $sql = "SELECT * FROM lugares ORDER BY zona";

            $stmt = $this->conexion->prepare($sql);
            $stmt->execute();

            $lugar = $stmt->fetchALL(PDO::FETCH_ASSOC);
            return $lugar;
        }catch (PDOException $e){
            throw new Exception("Error al realizar la consulta: " . $e->getMessage());
        }

    }
}
?>