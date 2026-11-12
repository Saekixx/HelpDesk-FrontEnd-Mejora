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
import { useHardwareMutations } from "@/hooks/hardware/useHardwareMutations";
import { HardwareItem } from "@/types/hardware/hardware.types";
import { HardwareFormData } from "@/schema/hardware/hardware.schema";
import { HardwareTransitionFormData } from "@/schema/hardware/hardwareTransition.schema";
import { getHardwareColumns } from "../components/hardware/HardwareColumns";
import { HardwareModal } from "@/components/hardware/HardwareModal";
import { HardwareDetailModal } from "@/components/hardware/HardwareDetailModal";
import { HardwareTransitionModal } from "@/components/hardware/HardwareTransitionModal";

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
    refetch,
  } = useHardware();

  // 2. Hook de mutaciones (Crear, Actualizar y Transición)
  const {
    crearHardware,
    actualizarHardware,
    transicionHardware,
    isSubmitting,
  } = useHardwareMutations();

  // Estados para control de modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hardwareToEdit, setHardwareToEdit] = useState<HardwareItem | null>(
    null,
  );

  // Estado para el modal de transición de estado
  const [isTransitionModalOpen, setIsTransitionModalOpen] = useState(false);
  const [hardwareToTransition, setHardwareToTransition] =
    useState<HardwareItem | null>(null);

  // Estado para el modal de detalle / hoja de vida
  const [selectedDetailId, setSelectedDetailId] = useState<number | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // 3. Catálogos globales de la TABLA
  const {
    clientes,
    sucursales,
    areas,
    setSelectedClienteId,
    setSelectedSucursalId,
    setSelectedAreaId,
  } = useCatalogOptions();

  // Estados locales para rastrear las selecciones de los filtros en cascada de la tabla
  const [selectedEmpresaFilter, setSelectedEmpresaFilter] = useState<
    number | null
  >(null);
  const [selectedSucursalFilter, setSelectedSucursalFilter] = useState<
    number | null
  >(null);

  // ==========================================
  // CATÁLOGOS EN CASCADA PARA EL MODAL (CREAR)
  // ==========================================
  const {
    sucursales: modalSucursales,
    areas: modalAreas,
    equipos: modalEquipos,
    setSelectedClienteId: setModalSelectedClienteId,
    setSelectedSucursalId: setModalSelectedSucursalId,
    setSelectedAreaId: setModalSelectedAreaId,
  } = useCatalogOptions();

  // ==========================================
  // CATÁLOGOS EN CASCADA PARA EL MODAL DE TRANSICIÓN
  // ==========================================
  const {
    sucursales: transitionSucursales,
    areas: transitionAreas,
    equipos: transitionEquipos,
    setSelectedClienteId: setTransitionSelectedClienteId,
    setSelectedSucursalId: setTransitionSelectedSucursalId,
    setSelectedAreaId: setTransitionSelectedAreaId,
  } = useCatalogOptions();

  // Sincronizar Empresa seleccionada en la tabla
  useEffect(() => {
    setSelectedClienteId(selectedEmpresaFilter);
    setSelectedSucursalFilter(null);
    setSelectedSucursalId(null);
    setSelectedAreaId(null);
  }, [
    selectedEmpresaFilter,
    setSelectedClienteId,
    setSelectedSucursalId,
    setSelectedAreaId,
  ]);

  // Sincronizar Sucursal seleccionada en la tabla
  useEffect(() => {
    setSelectedSucursalId(selectedSucursalFilter);
  }, [selectedSucursalFilter, setSelectedSucursalId]);

  // Manejadores en cascada para el MODAL DE CREACIÓN
  const handleModalClienteChange = (clienteId: string | number) => {
    const numId = clienteId ? Number(clienteId) : null;
    setModalSelectedClienteId(numId);
    setModalSelectedSucursalId(null);
    setModalSelectedAreaId(null);
  };

  const handleModalSucursalChange = (sucursalId: string | number) => {
    const numId = sucursalId ? Number(sucursalId) : null;
    setModalSelectedSucursalId(numId);
    setModalSelectedAreaId(null);
  };

  const handleModalAreaChange = (areaId: string | number) => {
    const numId = areaId ? Number(areaId) : null;
    setModalSelectedAreaId(numId);
  };

  // Manejadores en cascada para el MODAL DE TRANSICIÓN
  const handleTransitionClienteChange = (clienteId: string | number) => {
    const numId = clienteId ? Number(clienteId) : null;
    setTransitionSelectedClienteId(numId);
    setTransitionSelectedSucursalId(null);
    setTransitionSelectedAreaId(null);
  };

  const handleTransitionSucursalChange = (sucursalId: string | number) => {
    const numId = sucursalId ? Number(sucursalId) : null;
    setTransitionSelectedSucursalId(numId);
    setTransitionSelectedAreaId(null);
  };

  const handleTransitionAreaChange = (areaId: string | number) => {
    const numId = areaId ? Number(areaId) : null;
    setTransitionSelectedAreaId(numId);
  };

  // Opciones estáticas permitidas para el filtro de estado del hardware
  const estadosHardwareOptions = [
    { label: "Instalado", value: "INSTALADO" },
    { label: "Disponible", value: "DISPONIBLE" },
    { label: "En Mantenimiento", value: "EN_MANTENIMIENTO" },
    { label: "Baja / Descarte", value: "BAJA" },
  ];

  // Manejadores de acciones de UI y Modales
  const handleOpenCreate = () => {
    setModalSelectedClienteId(null);
    setModalSelectedSucursalId(null);
    setModalSelectedAreaId(null);
    setHardwareToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: HardwareItem) => {
    setHardwareToEdit(item);
    setIsModalOpen(true);
  };

  const handleViewDetail = (item: HardwareItem) => {
    setSelectedDetailId(item.id_hardware);
    setIsDetailOpen(true);
  };

  const handleOpenTransition = (item: HardwareItem) => {
    setHardwareToTransition(item);
    setTransitionSelectedClienteId(null);
    setTransitionSelectedSucursalId(null);
    setTransitionSelectedAreaId(null);
    setIsTransitionModalOpen(true);
  };

  // Submit unificado para el formulario de Creación o Actualización
  const handleSubmitForm = async (data: HardwareFormData) => {
    try {
      // Extraemos y separamos los campos temporales de TODOS los datos del formulario
      const {
        ubicacion_inicial,
        id_equipo_destino,
        id_cliente_temp,
        id_sucursal_temp,
        id_area_temp,
        ...cleanData
      } = data as any;

      if (hardwareToEdit) {
        // En edición usamos los datos limpios
        await actualizarHardware(hardwareToEdit.id_hardware, cleanData);
        toast.success("Hardware actualizado correctamente");
      } else {
        // En creación usamos los datos limpios y le agregamos la ubicación inicial si aplica
        await crearHardware({
          ...cleanData,
          ubicacion_inicial: ubicacion_inicial ?? "ALMACEN_CENTRAL",
          // Si al crear se seleccionó un equipo de destino y tu API lo requiere:
          ...(id_equipo_destino && { id_equipo_destino }),
        });
        toast.success("Hardware registrado correctamente");
      }

      setIsModalOpen(false);
      refetch(); // Refrescar la lista de hardware después de la operación
    } catch (error: any) {
      console.error(error);
    }
  };

  // Submit para el modal de transición de estado
  const handleSubmitTransition = async (data: HardwareTransitionFormData) => {
    if (!hardwareToTransition) return;
    try {
      await transicionHardware(hardwareToTransition.id_hardware, {
        estado: data.estado as any,
        motivo: data.motivo,
        id_equipo: data.estado === "INSTALADO" ? Number(data.id_equipo) : null,
      });
      toast.success("Estado del hardware actualizado con éxito");
      setIsTransitionModalOpen(false);
      refetch(); // Refrescar la lista de hardware después de la transición
    } catch (error: any) {
      console.error(error);
    }
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

      {/* FILTROS */}
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
        }}
        onApplyFilters={(filters) => {
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
          onToggleStatus: handleOpenTransition, // Conectado al modal de transición
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

      {/* MODAL DE CREACIÓN / EDICIÓN */}
      <HardwareModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitForm}
        hardwareToEdit={hardwareToEdit}
        isSubmitting={isSubmitting}
        clientes={clientes}
        sucursales={modalSucursales}
        areas={modalAreas}
        equipos={modalEquipos}
        onClienteChange={handleModalClienteChange}
        onSucursalChange={handleModalSucursalChange}
        onAreaChange={handleModalAreaChange}
      />

      {/* MODAL DE TRANSICIÓN DE ESTADO */}
      <HardwareTransitionModal
        isOpen={isTransitionModalOpen}
        onClose={() => setIsTransitionModalOpen(false)}
        onSubmit={handleSubmitTransition}
        hardware={hardwareToTransition}
        isSubmitting={isSubmitting}
        clientes={clientes}
        sucursales={transitionSucursales}
        areas={transitionAreas}
        equipos={transitionEquipos}
        onClienteChange={handleTransitionClienteChange}
        onSucursalChange={handleTransitionSucursalChange}
        onAreaChange={handleTransitionAreaChange}
      />

      {/* MODAL DE DETALLE / HOJA DE VIDA */}
      <HardwareDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        hardwareId={selectedDetailId}
      />
    </div>
  );
}

export default HardwarePage;
