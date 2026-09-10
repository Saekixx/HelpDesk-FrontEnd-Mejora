import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUsers } from "@/features/usuarios/hooks/useUsers";
import { useUserMutations } from "@/features/usuarios/hooks/useUserMutations";
import { useCatalogOptions } from "@/shared/hooks/useCatalogOptions";
import { UsersFilters } from "@/features/usuarios/components/users-filters";
import { UsersTable } from "@/features/usuarios/components/users-table";
import { UserModal } from "@/features/usuarios/components/UserModal";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { UserListItem } from "@/features/usuarios/types/user.entity";
import { UpdateUserFormValues } from "@/features/usuarios/schemas/user-form.schema";
import {
  UpdateUserDto,
  CreateUserDto,
} from "@/features/usuarios/types/user.dtos";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const UsersPage = () => {
  const { users, meta, loading, setPage, setFilterValues, refetch } =
    useUsers();
  const {
    toggleStatus,
    createUser,
    updateUser,
    loading: isMutating,
  } = useUserMutations(refetch);

  // Hook de catálogos para llenar los selects en el UserModal
  const {
    roles,
    clientes,
    sucursales,
    areas,
    setSelectedClienteId,
    setSelectedSucursalId,
  } = useCatalogOptions();

  // Estados del modal de formulario
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<UserListItem | null>(null);

  // Estado del modal de confirmación de desinstalación/cambio de estado
  const [selectedUserForStatus, setSelectedUserForStatus] =
    useState<UserListItem | null>(null);

  // Handlers para abrir el modal
  const handleOpenCreateModal = () => {
    setUserToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: UserListItem) => {
    setUserToEdit(user);
    setIsModalOpen(true);
  };

  // Submit unificado para crear o editar con sanitización estricta del DTO
  const handleSubmitUser = async (
    data: UpdateUserFormValues,
    isEdit: boolean,
  ) => {
    if (isEdit && userToEdit) {
      // Mapeo limpio para coincidir estrictamente con UpdateUserDto
      const updatePayload: UpdateUserDto = {
        nombre: data.nombre,
        apellido: data.apellido,
        correo: data.correo,
        telefono: data.telefono || undefined,
        resetPassword: Boolean(data.resetPassword),
        id_rol: data.id_rol,
        id_cliente: data.id_cliente ?? undefined,
        id_sucursal: data.id_sucursal ?? undefined,
        id_area: data.id_area ?? undefined,
      };

      await updateUser(userToEdit.id_usuario, updatePayload);
    } else {
      await createUser(data as CreateUserDto);
    }
  };

  const handleConfirmToggleStatus = async () => {
    if (!selectedUserForStatus) return;
    try {
      await toggleStatus(selectedUserForStatus.id_usuario);
      setSelectedUserForStatus(null);
    } catch {
      // Manejado desde toast en useUserMutations
    }
  };

  return (
    <div className="p-6 space-y-4">
      {/* Encabezado con Botón Nuevo Usuario */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Gestión de Usuarios
          </h1>
          <p className="text-sm text-gray-500">
            Gestión, asignación de roles y perfilado de usuarios
          </p>
        </div>

        <Button
          onClick={handleOpenCreateModal}
          className="bg-[#FF5722] hover:bg-[#F4511E] text-white font-medium flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Nuevo Usuario
        </Button>
      </div>

      <UsersFilters onApplyFilters={setFilterValues} />

      {loading ? (
        <div className="p-8 text-center text-gray-500">
          Cargando usuarios...
        </div>
      ) : (
        <>
          <UsersTable
            users={users}
            onEdit={handleOpenEditModal}
            onToggleStatus={(user) => setSelectedUserForStatus(user)}
          />
          <PaginationControls
            page={meta?.page ?? 1}
            lastPage={meta?.totalPages ?? 1}
            total={meta?.total ?? 0}
            limit={meta?.limit ?? 5}
            onPageChange={setPage}
          />
        </>
      )}

      {/* Modal para Crear/Editar Usuario */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitUser}
        userToEdit={userToEdit}
        rolesOptions={roles}
        clientesOptions={clientes}
        sucursalesOptions={sucursales}
        areasOptions={areas}
        onClienteChange={setSelectedClienteId}
        onSucursalChange={setSelectedSucursalId}
      />

      {/* Modal de confirmación para cambiar estado */}
      <AlertDialog
        open={!!selectedUserForStatus}
        onOpenChange={(open: boolean) =>
          !open && setSelectedUserForStatus(null)
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedUserForStatus?.is_active
                ? "¿Desactivar usuario?"
                : "¿Activar usuario?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas{" "}
              {selectedUserForStatus?.is_active ? "desactivar" : "activar"} a{" "}
              <strong className="text-gray-900">
                {selectedUserForStatus?.nombre}{" "}
                {selectedUserForStatus?.apellido}
              </strong>
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isMutating}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmToggleStatus}
              disabled={isMutating}
              className={
                selectedUserForStatus?.is_active
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }
            >
              {isMutating ? "Procesando..." : "Confirmar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UsersPage;
