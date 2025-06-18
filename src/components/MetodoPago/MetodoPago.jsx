import { useState } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { crearMetodoPago } from '@/api/metodoPago/metodoPago';
import { CardElement } from '@stripe/react-stripe-js';

export function MetodoPago({ onSuccess, productos }) {
  const [selectedMethod, setSelectedMethod] = useState('tarjeta');
  const [errorMessage, setErrorMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const opciones = {
    timeZone: 'America/La_Paz',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false // Formato 24 horas
  };

  const fechaBoliviana = new Date().toLocaleString('es-BO', opciones);
  console.log(fechaBoliviana.split(',')[0]); // Muestra la fecha en formato dd/mm/yyyy
  console.log(fechaBoliviana.split(',')[1]); // Muestra la hora en formato hh:mm:ss

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      console.log('Creando método de pago con productos:', productos);

      // 1. Obtener el clientSecret del backend
      const { data } = await crearMetodoPago(productos);

      if (!data.clientSecret) {
        throw new Error('No se recibió clientSecret del servidor');
      }

      // 2. Confirmar el pago con CardElement
      const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: 'Nombre del cliente',
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
        console.error('Error en el pago:', error);
      } else if (paymentIntent.status === 'succeeded') {
        onSuccess();
      }
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      setErrorMessage(error.message || 'Error al procesar el pago');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="radio"
            id="credit-card"
            name="payment"
            value="tarjeta"
            checked={selectedMethod === 'tarjeta'}
            onChange={() => setSelectedMethod('tarjeta')}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="credit-card" className="ml-3 block text-sm font-medium text-gray-700">
            Tarjeta de crédito/débito
          </label>
        </div>

        <CardElement options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }} />

        {errorMessage && (
          <div className="text-red-500 text-sm">{errorMessage}</div>
        )}

        <button
          disabled={!stripe || isProcessing}
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Procesando...' : 'Confirmar Pago'}
        </button>
      </div>
    </form>
  );
}