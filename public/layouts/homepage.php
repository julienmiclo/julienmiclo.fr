<?php foreach ($images as $year => $images): ?>
	<section>
		<h2><?php echo $year; ?></h2>
		<grid columns="4" columns-l="6" columns-s="1">
			<?php foreach ($images as $month => $images): ?>
				<?php foreach ($images as $image): ?>
					<c>
						<picture class="item image">
							<img data-src="<?php echo $image->sizes->thumbnail; ?>" alt="<?php echo $image->name; ?>" class="lazyload" loading="lazy">
						</picture>
					</c>
				<?php endforeach; ?>
			<?php endforeach; ?>
		</grid>
	</section>
<?php endforeach; ?>