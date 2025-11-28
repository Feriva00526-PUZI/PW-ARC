<?php
require_once "./../conexion.php";

class registroDAO
{

    private $id;
    private $conexion;

    public function __construct()
    {
        $conn = new conexion();
        $this->conexion = $conn->getConexion();
    }

    public function existeRegistro(string $user): bool
    {
        $sqlClientes = "SELECT COUNT(*) FROM clientes WHERE user = :user LIMIT 1";
        $stmt = $this->conexion->prepare($sqlClientes);
        $stmt->bindParam(':user', $user);
        $stmt->execute();
        if ($stmt->fetchColumn()) {
            return true;
        }

        $sqlOrganizadoras = "SELECT COUNT(*) FROM organizadoras WHERE user = :user LIMIT 1";
        $stmt = $this->conexion->prepare($sqlOrganizadoras);
        $stmt->bindParam(':user', $user);
        $stmt->execute();
        if ($stmt->fetchColumn()) {
            return true;
        }

        $sqlAgencias = "SELECT COUNT(*) FROM agencias WHERE user = :user LIMIT 1";
        $stmt = $this->conexion->prepare($sqlAgencias);
        $stmt->bindParam(':user', $user);
        $stmt->execute();
        if ($stmt->fetchColumn()) {
            return true;
        }

        return false;
    }

    public function registroUsuario($nombre, $apellido, $correo, $telefono, $usuario, $contra)
    {
        try {
            $sql = "INSERT INTO `clientes` (`user`, `password`, `nombre`, `ap1`, `correo`, `telefono`) VALUES 
                    (:usuario, :contra, :nombre, :apellido, :correo, :telefono)";

            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(':usuario', $usuario);
            $stmt->bindParam(':contra', $contra);
            $stmt->bindParam(':nombre', $nombre);
            $stmt->bindParam(':apellido', $apellido);
            $stmt->bindParam(':correo', $correo);
            $stmt->bindParam(':telefono', $telefono);
            $stmt->execute();

            return $this->conexion->lastInsertId();
        } catch (PDOException $e) {
            throw new Exception("Error en la creacion del lugar en la base de datos: " . $e->getMessage());
        }
    }

    public function registroOrganizadora($nombre_agencia, $descripcion, $correo, $telefono, $usuario, $contra)
    {
        try {
            $fecha = date("Y-m-d");
            $direccion_default = "Sin especificar";
            $imagen_default = "default.png";

            $sql = "INSERT INTO `organizadoras` 
                (`user`, `password`, `descripcion_agencia`, `nombre_agencia`, `fecha_registro`, `direccion`, `imagen_url`, `telefono`, `correo`) 
                VALUES (:usuario, :contra, :descripcion, :nombre_agencia, :fecha, :direccion, :imagen, :telefono, :correo)";

            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(':usuario', $usuario);
            $stmt->bindParam(':contra', $contra);
            $stmt->bindParam(':descripcion', $descripcion);
            $stmt->bindParam(':nombre_agencia', $nombre_agencia);
            $stmt->bindParam(':fecha', $fecha);
            $stmt->bindParam(':direccion', $direccion_default);
            $stmt->bindParam(':imagen', $imagen_default);
            $stmt->bindParam(':telefono', $telefono);
            $stmt->bindParam(':correo', $correo);
            $stmt->execute();

            return $this->conexion->lastInsertId();
        } catch (PDOException $e) {
            throw new Exception("Error en el registro de organizadora: " . $e->getMessage());
        }
    }
    public function registroAgencia($nombre_agencia, $descripcion, $correo, $telefono, $usuario, $contra)
    {
        try {
            $fecha = date("Y-m-d");
            $direccion_default = "Sin especificar";
            $imagen_default = "default.png";

            $sql = "INSERT INTO `agencias` 
                (`user`, `password`, `descripcion`, `nombre_agencia`, `fecha_registro`, `direccion`, `imagen_url`, `telefono`, `correo`) 
                VALUES (:usuario, :contra, :descripcion, :nombre_agencia, :fecha, :direccion, :imagen, :telefono, :correo)";

            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(':usuario', $usuario);
            $stmt->bindParam(':contra', $contra);
            $stmt->bindParam(':descripcion', $descripcion);
            $stmt->bindParam(':nombre_agencia', $nombre_agencia);
            $stmt->bindParam(':fecha', $fecha);
            $stmt->bindParam(':direccion', $direccion_default);
            $stmt->bindParam(':imagen', $imagen_default);
            $stmt->bindParam(':telefono', $telefono);
            $stmt->bindParam(':correo', $correo);
            $stmt->execute();

            return $this->conexion->lastInsertId();
        } catch (PDOException $e) {
            throw new Exception("Error en el registro de agencia: " . $e->getMessage());
        }
    }
}
