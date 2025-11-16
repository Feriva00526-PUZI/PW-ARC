<?php
require_once "./../conexion.php";

class viajesDAO {

    private $conexion;

    public function __construct() {
        $conn = new conexion();
        $this->conexion = $conn->getConexion();
    }

    public function obtenerViajesPorCliente($id_cliente) {
        try {
            $sql = "SELECT * FROM viajes WHERE id_cliente = :id_cliente";
            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(':id_cliente', $id_cliente);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);

        } catch (PDOException $e) {
            throw new Exception("Error al consultar viajes: " . $e->getMessage());

            public function cancelarViaje($id_viaje) {
    try {
        $sql = "UPDATE viajes SET estado = 'cancelado' WHERE id_viaje = :id_viaje";
        $stmt = $this->conexion->prepare($sql);
        $stmt->bindParam(':id_viaje', $id_viaje, PDO::PARAM_INT);
        return $stmt->execute();
    } catch (PDOException $e) {
        throw new Exception("Error al cancelar viaje: " . $e->getMessage());
    }
}
        }

        public function obtenerHistorialDetallado($id_cliente) {
    try {
        $sql = "SELECT 
                    v.id_viaje,
                    v.id_paquete,
                    v.estado,
                    v.fecha_viaje,
                    v.hora_viaje,
                    p.nombre_paquete,
                    l.nombre_lugar,
                    l.ciudad
                FROM viajes v
                INNER JOIN paquetes p ON v.id_paquete = p.id_paquete
                INNER JOIN lugares l ON p.id_lugar = l.id_lugar
                WHERE v.id_cliente = :id_cliente";

        $stmt = $this->conexion->prepare($sql);
        $stmt->bindParam(':id_cliente', $id_cliente);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);

    } catch (PDOException $e) {
        throw new Exception("Error al consultar historial detallado: " . $e->getMessage());
    }
}
    }
}
?>
