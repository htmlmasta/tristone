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
  'promo': {},
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