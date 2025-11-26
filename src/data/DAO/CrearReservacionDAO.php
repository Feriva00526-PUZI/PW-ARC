<?php
require_once "./../conexion.php";
class CrearReservacionDAO{

    private $id;
    private $conexion;

    public function __construct(){
        $conn = new conexion();
        $this->conexion = $conn->getConexion();
    }

    public function crearReservacion($id_evento,$id_cliente, $estado)
    {
        try {
            $sql = "INSERT INTO reservaciones (id_evento, id_cliente, estado) 
                    VALUES (:id_evento, :id_cliente, :estado)";

            $temp_url = "nourl";
            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(':id_evento', $id_evento);
            $stmt->bindParam(':id_cliente', $id_cliente);
            $stmt->bindParam(':estado', $estado);
            $stmt->execute();

            return $this->conexion->lastInsertId();
        } catch (PDOException $e) {
            throw new Exception("Error en la creacion del lugar en la base de datos: " . $e->getMessage());
        }
    }
}