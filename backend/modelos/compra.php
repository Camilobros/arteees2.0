<?php
class Compra {
    private $conexion;

    public function __construct($conexion) {
        $this->conexion = $conexion;
    }

    // 1. Procesa la compra en la tabla 'compra' y sincroniza automáticamente la tabla 'venta'
    public function comprarObra($params) {
        $id_usuario = isset($params->id_usuario) ? intval($params->id_usuario) : 0;
        $nombre_comprador = isset($params->nombre_comprador) ? trim($params->nombre_comprador) : '';
        $correo_comprador = isset($params->correo_comprador) ? trim($params->correo_comprador) : '';
        $id_obra = isset($params->id_obra) ? intval($params->id_obra) : 0;
        $cantidad = isset($params->cantidad) ? intval($params->cantidad) : 1;

        if ($id_obra <= 0 || $cantidad <= 0 || empty($correo_comprador)) {
            return ['resultado' => 'ERROR', 'mensaje' => 'Datos de sesión o de obra inválidos.'];
        }

        mysqli_begin_transaction($this->conexion);

        try {
            // 1. Consultamos la obra en MySQL para obtener su precio real y a qué id_artista pertenece
            $sqlObra = "SELECT id_obra, titulo, precio, stock, estado, id_artista FROM obra WHERE id_obra = ? FOR UPDATE";
            $stmtObra = mysqli_prepare($this->conexion, $sqlObra);
            mysqli_stmt_bind_param($stmtObra, "i", $id_obra);
            mysqli_stmt_execute($stmtObra);
            $resObra = mysqli_stmt_get_result($stmtObra);
            $obra = mysqli_fetch_assoc($resObra);

            if (!$obra) {
                mysqli_rollback($this->conexion);
                return ['resultado' => 'ERROR', 'mensaje' => 'La obra seleccionada no existe.'];
            }

            if ($obra['estado'] === 'vendido' || intval($obra['stock']) < $cantidad) {
                mysqli_rollback($this->conexion);
                return [
                    'resultado' => 'ERROR',
                    'mensaje' => 'Stock insuficiente. Solo quedan ' . $obra['stock'] . ' unidades disponibles.'
                ];
            }

            $precio_real = floatval($obra['precio']);
            $total_real = $precio_real * $cantidad;
            $id_artista_dueno = intval($obra['id_artista']);
            $titulo_obra = $obra['titulo'];

            // 2. Generamos firma criptográfica SHA-256
            $semilla = $id_obra . '|' . $correo_comprador . '|' . $total_real . '|' . microtime(true) . '|' . bin2hex(random_bytes(8));
            $hash_transaccion = hash('sha256', $semilla);

            // 3. Guardamos en la tabla 'compra' (Para el comprador y el artista dueño de la obra)
            $sqlCompra = "INSERT INTO compra (id_usuario, nombre_comprador, correo_comprador, id_obra, id_artista, cantidad, precio_unitario, total, hash_transaccion)
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmtCompra = mysqli_prepare($this->conexion, $sqlCompra);
            mysqli_stmt_bind_param(
                $stmtCompra,
                "issiiidds",
                $id_usuario,
                $nombre_comprador,
                $correo_comprador,
                $id_obra,
                $id_artista_dueno,
                $cantidad,
                $precio_real,
                $total_real,
                $hash_transaccion
            );
            mysqli_stmt_execute($stmtCompra);

            // 4. Sincronizamos también con la tabla 'cliente' y 'venta' para mantener toda la BD al día
            $sqlCli = "SELECT id_cliente FROM cliente WHERE correo = ? LIMIT 1";
            $stmtCli = mysqli_prepare($this->conexion, $sqlCli);
            mysqli_stmt_bind_param($stmtCli, "s", $correo_comprador);
            mysqli_stmt_execute($stmtCli);
            $resCli = mysqli_stmt_get_result($stmtCli);
            $filaCli = mysqli_fetch_assoc($resCli);

            if ($filaCli) {
                $id_cliente = intval($filaCli['id_cliente']);
            } else {
                $direccion_default = "Comprador Verificado Galería Ópera";
                $sqlInsCli = "INSERT INTO cliente (nombre, correo, direccion) VALUES (?, ?, ?)";
                $stmtInsCli = mysqli_prepare($this->conexion, $sqlInsCli);
                mysqli_stmt_bind_param($stmtInsCli, "sss", $nombre_comprador, $correo_comprador, $direccion_default);
                mysqli_stmt_execute($stmtInsCli);
                $id_cliente = mysqli_insert_id($this->conexion);
            }

            // Empaquetamos el producto para la columna 'productos' de la tabla 'venta'
            $matriz_productos = [[$id_obra, $titulo_obra, $precio_real, $cantidad, $total_real]];
            $productos_serializados = serialize($matriz_productos);

            $sqlVenta = "INSERT INTO venta (id_cliente, productos, subtotal, total, id_artista) VALUES (?, ?, ?, ?, ?)";
            $stmtVenta = mysqli_prepare($this->conexion, $sqlVenta);
            mysqli_stmt_bind_param($stmtVenta, "isddi", $id_cliente, $productos_serializados, $total_real, $total_real, $id_artista_dueno);
            mysqli_stmt_execute($stmtVenta);

            // 5. Descontamos el stock de la obra
            $nuevo_stock = intval($obra['stock']) - $cantidad;
            $nuevo_estado = ($nuevo_stock <= 0) ? 'vendido' : $obra['estado'];

            $sqlUpdateObra = "UPDATE obra SET stock = ?, estado = ? WHERE id_obra = ?";
            $stmtUpdate = mysqli_prepare($this->conexion, $sqlUpdateObra);
            mysqli_stmt_bind_param($stmtUpdate, "isi", $nuevo_stock, $nuevo_estado, $id_obra);
            mysqli_stmt_execute($stmtUpdate);

            mysqli_commit($this->conexion);

            return [
                'resultado' => 'OK',
                'mensaje' => 'Compra registrada exitosamente en tu historial y en las ventas del artista.',
                'hash' => $hash_transaccion,
                'total' => $total_real,
                'nuevo_stock' => $nuevo_stock
            ];
        } catch (Exception $e) {
            mysqli_rollback($this->conexion);
            return ['resultado' => 'ERROR', 'mensaje' => 'Error al procesar la transacción: ' . $e->getMessage()];
        }
    }

