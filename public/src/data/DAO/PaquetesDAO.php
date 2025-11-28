<?php
require_once "./../conexion.php";

class PaquetesDAO{

    private $id;
    private $conexion;

    public function __construct(){
        $conn = new conexion();
        $this->conexion = $conn->getConexion();
        
    }

    public function getPaquetes($id_lugar){
        try{
            $sql = "SELECT * FROM paquetes WHERE id_lugar = :id_lugar";
            
            $stmt = $this->conexion->prepare($sql);
            $stmt -> bindParam(':id_lugar', $id_lugar, PDO::PARAM_INT);
            $stmt->execute();

            $paquete = $stmt->fetchALL(PDO::FETCH_ASSOC);
            return $paquete;
        } catch (PDOException $e){
            throw new Exception("Error al realizar la consulta en la base de datos: " . $e->getMessage());
        }

    }
}