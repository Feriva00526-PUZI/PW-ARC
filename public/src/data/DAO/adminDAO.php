<?php
require_once "./../conexion.php";
require_once "./../util/seguridad.php";

class adminDAO{

    private $id;
    private $conexion;

    public function __construct(){
        $conn = new conexion();
        $this->conexion = $conn->getConexion();
    }

    public function validarAdmin(string $user, string $password){
        try{
            $sql = "SELECT id_admin, user, password, nombre FROM administradores WHERE user = :user";

            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(':user', $user); 
            $stmt->execute();

            $admin = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($admin && Seguridad::verificarPassword($password, $admin['password'])) {
                return $admin;
            }
            return null;
        }catch (PDOException $e){
            throw new Exception("Error al realizar la consulta: " . $e->getMessage());
        }

    }
}
?>