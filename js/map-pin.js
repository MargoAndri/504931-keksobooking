'use strict';

(function () {
  var MAP_LEFT_GAP = 25;
  var MAP_TOP_GAP = 70;
  var LOW_PRICE = 10000;
  var HIGH_PRICE = 50000;
  var TOP_LEFT_LIMIT = 130;
  var TOP_RIGHT_LIMIT = 630;
  var LEFT_LIMIT = 32;
  var map = document.querySelector('.map');
  var pinButton = document.querySelector('.map__pin--main');
  var filtersForm = document. querySelector('.map__filters');
  var housingType = document.querySelector('#housing-type');
  var housingPrice = document.querySelector('#housing-price');
  var housingRoom = document.querySelector('#housing-rooms');
  var housingGuestsNumber = document.querySelector('#housing-guests');
  var housingFeatures = document.querySelectorAll('.map__checkbox');
  var filterSelector = filtersForm.querySelectorAll('.map__filter');
  var filterFeatures = filtersForm.querySelector('fieldset');
  var loadedAdvertisements = [];
  /**
   * @param {Object} advertisement
   * @param {Object} advertisement.author
   * @param {Object} advertisement.location
   * @param {Object} advertisement.offer
   * @param {Object} template
   * @return {Node} pin
   */
  var generatePin = function (advertisement, template) {
    var pin = document.importNode(template.content, true);
    var button = pin.querySelector('button');
    button.style.left = advertisement.location.x - MAP_LEFT_GAP + 'px';
    button.style.top = advertisement.location.y - MAP_TOP_GAP + 'px';
    var image = pin.querySelector('img');
    image.src = advertisement.author.avatar;
    image.alt = advertisement.offer.title;
    return pin;
  };

  // Фильтр объявлений
  /**
   * @param {Array} advertisements
   * @return {Array}
   */
  var filterAdvertisement = function (advertisements) {
    var selectedHousingFeatures = [];
    housingFeatures.forEach(function (item) {
      if (item.checked) {
        selectedHousingFeatures.push(item.value);
      }
    });

    var validateHousingPrice = function (price, housingPriceRange) {
      switch (housingPriceRange) {
        case 'low':
          return price < LOW_PRICE;
        case 'middle':
          return price >= LOW_PRICE && price < HIGH_PRICE;
        case 'high':
          return price >= HIGH_PRICE;
      }
      return false;
    };

    var validateHousingFeatures = function (features) {
      for (var i = 0; i < selectedHousingFeatures.length; i++) {
        if (features.indexOf(selectedHousingFeatures[i]) === -1) {
          return false;
        }
      }
      return true;
    };

    var advWithOffer = advertisements.filter(function (item) {
      if (!('offer' in item)) {
        return false;
      }
      if (housingType.value !== 'any' && housingType.value !== item.offer.type) {
        return false;
      }
      if (housingPrice.value !== 'any' && !validateHousingPrice(item.offer.price, housingPrice.value)) {
        return false;
      }
      if (housingRoom.value !== 'any' && item.offer.rooms !== parseInt(housingRoom.value, 10)) {
        return false;
      }
      if (housingGuestsNumber.value !== 'any' && item.offer.guests !== parseInt(housingGuestsNumber.value, 10)) {
        return false;
      }
      return validateHousingFeatures(item.offer.features);
    });

    return advWithOffer.slice(0, window.data.ADV_QUANTITY);
  };


  // Отрисовка меток в блоке карты

  /**
   * @param {Array} advertisements
   */
  var renderPins = function (advertisements) {
    var template = document.querySelector('#pin');
    var mapPins = document.querySelector('.map__pins');
    var allPins = document.querySelectorAll('.map__pin');
    var fragment = document.createDocumentFragment();
    if (allPins.length === 1) {
      for (var i = 0; i < advertisements.length; i++) {
        var pin = generatePin(advertisements[i], template);
        fragment.appendChild(pin);
      }
      mapPins.appendChild(fragment);
    }
    var mapPin = document.querySelectorAll('.map__pin');
    for (i = 1; i < mapPin.length; i++) {
      window.page.addShowCardListener(mapPin[i], advertisements[i - 1]);
    }
  };

  // Активация формы фильтров
  var activateFilterForm = function () {
    window.form.enableElements(filterSelector);
    filterFeatures.removeAttribute('disabled');
  };

  // drag-and-drop
  pinButton.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    // Активация страницы при нажатии на маркер
    var activatePage = function () {
      var form = document.querySelector('.ad-form');
      var formSpace = form.querySelectorAll('fieldset');
      map.classList.remove('map--faded');
      form.classList.remove('ad-form--disabled');
      window.form.enableElements(formSpace);
    };
    /**
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
      if (offsetTop >= TOP_LEFT_LIMIT && offsetTop <= TOP_RIGHT_LIMIT) {
        pinButton.style.top = offsetTop + 'px';
      }
      var offsetLeft = pinButton.offsetLeft - shift.x;
      if (offsetLeft <= (map.offsetWidth - LEFT_LIMIT) && offsetLeft >= -LEFT_LIMIT) {
        pinButton.style.left = pinButton.offsetLeft - shift.x + 'px';
      }
      window.form.updateAddressField();
    };

    /**
     *
     * @param {Object} upEvt
     */
    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      window.backend.load(onSuccessLoad, alert);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      window.form.updateAddressField();
    };

    activatePage();
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

  });
  /**
   * @param {Array} adv
   */
  var onSuccessLoad = function (adv) {
    loadedAdvertisements = adv;
    var filtered = filterAdvertisement(loadedAdvertisements);
    renderPins(filtered);
    activateFilterForm();
  };

  filtersForm.addEventListener('change', function () {
    window.debounce(function () {
      var filtered = filterAdvertisement(loadedAdvertisements);
      window.page.clearMap();
      renderPins(filtered);
    });
  });

})();
