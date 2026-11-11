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
import { useSoftwareMutations } from "@/hooks/software/useSoftwareMutations";
import {
  getSoftwareColumns,
  SoftwareItem,
} from "../components/software/SoftwareColumns";
import { SoftwareItem as SoftwareBackendItem } from "@/types/software/software.type";
import { SoftwareModal } from "@/components/software/SoftwareModal";
import { SoftwareDetailModal } from "@/components/software/SoftwareDetailModal";
import { SoftwareBovedaModal } from "@/components/software/SoftwareBovedaModal";
import { SoftwareFormData } from "@/schema/software/software.schema";

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
    refetch,
  } = useSoftware();

  const {
    crearSoftware,
    actualizarSoftware,
    asignarSoftware,
    liberarSoftware,
    isSubmitting,
  } = useSoftwareMutations();

  // Estados para controlar los modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [softwareToEdit, setSoftwareToEdit] =
    useState<SoftwareBackendItem | null>(null);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedDetailId, setSelectedDetailId] = useState<
    number | string | null
  >(null);

  const [isBovedaOpen, setIsBovedaOpen] = useState(false);
  const [selectedBovedaId, setSelectedBovedaId] = useState<
    number | string | null
  >(null);

  // 1. Catálogos globales para la TABLA
  const { clientes, sucursales, setSelectedClienteId } = useCatalogOptions();
  const [selectedEmpresaFilter, setSelectedEmpresaFilter] = useState<
    number | null
  >(null);

  useEffect(() => {
    setSelectedClienteId(selectedEmpresaFilter);
  }, [selectedEmpresaFilter, setSelectedClienteId]);

  // 2. Catálogos para el MODAL DE CREACIÓN/EDICIÓN
  const {
    sucursales: modalSucursales,
    setSelectedClienteId: setModalSelectedClienteId,
    setSelectedSucursalId: setModalSelectedSucursalId,
  } = useCatalogOptions();

  const handleModalClienteChange = (clienteId: string | number) => {
    const numId = clienteId ? Number(clienteId) : null;
    setModalSelectedClienteId(numId);
    setModalSelectedSucursalId(null);
  };

  // 3. Catálogos en cascada específicos para el MODAL DE BÓVEDA (Áreas -> Equipos)
  const {
    areas: bovedaAreas,
    equipos: bovedaEquipos,
    setSelectedSucursalId: setBovedaSelectedSucursalId,
    setSelectedAreaId: setBovedaSelectedAreaId,
  } = useCatalogOptions();

  const [, setPendingFilters] = useState<Record<string, any>>({});

  const estadosOptions = [
    { label: "Activo", value: "Activo" },
    { label: "Suspendido", value: "Suspendido" },
    { label: "Caducado", value: "Caducado" },
    { label: "Inactivo", value: "Inactivo" },
  ];

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
    setSelectedDetailId(item.id_software);
    setIsDetailOpen(true);
  };

  const handleEdit = (item: SoftwareItem) => {
    const originalItem = softwareList.find(
      (s) => String(s.id_software) === item.id_software,
    );
    if (originalItem) {
      setSoftwareToEdit(originalItem);
      if (originalItem.id_cliente) {
        setModalSelectedClienteId(Number(originalItem.id_cliente));
      }
      setIsModalOpen(true);
    } else {
      toast.error("No se encontró el registro para editar.");
    }
  };

  const handleManageLicenses = (item: SoftwareItem) => {
    const originalItem = softwareList.find(
      (s) => String(s.id_software) === item.id_software,
    );
    if (originalItem) {
      setSelectedBovedaId(originalItem.id_software);
      setIsBovedaOpen(true);
    } else {
      toast.error("No se pudo cargar la bóveda del software.");
    }
  };

  const handleOpenCreate = () => {
    setSoftwareToEdit(null);
    setModalSelectedClienteId(null);
    setModalSelectedSucursalId(null);
    setIsModalOpen(true);
  };

  const handleSubmitForm = async (data: SoftwareFormData) => {
    try {
      const payload = { ...data };
      if (softwareToEdit && !payload.licencia_master_key) {
        delete payload.licencia_master_key;
      }

      if (softwareToEdit) {
        await actualizarSoftware(softwareToEdit.id_software, payload);
        toast.success("Lote de software actualizado correctamente");
      } else {
        await crearSoftware(payload);
        toast.success("Lote de software registrado correctamente");
      }
      setIsModalOpen(false);
      refetch();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Ocurrió un error al procesar el software");
    }
  };

  const handleAssignEquipment = async (
    softwareId: number | string,
    data: any,
  ) => {
    await asignarSoftware(softwareId, data);
    refetch();
  };

  const handleReleaseEquipment = async (idAssignment: number | string) => {
    await liberarSoftware(idAssignment);
    refetch();
  };

  return (
    <div className="p-6 bg-slate-50/50 min-h-screen space-y-4">
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

      <SoftwareModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitForm}
        softwareToEdit={softwareToEdit}
        isSubmitting={isSubmitting}
        clientes={clientes}
        sucursales={modalSucursales}
        onClienteChange={handleModalClienteChange}
      />

      <SoftwareDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        softwareId={selectedDetailId}
      />

      {/* Modal de Bóveda con los catálogos y setters inyectados */}
      <SoftwareBovedaModal
        isOpen={isBovedaOpen}
        onClose={() => setIsBovedaOpen(false)}
        softwareId={selectedBovedaId}
        onAssignEquipment={handleAssignEquipment}
        onReleaseEquipment={handleReleaseEquipment}
        isSubmitting={isSubmitting}
        areas={bovedaAreas}
        equipos={bovedaEquipos}
        setSelectedSucursalId={setBovedaSelectedSucursalId}
        setSelectedAreaId={setBovedaSelectedAreaId}
      />
    </div>
  );
}

export default SoftwarePage;
