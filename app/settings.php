<?php

require dirname(__DIR__) .'/vendor/autoload.php';

setlocale(LC_ALL, 'fr_FR.UTF-8', 'fr_FR');
ini_set( 'date.timezone', 'Europe/Paris' );
date_default_timezone_set('Europe/Paris');

define ('VERSION', '18.0.0');

$port = (isset($_SERVER["SERVER_PORT"]) && $_SERVER['SERVER_PORT'] != 80)? ':'.$_SERVER["SERVER_PORT"]:'';

if( isset($_SERVER['SERVER_NAME']) ){
	define('ROOT_URI', (isset($_SERVER['HTTPS']) ? "https" : "http").'://'.$_SERVER['SERVER_NAME'].$port);
}else{
	define('ROOT_URI', "cron");
}

define('ROOT_PATH', dirname(__DIR__));

define('PUBLIC_PATH', ROOT_PATH .'/public');
define('LAYOUTS_PATH', PUBLIC_PATH .'/layouts');
define('CONTENT_PATH', PUBLIC_PATH .'/content');
//define('DARFTS_PATH', CONTENT_PATH .'/drafts');
//define('POSTS_PATH', CONTENT_PATH .'/posts');
define('UPLOADS_PATH', CONTENT_PATH .'/uploads');