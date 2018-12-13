'use strict';

(function () {
  // Создание карточки объявления
  /**
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
    var typeIndex = window.data.FLAT_TYPE.indexOf(advertisement.offer.type);
    flatType.textContent = window.data.FLAT_TYPE_TRANSLATION[typeIndex];

    var roomsAndGuests = cardInfo.querySelector('.popup__text--capacity');
    roomsAndGuests.textContent = advertisement.offer.rooms + ' комнаты для ' + advertisement.offer.guests + ' гостей';

    var time = cardInfo.querySelector('.popup__text--time');
    time.textContent = 'Заезд после ' + advertisement.offer.checkin + ', выезд до ' + advertisement.offer.checkout;

    var features = cardInfo.querySelector('.popup__features');
    for (var i = 0; i < window.data.FEATURES.length; i++) {
      if (advertisement.offer.features.indexOf(window.data.FEATURES[i]) === -1) {
        var featuresItem = features.querySelector('.popup__feature--' + window.data.FEATURES[i]);
        features.removeChild(featuresItem);
      }
    }

    var description = cardInfo.querySelector('.popup__description');
    description.textContent = advertisement.offer.description;

    var photoList = cardInfo.querySelector('.popup__photos');
    var photo = photoList.querySelector('img');
    photo.src = window.data.PHOTOS_LIST[0];
    for (i = 1; i < window.data.PHOTOS_LIST.length; i++) {
      var nextPhoto = photo.cloneNode(true);
      nextPhoto.src = window.data.PHOTOS_LIST[i];
      photoList.appendChild(nextPhoto);
    }

    var avatar = cardInfo.querySelector('.popup__avatar');
    avatar.src = advertisement.author.avatar;

    return cardInfo;
  };

  /**
   * @param {Object} advertisement
   */
  window.mapCard = {
    renderAdvCard: function (advertisement) {
      var templateOfAdvCard = document.querySelector('#card');
      var mapAdvCard = document.querySelector('.map');
      var containerBefore = document.querySelector('.map__filters-container');
      var advCard = generateAdvCard(advertisement, templateOfAdvCard);
      window.page.deleteMapCard();
      mapAdvCard.insertBefore(advCard, containerBefore);
      var close = document.querySelector('.popup__close');
      close.addEventListener('click', function (evt) {
        evt.preventDefault();
        window.page.deleteMapCard();
      });
      document.addEventListener('keydown', function (evt) {
        if (evt.keyCode === 27) {
          window.page.deleteMapCard();
        }
      });
    }
  };
})();
