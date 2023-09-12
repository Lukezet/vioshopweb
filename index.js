//instalar express
const express = require('express');
//npm install body-parser
const bodyParser = require('body-parser');
const repositoryBD = require("./repositoryBD");
const mercadopago = require('mercadopago');

const app = express()
const port = process.env.PORT || 3000;

// Agrega credenciales
mercadopago.configure({
    access_token: "TEST-6776340959378865-082720-af7c8aaf1e4f5d022b98cb08264a72a9-447474392",
  });

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


app.get('/api/products', async (req, res) => {
  res.send(await repositoryBD.read());
});

app.post('/api/pay', async (req, res) => {
    const order = req.body;
    const productsCopy = await repositoryBD.read();
    const unavailableProducts = [];

    let preference = {
        items: [],
        back_urls: {
			"success": "http://localhost:3000/feedback",
			"failure": "http://localhost:3000/feedback",
			"pending": "http://localhost:3000/feedback"
		},
		auto_return: "approved",
      };

    order.cartProducts.forEach(item => {
        const product = productsCopy.find(p => p.id == item.product.id);// Buscar el producto por ID
        let cantReal = 0
        if (product) {
            cantReal = product.talles[item.talle];
            
            if (cantReal !== undefined && cantReal > 0) {
                
                console.log("cantidad real:"+cantReal+ "cantidad enviada"+ item.cant);
                if(cantReal<item.cant){//verificamos si es factible comprar la cantidad que agregamos y si hay menos enviamos lo que queda de stock en ese talle
                    product.talles[item.talle]-=cantReal;
                    preference.items.push({
                        title: product.name,
                        unit_price: product.price,
                        quantity: parseInt(cantReal),
                    });
                }else{
                    product.talles[item.talle]-=item.cant;
                    preference.items.push({
                        title: product.name,
                        unit_price: product.price,
                        quantity: parseInt(item.cant),
                    });
                }
                
             }else{
                unavailableProducts.push(product.name); // Agregar productos no disponibles a la lista
                console.log("producto no disponible");
            }
        }
    });
    // products = productsCopy;
    // res.send(products);

    if (unavailableProducts.length === 0) {
        const response = await mercadopago.preferences.create(preference)
        const preferenceId = response.body.id;

        await repositoryBD.write(productsCopy);//descontamos del stock
        order.date = new Date().toISOString();
        order.preferenceId = preferenceId;
        order.status = "pending";
        const orders = await repositoryBD.readOrders();//traemos y leemos todas las ordenes que hay en sheet
        order.idOrder = orders[orders.length-1].idOrder + 1;//agregamos el numero de orden(idOrder)
        orders.push(order);//agregamos los datos a la nueva orden
        await repositoryBD.writeOrders(orders);//generamos la orden de compra

        res.status(200).json({ success: true, preferenceId });
    } else {
        res.status(400).json({ message: 'Algunos productos no están disponibles', unavailableProducts });
    }
});



app.post('/api/payByTransfer', async (req, res) => {
    const order = req.body;
    const productsCopy = await repositoryBD.read();
    const unavailableProducts = [];

    order.cartProducts.forEach(item => {
        const product = productsCopy.find(p => p.id == item.product.id);// Buscar el producto por ID
        let cantReal = 0
        if (product) {
            cantReal = product.talles[item.talle];

            if (cantReal !== undefined && cantReal > 0) {
                console.log("disponible");
             }else{
                unavailableProducts.push(product.name); // Agregar productos no disponibles a la lista
                console.log("producto no disponible");
            }
        }
    });
    // products = productsCopy;
    // res.send(products);

    if (unavailableProducts.length === 0) {

        await repositoryBD.write(productsCopy);//descontamos del stock
        order.date = new Date().toISOString();
        order.preferenceId = "TRANSFERENCIA";
        order.status = "pending";
        const orders = await repositoryBD.readOrders();//traemos y leemos todas las ordenes que hay en sheet
        order.idOrder = orders[orders.length-1].idOrder + 1;//agregamos el numero de orden(idOrder)
        let orderNumber = order.idOrder; 
        orders.push(order);//agregamos los datos a la nueva orden
        await repositoryBD.writeOrders(orders);//generamos la orden de compra

        res.status(200).json({ success: true, orderNumber });
    } else {
        res.status(400).json({ message: 'Algunos productos no están disponibles', unavailableProducts });
    }
});



app.get('/feedback', async (req, res) => {
	const payment = await mercadopago.payment.findById(req.query.payment_id);
    const merchantOrder = await mercadopago.merchant_orders.findById(payment.body.order.id);
    const preferenceId = merchantOrder.body.preference_id;
    const status = payment.body.status;
    await repositoryBD.updateOrderByPreferenceId(preferenceId,status);

    res.sendFile(require.resolve("./frontend/index.html"))
});

app.use("/",express.static("frontend"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})