<?php
header("Content-Type: application/json");


require_once "./../dao/eventosDAO.php";

// INSTANCIAS DE CADA DAO
$eventosDAO = new eventosDAO(); 



if ($_SERVER["REQUEST_METHOD"] === "GET") {

    if (!isset($_GET["accion"])) {
        echo json_encode(["correcto" => false, "mensaje" => "Accion no especificada"]);
        exit;
    }

    $accion = $_GET["accion"];

    try {
        switch ($accion) {
        
            // Obtener los eventos con un formato especifico para el calendario
            case "eventosCalendario":
                $id = $_GET["id_organizadora"] ?? null;
                if (!$id) throw new Exception("Falta id_organizadora");

                $data = $eventosDAO->getEventosParaCalendario($id);
                echo json_encode(["correcto" => true, "data" => $data]);
                break;

            // Obtener un evento por ID
            case "eventoPorID":
                $id = $_GET["id_evento"] ?? null;
                if (!$id) throw new Exception("Falta id_evento");

                $data = $eventosDAO->getEventoPorID($id);
                echo json_encode(["correcto" => true, "data" => $data]);
                break;


        }
    } catch (Exception $e) {
        echo json_encode(["correcto" => false, "mensaje" => $e->getMessage()]);
    }

   
    
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    if (!isset($_POST["accion"])) {
        echo json_encode(["correcto" => false, "mensaje" => "Acción no especificada"]);
        exit;
    }

    $accion = $_POST["accion"];

    try {
        switch ($accion) {

            case "actualizarFecha":
                $idEvento = $_POST["id_evento"] ?? null;
                $nuevaFecha = $_POST["nueva_fecha"] ?? null;

                if (!$idEvento || !$nuevaFecha)
                    throw new Exception("Faltan parámetros");

                $ok = $eventosDAO->actualizarFechaEvento($idEvento, $nuevaFecha);

                echo json_encode(["correcto" => $ok, "data" => "Fecha actualizada"]);
                break;

        }
    } catch (Exception $e) {
        echo json_encode(["correcto" => false, "data" => $e->getMessage()]);
    }
}