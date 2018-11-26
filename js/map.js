'use strict';

// 1. Создание массива 8 сгенерированных объектов

var advertisements = [];
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
var FLAT_TYPE = ['palace', 'flat', 'house', 'bungalo'];
var CHECKIN_TIME = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS_LIST = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];
var FLAT_TYPE_TRANSLATION = ['Дворец', 'Квартира', 'Дом', 'Бунгало'];


var generateRandomInteger = function (minValue, maxValue) {
  return Math.round(Math.random() * (maxValue - minValue) + minValue);
};

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


var generateAdv = function () {
  var result = [];
  for (var i = 0; i < ADV_QUANTITY; i++) {
    var xCoordinator = generateRandomInteger(1, 1200);
    var yCoordinator = generateRandomInteger(130, 630);
    result[i] = {
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
      },
      offer: {
        title: TITLE_LIST[i],
        address: xCoordinator + ', ' + yCoordinator,
        price: generateRandomInteger(1000, 1000000),
        type: FLAT_TYPE[generateRandomInteger(0, 3)],
        rooms: generateRandomInteger(1, 5),
        guests: generateRandomInteger(1, 20),
        checkin: CHECKIN_TIME[generateRandomInteger(0, 2)],
        checkout: CHECKIN_TIME[generateRandomInteger(0, 2)],
        features: generateFeaturesList(),
        description: '',
        photos: generatePhotosList()
      },
      location: {
        x: xCoordinator,
        y: yCoordinator
      }
    };
  }
  return result;
};

advertisements = generateAdv();

// 2. Класс .map--faded у блока .map удален

var map = document.querySelector('.map');
map.classList.remove('map--faded');

// 3. Создание DOM - элемента, соответствующие меткам на карте

var generatePin = function (advertisement, template) {
  var pin = document.importNode(template.content, true);
  var button = pin.querySelector('button');
  button.style.left = advertisement.location.x - 25 + 'px';
  button.style.top = advertisement.location.y - 70 + 'px';
  var image = pin.querySelector('img');
  image.src = advertisement.author.avatar;
  image.alt = advertisement.offer.title;
  return pin;
};

// 4. Отрисовка меток в блоке карты

var renderPins = function () {
  var template = document.querySelector('#pin');
  var mapPins = document.querySelector('.map__pins');
  for (var i = 0; i < advertisements.length; i++) {
    var pin = generatePin(advertisements[i], template);
    mapPins.appendChild(pin);
  }
};

renderPins();

// 5. Создание карточки объявления

var generateAdvCard = function (advertisement, template) {
  var cardInfo = document.importNode(template.content, true);
  var title = cardInfo.querySelector('.popup__title');
  title.textContent = advertisement.offer.title;

  var address = cardInfo.querySelector('.popup__text--address');
  address.textContent = advertisement.offer.address;

  var price = cardInfo.querySelector('.popup__text--price');
  price.textContent = advertisement.offer.price + '₽/ночь';

  var flatType = cardInfo.querySelector('.popup__type');
  var typeIndex = FLAT_TYPE.indexOf(advertisement.offer.type);
  flatType.textContent = FLAT_TYPE_TRANSLATION[typeIndex];

  var roomsAndGuests = cardInfo.querySelector('.popup__text--capacity');
  roomsAndGuests.textContent = advertisement.offer.rooms + ' комнаты для ' + advertisement.offer.guests + ' гостей';

  var time = cardInfo.querySelector('.popup__text--time');
  time.textContent = 'Заезд после ' + advertisement.offer.checkin + ', выезд до ' + advertisement.offer.checkout;

  var features = cardInfo.querySelector('.popup__features');
  for (var i = 0; i < FEATURES.length; i++) {
    if (advertisement.offer.features.indexOf(FEATURES[i]) === -1) {
      var featuresItem = features.children[i];
      features.removeChild(featuresItem);
    }
  }


  var description = cardInfo.querySelector('.popup__description');
  description.textContent = advertisement.offer.description;

  var photoList = cardInfo.querySelector('.popup__photos');
  var photo = photoList.querySelector('img');
  photo.src = PHOTOS_LIST[0];
  for (i = 1; i < PHOTOS_LIST.length; i++) {
    var nextPhoto = photo.cloneNode(true);
    nextPhoto.src = PHOTOS_LIST[i];
    photoList.appendChild(nextPhoto);
  }

  var avatar = cardInfo.querySelector('.popup__avatar');
  avatar.src = advertisement.author.avatar;

  return cardInfo;
};


var renderAdvCard = function () {
  var templateOfAdvCard = document.querySelector('#card');
  var mapAdvCard = document.querySelector('.map');
  var containerBefore = document.querySelector('.map__filters-container');
  var advCard = generateAdvCard(advertisements[0], templateOfAdvCard);
  mapAdvCard.insertBefore(advCard, containerBefore);
};

renderAdvCard();
