<?php
require_once "./../conexion.php";
require_once "./../util/seguridad.php";

class organizadorDAO{

    private $id;
    private $conexion;

    public function __construct(){
        $conn = new conexion();
        $this->conexion = $conn->getConexion();
    }

    public function validarOrganizador(string $user, string $password){
        try{
            $sql = "SELECT * FROM organizadoras WHERE user = :user";

            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(':user', $user); 
            $stmt->execute();

            $organizador = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($organizador && Seguridad::verificarPassword($password, $organizador['password'])) {
                return $organizador;
            }
            return null;
        }catch (PDOException $e){
            throw new Exception("Error al realizar la consulta: " . $e->getMessage());
        }

    }

    public function getOrganizadorPorID($idOrganizadora){
        try{
            $sql = "SELECT * FROM organizadoras WHERE id_organizadora = :id";
            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(":id", $idOrganizadora, PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch(PDOException $e){
            throw new Exception("Error al obtener organizador: " . $e->getMessage());
        }
    }

}