project.prototype = new page();
project.prototype.constructor = project;

function project(html) {
  this.html = html;

  page.prototype.init.call(this);

  // wylaczamy poki co skalowanie i wyostrzenie fot bo to zre zasoby
  // this.lastWidth = 0;
  // $(window).on('resize', _.debounce(this.setImageWidths.bind(this), 200));
  // this.setImageWidths();
}

project.prototype.destroy = function(callback) {
  $(window).off('resize');
  page.prototype.destroy.call(this, callback);
}

project.prototype.setImageWidths = function () {
  var width = Math.round($('.gallery__container:eq(0)').width());
  var $headerImg = $('.section--project-first img');
  var that = this;

  if (window.devicePixelRatio > 1) {
    width *= window.devicePixelRatio;
  }

  if (this.lastWidth == width) return;

  this.lastWidth = width;

  $headerImg.css('opacity', 0);
  helpers.getCrispImage($headerImg, width * window.devicePixelRatio);

  $('.gallery__item').each(function() {
    var $img = $(this).find('img');
    $img.css('opacity', 0);
    helpers.getCrispImage($img, width * window.devicePixelRatio);
  })
}

codeine.pages.project = project;
