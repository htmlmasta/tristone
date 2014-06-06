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
    var
      cssTop = this.$el.css('top'),
      top = this.$el.offset().top - (cssTop != 'auto' ? parseInt(cssTop) : 0);

    $('html, body').animate({scrollTop: top}, 1000, function() {
      $win.trigger('scroll');
      if (onEnd) { onEnd(); }
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
  currentFrame: '',
  verticalStep: 30,

  events: {
    'click .nav-button': 'navButton',
    'mousewheel': 'wheelNav',
    'keydown': 'keyNav'
  },
  navButton: function(event) {
    var $button = $(event.target);
    this.navTo($button.data('frame'));
  },
  keyNav: function(e) {
    if (!this.navigate) {
      if (e.keyCode == 38) {
        this.verticalNav(-1);
      } else if (e.keyCode == 40) {
        this.verticalNav(1);
      }
    }
  },
  wheelNav: function(e) {
    if (!this.navigate) {
      this.verticalNav(-e.deltaY);
    }
  },

  initialize: function(frames) {
    this.prepare(frames);
    _.bindAll(this, 'onScroll', 'navCorrectPos');
    $(window)
      .scroll(this.onScroll)
      .resize(this.navCorrectPos);
    this.navCorrectPos();
  },
  prepare: function(frames) {
    var length = 0;
    this.$panel = $('<div class="nav-panel">');
    _.each(frames, function(element, key) {
      if (!this.currentFrame) {
        this.currentFrame = key;
      }
      this.frames[key] = new FrameView($.extend(true, {el: '#' + key, index: length}, element));
      this.$panel.append($('<div class="nav-button" data-frame="' + key + '">'));
      length++;
    }, this);
    this.currentFrame = this.$panel.find('.nav-button').data('app', this).eq(0).addClass('current').data('frame');
    this.$el.append(this.$panel);
  },
  onScroll: function() {
    var
      scrollTop = $doc.scrollTop();

    this.currentFrame = this.$panel.find('.nav-button').each(function() {
      var
        $this = $(this),
        pos = $this.offset().top + $this.height() / 2,
        frame = $this.data('app').getFrameByPos(pos);
      $this.toggleClass('inverted', frame.dark)
    }).removeClass('current').eq(this.getFrameByPos(scrollTop + $win.height() / 2).index).addClass('current').data('frame');
  },
  navCorrectPos: function() {
    this.$panel.css({top: ($(window).height() - this.$panel.height()) / 2});
    $win.trigger('scroll');
  },
  navTo: function(id) {
    this.navigate = true;
    $win.data('rootApp').currentFrame = id;
    this.frames[id].navTo(function() {
      $win.data('rootApp').navigate = false;
      document.location.href = "#" + id;
    });

  },
  verticalNav: function(direction) {
    var
      siblingId = this.getSiblingFrame(direction),
      scrollTop = $doc.scrollTop(),
      currentTop = this.frames[this.currentFrame].$el.offset().top;

    if (this.checkShift(direction)) {
      $doc.scrollTop(scrollTop + this.verticalStep * direction);
    } else if (direction < 0 && scrollTop > currentTop + 1 && scrollTop < currentTop + this.verticalStep + 1) {
      this.navTo(this.currentFrame);
    } else if (siblingId) {
      this.navTo(this.getSiblingFrame(direction));
    }
  },
  checkShift: function(direction) {
    var
      newPos = $doc.scrollTop() + this.verticalStep * direction,
      currentTop = this.frames[this.currentFrame].$el.offset().top;

    return newPos > currentTop + 1 && newPos + $win.height() < currentTop + this.frames[this.currentFrame].$el.outerHeight();
  },
  getFrameByPos: function(position) {
    return _.find(this.frames, function(frame) {
      var
        topShift = parseInt(frame.$el.css('top')),
        top = frame.$el.offset().top - (topShift ? topShift : 0);
      return (top < position) && (top + frame.$el.outerHeight() > position);
    });
  },
  getSiblingFrame: function(direction) {
    var
      $currentButton = this.$panel.find('.nav-button[data-frame=' + this.currentFrame + ']'),
      sibling;

    if (direction < 0) {
      sibling = $currentButton.prev('.nav-button');
    } else {
      sibling = $currentButton.next('.nav-button');
    }
    return sibling.length ? sibling.data('frame') : false;
  }
});

$(document).ready(function() {
  $win.data('rootApp', new App(framesJSON));
  $win.trigger('scroll');
});