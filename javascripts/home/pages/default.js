function page(html) {
  this.html = html;
  this.html && this.init();
}

page.prototype.init = function() {
  $('#page').html(this.html);
  this.pageName = $('.page-wrapper').data('page');
  this.backUrl = $('.page-wrapper').data('back');
  this.$backBtn = $('.header__link--right');
  this.$form = $('.form');
  this.$next = $('[data-next]');
  this.$top = $('[data-top]');
  this.$logoContainer = $('.header__link--menu');
  this.$menu = $('.main-nav');
  this.$menuContainer = $('.main-nav__container');
  this.$separators = $('.separator__progress');
  this.breakpoint = 1350;
  this.sName = "cookieInfo";
  this.sStr = '; '+ document.cookie +';';
  this.nIndex = this.sStr.indexOf('; '+ escape(this.sName) +'=');

  $(window).scrollTop(0);

  codeine.setLinks();

  this.switchImagesToRetina();

  this.initHovers();

  setTimeout(this.initMenu.bind(this), 500);

  if (this.$separators.length) {
    this.initSeparators();
  }

  //back button show/hide and url set
  if (this.backUrl) {
    this.$backBtn.attr('href', this.backUrl).show();
  } else this.$backBtn.hide();

  //INIT form validators and ajax form submit
  this.formInit();

  this.$top.on('click', this.onTopClick.bind(this));

  if (this.nIndex === -1) {
    $(".cookies").show();
  }

  $('.cookies__close').on('click', this.hideCookies.bind(this));

  var preloaderTimeout = setTimeout(function() {
    $('.preloader').show().css('opacity', 1).find('.preloader__line').removeClass('preloader__line--loaded');
  }, 1000);


  this.preload(function() {

    clearTimeout(preloaderTimeout);
    $('.preloader__line').addClass('preloader__line--loaded').delay(500);

    TweenMax
    .to('#page', .4, {
      opacity: 1,
      y: 0,
      ease: 'easeOutSine',
      delay: .2,
      onStart: function() {
        $('.header').css('opacity', 1);
        TweenMax.to('.preloader', .4, {opacity: 0, onComplete: function() {$('.preloader').hide()}})
      },
      onComplete: function () {
        $('body').css('transform', 'none');
      }
    });

  });
}

page.prototype.formInit = function() {
  if (!this.$form) {
    return;
  }

  helpers.ajaxFormSubmit($('form'));
  this.$form.parsley();
  this.$form.find('[action="submit"]').on('click', function(e) {
    $(this).closest('form').submit();
  });

}

page.prototype.formDestroy = function() {
  if (this.$form) {
    return;
  }
  this.$form.parsley().destroy();
  this.$form.find('[action="submit"]').off();
}

page.prototype.destroy = function(callback) {
  this.formDestroy();
  this.$top.off('click');
  this.$logoContainer.off('mouseenter');
  this.$menu.off('mouseleave');
  $(window).off('resize scroll load');

  callback && callback();
}

page.prototype.initHovers = function() {
  $('[data*="animation_hover"]').each(function() {
    var fn = window[$(this).attr('data')];
    if (typeof fn === 'function') {
      fn($(this));
    }
  })
  $('[data*="animation_hover"]').off().hover(function() {
    $(this).data('animation') && $(this).data('animation').play();
  }, function() {
    $(this).data('animation') && $(this).data('animation').reverse();
  });
}

page.prototype.preload = function(callback) {
  var imageCount = $('img').length, imagePreloaded = 0, img;

  if (imageCount <= 0 && callback) callback();

  $('img').each(function() {
    img = new Image()
    img.onload = function() {
      imagePreloaded++;
      if (imagePreloaded >= imageCount && callback) callback();
    }
    img.src = $(this).attr('src');
  })
}

page.prototype.switchImagesToRetina = function() {
  if (window.devicePixelRatio <= 1) return;

  $('img[data-retina!=""]').each(function() {
    $(this).attr('src', $(this).data('retina'));
  })
}

page.prototype.initMenu = function () {
  this.$logoContainer.on('mouseenter', this.showMenu.bind(this));
  this.$menu.on('mouseleave', this.hideMenu.bind(this));
  this.menuTimeline = new TimelineMax({paused: true, smoothChildTiming: true});

  this.menuTimeline
    .set('.main-nav .main-nav__item', {'opacity': '0', y: 50})
    .fromTo('.main-nav', .3, {height: 0}, {height: 250})
    .staggerTo('.main-nav .main-nav__item', .3, {
        y: 0,
        opacity: 1
      }, .05, .1);

    $('.main-nav').addClass('initialized');
}

page.prototype.showMenu = function () {
  this.menuTimeline.play();
  this.$logoContainer.addClass('logo--active');
}

page.prototype.hideMenu = function () {
  this.menuTimeline.reverse();
  this.$logoContainer.removeClass('logo--active');
}

page.prototype.hideCookies = function (e) {
  e.preventDefault();

  var oExpire = new Date();
  oExpire.setTime((new Date()).getTime() + 3600000*24*365);
  document.cookie = this.sName + "=1;expires=" + oExpire;
  $('.cookies').hide();
}

page.prototype.initSeparators = function () {
  this.$separators.css('width', 0);

  $(window).on('scroll', this.onScroll.bind(this));
}

page.prototype.updateSeparators = function () {
  var scroll = $(window).scrollTop();
  var height = $(document).height() - $(window).height();

  this.$separators.css('width', scroll / height * 100 + '%');
}

page.prototype.onNextClick = function () {
  $.fn.fullpage.moveSectionDown();
}

page.prototype.onTopClick = function () {
  $('html, body').stop().animate({
    scrollTop: 0
  }, 400);
}

page.prototype.onScroll = function () {
  this.updateSeparators();
}
