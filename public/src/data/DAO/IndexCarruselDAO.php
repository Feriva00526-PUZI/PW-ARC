<?php
require_once "./../conexion.php";

class IndexCarruselDAO
{
    private $conexion;

    public function __construct()
    {
        $conn = new conexion();
        $this->conexion = $conn->getConexion();
    }

    public function getLugaresMasPopulares($limite = 30)
    {
        try {
            $sql = "SELECT 
                        l.id_lugar, l.nombre_lugar, l.descripcion, l.direccion, l.ciudad, l.zona, l.imagen_url, 
                        (COUNT(r.id_reservacion) + COUNT(v.id_viaje)) AS total_asistencias 
                    FROM lugares l 
                    LEFT JOIN eventos e ON l.id_lugar = e.id_lugar 
                    LEFT JOIN reservaciones r ON e.id_evento = r.id_evento AND r.estado = 'completado' 
                    LEFT JOIN paquetes p ON l.id_lugar = p.id_lugar 
                    LEFT JOIN viajes v ON p.id_paquete = v.id_paquete AND v.estado = 'completado' 
                    GROUP BY l.id_lugar
                    ORDER BY total_asistencias DESC, l.nombre_lugar ASC 
                    LIMIT :limite";

            $stmt = $this->conexion->prepare($sql);
            $stmt->bindValue(':limite', (int)$limite, PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            throw new Exception("Error al obtener los lugares más populares para el carrusel de la página principal: " . $e->getMessage());
        }
    }
}

