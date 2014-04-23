var
  /* это заглушка, данные нужно аяксом подгружать */
  content =
    '<div class="work-info">' +
    '  <h2><a href="#">Прямоугольная ванна</a></h2>' +
    '  <p>Современная эргономическая белая ванна. Дизайн Антонио Лупи (Antonio Lupi)</p>' +
    '  <div class="work-materials">' +
    '    В интерьере использованы материалы Tristone:' +
    '    <ul class="work-materials-list">' +
    '      <li class="work-materials-item"><a class="work-materials-link" href="#"><img alt="T-001" src="images/stones/t_001_mini.jpg">' +
    '        <span>T-001</span>' +
    '        Chalcedony</a></li>' +
    '      <li class="work-materials-item"><a class="work-materials-link" href="#"><img alt="T-002" src="images/stones/t_002_mini.jpg">' +
    '        <span>T-002</span>' +
    '        Tourmaline</a></li>' +
    '      <li class="work-materials-item"><a class="work-materials-link" href="#"><img alt="T-003" src="images/stones/t_003_mini.jpg">' +
    '        <span>T-003</span>' +
    '        Ambiance</a></li>' +
    '    </ul>' +
    '  </div>' +
    '  <div class="work-dialer">' +
    '    <p>' +
    '      Фото предоставлено салоном интерьерных решений' +
    '      <b>“Деко’ рум”, Екатеринбург</b>' +
    '    </p>' +
    '    <p><a href="#">Все работы салона</a></p>' +
    '  </div>' +
    '</div>' +
    '<img alt="" class="work-image" height="600" src="images/works/work_dummy_big.jpg" width="800">',

  getContainer = function($link) {
    var $container = $link.data('container');

    if (!$container) {
      $container = $('<div class="work-content">');
      /* здесь необходимо получить данные аяксом и положить их вместо content
       * например из $this брать href и от него скакать
       * я тут просто подставляю картинку из ссылки */
      $container.html(content);
      $('.work-popup').append($container);
      if ($link.parent().index() > 0) {
        $container.find('.work-image').prop({src: $link.find('img').prop('src')});
      }
      $link.data('container', $container);
      $container.data('link', $link);
    }

    return $container;
  },

  showWork = function() {
    var
      $this = $(this),
      $parent = $this.parent(),
      $container = getContainer($this),
      $doc = $(document),
      $win = $(window),
      $popup = $('.work-popup'),
      preTop, preLeft;

    $('.work-popup-prev').toggle($parent.index() != 0);
    $('.work-popup-next').toggle($parent.index() != $parent.siblings().length);
    $container.show().css({opacity: 1}).addClass('work-content-current').siblings('.work-content').hide().css({opacity: 0}).removeClass('work-content-current');
    Popup.show('.work-popup');

    return false;
  },

  prevWork = function() {
    var
      $currentContainer = $(this).parent().find('.work-content-current'),
      $prevLink = $currentContainer.data('link').parent().prev().find('a'),
      $prevLinkParent = $prevLink.parent(),
      $prevContainer = getContainer($prevLink);

    $currentContainer.removeClass('work-content-current').animate({opacity: 0, left: 130}, 500, function() { $currentContainer.hide(); });
    $prevContainer.addClass('work-content-current').show().css({opacity: 0, left: -30}).animate({opacity: 1, left: 50}, 500);
    $('.work-popup-prev').toggle($prevLinkParent.index() != 0);
    $('.work-popup-next').toggle($prevLinkParent.index() != $prevLinkParent.siblings().length);

    return false;
  },

  nextWork = function() {
    var
      $currentContainer = $(this).parent().find('.work-content-current'),
      $nextLink = $currentContainer.data('link').parent().next().find('a'),
      $nextLinkParent = $nextLink.parent(),
      $nextContainer = getContainer($nextLink);

    $currentContainer.removeClass('work-content-current').animate({opacity: 0, left: -30}, 500, function() { $currentContainer.hide(); });
    $nextContainer.addClass('work-content-current').show().css({opacity: 0, left: 130}).animate({opacity: 1, left: 50}, 500);
    $('.work-popup-prev').toggle($nextLinkParent.index() != 0);
    $('.work-popup-next').toggle($nextLinkParent.index() != $nextLinkParent.siblings().length);

    return false;
  },

  closeWork = function() {
    Popup.hide('.work-popup');
    return false;
  },

/* очистка попапа, для случая смены превьюшек */
  refreshWorks = function() {
    $('.work-popup .work-content').remove();
    return false;
  };

$(document).ready(function() {
  $('.works-link').on('click', showWork);
  $('.popup-close').on('click', closeWork);
  $('.work-popup .work-popup-prev').on('click', prevWork);
  $('.work-popup .work-popup-next').on('click', nextWork);
});