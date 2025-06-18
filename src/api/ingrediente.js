import instancia from "./axios";

export const crearIngrediente = async (input) => { instancia.post("/ingredientes/crear", input)}

export const eliminarIngrediente = async (id) => {
  return instancia.delete(`/ingredientes/eliminar/${id}`)
}

export const mostrarIngredientes = async () => instancia.get("/ingredientes/mostrar")