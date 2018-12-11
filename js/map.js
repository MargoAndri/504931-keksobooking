'use strict';

// Создание массива 8 сгенерированных объектов

var advertisementList = [];
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
var form = document.querySelector('.ad-form');
var formSpace = form.querySelectorAll('fieldset');
var filtersForm = document.querySelector('.map__filters');
var filterSelector = filtersForm.querySelectorAll('.map__filter');
var filterFeatures = filtersForm.querySelector('fieldset');
var MAIN_PIN_TOP = 375;
var MAIN_PIN_LEFT = 570;
var DEFAULT_PRICE_PLACEHOLDER = 1000;
var DEFAULT_PRICE_MIN = 1000;

var map = document.querySelector('.map');

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

// Создание DOM - элемента, соответствующие меткам на карте

/**
 *
 * @param {Object} advertisement
 * @param {Object} template
 * @return {Node} pin
 */
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

// Отрисовка меток в блоке карты

/**
 *
 * @param {Array} advertisements
 */
var renderPins = function (advertisements) {
  var template = document.querySelector('#pin');
  var mapPins = document.querySelector('.map__pins');
  var allPins = document.querySelectorAll('.map__pin');
  if (allPins.length === 1) {
    for (var i = 0; i < advertisements.length; i++) {
      var pin = generatePin(advertisements[i], template);
      mapPins.appendChild(pin);
    }
  }
};

// Создание карточки объявления

/**
 *
 * @param {Object} advertisement
 * @param {Object} template
 * @return {Node} cardInfo
 */
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
      var featuresItem = features.querySelector('.popup__feature--' + FEATURES[i]);
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

/**
 *
 * @param {Object} advertisement
 */
var renderAdvCard = function (advertisement) {
  var templateOfAdvCard = document.querySelector('#card');
  var mapAdvCard = document.querySelector('.map');
  var containerBefore = document.querySelector('.map__filters-container');
  var advCard = generateAdvCard(advertisement, templateOfAdvCard);
  deleteMapCard();
  mapAdvCard.insertBefore(advCard, containerBefore);
  var close = document.querySelector('.popup__close');
  close.addEventListener('click', function (evt) {
    evt.preventDefault();
    deleteMapCard();
  });
  document.addEventListener('keydown', function (evt) {
    if (evt.keyCode === 27) {
      deleteMapCard();
    }
  });
};

// Неактивное состояние полей формы
/**
 *
 * @param {NodeList} elementList
 */
var disableElements = function (elementList) {
  elementList.forEach(function (element) {
    element.setAttribute('disabled', 'disabled');
  });
};

/**
 *
 * @param {NodeList} elementList
 */
var enableElements = function (elementList) {
  elementList.forEach(function (element) {
    element.removeAttribute('disabled');
  });
};

// Активация страницы
/**
 *
 * @param {Node} pin
 * @param {Object} advertisement
 */
var addShowCardListener = function (pin, advertisement) {
  pin.addEventListener('click', function (evt) {
    evt.preventDefault();
    renderAdvCard(advertisement);
  });
};

var deleteMapCard = function () {
  var mapCard = document.querySelector('.map__card');
  if (mapCard !== null) {
    mapCard.remove();
  }
};

// Обновление строки адреса в форме

var updateAddressField = function () {
  var address = document.querySelector('#address');
  var buttonX = parseInt(pinButton.style.left.replace('px', ''), 10) + 32;
  var buttonY = parseInt(pinButton.style.top.replace('px', ''), 10) + 84;
  address.value = buttonX + ', ' + buttonY;
};

// Сбрасывание страницы в исходное неактивное состояние

