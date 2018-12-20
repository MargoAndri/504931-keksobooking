'use strict';

(function () {
  window.data = {
    FLAT_TYPE: ['palace', 'flat', 'house', 'bungalo'],
    FLAT_TYPE_TRANSLATION: ['Дворец', 'Квартира', 'Дом', 'Бунгало'],
    FEATURES: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],
    ADV_QUANTITY: 5,
    flatTypeToMinPrice: {
      'bungalo': 0,
      'house': 5000,
      'palace': 10000,
      'flat': 1000
    },
    KeyCode: {
      ESC: 27,
      ENTER: 13
    }
  };

})();
