import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../tailwind.config';

// Compilación de la configuración completa de Tailwind para extraer sus metadatos
const fullConfig = resolveConfig(tailwindConfig);

/**
 * Módulo de Colores del Tema Global (Theme Colors).
 * 
 * Actúa como la Única Fuente de la Verdad (Single Source of Truth) para el sistema de diseño 
 * de la aplicación. Extrae y tipa dinámicamente la paleta de colores definida en el archivo 
 * de configuración de Tailwind (`tailwind.config.js`), permitiendo su consumo directo 
 * en componentes de código TypeScript y hojas de estilo nativas sin duplicar valores hexadecimales.
 * 
 * @type {Record<string, any>}
 */
export const colors = fullConfig.theme?.colors as any;