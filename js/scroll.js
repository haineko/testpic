'use strict';

  (function() {
    var container = document.querySelector(".offer__menu");
    var block = document.querySelector('.offer');
    var scrollElement;

  function getClickedElement (evt) {
    evt.preventDefault();
    if(scrollElement) {
      clearElement();
    }
    var element = evt.target;
    var elementHref = element.hash.replace("#", "");
    scrollElement = document.getElementById(elementHref);
    scrollElement.scrollIntoView(top);
    scrollElement.style.background="#00c853";
    scrollElement.style.color="white";
    window.scrollTo(0, 0);
  };

  function clearElement () {
    scrollElement.style.background="none";
    scrollElement.style.color="black";
  };


  container.addEventListener('click', getClickedElement);

})();

(function() {
    var container = document.querySelector(".support__menu");
    var block = document.querySelector('.support');
    var scrollElement;

  function getClickedElement (evt) {
    evt.preventDefault();
    if(scrollElement) {
      clearElement();
    }
    var element = evt.target;
    var elementHref = element.hash.replace("#", "");
    scrollElement = document.getElementById(elementHref);
    scrollElement.scrollIntoView(top);
    scrollElement.style.background="#00c853";
    scrollElement.style.color="white";
    window.scrollTo(0, 0);
  };

  function clearElement () {
    scrollElement.style.background="none";
    scrollElement.style.color="black";
  };


  container.addEventListener('click', getClickedElement);

})();