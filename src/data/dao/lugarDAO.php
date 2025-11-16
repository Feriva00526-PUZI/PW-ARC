<?php
require_once "./../conexion.php";

class lugarDAO
{

    private $id;
    private $conexion;

    public function __construct()
    {
        $conn = new conexion();
        $this->conexion = $conn->getConexion();
    }

    public function getLugares()
    {
        try {
            $sql = "SELECT * FROM lugares ORDER BY zona";

            $stmt = $this->conexion->prepare($sql);
            $stmt->execute();

            $lugar = $stmt->fetchALL(PDO::FETCH_ASSOC);
            return $lugar;
        } catch (PDOException $e) {
            throw new Exception("Error al realizar la consulta en la base de datos: " . $e->getMessage());
        }
    }

    public function crearLugar($nombre, $descripcion, $direccion, $ciudad, $zona, $id_admin)
    {
        try {
            $sql = "INSERT INTO lugares (nombre_lugar, descripcion, direccion, ciudad, zona, imagen_url,id_admin) 
                    VALUES (:nombre, :descripcion, :direccion, :ciudad, :zona, :temp_url, :id_admin)";

            $temp_url = "nourl";
            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(':nombre', $nombre);
            $stmt->bindParam(':descripcion', $descripcion);
            $stmt->bindParam(':direccion', $direccion);
            $stmt->bindParam(':ciudad', $ciudad);
            $stmt->bindParam(':zona', $zona);
            $stmt->bindParam(':temp_url', $temp_url);
            $stmt->bindParam(':id_admin', $id_admin);
            $stmt->execute();

            return $this->conexion->lastInsertId();
        } catch (PDOException $e) {
            throw new Exception("Error en la creacion del lugar en la base de datos: " . $e->getMessage());
        }
    }

    public function updateImagen($id, $imagen_nombre)
    {
        try {
            $sql = "UPDATE lugares SET imagen_url = :imagen_nombre WHERE id_lugar = :id";
            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(':imagen_nombre', $imagen_nombre);
            $stmt->bindParam(':id', $id);
            return $stmt->execute();
        } catch (PDOException $e) {
            throw new Exception("Error al actualizar la imagen del lugar en la base de datos: " . $e->getMessage());
        }
    }

    public function eliminarLugarPorId($id)
    {
        try {
            $sql = "DELETE FROM lugares WHERE id_lugar = :id";
            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(':id', $id);
            return $stmt->execute();
        } catch (PDOException $e) {
            return false;
        }
    }

    public function getLugarPorID($idLugar)
    {
        try {
            $sql = "SELECT * FROM lugares WHERE id_lugar = :id";
            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(":id", $idLugar, PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            throw new Exception("Error al obtener lugar: " . $e->getMessage());
        }
    }

    public function updateLugar($id, $nombre, $descripcion, $direccion, $ciudad, $zona)
    {
        try {
            $sql = "UPDATE lugares SET nombre_lugar = :nombre, descripcion = :descripcion, direccion = :direccion, ciudad = :ciudad, zona = :zona WHERE id_lugar = :id";

            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(':nombre', $nombre);
            $stmt->bindParam(':descripcion', $descripcion);
            $stmt->bindParam(':direccion', $direccion);
            $stmt->bindParam(':ciudad', $ciudad);
            $stmt->bindParam(':zona', $zona);
            $stmt->bindParam(':id', $id);
            return $stmt->execute();
        } catch (PDOException $e) {
            throw new Exception("Error al actualizar el lugar en la base de datos: " . $e->getMessage());
        }
    }
}
