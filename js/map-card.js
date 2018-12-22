'use strict';

(function () {
  // Создание карточки объявления
  /**
   * @param {Object} advertisement
   * @param {Object} advertisement.author
   * @param {Object} advertisement.offer
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
    if ('features' in advertisement.offer) {
      window.data.FEATURES.forEach(function (item) {
        if (advertisement.offer.features.indexOf(item) === -1) {
          var featuresItem = features.querySelector('.popup__feature--' + item);
          features.removeChild(featuresItem);
        }
      });
    } else {
      features.remove();
    }

    var description = cardInfo.querySelector('.popup__description');
    if ('description' in advertisement.offer) {
      description.textContent = advertisement.offer.description;
    } else {
      description.remove();
    }

    var photoList = cardInfo.querySelector('.popup__photos');
    if ('photos' in advertisement.offer && advertisement.offer.photos.length > 0) {
      var photo = photoList.querySelector('img');
      photo.src = advertisement.offer.photos[0];
      var copyAdvertisementPhotos = advertisement.offer.photos.slice(1);
      copyAdvertisementPhotos.forEach(function (element) {
        var nextPhoto = photo.cloneNode(true);
        nextPhoto.src = element;
        photoList.appendChild(nextPhoto);
      });
    } else {
      photoList.remove();
    }

    var avatar = cardInfo.querySelector('.popup__avatar');
    if ('avatar' in advertisement.author) {
      avatar.src = advertisement.author.avatar;
    } else {
      avatar.remove();
    }

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
      var escapeHandler = function (evt) {
        if (evt.code === window.data.KEY_CODE.ESC) {
          window.page.deleteMapCard();
          document.removeEventListener('keydown', escapeHandler);
        }
      };
      close.addEventListener('click', function (evt) {
        evt.preventDefault();
        window.page.deleteMapCard();
      });
      document.addEventListener('keydown', escapeHandler);
    }
  };
})();
