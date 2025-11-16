<?php
    require_once "./../dao/lugarDAO.php";
    header('Content-Type: application/json');
    $lugarDAO = new lugarDAO();
    $RUTA_IMG_ESTANDAR = "./../../media/images/lugares/";
    $RUTA_FISICA_GUARDADO = __DIR__ . "/../../media/images/lugares/";

    if ($_SERVER["REQUEST_METHOD"] == "GET") {
        try{
            $lugares = $lugarDAO->getLugares();
            if($lugares != null){
                foreach ($lugares as &$lugar) {
                    $lugar['imagen_url'] = $RUTA_IMG_ESTANDAR . $lugar['imagen_url'];
                }
                $respuesta = ['correcto' => true, 'lugares' => $lugares];
            } else {
                $respuesta = ['correcto' => false];
            }
            echo json_encode($respuesta);
        } catch (Exception $e){
            $respuesta = ['correcto' => false, 'mensaje' => 'Error - ' . $e->getMessage()];
            echo json_encode($respuesta);
        }
    } 

    else if ($_SERVER["REQUEST_METHOD"] == "POST"){
        $respuesta = ['correcto' => false];
        if(!empty($_POST) || !empty($_FILES)){
            
            $nombre = $_POST["nombre"];
            $descripcion = $_POST["descripcion"];
            $direccion = $_POST["direccion"];
            $ciudad = $_POST["ciudad"];
            $zona = $_POST["zona"];
            $id_admin = $_POST["id_admin"];
            $imagen = $_FILES["imagen"];

            if (empty($nombre) || empty($descripcion) || empty($direccion) || empty($ciudad) || empty($zona) || empty($id_admin) || !isset($_FILES["imagen"])) {
                $error = "Datos incompletos";
                $respuesta = array("correcto" => false, "mensaje" => $error);
                echo json_encode($respuesta);
                exit;
            }

            if (!$imagen || $imagen["error"] !== UPLOAD_ERR_OK) {
                $respuesta['mensaje'] = "Error: Imagen no valida";
                echo json_encode($respuesta);
                exit;
            }

            $tipoArchivo = $imagen["type"];
            if ($tipoArchivo !== 'image/jpeg' && $tipoArchivo !== 'image/jpg') { 
            $respuesta['mensaje'] = "Error: Solo se permiten archivos JPG y JPEG.";
            echo json_encode($respuesta);
            exit;
            }

            $id_lugar = 0;

            try {
            $id_lugar = $lugarDAO->crearLugar($nombre, $descripcion, $direccion, $ciudad, $zona, $id_admin);
            if ($id_lugar > 0) {
                $extension = "jpg";
                $nombre_img_db = 'lim' . $id_lugar . '.' . $extension;
                $ruta_almacenamiento_fisica = $RUTA_FISICA_GUARDADO . $nombre_img_db;

                if(move_uploaded_file($imagen["tmp_name"], $ruta_almacenamiento_fisica)){
                    if($lugarDAO->updateImagen($id_lugar, $nombre_img_db)){
                        $respuesta = array("correcto" => true, "mensaje" => "Lugar creado exitosamente.");
                        echo json_encode($respuesta);
                    } else {
                        if(file_exists($ruta_almacenamiento_fisica)){
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
        }else{
            $respuesta['mensaje'] = "Error: No se pudo obtener el ID para actualizar la ruta de imagen";
            echo json_encode($respuesta);
        }
        } catch (Exception $e) {
            if ($id_lugar > 0) {
                 $lugarDAO->eliminarLugarPorId($id_lugar);
            }
            $respuesta['mensaje'] = $e->getMessage();
            echo json_encode($respuesta);
        }
 }
}
