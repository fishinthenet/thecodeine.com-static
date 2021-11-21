design.prototype = new page();
design.prototype.constructor = design;

function design(html) {
  this.html = html;
  this.lastWidth = 0;

  page.prototype.init.call(this);

  $(window).on('resize', _.debounce(this.setImageWidths.bind(this), 200));
  this.setImageWidths();
}

design.prototype.destroy = function(callback) {
  $(window).off('resize');
  page.prototype.destroy.call(this, callback);
}

design.prototype.setImageWidths = function () {
  var width = Math.round($('.project-section:eq(0) .page__title').parent().width());
  var that = this;

  if (window.devicePixelRatio > 1) {
    width *= window.devicePixelRatio;
  }

  if (this.lastWidth == width) return;

  this.lastWidth = width;

  $('.project-section img').each(function() {
    $(this).css('opacity', 0);
    helpers.getCrispImage($(this), width);
  })
}

codeine.pages.design = design;
