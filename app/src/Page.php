<?php
namespace App;

use Gumlet\ImageResize;
use Spatie\ImageOptimizer\OptimizerChainFactory;

class Page
{
	private $route;
	private $optimizer;
	private $name;
	private $pages;
	private $year;
	private $month;
	private $uploads = [];
	private $images = [];
	private $datas = [];

	function __construct($c = false, $pages = [])
	{
		$this->route = ($c)?$c->request->getUri()->getPath():$c;
		$this->name = str_replace('/', '', $this->route);
		$this->pages = $pages;
		$this->optimizer = OptimizerChainFactory::create();
	}

	public function makePage()
	{
		$this->collectUploads();
		$this->makeImages();
	}

	public function collectUploads()
	{
		$years = glob(UPLOADS_PATH.'/*', GLOB_ONLYDIR);
		if($years){
			foreach(array_reverse($years) as $year){
				$path_e = explode('/', trim($year));
				$this->year = end($path_e);
				$months = glob($year.'/*', GLOB_ONLYDIR);
				if($months){
					foreach(array_reverse($months) as $month){
						$path_e = explode('/', trim($month));
						$this->month = end($path_e);
						$this->uploads[$this->year][$this->month] = glob(UPLOADS_PATH.'/'.$this->year.'/'.$this->month.'/*.{jpg,png,gif}', GLOB_BRACE);
					}
				}
			}
		}

		return $this->uploads;
	}

	public function makeImages()
	{
		if($this->uploads){
			foreach ($this->uploads as $year => $images) {
				foreach ($images as $month => $images) {
					foreach ($images as $image) {
						$pathinfo = pathinfo($image);
						$url = $this->parseUri($image);
						$image = [
							'url' => $url,
							'name' => $this->parseName($pathinfo['filename']),
							'sizes' => [
								'thumbnail' => $this->resize($image, 480, 480),
								//'large' => $this->resize($image, 1200, 9999, "large")
							]
						];
						$this->images[$year][$month][] = json_decode(json_encode($image));
						$this->datas[]["url"] = json_decode(json_encode($url));
					}
				}
			}
		}

		return $this->images;
	}

	public function resize($image, $w = null, $h = null, $folder = "thumbs")
	{
		$pathinfo = pathinfo($image);
		$paths = explode('/', trim($pathinfo['dirname'], "/"));
		$year = $paths[count($paths) - 2];
		$month = end($paths);
		$thumbsPath = UPLOADS_PATH.'/'.$year.'/'.$month.'/'.$folder.'/';
		if($w === 9999 || $h === 9999){
			$size = getimagesize($image);
			if($w === 9999){
				$w = intval( ($h * $size[0]) / $size[1] );
			}
			if($h === 9999){
				$h = intval( ($size[1] * $w) / $size[0] );
			}
		}
		$newPathImage = $thumbsPath.$pathinfo['filename'].'-'.$w.'x'.$h.'.'.$pathinfo['extension'];
		if(!file_exists($newPathImage)){
			if(!is_dir($thumbsPath)){
				mkdir($thumbsPath);
			}
			$newimage = new ImageResize($image);
			$newimage->crop($w, $h, ImageResize::CROPCENTER)->save($newPathImage);

			$this->optimizer->optimize($newPathImage);
		}
		return(file_exists($newPathImage))?$this->parseUri($newPathImage):false;
	}

	public function parseUri($path)
	{
		return str_replace(PUBLIC_PATH, ROOT_URI, $path);
	}
	private function parseName($path)
	{
		return ucfirst(str_replace(["-", "_"], ' ', $path));
	}

	public function getImages()
	{
		return $this->images;
	}

	public function getDatas()
	{
		return $this->datas;
	}

	public function getName()
	{
		return $this->name;
	}

	public function getRoute()
	{
		return $this->route;
	}

	public function isPage()
	{
		return (in_array($this->name, $this->pages))? true : false;
	}
	public function isNotFound()
	{
		return !$this->isPage();
	}
}