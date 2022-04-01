<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Home</title>
  <link rel="stylesheet" href="<?php asset() ?>/assets/admin/css/adminlte.min.css">
  <link rel="stylesheet" href="<?php asset() ?>/assets/fontawesome-free-6.1.0/css/all.css">
  <?php include_once('layouts/header.php') ?>
</head>

<body style="background-color:whitesmoke;">
  <?php include_once('layouts/menu.php') ?>
  <h1 class="text-center" style="padding-top: 15rem"><a class="navbar-brand text-success" href="/" style="font-size: 5rem">Home</a></h1>
  <h3 class="text-danger text-center my-5"><b>This is example index page</b></h3>
  <div class="text-center" style="width:50%; margin:auto">
  </div>
  <?php include_once('layouts/footer.php') ?>
</html>