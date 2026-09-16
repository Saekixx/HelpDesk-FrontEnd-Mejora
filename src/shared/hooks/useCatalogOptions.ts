/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useMemo } from "react";
import { SelectOption } from "../types/select-option.types";
import {
  getRolesOptions,
  getClientesOptions,
  getSucursalesOptions,
  getAreasOptions,
  getPlanesOptions,
} from "../services/catalog.service";

export const useCatalogOptions = () => {
  // Listas de opciones para los desplegables
  const [roles, setRoles] = useState<SelectOption<number>[]>([]);
  const [clientes, setClientes] = useState<SelectOption<number>[]>([]);
  const [sucursales, setSucursales] = useState<SelectOption<number>[]>([]);
  const [areas, setAreas] = useState<SelectOption<number>[]>([]);
  const [planes, setPlanes] = useState<SelectOption<number>[]>([]);

  // Estados para controlar las dependencias en cascada
  const [selectedClienteId, setSelectedClienteId] = useState<number | null>(
    null,
  );
  const [selectedSucursalId, setSelectedSucursalId] = useState<number | null>(
    null,
  );

  // Estados de carga
  const [loadingRoles, setLoadingRoles] = useState<boolean>(false);
  const [loadingClientes, setLoadingClientes] = useState<boolean>(false);
  const [loadingSucursales, setLoadingSucursales] = useState<boolean>(false);
  const [loadingAreas, setLoadingAreas] = useState<boolean>(false);
  const [loadingPlanes, setLoadingPlanes] = useState<boolean>(false);

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
      setSelectedSucursalId(null);
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

  // Memorizamos el objeto loading para evitar renderizados innecesarios en el formulario
  const loading = useMemo(
    () => ({
      roles: loadingRoles,
      clientes: loadingClientes,
      sucursales: loadingSucursales,
      areas: loadingAreas,
      planes: loadingPlanes,
    }),
    [
      loadingRoles,
      loadingClientes,
      loadingSucursales,
      loadingAreas,
      loadingPlanes,
    ],
  );

  return {
    // Listas
    roles,
    clientes,
    sucursales,
    areas,
    planes,

    // Métodos para cambiar la dependencia
    setSelectedClienteId,
    setSelectedSucursalId,

    // Estados de carga
    loading,
  };
};
