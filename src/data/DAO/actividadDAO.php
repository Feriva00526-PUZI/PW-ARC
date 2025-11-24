<?php
require_once "./../conexion.php";

class actividadDAO{

    private $id;
    private $conexion;

    public function __construct(){
        $conn = new conexion();
        $this->conexion = $conn->getConexion();
    }

    public function getActividades(){
        try{
            $sql = "SELECT * FROM tipoactividad";
            $stmt = $this->conexion->prepare($sql);
            $stmt->execute();

            $tipoActividad = $stmt->fetchALL(PDO::FETCH_ASSOC);
            return $tipoActividad;
        } catch(PDOException $e){
            throw new Exception("Error al obtener tipo de actividades: " . $e->getMessage());
        }
    }
}