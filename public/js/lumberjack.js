'use strict';

var app = angular.module('ForestAdmin', ['duScroll']);

app.value('duScrollGreedy', true);
app.value('duScrollBottomSpy', true);

app.config(['$locationProvider', function ($locationProvider) {
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
}]);

app.run(function ($rootScope) {
  $('h1').each(function (i, elem) {
    if (elem.id) {
      $('<a href="#' + elem.id +
        '" class="l-sidebar__item" du-scrollspy><span class="u-to-e">' +
        elem.textContent + '</span></a>').appendTo('#toc');

      var group = $('<div class="l-sidebar__group">').appendTo('#toc');

      $(elem).nextUntil('h1', 'h2').each(function (i, h2) {
        $('<a class="l-sidebar__subitem" href="#' + h2.id +
        '" class="l-sidebar__subitem" du-scrollspy>' + h2.textContent +
        '</a>').appendTo(group);
      });
    }
  });

  window.docsearch({
     apiKey: 'af3041a533369af9ec173043a713591f',
     indexName: 'forestadmin',
     inputSelector: '#search',
     debug: false
  });
  $('#search').show();

  $('.l-sidebar__item a').prop('du-scrollspy', true);

  $rootScope.$on('duScrollspy:becameActive', function ($event, $element) {
    $('.l-sidebar__item').removeClass('active');
    $('.l-sidebar__group').removeClass('active');
    $('.l-sidebar__subitem').removeClass('active');

    if ($element.hasClass('l-sidebar__subitem')) {
      $element.addClass('active');
      $element.parent().addClass('active');
      $element.parent().prev().addClass('active');
    } else if ($element.hasClass('l-sidebar__item')) {
      $element.addClass('active');
    }
  });
});

app.controller('HomeCtrl', ['$anchorScroll', function ($anchorScroll) {
  $anchorScroll();
}]);
