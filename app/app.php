<?php

require dirname(__DIR__) .'/app/settings.php';

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

use \Slim\Views\PhpRenderer;
use \App\Page;

// Instantiate the app
$settings = [
	'settings' => [
		'determineRouteBeforeAppMiddleware' => true,
		'displayErrorDetails' => true
	]
];
$app = new \Slim\App($settings);

$container = $app->getContainer();

$container['notFoundHandler'] = function($c) {
	return function ($request, $response) use ($c) {
		$c->phpView->addAttribute('page_title', '404 not found');
		return $c->phpView->render($response, "404.php");
	};
};

$container['page'] = function($c) {
	return new Page($c, ['', 'resize']);
};
$container['phpView'] = function($c) {
	return new PhpRenderer(LAYOUTS_PATH, ["baseUrl" => ROOT_URI]);
};

$app->add(function(Request $request, Response $response, $next){
	$page = $this->page;

	$response = $this->phpView->render($response, "header.php");

	if( $page->isNotFound() ){
		$notFoundHandler = $this->notFoundHandler;
		$response = $notFoundHandler($request, $response);
	}else{
		$response = $next($request, $response);
	}

	$response = $this->phpView->render($response, 'footer.php');

	return $response;
});

$app->get('/', function ($request, $response, $args){
	$this->page->makePage();

	$this->phpView->addAttribute('images', $this->page->getImages());
	$this->phpView->addAttribute('datas', $this->page->getDatas());

	$response = $this->phpView->render($response, 'homepage.php');
	return $response;
})->setName('homepage');



$app->run();