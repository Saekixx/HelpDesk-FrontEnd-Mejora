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
import {
  getHardwareColumns,
  HardwareItem,
} from "../components/hardware/HardwareColumns";

// DATA MOCKEADA INICIAL PARA LA VISTA
const MOCK_HARDWARE_DATA: HardwareItem[] = [
  {
    id_hardware: "1",
    serial: "SN-KF5600-88421",
    codigo_interno: "#HW-1049",
    tipo: "RAM",
    subtipo: "DDR5",
    marca_modelo: "Kingston Fury Beast 16GB DDR5 5600MHz",
    sku: "SKU: KF556C40BB-16",
    proveedor: "TechSupply Corp Latam",
    fecha_compra: "18/05/2024",
    estado: "Instalado",
    ubicacion_o_equipo: "PC-CONTAB-01",
  },
  {
    id_hardware: "2",
    serial: "SN-SM980P-44012",
    codigo_interno: "#HW-1050",
    tipo: "SSD",
    subtipo: "NVMe M.2",
    marca_modelo: "Samsung 980 Pro 1TB NVMe PCIe 4.0",
    sku: "SKU: MZ-V8P1T0B/AM",
    proveedor: "Deltron Perú S.A.",
    fecha_compra: "12/03/2024",
    estado: "Disponible",
    ubicacion_o_equipo: "Almacén Central",
  },
  {
    id_hardware: "3",
    serial: "SN-CS750E-10092",
    codigo_interno: "#HW-1051",
    tipo: "Fuente",
    subtipo: "750W",
    marca_modelo: "Corsair RM750e 750W 80+ Gold Fully Mod",
    sku: "SKU: CP-9020262-NA",
    proveedor: "Memory Kings Wholesale",
    fecha_compra: "04/01/2024",
    estado: "En Mantenimiento",
    ubicacion_o_equipo: "Taller RMA (Garantía)",
  },
  {
    id_hardware: "4",
    serial: "SN-IN137K-99214",
    codigo_interno: "#HW-1052",
    tipo: "Core i7",
    subtipo: "(CPU)",
    marca_modelo: "Intel Core i7-13700K 16-Core 5.4GHz",
    sku: "SKU: BX8071513700K",
    proveedor: "Ingram Micro Latam",
    fecha_compra: "22/11/2023",
    estado: "Instalado",
    ubicacion_o_equipo: "SRV-PROD-02",
  },
  {
    id_hardware: "5",
    serial: "SN-CRU32D-31880",
    codigo_interno: "#HW-1053",
    tipo: "RAM",
    subtipo: "DDR4",
    marca_modelo: "Crucial Pro 32GB (2×16GB) DDR4 3200MHz",
    sku: "SKU: CP2K16G4DRA32A",
    proveedor: "Deltron Perú S.A.",
    fecha_compra: "15/09/2023",
    estado: "Disponible",
    ubicacion_o_equipo: "Bodega Sede Norte",
  },
  {
    id_hardware: "6",
    serial: "SN-WD40E-55201",
    codigo_interno: "#HW-1054",
    tipo: "HDD",
    subtipo: "NAS 4TB",
    marca_modelo: "Western Digital Red Plus 4TB SATA 3.5",
    sku: "SKU: WD40EFPX",
    proveedor: "TechSupply Corp Latam",
    fecha_compra: "29/08/2023",
    estado: "Baja",
    ubicacion_o_equipo: "Retiro Definitivo (Sectores Dañados)",
  },
];

