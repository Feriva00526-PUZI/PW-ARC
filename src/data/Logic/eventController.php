<?php
header("Content-Type: application/json");

require_once "./../dao/eventosDAO.php";
require_once "./../dao/organizadorDAO.php";
require_once "./../dao/lugarDAO.php";
require_once "./../dao/actividadDAO.php";

// INSTANCIAS DE CADA DAO
$eventosDAO = new eventosDAO(); 
$organizadorDAO = new organizadorDAO(); 
$lugarDAO = new lugarDAO();
$actividadDAO = new actividadDAO(); 



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
            case "lugares":
                $data = $lugarDAO->getLugares();
                echo json_encode(["correcto" => true, "data" => $data]);
                break;
            case "tipos":
                $data = $actividadDAO->getActividades();
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
} else if ($_SERVER["REQUEST_METHOD"] == "POST") {

    if (!isset($_POST["accion"]) || $_POST["accion"] !== "actualizar") {
        echo json_encode(["correcto" => false, "mensaje" => "Acción no válida"]);
        exit;
    }
    //$id_evento, $nombre, $descripcion, $hora_evento, $precio_boleto, $id_lugar, $id_tipo_actividad
    $id_evento = $_POST["idEvento"];
    $nombre = $_POST["nombre_evento"];
    $descripcion = $_POST["descripcion"];
    $hora_evento = $_POST["hora_evento"];
    $precio_boleto = $_POST["precio_boleto"];
    $id_lugar = $_POST["id_lugar"];
    $id_tipo_actividad = $_POST["id_tipo_actividad"];

    if (!$id_evento || !$nombre || !$descripcion || !$hora_evento || !$precio_boleto) {
        echo json_encode(["correcto" => false, "mensaje" => "Datos incompletos"]);
        exit;
    }

    // === Ruta física donde se guardarán las imágenes ===
    $RUTA_FISICA_GUARDADO = "./../../media/images/events/";

    // Detectar si llegó una nueva imagen
    $nuevaImagen = isset($_FILES["imagen"]) && $_FILES["imagen"]["error"] === UPLOAD_ERR_OK;

    if ($nuevaImagen) {

        if ($_FILES["imagen"]["type"] !== "image/png") {
            echo json_encode(["correcto" => false, "mensaje" => "La imagen debe ser PNG."]);
            exit;
        }

        // Nombre final de la imagen
        $nuevoNombre = "eimg" . $id_evento . ".png";
        $rutaDestino = $RUTA_FISICA_GUARDADO . $nuevoNombre;

        // Obtener imagen anterior desde BD
        $imgAnterior = $eventosDAO->getEventoPorID($id_evento)["imagen_url"];

        // Eliminar imagen anterior si existe
        if ($imgAnterior && file_exists($RUTA_FISICA_GUARDADO . $imgAnterior)) {
            unlink($RUTA_FISICA_GUARDADO . $imgAnterior);
        }

        // Guardar nueva imagen
        if (!move_uploaded_file($_FILES["imagen"]["tmp_name"], $rutaDestino)) {
            echo json_encode(["correcto" => false, "mensaje" => "Error al guardar imagen"]);
            exit;
        }

        // Actualizar referencia en BD
        $eventosDAO->actualizarImagen($id_evento, $nuevoNombre);
    }

    // Actualizar resto de datos
        //$id_evento, $nombre, $descripcion, $hora_evento, $precio_boleto, $id_lugar, $id_tipo_actividad

    $actualizado = $eventosDAO->actualizarEvento($id_evento, $nombre, $descripcion, $hora_evento, $precio_boleto, $id_lugar, $id_tipo_actividad);

    echo json_encode([
        "correcto" => $actualizado,
        "mensaje" => $actualizado ? "Evento actualizado correctamente" : "Error al actualizar evento"
    ]);

    exit;
}
