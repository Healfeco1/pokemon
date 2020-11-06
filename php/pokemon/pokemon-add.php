<?php
include('../../database.php');

if (isset($_POST['name'])) {
    $name = $_POST['name'];
    $type = $_POST['type'];
    $img_name = $_FILES['file']['name'];
    $id= $connection->query("Select UUID()")->fetch_row()[0];
    // $id = $
    if (is_array($_FILES)) {
        if (is_uploaded_file($_FILES['file']['tmp_name'])) {
            $sourcePath = $_FILES['file']['tmp_name'];
            $targetPath = "images/" . $img_name;
            move_uploaded_file($sourcePath, $targetPath);
        }
    }

    $query = "INSERT into pokemons(id,nombre,tipo,imagen) VALUES ('$id', '$name', '$type', '$img_name')";
    $result = mysqli_query($connection, $query);
    if (!$result) {
        echo ('Query Failed ' . mysqli_error($connection));
    } else {
        echo 'Tu pokemon ha sido creado correctamente';
        // return $id;
    }
}
