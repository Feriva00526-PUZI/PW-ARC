<?php
require_once "./../conexion.php";

class organizadorDAO{

    private $id;
    private $conexion;

    public function __construct(){
        $conn = new conexion();
        $this->conexion = $conn->getConexion();
    }

    public function getEventosPorOrganizadora($idOrganizadora){
        try{
            $sql = "SELECT * FROM eventos WHERE id_organizadora = :id";
            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(":id", $idOrganizadora, PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch(PDOException $e){
            throw new Exception("Error al obtener eventos: " . $e->getMessage());
        }
    }

    public function getNumeroEventosEsteMes($idOrganizadora){
        try{
            $sql = "SELECT COUNT(*) AS total
                    FROM eventos
                    WHERE id_organizadora = :id
                    AND MONTH(fecha_evento) = MONTH(CURDATE())
                    AND YEAR(fecha_evento) = YEAR(CURDATE())";

            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(":id", $idOrganizadora, PDO::PARAM_INT);
            $stmt->execute();

            $res = $stmt->fetch(PDO::FETCH_ASSOC);
            return $res['total'];
        } catch(PDOException $e) {
            throw new Exception("Error al contar eventos del mes: " . $e->getMessage());
        }
    }

    public function getTipoActividadPorID($idTipoActividad){
        try{
            $sql = "SELECT * FROM tipo_actividad WHERE id_tipo_actividad = :id";
            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(":id", $idTipoActividad, PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch(PDOException $e){
            throw new Exception("Error al obtener tipo de actividad: " . $e->getMessage());
        }
    }

    public function getTodosTiposActividad(){
        try{
            $sql = "SELECT * FROM tipo_actividad ORDER BY nombre_tipo";
            $stmt = $this->conexion->prepare($sql);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch(PDOException $e){
            throw new Exception("Error al obtener tipos de actividad: " . $e->getMessage());
        }
    }


    public function getEventoPorID($idEvento){
        try{
            $sql = "SELECT * FROM eventos WHERE id_evento = :id";
            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(":id", $idEvento, PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch(PDOException $e){
            throw new Exception("Error al obtener evento: " . $e->getMessage());
        }
    }

    public function filtrarEventosPorLugar($idOrganizadora, $lugar){
        try{
            $sql = "SELECT * FROM eventos
                    WHERE id_organizadora = :id
                    AND LOWER(lugar) LIKE LOWER(:lugar)";

            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(":id", $idOrganizadora, PDO::PARAM_INT);
            $stmt->bindValue(":lugar", "%$lugar%", PDO::PARAM_STR);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch(PDOException $e){
            throw new Exception("Error al filtrar por lugar: " . $e->getMessage());
        }
    }

    public function filtrarEventosPorFecha($idOrganizadora, $inicio, $fin){
        try{
            $sql = "SELECT * FROM eventos
                    WHERE id_organizadora = :id
                    AND fecha_evento BETWEEN :inicio AND :fin";

            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(":id", $idOrganizadora, PDO::PARAM_INT);
            $stmt->bindParam(":inicio", $inicio);
            $stmt->bindParam(":fin", $fin);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch(PDOException $e){
            throw new Exception("Error al filtrar por fecha: " . $e->getMessage());
        }
    }

    public function ordenarEventosPorFecha($idOrganizadora, $asc = true){
        try{
            $orden = $asc ? "ASC" : "DESC";

            $sql = "SELECT * FROM eventos
                    WHERE id_organizadora = :id
                    ORDER BY fecha_evento $orden";

            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(":id", $idOrganizadora, PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch(PDOException $e){
            throw new Exception("Error al ordenar eventos: " . $e->getMessage());
        }
    }


}
?>