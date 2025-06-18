'use client'

import { useState, useMemo } from 'react'
import {
  Search,
  Filter,
  Eye,
  Printer,
  Download,
  DollarSign,
  User,
  Clock,
  FileText,
  Calendar
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'

import { useFetchData } from '@/hooks/useFetchData'
import { getTicketRequest, getTicketByIdRequest } from '@/api/ticket'

const metodosPagoConfig = {
  Efectivo: { label: 'Efectivo', icon: '💵', variant: 'default' },
  'Tarjeta de Débito': {
    label: 'Tarjeta de Débito',
    icon: '💳',
    variant: 'secondary'
  },
  'Tarjeta de Crédito': {
    label: 'Tarjeta de Crédito',
    icon: '💳',
    variant: 'outline'
  }
}
const extractTicket = (res) => res.data
export default function TicketAdmin() {
  const { data: tickets } = useFetchData(getTicketRequest, extractTicket)
  const [searchTerm, setSearchTerm] = useState('')
  const [estadoFilter, setEstadoFilter] = useState('todos')
  const [metodoPagoFilter, setMetodoPagoFilter] = useState('todos')
  const [empleadoFilter, setEmpleadoFilter] = useState('todos')
  const [fechaFilter, setFechaFilter] = useState()
  const [selectedTicket, setSelectedTicket] = useState(null)

  // Función para obtener un ticket por su ID
  const handleViewTicket = async (id) => {
    try {
      const { data } = await getTicketByIdRequest(id)
      setSelectedTicket(data)
    } catch (error) {
      console.error('Error al cargar ticket:', error)
    }
  }
  // Obtener empleados únicos
  const empleados = useMemo(() => {
    const uniqueEmpleados = [
      ...new Set(
        tickets
          .filter((ticket) => ticket.empleado)
          .map((ticket) => ticket.empleado)
      )
    ]
    return uniqueEmpleados
  }, [tickets])

  // Obtener métodos de pago únicos
  const metodosPago = useMemo(() => {
    const uniqueMetodos = [
      ...new Set(
        tickets
          .filter((ticket) => ticket.metodoDePago)
          .map((ticket) => ticket.metodoDePago)
      )
    ]
    return uniqueMetodos
  }, [tickets])

  // Filtrar tickets
  const ticketsFiltrados = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesSearch =
        ticket.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ticket.empleado &&
          ticket.empleado.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesEstado =
        estadoFilter === 'todos' ||
        (estadoFilter === 'pendientes' && !ticket.empleado) ||
        (estadoFilter === 'entregados' && ticket.empleado)

      const matchesMetodoPago =
        metodoPagoFilter === 'todos' || ticket.metodoDePago === metodoPagoFilter
      const matchesEmpleado =
        empleadoFilter === 'todos' || ticket.empleado === empleadoFilter

      // Filtro por fecha
      const matchesFecha =
        !fechaFilter || ticket.fecha === fechaFilter.toISOString().split('T')[0]

      return (
        matchesSearch &&
        matchesEstado &&
        matchesMetodoPago &&
        matchesEmpleado &&
        matchesFecha
      )
    })
  }, [
    tickets,
    searchTerm,
    estadoFilter,
    metodoPagoFilter,
    empleadoFilter,
    fechaFilter
  ])

  // Estadísticas
  const estadisticas = useMemo(() => {
    const total = ticketsFiltrados.length
    const montoTotal = ticketsFiltrados.reduce(
      (sum, ticket) => sum + ticket.monto,
      0
    )
    const pendientes = ticketsFiltrados.filter(
      (ticket) => !ticket.empleado
    ).length
    const entregados = ticketsFiltrados.filter(
      (ticket) => ticket.empleado
    ).length

    return { total, montoTotal, pendientes, entregados }
  }, [ticketsFiltrados])

  const handlePrintTicket = (ticket) => {
    const printContent = `
    <html>
      <head>
        <title>Ticket ${ticket.numero}</title>
        <style>
          @media print {
            body {
              font-family: Arial, sans-serif;
              width: 8cm;
              margin: 0;
              padding: 0.5cm 0.5cm 0.5cm 0.5cm;
            }
            .ticket-header {
              text-align: center;
              border-bottom: 1.5px solid #333;
              padding-bottom: 0.3cm;
              margin-bottom: 0.5cm;
            }
            .ticket-info {
              display: flex;
              justify-content: space-between;
              margin: 0.2cm 0;
              font-size: 0.9rem;
            }
            .ticket-total {
              font-size: 1.1rem;
              font-weight: bold;
              text-align: center;
              margin-top: 0.7cm;
              padding-top: 0.3cm;
              border-top: 1px solid #333;
            }
          }
          /* Para visualización en pantalla antes de imprimir */
          body {
            font-family: Arial, sans-serif;
            width: 8cm;
            margin: 10px auto;
            padding: 0.5cm;
          }
          .ticket-header {
            text-align: center;
            border-bottom: 1.5px solid #333;
            padding-bottom: 0.3cm;
            margin-bottom: 0.5cm;
          }
          .ticket-info {
            display: flex;
            justify-content: space-between;
            margin: 0.2cm 0;
            font-size: 0.9rem;
          }
          .ticket-total {
            font-size: 1.1rem;
            font-weight: bold;
            text-align: center;
            margin-top: 0.7cm;
            padding-top: 0.3cm;
            border-top: 1px solid #333;
          }
        </style>
      </head>
      <body>
        <div class="ticket-header">
          <h2>TICKET DE VENTA</h2>
          <p>${ticket.numero}</p>
        </div>
        <div class="ticket-info">
          <span>Fecha:</span>
          <span>${ticket.fecha}</span>
        </div>
        <div class="ticket-info">
          <span>Empleado:</span>
          <span>${ticket.empleado || 'No asignado'}</span>
        </div>
        <div class="ticket-info">
          <span>Método de Pago:</span>
          <span>${ticket.metodoDePago || 'No especificado'}</span>
        </div>
        ${ticket.detalles
          ?.map(
            (d) => `
        <div class="ticket-info">
          <span>${d.cantidad} x ${d.producto}</span>
          <span>$${parseFloat(d.subtotal).toFixed(2)}</span>
        </div>
        `
          )
          .join('')}
        <div class="ticket-total">
          TOTAL: $${parseFloat(ticket.monto).toFixed(2)}
        </div>
      </body>
    </html>
  `

    const printWindow = window.open('', '_blank')
    printWindow.document.write(printContent)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    printWindow.close()
  }

  const handleDownloadReport = () => {
    const csvContent = [
      [
        'ID',
        'Número',
        'Fecha',
        'Monto',
        'Empleado',
        'Método de Pago',
        'Estado'
      ],
      ...ticketsFiltrados.map((ticket) => [
        ticket.id,
        ticket.numero,
        ticket.fecha,
        ticket.monto,
        ticket.empleado || 'No asignado',
        ticket.metodoDePago || 'No especificado',
        ticket.empleado ? 'Entregado' : 'Pendiente'
      ])
    ]
      .map((row) => row.join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `reporte-tickets-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'bob'
    }).format(amount)
  }

  //   const formatDate = (dateString) => {
  //     return new Date(dateString).toLocaleDateString('es-MX', {
  //       year: 'numeric',
  //       month: 'long',
  //       day: 'numeric'
  //     })
  //   }
  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-')
    const meses = [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre'
    ]
    return `${parseInt(day)} de ${meses[parseInt(month) - 1]} de ${year}`
  }

  const getPaymentMethodBadge = (metodo) => {
    if (!metodo) return <Badge variant='secondary'>No especificado</Badge>

    const config = metodosPagoConfig[metodo]
    if (!config) return <Badge variant='secondary'>{metodo}</Badge>

    return (
      <Badge variant={config.variant}>
        {config.icon} {config.label}
      </Badge>
    )
  }

  return (
    <div className=' p-6'>
      <div className='max-w-7xl mx-auto space-y-6'>
        {/* Header */}
        <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          <div>
            <h2 className='text-3xl font-bold text-gray-900'>
              Panel de Administración
            </h2>
            <p className='text-gray-600'>Gestión de tickets y ventas</p>
          </div>
          <Button
            onClick={handleDownloadReport}
            className='flex items-center gap-2'
          >
            <Download className='h-4 w-4' />
            Descargar Reporte
          </Button>
        </div>

        {/* Estadísticas */}
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Tickets
              </CardTitle>
              <FileText className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{estadisticas.total}</div>
              <p className='text-xs text-muted-foreground'>
                tickets procesados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Monto Total</CardTitle>
              <DollarSign className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {formatCurrency(estadisticas.montoTotal)}
              </div>
              <p className='text-xs text-muted-foreground'>en ventas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Pendientes</CardTitle>
              <Clock className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {estadisticas.pendientes}
              </div>
              <p className='text-xs text-muted-foreground'>
                tickets pendientes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Entregados</CardTitle>
              <User className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {estadisticas.entregados}
              </div>
              <p className='text-xs text-muted-foreground'>
                tickets completados
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Filter className='h-5 w-5' />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-5'>
              {/* Búsqueda */}
              <div className='relative'>
                <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                <Input
                  placeholder='Buscar por número o empleado...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='pl-10 w-full'
                />
              </div>

              {/* Filtro por estado */}
              <Select value={estadoFilter} onValueChange={setEstadoFilter}>
                <SelectTrigger className={'w-full'}>
                  <SelectValue placeholder='Estado' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='todos'>Todos los estados</SelectItem>
                  <SelectItem value='pendientes'>Pendientes</SelectItem>
                  <SelectItem value='entregados'>Entregados</SelectItem>
                </SelectContent>
              </Select>

              {/* Filtro por método de pago */}
              <Select
                value={metodoPagoFilter}
                onValueChange={setMetodoPagoFilter}
              >
                <SelectTrigger className={'w-full'}>
                  <SelectValue placeholder='Método de pago' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='todos'>Todos los métodos</SelectItem>
                  {metodosPago.map((metodo) => (
                    <SelectItem key={metodo} value={metodo}>
                      {metodosPagoConfig[metodo]?.icon} {metodo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Filtro por empleado */}
              <Select value={empleadoFilter} onValueChange={setEmpleadoFilter}>
                <SelectTrigger className={'w-full'}>
                  <SelectValue placeholder='Empleado' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='todos'>Todos los empleados</SelectItem>
                  {empleados.map((empleado) => (
                    <SelectItem key={empleado} value={empleado}>
                      {empleado}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Filtro por fecha */}
              <div className='flex flex-col gap-1'>
                <Input
                  type='date'
                  id='fecha'
                  value={
                    fechaFilter ? fechaFilter.toISOString().split('T')[0] : ''
                  }
                  onChange={(e) => {
                    const value = e.target.value
                    setFechaFilter(value ? new Date(value) : undefined)
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabla de tickets */}
        <Card>
          <CardHeader>
            <CardTitle>Tickets ({ticketsFiltrados.length})</CardTitle>
            <CardDescription>
              Lista de todos los tickets filtrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='rounded-md border overflow-y-auto max-h-[160px] custom-scrollbar'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Número</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Empleado</TableHead>
                    <TableHead>Método Pago</TableHead>
                    <TableHead className='text-right'>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ticketsFiltrados.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className='font-medium'>
                        #{ticket.id}
                      </TableCell>
                      <TableCell>
                        <div className='font-mono text-sm bg-gray-100 px-2 py-1 rounded'>
                          {ticket.numero}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(ticket.fecha)}</TableCell>
                      <TableCell>
                        <span className='font-semibold text-green-600'>
                          {formatCurrency(ticket.monto)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {ticket.empleado ? (
                          <div className='flex items-center gap-2'>
                            <User className='h-4 w-4 text-gray-500' />
                            {ticket.empleado}
                          </div>
                        ) : (
                          <span className='text-gray-400 italic'>
                            No asignado
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {getPaymentMethodBadge(ticket.metodoDePago)}
                      </TableCell>
                      <TableCell className='text-right'>
                        <div className='flex items-center justify-end gap-2'>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant='ghost'
                                size='icon'
                                onClick={() => handleViewTicket(ticket.id)}
                              >
                                <Eye className='h-4 w-4' />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className='max-w-2xl'>
                              <DialogHeader>
                                <DialogTitle>
                                  Detalles del Ticket {selectedTicket?.numero}
                                </DialogTitle>
                                <DialogDescription>
                                  Información completa del ticket de venta
                                </DialogDescription>
                              </DialogHeader>
                              {selectedTicket && (
                                <TicketDetails ticket={selectedTicket} />
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={async () => {
                              const { data } = await getTicketByIdRequest(
                                ticket.id
                              )
                              handlePrintTicket(data)
                            }}
                          >
                            <Printer className='h-4 w-4' />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {ticketsFiltrados.length === 0 && (
              <div className='text-center py-12'>
                <div className='text-muted-foreground'>
                  No se encontraron tickets con los filtros aplicados
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Componente para mostrar detalles del ticket
export function TicketDetails({ ticket }) {
  const formatCurrency = (amount) =>
    new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount)

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-')
    const meses = [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre'
    ]
    return `${parseInt(day)} de ${meses[parseInt(month) - 1]} de ${year}`
  }

  return (
    <div className='space-y-6'>
      {/* Información general */}
      <div className='grid gap-4 md:grid-cols-2'>
        <div>
          <div className='text-sm text-muted-foreground'>Número de Ticket</div>
          <div className='text-lg font-bold'>{ticket.numero}</div>
        </div>
        <div>
          <div className='text-sm text-muted-foreground'>Estado</div>
          <Badge variant={ticket.estado === 'Pagado' ? 'default' : 'secondary'}>
            {ticket.estado}
          </Badge>
        </div>
        <div>
          <div className='text-sm text-muted-foreground'>Fecha</div>
          <div>{formatDate(ticket.fecha)}</div>
        </div>
        <div>
          <div className='text-sm text-muted-foreground'>Empleado</div>
          <div>{ticket.empleado || 'No asignado'}</div>
        </div>
        <div>
          <div className='text-sm text-muted-foreground'>Método de Pago</div>
          <div>{ticket.metodoDePago || 'No especificado'}</div>
        </div>
        <div>
          <div className='text-sm text-muted-foreground'>Monto Total</div>
          <div className='text-lg font-bold text-green-600'>
            {formatCurrency(ticket.monto)}
          </div>
        </div>
      </div>

      <Separator />

      {/* Detalles de productos */}
      <div className='space-y-4'>
        <div className='text-lg font-semibold'>Productos</div>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead className='text-left text-muted-foreground'>
              <tr>
                <th className='p-2'>Producto</th>
                <th className='p-2'>Cantidad</th>
                <th className='p-2'>Precio</th>
                <th className='p-2 text-right'>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {ticket.detalles?.map((item, i) => (
                <tr key={i} className='border-t'>
                  <td className='p-2'>{item.producto}</td>
                  <td className='p-2'>{item.cantidad}</td>
                  <td className='p-2'>{formatCurrency(item.precio)}</td>
                  <td className='p-2 text-right'>
                    {formatCurrency(item.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
