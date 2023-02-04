import React, { useState } from "react";
import "bootswatch/dist/lux/bootstrap.min.css";
import "./App.css";

import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import axios from "axios";

const stripePromise = loadStripe(
  "pk_test_51MX4qMBK4uk3P92pghuDWvPUsjrFJp5n7yOmo2eXDOg9sGSdUFBVzrBJvOZEyRGcxM7fjGMb8jjZkZgCCSLKFLwM00wrmcWJlg"
);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });
    setLoading(true);

    if (!error) {
      //console.log(paymentMethod);
      const { id } = paymentMethod;
      try {
        const { data } /*<-- aca podemos traer el objeto respónse, tener en cuenta esto por si necesitamos mas datos*/ = await axios.post('http://localhost:3001/checkout', {
          id,
          amount: 5*100 //se multipilca para llevarlo a centimos, no se por que? no lo entendi
        })
        console.log(data); //necesitamos ver este data que es enviada al backend, para esto debemos crear alla esa ruta
  
        elements.getElement(CardElement).clear();
      } catch (error) {
        console.log(error);
      }

      setLoading(false);
    }
  };

  console.log(!stripe || loading);

  return (
    <form className="card card-body" onSubmit={handleSubmit}>
      <img
        src="https://www.ceupe.cl/images/easyblog_articles/384/b2ap3_thumbnail_R-12.jpg"
        alt="Imagen"
        className="img-fluid"
      />

      <h3 className="text-center my-2">Price: $5 </h3>

      <div className="form-group">
        <CardElement className="form-control" />
      </div>
      
      <button className="btn btn-success" disabled={!stripe}>
        {loading ? (
          <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        ) : (
          "Buy"
        )}
        </button>
    </form>
  );
};

function App() {
  return (
    <Elements stripe={stripePromise}>
      <div className="container p-4">
        <div className="row h-100">
          <div className="col-md-4 offset-md-4 h-100">
            <CheckoutForm />
          </div>
        </div>
      </div>
    </Elements>
  );
}

export default App;

/*
1.- debemos instalas las dependencias 
npm install --save @stripe/react-stripe-js @stripe/stripe-js
2.- importar loadStripe para poder cargar la aplicacion hacia la plataforma
2.- crear la funcion loadStripe(), la cual va a recibir una llave publica que la conseguimos de la pagina https://stripe.com/es-us
3.- Guardamos loadStripe en una constante que llamaremos stripePromise
4.- Importamos desde @stripe/react-stripe-js , una biblioteca llamada Elements y dentro del retunr del app llamamos a esa biblioteca como un componente, y ese componente va a englobar a otros componentes que puedan tener acceso a stripe
5.- Al componente Elementes le colocamos un atributo llamado stripe, que es el que va a llamas a la funcion stripePromise y dentro del componente colocamos el formulario de pago
6.- El formulario de pago lo podemos colocar dentro de una funcion llamada CheckoutForm y esta funcion en forma de componente lo colocamos dentro de Elements
7.- dentro del form del CheckoutForm se debe colocar un input y stripe tiene un componente llamado CardElement, el cual hace todo tipo de validaciones, dicho imput vien desde la biblioteca @stripe/react-stripe-js
8.- stripe nos facilita un grupo de tarjetas (falsas) para poder hacer validaciones, estas las encontramos en la pagina https://stripe.com/docs/testing
9.- siguiente paso, darle mas logica al formulario, ya que se debe capturar la info del form. 
  9.1- Creamos un evento onSubmit para capturar la info luego que el usuario de enviar, para ell necesitamos un boton
  9.2.- Crear un componente boton para el envio del form, que solo va a acontener por ahora la palabra buy
  9.3.- dentro del evento onSubmit llamamos a la funcion handleSubmit y esta la creamos antes
  9.4.- creamos la funcion handleSubmit y dentro colocamos primero un e.preventDefault para que no se nos recargue la pagina, luego llamamos a stripe para poder enviar un nuevo registro de metodo de pago.
  9.5.- para hacer lo anterior debemos importar un hook que nos da stripe, llamado useStripe, este hook nos ayuda a realizar la coneccion con stripe. 
  9.6.- Antes de la funcion handleSubmit Hacemos uso del hook useStripe y lo capturamos en una constante llamada stripe.
  9.7.- Tambien es bueno usar otro hook de stripe que se llama useElements, y es una funcion que puede acceder a todos los elementos de stripe, lo llamammos y lo guardamos en una constante llamada elements
  9.7.- Ahora dentro del handleSubmit usamos la funcion stripe y ademas un metodo llamado createPaymentMethod() y esto es un objeto que debemos llenar.
    9.7.1.- Primer renglon del objeto es el type, para este caso seria con tarjeta (card)
    9.7.2.- segundo renglon cual elemento vamos a estar subiendo, cual es el elmeento que tiene el numero de tla tarjeta y es el componente CardElement
  9.8.- No olvidar que debemos usar el async 
10.- Instalamos la dependencia de bootswatch y la importamos en la linea antes de la importacion de la App.css para darle estilos al form
11.- Se le coloca estilos a cada elemento del form, al igual que una imagen de prueba
12.- dentro del handlesubmit colocamos un condicional para identificar si existe un error, y podemos retornar un console.log del metodo de pago (paymentMethod), esto con la finalidad de saber que datos nos entrega esta operacion.
13.- luego (en el front) de ingresar la tarjetas y sus datos, en consola podemos observar lo que nos devuelve stripe, entre muchas cosas la informacion de la compra, detalle de facturacion, detalle de la tarjeta con que fue comprada, pero lo importante es el id que nos arroja stripe, este id es de la transaccion 
14.- STRIPE consiste en dos pasos, conseguir el id que se genera cuando se hace la compra y el otro registrar ese id como un pago.
15.- El id anterior se debe enviar al back-end
16.- aca en el front debemos enviar el id al back
17.- Instlamos y requerimos axios
18.- dentro del condicional anterior usamos de manera asincronica el axios y creamos el metodo post y apuntamos a la ruta localhost:3000/api/checkout ( esta ruta la haremos en un momento) y es aca donde enviamos al backend los datos que queremos del metodo, en este caso el id y el amount (que es el total del pago )
19.- podemos crear despues de la imagen un h3 donde aparezca el precio del producto
*/
