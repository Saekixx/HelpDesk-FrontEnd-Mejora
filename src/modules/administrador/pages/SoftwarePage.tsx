import { useState, useEffect } from "react";
import { TableFiltersBar } from "@/components/table/TableFiltersBar";
import { DataTableContainer } from "@/components/table/DataTableContainer";
import { TablePaginationBar } from "@/components/table/TablePaginationBar";
import { Layers, FileCheck, CheckCircle2, Plus, Download } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCatalogOptions } from "@/shared/hooks/useCatalogOptions";
import {
  getSoftwareColumns,
  SoftwareItem,
} from "../components/software/SoftwareColumns";

// DATA MOCKEADA INICIAL DE SOFTWARE Y LICENCIAS
const MOCK_SOFTWARE_DATA: SoftwareItem[] = [
  {
    id_software: "1",
    nombre_software: "Microsoft 365 Enterprise E5",
    categoria: "Suite Ofimática & Productividad",
    empresa_cliente: "Banco Metrópolis S.A.",
    tipo_modelo: "Por Asiento (SSD)",
    usados: 45,
    total_cupos: 50,
    libres: 5,
    porcentaje: 90,
    proveedor: "SoftwareOne Latam",
    vigencia: "31/12/2026",
    estado: "Activo",
  },
  {
    id_software: "2",
    nombre_software: "Windows 11 Pro Enterprise OEM",
    categoria: "Sistema Operativo",
    empresa_cliente: "Todas las Empresas (Pool)",
    tipo_modelo: "OEM Endpoint",
    usados: 120,
    total_cupos: 130,
    libres: 10,
    porcentaje: 92,
    proveedor: "Deltron Perú S.A.",
    vigencia: "Permanente (Perpetua)",
    estado: "Activo",
  },
  {
    id_software: "3",
    nombre_software: "CrowdStrike Falcon Enterprise",
    categoria: "Seguridad Endpoint & EDR",
    empresa_cliente: "Banco Metrópolis S.A.",
    tipo_modelo: "Flotante Corporativa",
    usados: 78,
    total_cupos: 80,
    libres: 2,
    porcentaje: 97,
    proveedor: "Licencias Globales",
    vigencia: "18/06/2026",
    estado: "Activo",
  },
  {
    id_software: "4",
    nombre_software: "Adobe Creative Cloud Pro",
    categoria: "Diseño Gráfico & Vídeo",
    empresa_cliente: "Milan Jeans S.A.C",
    tipo_modelo: "Por Usuario Nominativo",
    usados: 18,
    total_cupos: 20,
    libres: 2,
    porcentaje: 90,
    proveedor: "TechData Solutions",
    vigencia: "15/10/2025",
    estado: "Próximo a vencer",
  },
  {
    id_software: "5",
    nombre_software: "Redgate SQL Prompt & Toolbelt",
    categoria: "Bases de Datos & Dev",
    empresa_cliente: "Logística Transandina",
    tipo_modelo: "Empresarial Ilimitada",
    usados: 32,
    total_cupos: 35,
    libres: 3,
    porcentaje: 91,
    proveedor: "SoftwareOne Latam",
    vigencia: "28/02/2026",
    estado: "Activo",
  },
  {
    id_software: "6",
    nombre_software: "JetBrains All Products Pack",
    categoria: "Desarrollo & IDEs",
    empresa_cliente: "Banco Metrópolis S.A.",
    tipo_modelo: "Por Usuario",
    usados: 15,
    total_cupos: 25,
    libres: 10,
    porcentaje: 60,
    proveedor: "TechData Solutions",
    vigencia: "12/09/2025",
    estado: "Activo",
  },
  {
    id_software: "7",
    nombre_software: "Autodesk AutoCAD 2024",
    categoria: "Ingeniería & Arquitectura",
    empresa_cliente: "Constructora Bolívar",
    tipo_modelo: "Pool Licencias Red",
    usados: 8,
    total_cupos: 8,
    libres: 0,
    porcentaje: 100,
    proveedor: "Graña Tech",
    vigencia: "15/07/2025",
    estado: "Cupo Lieno",
  },
];

