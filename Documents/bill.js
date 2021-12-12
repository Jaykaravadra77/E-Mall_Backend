module.exports = (order) => {
  let today = new Date();
  console.log(order);
  let str = `
    <!doctype html>
    <html>
       <head>
          <meta charset="utf-8">
          <title>PDF Result Template</title>
          <style>
             .invoice-box {
             max-width: 800px;
             margin: auto;
             padding: 30px;
             border: 1px solid #eee;
             box-shadow: 0 0 10px rgba(0, 0, 0, .15);
             font-size: 16px;
             line-height: 24px;
             font-family: 'Helvetica Neue', 'Helvetica',
             color: #555;
             }
             .margin-top {
             margin-top: 50px;
             }
             .justify-center {
             text-align: center;
             }
             .invoice-box table {
             width: 100%;
             line-height: inherit;
             text-align: left;
             }
             .invoice-box table td {
             padding: 5px;
             vertical-align: top;
             }
             .invoice-box table tr td:nth-child(2) {
             text-align: right;
             }
             .invoice-box table tr.top table td {
             padding-bottom: 20px;
             }
             .invoice-box table tr.top table td.title {
             font-size: 45px;
             line-height: 45px;
             color: #333;
             }
             .invoice-box table tr.information table td {
             padding-bottom: 40px;
             }
             .invoice-box table tr.heading td {
             background: #eee;
             border-bottom: 1px solid #ddd;
             font-weight: bold;
             }
             .invoice-box table tr.details td {
             padding-bottom: 20px;
             }
             .invoice-box table tr.item td {
             border-bottom: 1px solid #eee;
             }
             .invoice-box table tr.item.last td {
             border-bottom: none;
             }
             .invoice-box table tr.total td:nth-child(2) {
             border-top: 2px solid #eee;
             font-weight: bold;
             }
             @media only screen and (max-width: 600px) {
             .invoice-box table tr.top table td {
             width: 100%;
             display: block;
             text-align: center;
             }
             .invoice-box table tr.information table td {
             width: 100%;
             display: block;
             text-align: center;
             }
             }
          </style>
       </head>
       <body>
          <div class="invoice-box">
             <table cellpadding="0" cellspacing="0">
              <h1 style:"margin:auto">E-Mall Bill Receipt</h1>
                <tr class="top">
                   <td colspan="2">
                      <table>
                         <tr>
                            <td class=""><img  src="https://i2.wp.com/cleverlogos.co/wp-content/uploads/2018/05/reciepthound_1.jpg?fit=800%2C600&ssl=1"
                               style="width:100%; max-width:390px; max-height:170px"></td><br/>
                            <span style="font-size:25px">
                               Date: ${`${today.getDate()}. ${
                                 today.getMonth() + 1
                               }. ${today.getFullYear()}.`}
                            </span>
                         </tr>
                      </table>
                   </td>
                </tr>
                 <tr>
                   <td><h2>Name :- ${order.user.name}</h2></td>
                 </tr>
                <tr class="heading">
                <td>Products</td>
                <td>Name</td>
                <td>Price</td>
                <td>Quantity</td>
             </tr>
                `;
  order.products.map((prod, ind) => {
    str += `
                      <tr class="item">
                      <td>product_${ind}</td>
                      <td>${prod.name}</td>
                      <td>${prod.price}</td>
                      <td style="margin-left:15px">${prod.count}</td>
                      </tr>
                      `;
  });

  str += ` <tr>
   <td></td>
   <td style="font-size:20px"><b>Total Amount</b></td>
   <td style="font-size:20px">₹${order.amount}</td>
   </tr>`;

  return str;
};
