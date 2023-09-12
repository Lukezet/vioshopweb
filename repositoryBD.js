const {google} = require('googleapis');

const auth = new google.auth.GoogleAuth({
  keyFile: 'your-secret-key.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({version: 'v4', auth:auth});

async function read(){
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: '1WXUT0gThQMj2T0iIL0cZkLPT3QkQ0RLpyXBw7jhPfwc',
      range: 'Products!A2:R',
    });

    const rows = res.data.values;
    const productsBD = rows.map((row)=>({
      id:+row[0],
      name:row[1],
      category:row[2],
      price:+row[3],
      color:row[4],
      description:row[5],
      material:row[6],
      suela:row[7],
      talles:{
          '35':parseInt(row[8]),
          '36':parseInt(row[9]),
          '37':parseInt(row[10]),
          '38':parseInt(row[11]),
          '39':parseInt(row[12]),
          '40':parseInt(row[13]),
          '41':parseInt(row[14])
          },
      image:row[15],
      image2:row[16],
      image3:row[17]
    }));
    // console.log(productsBD)
    return productsBD
}

async function write(productsBD){

    let values = productsBD.map(p=>[p.id,p.name,p.category,p.price,p.color,p.description,p.material,p.suela,p.talles['35'],p.talles['36'],p.talles['37'],p.talles['38'],p.talles['39'],p.talles['40'],p.talles['41'],p.image,p.image2,p.image3])

    const resource = {
      values,
    };

      const result = await sheets.spreadsheets.values.update({
        spreadsheetId:'1WXUT0gThQMj2T0iIL0cZkLPT3QkQ0RLpyXBw7jhPfwc',
        range: 'Products!A2:R',
        valueInputOption:"RAW",
        resource,
      });
    // console.log(result)
}

async function writeOrders(orders){

  let values = orders.map(order=>[
    order.idOrder,
    order.date,
    order.preferenceId,
    order.shipping.name,
    order.shipping.email,
    JSON.stringify(order.cartProducts),
    JSON.stringify(order.shipping),
    order.status
    ]);

  const resource = {
    values,
  };

    const result = await sheets.spreadsheets.values.update({
      spreadsheetId:'1WXUT0gThQMj2T0iIL0cZkLPT3QkQ0RLpyXBw7jhPfwc',
      range: 'Order!A2:H',
      valueInputOption:"RAW",
      resource,
    });
  // console.log(result)
}

async function readOrders(){
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: '1WXUT0gThQMj2T0iIL0cZkLPT3QkQ0RLpyXBw7jhPfwc',
    range: 'Order!A2:H',
  });

  const rows = res.data.values;
  const orders = rows.map((row)=>({
    idOrder:+row[0],
    date:+row[1],
    preferenceId:row[2],
    name:row[3],
    email:+row[4],
    items:JSON.parse(row[5]),
    shipping:JSON.parse(row[6]),
    status:row[7],
  }));
  // console.log(productsBD)
  return orders
}

async function updateOrderByPreferenceId(preferenceId,status){
  const orders = await readOrders();//leo las ordenes
  const order = orders.find(o => o.preferenceId === preferenceId);//encuentro la que tiene el mismo preferenceId
  order.status = status;//modifico el estado de la orden
  await writeOrders(orders)
}





// async function readAndWrite(){
//   const products = await read();
//   products[0].talles['37'] = 3;
//   await write (products);
// };
// readAndWrite()

module.exports = {
  read,
  write,
  writeOrders,
  readOrders,
  updateOrderByPreferenceId
};