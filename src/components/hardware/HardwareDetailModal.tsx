import { X, Download, MapPin, HardDrive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useHardwareDetail } from "@/hooks/hardware/useHardware";

interface HardwareDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  hardwareId: number | null;
}

export const HardwareDetailModal = ({
  isOpen,
  onClose,
  hardwareId,
}: HardwareDetailModalProps) => {
  const { hardware, isLoading } = useHardwareDetail(hardwareId ?? undefined);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Cabecera Principal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-50 text-[#ff5722]">
              <HardDrive className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">
                {isLoading ? "Cargando información..." : hardware?.marca_modelo}
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">
                S/N: {hardware?.numero_serie}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {isLoading ? (
            <div className="py-12 text-center text-xs text-slate-400">
              Cargando hoja de vida del componente...
            </div>
          ) : hardware ? (
            <>
              {/* Tarjeta de Resumen Técnico */}
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className="bg-orange-50 text-[#ff5722] border-orange-200 font-bold text-[10px]"
                  >
                    {hardware.tipo_componente_label}
                  </Badge>
                  <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1.5 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {hardware.estado_label}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block uppercase font-bold text-[9px]">
                      Proveedor
                    </span>
                    <span className="font-semibold text-slate-700">
                      {hardware.proveedor}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block uppercase font-bold text-[9px]">
                      Fecha Compra
                    </span>
                    <span className="font-semibold text-slate-700">
                      {new Date(hardware.fecha_compra).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block uppercase font-bold text-[9px]">
                      Costo S/. soles
                    </span>
                    <span className="font-semibold text-slate-700">
                      S/. {hardware.costo_unitario}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block uppercase font-bold text-[9px]">
                      Comprobante
                    </span>
                    <span className="font-semibold text-slate-700 truncate block">
                      {hardware.url_factura ? "Factura Adjunta" : "N/D"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Ubicación y Asignación Actual */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Ubicación y Asignación Actual
                </span>
                {hardware.equipo_actual ? (
                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-blue-50/40 border border-blue-100">
                    <div className="p-2 rounded-xl bg-blue-100 text-blue-600 mt-0.5">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-extrabold text-xs text-slate-900 block">
                        {hardware.equipo_actual.nombre_equipo} (
                        {hardware.equipo_actual.area.nombre_area})
                      </span>
                      <span className="text-[11px] text-slate-600 block">
                        Cliente:{" "}
                        {hardware.equipo_actual.cliente.nombre_principal} —
                        Sucursal:{" "}
                        {hardware.equipo_actual.sucursal.nombre_sucursal}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 italic">
                    Actualmente se encuentra en Almacén Central (Stock
                    Disponible).
                  </div>
                )}
              </div>

              {/* Trazabilidad e Historial de Movimientos */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Trazabilidad e Historial de Movimientos
                </span>

                <div className="space-y-3 pl-2 border-l-2 border-slate-200 ml-2">
                  {hardware.historial && hardware.historial.length > 0 ? (
                    hardware.historial.map((item, idx) => (
                      <div
                        key={item.id_RH || idx}
                        className="relative pl-4 space-y-1"
                      >
                        <div
                          className={`absolute -left-[25px] top-1 w-3 h-3 rounded-full border-2 border-white ${item.is_actual ? "bg-[#ff5722]" : "bg-slate-400"}`}
                        />
                        <span className="font-bold text-xs text-slate-900 block">
                          Instalación en{" "}
                          {item.equipo?.nombre_equipo || "Equipo General"}
                        </span>
                        <p className="text-[11px] text-slate-600">
                          {item.motivo_retiro
                            ? `Motivo de retiro: ${item.motivo_retiro}`
                            : "Instalado y operando de forma activa en el equipo."}
                        </p>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          {new Date(item.fecha_instalacion).toLocaleString()}{" "}
                          {item.tecnico_responsable
                            ? `— Técnico: ${item.tecnico_responsable.nombre} ${item.tecnico_responsable.apellido}`
                            : ""}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 pl-4">
                      No registra movimientos previos en el historial.
                    </p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-xs text-slate-400">
              No se encontró información para este hardware.
            </div>
          )}
        </div>

        {/* Pie de Página con Acciones */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <div>
            {hardware?.url_factura && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-xs font-bold rounded-xl cursor-pointer"
                onClick={() => window.open(hardware.url_factura!, "_blank")}
              >
                <Download className="h-3.5 w-3.5" />
                Descargar Factura
              </Button>
            )}
          </div>
          <Button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl px-5 cursor-pointer"
          >
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
};