    // 2. Devuelve automáticamente lo que ha COMPRADO el usuario actual
    public function misCompras($correo) {
        $sql = "SELECT c.*, o.titulo AS titulo_obra, o.imagen, o.origen, a.nombre AS nombre_artista
                FROM compra c
                INNER JOIN obra o ON c.id_obra = o.id_obra
                INNER JOIN artista a ON c.id_artista = a.id_artista
                WHERE c.correo_comprador = ?
                ORDER BY c.id_compra DESC";
        $stmt = mysqli_prepare($this->conexion, $sql);
        mysqli_stmt_bind_param($stmt, "s", $correo);
        mysqli_stmt_execute($stmt);
        $res = mysqli_stmt_get_result($stmt);

        $vec = [];
        while ($row = mysqli_fetch_assoc($res)) {
            $vec[] = $row;
        }
        return $vec;
    }

    // 3. Devuelve automáticamente las VENTAS que ha tenido un Artista específico (y qué usuario le compró)
    public function misVentasArtista($correo_artista) {
        // Buscamos el id_artista vinculado al correo del usuario en 'usuario' o 'artista'
        $sqlArt = "SELECT a.id_artista 
                   FROM artista a
                   LEFT JOIN usuario u ON u.id_artista = a.id_artista
                   WHERE a.correo = ? OR u.correo = ?
                   LIMIT 1";
        $stmtArt = mysqli_prepare($this->conexion, $sqlArt);
        mysqli_stmt_bind_param($stmtArt, "ss", $correo_artista, $correo_artista);
        mysqli_stmt_execute($stmtArt);
        $resArt = mysqli_stmt_get_result($stmtArt);
        $filaArt = mysqli_fetch_assoc($resArt);

        if (!$filaArt) {
            return [];
        }

        $id_artista = intval($filaArt['id_artista']);

        // Traemos todas las compras hechas sobre obras de este id_artista
        $sql = "SELECT c.*, o.titulo AS titulo_obra, o.imagen, o.origen, a.nombre AS nombre_artista
                FROM compra c
                INNER JOIN obra o ON c.id_obra = o.id_obra
                INNER JOIN artista a ON c.id_artista = a.id_artista
                WHERE c.id_artista = ?
                ORDER BY c.id_compra DESC";
        $stmt = mysqli_prepare($this->conexion, $sql);
        mysqli_stmt_bind_param($stmt, "i", $id_artista);
        mysqli_stmt_execute($stmt);
        $res = mysqli_stmt_get_result($stmt);

        $vec = [];
        while ($row = mysqli_fetch_assoc($res)) {
            $vec[] = $row;
        }
        return $vec;
    }

    // 4. Consulta global de todas las transacciones (Para el rol Admin)
    public function consultaGeneral() {
        $sql = "SELECT c.*, o.titulo AS titulo_obra, o.imagen, o.origen, a.nombre AS nombre_artista
                FROM compra c
                INNER JOIN obra o ON c.id_obra = o.id_obra
                INNER JOIN artista a ON c.id_artista = a.id_artista
                ORDER BY c.id_compra DESC";
        $res = mysqli_query($this->conexion, $sql);
        $vec = [];
        while ($row = mysqli_fetch_assoc($res)) {
            $vec[] = $row;
        }
        return $vec;
    }
}
?>