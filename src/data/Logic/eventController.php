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

    if ($_POST["accion"] === "eliminar") {
        $id_evento = $_POST["idEvento"];
        if (!$id_evento) {
            echo json_encode(["correcto" => false, "mensaje" => "Datos incompletos"]);
            exit;
        }

        $eliminar = $eventosDAO->eliminarEvento($id_evento);

        echo json_encode([
            "correcto" => $eliminar,
            "mensaje" => $eliminar ? "Evento eliminado correctamente" : "Error al eliminar evento"
        ]); 
        exit;

    } else if ($_POST["accion"] === "actualizar") {
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

    } else if ($_POST["accion"] === "crear") {
        // Recibir datos, no recibeo idevento porque es AI
        $nombre = $_POST["nombre_evento"] ?? null;
        $descripcion = $_POST["descripcion"] ?? null;
        $hora_evento = $_POST["hora_evento"] ?? null;
        $precio_boleto = $_POST["precio_boleto"] ?? null; 
        $fecha_evento = $_POST["fecha_evento"] ?? null; // Necesario para la validación
        $id_lugar = $_POST["id_lugar"] ?? null;
        $id_tipo_actividad = $_POST["id_tipo_actividad"] ?? null;
        $id_organizador = $_POST["id_organizador"] ?? null; 

        // 1. VALIDACIÓN: Datos incompletos
        if (!$nombre || !$descripcion || !$hora_evento || !$precio_boleto || !$fecha_evento || !$id_lugar || !$id_tipo_actividad) {
            echo json_encode(["correcto" => false, "mensaje" => "Faltan datos obligatorios para crear el evento."]);
            exit;
        }

        // 2. VALIDACIÓN: Cantidad de entradas (Entre 10 y 2000)
        // Se castea a int para asegurar la comparación numérica
        $cantidad = (int)$precio_boleto; 
        if ($cantidad < 10 || $cantidad > 2000) {
            echo json_encode(["correcto" => false, "mensaje" => "La cantidad de entradas debe ser mínimo 10 y máximo 2000."]);
            exit;
        }

        // 3. VALIDACIÓN: La fecha no puede ser anterior a la fecha actual
        // Asegúrate de tener la zona horaria correcta configurada, ej: date_default_timezone_set('America/Mexico_City');
        $fechaActual = date("Y-m-d");
        if ($fecha_evento <= $fechaActual) {
            echo json_encode(["correcto" => false, "mensaje" => "No puedes crear eventos con fechas pasadas."]);
            exit;
        }

        // === INSERTAR PRIMERO EN BD ===
        // Necesitamos insertar primero para obtener el ID y poder nombrar la imagen como 'eimgID.png'
        // Asumimos que tu DAO tiene un método 'crearEvento' que retorna el ID del último insertado
        // Pasamos NULL o cadena vacía en la imagen temporalmente.
        
        $id_nuevo_evento = $eventosDAO->crearEvento($nombre, $descripcion, $fecha_evento, $hora_evento, $fechaActual, $precio_boleto, "", $id_lugar, $id_tipo_actividad, $id_organizador);

        if (!$id_nuevo_evento) {
            echo json_encode(["correcto" => false, "mensaje" => "Error al insertar el evento en la base de datos."]);
            exit;
        }

        // === PROCESAMIENTO DE IMAGEN ===
        $RUTA_FISICA_GUARDADO = "./../../media/images/events/";
        $nuevaImagen = isset($_FILES["imagen"]) && $_FILES["imagen"]["error"] === UPLOAD_ERR_OK;
        $nombreImagenFinal = null;

        if ($nuevaImagen) {
            // Validar tipo PNG
            if ($_FILES["imagen"]["type"] !== "image/png") {
                // Nota: Si falla la imagen, el evento ya se creó. Podrías decidir borrarlo o dejarlo sin imagen.
                // Aquí solo avisamos.
                echo json_encode(["correcto" => true, "mensaje" => "Evento creado, pero la imagen fue rechazada (Solo PNG).", "nueva_imagen_url" => null]);
                exit; 
            }

            // Crear nombre basado en el ID recién generado
            $nombreImagenFinal = "eimg" . $id_nuevo_evento . ".png";
            $rutaDestino = $RUTA_FISICA_GUARDADO . $nombreImagenFinal;

            // Mover archivo
            if (move_uploaded_file($_FILES["imagen"]["tmp_name"], $rutaDestino)) {
                // Actualizar el registro creado con el nombre de la imagen
                $eventosDAO->actualizarImagen($id_nuevo_evento, $nombreImagenFinal);
            } else {
                echo json_encode(["correcto" => true, "mensaje" => "Evento creado, pero hubo un error al mover la imagen al servidor."]);
                exit;
            }
        } else {
            // Opcional: Si la imagen es obligatoria, podrías retornar error aquí, 
            // pero como ya insertamos el evento, usualmente se permite crear sin imagen o con una por defecto.
        }

        echo json_encode([
            "correcto" => true, 
            "mensaje" => "Evento creado exitosamente con ID: " . $id_nuevo_evento,
        ]);
        exit;
    } else {
        echo json_encode(["correcto" => false, "mensaje" => "Acción no válida"]);
        exit;
    }
    
}