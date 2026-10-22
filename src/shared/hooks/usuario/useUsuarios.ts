import { useState, useEffect, useCallback } from "react";
import {
  getUsuarios,
  getEstadisticasUsuarios,
} from "@/services/usuarios/usuario.service";
import { UsuarioItem, GetUsuariosParams } from "@/types/usuario/usuario.types";
import { EstadisticaUsuarios } from "@/types/usuario/estadistica.type";

export const useUsuarios = () => {
  // Estado para las estadísticas de usuarios
  const [estadisticas, setEstadisticas] = useState<EstadisticaUsuarios | null>(
    null,
  );
  // Estado para el manejo de carga y errores de las estadísticas
  const [isLoadingStat, setIsLoadingStat] = useState<boolean>(false);

  // Función para obtener las estadísticas de usuarios desde la API
  const fetchEstadisticas = useCallback(async () => {
    setIsLoadingStat(true);
    try {
      const response = await getEstadisticasUsuarios();
      setEstadisticas(response.data);
    } catch (err) {
      console.error("Error al cargar estadísticas de usuarios:", err);
    } finally {
      setIsLoadingStat(false);
    }
  }, []);

  // Efecto para cargar las estadísticas al montar el componente
  useEffect(() => {
    fetchEstadisticas();
  }, [fetchEstadisticas]);

  // Estado para los parámetros de consulta (búsqueda, filtros, paginación)
  const [queryParams, setQueryParams] = useState<GetUsuariosParams>({
    page: 1,
    limit: 10,
  });

  const [usuarios, setUsuarios] = useState<UsuarioItem[]>([]);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    lastPage: 1,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener los usuarios reales desde la API
  const fetchUsuarios = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getUsuarios(queryParams);

      if (response && response.data) {
        setUsuarios(response.data.data || []);
        setMeta({
          total: response.data.total,
          page: response.data.page,
          lastPage: response.data.totalPages,
        });
      }
    } catch (err: any) {
      console.error("Error al cargar usuarios de la API:", err);
      setError(
        err?.response?.data?.message ||
          "Ocurrió un error al cargar los usuarios.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [queryParams]);

  // Ejecutar la consulta cada vez que cambien los filtros o la paginación
  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  // Actualizar filtros y reiniciar siempre a la página 1
  const updateQuery = (newFilters: Record<string, any>) => {
    setQueryParams((prev) => {
      const updated: Record<string, any> = { ...prev, ...newFilters, page: 1 };

      // Normalizar el estado (is_active) de string a booleano si aplica
      if (updated.is_active !== undefined) {
        if (updated.is_active === "true") updated.is_active = true;
        else if (updated.is_active === "false") updated.is_active = false;
        else if (updated.is_active === "all") delete updated.is_active;
      }

      // Normalizar el rol a número si aplica
      if (updated.id_rol && updated.id_rol !== "all") {
        updated.id_rol = Number(updated.id_rol);
      }

      // Limpiar claves vacías, nulas o con valor "all"
      Object.keys(updated).forEach((key) => {
        if (
          updated[key] === undefined ||
          updated[key] === null ||
          updated[key] === "all" ||
          updated[key] === ""
        ) {
          delete updated[key];
        }
      });

      return updated as GetUsuariosParams;
    });
  };

  const setPage = (newPage: number) => {
    setQueryParams((prev) => ({ ...prev, page: newPage }));
  };

  const setLimit = (newLimit: number) => {
    setQueryParams((prev) => ({ ...prev, limit: newLimit, page: 1 }));
  };

  const resetQuery = () => {
    setQueryParams({ page: 1, limit: 10 });
  };

  return {
    usuarios,
    meta,
    isLoading,
    error,
    queryParams,
    limit: queryParams.limit || 10,
    updateQuery,
    setPage,
    setLimit,
    resetQuery,
    refetch: fetchUsuarios,
    estadisticas,
    isLoadingEstadisticas: isLoadingStat,
  };
};
