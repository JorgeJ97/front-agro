export const getEnvironmentVariables = () => {
  // Intentar obtener las variables de entorno de Vite primero
  let hostApiAgro = import.meta.env.VITE_HOST_API_AGRO;
  let statusProject = import.meta.env.VITE_STATUS_PROJECT;

  // Si no están disponibles en Vite, intentar obtenerlas de window.ENV (para Docker)
  if (!hostApiAgro || !statusProject) {
    // @ts-ignore
    const env = window.ENV || {};
    hostApiAgro = hostApiAgro || env.VITE_HOST_API_AGRO;
    statusProject = statusProject || env.VITE_STATUS_PROJECT;
  }

  // Valores por defecto si no se encuentran las variables
  if (!hostApiAgro) {
    console.log(`No hay variable de entorno para hostApiAgro`);
    hostApiAgro = 'http://localhost:3000/';
  }
  if (!statusProject) {
    console.log('No hay variable de entorno para statusProject');
    statusProject = 'development';
  }

  return {
    HOST_API_AGRO: hostApiAgro,
    STATUS_PROJECT: statusProject,
  };
};
