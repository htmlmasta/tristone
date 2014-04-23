var Popup = (function($) {
  var
    _show = function(selector) {
      var
        $popup = $(selector),
        $doc = $(document),
        $win = $(window),
        preTop, preLeft;

      $('.js-overlay').show();
      preTop = ($win.height() - $popup.outerHeight()) / 2;
      preLeft = ($win.width() - $popup.outerWidth()) / 2;
      $popup.show().css({
        top: preTop > 50 ? preTop + $doc.scrollTop() : 50 + $doc.scrollTop(),
        left: preLeft > 20 ? preLeft + $doc.scrollLeft() : 20 + $doc.scrollTop()
      });
    },
    _hide = function(selector) {
      $('.js-overlay').hide();
      $(selector).hide();
    };

  return {
    show: function(selector) {
      _show(selector);
    },
    hide: function(selector) {
      _hide(selector);
    }
  }
}(jQuery));