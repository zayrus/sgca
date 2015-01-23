  // initialize Masonry
  var $container = $('.gallery-wrapper').masonry();
  // layout Masonry again after all images have loaded
  $container.imagesLoaded( function() {
    $container.masonry();
  });