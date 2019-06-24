		</div><!-- ./main-container -->
		<?php if(isset($datas)):?>
			<script type="application/json" id="caroubou-datas">
			<?php echo json_encode($datas); ?>
		</script>
		<?php endif;?>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
		<script type="text/javascript" src="<?php echo $baseUrl; ?>/assets/javascripts/lazyload.min.js?v=11.0.6"></script>
		<script type="text/javascript" src="<?php echo $baseUrl; ?>/assets/javascripts/caroubou.js?v=1.0.0"></script>
		<script type="text/javascript" src="<?php echo $baseUrl; ?>/assets/javascripts/master.js?v=1.0.0"></script>
		<script type="text/javascript">
			(function() {
				var ll = new LazyLoad({
					elements_selector: ".lazyload"
				})
			})();
		</script>
	</body>
</html>