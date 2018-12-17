'use strict';

// Создание массива 8 сгенерированных объектов

(function () {
  var FLAT_TYPE = ['palace', 'flat', 'house', 'bungalo'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var PHOTOS_LIST = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ];
  var FLAT_TYPE_TRANSLATION = ['Дворец', 'Квартира', 'Дом', 'Бунгало'];
  window.data = {
    FLAT_TYPE: FLAT_TYPE,
    FLAT_TYPE_TRANSLATION: FLAT_TYPE_TRANSLATION,
    PHOTOS_LIST: PHOTOS_LIST,
    FEATURES: FEATURES,
    ADV_QUANTITY: 5
  };
})();
