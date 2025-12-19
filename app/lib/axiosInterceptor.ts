'use client';

import axios from 'axios';
import { getSession } from 'next-auth/react';


let isInterceptorSetup = false;

export function setupAxiosInterceptors() {
  if (isInterceptorSetup) return;

  // Configuration de base axios
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  axios.defaults.withCredentials = true;
  axios.defaults.withXSRFToken = true;

  // Intercepteur de requête pour ajouter le token
  axios.interceptors.request.use(
    async (config) => {
      // Récupérer le token depuis la session NextAuth
      const session = await getSession();
      
      const token = (session as any)?.accessToken;
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Intercepteur de réponse pour gérer les erreurs d'authentification
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token invalide ou expiré
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  isInterceptorSetup = true;
}
