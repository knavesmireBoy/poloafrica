<!DOCTYPE html>
<html class="no-js" lang="en">
<head>
    <meta charset="utf-8"><!-- IE compatibility mode issue -->
	<meta content="IE=edge" http-equiv="X-UA-Compatible">
	<meta content="width=device-width, initial-scale=1" name="viewport">
	<title><?php htmlout($results['page_title']); ?></title>
        <link href="../css/standard.css" media="screen" rel="stylesheet">
    <?php if(isset($style)): ?>
        <link href="../css/<?php echo "$style.css" ?>" media="screen" rel="stylesheet">
        <link href="../css/my<?php echo "$style.css" ?>" media="screen" rel="stylesheet">
    <?php endif; ?>
        <link href="../css/admin.css" media="screen" rel="stylesheet">
        <link href="../css/print.css" media="print" rel="stylesheet">
     	<script>
	document.cookie='resolution='+Math.max(screen.width,screen.height)+'; path=/'; 
	</script>
	<script src="../js/modernizr.js"></script>

    <!--[if (gte IE 6)&(lte IE 8)]>
<script src="../js/jquery.js"></script>
  <script src="../js/selectivizr.js"></script>
<link href="../css/hacks.css" media="screen" rel="stylesheet">
<![endif]-->
</head>