function SoftwarePage() {
  // Catálogos globales en cascada (Clientes -> Sucursales)
  const { clientes, sucursales, setSelectedClienteId } = useCatalogOptions();

  // Estados locales para filtros en cascada
  const [selectedEmpresaFilter, setSelectedEmpresaFilter] = useState<
    number | null
  >(null);

  useEffect(() => {
    setSelectedClienteId(selectedEmpresaFilter);
  }, [selectedEmpresaFilter, setSelectedClienteId]);

  // Estados para tabla y paginación
  const [data] = useState<SoftwareItem[]>(MOCK_SOFTWARE_DATA);
  const [isLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [queryParams, setQueryParams] = useState<Record<string, any>>({});

  // Opciones estáticas para los filtros
  const categoriasOptions = [
    { label: "Suite Ofimática & Productividad", value: "ofimatica" },
    { label: "Sistema Operativo", value: "so" },
    { label: "Seguridad Endpoint & EDR", value: "seguridad" },
    { label: "Diseño Gráfico & Vídeo", value: "diseno" },
    { label: "Bases de Datos & Dev", value: "db" },
  ];

  const estadosOptions = [
    { label: "Activo", value: "Activo" },
    { label: "Próximo a vencer", value: "Proximo a vencer" },
    { label: "Cupo Lleno", value: "Cupo Lieno" },
  ];

  const handleViewDetail = (item: SoftwareItem) => {
    toast.info(`Ver detalle de licenciamiento: ${item.nombre_software}`);
  };

  const handleEdit = (item: SoftwareItem) => {
    toast.info(`Editar software: ${item.nombre_software}`);
  };

  const handleManageLicenses = (item: SoftwareItem) => {
    toast.warning(
      `Gestionar cupos y asignaciones para: ${item.nombre_software}`,
    );
  };

  const handleOpenCreate = () => {
    toast.success(
      "Modal de 'Registrar Nuevo Software / Lote' en desarrollo...",
    );
  };

  // Metadatos de paginación limpios
  const meta = {
    total: 42,
    page: page,
    lastPage: 6,
    limit: limit,
  };

  return (
    <div className="p-6 bg-slate-50/50 min-h-screen space-y-4">
      {/* 1. CABECERA */}
      <PageHeader
        category="MÓDULOS DE GESTIÓN > SOFTWARE & LICENCIAMIENTO"
        title={
          <div className="flex items-center gap-3">
            <span>Gestión de Software y Licenciamiento</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-[#ff5722] border border-orange-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5722]" />
              {meta.total} Programas / Lotes Registrados
            </span>
          </div>
        }
        description="Control de compras corporativas, volúmenes de licencias, cupos usados y credenciales de acceso."
        actions={
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              className="bg-white text-slate-700 border-slate-200 hover:bg-slate-50 font-semibold h-10 px-4 rounded-xl shadow-xs cursor-pointer text-xs"
              onClick={() =>
                toast.info("Exportación CSV de licenciamiento en desarrollo...")
              }
            >
              <Download className="mr-2 h-4 w-4 text-slate-500" />
              Exportar Licenciamiento (CSV)
            </Button>

            <Button
              onClick={handleOpenCreate}
              className="bg-[#ff5722] hover:bg-[#f4511e] text-white font-bold h-10 px-4 rounded-xl shadow-sm cursor-pointer text-xs"
            >
              <Plus className="mr-2 h-4 w-4" />
              Registrar Nuevo Software / Lote
            </Button>
          </div>
        }
      />

      {/* 2. MÉTRICAS SUPERIORES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="TOTAL PROGRAMAS / LOTES"
          value="42"
          icon={<Layers className="h-5 w-5 text-orange-600" />}
          iconContainerClassName="bg-orange-50 text-orange-600"
          footerText="Inventario global auditado"
        />
        <StatCard
          title="LICENCIAS ASIGNADAS"
          value="380"
          icon={<FileCheck className="h-5 w-5 text-blue-600" />}
          iconContainerClassName="bg-blue-50 text-blue-600"
          footerText="84.4% ocupación (380/450)"
        />
        <StatCard
          title="LICENCIAS LIBRES"
          value="70"
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
          iconContainerClassName="bg-emerald-50 text-emerald-600"
          footerText="Stock en pool para despliegue"
        />
      </div>

      {/* 3. BARRA DE FILTROS EN CASCADA */}
      <TableFiltersBar
        searchPlaceholder="Buscar por Software, SKU, Proveedor o Categoría..."
        dropdowns={[
          {
            key: "id_cliente",
            placeholder: "Todas las Empresas / Clientes",
            options: clientes,
          },
          {
            key: "id_sucursal",
            placeholder: "Todas las Sucursales",
            options: sucursales,
          },
          {
            key: "categoria",
            placeholder: "Todas las Categorías",
            options: categoriasOptions,
          },
          {
            key: "estado",
            placeholder: "Todos los Estados",
            options: estadosOptions,
          },
        ]}
        initialValues={queryParams}
        onFilterChange={(key, value) => {
          if (key === "id_cliente") {
            const clienteId = value && value !== "all" ? Number(value) : null;
            setSelectedEmpresaFilter(clienteId);
          }
        }}
        onApplyFilters={(filters) => {
          setQueryParams(filters);
          toast.success("Filtros aplicados correctamente");
        }}
        onResetFilters={() => {
          setSelectedEmpresaFilter(null);
          setQueryParams({});
        }}
      />

      {/* 4. TABLA DE DATOS */}
      <DataTableContainer
        data={data}
        columns={getSoftwareColumns({
          onViewDetail: handleViewDetail,
          onEdit: handleEdit,
          onManageLicenses: handleManageLicenses,
        })}
        keyExtractor={(item) => item.id_software}
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

export default SoftwarePage;