var resetPage = function () {
  var allPins = document.querySelectorAll('.map__pin');
  var mapPins = document.querySelector('.map__pins');
  for (var i = 1; i < allPins.length; i++) {
    mapPins.removeChild(allPins[i]);
  }
  deleteMapCard();
  map.classList.add('map--faded');
  form.classList.add('ad-form--disabled');
  disableElements(formSpace);
  disableElements(filterSelector);
  form.reset();
  priceOption.placeholder = DEFAULT_PRICE_PLACEHOLDER;
  priceOption.min = DEFAULT_PRICE_MIN;
  pinButton.style.top = MAIN_PIN_TOP + 'px';
  pinButton.style.left = MAIN_PIN_LEFT + 'px';
  updateAddressField();
};

// Синхронизация количества комнат с количеством гостей

var roomCapacity = document.querySelector('#capacity');
var roomNumber = document.querySelector('#room_number');

var checkRoomCapacity = function () {
  var roomNumberValue = parseInt(roomNumber.value, 10);
  var roomCapacityValue = parseInt(roomCapacity.value, 10);
  if (roomNumberValue < roomCapacityValue || roomNumberValue !== 100 && roomCapacityValue === 0) {
    roomCapacity.setCustomValidity('Нужно больше комнат.');
  } else if (roomNumberValue === 100 && roomCapacityValue !== 0) {
    roomCapacity.setCustomValidity('Тут проводятся вечеринки!');
  } else {
    roomCapacity.setCustomValidity('');
  }
};

// drag-and-drop

var pinButton = document.querySelector('.map__pin--main');
pinButton.addEventListener('mousedown', function (evt) {
  evt.preventDefault();
  var startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };

  // Активация страницы при нажатии на маркер
  var activatePage = function () {
    map.classList.remove('map--faded');
    form.classList.remove('ad-form--disabled');
    enableElements(formSpace);
    enableElements(filterSelector);
    filterFeatures.removeAttribute('disabled');
  };
  /**
   *
   * @param {Object} moveEvt
   */
  var onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();

    var shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };
    var offsetTop = pinButton.offsetTop - shift.y;
    if (offsetTop >= 130 && offsetTop <= 630) {
      pinButton.style.top = offsetTop + 'px';
    }
    var offsetLeft = pinButton.offsetLeft - shift.x;
    if (offsetLeft <= (map.offsetWidth - 32) && offsetLeft >= -32) {
      pinButton.style.left = pinButton.offsetLeft - shift.x + 'px';
    }
    updateAddressField();
  };

  /**
   *
   * @param {Object} upEvt
   */
  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();
    renderPins(advertisementList);
    var mapPin = document.querySelectorAll('.map__pin');
    for (var i = 1; i < mapPin.length; i++) {
      addShowCardListener(mapPin[i], advertisementList[i - 1]);
    }
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    updateAddressField();
  };

  activatePage();
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);

});


// Обработчик события смены жилья

var flatType = document.querySelector('#type');
var priceOption = document.querySelector('#price');

flatType.addEventListener('change', function () {
  switch (flatType.value) {
    case 'bungalo':
      priceOption.min = 0;
      priceOption.placeholder = 0;
      break;
    case 'house':
      priceOption.min = 5000;
      priceOption.placeholder = 5000;
      break;
    case 'palace':
      priceOption.min = 10000;
      priceOption.placeholder = 10000;
      break;
    case 'flat':
      priceOption.min = 1000;
      priceOption.placeholder = 1000;
      break;
  }
});

// Синхронизация время заезда и выезда

var timeInOption = document.querySelector('#timein');
var timeOutOption = document.querySelector('#timeout');

timeInOption.addEventListener('change', function () {
  timeOutOption.value = timeInOption.value;
});

timeOutOption.addEventListener('change', function () {
  timeInOption.value = timeOutOption.value;
});

roomNumber.addEventListener('change', function () {
  checkRoomCapacity();
});
roomCapacity.addEventListener('change', function () {
  checkRoomCapacity();
});


var resetButton = document.querySelector('.ad-form__reset');
resetButton.addEventListener('click', function (evt) {
  evt.preventDefault();
  resetPage();
});

resetPage();
advertisementList = generateAdv();
filterFeatures.setAttribute('disabled', 'disabled');
disableElements(formSpace);
disableElements(filterSelector);
