import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { PlanItem } from "@/types/planes/plan.types";
import { PlanRequest } from "@/types/planes/plan.request.type";
import { Plus, Edit3, X } from "lucide-react";

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PlanRequest, id?: number) => Promise<void>;
  planToEdit?: PlanItem | null;
  isLoading?: boolean;
}

const OPCIONES_FRECUENCIA = [
  "Mensual preventivo",
  "Mantenimiento mensual de equipos",
  "Mantenimiento quincenal",
  "Mantenimiento semanal",
  "Quincenal programado",
  "Semanal y auditorías",
];

const OPCIONES_MODALIDAD = [
  "Solo Asistencia Remota",
  "Asistencia técnica remota",
  "Asistencia técnica remota y presencial",
  "Remota y Presencial In-situ",
  "Soporte NOC 24/7",
];

const CHECKBOXES_ESTANDAR = [
  "Informe Técnico Mensual de Salud IT",
  "Antivirus Corporativo Centralizado",
  "Técnico Exclusivo Asignado",
  "Monitoreo de Red en Tiempo Real (NOC)",
];

export const PlanModal = ({
  isOpen,
  onClose,
  onSubmit,
  planToEdit,
  isLoading,
}: PlanModalProps) => {
  const isEditing = Boolean(planToEdit);

  const [tipo, setTipo] = useState("");
  const [precio, setPrecio] = useState("");
  const [limiteEquipos, setLimiteEquipos] = useState("");
  const [frecuencia, setFrecuencia] = useState("Mensual preventivo");
  const [modalidad, setModalidad] = useState("Solo Asistencia Remota");
  const [isActive, setIsActive] = useState(true);

  const [serviciosCheckboxes, setServiciosCheckboxes] = useState<string[]>([]);
  const [customServiciosList, setCustomServiciosList] = useState<string[]>([]);
  const [inputCustom, setInputCustom] = useState("");

  useEffect(() => {
    if (planToEdit) {
      setTipo(planToEdit.tipo || "");
      setPrecio(String(planToEdit.precio || ""));
      setLimiteEquipos(String(planToEdit.limite_equipos || ""));
      setIsActive(planToEdit.is_active ?? true);

      const serviciosOriginales = planToEdit.servicio || [];

      // 1. Identificar Frecuencia
      const freqFound = serviciosOriginales.find((s) =>
        OPCIONES_FRECUENCIA.some((f) => f.toLowerCase() === s.toLowerCase()),
      );
      setFrecuencia(freqFound || "Mensual preventivo");

      // 2. Identificar Modalidad
      const modFound = serviciosOriginales.find((s) =>
        OPCIONES_MODALIDAD.some((m) => m.toLowerCase() === s.toLowerCase()),
      );
      setModalidad(modFound || "Solo Asistencia Remota");

      // 3. Identificar Checkboxes Estándar
      const cbFound = serviciosOriginales.filter((s) =>
        CHECKBOXES_ESTANDAR.some((c) => c.toLowerCase() === s.toLowerCase()),
      );
      setServiciosCheckboxes(cbFound);

      // 4. Todo lo que NO sea la frecuencia seleccionada ni la modalidad seleccionada
      // y NO esté mapeado a un checkbox pasa directamente a la lista con boton "X"
      const extras = serviciosOriginales.filter(
        (s) => s !== freqFound && s !== modFound && !cbFound.includes(s),
      );

      setCustomServiciosList(extras);
      setInputCustom("");
    } else {
      setTipo("");
      setPrecio("");
      setLimiteEquipos("");
      setFrecuencia("Mensual preventivo");
      setModalidad("Solo Asistencia Remota");
      setIsActive(true);
      setServiciosCheckboxes([
        "Informe Técnico Mensual de Salud IT",
        "Antivirus Corporativo Centralizado",
      ]);
      setCustomServiciosList([]);
      setInputCustom("");
    }
  }, [planToEdit, isOpen]);

  const toggleCheckbox = (nombreServicio: string) => {
    setServiciosCheckboxes((prev) =>
      prev.includes(nombreServicio)
        ? prev.filter((s) => s !== nombreServicio)
        : [...prev, nombreServicio],
    );
  };

  const handleAddCustomServicio = () => {
    if (!inputCustom.trim()) return;
    if (!customServiciosList.includes(inputCustom.trim())) {
      setCustomServiciosList((prev) => [...prev, inputCustom.trim()]);
    }
    setInputCustom("");
  };

  const handleRemoveCustomServicio = (servToRemove: string) => {
    setCustomServiciosList((prev) => prev.filter((s) => s !== servToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Juntamos Frecuencia + Modalidad + Checkboxes + Tags Personalizados
    const listaServiciosFinal = [
      frecuencia,
      modalidad,
      ...serviciosCheckboxes,
      ...customServiciosList,
    ];

    const payload: PlanRequest = {
      numero_plan: planToEdit
        ? planToEdit.numero_plan
        : Math.floor(100 + Math.random() * 900),
      tipo: tipo.trim(),
      precio: Number(precio) || 0,
      limite_equipos: Number(limiteEquipos) || 0,
      servicio: Array.from(new Set(listaServiciosFinal.filter(Boolean))),
      ...(!isEditing && { is_active: isActive }),
    };

    await onSubmit(payload, planToEdit?.id_plan);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white rounded-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="h-10 w-10 rounded-xl bg-orange-50 text-[#ff5722] flex items-center justify-center">
              {isEditing ? (
                <Edit3 className="h-5 w-5" />
              ) : (
                <Plus className="h-5 w-5" />
              )}
            </div>
            <div>
              <DialogTitle className="text-xl font-extrabold text-slate-900">
                {isEditing
                  ? `Editar ${planToEdit?.tipo}`
                  : "Crear Nuevo Plan de Soporte"}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                {isEditing
                  ? "Modifica los precios, cobertura y módulos incluidos"
                  : "Define las características comerciales y límites técnicos"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Nombre del Plan */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700">
              NOMBRE DEL PLAN <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="Ej. Tech Pro Advance"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              required
              className="rounded-xl border-slate-200 text-xs h-10 font-medium"
            />
          </div>

          {/* Precio y Límite de Equipos */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">
                PRECIO MENSUAL (USD) <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                step="0.01"
                placeholder="149.99"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                required
                className="rounded-xl border-slate-200 text-xs h-10 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">
                LÍMITE DE EQUIPOS (ENDPOINTS){" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                placeholder="100"
                value={limiteEquipos}
                onChange={(e) => setLimiteEquipos(e.target.value)}
                required
                className="rounded-xl border-slate-200 text-xs h-10 font-medium"
              />
            </div>
          </div>

          {/* Frecuencia y Modalidad */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">
                FRECUENCIA MANTENIMIENTO
              </Label>
              <Select value={frecuencia} onValueChange={setFrecuencia}>
                <SelectTrigger className="rounded-xl border-slate-200 text-xs h-10 font-medium">
                  <SelectValue placeholder="Seleccionar frecuencia" />
                </SelectTrigger>
                <SelectContent>
                  {OPCIONES_FRECUENCIA.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">
                MODALIDAD DE ASISTENCIA
              </Label>
              <Select value={modalidad} onValueChange={setModalidad}>
                <SelectTrigger className="rounded-xl border-slate-200 text-xs h-10 font-medium">
                  <SelectValue placeholder="Seleccionar modalidad" />
                </SelectTrigger>
                <SelectContent>
                  {OPCIONES_MODALIDAD.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Servicios Checkboxes */}
          <div className="space-y-2 pt-1">
            <Label className="text-xs font-bold text-slate-700">
              SERVICIOS Y MÓDULOS INCLUIDOS
            </Label>
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 grid grid-cols-2 gap-3">
              {CHECKBOXES_ESTANDAR.map((serv) => (
                <div key={serv} className="flex items-center space-x-2">
                  <Checkbox
                    id={serv}
                    checked={serviciosCheckboxes.includes(serv)}
                    onCheckedChange={() => toggleCheckbox(serv)}
                  />
                  <label
                    htmlFor={serv}
                    className="text-xs font-medium text-slate-700 cursor-pointer"
                  >
                    {serv}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Servicios Adicionales en Formato Tag con la X para Quitar */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-700">
              SERVICIOS ADICIONALES DEL PLAN
            </Label>

            <div className="flex gap-2">
              <Input
                placeholder="Ej. Antivirus corporativo"
                value={inputCustom}
                onChange={(e) => setInputCustom(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustomServicio();
                  }
                }}
                className="rounded-xl border-slate-200 text-xs h-10 font-medium flex-1"
              />
              <Button
                type="button"
                onClick={handleAddCustomServicio}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl h-10 px-4 cursor-pointer"
              >
                Agregar
              </Button>
            </div>

            {/* Renderizado de los servicios existentes con botón de X para eliminar */}
            {customServiciosList.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2 p-3 rounded-xl border border-orange-200/60 bg-orange-50/20">
                {customServiciosList.map((serv) => (
                  <div
                    key={serv}
                    className="inline-flex items-center gap-2 bg-white border border-orange-200 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-2xs"
                  >
                    <span>{serv}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomServicio(serv)}
                      className="text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full p-0.5 transition-colors cursor-pointer"
                      title="Quitar servicio"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 italic">
                No hay otros servicios adicionales en este plan.
              </p>
            )}
          </div>

          {/* Disponibilidad en Catálogo (solo visible al crear) */}
          {!isEditing && (
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-orange-200/60 bg-orange-50/30">
              <div>
                <p className="text-xs font-bold text-slate-900">
                  Disponibilidad en Catálogo
                </p>
                <p className="text-[11px] text-slate-500">
                  Los clientes podrán contratar o migrar a este plan
                  inmediatamente
                </p>
              </div>
              <Switch
                checked={isActive}
                onCheckedChange={setIsActive}
                className="cursor-pointer data-[state=checked]:bg-[#ff5722]"
              />
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-xl text-xs font-semibold h-10 px-4 cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="rounded-xl text-xs font-bold h-10 px-5 bg-[#ff5722] hover:bg-[#f4511e] text-white shadow-sm cursor-pointer"
            >
              {isLoading
                ? "Guardando..."
                : isEditing
                  ? "Guardar Cambios"
                  : "Crear Plan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
