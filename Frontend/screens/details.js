let order = {
  item : []
};
window.onload = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  const currentPage = document.querySelector('html').getAttribute('data-page');
  
  //chequear en que html estamos
  if (currentPage === 'shop-cart') {
    //cargamos el carrito con productos agregados
    let cartProducts = JSON.parse(localStorage.getItem('cartProducts'));
    let cantidadTotal = 0;
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');
    step1.classList.add('step-active');
    // Itera a través de los elementos y suma las cantidades
    if (cartProducts && cartProducts.length > 0) {
      // Aquí puedes usar el forEach para calcular la cantidad total
      cartProducts.forEach(item => {
          cantidadTotal += parseInt(item.cant, 10) || 0;
      });
      const cantProdElements = document.querySelectorAll('.cantProd');
      cantProdElements.forEach(element => {
          element.style.display = 'flex';
          element.innerText = cantidadTotal;
      })
    }
    console.log(cartProducts);
    updateCartDisplay(cartProducts);
  } else{
    let cartProducts = JSON.parse(localStorage.getItem('cartProducts'));
    let cantidadTotal = 0;
    // Itera a través de los elementos y suma las cantidades
    if (cartProducts && cartProducts.length > 0) {
      // Aquí puedes usar el forEach para calcular la cantidad total
      cartProducts.forEach(item => {
          cantidadTotal += parseInt(item.cant, 10) || 0;
      });
      const cantProdElements = document.querySelectorAll('.cantProd');
      cantProdElements.forEach(element => {
          element.style.display = 'flex';
          element.innerText = cantidadTotal;
      })
    }
    const productList = await (await fetch('/api/products')).json();
    const product = productList.find(item => item.id === parseInt(productId));
    // Actualiza los elementos de la página con los detalles del producto
    document.getElementById('name-product').innerText = product.name;
    document.getElementById('mainProductImage').src = '/'+product.image;
    document.getElementById('ProductImage1').src = '/'+product.image;
    document.getElementById('ProductImage2').src = '/'+product.image2;
    document.getElementById('ProductImage3').src = '/'+product.image3;
    document.getElementById('secondProductImage1').src = '/'+product.image;
    document.getElementById('secondProductImage2').src = '/'+product.image2;

    document.getElementById('descriptionP').innerText = product.description;
    document.getElementById('real-price').innerText = `$${product.price}`;
    if (product.image3) 
    {
      document.getElementById('secondProductImage3').src = '/' + product.image3;
    }
    else{
      document.getElementById('ProductImage3').src = '/'+product.image2;
    }

    //Seleccionamos las imagenes para ir cambiando entre ellas
    let mainImg= document.getElementById('mainProductImage');
    let smallImg1= document.getElementById('secondProductImage1');
    let smallImg2= document.getElementById('secondProductImage2');
    let smallImg3= document.getElementById('secondProductImage3');

    smallImg1.onclick = function(){
      mainImg.src=smallImg1.src;
    }
    smallImg2.onclick = function(){
      mainImg.src=smallImg2.src;
    }
    smallImg3.onclick = function(){
      mainImg.src=smallImg3.src;
    }
    
      //comparamos total de talles con los disponibles
    let arrayMenu = document.querySelectorAll('.numero-talle');//lista de talles en pantalla    
    let buttonAddCart = document.querySelector('.add-cart');//Button Agregar al carrito
    console.log(arrayMenu);
    
    // Inhabilitar por defecto el botón add-cart hasta que se seleccione algún talle
    buttonAddCart.style.pointerEvents = "none";
       arrayMenu.forEach(function(tallaElement) {
      var talla =tallaElement.textContent.trim();
        
        // Verifica si la talla actual está en el array de tallas disponibles
      if (!product.talles[talla]>=1) { 
        tallaElement.classList.add("no-disponible"); // Agrega una clase css para indicar disponibilidad
        tallaElement.style.pointerEvents = "none";
      }
      // inhabilitar por defecto el botón add-cart hasta que se seleccione algun talle
      buttonAddCart.style.pointerEvents = "none";          
      
      ////EVENTO ELEGIMOS TALLES switchea entre los talles
      tallaElement.addEventListener('click', function() {
      // Remover la clase "selected-size" de todos los elementos
        arrayMenu.forEach(function(element) {
          element.classList.remove("selected-size");
        });
        // Aplicar el estilo de selección al elemento clicado
        console.log(talla)
        tallaElement.classList.add("selected-size");
        buttonAddCart.style.pointerEvents = "auto";
        buttonAddCart.classList.add("addingToCart")
        // verifico la cantidad por talle seleccionado para enviarlo al widget de cantidad
        let contadorDeTalles = 0;
        contadorDeTalles = product.talles[talla];
        let amountInput = document.querySelector('.amount-input');
        amountInput.value = 1;
        amountInput.max = contadorDeTalles;        
          
      });
    });
    //EVENTO CUANDO AGREGAMOS AL CARRITO
    buttonAddCart.addEventListener('click', function(){
      const idProducto = product.id; // Reemplaza con el valor real del ID
      const precioProducto = product.price; // Reemplaza con el valor real del precio
  
      add(idProducto, precioProducto);
      
        // Obtener el talle seleccionado y la cantidad
      const selectedSizeElement = document.querySelector('.selected-size');
      const selectedTalla = selectedSizeElement.textContent.trim();
      const amountInput = document.querySelector('.amount-input');
  
      console.log("1) agregaste " + amountInput.value + " zapatos "+ product.name+" talle: " + selectedTalla )
        
      addCartProduct(product,selectedTalla,amountInput.value);                    
      
      window.location.href = `shop-cart.html?id=${idProducto}&talle=${selectedTalla}&cant=${amountInput.value}`;
    })      
    //Carrousel o Slider de detalle de productos
    const carrousel = document.querySelector("#carrousel");
    let carrouselSection = document.querySelectorAll(".carrousel-section");
    let carrouselSectionLast = carrouselSection[carrouselSection.length -1];

    const btnLeft = document.querySelector("#btn-left");
    const btnRight = document.querySelector("#btn-right");

    carrousel.insertAdjacentElement('afterbegin',carrouselSectionLast);//obtengo el ultimo elemento y lo coloco en el carrousel

    function Next(){
        let carrouselSectionFirst = document.querySelectorAll(".carrousel-section")[0];
        carrousel.style.marginLeft = "-100%";
        carrousel.style.transition = "all 0.7s";
        setTimeout(function(){
            carrousel.style.transition = "none";
            carrousel.insertAdjacentElement('beforeend',carrouselSectionFirst);
            carrousel.style.marginLeft = "0";
        },700);
    }
    function Prev(){
        let carrouselSection = document.querySelectorAll(".carrousel-section");
        let carrouselSectionLast = carrouselSection[carrouselSection.length -1];
        carrousel.style.marginLeft = "100%";
        carrousel.style.transition = "all 0.7s";
        setTimeout(function(){
            carrousel.style.transition = "none";
            carrousel.insertAdjacentElement("afterbegin",carrouselSectionLast);
            carrousel.style.marginLeft = "0";
        },700)
    }
    btnRight.addEventListener('click', function(){Next();})
    btnLeft.addEventListener('click', function(){Prev();})
  }  
}