function HardwarePage() {
  // Catálogos globales en cascada (Clientes -> Sucursales -> Áreas)
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

  // Sincronizar Empresa seleccionada con el hook de catálogos
  useEffect(() => {
    setSelectedClienteId(selectedEmpresaFilter);
    // Limpiar sucursal y área si se cambia de empresa
    setSelectedSucursalFilter(null);
    setSelectedSucursalId(null);
  }, [selectedEmpresaFilter, setSelectedClienteId, setSelectedSucursalId]);

  // Sincronizar Sucursal seleccionada con el hook de catálogos
  useEffect(() => {
    setSelectedSucursalId(selectedSucursalFilter);
  }, [selectedSucursalFilter, setSelectedSucursalId]);

  // Estados locales para la tabla y paginación
  const [data] = useState<HardwareItem[]>(MOCK_HARDWARE_DATA);
  const [isLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [queryParams, setQueryParams] = useState<Record<string, any>>({});

  // Estados para controlar el modal de Creación / Edición
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHardwareToEdit, setSelectedHardwareToEdit] =
    useState<HardwareItem | null>(null);

  // Opciones estáticas para los filtros
  const tiposHardwareOptions = [
    { label: "Memoria RAM", value: "RAM" },
    { label: "Almacenamiento SSD/NVMe", value: "SSD" },
    { label: "Almacenamiento HDD", value: "HDD" },
    { label: "Fuente de Poder (PSU)", value: "Fuente" },
    { label: "Procesador (CPU)", value: "CPU" },
    { label: "Tarjeta Gráfica (GPU)", value: "GPU" },
    { label: "Placa Base", value: "Placa" },
  ];

  const estadosHardwareOptions = [
    { label: "Instalado", value: "Instalado" },
    { label: "Disponible", value: "Disponible" },
    { label: "En Mantenimiento", value: "En Mantenimiento" },
    { label: "Baja / Descarte", value: "Baja" },
  ];

  const proveedoresOptions = [
    { label: "TechSupply Corp Latam", value: "TechSupply Corp Latam" },
    { label: "Deltron Perú S.A.", value: "Deltron Perú S.A." },
    { label: "Memory Kings Wholesale", value: "Memory Kings Wholesale" },
    { label: "Ingram Micro Latam", value: "Ingram Micro Latam" },
  ];

  // Abrir modal para CREAR
  const handleOpenCreate = () => {
    setSelectedHardwareToEdit(null);
    setIsModalOpen(true);
  };

  const handleViewDetail = (item: HardwareItem) => {
    toast.info(
      `Ver detalle de hardware: ${item.serial} (${item.marca_modelo})`,
    );
  };

  // Abrir modal para EDITAR
  const handleEdit = (item: HardwareItem) => {
    setSelectedHardwareToEdit(item);
    setIsModalOpen(true);
  };

  const handleToggleStatus = (item: HardwareItem) => {
    toast.warning(`Gestionar estado o baja para: ${item.serial}`);
  };

  // Metadatos de paginación limpios
  const meta = {
    total: MOCK_HARDWARE_DATA.length,
    page: page,
    lastPage: 1,
    limit: limit,
  };

  return (
    <div className="p-6 bg-slate-50/50 min-h-screen space-y-4">
      {/* 1. CABECERA */}
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
        description="Catálogo de componentes físicos (Discos, RAM, Fuentes, etc.), proveedores y control de stock."
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

      {/* 2. MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="TOTAL COMPONENTES"
          value={String(meta.total)}
          icon={<Cpu className="h-5 w-5 text-orange-600" />}
          iconContainerClassName="bg-orange-50 text-orange-600"
        />
        <StatCard
          title="ASIGNADOS A EQUIPOS"
          value="2"
          icon={<HardDrive className="h-5 w-5 text-blue-600" />}
          iconContainerClassName="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="EN STOCK / REPUESTOS"
          value="2"
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
          iconContainerClassName="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="EN BAJA / DAÑADOS"
          value="1"
          icon={<AlertTriangle className="h-5 w-5 text-red-600" />}
          iconContainerClassName="bg-red-50 text-red-600"
        />
      </div>

      {/* 3. FILTROS CON CASCADA (Empresa -> Sucursal -> Área) */}
      <TableFiltersBar
        searchPlaceholder="Buscar por Nº Serie, Marca/Modelo o Proveedor..."
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
            options: areas, // Áreas filtradas dinámicamente según la sucursal seleccionada
          },
          {
            key: "tipo",
            placeholder: "Tipo: Todos",
            options: tiposHardwareOptions,
          },
          {
            key: "estado",
            placeholder: "Estado: Todos",
            options: estadosHardwareOptions,
          },
          {
            key: "proveedor",
            placeholder: "Proveedor: Todos",
            options: proveedoresOptions,
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
          toast.success("Filtros aplicados");
        }}
        onResetFilters={() => {
          setSelectedEmpresaFilter(null);
          setSelectedSucursalFilter(null);
          setQueryParams({});
        }}
      />

      {/* 4. TABLA */}
      <DataTableContainer
        data={data}
        columns={getHardwareColumns({
          onViewDetail: handleViewDetail,
          onEdit: handleEdit,
          onToggleStatus: handleToggleStatus,
        })}
        keyExtractor={(item) => item.id_hardware}
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

export default HardwarePage;
