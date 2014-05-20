var
  $doc = $(document),
  $win = $(window);

var FrameView = Backbone.View.extend({
  navTo: function(onEnd) {
    rootApp.navigate = true;
    var top = this.$el.offset().top;
    $('body').animate({scrollTop: top}, 'fast', function() {
      rootApp.navigate = false;
      rootApp.prevScrollTop = $doc.scrollTop();
      $win.trigger('scroll');
    });
  },
  correct: function() {
    //if (this.cid == 'view5') { debugger }
    var
      frameHeight = this.$el.outerHeight() - 58,
      contentHeight = this.$el.find('.wrapper').height();
    this.$el.find('.wrapper').css({marginTop: frameHeight > contentHeight + 50 ? (frameHeight - contentHeight) / 2 : 25});
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
    // $button.addClass('current').siblings().removeClass('current');
  },

  initialize: function() {
    this.prepare(['welcome', 'promo', 'catalogue', 'works', 'tech', 'footer']);
    this.frames['welcome'].correct = function() {
      return true;
    };
    this.frames['footer'].correct = function() {
      var frameHeight = this.$el.height();
      this.$el.find('h2').css({marginTop: frameHeight > 750 ? (frameHeight - 700) / 2 : 25});
    };
    _.bindAll(this, 'onScroll', 'navCorrectPos');
    $(window).scroll(this.onScroll).resize(this.navCorrectPos);
    this.navCorrectPos();
  },
  prepare: function(frames) {
    this.$panel = $('<div class="nav-panel">');
    _.each(frames, function(element, index) {
      this.frames[element] = new FrameView({el: '#' + element, index: index});
      this.$panel.append($('<div class="nav-button" data-frame="' + element + '">'));
    }, this);
    this.$panel.find('.nav-button').eq(0).addClass('current');
    this.$el.append(this.$panel);
    this.prevScrollTop = $(document).scrollTop();
  },
  onScroll: function() {
    var
      scrollTop = $doc.scrollTop(),
      alreadyEdge = _.find(this.frames, function(frame) {
        return Math.floor(scrollTop) == Math.floor(frame.$el.offset().top);
      }),
      shift = scrollTop - this.prevScrollTop;
    if (!this.navigate && !alreadyEdge) {
      this.navToScroll(shift);
    }
    if (alreadyEdge) {
      $('.nav-button[data-frame=' + alreadyEdge.$el.prop('id') + ']').addClass('current').siblings().removeClass('current');
    }
  },
  navCorrectPos: function() {
    _.each(this.frames, function(frame) { frame.correct(); });
    this.$panel.css({top: ($(window).height() - this.$panel.height()) / 2});
  },

  navTo: function(id) {
    this.frames[id].navTo();
  },
  navToScroll: function(shift) {
    var
      clientHeight = $win.height(),
      frameCount = Math.floor((shift - clientHeight / 2) / clientHeight);
  }
});

$(document).ready(function() {
  rootApp = new App();
});