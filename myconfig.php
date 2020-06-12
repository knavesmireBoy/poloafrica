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
define( "ARTICLE_GALLERY_PATH_FULL", "../images/gallery/fullsize/" );

define( "GALLERY_DISPLAY_COUNT", 14 );
define( "GALLERY_TOTAL_COUNT", 92 );

define( "HEADER_PATH", "../header.php" );
define( "IMG_TYPE_FULLSIZE", "fullsize" );
define( "IMG_TYPE_THUMB", "thumb" );
define( "IMG_THUMB_WIDTH", 120 );
define( "JPEG_QUALITY", 85 );

function getGalleryPageSets(){
    return array(14,14,14,12,12,12,14);
}

function getGalleryPageBreaks(){
    return array(0, 14, 28, 42, 54, 66, 78, 92);
}
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