'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var DEFAULT_AVATAR_SRC = 'img/muffin-grey.svg';
  var IMAGE_WIDTH = 70;
  var IMAGE_HEIGHT = 70;
  var avatarPreview = document.querySelector('.ad-form-header__preview img');
  var avatarFileChooser = document.querySelector('.ad-form__field input[type=file]');
  var photoPreviewContainer = document.querySelector('.ad-form__photo-container');
  var photoFileChooser = document.querySelector('.ad-form__upload input[type=file]');

  var loadPhoto = function (photoFile, onLoad) {
    var photoFileName = photoFile.name.toLowerCase();
    var matches = FILE_TYPES.some(function (it) {
      return photoFileName.endsWith(it);
    });
    if (matches) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        onLoad(reader.result);
      });
      reader.readAsDataURL(photoFile);
    }
  };

  var addPhoto = function (photoData) {
    var photoPreviewList = document.createElement('div');
    photoPreviewList.classList.add('ad-form__photo');
    var image = document.createElement('img');
    image.src = photoData;
    image.width = IMAGE_WIDTH;
    image.height = IMAGE_HEIGHT;
    photoPreviewList.appendChild(image);
    photoPreviewContainer.appendChild(photoPreviewList);
  };

  avatarFileChooser.addEventListener('change', function () {
    loadPhoto(avatarFileChooser.files[0], function (avatarData) {
      avatarPreview.src = avatarData;
    });
  });

  photoFileChooser.addEventListener('change', function () {
    window.photos.clearPhotos();
    for (var j = 0; j < photoFileChooser.files.length; j++) {
      loadPhoto(photoFileChooser.files[j], addPhoto);
    }
  });

  window.photos = {
    clearPhotos: function () {
      var loadedPhotos = document.querySelectorAll('.ad-form__photo');
      for (var i = 0; i < loadedPhotos.length; i++) {
        photoPreviewContainer.removeChild(loadedPhotos[i]);
      }
    },
    clearAvatar: function () {
      avatarPreview.src = DEFAULT_AVATAR_SRC;
    }
  };

})();
