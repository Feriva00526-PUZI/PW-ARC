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
                        p.id_paquete, p.nombre_paquete, p.descripcion_paquete, p.precio, p.imagen_url,
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
                        p.id_paquete, p.nombre_paquete, p.descripcion_paquete, p.precio, p.imagen_url,
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
    public function getViajesMejorRemunerados()
    {
        try {
            $sql = "SELECT 
                        p.id_paquete, p.nombre_paquete, p.descripcion_paquete, p.precio, p.imagen_url,
                        l.nombre_lugar, 
                        a.nombre_agencia,
                        COUNT(v.id_viaje) AS total_viajes,
                        (COUNT(v.id_viaje) * p.precio) AS remuneracion_total
                    FROM paquetes p 
                    LEFT JOIN lugares l ON p.id_lugar = l.id_lugar 
                    LEFT JOIN agencias a ON p.id_agencia = a.id_agencia
                    LEFT JOIN viajes v ON p.id_paquete = v.id_paquete AND v.estado = 'completado' 
                    GROUP BY p.id_paquete, l.nombre_lugar, a.nombre_agencia
                    ORDER BY remuneracion_total DESC, p.nombre_paquete ASC 
                    LIMIT 5";

            $stmt = $this->conexion->prepare($sql);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            throw new Exception("Error al obtener los viajes mejor remunerados: " . $e->getMessage());
        }
    }

    public function getViajesPeorRemunerados()
    {
        try {
            $sql = "SELECT 
                        p.id_paquete, p.nombre_paquete, p.descripcion_paquete, p.precio, p.imagen_url,
                        l.nombre_lugar, 
                        a.nombre_agencia,
                        COUNT(v.id_viaje) AS total_viajes,
                        (COUNT(v.id_viaje) * p.precio) AS remuneracion_total
                    FROM paquetes p 
                    LEFT JOIN lugares l ON p.id_lugar = l.id_lugar 
                    LEFT JOIN agencias a ON p.id_agencia = a.id_agencia
                    LEFT JOIN viajes v ON p.id_paquete = v.id_paquete AND v.estado = 'completado' 
                    GROUP BY p.id_paquete, l.nombre_lugar, a.nombre_agencia
                    ORDER BY remuneracion_total ASC, p.nombre_paquete ASC 
                    LIMIT 5";

            $stmt = $this->conexion->prepare($sql);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            throw new Exception("Error al obtener los viajes peor remunerados: " . $e->getMessage());
        }
    }
    public function getAgenciasMejorRemuneradas()
    {
        try {
            $sql = "SELECT 
                    a.id_agencia, a.nombre_agencia, a.direccion, a.telefono, a.correo, a.imagen_url,
                    COUNT(DISTINCT p.id_paquete) AS total_paquetes,
                    SUM(CASE WHEN v.estado = 'completado' THEN p.precio ELSE 0 END) AS remuneracion_total
                FROM agencias a
                LEFT JOIN paquetes p ON a.id_agencia = p.id_agencia
                LEFT JOIN viajes v ON p.id_paquete = v.id_paquete
                GROUP BY a.id_agencia
                ORDER BY remuneracion_total DESC, a.nombre_agencia ASC
                LIMIT 5";

            $stmt = $this->conexion->prepare($sql);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            throw new Exception("Error al obtener las agencias mejor remuneradas: " . $e->getMessage());
        }
    }

    public function getAgenciasPeorRemuneradas()
    {
        try {
            $sql = "SELECT 
                    a.id_agencia, a.nombre_agencia, a.direccion, a.telefono, a.correo, a.imagen_url,
                    COUNT(DISTINCT p.id_paquete) AS total_paquetes,
                    SUM(CASE WHEN v.estado = 'completado' THEN p.precio ELSE 0 END) AS remuneracion_total
                FROM agencias a
                LEFT JOIN paquetes p ON a.id_agencia = p.id_agencia
                LEFT JOIN viajes v ON p.id_paquete = v.id_paquete
                GROUP BY a.id_agencia
                ORDER BY remuneracion_total ASC, a.nombre_agencia ASC
                LIMIT 5";

            $stmt = $this->conexion->prepare($sql);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            throw new Exception("Error al obtener las agencias peor remuneradas: " . $e->getMessage());
        }
    }
    public function getOrganizadorasMejorRemuneradas()
    {
        try {
            $sql = "SELECT 
                        o.id_organizadora, o.nombre_agencia, o.direccion, o.telefono, o.correo, o.imagen_url,
                        SUM(CASE WHEN r.estado = 'completado' THEN e.precio_boleto ELSE 0 END) AS remuneracion_total
                    FROM organizadoras o
                    LEFT JOIN eventos e ON o.id_organizadora = e.id_organizadora
                    LEFT JOIN reservaciones r ON e.id_evento = r.id_evento
                    GROUP BY o.id_organizadora
                    ORDER BY remuneracion_total DESC, o.nombre_agencia ASC
                    LIMIT 5";

            $stmt = $this->conexion->prepare($sql);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            throw new Exception("Error al obtener las organizadoras mejor remuneradas por eventos: " . $e->getMessage());
        }
    }
    public function getOrganizadorasPeorRemuneradas()
    {
        try {
            $sql = "SELECT 
                        o.id_organizadora, o.nombre_agencia, o.direccion, o.telefono, o.correo, o.imagen_url,
                        SUM(CASE WHEN r.estado = 'completado' THEN e.precio_boleto ELSE 0 END) AS remuneracion_total
                    FROM organizadoras o
                    LEFT JOIN eventos e ON o.id_organizadora = e.id_organizadora
                    LEFT JOIN reservaciones r ON e.id_evento = r.id_evento
                    GROUP BY o.id_organizadora
                    ORDER BY remuneracion_total ASC, o.nombre_agencia ASC
                    LIMIT 5";

            $stmt = $this->conexion->prepare($sql);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            throw new Exception("Error al obtener las organizadoras peor remuneradas por eventos: " . $e->getMessage());
        }
    }
    public function getEventosMejorRemunerados()
    {
        try {
            $sql = "SELECT 
                        e.id_evento, e.nombre_evento, e.precio_boleto, e.descripcion, e.fecha_evento, e.hora_evento, e.imagen_url,
                        l.nombre_lugar,
                        COUNT(r.id_reservacion) AS total_asistencias,
                        (SUM(CASE WHEN r.estado = 'completado' THEN 1 ELSE 0 END) * e.precio_boleto) AS recaudacion_total
                    FROM eventos e 
                    LEFT JOIN lugares l ON e.id_lugar = l.id_lugar 
                    LEFT JOIN reservaciones r ON e.id_evento = r.id_evento
                    GROUP BY e.id_evento, e.nombre_evento, e.precio_boleto, l.nombre_lugar
                    ORDER BY recaudacion_total DESC, e.nombre_evento ASC 
                    LIMIT 5";

            $stmt = $this->conexion->prepare($sql);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            throw new Exception("Error al obtener los eventos mejor remunerados: " . $e->getMessage());
        }
    }

    public function getEventosPeorRemunerados()
    {
        try {
            $sql = "SELECT 
                        e.id_evento, e.nombre_evento,  e.precio_boleto,  e.descripcion, e.fecha_evento, e.hora_evento, e.imagen_url,
                        l.nombre_lugar,
                        COUNT(r.id_reservacion) AS total_asistencias,
                        (SUM(CASE WHEN r.estado = 'completado' THEN 1 ELSE 0 END) * e.precio_boleto) AS recaudacion_total
                    FROM eventos e 
                    LEFT JOIN lugares l ON e.id_lugar = l.id_lugar 
                    LEFT JOIN reservaciones r ON e.id_evento = r.id_evento
                    GROUP BY e.id_evento, e.nombre_evento, e.precio_boleto, l.nombre_lugar
                    ORDER BY recaudacion_total ASC, e.nombre_evento ASC 
                    LIMIT 5";

            $stmt = $this->conexion->prepare($sql);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            throw new Exception("Error al obtener los eventos peor remunerados: " . $e->getMessage());
        }
    }

    public function getLugares()
    {
        try {
            $sql = "SELECT id_lugar, nombre_lugar FROM lugares ORDER BY nombre_lugar ASC";

            $stmt = $this->conexion->prepare($sql);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            throw new Exception("Error al obtener la lista de lugares: " . $e->getMessage());
        }
    }

    public function getEventosPorLugar($id_lugar)
    {
        try {
            $sql = "SELECT 
                        e.id_evento, 
                        e.nombre_evento, 
                        e.id_organizadora 
                    FROM eventos e
                    WHERE e.id_lugar = :id_lugar
                    ORDER BY e.nombre_evento ASC";

            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(':id_lugar', $id_lugar, PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            throw new Exception("Error al obtener eventos por lugar: " . $e->getMessage());
        }
    }

    public function getOrganizadoraPorEvento($id_evento)
    {
        try {
            $sql = "SELECT 
                        o.id_organizadora, 
                        o.nombre_agencia 
                    FROM organizadoras o
                    INNER JOIN eventos e ON o.id_organizadora = e.id_organizadora
                    WHERE e.id_evento = :id_evento";

            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(':id_evento', $id_evento, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            throw new Exception("Error al obtener organizadora por evento: " . $e->getMessage());
        }
    }

    public function getOrganizadoraFiltrada($id_organizadora)
    {
        try {
            $sql = "SELECT 
                        o.id_organizadora, o.nombre_agencia, o.direccion, o.telefono, o.correo, o.imagen_url,
                        SUM(CASE WHEN r.estado = 'completado' THEN e.precio_boleto ELSE 0 END) AS remuneracion_total
                    FROM organizadoras o
                    LEFT JOIN eventos e ON o.id_organizadora = e.id_organizadora
                    LEFT JOIN reservaciones r ON e.id_evento = r.id_evento
                    WHERE o.id_organizadora = :id_organizadora 
                    GROUP BY o.id_organizadora";

            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(':id_organizadora', $id_organizadora, PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            throw new Exception("Error al obtener la organizadora filtrada: " . $e->getMessage());
        }
    }

    public function getDetalleOrganizadora($id_organizadora)
    {
        try {
            $sql = "SELECT 
                        o.id_organizadora, o.nombre_agencia, o.descripcion_agencia, o.direccion, o.telefono, o.correo, o.imagen_url,
                        COUNT(e.id_evento) AS total_eventos,
                        SUM(CASE WHEN r.estado = 'completado' THEN e.precio_boleto ELSE 0 END) AS remuneracion_total
                    FROM organizadoras o
                    LEFT JOIN eventos e ON o.id_organizadora = e.id_organizadora
                    LEFT JOIN reservaciones r ON e.id_evento = r.id_evento
                    WHERE o.id_organizadora = :id_organizadora 
                    GROUP BY o.id_organizadora";

            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(':id_organizadora', $id_organizadora, PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            throw new Exception("Error al obtener el detalle de la organizadora: " . $e->getMessage());
        }
    }
}
