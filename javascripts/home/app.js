window.codeine = window.codeine || {
  currentPage: null,
  lastUrl: null,
  pages: {}
};

TweenMax.defaultEase = Power1.easeOutSine;

codeine.page =  {
  init:  function() {console.log('init page')},
  destroy: function() {console.log('destroy page')}
}

//INIT WEBSITE
codeine.init = function() {

  this.initPage();
  this.initLinks();
}

codeine.initPage = function () {
  var $page = $('.page-wrapper');
  var pageJs = $page.data('page');

  $('.header').css('opacity', 0);
  $('body').show();

  codeine.currentPage = codeine.pages[pageJs] ? new codeine.pages[pageJs]($page[0]) : new page($page[0]);

}

codeine.initLinks = function() {
  this.setLinks();

  window.addEventListener('popstate', function(e) {
    var url = e.state ? e.state.url : '/';
    codeine.loadPage(url);
  });
}

codeine.setLinks = function () {
  var $links = $('a:not(.bypass):not(.initialized)[href]');
  $links.on('click', function(e) {
    e.preventDefault();

    var url = $(this).attr('href');
    if (codeine.lastUrl == url) return;

    history.pushState({url: url}, null, url);
    codeine.loadPage(url);
  })
  //back/forward buttons
  $links.addClass('initialized');
}

codeine.loadPage = function(url) {
  var timeline = new TimelineMax();

  codeine.lastUrl = url;

  if (codeine.currentPage) {
    codeine.currentPage.hideMenu();
  }

  timeline
    .to('#page', .3, {
      opacity: 0,
      y: 200,
      onComplete: function () {
        var jqxhr = $.ajax({
            url: url,
            dataType : "html",
            cache: false
        }).done(function(html) {
          var $page = $(html).find('.page-wrapper');
          var pageJs = $page.data('page');
          var pageTitle = $(html).filter('title').text();

          document.title = pageTitle;

          ga('set', { page: url, title: pageTitle });
          ga('send', 'pageview');

          if (codeine.currentPage) {
            codeine.currentPage.destroy(function() {
              var p = codeine.pages[pageJs] ? codeine.pages[pageJs] : page;
              codeine.currentPage = new p($page[0]);
            })
          } else {
            var p = codeine.pages[pageJs] ? codeine.pages[pageJs] : page;
            codeine.currentPage = new p($page[0]);
          }
        })
        .fail(function() {
          location.reload();
        });
      }
    })
}

$(document).ready(function() {
  codeine.init();
});
