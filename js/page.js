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
      pin.addEventListener('keydown', function (evt) {
        if (evt.keyCode === window.data.KeyCode.ENTER) {
          window.mapCard.renderAdvCard(advertisement);
        }
      });
    },
    deleteMapCard: function () {
      var mapCard = document.querySelector('.map__card');
      if (mapCard !== null) {
        mapCard.remove();
      }
    },
    clearMap: function () {
      var allPins = document.querySelectorAll('.map__pin');
      var mapPins = document.querySelector('.map__pins');
      for (var i = 1; i < allPins.length; i++) {
        mapPins.removeChild(allPins[i]);
      }
      window.page.deleteMapCard();
    },
    resetPage: function () {
      var map = document.querySelector('.map');
      var form = document.querySelector('.ad-form');
      var formSpace = form.querySelectorAll('fieldset');
      var filtersForm = document.querySelector('.map__filters');
      var filterSelector = filtersForm.querySelectorAll('.map__filter');
      var featuresFilter = filtersForm.querySelectorAll('.map__features');
      var priceOption = document.querySelector('#price');
      var pinButton = document.querySelector('.map__pin--main');
      window.page.clearMap();
      map.classList.add('map--faded');
      form.classList.add('ad-form--disabled');
      window.form.disableElements(formSpace);
      window.form.disableElements(filterSelector);
      window.form.disableElements(featuresFilter);
      form.reset();
      filtersForm.reset();
      window.photos.clearAvatar();
      window.photos.clearPhotos();
      priceOption.placeholder = DEFAULT_PRICE_PLACEHOLDER;
      priceOption.min = DEFAULT_PRICE_MIN;
      pinButton.style.top = MAIN_PIN_TOP + 'px';
      pinButton.style.left = MAIN_PIN_LEFT + 'px';
      window.form.updateAddressField();
    }
  };
  window.page.resetPage();
})();

