import * as React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  User,
  Layers,
  ShieldCheck,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SucursalDetail } from "@/types/sucursal/sucursal.types";

interface SucursalDetailModalProps {
  sucursal:
    | (SucursalDetail & {
        latitud?: number | string | null;
        longitud?: number | string | null;
      })
    | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading?: boolean;
}

declare global {
  interface Window {
    google?: any;
    __googleMapsPromise?: Promise<void>;
  }
}

function loadGoogleMapsScript(apiKey: string): Promise<void> {
  if (window.google?.maps) return Promise.resolve();
  if (window.__googleMapsPromise) return window.__googleMapsPromise;

  window.__googleMapsPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com/maps/api/js"]',
    );
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve());
      existingScript.addEventListener("error", () =>
        reject(new Error("Error al cargar Google Maps")),
      );
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&v=weekly`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Error al cargar Google Maps"));
    document.head.appendChild(script);
  });

  return window.__googleMapsPromise;
}

interface SucursalLocationMapProps {
  lat: number;
  lng: number;
  titulo: string;
}

const SucursalLocationMap: React.FC<SucursalLocationMapProps> = ({
  lat,
  lng,
  titulo,
}) => {
  const mapContainerRef = React.useRef<HTMLDivElement | null>(null);
  const [isLoadingMap, setIsLoadingMap] = React.useState(true);
  const [mapError, setMapError] = React.useState<string | null>(null);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

  React.useEffect(() => {
    let isMounted = true;
    setIsLoadingMap(true);
    setMapError(null);

    if (!apiKey || apiKey === "TU_API_KEY_DE_GOOGLE_MAPS") {
      setMapError(
        "Configura VITE_GOOGLE_MAPS_API_KEY para visualizar el mapa.",
      );
      setIsLoadingMap(false);
      return;
    }

    loadGoogleMapsScript(apiKey)
      .then(() => {
        if (!isMounted || !mapContainerRef.current || !window.google?.maps) {
          return;
        }

        const position = { lat, lng };
        const map = new window.google.maps.Map(mapContainerRef.current, {
          center: position,
          zoom: 16,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        });

        new window.google.maps.Marker({
          position,
          map,
          title: titulo,
        });

        setIsLoadingMap(false);
      })
      .catch((err) => {
        if (isMounted) {
          setMapError(err?.message || "No se pudo cargar Google Maps.");
          setIsLoadingMap(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [apiKey, lat, lng, titulo]);

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  return (
    <div className="space-y-2">
      {mapError ? (
        <div className="h-44 rounded-xl border border-amber-200 bg-amber-50/90 p-3 text-[11px] text-amber-800 flex items-center justify-center text-center">
          {mapError}
        </div>
      ) : (
        <div className="relative h-44 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
          {isLoadingMap && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-100/90 text-xs text-slate-600 gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-[#ff5722]" />
              Cargando mapa de la sede...
            </div>
          )}
          <div ref={mapContainerRef} className="h-full w-full" />
        </div>
      )}

      <div className="flex justify-end">
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#ff5722] hover:underline"
        >
          Abrir en Google Maps <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
};

export const SucursalDetailModal = ({
  sucursal,
  isOpen,
  onOpenChange,
  isLoading = false,
}: SucursalDetailModalProps) => {
  if (!isOpen) return null;

  const totalAreas = sucursal?.areasVinculadas?.length || 0;
  const encargado = sucursal?.encargado;
  const cliente = sucursal?.clienteEmpresa;

  const parsedLat =
    sucursal?.latitud != null && String(sucursal.latitud).trim() !== ""
      ? Number(sucursal.latitud)
      : NaN;
  const parsedLng =
    sucursal?.longitud != null && String(sucursal.longitud).trim() !== ""
      ? Number(sucursal.longitud)
      : NaN;

  const hasCoords =
    !Number.isNaN(parsedLat) &&
    !Number.isNaN(parsedLng) &&
    parsedLat >= -90 &&
    parsedLat <= 90 &&
    parsedLng >= -180 &&
    parsedLng <= 180;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto p-6 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-5">
        <div className="flex items-center justify-between pt-1 pr-9">
          <div className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-orange-50 text-[#ff5722] border border-orange-200/60">
            Ficha Informativa
          </div>
          {sucursal?.id_sucursal && (
            <span className="text-xs font-bold text-slate-400">
              ID: SUC-{sucursal.id_sucursal}
            </span>
          )}
        </div>

        {isLoading || !sucursal ? (
          <div className="py-12 text-center text-xs text-slate-400 font-medium animate-pulse">
            Cargando información de la sede...
          </div>
        ) : (
          <>
            {/* Cabecera Principal */}
            <div className="flex items-start gap-3.5 pb-2">
              <div className="h-12 w-12 rounded-2xl bg-[#ff5722] text-white flex items-center justify-center shrink-0 shadow-md">
                <Building2 className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-extrabold text-slate-900 leading-snug">
                    {sucursal.nombre_sucursal}
                  </h3>
                  <Badge
                    variant="outline"
                    className={`font-bold text-[10px] px-2.5 py-0.5 rounded-full ${
                      sucursal.is_active
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                  >
                    • {sucursal.is_active ? "Operativa" : "Inactiva"}
                  </Badge>
                </div>
                <p className="text-xs font-bold text-slate-700">
                  {cliente?.nombre_principal || "Empresa no asignada"}
                </p>
                {cliente?.numero_documento && (
                  <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                    <span>RUC: {cliente.numero_documento}</span>
                    <span>•</span>
                    <span className="text-[#ff5722] font-semibold flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" /> Contrato Corporativo
                      Activo
                    </span>
                  </p>
                )}
              </div>
            </div>

            {/* Grid de Información (2 columnas) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Encargado Local */}
              <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="h-3 w-3 text-slate-400" /> Encargado Local
                </span>
                <p className="text-xs font-bold text-slate-800 truncate">
                  {encargado
                    ? `${encargado.nombre} ${encargado.apellido}`
                    : "No asignado"}
                </p>
              </div>

              {/* Áreas Vinculadas */}
              <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="h-3 w-3 text-slate-400" /> Áreas Vinculadas
                </span>
                <p className="text-xs font-bold text-blue-600">
                  {totalAreas === 1
                    ? "1 Área IT Asignada"
                    : `${totalAreas} Áreas IT Asignadas`}
                </p>
              </div>

              {/* Teléfono */}
              <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Phone className="h-3 w-3 text-slate-400" /> Teléfono
                </span>
                <p className="text-xs font-bold text-slate-800 truncate">
                  {encargado?.telefono_contacto || "Sin teléfono registrado"}
                </p>
              </div>

              {/* Correo Electrónico */}
              <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-slate-400" /> Correo
                  Electrónico
                </span>
                <p
                  className="text-xs font-bold text-slate-800 truncate"
                  title={encargado?.correo_corporativo || ""}
                >
                  {encargado?.correo_corporativo || "Sin correo registrado"}
                </p>
              </div>

              {/* Dirección Completa + Coordenadas + Mapa */}
              <div className="col-span-1 sm:col-span-2 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-2.5">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[#ff5722]" /> Dirección y
                  Ubicación Geográfica
                </span>
                <p className="text-xs font-bold text-slate-800 leading-relaxed">
                  {sucursal.direccion || "Sin dirección fiscal registrada"}
                </p>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="rounded-lg bg-white border border-slate-200/80 px-2.5 py-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">
                      Latitud
                    </span>
                    <span className="text-xs font-extrabold text-slate-800">
                      {hasCoords ? parsedLat.toFixed(6) : "No registrada"}
                    </span>
                  </div>
                  <div className="rounded-lg bg-white border border-slate-200/80 px-2.5 py-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">
                      Longitud
                    </span>
                    <span className="text-xs font-extrabold text-slate-800">
                      {hasCoords ? parsedLng.toFixed(6) : "No registrada"}
                    </span>
                  </div>
                </div>

                {hasCoords ? (
                  <SucursalLocationMap
                    lat={parsedLat}
                    lng={parsedLng}
                    titulo={sucursal.nombre_sucursal}
                  />
                ) : (
                  <p className="text-[11px] text-slate-400 font-medium pt-1">
                    Esta sucursal aún no tiene coordenadas (latitud/longitud)
                    asignadas para mostrar en el mapa.
                  </p>
                )}
              </div>
            </div>

            {/* Pie del Modal */}
            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <Button
                onClick={() => onOpenChange(false)}
                className="h-10 px-6 text-xs font-bold bg-[#ff5722] hover:bg-[#f4511e] text-white shadow-sm rounded-xl cursor-pointer"
              >
                Cerrar
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
