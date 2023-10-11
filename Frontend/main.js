let products = [];
let total = 0;
function add(product, price){
    console.log(product, price);
    products.push(product);
    total = total + price; 
    console.log(total);
}

// function pay(product, price){
//   const productList = 
//   window.alert(products.join(","));
// }

//---- Cargamos los productos

function displayProducts(productList){
  let productsHTML='';
  productList.forEach(element =>{
    productsHTML+=
      `<div class="shoes" onclick="goToDetailProducts(${element.id})">
        <div class="img-container">
          <img src="${element.image}" loading="lazy" class="shoes-img" alt="shoeimg">
          <button class="shop-cart">
              <div class="add-shoes">
                  <img src="assets/bag-2.svg" alt="buy">
                  <div class="plus">+</div>
              </div>
          </button>
          <div class="discount">%10</div>
        </div>
        <div class="description-shoes">
          <div>${element.name}</div>
          <em>$${element.price}</em>
          <em class="old-price">$${element.price+3800}</em>
        </div>
      </div>`
  });
  document.getElementById('shoesgrid').innerHTML= productsHTML;
}

window.onload = async()=>{
  const productList = await (await fetch("/api/products")).json();
  // console.log(productList[0]);
  displayProducts(productList);
}


document.querySelector('.menu-btn').addEventListener('click', ()=>{
    document.querySelector('.nav-menu').classList.toggle('show')
});

//! NAVIGATIONS

function goToDetailProducts(productId) {
  // document.querySelector('.container2').classList.add('slide-out');
  window.location.href = `/screens/detail-products.html?id=${productId}`;
  // setTimeout(function() {
  //   window.location.href = "/screens/detail-products.html";
  // }, 500);
}

function goHome() {
  // document.querySelector('.container2').classList.add('slide-out');
  window.location.href = `../index.html`;
  // setTimeout(function() {
  //   window.location.href = "/screens/detail-products.html";
  // }, 500);
}
const carrito =document.getElementById('carritoImg')

window.addEventListener('scroll', function () {
    // Obtener la altura del contenido visible en la ventana
    const contentHeight = window.innerHeight;
    // Obtener la posición vertical actual del scroll
    const scrollY = window.scrollY;
    
    let arrayMenu = document.querySelectorAll('.menuletters');
    // Si la posición del scroll ha pasado la altura del contenido
    
    if (carrito){
      if (scrollY >= contentHeight+200) {
        // Agregar la clase 'dark-mode' a la navegación
        document.querySelector('.menu-btn').classList.add('dark-mode');
        document.querySelector('.brand-name2').classList.add('showLog');
        document.querySelector('.nav-mobile').classList.add('showProducts');
        document.getElementById('carritoImg').classList.add('inverted-svg')
        arrayMenu.forEach(element => element.classList.add('menuX'));
        //cambiamos por la imagen negra
        // carritoImg.src = filenameOnBottom;
      } else {
        // Si no, remover la clase 'dark-mode' de la navegación
        document.querySelector('.menu-btn').classList.remove('dark-mode');
        document.querySelector('.brand-name2').classList.remove('showLog');
        document.querySelector('.nav-mobile').classList.remove('showProducts');
        document.getElementById('carritoImg').classList.remove('inverted-svg')
        arrayMenu.forEach(element => element.classList.remove('menuX'));
        // carritoImg.src = filenameOnTop;
      }
    }

});
  
const amountSelection = document.querySelectorAll('.amount-selection');

amountSelection.forEach(amount => {

  const amountInput = amount.querySelector('.amount-input');

  const arrUp = amount.querySelector('.up');
  const arrDown = amount.querySelector('.down');

  arrUp.addEventListener('click', () =>{

    amountInput.stepUp();
    checkMaxMin();

  });
  arrDown.addEventListener('click', () =>{
    
    amountInput.stepDown();
    checkMaxMin();
  });

  amountInput.addEventListener('input', checkMaxMin);

  function checkMaxMin(){
    const amountInputValue = parseInt(amountInput.value);
    const amountInputMax = parseInt(amountInput.max);
    const amountInputMin = parseInt(amountInput.min);

    if (amountInputValue === amountInputMax){
      arrUp.disabled = true;
    } else if(amountInputValue === amountInputMin){
      arrDown.disabled = true;
    } else {
      arrDown.disabled = false;
      arrUp.disabled = false;
    }
  }
});

