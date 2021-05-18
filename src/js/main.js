// MENU
let menuButton = document.querySelector("#menu-trigger");
let menuContent = document.querySelector("#menu-content");
let pageBody = document.querySelector("body");

let showMenu = (event) => {
  menuButton.classList.toggle("active")
  menuContent.classList.toggle("active")
  pageBody.classList.toggle("active")
}

menuButton.addEventListener("click", showMenu);



// MODAL
const modalButton = document.querySelectorAll("button.modal-btn")
let modalContent = document.querySelector(".modal--submit")
let overlay = document.querySelector("#site-overlay")
let closeModalButton = document.querySelector(".close-modal")


let showModal = (event) => {
  modalContent.classList.add("active");
  overlay.classList.add("active");
  pageBody.classList.add("active");
}
let closeModal = (event) => {
  modalContent.classList.remove("active");
  overlay.classList.remove("active");
  pageBody.classList.remove("active");
}

modalButton.forEach(btn => {

  btn.addEventListener('click', showModal);
  });
// modalButton.addEventListener("click", showModal);
closeModalButton.addEventListener("click", closeModal);



// CAROUSEL
let slideName = [];

const swiperSlides = document.querySelectorAll('.swiper-slide');

swiperSlides.forEach(function (element) {
  slideName.push(element.getAttribute('data-slide-name'));
});

var swiper = new Swiper('.swiper-container', {
  direction: 'horizontal',
  autoplay: {
    delay: 6000,
    disableOnInteraction: false
  },
  breakpoints: {
    768: {
      direction: 'vertical',
    }
  },
  slidesPerView: 1,
  loop: true,
  speed: 1600,
  mouswhell: true,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    renderBullet: function (index, className) {
      return '<span class="' + className + '">' + (slideName[index]) + '</span>';
    }
  }
});