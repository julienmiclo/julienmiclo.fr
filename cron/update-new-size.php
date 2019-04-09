<?php

require dirname(__DIR__) .'/app/settings.php';

ini_set('max_execution_time', 300);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

use \App\Page;

$total = 0;
$page = new Page();
$medias = [];
$uploads = $page->collectUploads();

if($uploads){
	print("\n--RESIZE--\n");
	foreach (array_reverse($uploads) as $year => $images){
		print("\n");
		foreach (array_reverse($images) as $month => $images){
			foreach ($images as $image){
				$pathinfo = pathinfo($image);

				$page->resize($image, 480, 480);
				//$large = $page->resize($image, 1200, 9999, "large");
				$total++;

				print($pathinfo['filename']." => \033[32mOK\033[0m\n");
			}
		}
	}
}

print("\n$total images generated\n");

print("\nAll done,\n");
die();