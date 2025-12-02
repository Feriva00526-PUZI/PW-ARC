<?php
require_once "./../conexion.php";
require_once "./../util/seguridad.php";

class usuarioDAO{

    private $id;
    private $conexion;

    public function __construct(){
        $conn = new conexion();
        $this->conexion = $conn->getConexion();
    }

    public function validarUsuario(string $user, string $password){
        try{
            $sql = "SELECT id_cliente, user, password, nombre FROM clientes WHERE user = :user";

            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(':user', $user); 
            $stmt->execute();

            $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($usuario && Seguridad::verificarPassword($password, $usuario['password'])) {
                return $usuario;
            }
            return null;
        }catch (PDOException $e){
            throw new Exception("Error al realizar la consulta: " . $e->getMessage());
        }

    }
}
?>