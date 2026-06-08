import { Outlet } from 'react-router-dom';
import { SmoothScrollProvider } from '../components/SmoothScrollProvider';

/**
 * RootLayout
 * Wraps every route in the smooth scroll provider.
 * Lives inside RouterProvider so useLocation is available.
 */
export function RootLayout() {
  return (
    <SmoothScrollProvider>
      <Outlet />
    </SmoothScrollProvider>
  );
}
