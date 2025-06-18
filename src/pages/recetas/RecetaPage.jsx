
import { useState, useContext } from "react"
import { Plus, Search, Edit, Trash2, ChefHat, Clock, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import { RecetaForm } from "@/components/Receta/RecetaForm"
import { RecetaContext } from "@/context/Receta/RecetaContext"
import { useFetchData } from "@/hooks/useFetchData"
import { crearProducto, obtenerProductos } from "@/api/cliente/productos"

const extractProducto = (res) => res.data

export function RecetaPage() {

  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const { data } = useFetchData(obtenerProductos, extractProducto)
  const { receta, ingredientes, EditarReceta } = useContext(RecetaContext)
  const [editingReceta, setEditingReceta] = useState(null)
  const [recetas, setRecetas] = useState(receta)

  // Filtrar recetas por término de búsqueda
  const recetasFiltradas = recetas.filter(
    (receta) =>
      receta.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  )

  console.log('dataProductos:', data)

  const handleCreateReceta = async (nuevaReceta) => {
    const receta = {
      ...nuevaReceta
    }
    console.log("Receta a crear:", receta)
    setRecetas([...recetas, receta])
    try {
      const response = await crearProducto(receta)
      const productoCreadoId = response.data.nuevoProducto.id

      await EditarReceta({
        idProducto: productoCreadoId,
        Ingredientes: receta.Ingredientes
      })

      console.log("Producto creado:", productoCreadoId)
      toast.success("Receta creada", {
        description: `La receta "${receta.nombre}" ha sido creada exitosamente.`,
      })

      setShowForm(false)
    } catch (error) {
      console.error("Error al crear la receta:", error)
      toast.error("Error al crear la receta", {
        description: "Ocurrió un error al intentar crear la receta.",
      })
      return
    }
  }

  console.log("Recetas:", recetas)

  const handleEditReceta = async (recetaEditada) => {
    if (!editingReceta) return
    const recetaActualizada = {
      ...recetaEditada
    }
    console.log("Receta a editar:", recetaActualizada)
    try {
      await EditarReceta(recetaActualizada)
      toast.success("Receta actualizada")

      setRecetas(recetas.map((r) => (r.idProducto === editingReceta.idProducto ? recetaActualizada : r)))
      setEditingReceta(null)
      setShowForm(false)
    } catch (error) {
      console.error("Error al editar la receta:", error)
      toast.error("Error al actualizar la receta", {
        description: "Ocurrió un error al intentar actualizar la receta.",
      })
      return
    }
  }

  // Eliminar receta
  const handleDeleteReceta = (id) => {
    const receta = recetas.find((r) => r.id === id)
    setRecetas(recetas.filter((r) => r.id !== id))
    toast.success("Receta eliminada", {
      description: `La receta "${receta?.nombre}" ha sido eliminada.`,
    })
  }

  // Abrir formulario para editar
  const handleEditClick = async (receta) => {
    setEditingReceta(receta)
    setShowForm(true)
  }

  // Cerrar formulario
  const handleCloseForm = () => {
    setShowForm(false)
    setEditingReceta(null)
  }

  if (showForm) {
    return (
      <RecetaForm
        receta={editingReceta}
        ingredientesDisponibles={ingredientes || []}
        onSave={editingReceta ? handleEditReceta : handleCreateReceta}
        onCancel={handleCloseForm}
      />
    )
  }
  if (!receta) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h2 className="text-2xl font-bold">Cargando recetas...</h2>
      </div>
    )
  }

  return (
    <div className="space-y-6 container max-h-[calc(100vh-128px)] overflow-y-auto">
      {/* Header */}
      <Toaster richColors position="top-right" />
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h2 className="text-2xl font-bold">Gestión de Recetas</h2>
          <p className="text-muted-foreground">Administra las recetas del restaurante</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="md:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Receta
        </Button>
      </div>

      {/* Barra de búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar recetas por nombre o categoría..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Lista de recetas */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {recetasFiltradas.map((receta) => (
          <Card key={receta.idProducto} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{receta.nombre}</CardTitle>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEditClick(receta)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar receta?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. La receta "{receta.nombre}" será eliminada permanentemente.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteReceta(receta.id)}>Eliminar</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="line-clamp-2">{receta.descripcion}</CardDescription>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {receta.tiempoPreparacion} min
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {1} porciones
                </div>
                <div className="flex items-center gap-1">
                  <ChefHat className="h-4 w-4" />
                  {receta.Ingredientes?.length || receta.ingredientes?.length} ingredientes
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Ingredientes principales:</div>
                <div className="flex flex-wrap gap-1">
                  {receta.Ingredientes.slice(0, 3).map((item) => (
                    <Badge
                      key={`${item.idIngrediente || item.id}-${item.nombre}`}
                      variant="secondary"
                      className="text-xs"
                    >
                      {item.nombre}
                    </Badge>
                  ))}
                  {receta.Ingredientes.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{receta.Ingredientes.length - 3} más
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {recetasFiltradas.length === 0 && (
        <div className="text-center py-12">
          <ChefHat className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No se encontraron recetas</h3>
          <p className="text-muted-foreground">
            {searchTerm ? "Intenta con otros términos de búsqueda" : "Comienza creando tu primera receta"}
          </p>
        </div>
      )}
    </div>
  )
}