let finishBuy = document.getElementById('finish-buy');
let orderShipping = document.getElementById('order-shipping');
let keepBuying = document.getElementById('keep-buying');
function showOrderShipping(){
  let cartProducts = JSON.parse(localStorage.getItem('cartProducts')) || [];
  if (cartProducts.length===0){
    return;
  }
  let tableDetail = document.getElementById('table-detail');
  let fieldName = document.getElementById('field-name');
  
  let completeBuy = document.getElementById('complete-buy');
  
  step1.classList.remove('step-active');
  step2.classList.add('step-active');
  tableDetail.style.display='none';
  fieldName.style.display='none';
  orderShipping.style.display='flex';
  completeBuy.style.display='none';
  keepBuying.style.display='none';
  finishBuy.style.display='block';
  finishBuy.addEventListener("click", CompleteShippingData);
  // finishBuy.style.pointerEvents = "none";

}


const formInputs = document.querySelectorAll('.shipping-container input');

function CompleteShippingData(){
  let shippingFormOk = true;

  //VALIDACIONES de los DATOS DE ENVÍO*********************************
  
  const wayPay = document.getElementById('way-to-pay');

// Función para verificar si todos los campos están completados
  
  formInputs.forEach(input => {
    if (input.value == '') {
      shippingFormOk = false;
    }
    });
  if(shippingFormOk==true){
    step2.classList.remove('step-active');
    step3.classList.add('step-active');
    
    formInputs.forEach(input => {
      input.disabled= true;
      });  
    wayPay.style.display = "block";
    finishBuy.innerHTML = "FINALIZAR COMPRA";
    finishBuy.removeEventListener("click", CompleteShippingData);
    // finishBuy.style.pointerEvents = "none";
    
  }else{
    alert("Por favor rellena los campos de envío para continuar");
    return
  }
}

