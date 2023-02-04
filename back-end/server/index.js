//Para lenvantar el sewrvidor desde la carpeta raiz usar node back-end/server/index,js
const express = require("express");
const Stripe = require("stripe");
const stripe = new Stripe("sk_test_51MX4qMBK4uk3P92pqeN1rclFiih2e74rjuNYHSE4zlNGCFrfvU8nRuaL3QXPdY0jmE8kTABBvQqvgiEJtlbRmfho00nIdhzwQy"); /*Esta clave deberia estar en un .env*/

const cors = require("cors");

const app = express();


app.use(cors({ origin: "*" }));
app.use(express.json());

app.post("/checkout", async (req, res) => {
  //console.log(req.body);
  const { id, amount } = req.body;
  
  try {
    const payment =  await stripe.paymentIntents.create({
      amount,
      currency: "USD",
      description: "informacion debe venir de la base de datos",
      payment_method: id, //viene del front
      confirm: true,
    });
      
    console.log(payment);
    return res.status(200).json({message: "Succesfull payment"});
  } catch (error) {
    console.log(error);
    return res.json({ message: error.raw.message });
  }
});

app.listen(3001, () => {
  console.log("Server on port ", 3001);
});

/*
1.- crear el backend, una carpeta llamada server, dentro de esta crear un idex.js
2.- instalar dependencias
3.- crear la ruta post para revisarq eu dato envia el fron en la ruta checkout
4.- primero traemos de express el metodo json para que el backend pueda entender todo los objetos json que se mandan desde el front, esto lo implementamos con app.use()
5.- importante, tambien se debe usar el modulo cors ya que nos arrojaria error y a este modulo, le debemos colocar un origen que puede ser http://localhost:3000 o un asterizco para que pueda recibir de cualquier url
6.- hasta este momento (punto 6 del backend y punto 19 del front solo esta procesando el pago, aun no ha sido comprado, para comprarlo debemos confirmar)
7.- para confirmar debemos usar la llave privada que nos da stripe
8.- Iicializar stripe en el fron y colocar la lavve privada pero es mejor hacerla desde una variable de entporno
*/
