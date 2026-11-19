import { useState, useEffect } from "react";
import {
  X,
  MapPin,
  Sparkles,
  Calendar,
  Clock,
  Lock,
  Loader2,
  CheckCircle2,
  Building2,
  AlertCircle,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  getAutoAsignarInSitu,
  getDisponibilidadTecnico,
  createSoftLock,
  derivarTicketInSitu,
} from "@/services/citas/cita-soporte.service";
import {
  AutoAsignarResponse,
  FranjaDisponibilidad,
} from "@/types/cita/cita-soporte.type";

interface TecnicoOption {
  id: number;
  nombre: string;
}

interface DeriveInSituModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketId: number;
  sucursalId: number;
  sucursalNombre: string;
  usuarioId: number;
  tecnicos?: TecnicoOption[];
  onSuccess: () => void;
}

const getLocalTodayStr = (): string => {
  const ahora = new Date();
  const year = ahora.getFullYear();
  const month = String(ahora.getMonth() + 1).padStart(2, "0");
  const day = String(ahora.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Verifica si una franja (ej. "09:00 - 12:00") ya pasó respecto a la fecha y hora local actual
const isFranjaPasada = (fechaSeleccionada: string, franja: string): boolean => {
  if (!fechaSeleccionada || !franja) return false;

  const hoyStr = getLocalTodayStr();
  if (fechaSeleccionada < hoyStr) return true;
  if (fechaSeleccionada > hoyStr) return false;

  const partes = franja.split("-").map((p) => p.trim());
  const horaFinStr = partes[1] || partes[0];
  if (!horaFinStr || !horaFinStr.includes(":")) return false;

  const [horas, minutos] = horaFinStr.split(":").map(Number);
  if (Number.isNaN(horas)) return false;

  const ahora = new Date();
  const limiteFranja = new Date(ahora);
  limiteFranja.setHours(horas, Number.isNaN(minutos) ? 0 : minutos, 0, 0);

  return ahora >= limiteFranja;
};

export const DeriveInSituModal = ({
  isOpen,
  onClose,
  ticketId,
  sucursalId,
  sucursalNombre,
  usuarioId,
  tecnicos = [],
  onSuccess,
}: DeriveInSituModalProps) => {
  const today = getLocalTodayStr();

  const [fecha, setFecha] = useState<string>(today);
  const [selectedTecnicoId, setSelectedTecnicoId] = useState<number | null>(
    null,
  );
  const [selectedTecnicoNombre, setSelectedTecnicoNombre] =
    useState<string>("");
  const [selectedFranja, setSelectedFranja] = useState<string>("");
  const [observaciones, setObservaciones] = useState<string>("");

  const [sugerencia, setSugerencia] = useState<AutoAsignarResponse | null>(
    null,
  );
  const [loadingSugerencia, setLoadingSugerencia] = useState(false);

  const [franjas, setFranjas] = useState<FranjaDisponibilidad[]>([]);
  const [loadingFranjas, setLoadingFranjas] = useState(false);

  const [lockToken, setLockToken] = useState<string | null>(null);
  const [lockingFranja, setLockingFranja] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reiniciar estado al abrir el modal
  useEffect(() => {
    if (isOpen) {
      setFecha(getLocalTodayStr());
      setSelectedTecnicoId(null);
      setSelectedTecnicoNombre("");
      setSelectedFranja("");
      setLockToken(null);
      setFranjas([]);
      setObservaciones("");
    }
  }, [isOpen]);

  // 1. Consultar AUTO-ASIGNAR al abrir o cambiar fecha -> asigna automáticamente el técnico recomendado
  useEffect(() => {
    if (!isOpen || !sucursalId || !fecha) return;

    setLockToken(null);
    setSelectedFranja("");
    setSelectedTecnicoId(null);
    setSelectedTecnicoNombre("");

    const fetchAutoAsignar = async () => {
      setLoadingSugerencia(true);
      setSugerencia(null);
      try {
        const res = await getAutoAsignarInSitu(sucursalId, fecha);
        setSugerencia(res);

        if (res?.id_tecnico) {
          setSelectedTecnicoId(res.id_tecnico);
          setSelectedTecnicoNombre(
            res.nombre_tecnico || `Técnico #${res.id_tecnico}`,
          );
        }
      } catch {
        setSugerencia(null);
        // Respaldo: si no hay auto-asignación y hay técnicos cargados, toma el primero
        if (tecnicos.length > 0) {
          setSelectedTecnicoId(tecnicos[0].id);
          setSelectedTecnicoNombre(tecnicos[0].nombre);
        }
      } finally {
        setLoadingSugerencia(false);
      }
    };

    fetchAutoAsignar();
  }, [isOpen, sucursalId, fecha]);

  // 2. Cargar franjas horarias automáticamente para el técnico asignado
  useEffect(() => {
    if (!isOpen || !selectedTecnicoId || !fecha || !sucursalId) {
      setFranjas([]);
      return;
    }

    const fetchDisponibilidad = async () => {
      setLoadingFranjas(true);
      try {
        const res = await getDisponibilidadTecnico(
          selectedTecnicoId,
          fecha,
          sucursalId,
        );
        setFranjas(res || []);
      } catch {
        toast.error("No se pudo cargar la disponibilidad del técnico.");
        setFranjas([]);
      } finally {
        setLoadingFranjas(false);
      }
    };

    fetchDisponibilidad();
  }, [isOpen, selectedTecnicoId, fecha, sucursalId]);

  // 3. Crear SOFT-LOCK al seleccionar una franja horaria vigente
  const handleSelectFranja = async (franja: string, tecIdParam?: number) => {
    if (isFranjaPasada(fecha, franja)) {
      toast.error("No puedes reservar una franja horaria que ya pasó.");
      return;
    }

    const tecId = tecIdParam ?? selectedTecnicoId;
    if (!tecId || !fecha) return;

    setLockingFranja(true);
    setLockToken(null);
    setSelectedFranja(franja);

    try {
      const res = await createSoftLock({
        id_tecnico: tecId,
        fecha,
        franja,
      });
      setLockToken(res.lock_token);
      toast.success(`Franja ${franja} reservada por 5 minutos.`);
    } catch (error: any) {
      setSelectedFranja("");
      toast.error(
        error?.response?.data?.message ||
          "Esta franja acaba de ser ocupada por otro operador.",
      );
    } finally {
      setLockingFranja(false);
    }
  };

  const sugerenciaEsPasada = sugerencia
    ? isFranjaPasada(fecha, sugerencia.franja_recomendada)
    : false;

  const handleReservarFranjaSugerida = async () => {
    if (!sugerencia || sugerenciaEsPasada) return;
    setSelectedTecnicoId(sugerencia.id_tecnico);
    setSelectedTecnicoNombre(sugerencia.nombre_tecnico);
    await handleSelectFranja(
      sugerencia.franja_recomendada,
      sugerencia.id_tecnico,
    );
  };

  // 4. Confirmar Derivación (POST /citas-soporte/derivar)
  const handleConfirmarDerivacion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lockToken) {
      toast.error("Selecciona una franja horaria vigente para reservar.");
      return;
    }

    setIsSubmitting(true);
    try {
      await derivarTicketInSitu({
        lock_token: lockToken,
        id_ticket: ticketId,
        id_sucursal: sucursalId,
        id_usuario: usuarioId,
        observaciones: observaciones.trim() || undefined,
      });
      toast.success("Ticket derivado a visita In-Situ y cita agendada.");
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Error al crear la cita. Verifica que tu reserva no haya expirado.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-purple-600 text-white flex items-center justify-center">
              <MapPin className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm tracking-wide">
                Derivar a Visita In-Situ
              </h3>
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <Building2 className="h-3 w-3" /> Sede: {sucursalNombre}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleConfirmarDerivacion} className="p-5 space-y-4">
          {/* PASO 1: FECHA DE VISITA */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-purple-600" />
              1. Fecha de Visita Programada *
            </Label>
            <input
              type="date"
              min={today}
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              required
            />
          </div>

          {/* RECOMENDACIÓN INTELIGENTE (TÉCNICO AUTO-ASIGNADO POR ZONA Y CARGA) */}
          {loadingSugerencia ? (
            <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100 flex items-center gap-2 text-purple-700 text-xs font-semibold">
              <Loader2 className="h-4 w-4 animate-spin" />
              Asignando técnico por zona y disponibilidad...
            </div>
          ) : sugerencia ? (
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5 text-purple-900 font-extrabold text-xs">
                  <Sparkles className="h-4 w-4 text-purple-600 shrink-0" />
                  Técnico Asignado Automáticamente
                </div>
                {sugerencia.es_agrupado_por_sucursal && (
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px] font-bold">
                    Agrupado en misma ruta
                  </Badge>
                )}
              </div>

              <p className="text-[11px] text-slate-700 leading-snug">
                Técnico asignado:{" "}
                <span className="font-extrabold text-slate-900">
                  {sugerencia.nombre_tecnico}
                </span>{" "}
                • Franja sugerida:{" "}
                <span className="font-extrabold text-purple-700">
                  {sugerencia.franja_recomendada}
                </span>
                . ({sugerencia.motivo_asignacion})
              </p>

              {sugerenciaEsPasada ? (
                <p className="text-[11px] font-semibold text-amber-800 bg-amber-100/80 border border-amber-200 rounded-lg px-2.5 py-1.5">
                  La franja sugerida ({sugerencia.franja_recomendada}) ya pasó.
                  Elige una franja vigente abajo o cambia la fecha.
                </p>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  onClick={handleReservarFranjaSugerida}
                  disabled={lockingFranja}
                  className="w-full h-8 bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] rounded-lg cursor-pointer"
                >
                  Reservar Franja Sugerida ({sugerencia.franja_recomendada})
                </Button>
              )}
            </div>
          ) : null}

          {/* TÉCNICO ASIGNADO (SOLO LECTURA POR AUTO-ASIGNACIÓN, CON FALLBACK SI NO HUBO SUGERENCIA) */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <UserCheck className="h-3.5 w-3.5 text-purple-600" />
              2. Técnico In-Situ Asignado
            </Label>
            {selectedTecnicoNombre ? (
              <div className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-bold bg-slate-100 text-slate-800 flex items-center justify-between">
                <span>{selectedTecnicoNombre}</span>
                <span className="text-[10px] text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md font-bold">
                  Auto-asignado
                </span>
              </div>
            ) : (
              <div className="w-full h-10 px-3 rounded-xl border border-amber-200 text-xs font-semibold bg-amber-50 text-amber-800 flex items-center">
                {loadingSugerencia
                  ? "Buscando técnico disponible..."
                  : "Sin técnico auto-asignado para esta fecha"}
              </div>
            )}
          </div>

          {/* PASO 3: SELECCIÓN DE FRANJA HORARIA (CAMBIABLE POR EL USUARIO) */}
          {selectedTecnicoId && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-purple-600" />
                  3. Selecciona Franja Horaria *
                </Label>
                {lockToken && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <Lock className="h-3 w-3" /> Reservado (5 min)
                  </span>
                )}
              </div>

              {loadingFranjas ? (
                <div className="py-4 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Cargando
                  horarios...
                </div>
              ) : franjas.length === 0 ? (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  No hay franjas configuradas para este técnico en esta fecha.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {franjas.map((item) => {
                    const esPasada = isFranjaPasada(fecha, item.franja);
                    const bloqueada =
                      !item.disponible || esPasada || lockingFranja;
                    const isSelected = selectedFranja === item.franja;

                    return (
                      <button
                        key={item.franja}
                        type="button"
                        disabled={bloqueada}
                        onClick={() => handleSelectFranja(item.franja)}
                        className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                          !item.disponible || esPasada
                            ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60"
                            : isSelected && lockToken
                              ? "bg-purple-600 border-purple-600 text-white font-extrabold shadow-xs"
                              : "bg-white border-slate-200 hover:border-purple-400 text-slate-800 font-bold cursor-pointer"
                        }`}
                      >
                        <span className="text-xs">{item.franja}</span>
                        {esPasada ? (
                          <span className="text-[9px] uppercase font-bold">
                            Pasado
                          </span>
                        ) : !item.disponible ? (
                          <span className="text-[9px] uppercase font-bold">
                            Ocupado
                          </span>
                        ) : isSelected && lockToken ? (
                          <CheckCircle2 className="h-4 w-4 text-white" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* PASO 4: OBSERVACIONES */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700">
              Observaciones para la visita (Opcional)
            </Label>
            <textarea
              className="w-full h-20 p-3 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 focus:bg-white focus:outline-none resize-none"
              placeholder="Ej. Llevar repuesto de teclado o contactar con recepción al llegar."
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
            />
          </div>

          {/* BOTONES FINALES */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl text-xs cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!lockToken || isSubmitting || lockingFranja}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs px-4 cursor-pointer"
            >
              {isSubmitting && (
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
              )}
              Confirmar Derivación In-Situ
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
