  var btn_upload = document.querySelector("#upload_photo");

  btn_upload.addEventListener("change", function() {

    var files = this.files;
//    console.log(files.value);
    for (var i = 0; i < files.length; i++) {
      preview(files[i]);
    }
    this.value = "";

  });

  function preview(file) {

    if("FileReader" in window) {

      if(file.type.match(/image.*/)) {

        var reader = new FileReader();

        reader.addEventListener("load", function(event) {

          var form = document.querySelector(".order__form");
          var gallery = document.querySelector(".order__gallery");
          var imtemplate = document.querySelector("#image_template").innerHTML;
          var queue =[];

          var html = Mustache.render(imtemplate, {
            "image": event.target.result,
            "name": file.name
          });

          var figure = document.createElement("div");
//          figure.className = "order__photo";
          figure.innerHTML = html;
          gallery.appendChild(figure);
          console.info("Фотография добавлена!");

          var close = figure.querySelector(".order__photo-delete");
          close.addEventListener("click", function(event) {

            event.preventDefault();
            removePreview(figure);
          });

          queue.push({

            "file": file,
            "figure": figure

          });

        });

        reader.readAsDataURL(file);
      }
    }
  }

  function removePreview(figure) {

    var queue =[];
    queue = queue.filter(function(element) {

      return element.figure != figure;

    });

    figure.parentNode.removeChild(figure);
    console.info("Фотография удалена!");
  }