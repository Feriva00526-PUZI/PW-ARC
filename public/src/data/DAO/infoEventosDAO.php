<?php
require_once "./../conexion.php";

class infoEventosDAO
{
    private $id;
    private $conexion;

    public function __construct()
    {
        $conn = new conexion();
        $this->conexion = $conn->getConexion();
    }
    public function getMasPopulares()
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
                    LIMIT 5";

            $stmt = $this->conexion->prepare($sql);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            throw new Exception("Error al obtener los lugares más populares: " . $e->getMessage());
        }
    }

    public function getMenosPopulares()
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
                    ORDER BY total_asistencias ASC, l.nombre_lugar ASC 
                    LIMIT 5";

            $stmt = $this->conexion->prepare($sql);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            throw new Exception("Error al obtener los lugares menos populares: " . $e->getMessage());
        }
    }
    public function getEventosMasPopulares()
    {
        try {
            $sql = "SELECT 
                        e.id_evento, e.nombre_evento, e.descripcion, e.fecha_evento, e.hora_evento, e.imagen_url,
                        l.nombre_lugar,
                        COUNT(r.id_reservacion) AS total_asistencias
                    FROM eventos e 
                    LEFT JOIN lugares l ON e.id_lugar = l.id_lugar 
                    LEFT JOIN reservaciones r ON e.id_evento = r.id_evento AND r.estado = 'completado' 
                    GROUP BY e.id_evento, e.nombre_evento, e.descripcion, e.fecha_evento, e.hora_evento, e.imagen_url, l.nombre_lugar
                    ORDER BY total_asistencias DESC, e.nombre_evento ASC 
                    LIMIT 5";

            $stmt = $this->conexion->prepare($sql);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            throw new Exception("Error al obtener los eventos más populares: " . $e->getMessage());
        }
    }
    public function getEventosMenosPopulares()
    {
        try {
            $sql = "SELECT 
                        e.id_evento, e.nombre_evento, e.descripcion, e.fecha_evento, e.hora_evento, e.imagen_url,
                        l.nombre_lugar,
                        COUNT(r.id_reservacion) AS total_asistencias
                    FROM eventos e 
                    LEFT JOIN lugares l ON e.id_lugar = l.id_lugar 
                    LEFT JOIN reservaciones r ON e.id_evento = r.id_evento AND r.estado = 'completado' 
                    GROUP BY e.id_evento, e.nombre_evento, e.descripcion, e.fecha_evento, e.hora_evento, e.imagen_url, l.nombre_lugar
                    ORDER BY total_asistencias ASC, e.nombre_evento ASC 
                    LIMIT 5";

            $stmt = $this->conexion->prepare($sql);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            throw new Exception("Error al obtener los eventos menos populares: " . $e->getMessage());
        }
    }

    public function getAsistenciasCompletadas()
    {
        try {
            $sql = "SELECT COUNT(id_reservacion) AS count FROM reservaciones WHERE estado = 'completado'";
            $stmt = $this->conexion->prepare($sql);
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return $result['count'] ?? 0;
        } catch (PDOException $e) {
            throw new Exception("Error al obtener asistencias completadas: " . $e->getMessage());
        }
    }

    public function getReservacionesPendientes()
    {
        try {
            $sql = "SELECT COUNT(id_reservacion) AS count FROM reservaciones WHERE estado = 'pendiente'";
            $stmt = $this->conexion->prepare($sql);
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return $result['count'] ?? 0;
        } catch (PDOException $e) {
            throw new Exception("Error al obtener reservaciones pendientes: " . $e->getMessage());
        }
    }

    public function getReservacionesCanceladas()
    {
        try {
            $sql = "SELECT COUNT(id_reservacion) AS count FROM reservaciones WHERE estado = 'cancelado'";
            $stmt = $this->conexion->prepare($sql);
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return $result['count'] ?? 0;
        } catch (PDOException $e) {
            throw new Exception("Error al obtener reservaciones canceladas: " . $e->getMessage());
        }
    }

    public function getReservacionesTotales()
    {
        try {
            $sql = "SELECT COUNT(id_reservacion) AS count FROM reservaciones";
            $stmt = $this->conexion->prepare($sql);
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return $result['count'] ?? 0;
        } catch (PDOException $e) {
            throw new Exception("Error al obtener reservaciones totales: " . $e->getMessage());
        }
    }
    public function getViajesMasPopulares()
    {
        try {
            $sql = "SELECT 
                        p.id_paquete, p.nombre_paquete, p.descripcion_paquete, p.costo_base, p.imagen_url,
                        l.nombre_lugar, 
                        a.nombre_agencia,
                        COUNT(v.id_viaje) AS total_viajes
                    FROM paquetes p 
                    LEFT JOIN lugares l ON p.id_lugar = l.id_lugar 
                    LEFT JOIN agencias a ON p.id_agencia = a.id_agencia
                    LEFT JOIN viajes v ON p.id_paquete = v.id_paquete AND v.estado = 'completado' 
                    GROUP BY p.id_paquete, l.nombre_lugar, a.nombre_agencia
                    ORDER BY total_viajes DESC, p.nombre_paquete ASC 
                    LIMIT 5";

            $stmt = $this->conexion->prepare($sql);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            throw new Exception("Error al obtener los viajes más populares: " . $e->getMessage());
        }
    }

    public function getViajesMenosPopulares()
    {
        try {
            $sql = "SELECT 
                        p.id_paquete, p.nombre_paquete, p.descripcion_paquete, p.costo_base, p.imagen_url,
                        l.nombre_lugar, 
                        a.nombre_agencia,
                        COUNT(v.id_viaje) AS total_viajes
                    FROM paquetes p 
                    LEFT JOIN lugares l ON p.id_lugar = l.id_lugar 
                    LEFT JOIN agencias a ON p.id_agencia = a.id_agencia
                    LEFT JOIN viajes v ON p.id_paquete = v.id_paquete AND v.estado = 'completado' 
                    GROUP BY p.id_paquete, l.nombre_lugar, a.nombre_agencia
                    ORDER BY total_viajes ASC, p.nombre_paquete ASC 
                    LIMIT 5";

            $stmt = $this->conexion->prepare($sql);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            throw new Exception("Error al obtener los viajes menos populares: " . $e->getMessage());
        }
    }
}
