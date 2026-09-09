import { useUsers } from "@/features/usuarios/hooks/useUsers";
import { UsersFilters } from "@/features/usuarios/components/users-filters";
import { UsersTable } from "@/features/usuarios/components/users-table";
import { PaginationControls } from "@/components/ui/pagination-controls";

const UsersPage = () => {
  const { users, meta, loading, setPage, setFilterValues } = useUsers();

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Usuarios
        </h1>
        <p className="text-sm text-gray-500">
          Gestión, asignación de roles y perfilado de usuarios
        </p>
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
            onEdit={(user) => console.log("Editar", user)}
            onAssignRole={(user) => console.log("Asignar Rol", user)}
            onToggleStatus={(user) => console.log("Cambiar Estado", user)}
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
    </div>
  );
};

export default UsersPage;
