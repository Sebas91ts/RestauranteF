import instancia from  "../axios"

export const crearMetodoPago = async (input) => instancia.post('/metodoPago/crear', input)