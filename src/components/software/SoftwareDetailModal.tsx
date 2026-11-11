import {
  X,
  Shield,
  Calendar,
  KeyRound,
  Layers,
  Download,
  CheckCircle2,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useSoftwareDetail } from "@/hooks/software/useSoftware";

interface SoftwareDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  softwareId: number | string | null;
}

export const SoftwareDetailModal = ({
  isOpen,
  onClose,
  softwareId,
}: SoftwareDetailModalProps) => {
  // Consumimos el hook que ya creamos para obtener la información detallada por ID
  const { software, isLoading } = useSoftwareDetail(softwareId ?? undefined);

  if (!isOpen) return null;

  const handleCopyKey = (key?: string | null) => {
    if (!key) return;
    navigator.clipboard.writeText(key);
    toast.success("Clave KMS copiada al portapapeles");
  };

  const handleDownloadPdf = () => {
    toast.info("Generando ficha de auditoría en PDF...");
  };

  // Cálculos de ocupación basados en los datos del backend
  const usados = software?.licencias_usadas ?? 0;
  const total = software?.limite_equipos ?? 1;
  const porcentaje = Math.round((usados / total) * 100);
  const libres = Math.max(0, total - usados);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* CABECERA */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#ff5722] text-white flex items-center justify-center shadow-md">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Detalle y Trazabilidad del Lote de Software
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {isLoading
                  ? "Cargando..."
                  : `${software?.nombre_software || "Software"} • Cliente ID: #${software?.id_cliente || "Global"}`}
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

        {/* CONTENIDO PRINCIPAL */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {isLoading ? (
            <div className="py-12 text-center text-xs text-slate-400 font-medium">
              Cargando información del software...
            </div>
          ) : (
            <>
              {/* 1. INFORMACIÓN DE PROPIEDAD Y UBICACIÓN */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <Layers className="h-4 w-4 text-[#ff5722]" />
                  <span>INFORMACIÓN DE PROPIEDAD Y UBICACIÓN</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">
                      Empresa / Cliente
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      Cliente ID: #{software?.id_cliente || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">
                      Sucursal Específica
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      Sucursal ID: #{software?.id_sucursal || "Central"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">
                      Categoría
                    </span>
                    <Badge
                      variant="outline"
                      className="mt-0.5 text-[11px] bg-blue-50 text-blue-700 border-blue-200 font-semibold"
                    >
                      {software?.categoria || "General"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* 2. TRAZABILIDAD DE COMPRA Y PROVEEDOR */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <Calendar className="h-4 w-4 text-[#ff5722]" />
                  <span>TRAZABILIDAD DE COMPRA Y PROVEEDOR</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">
                      Proveedor / Distribuidor
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {software?.proveedor || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">
                      Fecha de Compra
                    </span>
                    <span className="text-xs font-bold text-slate-800 font-mono">
                      {software?.fecha_compra
                        ? new Date(software.fecha_compra).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">
                      Fecha de Expiración / Caducidad
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-bold text-slate-800 font-mono">
                        {software?.fecha_caducidad
                          ? new Date(
                              software.fecha_caducidad,
                            ).toLocaleDateString()
                          : "Permanente"}
                      </span>
                      <Badge
                        variant="outline"
                        className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold"
                      >
                        <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-500" />{" "}
                        Vigente
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. ESQUEMA DE LICENCIAMIENTO */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <KeyRound className="h-4 w-4 text-[#ff5722]" />
                  <span>ESQUEMA DE LICENCIAMIENTO</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">
                      Tipo de Modelo
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {software?.tipo_licencia || "Pool Limitado"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">
                      Capacidad Total Adquirida
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {total} Cupos
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">
                      Requiere Credenciales Individuales
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      Sí (Correo / Password)
                    </span>
                  </div>
                </div>

                {/* Master Key */}
                <div className="pt-2 flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200/80">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                      Master Key / Clave KMS
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-900">
                      {software?.licencia_master_key ||
                        "••••••••••••••••••••••••••••"}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs font-semibold gap-1.5 cursor-pointer bg-slate-50 hover:bg-slate-100"
                    onClick={() => handleCopyKey(software?.licencia_master_key)}
                  >
                    <Copy className="h-3.5 w-3.5 text-slate-500" /> Copiar Clave
                    KMS
                  </Button>
                </div>
              </div>

              {/* 4. RESUMEN DE USO DEL LOTE */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">
                    Resumen de Uso del Lote
                  </span>
                  <span className="font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200/60 text-[11px]">
                    {libres} cupos libres disponibles
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 pt-1">
                  <span>
                    {usados} / {total} Cupos Usados{" "}
                    <span className="font-normal text-slate-400">
                      ({porcentaje}% de ocupación)
                    </span>
                  </span>
                  <span className="text-slate-600 font-normal">
                    {libres} Libres
                  </span>
                </div>
                {/* Barra de progreso */}
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#b33900] rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(porcentaje, 100)}%` }}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* PIE DE MODAL */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <Button
            variant="outline"
            className="text-xs font-semibold h-10 gap-2 rounded-xl bg-white hover:bg-slate-50 border-slate-200 cursor-pointer text-slate-700"
            onClick={handleDownloadPdf}
          >
            <Download className="h-4 w-4 text-slate-500" /> Descargar Ficha de
            Auditoría / PDF
          </Button>
          <Button
            onClick={onClose}
            className="bg-[#b33900] hover:bg-[#802800] text-white font-bold h-10 px-5 rounded-xl text-xs cursor-pointer"
          >
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
};
