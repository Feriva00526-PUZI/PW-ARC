<?php
require_once "./../conexion.php";

class paqueteDAO{

    private $id;
    private $conexion;

    public function __construct(){
        $conn = new conexion();
        $this->conexion = $conn->getConexion();
    }

    public function getPaquetesPorAgencia($idAgencia){
        try{
            $sql = "SELECT P.*, L.nombre_lugar as lugar FROM paquetes P 
                    LEFT JOIN lugares L ON P.id_lugar = L.id_lugar 
                    WHERE P.id_agencia = :id";
            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(":id", $idAgencia, PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch(PDOException $e){
            throw new Exception("Error al obtener paquetes: " . $e->getMessage());
        }
    }

    public function getPaquetePorID($idPaquete){
        try{
            $sql = "SELECT * FROM paquetes WHERE id_paquete = :id";
            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(":id", $idPaquete, PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch(PDOException $e){
            throw new Exception("Error al obtener paquete: " . $e->getMessage());
        }
    }

    public function getNumeroPaquetesEsteMes($idAgencia){
        try{
            // Como los paquetes no tienen fecha_registro, contamos todos los paquetes de la agencia
            // O podrías usar la fecha de creación si la agregas a la tabla
            $sql = "SELECT COUNT(*) AS total
                    FROM paquetes
                    WHERE id_agencia = :id";

            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(":id", $idAgencia, PDO::PARAM_INT);
            $stmt->execute();

            $res = $stmt->fetch(PDO::FETCH_ASSOC);
            return $res['total'];
        } catch(PDOException $e) {
            throw new Exception("Error al contar paquetes: " . $e->getMessage());
        }
    }

    public function filtrarPaquetesPorLugar($idAgencia, $lugar){
        try{
            $sql = "SELECT P.*, L.nombre_lugar as lugar FROM paquetes P
                    LEFT JOIN lugares L ON P.id_lugar = L.id_lugar
                    WHERE P.id_agencia = :id
                    AND LOWER(L.nombre_lugar) LIKE LOWER(:lugar)";

            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(":id", $idAgencia, PDO::PARAM_INT);
            $stmt->bindValue(":lugar", "%$lugar%", PDO::PARAM_STR);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch(PDOException $e){
            throw new Exception("Error al filtrar por lugar: " . $e->getMessage());
        }
    }

    public function ordenarPaquetesPorPrecio($idAgencia, $asc = true){
        try{
            $orden = $asc ? "ASC" : "DESC";

            $sql = "SELECT P.*, L.nombre_lugar as lugar FROM paquetes P
                    LEFT JOIN lugares L ON P.id_lugar = L.id_lugar
                    WHERE P.id_agencia = :id
                    ORDER BY P.precio $orden";

            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(":id", $idAgencia, PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch(PDOException $e){
            throw new Exception("Error al ordenar paquetes: " . $e->getMessage());
        }
    }

    public function crearPaquete($nombre_paquete, $descripcion_paquete, $precio, $imagen_url, $id_lugar, $id_agencia) {
        try {
            $sql = "INSERT INTO paquetes (
                        nombre_paquete, 
                        descripcion_paquete, 
                        precio, 
                        imagen_url,
                        id_lugar, 
                        id_agencia
                    ) VALUES (
                        :nombre_paquete, 
                        :descripcion_paquete, 
                        :precio, 
                        :imagen_url, 
                        :id_lugar, 
                        :id_agencia 
                    )";

            $stmt = $this->conexion->prepare($sql);

            // Vinculación de parámetros
            $stmt->bindParam(":nombre_paquete", $nombre_paquete);
            $stmt->bindParam(":descripcion_paquete", $descripcion_paquete);
            $stmt->bindValue(":precio", (float)$precio, PDO::PARAM_STR);
            $stmt->bindParam(":imagen_url", $imagen_url);
            $stmt->bindParam(":id_lugar", $id_lugar);
            $stmt->bindParam(":id_agencia", $id_agencia); 

            if ($stmt->execute()) {
                return $this->conexion->lastInsertId();
            } else {
                return false;
            }

        } catch (PDOException $e) {
            error_log("Error en PaqueteDAO::crearPaquete: " . $e->getMessage());
            return false;
        }
    }

    public function actualizarPaquete($id_paquete, $nombre_paquete, $descripcion_paquete, $precio, $id_lugar) {
        try {
            $sql = "UPDATE paquetes SET 
                nombre_paquete = :nombre_paquete, 
                descripcion_paquete = :descripcion_paquete, 
                precio = :precio, 
                id_lugar = :id_lugar 
                WHERE id_paquete = :id_paquete";

            $stmt = $this->conexion->prepare($sql);
            
            $stmt->bindParam(':id_paquete', $id_paquete, PDO::PARAM_INT);
            $stmt->bindParam(':nombre_paquete', $nombre_paquete, PDO::PARAM_STR);
            $stmt->bindParam(':descripcion_paquete', $descripcion_paquete, PDO::PARAM_STR);
            $stmt->bindValue(':precio', (float)$precio, PDO::PARAM_STR);
            $stmt->bindParam(':id_lugar', $id_lugar, PDO::PARAM_INT);

            return $stmt->execute();
        } catch (PDOException $e) {
            throw new Exception("Error al actualizar paquete: " . $e->getMessage());
        }
    }

    public function actualizarImagen($id_paquete, $nuevoNombreImagen) {
        if (empty($nuevoNombreImagen)) {
            throw new Exception("El nombre de la imagen no puede estar vacío.");
        }

        $sql = "UPDATE paquetes SET imagen_url = :imagen WHERE id_paquete = :id_paquete";
        
        $stmt = $this->conexion->prepare($sql);

        $stmt->bindParam(':imagen', $nuevoNombreImagen, PDO::PARAM_STR);
        $stmt->bindParam(':id_paquete', $id_paquete, PDO::PARAM_INT);

        return $stmt->execute();
    }

    public function eliminarPaquete($id_paquete) {
        $sql = "DELETE FROM paquetes WHERE id_paquete = :id_paquete";
        
        $stmt = $this->conexion->prepare($sql);

        $stmt->bindParam(':id_paquete', $id_paquete, PDO::PARAM_INT);

        return $stmt->execute();
    }

}
?>

