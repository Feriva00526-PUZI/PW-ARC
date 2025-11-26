<?php
require_once "./../conexion.php";

class eventosDAO{

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
    
    public function getEventosParaCalendario($idOrganizadora){
        try{
            $sql = 
            "SELECT E.id_evento, E.nombre_evento, E.descripcion, E.fecha_evento, E.hora_evento, E.precio_boleto, E.imagen_url, L.nombre_lugar 
            FROM eventos E
            JOIN lugares L ON E.id_lugar = L.id_lugar
            where id_organizadora = :id";

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
            $sql = "SELECT * FROM tipoactividad WHERE id_tipo_actividad = :id";
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

    public function actualizarFechaEvento($idEvento, $nuevaFecha) {
        try {
            $sql = "UPDATE eventos SET fecha_evento = :fecha WHERE id_evento = :id";
            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(":id", $idEvento, PDO::PARAM_INT);
            $stmt->bindParam(":fecha", $nuevaFecha, PDO::PARAM_STR);

            return $stmt->execute();
        } catch(PDOException $e) {
            throw new Exception("Error al actualizar fecha del evento: " . $e->getMessage());
        }
    }

    public function actualizarEvento($id_evento, $nombre, $descripcion, $hora_evento, $precio_boleto, $id_lugar, $id_tipo_actividad) {
        // Preparar la consulta SQL
        $sql = "UPDATE eventos SET 
            nombre_evento = :nombre, 
            descripcion = :descripcion, 
            hora_evento = :hora_evento, 
            precio_boleto = :precio_boleto, 
            id_lugar = :id_lugar, 
            id_tipo_actividad = :id_tipo_actividad 
            WHERE id_evento = :id_evento";

        // Preparar la conexión
        $stmt = $this->conexion->prepare($sql);
        
        // Ejecutar la consulta con los parámetros
        $stmt->bindParam(':id_evento', $id_evento, PDO::PARAM_INT);
        $stmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);
        $stmt->bindParam(':descripcion', $descripcion, PDO::PARAM_STR);
        $stmt->bindParam(':hora_evento', $hora_evento, PDO::PARAM_STR);  // 'HH:MM:SS'
        $stmt->bindParam(':precio_boleto', $precio_boleto, PDO::PARAM_STR);  // Para manejar decimales
        $stmt->bindParam(':id_lugar', $id_lugar, PDO::PARAM_INT);
        $stmt->bindParam(':id_tipo_actividad', $id_tipo_actividad, PDO::PARAM_INT);

        // Retornar el resultado de la ejecución
        return $stmt->execute();
    }

    public function actualizarImagen($id_evento, $nuevoNombreImagen) {
        // Validar que el nuevo nombre de la imagen no este vacio
        if (empty($nuevoNombreImagen)) {
            throw new Exception("El nombre de la imagen no puede estar vacío.");
        }

        // Preparar la consulta SQL para actualizar solo la imagen
        $sql = "UPDATE eventos SET imagen_url = :imagen WHERE id_evento = :id_evento";
        
        // Preparar la conexión
        $stmt = $this->conexion->prepare($sql);

        // Ejecutar la consulta con los parámetros
        $stmt->bindParam(':imagen', $nuevoNombreImagen, PDO::PARAM_STR);
        $stmt->bindParam(':id_evento', $id_evento, PDO::PARAM_INT);

        // Retornar el resultado de la ejecución
        return $stmt->execute();
    }
         //$id_nuevo_evento = $eventosDAO->crearEvento($nombre, $descripcion, $fecha_evento, $hora_evento, $fechaActual, $precio_boleto, "", $id_lugar, $id_tipo_actividad, $id_organizador);
    public function crearEvento($nombre_evento, $descripcion, $fecha_evento, $hora_evento, $fecha_registro, $precio_boleto, $imagen_url, $id_lugar, $id_tipo_actividad, $id_organizadora) {
        try {
            $sql = "INSERT INTO eventos (
                        nombre_evento, 
                        descripcion, 
                        fecha_evento, 
                        hora_evento, 
                        fecha_registro,
                        precio_boleto, 
                        imagen_url,
                        id_lugar, 
                        id_tipo_actividad, 
                        id_organizadora
                    ) VALUES (
                        :nombre_evento, 
                        :descripcion, 
                        :fecha_evento, 
                        :hora_evento, 
                        :fecha_registro,
                        :precio_boleto, 
                        :imagen_url, 
                        :id_lugar, 
                        :id_tipo_actividad,
                        :id_organizadora 
                    )";

            $stmt = $this->conexion->prepare($sql);

            // Vinculación de parámetros
            $stmt->bindParam(":nombre_evento", $nombre_evento);
            $stmt->bindParam(":descripcion", $descripcion);
            $stmt->bindParam(":fecha_evento", $fecha_evento);
            $stmt->bindParam(":hora_evento", $hora_evento);
            $stmt->bindParam(":fecha_registro", $fecha_registro);
            $stmt->bindValue(":precio_boleto", (float)$precio_boleto, PDO::PARAM_STR);
            $stmt->bindParam(":imagen_url", $imagen_url);
            $stmt->bindParam(":id_lugar", $id_lugar);
            $stmt->bindParam(":id_tipo_actividad", $id_tipo_actividad);
            $stmt->bindParam(":id_organizadora", $id_organizadora); 

            if ($stmt->execute()) {
                return $this->conexion->lastInsertId();
            } else {
                return false;
            }

        } catch (PDOException $e) {
            error_log("Error en EventosDAO::crearEvento: " . $e->getMessage());
            return false;
        }
    }

    public function eliminarEvento($id_evento) {
        // Preparar la consulta SQL para actualizar solo la imagen
        $sql = "DELETE FROM eventos WHERE id_evento = :id_evento";
        
        // Preparar la conexión
        $stmt = $this->conexion->prepare($sql);

        // Ejecutar la consulta con los parámetros
        $stmt->bindParam(':id_evento', $id_evento, PDO::PARAM_INT);

        return $stmt->execute();
    }

}