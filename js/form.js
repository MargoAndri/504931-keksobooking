'use strict';


(function () {
  var LEFT_GAP = 32;
  var TOP_GAP = 84;
  window.form = {
    // Неактивное состояние полей формы
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
      var buttonX = parseInt(pinButton.style.left.replace('px', ''), 10) + LEFT_GAP;
      var buttonY = parseInt(pinButton.style.top.replace('px', ''), 10) + TOP_GAP;
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
    priceOption.min = window.data.FLAT_TYPE_MIN_VALUES[flatType.value];
    priceOption.placeholder = window.data.FLAT_TYPE_MIN_VALUES[flatType.value];
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
    window.form.updateAddressField();
  });
  // window.form.updateAddressField();

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
    if (evt.keyCode === window.data.Code.ESC) {
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
    var errorMessage = document.querySelector('.error');
    errorButton.addEventListener('click', function () {
      errorMessage.remove();
    });
    document.addEventListener('click', function () {
      errorMessage.remove();
    });
    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === window.data.Code.ESC) {
        errorMessage.remove();
      }
    });
  };

  var form = document.querySelector('.ad-form');
  form.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.upload(new FormData(form), function () {
      successHandler();
      window.page.resetPage();
    }, errorHandler);
  });

  // Добавление атрибута чекбоксам форм

  var checkboxInput = document.querySelectorAll('input[type = checkbox]');
  checkboxInput.forEach(function (item) {
    item.addEventListener('keydown', function (evt) {
      if (evt.keyCode === window.data.Code.ENTER) {
        evt.preventDefault();
        item.checked = !item.checked;
        var e = new Event('change', {bubbles: true});
        item.dispatchEvent(e);
      }
    });
  });

})();
