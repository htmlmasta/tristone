var FrameView = Backbone.View.extend({
  dark: false,
  initialize: function(options) {
    this.index = options.index;
    if (options.dark) {
      this.dark = true;
    }
    if (options.onScroll) {
      this.onScroll = options.onScroll;
    }
    if (options.onResize) {
      this.onResize = options.onResize;
    }
    _.bindAll(this, 'onScroll', 'onResize');
    $(window).scroll(this.onScroll).resize(this.onResize);
    this.onResize();
  },
  navTo: function(onEnd) {
    rootApp.navigate = true;
    var
      cssTop = this.$el.css('top'),
      top = this.$el.offset().top - (cssTop != 'auto' ? parseInt(cssTop) : 0);

    $('body').animate({scrollTop: top}, 1000, function() {
      rootApp.navigate = false;
      rootApp.prevScrollTop = $doc.scrollTop();
      $win.trigger('scroll');
    });
  },
  onScroll: function() { return this; },
  onResize: function() {
    var
      frameHeight = this.$el.outerHeight() - 58,
      contentHeight = this.$el.find('.wrapper').height();
    this.$el.find('.wrapper').css({marginTop: frameHeight > contentHeight + 50 ? (frameHeight - contentHeight) / 2 : 25});
    return this;
  }
});

var App = Backbone.View.extend({
  el: 'body',
  navigate: false,
  frames: {},
  currentFrame: 0,

  events: {
    'click .nav-button': 'navButton'
  },
  navButton: function(event) {
    var $button = $(event.target);
    this.navTo($button.data('frame'));
  },

  initialize: function(frames) {
    this.prepare(frames);
    _.bindAll(this, 'onScroll', 'navCorrectPos');
    $(window).scroll(this.onScroll).resize(this.navCorrectPos);
    this.navCorrectPos();
  },
  prepare: function(frames) {
    var length = 0;
    this.$panel = $('<div class="nav-panel">');
    _.each(frames, function(element, key) {
      this.frames[key] = new FrameView($.extend(true, {el: '#' + key, index: length}, element));
      this.$panel.append($('<div class="nav-button" data-frame="' + key + '">'));
      length++;
    }, this);
    this.$panel.find('.nav-button').data('app', this).eq(0).addClass('current');
    this.$el.append(this.$panel);
    this.prevScrollTop = $(document).scrollTop();
  },
  onScroll: function() {
    var
      scrollTop = $doc.scrollTop();

    this.$panel.find('.nav-button').each(function() {
      var
        $this = $(this),
        pos = $this.offset().top + $this.height() / 2,
        frame = $this.data('app').getFrameByPos(pos);
      $this.toggleClass('inverted', frame.dark)
    }).removeClass('current').eq(this.getFrameByPos(scrollTop + $win.height() / 2).index).addClass('current');
  },
  navCorrectPos: function() {
    this.$panel.css({top: ($(window).height() - this.$panel.height()) / 2});
    $win.trigger('scroll');
  },
  navTo: function(id) {
    this.frames[id].navTo();
  },
  navToScroll: function(shift) {
    var
      clientHeight = $win.height(),
      frameCount = Math.floor((shift - clientHeight / 2) / clientHeight);
  },
  getFrameByPos: function(position) {
    return _.find(this.frames, function(frame) {
      var
        topShift = parseInt(frame.$el.css('top')),
        top = frame.$el.offset().top - (topShift ? topShift : 0);
      return (top < position) && (top + frame.$el.outerHeight() > position);
    });
  }
});

$(document).ready(function() {
  rootApp = new App(framesJSON);
  $win.trigger('scroll');
});