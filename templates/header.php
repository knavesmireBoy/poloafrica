<?php
include_once '../classes/PageFactory.php';
?>
<!DOCTYPE html>
<html class="no-js" lang="en">
<head>
    <meta charset="utf-8"><!-- IE compatibility mode issue -->
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta content="width=device-width, initial-scale=1" name="viewport">
	<title><?php htmlout($results['page_title']); ?></title>
    <?php
    if(isset($style)){
    $page = PageFactory::getByName($style);
    include 'meta.html.php';
    }
    ?>
    <?php if(!isset($style)){ ?>
        <link href="../css/reset.css" media="screen" rel="stylesheet">
        <link href="../css/admin.css" media="screen" rel="stylesheet">
    <?php }
    else { ?>
    <link href="../css/standard.css" media="screen" rel="stylesheet">
    <?php if(isset($style)): 
          $my = glob("../css/my$style.css"); ?>
    <link href="../css/<?php echo "$style.css" ?>" media="screen" rel="stylesheet"> 
    <?php if(!empty($my)){ ?>
    <link href="../css/my<?php echo "$style.css" ?>" media="screen" rel="stylesheet">
    <?php } ?>
    <link href="../css/fonts.css" rel="stylesheet">
    <link href="../css/print.css" media="print" rel="stylesheet">
          <?php endif; } ?>
    <link rel="shortcut icon" href="../favicon.ico" type="image/x-icon">
    <script>
	document.cookie='resolution='+Math.max(screen.width,screen.height)+'; path=/'; 
	</script>
	<script src="../js/modernizr.js"></script>   
     <script src="../js/ajax.js"></script>
    <!--[if (gte IE 6)&(lte IE 8)]>
<script src="../js/jquery.js"></script>
<script src="../js/selectivizr.js"></script>
<link href="../css/hacks.css" media="screen" rel="stylesheet">
<![endif]-->
</head>