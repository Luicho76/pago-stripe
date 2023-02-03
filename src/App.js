import React from "react";
import "bootswatch/dist/lux/bootstrap.min.css";
import "./App.css";

import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  "pk_test_51MX4qMBK4uk3P92pghuDWvPUsjrFJp5n7yOmo2eXDOg9sGSdUFBVzrBJvOZEyRGcxM7fjGMb8jjZkZgCCSLKFLwM00wrmcWJlg"
);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });
    if (!error) {
      console.log(paymentMethod);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card card-body">
      <img
        src="https://www.ceupe.cl/images/easyblog_articles/384/b2ap3_thumbnail_R-12.jpg"
        alt="Imagen"
        className="img-fluid"
      />

      <div className="form-group">
        <CardElement className="form-control" />
      </div>
      <button className="btn-btn-success">buy</button>
    </form>
  );
};

function App() {
  return (
    <Elements stripe={stripePromise}>
      <div className="container p-4">
        <div className="row">
          <div className="col-md-6 offset-md-2">
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

*/
