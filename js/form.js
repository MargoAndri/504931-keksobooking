'use strict';

// Неактивное состояние полей формы
(function () {
  window.form = {
    /**
     * @param {NodeList} elementList
     */
    disableElements: function (elementList) {
      elementList.forEach(function (element) {
        element.setAttribute('disabled', 'disabled');
      });
    },
    /**
     * @param {NodeList} elementList
     */
    enableElements: function (elementList) {
      elementList.forEach(function (element) {
        element.removeAttribute('disabled');
      });
    },
    updateAddressField: function () {
      var address = document.querySelector('#address');
      var pinButton = document.querySelector('.map__pin--main');
      var buttonX = parseInt(pinButton.style.left.replace('px', ''), 10) + 32;
      var buttonY = parseInt(pinButton.style.top.replace('px', ''), 10) + 84;
      address.value = buttonX + ', ' + buttonY;
    }
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
    window.page.resetPage();
  });
  window.form.updateAddressField();

  var successHandler = function () {
    var successTemplate = document.querySelector('#success');
    var success = document.importNode(successTemplate.content, true);
    var main = document.querySelector('main');
    main.appendChild(success);
  };

  document.addEventListener('click', function () {
    var successMessage = document.querySelector('.success');
    if (successMessage) {
      successMessage.remove();
    }
  });
  document.addEventListener('keydown', function (evt) {
    var successMessage = document.querySelector('.success');
    if (evt.keyCode === 27) {
      if (successMessage) {
        successMessage.remove();
      }
    }
  });

  var errorHandler = function () {
    var errorTemplate = document.querySelector('#error');
    var error = document.importNode(errorTemplate.content, true);
    var main = document.querySelector('main');
    main.appendChild(error);

    var errorButton = document.querySelector('.error__button');
    var errorMessage = document.querySelector('.error__message');
    errorButton.addEventListener('click', function () {
      errorMessage.remove();
    });
    document.addEventListener('click', function () {
      errorMessage.remove();
    });
    document.addEventListener('keydown', function (evt) {
      if (evt.keydown === 27) {
        errorMessage.remove();
      }
    });
  };

  var form = document.querySelector('.ad-form');
  form.addEventListener('submit', function(evt) {
    evt.preventDefault();
    window.backend.upload(new FormData(form), function () {
      successHandler();
      window.page.resetPage();
    }, errorHandler);
  });

})();
