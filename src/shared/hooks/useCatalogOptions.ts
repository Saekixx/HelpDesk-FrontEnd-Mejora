/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useMemo, useCallback } from "react";
import { SelectOption } from "../types/select-option.types";
import {
  getRolesOptions,
  getClientesOptions,
  getSucursalesOptions,
  getAreasOptions,
  getPlanesOptions,
  getTrabajadoresOptions,
  GetTrabajadoresOptionsParams,
} from "../services/catalog.service";

export const useCatalogOptions = () => {
  // Listas de opciones para los desplegables
  const [roles, setRoles] = useState<SelectOption<number>[]>([]);
  const [clientes, setClientes] = useState<SelectOption<number>[]>([]);
  const [sucursales, setSucursales] = useState<SelectOption<number>[]>([]);
  const [areas, setAreas] = useState<SelectOption<number>[]>([]);
  const [planes, setPlanes] = useState<SelectOption<number>[]>([]);
  const [trabajadores, setTrabajadores] = useState<SelectOption<number>[]>([]);
  const [soportes, setSoportes] = useState<SelectOption<number>[]>([]);

  // Estados para controlar las dependencias en cascada
  const [selectedClienteId, setSelectedClienteId] = useState<number | null>(
    null,
  );
  const [selectedSucursalId, setSelectedSucursalId] = useState<number | null>(
    null,
  );
  const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null);

  // Estados de carga
  const [loadingRoles, setLoadingRoles] = useState<boolean>(false);
  const [loadingClientes, setLoadingClientes] = useState<boolean>(false);
  const [loadingSucursales, setLoadingSucursales] = useState<boolean>(false);
  const [loadingAreas, setLoadingAreas] = useState<boolean>(false);
  const [loadingPlanes, setLoadingPlanes] = useState<boolean>(false);
  const [loadingTrabajadores, setLoadingTrabajadores] =
    useState<boolean>(false);
  const [loadingSoportes, setLoadingSoportes] = useState<boolean>(false);

  // 1. Cargar catálogos independientes al montar (Roles, Clientes y Planes)
  useEffect(() => {
    let isMounted = true;

    const fetchInitialCatalogs = async () => {
      setLoadingRoles(true);
      setLoadingClientes(true);
      setLoadingPlanes(true);
      try {
        const [rolesData, clientesData, planesData] = await Promise.all([
          getRolesOptions(),
          getClientesOptions(),
          getPlanesOptions(),
        ]);

        if (isMounted) {
          setRoles(rolesData || []);
          setClientes(clientesData || []);
          setPlanes(planesData || []);
        }
      } catch (error) {
        console.error("Error al cargar catálogos iniciales", error);
      } finally {
        if (isMounted) {
          setLoadingRoles(false);
          setLoadingClientes(false);
          setLoadingPlanes(false);
        }
      }
    };

    fetchInitialCatalogs();

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Cargar sucursales en cascada cuando cambia el cliente seleccionado
  useEffect(() => {
    let isMounted = true;

    if (!selectedClienteId) {
      setSucursales([]);
      setAreas([]);
      setTrabajadores([]);
      setSelectedSucursalId(null);
      setSelectedAreaId(null);
      return;
    }

    const fetchSucursales = async () => {
      setLoadingSucursales(true);
      try {
        const data = await getSucursalesOptions(selectedClienteId);
        if (isMounted) {
          setSucursales(data || []);
        }
      } catch (error) {
        console.error("Error al cargar sucursales", error);
      } finally {
        if (isMounted) {
          setLoadingSucursales(false);
        }
      }
    };

    fetchSucursales();

    return () => {
      isMounted = false;
    };
  }, [selectedClienteId]);

  // 3. Cargar áreas en cascada cuando cambia la sucursal seleccionada
  useEffect(() => {
    let isMounted = true;

    if (!selectedSucursalId) {
      setAreas([]);
      setSelectedAreaId(null);
      return;
    }

    const fetchAreas = async () => {
      setLoadingAreas(true);
      try {
        const data = await getAreasOptions(selectedSucursalId);
        if (isMounted) {
          setAreas(data || []);
        }
      } catch (error) {
        console.error("Error al cargar áreas", error);
      } finally {
        if (isMounted) {
          setLoadingAreas(false);
        }
      }
    };

    fetchAreas();

    return () => {
      isMounted = false;
    };
  }, [selectedSucursalId]);

  // 4. Cargar trabajadores generales cuando se selecciona un cliente, sucursal o área
  useEffect(() => {
    let isMounted = true;

    if (!selectedClienteId && !selectedSucursalId) {
      setTrabajadores([]);
      return;
    }

    const fetchTrabajadores = async () => {
      setLoadingTrabajadores(true);
      try {
        const data = await getTrabajadoresOptions({
          id_cliente: selectedClienteId ?? undefined,
          id_sucursal: selectedSucursalId ?? undefined,
          id_area: selectedAreaId ?? undefined,
        });
        if (isMounted) {
          setTrabajadores(data || []);
        }
      } catch (error) {
        console.error("Error al cargar trabajadores", error);
      } finally {
        if (isMounted) {
          setLoadingTrabajadores(false);
        }
      }
    };

    fetchTrabajadores();

    return () => {
      isMounted = false;
    };
  }, [selectedClienteId, selectedSucursalId, selectedAreaId]);

  // 5. Función para consultar explícitamente usuarios con rol de Soporte Técnico
  const getSoportesOptions = useCallback(
    async (extraParams?: GetTrabajadoresOptionsParams) => {
      setLoadingSoportes(true);
      try {
        const data = await getTrabajadoresOptions({
          ...extraParams,
          rol: "SOPORTE_TECNICO",
        });
        setSoportes(data || []);
        return data || [];
      } catch (error) {
        console.error("Error al cargar usuarios de soporte técnico", error);
        return [];
      } finally {
        setLoadingSoportes(false);
      }
    },
    [],
  );

  // Memorizamos el objeto loading para evitar renderizados innecesarios
  const loading = useMemo(
    () => ({
      roles: loadingRoles,
      clientes: loadingClientes,
      sucursales: loadingSucursales,
      areas: loadingAreas,
      planes: loadingPlanes,
      trabajadores: loadingTrabajadores,
      soportes: loadingSoportes,
    }),
    [
      loadingRoles,
      loadingClientes,
      loadingSucursales,
      loadingAreas,
      loadingPlanes,
      loadingTrabajadores,
      loadingSoportes,
    ],
  );

  return {
    // Listas
    roles,
    clientes,
    sucursales,
    areas,
    planes,
    trabajadores,
    soportes,

    // Métodos para cargar u obtener datos específicos
    getSoportesOptions,
    setSelectedClienteId,
    setSelectedSucursalId,
    setSelectedAreaId,

    // Estados de carga
    loading,
  };
};
