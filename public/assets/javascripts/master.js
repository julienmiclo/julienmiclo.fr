(function( $ ){
	console.log('Hello you')

	if( $('#caroubou-datas').length > 0){
		$('#caroubou-datas').Caroubou()
	}

	if( $('.gallery').length > 0){
		$('.gallery').Caroubou()
	}

})(jQuery)