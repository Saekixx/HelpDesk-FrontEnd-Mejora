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
import { useSoftware } from "@/hooks/software/useSoftware";
import {
  getSoftwareColumns,
  SoftwareItem,
} from "../components/software/SoftwareColumns";
import { SoftwareItem as SoftwareBackendItem } from "@/types/software/software.type";

function SoftwarePage() {
  const {
    softwareList,
    meta,
    isLoading,
    queryParams,
    limit,
    updateQuery,
    setPage,
    setLimit,
    resetQuery,
  } = useSoftware();

  // Catálogos globales en cascada (Clientes -> Sucursales)
  const { clientes, sucursales, setSelectedClienteId } = useCatalogOptions();

  // Estados locales para filtros en cascada
  const [selectedEmpresaFilter, setSelectedEmpresaFilter] = useState<
    number | null
  >(null);

  useEffect(() => {
    setSelectedClienteId(selectedEmpresaFilter);
  }, [selectedEmpresaFilter, setSelectedClienteId]);

  // Estado local temporal para acumular filtros antes de hacer clic en "Filtrar"
  const [, setPendingFilters] = useState<Record<string, any>>({});

  // Opciones estáticas permitidas para los filtros del backend
  const estadosOptions = [
    { label: "Activo", value: "Activo" },
    { label: "Suspendido", value: "Suspendido" },
    { label: "Caducado", value: "Caducado" },
    { label: "Inactivo", value: "Inactivo" },
  ];

  // 3. Mapeador de los datos de la API (SoftwareBackendItem) al formato que espera la tabla (SoftwareItem)
  const mappedSoftware: SoftwareItem[] = softwareList.map(
    (s: SoftwareBackendItem) => {
      const usados = s.licencias_usadas ?? 0;
      const total = s.limite_equipos ?? 1;
      const porcentaje = Math.round((usados / total) * 100);
      const libres = Math.max(0, total - usados);

      let estadoVisual: "Activo" | "Próximo a vencer" | "Cupo Lieno" = "Activo";
      if (usados >= total) {
        estadoVisual = "Cupo Lieno";
      } else if (s.estado === "Caducado" || s.estado === "Suspendido") {
        estadoVisual = "Próximo a vencer";
      }

      return {
        id_software: String(s.id_software),
        nombre_software: s.nombre_software,
        categoria: s.categoria || "General",
        empresa_cliente: `Cliente ID: ${s.id_cliente || "Global"}`,
        tipo_modelo: s.tipo_licencia || "Pool Limitado",
        usados: usados,
        total_cupos: total,
        libres: libres,
        porcentaje: porcentaje,
        proveedor: s.proveedor || "N/A",
        vigencia: s.fecha_caducidad
          ? new Date(s.fecha_caducidad).toLocaleDateString()
          : "Permanente",
        estado: estadoVisual,
      };
    },
  );

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
          value={String(meta.total)}
          icon={<Layers className="h-5 w-5 text-orange-600" />}
          iconContainerClassName="bg-orange-50 text-orange-600"
          footerText="Inventario global auditado"
        />
        <StatCard
          title="LICENCIAS ASIGNADAS"
          value={String(
            softwareList.reduce(
              (acc, curr) => acc + (curr.licencias_usadas || 0),
              0,
            ),
          )}
          icon={<FileCheck className="h-5 w-5 text-blue-600" />}
          iconContainerClassName="bg-blue-50 text-blue-600"
          footerText="Ocupación actual en equipos"
        />
        <StatCard
          title="LOTES ACTIVOS"
          value={String(softwareList.filter((s) => s.is_active).length)}
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
          iconContainerClassName="bg-emerald-50 text-emerald-600"
          footerText="Disponibles en plataforma"
        />
      </div>

      {/* 3. BARRA DE FILTROS (Aplicando acumulación local hasta dar click en Filtrar) */}
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
          setPendingFilters((prev) => ({ ...prev, [key]: value }));
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
              if (["id_cliente", "id_sucursal"].includes(key)) {
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
          setPendingFilters({});
          resetQuery();
          toast.info("Filtros restablecidos");
        }}
      />

      {/* 4. TABLA DE DATOS CONECTADA AL HOOK REAL */}
      <DataTableContainer
        data={mappedSoftware}
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

export default SoftwarePage;
