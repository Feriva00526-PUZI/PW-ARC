<?php
header("Content-Type: application/json");

require_once "./../dao/organizadorDAO.php";
require_once "./../dao/lugarDAO.php";
require_once "./../dao/eventosDAO.php";

// INSTANCIAS DE CADA DAO
$organizadoraDAO = new organizadorDAO();
$lugarDAO = new lugarDAO();
$eventosDAO = new eventosDAO(); 



if ($_SERVER["REQUEST_METHOD"] === "GET") {

    if (!isset($_GET["accion"])) {
        echo json_encode(["correcto" => false, "mensaje" => "Accion no especificada"]);
        exit;
    }

    $accion = $_GET["accion"];

    try {
        switch ($accion) {

            case "organizador":
                $id = $_GET["id_organizadora"] ?? null;
                if (!$id) throw new Exception("Falta id_organizadora");

                $data = $organizadoraDAO->getOrganizadorPorID($id);
                echo json_encode(["correcto" => true, "data" => $data]);
                break;

            // Obtener todos los eventos de una organizadora
            case "eventos":
                $id = $_GET["id_organizadora"] ?? null;
                if (!$id) throw new Exception("Falta id_organizadora");

                $data = $eventosDAO->getEventosPorOrganizadora($id);
                echo json_encode(["correcto" => true, "data" => $data]);
                break;

            // Obtener cantidad de eventos este mes
            case "numeroEventosMes":
                $id = $_GET["id_organizadora"] ?? null;
                if (!$id) throw new Exception("Falta id_organizadora");

                $total = $eventosDAO->getNumeroEventosEsteMes($id);
                echo json_encode(["correcto" => true, "total" => $total]);
                break;

            // Obtener todos los tipos de actividad
            /*
            case "tiposActividad":
                $data = $dao->getTodosTiposActividad();
                echo json_encode(["correcto" => true, "data" => $data]);
                break;
                
                // Obtener un tipo de actividad por ID
            case "tipoActividad":
                $id = $_GET["id_tipo"] ?? null;
                if (!$id) throw new Exception("Falta id_tipo");

                $data = $dao->getTipoActividadPorID($id);
                echo json_encode(["correcto" => true, "data" => $data]);
                break;
            
            */
                
            // Obtener un evento por ID
            case "eventoPorID":
                $id = $_GET["id_evento"] ?? null;
                if (!$id) throw new Exception("Falta id_evento");

                $data = $eventosDAO->getEventoPorID($id);
                echo json_encode(["correcto" => true, "data" => $data]);
                break;

            // Filtro por lugar
            /*
            case "filtrarLugar":
                $id = $_GET["id_organizadora"] ?? null;
                $lugar = $_GET["lugar"] ?? "";

                if (!$id) throw new Exception("Falta id_organizadora");

                $data = $dao->filtrarEventosPorLugar($id, $lugar);
                echo json_encode(["correcto" => true, "data" => $data]);
                break;
            */


            
            // Filtro evento por rango de fechas
            case "filtrarFecha":
                $id = $_GET["id_organizadora"] ?? null;
                $inicio = $_GET["inicio"] ?? null;
                $fin = $_GET["fin"] ?? null;

                if (!$id || !$inicio || !$fin) throw new Exception("Parametros incompletos");

                $data = $eventosDAO->filtrarEventosPorFecha($id, $inicio, $fin);
                echo json_encode(["correcto" => true, "data" => $data]);
                break;

            // Ordenar por fecha ASC | DESC
            case "ordenarFecha":
                $id = $_GET["id_organizadora"] ?? null;
                if (!$id) throw new Exception("Falta id_organizadora");

                $asc = (isset($_GET["orden"]) && strtolower($_GET["orden"]) === "desc") ? false : true;

                $data = $eventosDAO->ordenarEventosPorFecha($id, $asc);
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