//VALIDACIONES de los RADIO-BUTTONS en el grupo*********************
let radioButtons = document.querySelectorAll('input[type="radio"][name="opcion"]');
let paymentInfo = document.getElementById('payment-info');
let payWay = false
// Agregar un evento change a cada radio button
radioButtons.forEach(function(radioButton) {
  radioButton.addEventListener('change', function() {
      // Verificar cuál está seleccionado
      if (this.checked) {
        payWay = true;
        console.log('Seleccionado: ' + this.value);
        if (this.value === 'Transferencia') {
          
          //limpiamos los posibles eventos antes de agregar uno
          finishBuy.removeEventListener("click", pay);
          finishBuy.removeEventListener("click", payByTransfer);

          finishBuy.innerHTML = "REALIZAR ORDEN DE COMPRA";
          //agregamos el evento de pagar por transferencia
          finishBuy.addEventListener("click", payByTransfer);
          

        }else{
          //limpiamos los posibles eventos antes de agregar uno
          finishBuy.removeEventListener("click", pay);
          finishBuy.removeEventListener("click", payByTransfer);
          //agregamos el evento de pagar por Mercado Pago
          finishBuy.addEventListener("click", pay);
        }
      }
  });
});


async function payByTransfer(){
  
  let cartProducts = JSON.parse(localStorage.getItem('cartProducts')) || [];
  //traigo los datos de envío para completar la orden de compra
  let shipping = {
    name:document.getElementById('name').value,
    lastName:document.getElementById('lastName').value,
    dni:document.getElementById('dni').value,
    phone:document.getElementById('phone').value,
    email:document.getElementById('email').value,
    adress:document.getElementById('adress').value,
    country:document.getElementById('country').value,
    province:document.getElementById('province').value,
    city:document.getElementById('city').value,
    postalCode:document.getElementById('postalCode').value
  };
  console.log("TRANSFERENCIA carrito:"+cartProducts+" Datos Envio"+shipping);
  
  try{
    const cartProductsList = await(await fetch("/api/payByTransfer",{
      method:"post",
      body: JSON.stringify({cartProducts,shipping}),//envío la orden de compra al backend
      headers:{
        "Content-Type":"application/json"
      }
    }));

    const responseData = await cartProductsList.json();

    if (responseData.success) {
      
      let nOrder = responseData.orderNumber
      // document.querySelector("#actions-buttons").appendChild(script);
      
      clearCart(); // Limpia el carrito después de una compra exitosa
      console.log("La compra fue realizada con exito!"); 
      document.getElementById('name').disabled = true;
      document.getElementById('lastName').disabled = true;
      document.getElementById('dni').disabled = true;
      document.getElementById('phone').disabled = true;
      document.getElementById('email').disabled = true;
      document.getElementById('adress').disabled = true;
      document.getElementById('country').disabled = true;
      document.getElementById('province').disabled = true;      
      document.getElementById('city').disabled = true;
      document.getElementById('postalCode').disabled = true;
      finishBuy.style.display='none';
      keepBuying.style.display='block';
      orderShipping.innerHTML = "";//vaciamos el contendedor
      orderShipping.innerHTML =
      `
      <div id="payment-info">
        <h1>Tu Orden es la Numero: ${nOrder}</h1>
        <section>
          <img class="sand-timer" src="../assets/sand-timer.png" alt="El Tiempo Corre">
          <h2>En Espera de Pago!</h2>
        </section> 
        <div>Una vez realizada la transferencia bancaria debes enviar el comprobante a los whatsapp que figuran en la página y recién ahí se procede a dar curso a la compra.</div>
        <br>
        <div class="important-mes">Importante! Realizar lo antes posible la transferencia ya que solo al recibir el comprobante se dara reserva del Producto, si demora demasiado podría quedar sin stock y se le devolverá la totalidad del pago</div>
        <div class="bancary-data">Datos Bancarios:</div>
        <div>Alias: lalalala</div>
        <div>CBU: 0012123121541</div>
        <div>Titular: Lucas Mauricio Yañez Bogni</div>
        <div>Whatsapp: 2644651005</div>
      </div>`;
      paymentInfo.style.display = "block";
      alert("Tu numero de Orden es la: "+nOrder+" recuerda enviar comprobante a este numero:2644651005");
    } else if (cartProductsList.status == 400 || cartProductsList.status==500) {
      // Mostrar el mensaje de "producto no disponible" en la interfaz de usuario
      clearCart(); // Limpia el carrito después de una compra sin exito
      console.error("Algunos productos no están disponibles");
      alert("Algunos productos no están disponibles. Por favor, revisa tu carrito.");
    } else {
      // Mostrar otro mensaje de error en la interfaz de usuario
      console.error("Error al procesar la compra");
    }
  } catch (error) {
    console.error("Error en la solicitud:", error);
  }

}

