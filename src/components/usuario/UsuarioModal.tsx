import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { UserPlus } from "lucide-react";
import { UsuarioItem } from "@/types/usuario/usuario.types";
import { UsuarioForm } from "./UsuarioForm";
import { SelectOption } from "@/shared/types/select-option.types";

interface UsuarioModalProps {
  usuarioToEdit?: (UsuarioItem & { zonas_ids?: number[] }) | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  roles?: SelectOption[];
  clientes?: SelectOption[];
  sucursales?: SelectOption[];
  areas?: SelectOption[];
  zonas?: SelectOption[];
  onClienteChange?: (clienteId: string | number) => void;
  onSucursalChange?: (sucursalId: string | number) => void;
}

export const UsuarioModal = ({
  usuarioToEdit,
  isOpen,
  onOpenChange,
  onSuccess,
  roles = [],
  clientes = [],
  sucursales = [],
  areas = [],
  zonas = [],
  onClienteChange,
  onSucursalChange,
}: UsuarioModalProps) => {
  const isEditing = Boolean(usuarioToEdit);

  const [formMeta, setFormMeta] = React.useState({
    nombre: usuarioToEdit?.nombre || "",
    apellido: usuarioToEdit?.apellido || "",
    rolName: usuarioToEdit?.nombre_rol || "",
  });

  // Actualizar metadatos si cambia el usuario a editar
  React.useEffect(() => {
    if (usuarioToEdit) {
      setFormMeta({
        nombre: usuarioToEdit.nombre || "",
        apellido: usuarioToEdit.apellido || "",
        rolName: usuarioToEdit.nombre_rol || "",
      });
    } else {
      setFormMeta({
        nombre: "",
        apellido: "",
        rolName: "",
      });
    }
  }, [usuarioToEdit]);

  // Normalizamos el usuario a editar para asegurar que 'zonas_ids' tenga siempre los números de las zonas
  const normalizedUsuarioToEdit = React.useMemo(() => {
    if (!usuarioToEdit) return null;

    // Extraemos los IDs si vienen en formato de objetos de la API
    const extractedZonasIds =
      usuarioToEdit.zonas && Array.isArray(usuarioToEdit.zonas)
        ? usuarioToEdit.zonas.map((z: any) => Number(z.id_zona ?? z.id))
        : [];

    return {
      ...usuarioToEdit,
      zonas_ids: usuarioToEdit.zonas_ids || extractedZonasIds,
    };
  }, [usuarioToEdit]);

  const initials =
    `${formMeta.nombre?.charAt(0) || ""}${formMeta.apellido?.charAt(0) || ""}`.toUpperCase() ||
    "US";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-6">
        {/* Header Dinámico */}
        <DialogHeader className="space-y-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            {isEditing ? (
              <div className="h-12 w-12 rounded-xl bg-orange-50 text-[#ff5722] font-extrabold flex items-center justify-center border border-orange-200/60 text-base shadow-xs">
                {initials}
              </div>
            ) : (
              <div className="h-12 w-12 rounded-xl bg-[#ff5722] text-white flex items-center justify-center shadow-md">
                <UserPlus className="h-6 w-6" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <DialogTitle className="text-xl font-extrabold text-slate-900">
                  {isEditing
                    ? `Editar Usuario - ${formMeta.nombre} ${formMeta.apellido}`
                    : "Crear Nuevo Usuario"}
                </DialogTitle>
                {isEditing && formMeta.rolName && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
                    {formMeta.rolName}
                  </span>
                )}
              </div>
              <DialogDescription className="text-xs text-slate-500 font-medium">
                {isEditing
                  ? "Actualiza credenciales, nivel de permisos y accesos de seguridad."
                  : "Registra las credenciales y asigna el perfil de acceso del colaborador o cliente."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Renderizado del Formulario Aislado con el objeto normalizado */}
        <UsuarioForm
          usuarioToEdit={normalizedUsuarioToEdit}
          onSuccess={onSuccess}
          onClose={() => onOpenChange(false)}
          roles={roles}
          clientes={clientes}
          sucursales={sucursales}
          areas={areas}
          zonas={zonas}
          onClienteChange={onClienteChange}
          onSucursalChange={onSucursalChange}
          onFormValuesChange={setFormMeta}
        />
      </DialogContent>
    </Dialog>
  );
};
