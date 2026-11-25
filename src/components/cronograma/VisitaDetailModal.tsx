import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Wrench,
  MapPin,
  ExternalLink,
  Clock,
  Laptop,
  UserCheck,
  Loader2,
} from "lucide-react";
import { CitaSoporteDetail } from "@/types/cita/cita-soporte.type";

interface VisitaDetailModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  cita: CitaSoporteDetail | null;
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

interface CitaGoogleMapViewProps {
  lat: number;
  lng: number;
  titulo: string;
}

const CitaGoogleMapView: React.FC<CitaGoogleMapViewProps> = ({
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
      setMapError("Falta configurar VITE_GOOGLE_MAPS_API_KEY en el .env.");
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
          draggable: false,
          scrollwheel: false,
          disableDefaultUI: true,
          zoomControl: true,
        });

        new window.google.maps.Marker({
          position,
          map,
          draggable: false,
          title: titulo,
        });

        setIsLoadingMap(false);
      })
      .catch((err) => {
        if (isMounted) {
          setMapError(err?.message || "No se pudo inicializar Google Maps.");
          setIsLoadingMap(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [apiKey, lat, lng, titulo]);

  return (
    <div className="relative w-full h-[220px] rounded-xl bg-slate-200 overflow-hidden border border-slate-200">
      {mapError ? (
        <div className="h-full w-full bg-amber-50/90 p-3 text-[11px] text-amber-800 flex flex-col items-center justify-center text-center gap-1">
          <span>{mapError}</span>
          <span className="font-mono font-bold">
            Lat: {lat} • Lng: {lng}
          </span>
        </div>
      ) : (
        <>
          {isLoadingMap && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-100/90 text-xs text-slate-600 gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-[#ff5722]" />
              Cargando mapa...
            </div>
          )}
          <div ref={mapContainerRef} className="h-full w-full" />
        </>
      )}
    </div>
  );
};

export const VisitaDetailModal = ({
  isOpen,
  onOpenChange,
  cita,
  isLoading = false,
}: VisitaDetailModalProps) => {
  if (!isOpen) return null;

  const lat = cita?.sucursal?.latidud;
  const lng = cita?.sucursal?.longitud;
  const hasCoords = typeof lat === "number" && typeof lng === "number";

  const googleMapsUrl = hasCoords
    ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
    : "";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[760px] p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xl overflow-hidden">
        {isLoading || !cita ? (
          <div className="py-16 flex items-center justify-center gap-2 text-xs font-bold text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin text-[#ff5722]" />
            Cargando detalle de la cita...
          </div>
        ) : (
          <>
            <DialogHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-100 space-y-0 text-left">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-50 border border-orange-100 text-[#ff5722]">
                  <Wrench className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <span>Detalle de Cita Técnica — #{cita.id_cita}</span>
                  </DialogTitle>
                  <span className="text-xs text-slate-400 font-medium">
                    Programada para{" "}
                    {new Date(cita.fecha_programada).toLocaleDateString(
                      "es-PE",
                      {
                        timeZone: "UTC",
                      },
                    )}
                  </span>
                </div>
              </div>

              <Badge
                variant="outline"
                className="font-bold text-[11px] px-3 py-1 bg-purple-50 text-purple-700 border-purple-200 uppercase"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-1.5 animate-pulse" />
                {cita.estado}
              </Badge>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Cliente & Sucursal
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                      RUC: {cita.cliente.numero_documento}
                    </span>
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900">
                    {cita.cliente.nombre_principal} —{" "}
                    {cita.sucursal.nombre_sucursal}
                  </h4>
                  <div className="flex items-start gap-2 text-xs text-slate-600 font-medium">
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>{cita.sucursal.direccion}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Técnico Asignado
                    </span>
                    <div className="flex items-center gap-2 pt-1">
                      <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                        {cita.tecnico.nombre[0]}
                        {cita.tecnico.apellido[0]}
                      </div>
                      <span className="text-xs font-bold text-slate-800 truncate">
                        {cita.tecnico.nombre} {cita.tecnico.apellido}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Área / Solicitante
                    </span>
                    <span className="text-xs font-bold text-slate-800 block pt-1 truncate">
                      {cita.area?.nombre_area || "General"}
                    </span>
                    {cita.trabajador && (
                      <span className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                        <UserCheck className="h-3 w-3 shrink-0" />
                        {cita.trabajador.nombre} {cita.trabajador.apellido}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Observaciones & Equipo
                  </span>
                  <p className="text-xs font-medium text-slate-700">
                    {cita.observaciones || "Sin observaciones registradas."}
                  </p>
                  {cita.equipo && (
                    <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-xs text-slate-600">
                      <span className="flex items-center gap-1.5 font-semibold">
                        <Laptop className="h-3.5 w-3.5 text-slate-400" />
                        Equipo #{cita.equipo.id_equipo} ({cita.equipo.tipo})
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3 flex flex-col">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5 flex-1 flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Geolocalización de la Sede
                    </span>
                    {hasCoords && (
                      <span className="text-[10px] font-mono font-bold text-slate-500">
                        {lat.toFixed(6)}, {lng.toFixed(6)}
                      </span>
                    )}
                  </div>

                  {hasCoords ? (
                    <CitaGoogleMapView
                      lat={lat}
                      lng={lng}
                      titulo={cita.sucursal.nombre_sucursal}
                    />
                  ) : (
                    <div className="relative w-full h-[220px] rounded-xl bg-slate-200 overflow-hidden border border-slate-200 flex items-center justify-center p-4 text-center">
                      <p className="text-xs font-semibold text-slate-500">
                        Esta sucursal no tiene coordenadas registradas.
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200/60 text-xs">
                    <span className="text-slate-600 font-medium flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-blue-500" />
                      Inicio:{" "}
                      {new Date(cita.hora_inicio).toLocaleTimeString("es-PE", {
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: "UTC",
                      })}
                    </span>
                    <span className="font-bold text-slate-800">
                      Fin:{" "}
                      {new Date(cita.hora_fin).toLocaleTimeString("es-PE", {
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: "UTC",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-10 px-5 text-xs font-bold text-slate-700 border-slate-200 cursor-pointer"
              >
                Cerrar
              </Button>

              {hasCoords && (
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="h-10 px-5 text-xs font-bold bg-[#ff5722] hover:bg-[#f4511e] text-white shadow-sm cursor-pointer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Abrir en Google Maps
                  </Button>
                </a>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
