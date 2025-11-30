<?php
require_once "./../conexion.php";

class eventoDAO
{

    private $id;
    private $conexion;

    public function __construct()
    {
        $conn = new conexion();
        $this->conexion = $conn->getConexion();
    }

    public function getEvento()
    {
        try {
            $sql = "SELECT * FROM eventos";

            $stmt = $this->conexion->prepare($sql);
            $stmt->execute();

            $evento = $stmt->fetchALL(PDO::FETCH_ASSOC);
            return $evento;
        } catch (PDOException $e) {
            throw new Exception("Error al realizar la consulta en la base de datos: " . $e->getMessage());
        }
    }
}
