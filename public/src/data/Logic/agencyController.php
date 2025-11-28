<?php
header("Content-Type: application/json");

require_once "./../dao/agenciaDAO.php";
require_once "./../dao/lugarDAO.php";
require_once "./../dao/paqueteDAO.php";

// INSTANCIAS DE CADA DAO
$agenciaDAO = new agenciaDAO();
$lugarDAO = new lugarDAO();
$paqueteDAO = new paqueteDAO(); 



if ($_SERVER["REQUEST_METHOD"] === "GET") {

    if (!isset($_GET["accion"])) {
        echo json_encode(["correcto" => false, "mensaje" => "Accion no especificada"]);
        exit;
    }

    $accion = $_GET["accion"];

    try {
        switch ($accion) {

            case "agencia":
                $id = $_GET["idAgencia"] ?? null;
                if (!$id) throw new Exception("Falta id_agencia");

                $data = $agenciaDAO->getAgenciaPorID($id);
                echo json_encode(["correcto" => true, "data" => $data]);
                break;

            // Obtener todos los paquetes de una agencia
            case "paquetes":
                $id = $_GET["id_agencia"] ?? null;
                if (!$id) throw new Exception("Falta id_agencia");

                $data = $paqueteDAO->getPaquetesPorAgencia($id);
                echo json_encode(["correcto" => true, "data" => $data]);
                break;

            // Obtener cantidad de paquetes
            case "numeroPaquetes":
                $id = $_GET["id_agencia"] ?? null;
                if (!$id) throw new Exception("Falta id_agencia");

                $total = $paqueteDAO->getNumeroPaquetesEsteMes($id);
                echo json_encode(["correcto" => true, "total" => $total]);
                break;
                
            // Obtener un paquete por ID
            case "paquetePorID":
                $id = $_GET["id_paquete"] ?? null;
                if (!$id) throw new Exception("Falta id_paquete");

                $data = $paqueteDAO->getPaquetePorID($id);
                echo json_encode(["correcto" => true, "data" => $data]);
                break;

            // Filtro paquete por lugar
            case "filtrarLugar":
                $id = $_GET["id_agencia"] ?? null;
                $lugar = $_GET["lugar"] ?? null;

                if (!$id || !$lugar) throw new Exception("Parametros incompletos");

                $data = $paqueteDAO->filtrarPaquetesPorLugar($id, $lugar);
                echo json_encode(["correcto" => true, "data" => $data]);
                break;

            // Ordenar por precio ASC | DESC
            case "ordenarPrecio":
                $id = $_GET["id_agencia"] ?? null;
                if (!$id) throw new Exception("Falta id_agencia");

                $asc = (isset($_GET["orden"]) && strtolower($_GET["orden"]) === "desc") ? false : true;

                $data = $paqueteDAO->ordenarPaquetesPorPrecio($id, $asc);
                echo json_encode(["correcto" => true, "data" => $data]);
                break;

            // Accion no encontrada
            default:
                echo json_encode(["correcto" => false, "mensaje" => "Accion no valida"]);
                break;
        }
    } catch (Exception $e) {
        echo json_encode(["correcto" => false, "mensaje" => $e->getMessage()]);
    }
}
