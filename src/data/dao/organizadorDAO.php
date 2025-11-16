<?php
require_once "./../conexion.php";

class organizadorDAO{

    private $id;
    private $conexion;

    public function __construct(){
        $conn = new conexion();
        $this->conexion = $conn->getConexion();
    }

    public function validarOrganizador(string $user, string $password){
        try{
            $sql = "SELECT id_organizadora, user, password, nombre_agencia FROM organizadoras WHERE user = :user";

            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(':user', $user); 
            $stmt->execute();

            $organizador = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($organizador && $organizador['password'] === $password) {
                return $organizador;
            }
            return null;
        }catch (PDOException $e){
            throw new Exception("Error al realizar la consulta: " . $e->getMessage());
        }

    }
}
?>