

import { MetodoPago } from '../../components/MetodoPago/MetodoPago';
import { useCart } from '../../context/CartContext';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

// import stripePromise from 'stripe';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/stripe';
import { useAuth } from '@/context/AuthContext';
import { registrarPedidoDomicilio } from '@/api/pedido';

export default function CheckoutPage() {
  const { cart, total, limpiarCarrito } = useCart();
  const { user } = useAuth();

  const handlePaymentSuccess = async () => {
    try {
      const producto = cart.map(item => ({
        id: item.id,
        precio: item.precio,
        cantidad: item.quantity,
        exclusiones: []
      }))
      console.log(user.user.id)
      console.log(producto)
      await registrarPedidoDomicilio(user.user.id, "D", producto);
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      toast.error('Error al procesar el pago. Inténtalo de nuevo más tarde.');
      return;

    }
    toast.success('Pago realizado con éxito');
    limpiarCarrito();
    // Redirigir a una página de confirmación o éxito
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-center" richColors toastOptions={{ className: 'animate-pulse' }} />
      <h1 className="text-2xl font-bold mb-6">Confirmar Compra</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Resumen del pedido */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            Resumen de tu pedido
          </h2>
          <ul className="divide-y">
            {cart.map((item) => (
              <li key={item.id} className="py-4 flex justify-between">
                <div>
                  <h3 className="font-semibold">{item.nombre}</h3>
                  <p className="text-gray-600">
                    Cantidad: {item.quantity}
                  </p>
                </div>
                <span className="font-semibold">
                  ${(item.precio * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
          <div className="border-t pt-4 mt-4">
            <p className="flex justify-between font-semibold text-lg">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </p>
          </div>
        </div>

        {/* Selección de método de pago */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            Método de pago
          </h2>
          <Elements stripe={stripePromise}>
            <MetodoPago onSuccess={handlePaymentSuccess} productos={cart} />
          </Elements>
        </div>
      </div>
    </div>
  );
}
