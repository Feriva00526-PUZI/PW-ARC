<?php
require_once "./../conexion.php";

class agenciaDAO{

    private $id;
    private $conexion;

    public function __construct(){
        $conn = new conexion();
        $this->conexion = $conn->getConexion();
    }

    public function validarAgencia(string $user, string $password){
        try{
            $sql = "SELECT id_agencia, user, password, nombre_agencia FROM agencias WHERE user = :user";

            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(':user', $user); 
            $stmt->execute();

            $agencia = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($agencia && $agencia['password'] === $password) {
                return $agencia;
            }
            return null;
        }catch (PDOException $e){
            throw new Exception("Error al realizar la consulta: " . $e->getMessage());
        }

    }
}
?>