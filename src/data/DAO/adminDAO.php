<?php
require_once "conexion.php";

class adminDao{

    private $id;
    private $conexion;

    public function __construct(){
        $conn = new conexion();
        $this->conexion = $conn->getConexion();
    }

    //metodos con querys
}
?>