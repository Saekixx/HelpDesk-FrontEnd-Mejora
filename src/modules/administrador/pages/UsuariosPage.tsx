import { useState } from "react";
import { TableFiltersBar } from "@/components/table/TableFiltersBar";
import { DataTableContainer } from "@/components/table/DataTableContainer";
import { TablePaginationBar } from "@/components/table/TablePaginationBar";
import { getUsuariosColumns } from "../components/usuario/UsuariosColumns";
import { useCatalogOptions } from "@/shared/hooks/useCatalogOptions";
import { Users, UserCog, Building2, Upload, UserPlus } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { UsuarioItem } from "@/types/usuario/usuario.types";
import { UsuarioModal } from "@/components/usuario/UsuarioModal";
import { toggleUsuarioStatus } from "@/services/usuarios/usuario.service";
import { toast } from "sonner";
import { ConfirmStatusModal } from "@/components/ConfirmStatusModal";
import { useUsuarios } from "@/hooks/usuario/useUsuarios";

function UsuariosPage() {
  const {
    usuarios,
    meta,
    isLoading,
    queryParams,
    limit,
    updateQuery,
    setPage,
    setLimit,
    resetQuery,
    estadisticas,
    isLoadingEstadisticas,
    refetch,
  } = useUsuarios();

  const {
    roles,
    clientes,
    sucursales,
    areas,
    zonas,
    setSelectedClienteId,
    setSelectedSucursalId,
  } = useCatalogOptions();

  // Estados para modales de Crear y Editar
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [usuarioToEdit, setUsuarioToEdit] = useState<
    (UsuarioItem & { zonas_ids?: number[] }) | null
  >(null);

  // Estados para el modal de cambio de estado (Activar / Desactivar)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [usuarioToToggle, setUsuarioToToggle] = useState<UsuarioItem | null>(
    null,
  );
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);

  const handleClienteChange = (clienteId: string | number) => {
    setSelectedClienteId(clienteId ? Number(clienteId) : null);
  };

  const handleSucursalChange = (sucursalId: string | number) => {
    setSelectedSucursalId(sucursalId ? Number(sucursalId) : null);
  };

  const handleOpenEdit = (
    usuarioItem: UsuarioItem & { zonas_ids?: number[] },
  ) => {
    // Extraemos los IDs de las zonas de forma limpia y robusta desde el array de objetos
    const zonasIds =
      usuarioItem.zonas_ids && usuarioItem.zonas_ids.length > 0
        ? usuarioItem.zonas_ids
        : usuarioItem.zonas && Array.isArray(usuarioItem.zonas)
          ? usuarioItem.zonas.map((z: any) =>
              Number(z.id_zona ?? z.id ?? z.value),
            )
          : [];

    setUsuarioToEdit({
      ...usuarioItem,
      zonas_ids: zonasIds,
    });

    if (usuarioItem.id_cliente)
      setSelectedClienteId(Number(usuarioItem.id_cliente));
    if (usuarioItem.id_sucursal)
      setSelectedSucursalId(Number(usuarioItem.id_sucursal));

    setIsEditModalOpen(true);
  };

  const handleOpenCreate = () => {
    setSelectedClienteId(null);
    setSelectedSucursalId(null);
    setIsCreateModalOpen(true);
  };

  // Función que abre el modal de confirmación de estado
  const handleOpenToggleStatus = (usuario: UsuarioItem) => {
    setUsuarioToToggle(usuario);
    setIsStatusModalOpen(true);
  };

  // Función que ejecuta el servicio PATCH y muestra el mensaje del backend en el Toast
  const handleConfirmToggleStatus = async () => {
    if (!usuarioToToggle) return;
    setIsTogglingStatus(true);
    try {
      const mensaje = await toggleUsuarioStatus(usuarioToToggle.id_usuario);

      toast.success(mensaje || "Estado actualizado correctamente");
      setIsStatusModalOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Ocurrió un error al cambiar el estado.",
      );
    } finally {
      setIsTogglingStatus(false);
    }
  };

  return (
    <div className="p-6 bg-slate-50/50 min-h-screen space-y-4">
      {/* 1. CABECERA */}
      <PageHeader
        category="MÓDULOS DE GESTIÓN > USUARIOS & ACCESOS"
        title={
          <div className="flex items-center gap-3">
            <span>Gestión de Usuarios</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-[#ff5722] border border-orange-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5722]" />
              {isLoadingEstadisticas
                ? "Cargando..."
                : `${estadisticas?.totalUsuarios?.cantidad || 0} Usuarios Registrados`}
            </span>
          </div>
        }
        description="Administración de roles y perfilado de usuarios para toda la infraestructura."
        actions={
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              className="bg-white text-slate-700 border-slate-200 hover:bg-slate-50 font-semibold h-10 px-4 rounded-xl shadow-xs cursor-pointer text-xs"
            >
              <Upload className="mr-2 h-4 w-4 text-slate-500" />
              Carga Masiva (CSV)
            </Button>

            <Button
              onClick={handleOpenCreate}
              className="bg-[#ff5722] hover:bg-[#f4511e] text-white font-bold h-10 px-4 rounded-xl shadow-sm cursor-pointer text-xs"
            >
              <UserPlus className="mr-2 h-4 w-4" />+ Nuevo Usuario
            </Button>
          </div>
        }
      />

      {/* 2. MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="TOTAL USUARIOS"
          value={
            isLoadingEstadisticas
              ? "..."
              : String(estadisticas?.totalUsuarios?.cantidad || 0)
          }
          icon={<Users className="h-5 w-5 text-blue-600" />}
          iconContainerClassName="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="PERSONAL TÉCNICO IT"
          value={
            isLoadingEstadisticas
              ? "..."
              : String(estadisticas?.personalTecnico?.cantidad || 0)
          }
          icon={<UserCog className="h-5 w-5 text-amber-600" />}
          iconContainerClassName="bg-amber-50 text-amber-600"
        />
        <StatCard
          title="CUENTAS CLIENTES"
          value={
            isLoadingEstadisticas
              ? "..."
              : String(estadisticas?.cuentasClientes?.cantidad || 0)
          }
          icon={<Building2 className="h-5 w-5 text-indigo-600" />}
          iconContainerClassName="bg-indigo-50 text-indigo-600"
        />
      </div>

      {/* 3. FILTROS */}
      <TableFiltersBar
        searchPlaceholder="Buscar por nombre, correo o empresa..."
        dropdowns={[
          {
            key: "id_rol",
            placeholder: "Rol: Todos los Roles",
            options: roles,
          },
          {
            key: "is_active",
            placeholder: "Estado: Todos",
            options: [
              { label: "Activo", value: "true" },
              { label: "Inactivo", value: "false" },
            ],
          },
        ]}
        initialValues={queryParams}
        onApplyFilters={updateQuery}
        onResetFilters={resetQuery}
      />

      {/* 4. TABLA */}
      <DataTableContainer
        data={usuarios}
        columns={getUsuariosColumns({
          onEdit: handleOpenEdit,
          onToggleStatus: handleOpenToggleStatus,
        })}
        keyExtractor={(usr) => usr.id_usuario}
        isLoading={isLoading}
      />

      {/* 5. PAGINACIÓN */}
      <TablePaginationBar
        meta={meta}
        pageSize={limit}
        onPageChange={setPage}
        onPageSizeChange={setLimit}
      />

      {/* MODAL MODO CREAR */}
      <UsuarioModal
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        roles={roles}
        clientes={clientes}
        sucursales={sucursales}
        areas={areas}
        zonas={zonas}
        onClienteChange={handleClienteChange}
        onSucursalChange={handleSucursalChange}
        onSuccess={() => {
          refetch();
          toast.success("¡Usuario creado exitosamente!");
        }}
      />

      {/* MODAL MODO EDITAR */}
      <UsuarioModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        usuarioToEdit={usuarioToEdit}
        roles={roles}
        clientes={clientes}
        sucursales={sucursales}
        areas={areas}
        zonas={zonas}
        onClienteChange={handleClienteChange}
        onSucursalChange={handleSucursalChange}
        onSuccess={() => {
          refetch();
          toast.success("¡Usuario actualizado correctamente!");
        }}
      />

      {/* MODAL DE CONFIRMACIÓN DE ESTADO */}
      <ConfirmStatusModal
        isOpen={isStatusModalOpen}
        onOpenChange={setIsStatusModalOpen}
        isActive={usuarioToToggle?.is_active ?? false}
        itemName={
          usuarioToToggle
            ? `${usuarioToToggle.nombre} ${usuarioToToggle.apellido}`
            : ""
        }
        itemSubInfo={usuarioToToggle?.correo}
        itemBadge={usuarioToToggle?.nombre_rol || "Sin rol asignado"}
        description={`Al ${
          usuarioToToggle?.is_active ? "desactivar" : "activar"
        } este usuario, se modificarán sus permisos de acceso inmediato a la consola del sistema.`}
        isLoading={isTogglingStatus}
        onConfirm={handleConfirmToggleStatus}
      />
    </div>
  );
}

export default UsuariosPage;
