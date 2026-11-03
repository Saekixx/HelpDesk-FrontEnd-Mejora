import { useState, useEffect } from "react";
import { TableFiltersBar } from "@/components/table/TableFiltersBar";
import { DataTableContainer } from "@/components/table/DataTableContainer";
import { TablePaginationBar } from "@/components/table/TablePaginationBar";
import {
  Cpu,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Download,
} from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCatalogOptions } from "@/shared/hooks/useCatalogOptions";
import { useHardware } from "@/hooks/hardware/useHardware";
import { HardwareItem } from "@/types/hardware/hardware.types";
import { getHardwareColumns } from "../components/hardware/HardwareColumns";

function HardwarePage() {
  // 1. Hook de lectura y paginación de Hardware conectado al backend
  const {
    hardwareList,
    meta,
    isLoading,
    queryParams,
    limit,
    updateQuery,
    setPage,
    setLimit,
    resetQuery,
  } = useHardware();

  // 2. Catálogos globales en cascada (Clientes -> Sucursales -> Áreas)
  const {
    clientes,
    sucursales,
    areas,
    setSelectedClienteId,
    setSelectedSucursalId,
  } = useCatalogOptions();

  // Estados locales para rastrear las selecciones de los filtros en cascada
  const [selectedEmpresaFilter, setSelectedEmpresaFilter] = useState<
    number | null
  >(null);
  const [selectedSucursalFilter, setSelectedSucursalFilter] = useState<
    number | null
  >(null);

  // Estado local temporal para acumular los filtros antes de presionar el botón "Filtrar"
  const [, setPendingFilters] = useState<Record<string, any>>({});

  // Sincronizar Empresa seleccionada con el hook de catálogos
  useEffect(() => {
    setSelectedClienteId(selectedEmpresaFilter);
    setSelectedSucursalFilter(null);
    setSelectedSucursalId(null);
  }, [selectedEmpresaFilter, setSelectedClienteId, setSelectedSucursalId]);

  // Sincronizar Sucursal seleccionada con el hook de catálogos
  useEffect(() => {
    setSelectedSucursalId(selectedSucursalFilter);
  }, [selectedSucursalFilter, setSelectedSucursalId]);

  // Opciones estáticas permitidas para el filtro de estado del hardware
  const estadosHardwareOptions = [
    { label: "Instalado", value: "INSTALADO" },
    { label: "Disponible", value: "DISPONIBLE" },
    { label: "En Mantenimiento", value: "EN_MANTENIMIENTO" },
    { label: "Baja / Descarte", value: "BAJA" },
  ];

  // Acciones de UI
  const handleOpenCreate = () => {
    toast.info("Modal de creación de hardware en desarrollo...");
  };

  const handleViewDetail = (item: HardwareItem) => {
    toast.info(
      `Ver detalle de hardware ID: ${item.id_hardware} (${item.numero_serie})`,
    );
  };

  const handleEdit = (item: HardwareItem) => {
    toast.info(`Editar componente ID: ${item.id_hardware}`);
  };

  const handleToggleStatus = (item: HardwareItem) => {
    toast.warning(`Gestionar estado o baja para: ${item.numero_serie}`);
  };

  return (
    <div className="p-6 bg-slate-50/50 min-h-screen space-y-4">
      {/* CABECERA */}
      <PageHeader
        category="MÓDULOS DE GESTIÓN > INVENTARIO DE HARDWARE"
        title={
          <div className="flex items-center gap-3">
            <span>Gestión de Hardware y Repuestos</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-[#ff5722] border border-orange-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5722]" />
              {meta.total} Componentes Registrados
            </span>
          </div>
        }
        description="Catálogo de componentes físicos conectados al backend, proveedores y control de stock."
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
              Exportar Inventario (CSV)
            </Button>

            <Button
              onClick={handleOpenCreate}
              className="bg-[#ff5722] hover:bg-[#f4511e] text-white font-bold h-10 px-4 rounded-xl shadow-sm cursor-pointer text-xs"
            >
              <Plus className="mr-2 h-4 w-4" />
              Registrar Nuevo Hardware
            </Button>
          </div>
        }
      />

      {/* MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="TOTAL COMPONENTES"
          value={String(meta.total)}
          icon={<Cpu className="h-5 w-5 text-orange-600" />}
          iconContainerClassName="bg-orange-50 text-orange-600"
        />
        <StatCard
          title="ASIGNADOS A EQUIPOS"
          value={String(
            hardwareList.filter((h) => h.estado === "INSTALADO").length,
          )}
          icon={<HardDrive className="h-5 w-5 text-blue-600" />}
          iconContainerClassName="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="EN STOCK / DISPONIBLES"
          value={String(
            hardwareList.filter((h) => h.estado === "DISPONIBLE").length,
          )}
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
          iconContainerClassName="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="EN MANTENIMIENTO / BAJA"
          value={String(
            hardwareList.filter(
              (h) => h.estado === "EN_MANTENIMIENTO" || h.estado === "BAJA",
            ).length,
          )}
          icon={<AlertTriangle className="h-5 w-5 text-red-600" />}
          iconContainerClassName="bg-red-50 text-red-600"
        />
      </div>

      {/* FILTROS (Acumulados localmente hasta hacer clic en "Filtrar") */}
      <TableFiltersBar
        searchPlaceholder="Buscar por Nº Serie, Marca/Modelo, Tipo o Proveedor..."
        dropdowns={[
          {
            key: "id_cliente",
            placeholder: "Empresa: Todas",
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
            options: estadosHardwareOptions,
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
          // Solo actualizamos de forma temporal los filtros pendientes sin disparar la API aún
          setPendingFilters((prev) => ({ ...prev, [key]: value }));
        }}
        onApplyFilters={(filters) => {
          // AQUÍ SE DISPARA LA PETICIÓN AL BACKEND AL PRESIONAR EL BOTÓN FILTRAR
          const formattedFilters: Record<string, any> = {};

          Object.entries(filters).forEach(([key, val]) => {
            if (
              val !== undefined &&
              val !== null &&
              val !== "all" &&
              val !== ""
            ) {
              if (["id_cliente", "id_sucursal", "id_area"].includes(key)) {
                formattedFilters[key] = Number(val);
              } else {
                formattedFilters[key] = val;
              }
            } else {
              formattedFilters[key] = undefined;
            }
          });

          updateQuery(formattedFilters);
          toast.success("Filtros aplicados correctamente");
        }}
        onResetFilters={() => {
          setSelectedEmpresaFilter(null);
          setSelectedSucursalFilter(null);
          setPendingFilters({});
          resetQuery();
          toast.info("Filtros restablecidos");
        }}
      />

      {/* TABLA CONECTADA AL BACKEND */}
      <DataTableContainer
        data={hardwareList}
        columns={getHardwareColumns({
          onViewDetail: handleViewDetail,
          onEdit: handleEdit,
          onToggleStatus: handleToggleStatus,
        })}
        keyExtractor={(item) => String(item.id_hardware)}
        isLoading={isLoading}
      />

      {/* PAGINACIÓN */}
      <TablePaginationBar
        meta={{
          total: meta.total,
          page: meta.page,
          lastPage: meta.lastPage,
        }}
        pageSize={limit}
        onPageChange={setPage}
        onPageSizeChange={setLimit}
      />
    </div>
  );
}

export default HardwarePage;
