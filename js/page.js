'use strict';

(function () {
  var MAIN_PIN_TOP = 375;
  var MAIN_PIN_LEFT = 570;
  var DEFAULT_PRICE_PLACEHOLDER = 1000;
  var DEFAULT_PRICE_MIN = 1000;
  window.page = {
    /**
     * @param {Node} pin
     * @param {Object} advertisement
     */
    addShowCardListener: function (pin, advertisement) {
      pin.addEventListener('click', function (evt) {
        evt.preventDefault();
        window.mapCard.renderAdvCard(advertisement);
      });
    },
    deleteMapCard: function () {
      var mapCard = document.querySelector('.map__card');
      if (mapCard !== null) {
        mapCard.remove();
      }
    },
    resetPage: function () {
      var map = document.querySelector('.map');
      var allPins = document.querySelectorAll('.map__pin');
      var mapPins = document.querySelector('.map__pins');
      var form = document.querySelector('.ad-form');
      var formSpace = form.querySelectorAll('fieldset');
      var filtersForm = document.querySelector('.map__filters');
      var filterSelector = filtersForm.querySelectorAll('.map__filter');
      var priceOption = document.querySelector('#price');
      var pinButton = document.querySelector('.map__pin--main');
      for (var i = 1; i < allPins.length; i++) {
        mapPins.removeChild(allPins[i]);
      }
      window.page.deleteMapCard();
      map.classList.add('map--faded');
      form.classList.add('ad-form--disabled');
      window.form.disableElements(formSpace);
      window.form.disableElements(filterSelector);
      form.reset();
      priceOption.placeholder = DEFAULT_PRICE_PLACEHOLDER;
      priceOption.min = DEFAULT_PRICE_MIN;
      pinButton.style.top = MAIN_PIN_TOP + 'px';
      pinButton.style.left = MAIN_PIN_LEFT + 'px';
      window.form.updateAddressField();
    }
  };
})();
