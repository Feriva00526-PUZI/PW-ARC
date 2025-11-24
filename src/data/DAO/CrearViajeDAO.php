<?php
class CrearViajeDAO{

    private $id;
    private $conexion;

    public function __construct(){
        $conn = new conexion();
        $this->conexion = $conn->getConexion();
    }

    public function crearViaje($id_cliente, $id_paquete, $estado, $fecha_viaje, $hora_viaje)
    {
        try {
            $sql = "INSERT INTO viajes (id_cliente, id_paquete, estado, fecha_viaje, hora_viaje) 
                    VALUES (:id_cliente, :id_paquete, :estado, :fecha_viaje, :hora_viaje)";

            $temp_url = "nourl";
            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(':id_cliente', $id_cliente);
            $stmt->bindParam(':id_paquete', $id_paquete);
            $stmt->bindParam(':estado', $estado);
            $stmt->bindParam(':fecha_viaje', $fecha_viaje);
            $stmt->bindParam(':hora_viaje', $hora_viaje);
            $stmt->execute();

            return $this->conexion->lastInsertId();
        } catch (PDOException $e) {
            throw new Exception("Error en la creacion del lugar en la base de datos: " . $e->getMessage());
        }
    }
}