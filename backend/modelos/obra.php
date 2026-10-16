<?php
    class obra {
        // Atributos
        private $conexion;

        public function __construct($conexion) {
            $this->conexion = $conexion;
        }

        // Función interna segura para guardar fotos físicas en el servidor
        private function procesarImagen($imagenEntrada) {
            if (empty($imagenEntrada)) {
                return "";
            }

            // Si el usuario subió un archivo desde su PC (viene en formato data:image/...)
            if (preg_match('/^data:image\/(\w+);base64,/', $imagenEntrada, $tipo)) {
                $datosBase64 = substr($imagenEntrada, strpos($imagenEntrada, ',') + 1);
                $extension = strtolower($tipo[1]); // jpg, png, webp, gif

                // Validamos por seguridad que solo sean formatos de imagen reales
                if (!in_array($extension, ['jpg', 'jpeg', 'png', 'webp', 'gif'])) {
                    return "";
                }

                $archivoBinario = base64_decode($datosBase64);
                if ($archivoBinario === false) {
                    return "";
                }

                // Creamos la carpeta backend/uploads/obras/ si no existe
                $directorio = "../uploads/obras/";
                if (!file_exists($directorio)) {
                    mkdir($directorio, 0777, true);
                }

                // Generamos un nombre único para evitar archivos maliciosos o repetidos
                $nombreArchivo = uniqid('obra_', true) . '.' . $extension;
                $rutaFisica = $directorio . $nombreArchivo;

                // Guardamos la foto en la carpeta y devolvemos la URL pública para MySQL
                if (file_put_contents($rutaFisica, $archivoBinario)) {
                    return "http://localhost/proyectos/arteees2.0/backend/uploads/obras/" . $nombreArchivo;
                }
            }

            // Si el usuario pegó directamente un enlace (URL http/https), lo devolvemos limpio
            return mysqli_real_escape_string($this->conexion, $imagenEntrada);
        }

        // Métodos CRUD
        public function consulta() {
            $sql = "SELECT o.*, ar.nombre AS artista FROM obra o
                    INNER JOIN artista ar ON o.id_artista = ar.id_artista
                    ORDER BY o.id_obra DESC;";
            $res = mysqli_query($this->conexion, $sql) or die('no se encontro la tabla obra');

            $vec = [];

            while ($row = mysqli_fetch_array($res)) {
                $vec[] = $row;
            }

            return $vec;
        }

        public function eliminar($id) {
            $id = intval($id);
            $sql = "DELETE FROM obra WHERE id_obra = $id";
            mysqli_query($this->conexion, $sql) or die('no elimino el registro');

            $vec = [];
            $vec['resultado'] = "OK";
            $vec['mensaje'] = "se elimino el registro";

            return $vec;
        }

        public function insertar($params) {
            $titulo = mysqli_real_escape_string($this->conexion, $params->titulo);
            $descripcion = mysqli_real_escape_string($this->conexion, $params->descripcion);
            $precio = floatval($params->precio);
            $estado = mysqli_real_escape_string($this->conexion, $params->estado);
            $id_artista = intval($params->id_artista);
            $stock = intval($params->stock);

            // Nuevos campos: origen ('human' o 'ai'), disciplina e imagen
            $origen = isset($params->origen) && $params->origen === 'ai' ? 'ai' : 'human';
            $disciplina = isset($params->disciplina) ? mysqli_real_escape_string($this->conexion, $params->disciplina) : 'painting';
            $imagenInput = isset($params->imagen) ? $params->imagen : '';
            $imagenUrl = $this->procesarImagen($imagenInput);

            $sql = "INSERT INTO obra (titulo, descripcion, precio, estado, id_artista, stock, origen, disciplina, imagen) 
                    VALUES ('$titulo', '$descripcion', $precio, '$estado', $id_artista, $stock, '$origen', '$disciplina', '$imagenUrl')";

            mysqli_query($this->conexion, $sql) or die("Fallo MySQL: " . mysqli_error($this->conexion));

            $vec = [];
            $vec['resultado'] = 'OK';
            $vec['mensaje'] = 'se inserto el registro';
            
            return $vec;
        }

        public function editar($id, $params) {
            $id = intval($id);
            $titulo = mysqli_real_escape_string($this->conexion, $params->titulo);
            $descripcion = mysqli_real_escape_string($this->conexion, $params->descripcion);
            $precio = floatval($params->precio);
            $estado = mysqli_real_escape_string($this->conexion, $params->estado);
            $id_artista = intval($params->id_artista);
            $stock = intval($params->stock);

            $origen = isset($params->origen) && $params->origen === 'ai' ? 'ai' : 'human';
            $disciplina = isset($params->disciplina) ? mysqli_real_escape_string($this->conexion, $params->disciplina) : 'painting';
            $imagenInput = isset($params->imagen) ? $params->imagen : '';
            $imagenUrl = $this->procesarImagen($imagenInput);

            $sql = "UPDATE obra SET 
                        titulo = '$titulo', 
                        descripcion = '$descripcion', 
                        precio = $precio, 
                        estado = '$estado', 
                        id_artista = $id_artista, 
                        stock = $stock,
                        origen = '$origen',
                        disciplina = '$disciplina',
                        imagen = '$imagenUrl'
                    WHERE id_obra = $id";

            mysqli_query($this->conexion, $sql) or die("Fallo al editar: " . mysqli_error($this->conexion));

            $vec = [];
            $vec['resultado'] = "OK";
            $vec['mensaje'] = "se edito el registro";

            return $vec;
        }
    }
?>