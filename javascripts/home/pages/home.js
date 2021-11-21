home.prototype = new page();
home.prototype.constructor = home;

function home(html) {
  this.html = html;
  this.animation = false;
  this.lastWidth = 0;

  page.prototype.init.call(this);

  if (window.innerWidth <= 1350) {
    this.setElements();
    return;
  }

  if (this.animation) {
    this.drawLogo();
    return;
  }

  this.setElements();
}

home.prototype.destroy = function (callback) {
  clearInterval(this.infoInterval);
  clearInterval(this.arrowsInterval);
  $(window).off('resize');
  page.prototype.destroy.call(this, callback);
}

home.prototype.onAnimationComplete = function () {
  $('.logo__svg').css({
    'left': 0,
    'transform': 'none'
  });
}

home.prototype.setElements = function () {
  $('.logo--animate').css({
    'opacity': 1,
    'height': 'auto'
  });
  $('.logo__svg').css({
    'top': 20,
    'left': 0,
    'transform': 'none',
    'width': '100%'
  });
  $('.logo__svg path').css('fill', '#0f0f0f');
  $('.section').css('opacity', 1);
}

home.prototype.setImageWidths = _.debounce(function() {
  var width = Math.round($('.team__item:eq(0)').width());

  if (window.devicePixelRatio > 1) {
    width *= window.devicePixelRatio;
  }

  if (this.lastWidth == width) return;

  this.lastWidth = width;

  $('.team__item img').each(function() {
    $(this).css('opacity', 0);
    helpers.getCrispImage($(this), width);
  })
}, 200);

home.prototype.onWindowResize = function () {
  this.setInfoElements();
  this.setImageWidths();
}

home.prototype.setInfoElements = function() {
  this.$info.css('left', this.$page.width());
  this.$infoClone.css('left', this.$page.width() * 2);
}

home.prototype.animateInfo = function () {
  if (this.$info.position().left + this.$info.width() <= 0) {
    this.$info.css('left', this.$page.width() * 2 - this.$info.width());
  }

  if (this.$infoClone.position().left + this.$infoClone.width() <= 0) {
    this.$infoClone.css('left', this.$page.width() * 2 - this.$info.width());
  }

  this.$infos.css('left', '-=30');
}

codeine.pages.home = home;
