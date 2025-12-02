<?php
require_once "./../util/seguridad.php";
require_once "./../dao/lugarDAO.php";
header('Content-Type: application/json');
$lugarDAO = new lugarDAO();
$RUTA_IMG_ESTANDAR = "./../../media/images/lugares/";
$RUTA_FISICA_GUARDADO = __DIR__ . "/../../media/images/lugares/";

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    // Validar permisos para ver lugares (administradores pueden ver)
    if (!verificarPermisos("editar_lugar") && !verificarPermisos("crear_lugar")) {
        redirigirAlIndex();
    }
    
    try {
        $lugares = $lugarDAO->getLugares();
        if ($lugares != null) {
            foreach ($lugares as &$lugar) {
                $lugar['imagen_url'] = $RUTA_IMG_ESTANDAR . $lugar['imagen_url'];
            }
            $respuesta = ['correcto' => true, 'lugares' => $lugares];
        } else {
            $respuesta = ['correcto' => false];
        }
        echo json_encode($respuesta);
    } catch (Exception $e) {
        $respuesta = ['correcto' => false, 'mensaje' => 'Error - ' . $e->getMessage()];
        echo json_encode($respuesta);
    }
} else if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $respuesta = ['correcto' => false];
    if (!empty($_POST) || !empty($_FILES)) {

        $id_lugar_update = sanitizarEntero($_POST["id_lugar_update"] ?? null);
        $imagen = $_FILES["imagen"] ?? null;

        // Validar permisos según la acción
        if ($id_lugar_update) {
            // Es una actualización
            if (!verificarPermisos("editar_lugar")) {
                redirigirAlIndex();
            }
        } else {
            // Es una creación
            if (!verificarPermisos("crear_lugar")) {
                redirigirAlIndex();
            }
        }

        $nombre = sanitizarTexto($_POST["nombre"]);
        $descripcion = sanitizarTexto($_POST["descripcion"]);
        $direccion = sanitizarTexto($_POST["direccion"]);
        $ciudad = sanitizarTexto($_POST["ciudad"]);
        $zona = sanitizarTexto($_POST["zona"]);
        $id_admin = sanitizarEntero($_POST["id_admin"]);
        $imagen = $_FILES["imagen"] ?? null;

        if (empty($nombre) || empty($descripcion) || empty($direccion) || empty($ciudad) || empty($zona) || empty($id_admin)) {
            $error = "Datos incompletos.";
            $respuesta = array("correcto" => false, "mensaje" => $error);
            echo json_encode($respuesta);
            exit;
        }



        $id_lugar = 0;

        try {
            if ($id_lugar_update) {
                $id_actual = $id_lugar_update;
                $lugarDAO->updateLugar($id_actual, $nombre, $descripcion, $direccion, $ciudad, $zona);

                if ($imagen && $imagen["error"] === UPLOAD_ERR_OK) {
                    $tipoArchivo = $imagen["type"];
                    if ($tipoArchivo !== 'image/jpeg' && $tipoArchivo !== 'image/jpg') {
                        $respuesta['mensaje'] = "Error: Solo se permiten archivos JPG y JPEG.";
                        echo json_encode($respuesta);
                        exit;
                    }

                    $lugar_antiguo = $lugarDAO->getLugarPorID($id_actual);
                    $nombre_imagen_anterior = $lugar_antiguo['imagen_url'] ?? '';

                    $extension = "jpg";
                    $nombre_img_db = 'limg' . $id_actual . '.' . $extension;
                    $ruta_almacenamiento_fisica = $RUTA_FISICA_GUARDADO . $nombre_img_db;

                    if (move_uploaded_file($imagen["tmp_name"], $ruta_almacenamiento_fisica)) {
                        $lugarDAO->updateImagen($id_actual, $nombre_img_db);

                        if (!empty($nombre_imagen_anterior) && $nombre_imagen_anterior !== $nombre_img_db) {
                            $ruta_fisica_anterior = $RUTA_FISICA_GUARDADO . $nombre_imagen_anterior;
                            if (file_exists($ruta_fisica_anterior)) {
                                @unlink($ruta_fisica_anterior);
                            }
                        }
                    } else {
                        $respuesta = array("correcto" => false, "mensaje" => "Error: No se pudo guardar físicamente la nueva imagen.");
                        echo json_encode($respuesta);
                        exit;
                    }
                }
                $respuesta = array("correcto" => true, "mensaje" => "Lugar modificado exitosamente.");
                echo json_encode($respuesta);
                exit;
            } else {
                if (!$imagen || $imagen["error"] !== UPLOAD_ERR_OK) {
                    $respuesta['mensaje'] = "Error: Imagen requerida para crear el lugar.";
                    echo json_encode($respuesta);
                    exit;
                }

                // 2. VALIDACIÓN DE TIPO DE IMAGEN (Para la creación)
                $tipoArchivo = $imagen["type"];
                if ($tipoArchivo !== 'image/jpeg' && $tipoArchivo !== 'image/jpg') {
                    $respuesta['mensaje'] = "Error: Solo se permiten archivos JPG y JPEG.";
                    echo json_encode($respuesta);
                    exit;
                }
                $id_lugar = $lugarDAO->crearLugar($nombre, $descripcion, $direccion, $ciudad, $zona, $id_admin);
                if ($id_lugar > 0) {
                    $extension = "jpg";
                    $nombre_img_db = 'limg' . $id_lugar . '.' . $extension;
                    $ruta_almacenamiento_fisica = $RUTA_FISICA_GUARDADO . $nombre_img_db;

                    if (move_uploaded_file($imagen["tmp_name"], $ruta_almacenamiento_fisica)) {
                        if ($lugarDAO->updateImagen($id_lugar, $nombre_img_db)) {
                            $respuesta = array("correcto" => true, "mensaje" => "Lugar creado exitosamente.");
                            echo json_encode($respuesta);
                        } else {
                            if (file_exists($ruta_almacenamiento_fisica)) {
                                @unlink($ruta_almacenamiento_fisica);
                            }
                            $lugarDAO->eliminarLugarPorId($id_lugar);
                            $respuesta = array("correcto" => false, "mensaje" => "Error: No se pudo actualizar la imagen en la base de datos");
                            echo json_encode($respuesta);
                        }
                    } else {
                        $lugarDAO->eliminarLugarPorId($id_lugar);
                        $respuesta = array("correcto" => false, "mensaje" => "Error: No se pudo guardar fisicamente la imagen");
                        echo json_encode($respuesta);
                    }
                } else {
                    $respuesta['mensaje'] = "Error: No se pudo obtener el ID para actualizar la ruta de imagen";
                    echo json_encode($respuesta);
                }
            }
        } catch (Exception $e) {
            if ($id_lugar > 0) {
                $lugarDAO->eliminarLugarPorId($id_lugar);
            }
            $respuesta['mensaje'] = $e->getMessage();
            echo json_encode($respuesta);
        }
    }
} else if ($_SERVER["REQUEST_METHOD"] == "DELETE") {
    // Validar permisos para eliminar
    if (!verificarPermisos("eliminar_lugar")) {
        redirigirAlIndex();
    }
    
    try {
        // Leer el body de la solicitud DELETE
        $json_data = file_get_contents("php://input");
        $data = json_decode($json_data, true);

        $id_lugar = sanitizarEntero($data['id_lugar'] ?? null);

        if ($id_lugar === null || !is_numeric($id_lugar)) {
            $respuesta = ['correcto' => false, 'mensaje' => 'ID de lugar no válido.'];
            echo json_encode($respuesta);
            exit;
        }

        $lugar = $lugarDAO->getLugarPorID($id_lugar);

        if ($lugar) {
            $nombre_imagen = $lugar['imagen_url'];
            if ($lugarDAO->eliminarLugarPorId($id_lugar)) {
                if (!empty($nombre_imagen)) {
                    $ruta_fisica_imagen = $RUTA_FISICA_GUARDADO . $nombre_imagen;

                    if (file_exists($ruta_fisica_imagen)) {
                        @unlink($ruta_fisica_imagen);
                    }
                }
                $respuesta = ['correcto' => true, 'mensaje' => 'Lugar eliminado exitosamente.'];
            } else {
                $respuesta = ['correcto' => false, 'mensaje' => 'Error al eliminar el lugar de la base de datos.'];
            }
        } else {
            $respuesta = ['correcto' => true, 'mensaje' => 'El lugar no existe o ya fue eliminado.'];
        }
        echo json_encode($respuesta);
    } catch (Exception $e) {
        $respuesta = ['correcto' => false, 'mensaje' => 'Error al eliminar: ' . $e->getMessage()];
        echo json_encode($respuesta);
    }
}
