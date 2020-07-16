<?php
ini_set( "display_errors", true );
date_default_timezone_set( "Europe/London" );  // http://www.php.net/manual/en/timezones.php

define( "CLASS_PATH", "classes" );
define( "TEMPLATE_PATH", "templates" );
define( "ACTIVE_PAGES", 9 );

define( "ARTICLE_IMAGE_PATH", "../images/articles" );
define( "ARTICLE_PDF_PATH", "../pdf/articles" );
define( "ARTICLE_VIDEO_PATH", "../video" );

require_once '../../../semolina_pilchard/poloafricaDB.txt';
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

/*repeating words*/
/*these are used in a preg_replace to strip out words from the beginning of titles which start with similar patterns
ie "'Activities on the farm', 'Activities around the farm'" from the result we extract the first three characters which becomes a unique identifier as the value in an <option> tag
so Should future article titles confound this process, put em here
*/
define("XDEF", "(The |a )");
define("XACT", "(activities )");
define("XPOLO", "(polo )");
define("XPOLOAF", "(poloafrica )");

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