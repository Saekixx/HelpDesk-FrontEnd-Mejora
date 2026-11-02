import {
  User,
  MapPin,
  Phone,
  Mail,
  Laptop,
  Wrench,
  Clock,
  AlertTriangle,
  CheckCircle2,
  FileText,
  UserPlus,
  RotateCcw,
  Calendar,
  Package,
  ArrowLeft,
  ExternalLink,
  Star,
  Building2,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TicketDetailBackend } from "@/types/ticket/ticket-chat.type";

interface TicketSidebarProps {
  ticket: TicketDetailBackend;
  onBack: () => void;
  onAssignTechnical?: () => void;
  onCloseTicket?: () => void;
  onDeriveInSitu?: () => void;
  onResumeAttenting?: () => void;
  onRegisterVisitReport?: () => void;
  onReopenTicket?: () => void;
  onDownloadReportPdf?: () => void;
}

export const TicketSidebar = ({
  ticket,
  onBack,
  onAssignTechnical,
  onCloseTicket,
  onDeriveInSitu,
  onResumeAttenting,
  onRegisterVisitReport,
  onReopenTicket,
  onDownloadReportPdf,
}: TicketSidebarProps) => {
  const {
    estado,
    trabajador,
    soporte,
    equipo,
    repuestoInfo,
    visitaInfo,
    reaperturaInfo,
    solucionInfo,
  } = ticket;
  const isEstado = (val: string) => estado.toLowerCase() === val.toLowerCase();

  const nombreSolicitante = `${trabajador.nombre} ${trabajador.apellido}`;
  const nombreSoporte = soporte
    ? `${soporte.nombre} ${soporte.apellido}`
    : null;

  return (
    <div className="w-full lg:w-[380px] shrink-0 space-y-4 font-sans text-xs">
      {/* BOTÓN VOLVER */}
      <Button
        variant="ghost"
        onClick={onBack}
        className="h-8 px-2 text-slate-600 hover:text-slate-900 font-bold text-xs gap-1.5 cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a la Consola de Tickets
      </Button>

      {/* BANNER DE REAPERTURA */}
      {isEstado("Reabierto") && reaperturaInfo && (
        <div className="p-3.5 rounded-2xl bg-red-50/80 border border-red-200 text-red-900 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-red-700 text-[11px] uppercase tracking-wider">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              Incidencia Reabierta
            </div>
            <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none font-bold text-[10px]">
              REINCIDENCIA #{reaperturaInfo.reincidenciaNum}
            </Badge>
          </div>
          <p className="text-slate-700 font-medium leading-snug">
            <span className="font-bold text-slate-900">Motivo: </span>
            {reaperturaInfo.motivo}
          </p>
          <p className="text-[10px] text-slate-500 font-semibold">
            {reaperturaInfo.fechaHora} por {nombreSolicitante}
          </p>
        </div>
      )}

      {/* BLOQUE SOLICITANTE / TRABAJADOR */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-slate-400" /> Solicitante /
            Trabajador
          </span>
          <Badge
            variant="outline"
            className="text-[10px] bg-slate-50 border-slate-200 font-bold text-slate-600"
          >
            {trabajador.nombre_cliente}
          </Badge>
        </div>

        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-orange-100 text-[#ff5722] font-black text-sm flex items-center justify-center shrink-0">
            {trabajador.nombre[0]}
            {trabajador.apellido[0]}
          </div>
          <div className="space-y-0.5">
            <p className="font-extrabold text-slate-900 text-sm">
              {nombreSolicitante}
            </p>
            <div className="flex items-center gap-1 text-slate-500 text-[11px] font-medium">
              <Layers className="h-3 w-3 text-slate-400 shrink-0" />
              <span>{trabajador.nombre_area}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400 text-[11px]">
              <Building2 className="h-3 w-3 shrink-0" />
              <span>{trabajador.nombre_sucursal}</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 space-y-1.5 text-slate-600 font-medium">
          <div className="flex items-center gap-2">
            <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{trabajador.correo}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span>Teléfono: {trabajador.telefono}</span>
          </div>
        </div>
      </div>

      {/* BLOQUE TÉCNICO DE SOPORTE */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Wrench className="h-3.5 w-3.5 text-slate-400" /> Técnico Asignado
          </span>
          {soporte ? (
            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Atendiendo
            </span>
          ) : (
            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none text-[10px] font-bold">
              Sin Asignar
            </Badge>
          )}
        </div>

        {soporte ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center shrink-0 border border-blue-100">
                {soporte.nombre[0]}
                {soporte.apellido[0]}
              </div>
              <div className="space-y-0.5">
                <p className="font-extrabold text-slate-900">{nombreSoporte}</p>
                <p className="text-slate-500 text-[11px]">
                  {soporte.area} ({soporte.rol.nombre})
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-1 text-slate-500">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{soporte.correo}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span>Tel: {soporte.telefono}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/80 text-amber-900 space-y-1 text-center">
            <p className="font-bold text-xs">Sin Soporte Asignado</p>
            <p className="text-[11px] text-amber-700">
              Pendiente de triaje o asignación de especialista.
            </p>
          </div>
        )}
      </div>

      {/* BLOQUE DINÁMICO DE CONTEXTO DE ESTADO */}
      {isEstado("Derivado Insitu") && visitaInfo && (
        <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-2">
          <div className="flex items-center justify-between text-purple-900 font-extrabold">
            <span className="flex items-center gap-1.5 text-xs">
              <Calendar className="h-4 w-4 text-purple-600" /> VISITA IN-SITU
              AGENDADA
            </span>
            <Badge className="bg-purple-100 text-purple-700 border-none text-[10px] font-bold">
              AGENDADA
            </Badge>
          </div>
          <p className="font-extrabold text-slate-900">
            {visitaInfo.fechaHora}
          </p>
          <p className="text-slate-600 text-[11px]">{visitaInfo.sede}</p>
        </div>
      )}

      {isEstado("En Espera Repuesto") && repuestoInfo && (
        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
          <div className="flex items-center gap-1.5 text-amber-900 font-extrabold text-xs">
            <Package className="h-4 w-4 text-amber-600" /> Repuesto Solicitado
          </div>
          <div className="space-y-1 bg-white p-2.5 rounded-xl border border-amber-100">
            <p className="font-extrabold text-slate-900">
              {repuestoInfo.componente}
            </p>
            <p className="text-[11px] text-slate-500 font-bold">
              Req: {repuestoInfo.requisicion}
            </p>
            <p className="text-[11px] text-amber-700 font-semibold flex items-center gap-1 mt-1">
              <Clock className="h-3 w-3" /> {repuestoInfo.tiempoEstimado}
            </p>
          </div>
        </div>
      )}

      {isEstado("Cerrado") && solucionInfo && (
        <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-3">
          <div className="flex items-center gap-1.5 text-emerald-800 font-extrabold text-xs">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Incidencia
            Resuelta con Éxito
          </div>
          <div className="space-y-1.5 text-slate-700">
            <p className="text-[11px] font-bold text-slate-500">
              Fecha:{" "}
              <span className="text-slate-900">
                {solucionInfo.fechaResolucion}
              </span>
            </p>
            <div className="pt-2 border-t border-emerald-200/60">
              <p className="text-[11px] font-extrabold uppercase text-slate-400">
                Solución Técnica Aplicada:
              </p>
              <p className="font-semibold text-slate-800 leading-snug mt-0.5">
                {solucionInfo.solucionAplicada}
              </p>
            </div>
            {solucionInfo.calificacion && (
              <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-slate-400 uppercase">
                  Calificación:
                </span>
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${i < solucionInfo.calificacion ? "fill-amber-400" : "text-slate-200"}`}
                    />
                  ))}
                  <span className="text-slate-800 text-xs ml-1">
                    {solucionInfo.calificacion}/5
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* BLOQUE EQUIPO AFECTADO */}
      {equipo ? (
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Laptop className="h-3.5 w-3.5 text-slate-400" /> Equipo Afectado
            </span>
            <Badge
              variant="outline"
              className="text-[10px] bg-blue-50 text-blue-700 border-blue-200 font-bold"
            >
              {equipo.tipo}
            </Badge>
          </div>

          <div>
            <p className="font-extrabold text-slate-900">
              {equipo.nombre_equipo}
            </p>
            <p className="text-slate-500 text-[11px] font-medium">
              {equipo.marca_modelo}
            </p>
            <p className="text-slate-400 text-[11px] mt-1">
              Serie:{" "}
              <span className="text-slate-800 font-bold">
                {equipo.numero_serie}
              </span>
            </p>
          </div>

          <Button
            variant="link"
            className="p-0 h-auto text-[#ff5722] hover:text-[#f4511e] font-bold text-xs gap-1 cursor-pointer"
          >
            Ver Hoja de Vida del Equipo <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-400 text-center font-bold">
          Sin equipo físico asociado
        </div>
      )}

      {/* BLOQUE DETALLE DE LA INCIDENCIA */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
            Detalle de la Incidencia
          </span>
          <Badge
            className={`text-[10px] font-bold ${ticket.es_software ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-700"}`}
          >
            {ticket.es_software ? "SOFTWARE" : "HARDWARE"}
          </Badge>
        </div>
        <p className="font-extrabold text-slate-900 text-sm leading-snug">
          {ticket.asunto}
        </p>
        <p className="text-slate-600 font-medium text-xs leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
          {ticket.detalle}
        </p>

        <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-medium space-y-1">
          <div className="flex justify-between">
            <span>Registrado:</span>
            <span className="font-bold text-slate-800">
              {new Date(ticket.createdAt).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span>PIN de Ticket:</span>
            <span className="font-bold text-[#ff5722]">{ticket.pin}</span>
          </div>
        </div>
      </div>

      {/* BOTONERA DE ACCIÓN INFERIOR */}
      <div className="space-y-2 pt-2">
        {isEstado("Pendiente") && (
          <>
            <Button
              onClick={onAssignTechnical}
              className="w-full h-11 bg-[#ff5722] hover:bg-[#f4511e] text-white font-extrabold rounded-xl shadow-xs gap-2 text-xs cursor-pointer"
            >
              <UserPlus className="h-4 w-4" /> Asignar Soporte Técnico
            </Button>
            <Button
              variant="outline"
              className="w-full h-10 border-slate-200 text-slate-700 hover:bg-slate-100 font-bold rounded-xl text-xs cursor-pointer"
            >
              Derivar a Cola General / Cancelar
            </Button>
          </>
        )}

        {(isEstado("En Progreso") || isEstado("Reabierto")) && (
          <>
            <Button
              onClick={onCloseTicket}
              className="w-full h-11 bg-[#ff5722] hover:bg-[#f4511e] text-white font-extrabold rounded-xl shadow-xs gap-2 text-xs cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4" /> Cerrar Ticket
            </Button>
            <Button
              onClick={onDeriveInSitu}
              variant="outline"
              className="w-full h-10 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 font-bold rounded-xl text-xs gap-2 cursor-pointer"
            >
              <MapPin className="h-4 w-4" /> Derivar a Visita In-Situ
            </Button>
          </>
        )}

        {isEstado("Derivado Insitu") && (
          <>
            <Button
              onClick={onRegisterVisitReport}
              className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl shadow-xs gap-2 text-xs cursor-pointer"
            >
              <FileText className="h-4 w-4" /> Registrar Informe de Visita
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="h-9 text-slate-700 border-slate-200 font-bold text-[11px] rounded-xl cursor-pointer"
              >
                Reprogramar Cita
              </Button>
              <Button
                onClick={onCloseTicket}
                variant="outline"
                className="h-9 text-slate-700 border-slate-200 font-bold text-[11px] rounded-xl cursor-pointer"
              >
                Cerrar Ticket
              </Button>
            </div>
          </>
        )}

        {isEstado("En Espera Repuesto") && (
          <Button
            onClick={onResumeAttenting}
            className="w-full h-11 bg-[#ff5722] hover:bg-[#f4511e] text-white font-extrabold rounded-xl shadow-xs gap-2 text-xs cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" /> Reanudar Atención (Repuesto
            Disponible)
          </Button>
        )}

        {isEstado("Cerrado") && (
          <>
            <Button
              onClick={onReopenTicket}
              variant="outline"
              className="w-full h-10 text-slate-700 border-slate-200 hover:bg-slate-50 font-bold rounded-xl text-xs gap-2 cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" /> Reabrir Ticket
            </Button>
            <Button
              onClick={onDownloadReportPdf}
              variant="outline"
              className="w-full h-10 bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200 font-bold rounded-xl text-xs gap-2 cursor-pointer"
            >
              <FileText className="h-4 w-4" /> Descargar Acta de Entrega (PDF)
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
