'use strict';

// Создание массива 8 сгенерированных объектов

(function () {
  var ADV_QUANTITY = 8;
  var TITLE_LIST = [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ];
  var CHECKIN_TIME = ['12:00', '13:00', '14:00'];
  var FLAT_TYPE = ['palace', 'flat', 'house', 'bungalo'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var PHOTOS_LIST = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ];
  var FLAT_TYPE_TRANSLATION = ['Дворец', 'Квартира', 'Дом', 'Бунгало'];

  /**
   * @param {number} minValue
   * @param {number} maxValue
   * @return {number}
   */
  var generateRandomInteger = function (minValue, maxValue) {
    return Math.round(Math.random() * (maxValue - minValue) + minValue);
  };

  /**
   * @return {Array} featuresList
   */
  var generateFeaturesList = function () {
    var featuresList = [];
    var featuresListLength = generateRandomInteger(1, FEATURES.length);
    var element = '';
    for (var i = 0; i < featuresListLength; i++) {
      do {
        element = FEATURES[generateRandomInteger(0, FEATURES.length - 1)];
      } while (featuresList.indexOf(element) !== -1);
      featuresList[i] = element;
    }
    return featuresList;
  };

  /**
   * @return {Array} photosList
   */
  var generatePhotosList = function () {
    var photosList = [];
    var photo = '';
    for (var i = 0; i < PHOTOS_LIST.length; i++) {
      do {
        photo = PHOTOS_LIST[generateRandomInteger(0, PHOTOS_LIST.length - 1)];
      } while (photosList.indexOf(photo) !== -1);
      photosList[i] = photo;
    }
    return photosList;
  };

  /**
   *
   * @return {Array} result
   */
  var generateAdv = function () {
    var result = [];
    for (var i = 0; i < ADV_QUANTITY; i++) {
      var xCoordinator = generateRandomInteger(100, 1100);
      var yCoordinator = generateRandomInteger(130, 630);
      result[i] = {
        author: {
          avatar: 'img/avatars/user0' + (i + 1) + '.png'
        },
        // offer: {
        //   title: TITLE_LIST[i],
        //   address: xCoordinator + ', ' + yCoordinator,
        //   price: generateRandomInteger(1000, 1000000),
        //   type: FLAT_TYPE[generateRandomInteger(0, 3)],
        //   rooms: generateRandomInteger(1, 5),
        //   guests: generateRandomInteger(1, 20),
        //   checkin: CHECKIN_TIME[generateRandomInteger(0, 2)],
        //   checkout: CHECKIN_TIME[generateRandomInteger(0, 2)],
        //   features: generateFeaturesList(),
        //   description: '',
        //   photos: generatePhotosList()
        // },
        location: {
          x: xCoordinator,
          y: yCoordinator
        }
      };
    }
    return result;
  };

  window.data = {
    advertisementList: generateAdv(),
    FLAT_TYPE: FLAT_TYPE,
    FLAT_TYPE_TRANSLATION: FLAT_TYPE_TRANSLATION,
    PHOTOS_LIST: PHOTOS_LIST,
    FEATURES: FEATURES
  };
})();