async function pay(){
  //activo los input para poder leerlos
  formInputs.forEach(input => {
    input.disabled= false;
    });  
  //traigo los productos que agregué al carrito
  let cartProducts = JSON.parse(localStorage.getItem('cartProducts')) || [];
  //traigo los datos de envío para completar la orden de compra
  let shipping = {
    name:document.getElementById('name').value,
    lastName:document.getElementById('lastName').value,
    dni:document.getElementById('dni').value,
    phone:document.getElementById('phone').value,
    email:document.getElementById('email').value,
    adress:document.getElementById('adress').value,
    country:document.getElementById('country').value,
    province:document.getElementById('province').value,
    city:document.getElementById('city').value,
    postalCode:document.getElementById('postalCode').value
  };
  console.log("MERCADO PAGO carrito:"+cartProducts+" Datos Envio"+shipping);

  try{
    const cartProductsList = await(await fetch("/api/pay",{
      method:"post",
      body: JSON.stringify({cartProducts,shipping}),//envío la orden de compra al backend
      headers:{
        "Content-Type":"application/json"
      }
    }));

    const responseData = await cartProductsList.json();

    if (responseData.success) {
      
      var script = document.createElement("script");

      script.src = "https://www.mercadopago.com.ar/integrations/v1/web-payment-checkout.js";
      script.type = "text/javascript";
      script.dataset.preferenceId = responseData.preferenceId
      // document.getElementById("page-content").innerHTML = "";
      // script.setAttribute("data-button-label","PAGAR CON MERCADO PAGO")
      document.querySelector("#actions-buttons").appendChild(script);
      
      clearCart(); // Limpia el carrito después de una compra exitosa
      console.log("La compra fue realizada con exito!"); 
      document.getElementById('name').disabled = true;
      document.getElementById('lastName').disabled = true;
      document.getElementById('dni').disabled = true;
      document.getElementById('phone').disabled = true;
      document.getElementById('email').disabled = true;
      document.getElementById('adress').disabled = true;
      document.getElementById('country').disabled = true;
      document.getElementById('province').disabled = true;      
      document.getElementById('city').disabled = true;
      document.getElementById('postalCode').disabled = true;
   
    } else if (cartProductsList.status == 400 || cartProductsList.status==500) {
      // Mostrar el mensaje de "producto no disponible" en la interfaz de usuario
      clearCart(); // Limpia el carrito después de una compra sin exito
      console.error("Algunos productos no están disponibles");
      alert("Algunos productos no están disponibles. Por favor, revisa tu carrito.");
    } else {
      // Mostrar otro mensaje de error en la interfaz de usuario
      console.error("Error al procesar la compra");
    }
  } catch (error) {
    console.error("Error en la solicitud:", error);
  }
}


