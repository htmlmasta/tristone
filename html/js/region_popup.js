$(document).ready(function() {
  $('.js-choose-region').on('click', function() {
    var
      $doc = $(document),
      $win = $(window),
      $popup = $('.js-region-popup'),
      preTop, preLeft;

    $('.js-overlay').show();
    $popup.show();
    preTop = ($win.height() - $popup.outerHeight()) / 2;
    preLeft = ($win.width() - $popup.outerWidth()) / 2;
    $popup.css({
      top: preTop > 50 ? preTop + $doc.scrollTop() : 50 + $doc.scrollTop(),
      left: preLeft > 20 ? preLeft + $doc.scrollLeft() : 20 + $doc.scrollTop()
    });
    return false;
  });
  $('.js-popup-close').click(function() {
    $('.js-overlay, .popup').hide();
    return false;
  });
});
