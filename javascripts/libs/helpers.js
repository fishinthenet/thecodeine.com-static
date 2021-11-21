window.helpers = window.helpers || {};
var db = new Dexie("thecodeine");
    db.version(1).stores({
    images: 'url,width,uri'
});

var resizer = window.pica();

helpers.getCrispImage = function($img, width) {
  $img.css('opacity', 1);return;
  if ($img.data('image')) {
    $img.attr('src', $img.data('image').src);
  }

  var imgSrc = $img.attr('src');
  var imageFromLocalStorage = localStorage.getItem(imgSrc);

  db.images
    .where('url')
    .equals(imgSrc)
    .first()
    .then(function(result) {
      if (result && result.uri && result.width == width) {
        $img.attr('src', result.uri);
        $img.css('opacity', 1);
        return;
      } else {
        var img = new Image;
        img.setAttribute('crossOrigin', 'anonymous');
        img.onload = function() {
          helpers.resizeImage(this, width, this.height/this.width * width, function(imgUri) {
              $img.attr('src', imgUri);
              $img.css('opacity', 1);
              db.images.put({url: imgSrc, width: width, uri: imgUri});
          });
          $img.data('image', img);
        };
        img.src = $img.attr('src');
      }
    })
    .catch(function(error) {
      $img.css('opacity', 1);
    })
}

helpers.resizeImage = function(img, width, height, callback) {

  var canvas = document.createElement('canvas'),
      ctx = canvas.getContext('2d'),
      step = 0, th, tw, maxSteps = 10;

  ctx.imageSmoothingEnabled = true;

  canvas.width = width;
  canvas.height = height;

  resizer.resize(img, canvas, {
    unsharpAmount: 40,
    unsharpRadius: 0.42,
    unsharpThreshold: 2,
    quality: 3
  })
  .then(function(result) {
    callback && callback(result.toDataURL())
  });

  return canvas.toDataURL();
}

helpers.ajaxFormSubmit = function($form) {
  $form.off('submit').submit(function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    var $form = $(this),
        file = $form.find('input[type="file"]')[0],
        formData = new FormData();

    _.each($form.find('input,textarea,select'), function(item) {
      var $i = $(item);
      if($i.attr('type') == 'file') {
        formData.append($i.attr('name'), $i[0].files[0]);
      } else {
        formData.set($i.attr('name'), $i.val())
      }
    })

    $form.parsley().validate();

    if (!$form.parsley().isValid()) {
      return;
    }

    var timeline = new TimelineMax(),
        preloadTimeline = new TimelineMax({paused: true, repeat: 200, yoyo: false}),
        $message = $form.parent().find('.form__message');

    $message.text($message.data('text-sending'));

    preloadTimeline
      .to($message[0], .4, {opacity: 0, ease: 'easeOut',delay: .4})
      .to($message[0], .4, {opacity: 1, ease: 'easeOut'})

    timeline
      .set($message[0], {display: 'none', opacity: 1, x: 0})
      .to($form[0], .4, {
        opacity: 0,
        scale: .5,
        x: 200,
        ease: 'easeOut'
      })
      .set($message[0], {display: 'block', scale: 1}, .2)
      .from($message[0], .4, {
        opacity: 0,
        x: -100,
        ease: 'easeOut',
        onComplete: function() {
          preloadTimeline.restart();

          $.ajax({
               data: formData,
               type: 'POST',
               xhrFields: {
                 withCredentials: true
               },
               url: $form.attr('action'),
               processData: false,
               contentType: false,
           })
           .always(function(d, s, e) {
             $form[0].reset();
             TweenLite.to($message[0], .2, {
               opacity:0,
               onComplete: function(){
                 $message.text((s == 'success') ? $message.data('text-thankyou') : e);
                 preloadTimeline.pause();
                 preloadTimeline.seek(0);

                 setTimeout(function(){
                   timeline.reverse();
                 }, 2000);
               }
            });
          });
        }
      }, .2)
  });
}
