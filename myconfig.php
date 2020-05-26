<?php
ini_set( "display_errors", true );
date_default_timezone_set( "Europe/London" );  // http://www.php.net/manual/en/timezones.php
define( "DB_DSN", "mysql:host=localhost;dbname=granthams_trial" );
define( "DB_USERNAME", "root" );
define( "DB_PASSWORD", "covid19@krauq" );
define( "CLASS_PATH", "classes" );
define( "TEMPLATE_PATH", "templates" );
define( "HOMEPAGE_NUM_ARTICLES", 16 );
define( "ADMIN_USERNAME", "admin" );
define( "ADMIN_PASSWORD", "mypass" );

define( "ARTICLE_IMAGE_PATH", "../images/articles" );
define( "ARTICLE_PDF_PATH", "../pdf/articles" );
define( "ARTICLE_VIDEO_PATH", "../pdf/articles" );
define( "ARTICLE_ASSETS_PATH", "../assets" );
define( "HEADER_PATH", "../header.php" );
define( "IMG_TYPE_FULLSIZE", "fullsize" );
define( "IMG_TYPE_THUMB", "thumb" );
define( "IMG_THUMB_WIDTH", 120 );
define( "JPEG_QUALITY", 85 );
define( "SALT", 'poloafrica' );
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