
var app = app || {};

app.init = function () {

  app.hacksForIE();
  app.fixHeader();
  app.navMobile();
  app.select();
  app.date();

};

app.hacksForIE = function () {
  if ($('html.ie9').length > 0 || $('html.ie10').length > 0) {
    flexibility(document.documentElement);
  }
};

app.fixHeader = function () {
  $(window).on('scroll', function () {
    $('.header').css('transform', 'translateX(-' + $(window).scrollLeft() + 'px)');
  });
};

/* navigation for mobile */
app.navMobile = function () {
  $('.hambuger-menu').click(function (event) {
    event.preventDefault();
    $(this).toggleClass('is-down');
    var $nav = $(this).parent().find('.nav');
    if ($(this).hasClass('is-down')) {
      $nav.stop().slideDown();
      disableScroll(true);
    } else {
      $nav.stop().slideUp(function () {
        disableScroll(false);
      });
    }
    if (!$(this).hasClass('is-down')) {
      $(this).addClass('is-out');
      setTimeout(function () {
        $('.hambuger-menu').removeClass('is-out');
      }, 500);
    }
    return false;
  });
};

app.select = function () {
  $('.list-select-item').hide();
  $.fn.scrollTo = function (target, options, callback) {
    if (typeof options == 'function' && arguments.length == 2) {
      callback = options;
      options = target;
    }
    var settings = $.extend({
      scrollTarget: target,
      offsetTop: 185,
      duration: 0,
      easing: 'linear'
    }, options);
    return this.each(function () {
      var scrollPane = $(this);
      var scrollTarget = (typeof settings.scrollTarget == 'number') ? settings.scrollTarget : $(settings.scrollTarget);
      var scrollY = (typeof scrollTarget == 'number') ? scrollTarget : scrollTarget.offset().top + scrollPane.scrollTop() - parseInt(settings.offsetTop);
      scrollPane.animate({
        scrollTop: scrollY
      }, parseInt(settings.duration), settings.easing, function () {
        if (typeof callback == 'function') {
          callback.call(this);
        }
      });
    });
  };
  $('.select-item li a').click(function () {
    $(this).parent().parent().parent().find('.value-button').html($(this).text());
    $(this).parent().find('input').val($(this).data('key'));
    $(this).parent().parent().hide();
    $('.group-select .btn-select').removeClass('active');
    return false;
  });

  $('.group-select .btn-select').click(function () {
    // $(this).parent().toggleClass('active');
    $(this).parent().addClass('active');
    if ($(this).hasClass('active')) {
      $(this).removeClass('active');
      $('.list-select-item').parent().find('.list-select-item').css('display', 'none');
    } else {
      // $(this).parent().removeClass('active');
      $('.group-select .btn-select').removeClass('active');
      $('.list-select-item ').parent().find('.list-select-item').css('display', 'none');
      $(this).addClass('active');
      $(this).parent().find('.list-select-item').toggle();
    }
    return false;
  });

  $('.group-select').keydown(function (e) {
    var selected = $('.selected');
    if (e.keyCode == 38) {
      $('.group-select .select-item li').removeClass('selected');
      if (selected.prev().length == 0) {
        selected.siblings().last().addClass('selected');
      } else {
        selected.prev().addClass('selected');
        $('.group-select .select-item').scrollTo('.selected');
      }
    }
    if (e.keyCode == 40) {
      $('.group-select .select-item li').removeClass('selected');
      if (selected.next().length == 0) {
        selected.siblings().first().addClass('selected');
      } else {
        selected.next().addClass('selected');
        $('.group-select .select-item').scrollTo('.selected');
      }
    }
    if (e.keyCode == 13) {
      $('.selected').parent().find('.value-button').html($('.selected').text());

      $('.selected').parent().parent().parent().find('input').val($(this).data('key'));
    }
  });

  $(document).click(function (e) {
    var target = e.target;
    if (!$(target).is('.list-select-item') && !$(target).parents().is('.list-select-item')) {
      $('.list-select-item').hide();
    }
  });
};

app.date = function () {
  $("#datepicker").datepicker({
    numberOfMonths: [1, 1],
    dateFormat: "dd M yy",
    monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
    ],
  });

  $("#datepicker02").datepicker({
    numberOfMonths: [1, 1],
    dateFormat: "dd M yy",
    monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
    ],
  });

  $('.item-news .desc.date-time').click(function () {
    $(this).parent().addClass('active');
    return false;
  });
};

$(function () {
  app.init();
});

