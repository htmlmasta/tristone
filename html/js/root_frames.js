var framesJSON = {
  'welcome': {
    dark: true,
    onResize: function() {
      return this;
    },
    onScroll: function() {
      var scrollTop = $doc.scrollTop();

      if (scrollTop < this.$el.outerHeight()) {
        this.$el.css({top: scrollTop / 2});
      }

      return this;
    }
  },
  'promo': {
    onScroll: function() {
      var
        frameHeight = this.$el.outerHeight(),
        opacity = 1 - Math.min(Math.abs($doc.scrollTop() - this.$el.offset().top), frameHeight) / frameHeight,
        shift = (1 - opacity) * 200;

      this.$el.find('.left-pic').css({marginLeft: -shift, paddingRight: shift, opacity: opacity});
      this.$el.find('.right-pic').css({marginRight: -shift, paddingLeft: shift, opacity: opacity});

      return this;
    }
  },
  'catalogue': {},
  'works': {},
  'tech': {},
  'footer': {
    onResize: function() {
      var frameHeight = this.$el.height();
      this.$el.find('h2').css({marginTop: frameHeight > 750 ? (frameHeight - 700) / 2 : 25});
      return this;
    }
  }
};