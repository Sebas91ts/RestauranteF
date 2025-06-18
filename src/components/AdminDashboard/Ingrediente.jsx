import { useState, useMemo } from 'react'
import { useFetchData } from '../../hooks/useFetchData'
import {
  mostrarIngredientes,
  eliminarIngrediente,
  crearIngrediente
} from '../../api/ingrediente'
import {
  ChevronUpIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Toaster, toast } from 'sonner'
import { useModal } from '../../hooks/useModal'

import ModalCrearIngrediente from '../modals/ModalCrearIngrediente'
import SuccessModal from '../modals/SuccessModal'

const extractIngrediente = (res) => res.data.ingredientes

export default function Ingrediente() {
  const { data, refresh } = useFetchData(
    mostrarIngredientes,
    extractIngrediente
  )

  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState({
    key: 'id',
    direction: 'ascending'
  })
  const [currentToDelete, setCurrentToDelete] = useState(null)

  const createModal = useModal()
  const successModal = useModal()

  const requestSort = (key) => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const filteredAndSortedData = useMemo(() => {
    let filteredItems = [...data]

    if (searchTerm) {
      filteredItems = filteredItems.filter((item) =>
        item.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (sortConfig.key) {
      filteredItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1
        }
        return 0
      })
    }

    return filteredItems
  }, [data, searchTerm, sortConfig])

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return null
    return sortConfig.direction === 'ascending' ? (
      <ChevronUpIcon className='inline w-4 h-4' />
    ) : (
      <ChevronDownIcon className='inline w-4 h-4' />
    )
  }

  const handleDelete = async () => {
    if (!currentToDelete) return
    await eliminarIngrediente(currentToDelete.id)
    toast.success('Ingrediente eliminado', {
      description: `El ingrediente ha sido eliminado.`
    })
    setCurrentToDelete(null)
    refresh()
  }

  if (!data.length) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600'></div>
      </div>
    )
  }

  return (
    <div className='bg-white rounded-lg shadow-lg p-6'>
      <Toaster richColors position='top-right' />
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-2xl font-bold text-gray-800'>
          Gestión de Ingredientes
        </h2>
        <Button onClick={createModal.open}>
          <PlusIcon className='w-4 h-4 mr-2' />
          Crear ingrediente
        </Button>
      </div>

      <div className='relative mb-6'>
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
          <MagnifyingGlassIcon className='h-5 w-5 text-gray-400' />
        </div>
        <input
          type='text'
          className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm'
          placeholder='Buscar ingrediente...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className='overflow-y-auto max-h-[400px] custom-scrollbar'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50 sticky top-0 z-10'>
            <tr>
              <th
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
                onClick={() => requestSort('id')}
              >
                ID {renderSortIcon('id')}
              </th>
              <th
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
                onClick={() => requestSort('nombre')}
              >
                Nombre {renderSortIcon('nombre')}
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Eliminar
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {filteredAndSortedData.map((item) => (
              <tr key={item.id}>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                  {item.id}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  {item.nombre}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-red-500'>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => setCurrentToDelete(item)}
                      >
                        <TrashIcon className='w-4 h-4' />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          ¿Eliminar ingrediente?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. El ingrediente "
                          {item.nombre}" será eliminado permanentemente.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAndSortedData.length === 0 && (
        <div className='text-center py-4'>
          <p className='text-gray-500'>
            No se encontraron ingredientes que coincidan con la búsqueda.
          </p>
        </div>
      )}

      {createModal.isOpen && (
        <ModalCrearIngrediente
          isOpen={createModal.isOpen}
          onClose={createModal.close}
          onGuardar={() => {
            createModal.close()
            successModal.open()
            refresh()
          }}
          Request={crearIngrediente}
        />
      )}

      {successModal.isOpen && (
        <SuccessModal
          setIsOpen={successModal.toggle}
          message='El ingrediente fue creado correctamente'
          refresh={refresh}
        />
      )}
    </div>
  )
}
