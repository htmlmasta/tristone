$(document).ready(function() {
  $('.js-anchor-menu .left-submenu').css({display: 'none'});
  $('.js-anchor-menu [href=' + document.location.hash + '], .js-anchor-menu .left-menu-active > a').next().css({display: 'block'}).parent().addClass('left-menu-active');
  $('.js-anchor-menu .left-menu-link').on('click', function() {
    var $this = $(this);
    $this.next().slideDown(500);
    $this.closest('.left-menu-item').addClass('left-menu-active').siblings().removeClass('left-menu-active').find('.left-submenu').slideUp(500);
    return false;
  });

  $('.smooth-scroll').click(function() {
    var
      href = $.attr(this, 'href'),
      hash = href.substr(href.indexOf('#')),
      $target = $($.attr(this, 'href'));
    if ($target.length) {
      $('html, body').animate({
        scrollTop: $($.attr(this, 'href')).offset().top
      }, 500, function () {
        document.location.hash = hash;
      });
    }
    return false;
  });

  $(window).on('scroll', function() {
    var
      $menu = $('.left-col'),
      $doc = $(document),
      scrollTop = $doc.scrollTop(),
      menuHeight = $menu.outerHeight(),
      headerHeight = $('.header').outerHeight(),
      footerHeight = $('.footer').outerHeight();

    if ($('.page-content').outerHeight() - menuHeight > 45) {
      if (scrollTop < headerHeight) {
        $menu.removeClass('fixed bottom');
      } else if ((scrollTop + menuHeight > $doc.height() - footerHeight)) {
        $menu.removeClass('fixed').addClass('bottom');
      } else {
        $menu.removeClass('bottom').addClass('fixed');
      }
    } else {
      $menu.removeClass('fixed bottom');
    }
  });
  $(window).trigger('scroll');
});
