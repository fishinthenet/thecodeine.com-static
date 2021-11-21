var baseTime = .2;
var easingDefault = [0.5,1,0.7,1];

function animation_hover_people($el) {
  var timeline = new TimelineMax({paused: true});
  timeline
    .set($el.find('.person__description div').toArray(), {y: 50, rotation: 0, scale: .8, opacity: 0})
    .to($el.find('.person__description, .person__background').toArray(), baseTime, {opacity: 1})
    .staggerTo($el.find('.person__description div').toArray(), baseTime, {
      y: 0,
      rotation: 0,
      scale: 1,
      opacity: 1
    }, .08, 0)

  $el.data('animation', timeline);
}
