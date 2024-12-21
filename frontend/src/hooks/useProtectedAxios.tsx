import { protectedAxios } from '../api/axios';
import { useEffect, useRef } from 'react';
import { useUser } from '../contexts/userContext';
import { useRefreshToken } from './useRefreshToken';

const useProtectedAxios = () => {
  const { accessToken, logout } = useUser();
  const refresh = useRefreshToken();
  const refreshTokenPromise = useRef<Promise<string | null> | null>(null);

  useEffect(() => {
    const requestIntercept = protectedAxios.interceptors.request.use(
      (config) => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = protectedAxios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (
          error?.response?.status === 403 &&
          prevRequest &&
          !prevRequest?.sent
        ) {
          prevRequest.sent = true;

          if (!refreshTokenPromise.current) {
            refreshTokenPromise.current = refresh();
          }

          try {
            const newAccessToken = await refreshTokenPromise.current;
            if (newAccessToken) {
              prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
              return protectedAxios(prevRequest);
            } else {
              throw new Error('Failed to refresh token');
            }
          } catch (refreshError) {
            logout();
            throw refreshError;
          } finally {
            refreshTokenPromise.current = null;
          }
        }
        return Promise.reject(error);
      }
    );
    return () => {
      protectedAxios.interceptors.request.eject(requestIntercept);
      protectedAxios.interceptors.response.eject(responseIntercept);
    };
  }, [accessToken, logout, refresh]);

  return protectedAxios;
};


export default useProtectedAxios;