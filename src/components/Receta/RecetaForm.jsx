"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, X, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "sonner"

const categorias = [
  { id: 7, nombre: "Chancho" },
  { id: 8, nombre: "Pollo" },
  { id: 9, nombre: "Vaca" },
  { id: 10, nombre: "Mixto" }
]

export function RecetaForm({ receta, ingredientesDisponibles, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    idProducto: receta ? receta.idProducto : null,
    nombre: "",
    descripcion: "",
    idCategoria: "",
    tiempoPreparacion: "",
    precio: 0.0,
    porciones: 1,
  })



  const [ingredientes, setIngredientes] = useState([])
  const [openCombobox, setOpenCombobox] = useState(false)
  const [searchIngrediente, setSearchIngrediente] = useState("")


  useEffect(() => {
    if (receta) {
      setFormData({
        idProducto: receta.idProducto,
        nombre: receta.nombre,
        descripcion: receta.descripcion,
        idCategoria: receta.idCategoria,
        tiempoPreparacion: receta.tiempoPreparacion,
        precio: receta.precio
      });

      const ingredientesTransformados = receta.Ingredientes.map(ing => ({
        idIngrediente: ing.idIngrediente,
        nombre: ing.nombre,
        cantidad: ing.cantidad
      }));
      setIngredientes(ingredientesTransformados);
    }
  }, [receta]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    console.log("Form data updated:", { ...formData, [field]: value })
  }

  const handleAddIngrediente = (ingrediente) => {
    const yaExiste = ingredientes.some((item) => item.idIngrediente === ingrediente.id)
    if (!yaExiste) {
      setIngredientes([
        ...ingredientes,
        { idIngrediente: ingrediente.id, nombre: ingrediente.nombre, cantidad: 0 },
      ])
    }
    setOpenCombobox(false)
    setSearchIngrediente("")
  }

  const handleUpdateCantidad = (index, cantidad) => {
    const nuevosIngredientes = [...ingredientes]
    nuevosIngredientes[index].cantidad = cantidad
    setIngredientes(nuevosIngredientes)
  }

  const handleRemoveIngrediente = (index) => {
    setIngredientes(ingredientes.filter((_, i) => i !== index))
  }


  const isFormValid = () => {
    if (receta) {
      return (
        formData.nombre.trim() !== "" &&
        ingredientes.length > 0 &&
        ingredientes.every((item) => item.cantidad > 0)
      )
    }
    return (
      formData.nombre.trim() !== "" &&
      ingredientes.length > 0 &&
      ingredientes.every((item) => item.cantidad > 0) &&
      formData.idCategoria !== "" &&
      formData.tiempoPreparacion !== "" &&
      formData.precio > 0
    )
  }

  const handleSave = () => {
    if (!isFormValid()) return
    const recetaData = {
      ...formData,
      Ingredientes: ingredientes
    }
    toast.success(receta ? "Receta actualizada" : "Receta creada");
    onSave(recetaData)
  }

  const ingredientesFiltrados = ingredientesDisponibles.ingredientes.filter(
    (ingrediente) =>
      ingrediente.nombre.toLowerCase().includes(searchIngrediente.toLowerCase())
  )


  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{receta ? "Editar Receta" : "Nueva Receta"}</h2>
          <p className="text-muted-foreground">
            {receta ? "Modifica los detalles de la receta" : "Crea una nueva receta para el menú"}
          </p>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Información Básica</CardTitle>
            <CardDescription>Detalles generales de la receta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre de la receta</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => handleInputChange("nombre", e.target.value)}
                placeholder="Ej: Sopa de verduras casera"
              />
            </div>
            {!receta && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) => handleInputChange("descripcion", e.target.value)}
                    placeholder="Describe brevemente la receta..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoría</Label>
                  <Select value={formData.idCategoria} onValueChange={(value) => handleInputChange("idCategoria", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map(({ id, nombre }) => (
                        <SelectItem key={id} value={id}>
                          {nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tiempo">Tiempo de preparación (minutos)</Label>
                  <Input
                    id="tiempo"
                    type="text"
                    placeholder="Ej 00:30 (30 minutos)"
                    value={formData.tiempoPreparacion}
                    onChange={(e) => handleInputChange("tiempoPreparacion", e.target.value)}
                  />
                </div>
                <div className="space-y-2"></div>
                <Label htmlFor="precio">Precio</Label>
                <Input
                  id="precio"
                  type="number"
                  step="0.01"
                  placeholder="Ej: 10.00"
                  value={formData.precio}
                  onChange={(e) => handleInputChange("precio", parseFloat(e.target.value))}
                />
              </>
            )}

          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ingredientes</CardTitle>
            <CardDescription>Agrega los ingredientes y sus cantidades</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Agregar ingrediente</Label>
              <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <Search className="mr-2 h-4 w-4" />
                    Buscar ingrediente...
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput
                      placeholder="Buscar ingrediente..."
                      value={searchIngrediente}
                      onValueChange={setSearchIngrediente}
                    />
                    <CommandList>
                      <CommandEmpty>No se encontraron ingredientes.</CommandEmpty>
                      <CommandGroup>
                        {ingredientesFiltrados.map((ingrediente) => (
                          <CommandItem
                            key={ingrediente.id}
                            onSelect={() => { handleAddIngrediente(ingrediente) }}
                            className="cursor-pointer"
                          >
                            <div className="flex w-full items-center justify-between">
                              <span>{ingrediente.nombre}</span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-3">
              {ingredientes.map((item, index) => (
                <div className="flex items-center gap-2" key={item.idIngrediente || index}>
                  <span className="w-1/2">{item.nombre}</span>
                  <Input
                    type="number"
                    min="1"
                    value={item.cantidad}
                    onChange={(e) => handleUpdateCantidad(index, Number(e.target.value))}
                    className="w-1/3"
                  /> gr
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveIngrediente(index)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {ingredientes.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                <p>No hay ingredientes agregados</p>
                <p className="text-sm">Usa el buscador para agregar ingredientes</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={() => { handleSave(); toast.success("Receta guardada"); }} disabled={!isFormValid()}>
          {receta ? "Actualizar Receta" : "Crear Receta"}
        </Button>
      </div>
    </div>
  )
}