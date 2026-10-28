import { useState, useEffect } from "react";
import { TableFiltersBar } from "@/components/table/TableFiltersBar";
import { DataTableContainer } from "@/components/table/DataTableContainer";
import { TablePaginationBar } from "@/components/table/TablePaginationBar";
import { Layers, UserCheck, Package, Plus, Download } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCatalogOptions } from "@/shared/hooks/useCatalogOptions";
import {
  getEquiposColumns,
  EquipoItem,
} from "@/modules/administrador/components/equipos/EquiposColumns";

// DATA MOCKEADA INICIAL DE EQUIPOS
const MOCK_EQUIPOS_DATA: EquipoItem[] = [
  {
    id_equipo: "1",
    tag: "PC-CONTAB-01",
    modelo_equipo: "Dell (OptiPlex 7010)",
    asignado_a: "Carlos Mendoza",
    detalles_asignacion: "Contabilidad · Sede Central",
    is_assigned: true,
    estado: "Activo",
  },
  {
    id_equipo: "2",
    tag: "LAP-TI-04",
    modelo_equipo: "Apple (MacBook Pro 16)",
    asignado_a: "Mariana Arango",
    detalles_asignacion: "Cloud & DevOps · Sede Central",
    is_assigned: true,
    estado: "Activo",
  },
  {
    id_equipo: "3",
    tag: "EQ-CSCO-9200",
    modelo_equipo: "Cisco (Catalyst 9200-48P)",
    asignado_a: "David Andrade",
    detalles_asignacion: "Infraestructura & Redes · Sucursal Norte",
    is_assigned: true,
    estado: "Activo",
  },
  {
    id_equipo: "4",
    tag: "PC-RRHH-02",
    modelo_equipo: "HP (EliteDesk 800 G6)",
    asignado_a: "Sin Asignar",
    detalles_asignacion: "Almacén TI · Bodega Central",
    is_assigned: false,
    estado: "En Almacén",
  },
  {
    id_equipo: "5",
    tag: "EQ-FRT-600F",
    modelo_equipo: "Fortinet (FortiGate 600F)",
    asignado_a: "Mateo Silva",
    detalles_asignacion: "Seguridad IT · Sede Central",
    is_assigned: true,
    estado: "Activo",
  },
  {
    id_equipo: "6",
    tag: "LAP-DEV-09",
    modelo_equipo: "Lenovo (ThinkPad T14s)",
    asignado_a: "Sin Asignar",
    detalles_asignacion: "Almacén TI · Hub Callao",
    is_assigned: false,
    estado: "En Almacén",
  },
];

