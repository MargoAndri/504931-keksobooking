'use strict';

// Создание DOM - элемента, соответствующие меткам на карте
(function () {
  var map = document.querySelector('.map');
  var pinButton = document.querySelector('.map__pin--main');
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

  // Отрисовка меток в блоке карты

  /**
   * @param {Array} advertisements
   */
  var renderPins = function (advertisements) {
    var advWithOffer = advertisements.filter(function (item) {
      return 'offer' in item;
    });
    var template = document.querySelector('#pin');
    var mapPins = document.querySelector('.map__pins');
    var allPins = document.querySelectorAll('.map__pin');
    if (allPins.length === 1) {
      for (var i = 0; i < advWithOffer.length; i++) {
        var pin = generatePin(advWithOffer[i], template);
        mapPins.appendChild(pin);
      }
    }
    var mapPin = document.querySelectorAll('.map__pin');
    for (i = 1; i < mapPin.length; i++) {
      window.page.addShowCardListener(mapPin[i], advWithOffer[i - 1]);
    }
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
      var filtersForm = document.querySelector('.map__filters');
      var filterSelector = filtersForm.querySelectorAll('.map__filter');
      var filterFeatures = filtersForm.querySelector('fieldset');
      map.classList.remove('map--faded');
      form.classList.remove('ad-form--disabled');
      window.form.enableElements(formSpace);
      window.form.enableElements(filterSelector);
      filterFeatures.removeAttribute('disabled');
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
      window.backend.load(renderPins, alert);

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      window.form.updateAddressField();
    };

    activatePage();
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

  });
})();
