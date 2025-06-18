import instancia from './axios.js'

export const registrarPedidoDomicilio = async (idCliente, descuento, productos) => {
  try {
    const response = await instancia.post(`/pedido/registrarPedidoDomicilio/${idCliente}`, {
      descuento,
      productos
    })
    return response.data
  } catch (error) {
    console.error('Error al registrar pedido a domicilio:', error)
    throw error
  }
}
