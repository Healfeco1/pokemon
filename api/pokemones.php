<?php

    include('../database.php');

    $query = "SELECT * FROM pokemons";
    $result = mysqli_query($connection, $query);

    if (!$result) {
        die('Query Fail'. mysqli_error($connection));
    }
    $json= array();
    while($row = mysqli_fetch_array($result)){
        $json[] = array(
            'id' => $row['id'],
            'name' => $row['nombre'],
            'type' => $row['tipo'],
            'img' => $row['imagen']
        );
    }
    $jsonstring = json_encode($json);
    echo $jsonstring;