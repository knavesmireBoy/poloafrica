<?php
ini_set( "display_errors", true );
date_default_timezone_set( "Europe/London" );  // http://www.php.net/manual/en/timezones.php

define( "CLASS_PATH", "classes" );
define( "TEMPLATE_PATH", "templates" );

define( "ARTICLE_IMAGE_PATH", "../images/articles" );
define( "ARTICLE_PDF_PATH", "../pdf/articles" );
define( "ARTICLE_VIDEO_PATH", "../video" );

require_once '../../../innocent/poloafricaDB.txt';
define( "ARTICLE_ASSETS_PATH", "../assets" );
define( "ARTICLE_UPLOAD_PATH", "../../../filestore/poloafrica" );
define( "ARTICLE_GALLERY_PATH", "../images/gallery" );

define( "HEADER_PATH", "../header.php" );
define( "IMG_TYPE_FULLSIZE", "fullsize" );
define( "IMG_TYPE_THUMB", "thumb" );
define( "IMG_THUMB_WIDTH", 120 );
define( "JPEG_QUALITY", 85 );
/*
require( CLASS_PATH . "/Article.php" );
require( CLASS_PATH . "/Asset.php" );

function handleException( $exception ) {
  echo "Sorry, a problem occurred. Please try later.";
  error_log( $exception->getMessage() );
}

set_exception_handler( 'handleException' );
*/

?>