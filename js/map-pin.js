'use strict';

// Создание DOM - элемента, соответствующие меткам на карте
(function () {
  var map = document.querySelector('.map');
  var pinButton = document.querySelector('.map__pin--main');
  var filtersForm = document. querySelector('.map__filters');
  var housingType = document.querySelector('#housing-type');
  var housingPrice = document.querySelector('#housing-price');
  var housingRoom = document.querySelector('#housing-rooms');
  var housingGuestsNumber = document.querySelector('#housing-guests');
  var housingFeatures = document.querySelectorAll('.map__checkbox');
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
    button.style.left = advertisement.location.x - 25 + 'px';
    button.style.top = advertisement.location.y - 70 + 'px';
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

    var advWithOffer = advertisements.filter(function (item) {
      return 'offer' in item;
    });
    if (housingType.value !== 'any') {
      advWithOffer = advWithOffer.filter(function (item) {
        return item.offer.type === housingType.value;
      });
    }
    if (housingPrice.value !== 'any') {
      advWithOffer = advWithOffer.filter(function (item) {
        switch (housingPrice.value) {
          case 'low':
            return item.offer.price < 10000;
          case 'middle':
            return item.offer.price >= 10000 && item.offer.price < 50000;
          case 'high':
            return item.offer.price >= 50000;
        }
        return false;
      });

    }
    if (housingRoom.value !== 'any') {
      advWithOffer = advWithOffer.filter(function (item) {
        return item.offer.rooms === housingRoom.value;
      });
    }
    if (housingGuestsNumber.value !== 'any') {
      advWithOffer = advWithOffer.filter(function (item) {
        return item.offer.guests === parseInt(housingGuestsNumber.value, 10);
      });
    }
    advWithOffer = advWithOffer.filter(function (item) {
      for (var i = 0; i < selectedHousingFeatures.length; i++) {
        if (item.offer.features.indexOf(selectedHousingFeatures[i]) === -1) {
          return false;
        }
      }
      return true;
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
    if (allPins.length === 1) {
      for (var i = 0; i < advertisements.length; i++) {
        var pin = generatePin(advertisements[i], template);
        mapPins.appendChild(pin);
      }
    }
    var mapPin = document.querySelectorAll('.map__pin');
    for (i = 1; i < mapPin.length; i++) {
      window.page.addShowCardListener(mapPin[i], advertisements[i - 1]);
    }
  };

  // Активация формы фильтров
  var activateFilterForm = function () {
    var filterSelector = filtersForm.querySelectorAll('.map__filter');
    var filterFeatures = filtersForm.querySelector('fieldset');
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
      if (offsetTop >= 130 && offsetTop <= 630) {
        pinButton.style.top = offsetTop + 'px';
      }
      var offsetLeft = pinButton.offsetLeft - shift.x;
      if (offsetLeft <= (map.offsetWidth - 32) && offsetLeft >= -32) {
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
      window.backend.load(successHandler, alert);
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
  var successHandler = function (adv) {
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
