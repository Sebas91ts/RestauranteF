import  instancia  from "../axios.js";

export const consultarBitacora = async () => instancia.get('/admin/bitacora')