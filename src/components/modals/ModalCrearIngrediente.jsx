import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

const ModalCrearIngrediente = ({ isOpen, onClose, onGuardar, Request }) => {
  const [nombre, setNombre] = useState('')
  const [idUnidadMedida, setIdUnidadMedida] = useState('')
  const [idStock, setIdStock] = useState('')
  const [idEstado, setIdEstado] = useState('')

  const handleSubmit = async () => {
    if (!nombre.trim() || !idUnidadMedida || !idStock || !idEstado) {
      alert('Todos los campos son obligatorios')
      return
    }

    try {
      await Request({
        nombre: nombre.trim(),
        idUnidadMedida: parseInt(idUnidadMedida),
        idStock: parseInt(idStock),
        idEstado: parseInt(idEstado)
      })
      onGuardar()
      // Limpiar campos
      setNombre('')
      setIdUnidadMedida('')
      setIdStock('')
      setIdEstado('')
    } catch (err) {
      console.error('Error al crear ingrediente:', err)
      alert('Ocurrió un error al crear el ingrediente')
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Crear Ingrediente</AlertDialogTitle>
        </AlertDialogHeader>

        <div className='space-y-4'>
          <div className='pl-2'>
            <label className='block text-sm font-medium text-gray-900 mb-1'>
              Nombre del ingrediente
            </label>
            <input
              type='text'
              className='block w-full border border-gray-500 rounded-md shadow-sm p-2 focus:ring-indigo-700 focus:border-indigo-700 sm:text-sm'
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div className='pl-2'>
            <label className='block text-sm font-medium text-gray-900 mb-1'>
              ID Unidad Medida
            </label>
            <input
              type='number'
              className='block w-full border border-gray-500 rounded-md shadow-sm p-2 focus:ring-indigo-700 focus:border-indigo-700 sm:text-sm'
              value={idUnidadMedida}
              onChange={(e) => setIdUnidadMedida(e.target.value)}
            />
            <p className='mt-1 text-xs text-gray-700'>
              1: Unidad (u) &nbsp; 2: Gramo (g) &nbsp; 3: Kilogramo (kg) <br />
              4: Litro (L) &nbsp; 5: Mililitro (mL)
            </p>
          </div>

          <div className='pl-2'>
            <label className='block text-sm font-medium text-gray-900 mb-1'>
              ID Stock
            </label>
            <input
              type='number'
              className='block w-full border border-gray-500 rounded-md shadow-sm p-2 focus:ring-indigo-700 focus:border-indigo-700 sm:text-sm'
              value={idStock}
              onChange={(e) => setIdStock(e.target.value)}
            />
          </div>

          <div className='pl-2'>
            <label className='block text-sm font-medium text-gray-900 mb-1'>
              ID Estado
            </label>
            <input
              type='number'
              className='block w-full border border-gray-500 rounded-md shadow-sm p-2 focus:ring-indigo-700 focus:border-indigo-700 sm:text-sm'
              value={idEstado}
              onChange={(e) => setIdEstado(e.target.value)}
            />
            <p className='mt-1 text-xs text-gray-900'>
              12: Disponible &nbsp; 13: No Disponible
            </p>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancelar</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={handleSubmit}>Guardar</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ModalCrearIngrediente