//****FUNCION PARA AGREGAR LOS PRODUCTOS AL CARRITO y local storage */
function addCartProduct(product,talle,cant){
  // Obtener la lista de productos del localStorage o inicializarla si es la primera vez
  let cartProducts = JSON.parse(localStorage.getItem('cartProducts')) || [];


  let found = false; // Variable para rastrear si se encontró el producto en el carrito

  cartProducts.forEach((cartItem) => {

    if (product.id==cartItem.product.id && talle==cartItem.talle){
      const count = product.talles[talle];
      if((parseInt(cartItem.cant) + parseInt(cant))>count){
        cartItem.cant = product.talles[talle];
      }
      else{
        console.log("entro a sumarle " + cant + " al talle" + talle);
        cartItem.cant = parseInt(cartItem.cant) + parseInt(cant);
      }
      found = true;// Marcamos que se encontró el producto
    }
  });

  if (!found) {
    cartProducts.push({ product, talle, cant });// Agregar el nuevo producto a la lista
    console.log(cartProducts);
    console.log("agregaste " + cant + " zapatos "+ product.name+" talle " + talle +" debes "+product.price*cant)
  }
  
  
  // Guardar la lista de productos en el localStorage
  localStorage.setItem('cartProducts', JSON.stringify(cartProducts));
  

}

function updateCartDisplay(cartProducts) {
  let productsHTML='';
  let subtotal=0;
  cartProducts.forEach((cartItem) => {
     // sumamos y calculamos cuantos productos hay en el carrito
    console.log("suma"+cartItem.product.price*cartItem.cant)
    subtotal+=cartItem.product.price*cartItem.cant;
    // Construir el HTML para cada producto en el carrito
    productsHTML +=
    `<div id="order-detail" class="order-detail">
    <article class="products">
        <div class="names-field">PRODUCTOS</div>
        <img class="prod-img" src="../${cartItem.product.image}" alt="img-product">
        <div class="name">${cartItem.product.name} - ${cartItem.talle}</div>
    </article>
    <div class="products num">
        <div class="names-field">PRECIO</div>
        <div class="regular-price">$${cartItem.product.price*cartItem.cant}</div>
    </div>
    <div class="products">
        <div class="names-field">CANTIDAD</div>
        <section class="select-amount">
            <div class="amount-selection">
                <input class="amount-input" type="number" min="1" max="10" value="${cartItem.cant}" readonly>
                <div class="plus-less">                    
                    <div class="up"><i class="fas fa-angle-up"></i></div>
                    <div class="down"><i class="fas fa-angle-down"></i></div>
                </div>
            </div>
        </section>
    </div class="products">
    <div class="products num">
        <div class="names-field">SUBTOTAL</div>
        <div class="discount-price">$${cartItem.product.price*cartItem.cant}</div>
    </div>
    <div class="products">
        <div class="names-field">ELIMINAR</div>
        <div class="delete-item" onclick="removeProductByTypeAndSize(${cartItem.product.id}, ${cartItem.talle})">
            <img src="../assets/trash.svg" alt="trash">
        </div>
    </div>
    </div>`;
  });

    // Mostrar el contenido en el elemento 'table-detail'
  document.getElementById('table-detail').innerHTML= productsHTML;
  //si hay productos en el carrito modificamos los valores de subtotal, envío y total del carrito
  if (cartProducts!=[]){
    document.getElementById('subtotal-price').innerText = `$${subtotal}`;
    document.getElementById('send-price').innerText = `$${2500}`;
    document.getElementById('total-price').innerText = `$${subtotal+2500}`;
  }
}


// Llamar a esta función al cargar la página para mostrar los productos previamente guardados en el localStorage
function loadCartFromLocalStorage() {
  const cartProducts = JSON.parse(localStorage.getItem('cartProducts')) || [];
  updateCartDisplay(cartProducts);
}
// Llamar a esta función para borrar los productos del carrito y del localStorage
function clearCart() {
  localStorage.removeItem('cartProducts');
  updateCartDisplay([]);
}
function removeProductByTypeAndSize(productId, talle) {
  // Obtener los productos del carrito del localStorage
  let cartProducts = JSON.parse(localStorage.getItem('cartProducts')) || [];

  // Filtrar los productos que no coinciden con el tipo y la talla a eliminar
  cartProducts = cartProducts.filter((cartItem) => {
    return !(cartItem.product.id == productId && cartItem.talle == talle);
  });

  // Actualizar el localStorage con la lista de productos modificada
  localStorage.setItem('cartProducts', JSON.stringify(cartProducts));
  updateCartDisplay(cartProducts);
}


