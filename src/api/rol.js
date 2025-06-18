import axios from './axios.js'

export const getRolesRequest = async () => axios.get('/roles/permisos')

export const getPermisosRequest = async () => axios.get('/permisos/mostrar')

export const editRolRequest = async (rol) => axios.put('/roles/editar', rol)

export const createRolRequest = async (rol) => axios.post('/roles/crear', rol)