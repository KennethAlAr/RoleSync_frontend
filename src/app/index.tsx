import { Redirect } from 'expo-router';

/**
 * Punto de Entrada Raíz de la Aplicación.
 * 
 * Actúa como la redirección inicial del enrutador (Expo Router). 
 * Al arrancar la aplicación, intercepta la ruta raíz (`/`) y redirige 
 * inmediatamente el flujo de navegación hacia la pantalla principal (`/home`), 
 * donde se inicializan las comprobaciones de sesión.
 *
 * @returns {JSX.Element} Componente de redirección hacia `/home`.
 */
const App = () => {
  return <Redirect href='/home'/>
}

export default App;