function EquiposPage() {
  // Catálogos globales en cascada (Clientes -> Sucursales -> Áreas)
  const {
    clientes,
    sucursales,
    areas,
    setSelectedClienteId,
    setSelectedSucursalId,
  } = useCatalogOptions();

  // Estados locales para filtros en cascada
  const [selectedEmpresaFilter, setSelectedEmpresaFilter] = useState<
    number | null
  >(null);
  const [selectedSucursalFilter, setSelectedSucursalFilter] = useState<
    number | null
  >(null);

  useEffect(() => {
    setSelectedClienteId(selectedEmpresaFilter);
    setSelectedSucursalFilter(null);
    setSelectedSucursalId(null);
  }, [selectedEmpresaFilter, setSelectedClienteId, setSelectedSucursalId]);

  useEffect(() => {
    setSelectedSucursalId(selectedSucursalFilter);
  }, [selectedSucursalFilter, setSelectedSucursalId]);

  // Estados para tabla y paginación
  const [data] = useState<EquipoItem[]>(MOCK_EQUIPOS_DATA);
  const [isLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [queryParams, setQueryParams] = useState<Record<string, any>>({});

  // Opciones estáticas para los filtros adicionales
  const estadosOptions = [
    { label: "Activo", value: "Activo" },
    { label: "En Almacén", value: "En Almacen" },
    { label: "En Mantenimiento", value: "En Mantenimiento" },
    { label: "Baja", value: "Baja" },
  ];

  const asignacionOptions = [
    { label: "Asignados", value: "assigned" },
    { label: "Sin Asignar", value: "unassigned" },
  ];

  const handleViewDetail = (item: EquipoItem) => {
    toast.info(`Ver detalle técnico del equipo: ${item.tag}`);
  };

  const handleToggleAssign = (item: EquipoItem) => {
    toast.warning(
      item.is_assigned
        ? `Liberando equipo ${item.tag} de ${item.asignado_a}...`
        : `Asignando equipo ${item.tag}...`,
    );
  };

  const handleToggleStatus = (item: EquipoItem) => {
    toast.info(`Gestionar estado operativo de: ${item.tag}`);
  };

  const handleOpenCreate = () => {
    toast.success("Modal de 'Registrar Nuevo Equipo' en desarrollo...");
  };

  // Metadatos de paginación limpios
  const meta = {
    total: 1294,
    page: page,
    lastPage: 216,
    limit: limit,
  };

  return (
    <div className="p-6 bg-slate-50/50 min-h-screen space-y-4">
      {/* 1. CABECERA */}
      <PageHeader
        category="GESTIÓN DE INFRAESTRUCTURA & IT · Asset Manager v2.4"
        title={
          <div className="flex items-center gap-3">
            <span>Inventario de Equipos</span>
          </div>
        }
        description="Gestión y seguimiento de equipos de cómputo, componentes instalados y asignaciones a trabajadores."
        actions={
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              className="bg-white text-slate-700 border-slate-200 hover:bg-slate-50 font-semibold h-10 px-4 rounded-xl shadow-xs cursor-pointer text-xs"
              onClick={() =>
                toast.info("Exportación CSV de inventario en desarrollo...")
              }
            >
              <Download className="mr-2 h-4 w-4 text-slate-500" />
              Exportar CSV
            </Button>

            <Button
              onClick={handleOpenCreate}
              className="bg-[#ff5722] hover:bg-[#f4511e] text-white font-bold h-10 px-4 rounded-xl shadow-sm cursor-pointer text-xs"
            >
              <Plus className="mr-2 h-4 w-4" />
              Registrar Nuevo Equipo
            </Button>
          </div>
        }
      />

      {/* 2. MÉTRICAS SUPERIORES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="TOTAL DE EQUIPOS"
          value="1,294"
          icon={<Layers className="h-5 w-5 text-orange-600" />}
          iconContainerClassName="bg-orange-50 text-orange-600"
          footerText="Activos registrados"
        />
        <StatCard
          title="EQUIPOS ASIGNADOS"
          value="1,148"
          icon={<UserCheck className="h-5 w-5 text-blue-600" />}
          iconContainerClassName="bg-blue-50 text-blue-600"
          footerText="Vinculados a usuario"
        />
        <StatCard
          title="EN ALMACÉN / STOCK DISPONIBLE"
          value="146"
          icon={<Package className="h-5 w-5 text-slate-600" />}
          iconContainerClassName="bg-slate-100 text-slate-700"
          footerText="En stock / reserva"
        />
      </div>

      {/* 3. BARRA DE FILTROS EN CASCADA */}
      <TableFiltersBar
        searchPlaceholder="Buscar por nombre o encargado..."
        dropdowns={[
          {
            key: "id_cliente",
            placeholder: "Cliente: Todas las Empresas",
            options: clientes,
          },
          {
            key: "id_sucursal",
            placeholder: "Sucursal: Todas",
            options: sucursales,
          },
          {
            key: "id_area",
            placeholder: "Área: Todas",
            options: areas,
          },
          {
            key: "estado",
            placeholder: "Estado: Todos",
            options: estadosOptions,
          },
          {
            key: "asignacion",
            placeholder: "Asignación: Todos",
            options: asignacionOptions,
          },
        ]}
        initialValues={queryParams}
        onFilterChange={(key, value) => {
          if (key === "id_cliente") {
            const clienteId = value && value !== "all" ? Number(value) : null;
            setSelectedEmpresaFilter(clienteId);
          } else if (key === "id_sucursal") {
            const sucursalId = value && value !== "all" ? Number(value) : null;
            setSelectedSucursalFilter(sucursalId);
          }
        }}
        onApplyFilters={(filters) => {
          setQueryParams(filters);
          toast.success("Filtros aplicados correctamente");
        }}
        onResetFilters={() => {
          setSelectedEmpresaFilter(null);
          setSelectedSucursalFilter(null);
          setQueryParams({});
        }}
      />

      {/* 4. TABLA DE DATOS */}
      <DataTableContainer
        data={data}
        columns={getEquiposColumns({
          onViewDetail: handleViewDetail,
          onToggleAssign: handleToggleAssign,
          onToggleStatus: handleToggleStatus,
        })}
        keyExtractor={(item) => item.id_equipo}
        isLoading={isLoading}
      />

      {/* 5. PAGINACIÓN */}
      <TablePaginationBar
        meta={meta}
        pageSize={limit}
        onPageChange={setPage}
        onPageSizeChange={setLimit}
      />
    </div>
  );
}

export default EquiposPage;
