<?php
require_once "./../conexion.php";

class ReservacionesDAO
{

    private $conexion;

    public function __construct()
    {
        $conn = new Conexion();
        $this->conexion = $conn->getConexion();
    }

    /**
     * Obtiene el historial detallado de reservaciones de eventos para un cliente.
     * Realiza INNER JOIN con 'eventos', 'lugares', 'tipoactividad' y 'organizadoras'
     * para obtener todos los detalles solicitados.
     */
    public function obtenerHistorialDetallado($id_cliente)
    {
        try {
            $sql = "SELECT 
                        r.id_reservacion,
                        r.estado AS estado_reservacion,
                        e.nombre_evento,
                        e.fecha_evento,
                        e.hora_evento,
                        e.precio_boleto,
                        e.cupo_disponible,
                        e.descripcion,
                        l.nombre_lugar,
                        l.ciudad,
                        t.tipo AS tipo_actividad,
                        o.nombre_organizadora
                    FROM reservaciones r
                    INNER JOIN eventos e ON r.id_evento = e.id_evento
                    INNER JOIN lugares l ON e.id_lugar = l.id_lugar
                    INNER JOIN tipoactividad t ON e.id_tipo_actividad = t.id_tipo_actividad
                    INNER JOIN organizadoras o ON e.id_organizadora = o.id_organizadora
                    WHERE r.id_cliente = :id_cliente
                    ORDER BY e.fecha_evento DESC";

            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(':id_cliente', $id_cliente);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            // Se lanza una excepción para que HistorialLogic.php la maneje.
            throw new Exception("Error al consultar historial de reservaciones: " . $e->getMessage());
        }
    }
    
    /**
     * Actualiza el estado de una reservación a 'cancelado'.
     */
    public function cancelarReservacion($id_reservacion)
    {
        try {
            $sql = "UPDATE reservaciones SET estado = 'cancelado' WHERE id_reservacion = :id_reservacion AND estado <> 'cancelado'";
            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(':id_reservacion', $id_reservacion, PDO::PARAM_INT);
            
            return $stmt->execute();
        } catch (PDOException $e) {
            throw new Exception("Error al cancelar reservación: " . $e->getMessage());
        }
    }
}
?>
