var btnOffer = document.querySelector(".btnOffer"),
    offer = document.querySelector(".offer"),
    crossOffer = document.querySelector(".offer__cross"),
    btnSub = document.querySelector(".btnSub"),
    subscripe = document.querySelector(".subscripe"),
    orderBtn = document.querySelectorAll(".orderBtn"),
    order = document.querySelector(".order")
    btnForm = document.querySelector(".btn-form");

btnOffer.addEventListener('click', function(event) {
  event.preventDefault();
  offer.classList.add('show');
});

crossOffer.addEventListener('click', function(event) {
  event.preventDefault();
  offer.classList.remove('show');
});

btnSub.addEventListener('click', function(event) {
  event.preventDefault();
  subscripe.classList.add('show');
});

for (var i = 0; i < orderBtn.length; i++) {

    orderBtn[i].addEventListener('click', function(event) {
      event.preventDefault();
      console.log( orderBtn );
      order.classList.add('show');
    });

}
