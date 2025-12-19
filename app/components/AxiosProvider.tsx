'use client';

import { useEffect } from 'react';
import { setupAxiosInterceptors } from '../lib/axiosInterceptor';

export default function AxiosProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    setupAxiosInterceptors();
  }, []);

  return <>{children}</>;
}
