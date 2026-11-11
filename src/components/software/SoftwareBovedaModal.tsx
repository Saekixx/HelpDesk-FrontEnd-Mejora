import { useState } from "react";
import {
  X,
  KeyRound,
  Copy,
  Plus,
  Trash2,
  Monitor,
  ShieldAlert,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useSoftwareBoveda } from "@/hooks/software/useSoftware";
import { SelectOption } from "@/shared/types/select-option.types";

interface SoftwareBovedaModalProps {
  isOpen: boolean;
  onClose: () => void;
  softwareId: number | string | null;
  onAssignEquipment: (softwareId: number | string, data: any) => Promise<void>;
  onReleaseEquipment: (idAssignment: number | string) => Promise<void>;
  isSubmitting?: boolean;
  // Nuevas props inyectadas desde SoftwarePage
  areas: SelectOption<number>[];
  equipos: SelectOption<number>[];
  setSelectedSucursalId: (id: number | null) => void;
  setSelectedAreaId: (id: number | null) => void;
}

export const SoftwareBovedaModal = ({
  isOpen,
  onClose,
  softwareId,
  onAssignEquipment,
  onReleaseEquipment,
  isSubmitting = false,
  areas,
  equipos,
  setSelectedSucursalId,
  setSelectedAreaId,
}: SoftwareBovedaModalProps) => {
  const { boveda, isLoading, refetch } = useSoftwareBoveda(
    isOpen ? (softwareId ?? undefined) : undefined,
  );

  // Estados locales para los sub-modales internos
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [assignmentToRelease, setAssignmentToRelease] = useState<{
    id: number | string;
    name: string;
  } | null>(null);

  // Estados del formulario de asignación
  const [selectedAreaFilter, setSelectedAreaFilter] = useState<string>("");
  const [formAssign, setFormAssign] = useState({
    id_equipo: "",
    correo_asociado: "",
    licencia_especifica: "",
    password_enc: "",
    fecha_instalacion: new Date().toISOString().split("T")[0],
    observaciones: "",
  });

  if (!isOpen) return null;

  const handleOpenAssignModal = () => {
    // Forzamos el id_sucursal directamente desde la respuesta de la bóveda al abrir el sub-modal
    if (boveda?.id_sucursal) {
      setSelectedSucursalId(Number(boveda.id_sucursal));
    }
    setSelectedAreaId(null);
    setSelectedAreaFilter("");
    setFormAssign({
      id_equipo: "",
      correo_asociado: "",
      licencia_especifica: "",
      password_enc: "",
      fecha_instalacion: new Date().toISOString().split("T")[0],
      observaciones: "",
    });
    setIsAssignOpen(true);
  };

  // Al cambiar de área en el select, actualizamos el ID del área en el padre para que cargue los equipos
  const handleAreaChange = (areaId: string) => {
    setSelectedAreaFilter(areaId);
    const numId = areaId ? Number(areaId) : null;
    setSelectedAreaId(numId);
    setFormAssign((prev) => ({ ...prev, id_equipo: "" }));
  };

  const handleCopyKey = (key?: string | null) => {
    if (!key) return;
    navigator.clipboard.writeText(key);
    toast.success("Master Key copiada al portapapeles");
  };

  const handleSubmitAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!softwareId || !formAssign.id_equipo) {
      toast.error("Seleccione un área y un equipo de destino válido.");
      return;
    }

    try {
      await onAssignEquipment(softwareId, {
        ...formAssign,
        id_equipo: Number(formAssign.id_equipo),
      });
      toast.success("Equipo asignado exitosamente a la bóveda");
      setIsAssignOpen(false);
      refetch();
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleConfirmRelease = async () => {
    if (!assignmentToRelease) return;
    try {
      await onReleaseEquipment(assignmentToRelease.id);
      toast.success("Equipo liberado exitosamente de la bóveda");
      setAssignmentToRelease(null);
      refetch();
    } catch (error: any) {
      console.error(error);
    }
  };

  const total = boveda?.limite_equipos ?? 0;
  const usados = boveda?.licencias_usadas ?? 0;
  const libres = Math.max(0, total - usados);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* CABECERA */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#ff5722] text-white flex items-center justify-center shadow-md">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-wide">
                Bóveda de Credenciales y Cupos de Software
              </h3>
              <p className="text-xs text-slate-300 font-medium">
                {isLoading
                  ? "Cargando..."
                  : `${boveda?.nombre_software || "Software"} • Control de Asistencias y Llaves`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white cursor-pointer transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto bg-slate-50/50">
          {isLoading ? (
            <div className="py-16 text-center text-xs text-slate-400 font-medium flex flex-col items-center justify-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-[#ff5722]" />
              Cargando bóveda de credenciales...
            </div>
          ) : (
            <>
              {/* MÉTRICAS */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Capacidad Total
                  </span>
                  <span className="text-xl font-extrabold text-slate-900 block">
                    {total}{" "}
                    <span className="text-xs font-normal text-slate-500">
                      cupos
                    </span>
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Cupos en Uso
                  </span>
                  <span className="text-xl font-extrabold text-blue-600 block">
                    {usados}{" "}
                    <span className="text-xs font-normal text-slate-500">
                      asignados
                    </span>
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Disponibles
                  </span>
                  <span className="text-xl font-extrabold text-emerald-600 block">
                    {libres}{" "}
                    <span className="text-xs font-normal text-slate-500">
                      libres
                    </span>
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    KMS / Master Key
                  </span>
                  <div className="flex items-center justify-between pt-0.5">
                    <span className="text-xs font-mono font-bold text-slate-700 truncate max-w-[120px]">
                      {boveda?.licencia_master_key || "••••••••••••"}
                    </span>
                    <button
                      onClick={() => handleCopyKey(boveda?.licencia_master_key)}
                      className="text-slate-400 hover:text-[#ff5722] cursor-pointer"
                      title="Copiar Master Key"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* SECCIÓN DE TABLA */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    <Monitor className="h-4 w-4 text-[#ff5722]" /> Endpoints y
                    Usuarios Asignados
                  </span>
                  <Button
                    onClick={handleOpenAssignModal}
                    className="bg-[#ff5722] hover:bg-[#f4511e] text-white font-bold h-9 px-3.5 rounded-xl text-xs cursor-pointer shadow-xs"
                  >
                    <Plus className="h-4 w-4 mr-1.5" /> Asignar Nuevo Equipo
                  </Button>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase">
                          <th className="p-3.5">Endpoint / Equipo</th>
                          <th className="p-3.5">Correo Asignado</th>
                          <th className="p-3.5">Fecha Asignación</th>
                          <th className="p-3.5">Credencial / Licencia</th>
                          <th className="p-3.5">Observaciones</th>
                          <th className="p-3.5 text-right">Acción</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                        {boveda?.software_equipos &&
                        boveda.software_equipos.length > 0 ? (
                          boveda.software_equipos.map((item) => (
                            <tr
                              key={item.id_software_equipos}
                              className="hover:bg-slate-50/50 transition-colors"
                            >
                              <td className="p-3.5">
                                <div className="space-y-0.5">
                                  <span className="font-bold text-slate-900 block">
                                    {item.equipos?.nombre_equipo ||
                                      "Equipo sin nombre"}
                                  </span>
                                  <span className="text-[10px] text-slate-400 block font-mono">
                                    {item.equipos?.marca_modelo ||
                                      item.equipos?.tipo ||
                                      "N/A"}
                                  </span>
                                </div>
                              </td>
                              <td className="p-3.5 text-slate-600 font-mono text-[11px]">
                                {item.correo_asociado || "N/A"}
                              </td>
                              <td className="p-3.5 text-slate-500 font-mono text-[11px]">
                                {item.fecha_instalacion
                                  ? new Date(
                                      item.fecha_instalacion,
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </td>
                              <td className="p-3.5">
                                <span className="font-mono text-slate-800 bg-slate-100 px-2 py-1 rounded-md text-[11px]">
                                  {item.licencia_especifica || "••••••••"}
                                </span>
                              </td>
                              <td className="p-3.5 text-slate-500 max-w-[180px] truncate">
                                {item.observaciones || "Sin observaciones"}
                              </td>
                              <td className="p-3.5 text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-bold text-xs gap-1.5 cursor-pointer rounded-lg"
                                  onClick={() =>
                                    setAssignmentToRelease({
                                      id: item.id_software_equipos,
                                      name:
                                        item.equipos?.nombre_equipo ||
                                        "este equipo",
                                    })
                                  }
                                >
                                  <Trash2 className="h-3.5 w-3.5" /> Liberar
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={6}
                              className="py-10 text-center text-slate-400 font-medium"
                            >
                              No hay equipos vinculados a esta bóveda de
                              software actualmente.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-end px-6 py-4 border-t border-slate-100 bg-white">
          <Button
            onClick={onClose}
            className="bg-[#b33900] hover:bg-[#802800] text-white font-bold h-10 px-6 rounded-xl text-xs cursor-pointer shadow-sm"
          >
            Cerrar
          </Button>
        </div>
      </div>

      {/* SUB-MODAL: ASIGNAR NUEVO EQUIPO (CASCADA ÁREA -> EQUIPO) */}
      {isAssignOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h4 className="font-bold text-slate-900 text-sm">
                Asignar Equipo a la Bóveda
              </h4>
              <button
                onClick={() => setIsAssignOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitAssign} className="p-5 space-y-4">
              {/* Selector de Área */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">
                  Seleccionar Área *
                </Label>
                <select
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5722]/20"
                  value={selectedAreaFilter}
                  onChange={(e) => handleAreaChange(e.target.value)}
                  required
                >
                  <option value="">Selecciona un área...</option>
                  {areas.map((ar) => (
                    <option key={String(ar.value)} value={String(ar.value)}>
                      {ar.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selector de Equipo */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">
                  Seleccionar Equipo *
                </Label>
                <select
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5722]/20"
                  value={formAssign.id_equipo}
                  onChange={(e) =>
                    setFormAssign({ ...formAssign, id_equipo: e.target.value })
                  }
                  disabled={!selectedAreaFilter}
                  required
                >
                  <option value="">
                    {selectedAreaFilter
                      ? "Selecciona un equipo..."
                      : "Primero selecciona un área"}
                  </option>
                  {equipos.map((eq) => (
                    <option key={String(eq.value)} value={String(eq.value)}>
                      {eq.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">
                  Correo Asociado
                </Label>
                <Input
                  type="email"
                  placeholder="usuario@empresa.com"
                  value={formAssign.correo_asociado}
                  onChange={(e) =>
                    setFormAssign({
                      ...formAssign,
                      correo_asociado: e.target.value,
                    })
                  }
                  className="h-10 text-xs bg-slate-50"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">
                  Licencia Específica / Clave de Asiento
                </Label>
                <Input
                  type="text"
                  placeholder="XXXXX-KEY-1234"
                  value={formAssign.licencia_especifica}
                  onChange={(e) =>
                    setFormAssign({
                      ...formAssign,
                      licencia_especifica: e.target.value,
                    })
                  }
                  className="h-10 text-xs font-mono bg-slate-50"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">
                  Observaciones
                </Label>
                <Input
                  type="text"
                  placeholder="Ej. Instalado para gerencia..."
                  value={formAssign.observaciones}
                  onChange={(e) =>
                    setFormAssign({
                      ...formAssign,
                      observaciones: e.target.value,
                    })
                  }
                  className="h-10 text-xs bg-slate-50"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">
                  Fecha de Asignación
                </Label>
                <Input
                  type="date"
                  value={formAssign.fecha_instalacion}
                  onChange={(e) =>
                    setFormAssign({
                      ...formAssign,
                      fecha_instalacion: e.target.value,
                    })
                  }
                  className="h-10 text-xs bg-slate-50"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAssignOpen(false)}
                  className="rounded-xl text-xs cursor-pointer"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#ff5722] hover:bg-[#f4511e] text-white font-bold rounded-xl text-xs px-4 cursor-pointer"
                >
                  {isSubmitting ? "Asignando..." : "Confirmar Asignación"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUB-MODAL: CONFIRMAR LIBERACIÓN */}
      {assignmentToRelease && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-3 rounded-xl bg-rose-50">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  Liberar Equipo
                </h4>
                <p className="text-xs text-slate-500">
                  Esta acción liberará el cupo de la bóveda.
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-600">
              ¿Estás seguro de liberar la licencia asignada al equipo{" "}
              <strong className="text-slate-900">
                {assignmentToRelease.name}
              </strong>
              ?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAssignmentToRelease(null)}
                className="rounded-xl text-xs cursor-pointer"
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmRelease}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                Sí, liberar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
