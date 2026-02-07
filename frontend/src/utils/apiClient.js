import axios from 'axios';
import { showError, showWarning } from './toast';

/**
 * Configuração centralizada do cliente HTTP (Axios)
 * 
 * Features:
 * - Interceptor de resposta global
 * - Tratamento automático de erros
 * - Retry automático em falhas de rede
 * - Timeout configurável
 * - Logging (opcional)
 */

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8082';
const TIMEOUT = parseInt(process.env.REACT_APP_TIMEOUT) || 5000;
const MAX_RETRIES = parseInt(process.env.REACT_APP_RETRY_ATTEMPTS) || 3;
const ENABLE_LOGGING = process.env.REACT_APP_ENABLE_LOGGING === 'true';

// Criar instância do axios
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor de Requisição
 * Log de requisições em desenvolvimento
 */
apiClient.interceptors.request.use(
  (config) => {
    if (ENABLE_LOGGING) {
      console.log(`📤 [API] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

/**
 * Interceptor de Resposta
 * Tratamento centralizado de erros HTTP
 */
apiClient.interceptors.response.use(
  (response) => {
    if (ENABLE_LOGGING) {
      console.log(`📥 [API] ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    // Erro de rede (sem resposta)
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        showError('⏱️ Request timeout - Server took too long to respond');
      } else if (error.code === 'ERR_NETWORK') {
        showError('🔌 Network error - Check your connection');
      } else {
        showError('❌ Connection error - Unable to reach server');
      }
      console.error('Network error:', error.message);
      return Promise.reject(error);
    }

    // Erro HTTP com resposta
    const { status, data } = error.response;
    const message = data?.error || data?.message || error.response.statusText || 'Unknown error';

    // 400 - Bad Request (validação)
    if (status === 400) {
      showError(`❌ Input Error: ${message}`);
    }
    // 401 - Unauthorized
    else if (status === 401) {
      showError('🔐 Unauthorized - Please login again');
      // Limpar localStorage e redirecionar para login
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    // 403 - Forbidden
    else if (status === 403) {
      showError('🚫 Access Denied - You do not have permission');
    }
    // 404 - Not Found
    else if (status === 404) {
      showWarning('⚠️ Resource not found');
    }
    // 409 - Conflict
    else if (status === 409) {
      showError(`⚠️ Conflict: ${message}`);
    }
    // 500 - Server Error
    else if (status >= 500) {
      showError('💥 Server error - Please try again later');
    }
    // Outros erros
    else {
      showError(`Error (${status}): ${message}`);
    }

    if (ENABLE_LOGGING) {
      console.error(`❌ [API] ${status} - ${message}`);
    }

    return Promise.reject(error);
  }
);

/**
 * Função auxiliar com retry automático
 * @param {Function} requestFn - Função que faz a requisição
 * @param {Number} retries - Tentativas restantes
 * @returns {Promise}
 */
export const withRetry = async (requestFn, retries = MAX_RETRIES) => {
  try {
    return await requestFn();
  } catch (error) {
    if (retries > 0 && (!error.response || error.response.status >= 500)) {
      console.warn(`Retrying request... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s before retry
      return withRetry(requestFn, retries - 1);
    }
    throw error;
  }
};

export default apiClient;
