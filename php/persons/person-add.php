<?php
    include('../../database.php');

    if (isset($_POST['name'])) {
        $name = $_POST['name'];
        $mail = $_POST['mail'];
        $password = hash('sha512',$_POST['password']);
        // $password = $_POST['password'];
        // $id = bin2hex(openssl_random_pseudo_bytes(16));
        $id = $connection->query("Select UUID()")->fetch_row()[0];;
        
        $query = "INSERT into users(id,name,email,password) VALUES ('$id', '$name', '$mail', '$password')";
        $result = mysqli_query($connection, $query);
        if (!$result) {
            echo 'Error al crear la cuenta, revisa tu conexion';
        }
        else
        {
            echo 'Tu cuenta ha sido creada correctamente';
        }
        
    }