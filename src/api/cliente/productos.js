import instancia from "../axios"

export const obtenerProductos = (tipo = null)=> {
  const url = tipo ? `/productos/mostrar?tipo=${tipo}` : '/productos/mostrar';
  return instancia.get(url);
}

export const obtenerPedidoPorId = (id) => {
  return instancia.get(`/pedido/cliente/${id}`);
}

export const crearProducto = (producto) => {
  return instancia.post('/productos/crear', producto);
}

export const registrarPedidoRequest = async (idUsuario, data) => {
  return instancia.post(`/pedido/registrar/${idUsuario}`, data);
};