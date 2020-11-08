<?php
    $connection = mysqli_connect(
        'localhost', //server
        'root',   //user
        'root',   //password
        'pokemon',  //database
        8889  //port
    );
    if (!$connection) {
        echo "Fallo la conexion: ". mysqli_connect_error();
        // echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }
?>
