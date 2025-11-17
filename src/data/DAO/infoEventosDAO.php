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
                        COUNT(r.id_reservacion) AS total_asistencias 
                    FROM lugares l 
                    LEFT JOIN eventos e ON l.id_lugar = e.id_lugar 
                    LEFT JOIN reservaciones r ON e.id_evento = r.id_evento AND r.estado = 'completado' 
                    GROUP BY l.id_lugar, l.nombre_lugar, l.descripcion, l.direccion, l.ciudad, l.zona, l.imagen_url
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
                        COUNT(r.id_reservacion) AS total_asistencias 
                    FROM lugares l 
                    LEFT JOIN eventos e ON l.id_lugar = e.id_lugar 
                    LEFT JOIN reservaciones r ON e.id_evento = r.id_evento AND r.estado = 'completado' 
                    GROUP BY l.id_lugar, l.nombre_lugar, l.descripcion, l.direccion, l.ciudad, l.zona, l.imagen_url
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
}
