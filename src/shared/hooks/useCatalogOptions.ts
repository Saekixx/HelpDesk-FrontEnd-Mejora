/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
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
        setRoles(rolesData);
        setClientes(clientesData);
        setPlanes(planesData);
      } catch (error) {
        console.error("Error al cargar catálogos iniciales", error);
      } finally {
        setLoadingRoles(false);
        setLoadingClientes(false);
        setLoadingPlanes(false);
      }
    };

    fetchInitialCatalogs();
  }, []);

  // 2. Cargar sucursales en cascada cuando cambia el cliente seleccionado
  useEffect(() => {
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
        setSucursales(data);
        // Limpiamos áreas y la sucursal seleccionada previa
        setAreas([]);
        setSelectedSucursalId(null);
      } catch (error) {
        console.error("Error al cargar sucursales", error);
      } finally {
        setLoadingSucursales(false);
      }
    };

    fetchSucursales();
  }, [selectedClienteId]);

  // 3. Cargar áreas en cascada cuando cambia la sucursal seleccionada
  useEffect(() => {
    if (!selectedSucursalId) {
      setAreas([]);
      return;
    }

    const fetchAreas = async () => {
      setLoadingAreas(true);
      try {
        const data = await getAreasOptions(selectedSucursalId);
        setAreas(data);
      } catch (error) {
        console.error("Error al cargar áreas", error);
      } finally {
        setLoadingAreas(false);
      }
    };

    fetchAreas();
  }, [selectedSucursalId]);

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
    loading: {
      roles: loadingRoles,
      clientes: loadingClientes,
      sucursales: loadingSucursales,
      areas: loadingAreas,
      planes: loadingPlanes,
    },
  };
};
