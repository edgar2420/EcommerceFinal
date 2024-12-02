import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../contexts/UserContext";
import { loadStripe } from "@stripe/stripe-js"; // Importar loadStripe
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"; // Importar Elements, CardElement, useStripe y useElements
import { Modal, Button } from 'react-bootstrap';
import { ApiService } from '../service/ApiService';  // Asegúrate de importar ApiService

// Cargar Stripe (esto se hace una sola vez al principio)
const stripePromise = loadStripe("pk_test_51QPwM0Fp0qyW5wdu6Qe02ET4IlEbjdFL2R6OEuXevrmmrwOJsDGckMl0ZFAIewxEhlzNbidRGoCVoAVbLVOEEynC0027A09dXv");

export default function App() {
  return (
    // Envolvemos el componente Carrito con <Elements>
    <Elements stripe={stripePromise}>
      <Carrito />
    </Elements>
  );
}

function Carrito() {
  const { cart, updateCartItem, removeCartItem, user } = useUser(); // Obtén el objeto user de contexto
  const stripe = useStripe(); // Usamos el hook de Stripe
  const elements = useElements(); // Usamos el hook de Elements
  const [pedidoCreado, setPedidoCreado] = useState(false); // Controla si el pedido ya está creado
  const [paymentIntentId, setPaymentIntentId] = useState(null); // Almacena el ID del pago si ya se ha realizado
  const [showModal, setShowModal] = useState(false); // Estado para manejar el modal

  // Calcular el monto total en centavos (para Stripe)
  const calcularTotal = () => {
    return cart.reduce((total, item) => total + item.precio * item.quantity, 0) * 100; // Multiplicamos por 100 para tener el monto en centavos
  };

  const handleIncrement = (productId) => {
    const product = cart.find((item) => item.id === productId);
    if (product) {
      updateCartItem(productId, product.quantity + 1);
    }
  };

  const handleDecrement = (productId) => {
    const product = cart.find((item) => item.id === productId);
    if (product && product.quantity > 1) {
      updateCartItem(productId, product.quantity - 1);
    }
  };

  // Función que maneja la creación del pedido
  const handlePedir = async () => {
    if (!user || !user.id) {
      alert("El usuario no está autenticado.");
      return;
    }
  
    const totalAmount = calcularTotal(); // Obtén el monto total en centavos
  
    try {
      // Primero, crea el pedido en el backend
      const response = await fetch("https://backendecommerce-dy3z.onrender.com/api/pedidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuarioId: user.id, // Obtén el userId del contexto
          productos: cart.map((item) => ({
            productoId: item.id,
            cantidad: item.quantity,
            precio: item.precio,
          })),
          totalAmount: totalAmount / 100, // El total en Bs (en lugar de centavos)
          estado: "Pendiente", // El estado inicial del pedido
        }),
      });
  
      const pedidoData = await response.json();
  
      if (!pedidoData.pedido || !pedidoData.pedido.id) {
        alert("Error al generar el pedido. Intenta de nuevo.");
        return;
      }
  
      // Solicitar la creación del PaymentIntent
      const paymentResponse = await fetch("https://backendecommerce-dy3z.onrender.com/api/pagos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pedidoId: pedidoData.pedido.id, // ID del pedido
          totalAmount, // Total en centavos
        }),
      });
  
      const paymentData = await paymentResponse.json();
  
      if (!paymentData.clientSecret) {
        alert("Error al generar el pago. Intenta de nuevo.");
        return;
      }
  
      // Guardamos el paymentIntentId para usarlo después en la confirmación
      setPaymentIntentId(pedidoData.pedido.id);
      setShowModal(true);
  
    } catch (error) {
      console.error("Error al crear el pedido:", error);
      alert("Hubo un error al procesar el pedido.");
    }
  };
  

  // Función que maneja el pago con Stripe
  const handlePago = async () => {
    if (!paymentIntentId) {
      alert("No se ha creado un pedido aún.");
      return;
    }
  
    const totalAmount = calcularTotal(); // Aquí es el monto en la moneda local, no en centavos
  
    try {
      const paymentResponse = await fetch("https://backendecommerce-dy3z.onrender.com/api/pagos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pedidoId: paymentIntentId, // ID del pedido
          metodoPago: "Stripe", // Asegúrate de que esto esté presente
          estado: "Pendiente", // El estado inicial del pago
          totalAmount: totalAmount, // Aquí cambiamos 'amount' a 'totalAmount' para coincidir con el backend
        }),
      });
  
      const paymentData = await paymentResponse.json();
  
      if (!paymentData.clientSecret) {
        alert("Error al generar el pago. Intenta de nuevo.");
        return;
      }
  
      // Confirma el pago con Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(paymentData.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement), // Usamos el CardElement del formulario
        },
      });
  
      if (error) {
        console.error("Error en el pago:", error);
        alert("Hubo un error con tu pago. Intenta nuevamente.");
      } else if (paymentIntent.status === "succeeded") {
        console.log("Pago exitoso:", paymentIntent);
        alert("¡Pago exitoso!");
  
        // Llamar a la API para confirmar el pago en el backend
        try {
          const confirmResponse = await ApiService.confirmarPago(paymentIntent.id, paymentData.clientSecret);
          console.log("Confirmación de pago:", confirmResponse);
          setShowModal(false);
        } catch (error) {
          console.error("Error al confirmar el pago:", error);
          alert("Hubo un error al confirmar tu pago.");
        }
      }
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      alert("Hubo un error al procesar tu pago.");
    }
  };
  

  return (
    <section className="padding-y bg-light">
      <div className="container">
        <h3 className="card-title">{"Carrito de Compras"}</h3>
        <div className="row">
          <div className="col-md-9">
            {cart.map((item) => {
              let productImages = [];
              if (item.imagenUrl) {
                try {
                  productImages = JSON.parse(item.imagenUrl);
                } catch {
                  productImages = [item.imagenUrl];
                }
              }
              const productImage =
                productImages.length > 0
                  ? `https://backendecommerce-dy3z.onrender.com${productImages[0]}`
                  : "/images/product.jpg";

              return (
                <article className="card card-body mb-3" key={item.id}>
                  <div className="row gy-3 align-items-center">
                    <div className="col-md-6">
                      <a href="#" className="itemside align-items-center">
                        <div className="aside">
                          <img
                            src={productImage}
                            height="72"
                            width="72"
                            className="img-thumbnail img-sm"
                            alt={item.nombre}
                          />
                        </div>
                        <div className="info">
                          <p className="title">{item.nombre}</p>
                        </div>
                      </a>
                    </div>
                    <div className="col-auto">
                      <div className="input-group input-spinner">
                        <button
                          className="btn btn-light"
                          type="button"
                          onClick={() => handleDecrement(item.id)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="#999"
                            viewBox="0 0 24 24"
                          >
                            <path d="M19 13H5v-2h14v2z"></path>
                          </svg>
                        </button>
                        <input
                          type="text"
                          className="form-control"
                          value={item.quantity}
                          readOnly
                        />
                        <button
                          className="btn btn-light"
                          type="button"
                          onClick={() => handleIncrement(item.id)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="#999"
                            viewBox="0 0 24 24"
                          >
                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="col">
                      <strong className="price">{item.precio} Bs</strong>
                    </div>
                    <div className="col text-end">
                      <button
                        className="btn btn-icon btn-light"
                        onClick={() => removeCartItem(item.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <aside className="col-md-3">
            <div className="card">
              <div className="card-body">
                <dl className="dlist-align">
                  <dt>Precio total:</dt>
                  <dd className="text-end">
                    {calcularTotal() / 100} Bs {/* Muestra el total en Bs */}
                  </dd>
                </dl>
                <hr />
                <p className="text-center mt-3">
                  <img src="/images/payments.png" height="24" alt="Pagos" />
                </p>
                <button
                  onClick={handlePedir}
                  className="btn btn-primary mb-2 w-100"
                >
                  Pedir
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>¡Pedido Creado!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Tu pedido ha sido creado exitosamente. ¿Quieres proceder al pago?</p>
          <div className="mb-3">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    letterSpacing: '0.025em',
                    backgroundColor: '#fff',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                  },
                },
              }}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handlePago}>
            Pagar
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
}
