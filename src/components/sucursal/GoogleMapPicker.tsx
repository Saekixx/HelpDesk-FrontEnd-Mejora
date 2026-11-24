import * as React from "react";
import { MapPin, LocateFixed, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GoogleMapPickerProps {
  latitud?: number | null;
  longitud?: number | null;
  onChange: (coords: { latitud: number; longitud: number }) => void;
}

const DEFAULT_CENTER = { lat: -12.046374, lng: -77.042793 };

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

export const GoogleMapPicker: React.FC<GoogleMapPickerProps> = ({
  latitud,
  longitud,
  onChange,
}) => {
  const mapContainerRef = React.useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = React.useRef<any>(null);
  const markerInstanceRef = React.useRef<any>(null);

  const [isLoadingMap, setIsLoadingMap] = React.useState(true);
  const [mapError, setMapError] = React.useState<string | null>(null);
  const [locating, setLocating] = React.useState(false);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

  const hasValidCoords =
    typeof latitud === "number" &&
    typeof longitud === "number" &&
    !Number.isNaN(latitud) &&
    !Number.isNaN(longitud);

  const activeCoords = hasValidCoords
    ? { lat: latitud, lng: longitud }
    : DEFAULT_CENTER;

  React.useEffect(() => {
    let isMounted = true;

    if (!apiKey) {
      setMapError(
        "Falta configurar VITE_GOOGLE_MAPS_API_KEY en tu archivo .env.",
      );
      setIsLoadingMap(false);
      return;
    }

    loadGoogleMapsScript(apiKey)
      .then(() => {
        if (!isMounted || !mapContainerRef.current || !window.google?.maps) {
          return;
        }

        const map = new window.google.maps.Map(mapContainerRef.current, {
          center: activeCoords,
          zoom: hasValidCoords ? 16 : 12,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        });

        const marker = new window.google.maps.Marker({
          position: activeCoords,
          map,
          draggable: true,
          title: "Ubicación de la sucursal",
        });

        map.addListener("click", (event: any) => {
          const clickedLat = event?.latLng?.lat();
          const clickedLng = event?.latLng?.lng();
          if (
            typeof clickedLat === "number" &&
            typeof clickedLng === "number"
          ) {
            const roundedLat = Number(clickedLat.toFixed(6));
            const roundedLng = Number(clickedLng.toFixed(6));
            marker.setPosition({ lat: roundedLat, lng: roundedLng });
            onChange({ latitud: roundedLat, longitud: roundedLng });
          }
        });

        marker.addListener("dragend", (event: any) => {
          const draggedLat = event?.latLng?.lat();
          const draggedLng = event?.latLng?.lng();
          if (
            typeof draggedLat === "number" &&
            typeof draggedLng === "number"
          ) {
            const roundedLat = Number(draggedLat.toFixed(6));
            const roundedLng = Number(draggedLng.toFixed(6));
            onChange({ latitud: roundedLat, longitud: roundedLng });
          }
        });

        mapInstanceRef.current = map;
        markerInstanceRef.current = marker;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey]);

  React.useEffect(() => {
    if (
      !hasValidCoords ||
      !mapInstanceRef.current ||
      !markerInstanceRef.current
    ) {
      return;
    }

    const nextPos = { lat: latitud, lng: longitud };
    const currentMarkerPos = markerInstanceRef.current.getPosition();
    const diffLat = currentMarkerPos
      ? Math.abs(currentMarkerPos.lat() - latitud)
      : 1;
    const diffLng = currentMarkerPos
      ? Math.abs(currentMarkerPos.lng() - longitud)
      : 1;

    if (diffLat > 0.000001 || diffLng > 0.000001) {
      markerInstanceRef.current.setPosition(nextPos);
      mapInstanceRef.current.panTo(nextPos);
    }
  }, [latitud, longitud, hasValidCoords]);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setMapError("Tu navegador no soporta geolocalización.");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const roundedLat = Number(position.coords.latitude.toFixed(6));
        const roundedLng = Number(position.coords.longitude.toFixed(6));
        onChange({ latitud: roundedLat, longitud: roundedLng });
        if (mapInstanceRef.current && markerInstanceRef.current) {
          const pos = { lat: roundedLat, lng: roundedLng };
          markerInstanceRef.current.setPosition(pos);
          mapInstanceRef.current.setCenter(pos);
          mapInstanceRef.current.setZoom(16);
        }
        setLocating(false);
      },
      () => {
        setMapError("No se pudo obtener tu ubicación actual.");
        setLocating(false);
      },
      { enableHighAccuracy: true },
    );
  };

  return (
    <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/70 p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-[#ff5722]" />
          Selecciona en el mapa (clic o arrastra el marcador)
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleUseCurrentLocation}
          disabled={locating || Boolean(mapError)}
          className="h-7 px-2.5 text-[11px] font-semibold bg-white cursor-pointer"
        >
          {locating ? (
            <Loader2 className="h-3 w-3 animate-spin mr-1" />
          ) : (
            <LocateFixed className="h-3 w-3 mr-1 text-[#ff5722]" />
          )}
          Mi ubicación
        </Button>
      </div>

      {mapError ? (
        <div className="h-52 rounded-lg border border-amber-200 bg-amber-50 p-3 text-[11px] text-amber-800 flex items-center justify-center text-center">
          {mapError} Puedes ingresar las coordenadas manualmente en los campos
          de abajo.
        </div>
      ) : (
        <div className="relative h-52 w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
          {isLoadingMap && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-100/90 text-xs text-slate-600 gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-[#ff5722]" />
              Cargando mapa...
            </div>
          )}
          <div ref={mapContainerRef} className="h-full w-full" />
        </div>
      )}
    </div>
  );
};
