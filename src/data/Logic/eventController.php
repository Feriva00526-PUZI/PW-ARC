<?php
header("Content-Type: application/json");

require_once "./../dao/eventosDAO.php";
require_once "./../dao/organizadorDAO.php";
require_once "./../dao/lugarDAO.php";

// INSTANCIAS DE CADA DAO
$eventosDAO = new eventosDAO(); 
$organizadorDAO = new organizadorDAO(); 
$lugarDAO = new lugarDAO(); 



if ($_SERVER["REQUEST_METHOD"] === "GET") {

    if (!isset($_GET["accion"])) {
        echo json_encode(["correcto" => false, "mensaje" => "Accion no especificada"]);
        exit;
    }

    $accion = $_GET["accion"];

    try {
        switch ($accion) {

            case "evento":
                $id = $_GET["idEvento"] ?? null;
                if (!$id) throw new Exception("Falta id_evento");

                $data = $eventosDAO->getEventoPorID($id);
                echo json_encode(["correcto" => true, "data" => $data]);
                break;
            case "lugar":
                $id = $_GET["idLugar"] ?? null;
                if (!$id) throw new Exception("Falta id_evento");

                $data = $lugarDAO->getLugarPorID($id);
                echo json_encode(["correcto" => true, "data" => $data]);
                break;
            case "organizadora":
                $id = $_GET["idOrganizadora"] ?? null;
                if (!$id) throw new Exception("Falta id_evento");

                $data = $organizadorDAO->getOrganizadorPorID($id);
                echo json_encode(["correcto" => true, "data" => $data]);
                break;
            case "actividad":
                $id = $_GET["idActividad"] ?? null;
                if (!$id) throw new Exception("Falta id_actividad");

                $data = $eventosDAO->getTipoActividadPorID($id);
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