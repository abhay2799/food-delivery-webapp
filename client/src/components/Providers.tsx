'use client';

import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import { Toaster } from 'react-hot-toast';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      {children}
      <Toaster position="top-right" toastOptions={{ duration: 3000, style: { background: '#1f2937', color: '#fff' } }} />
    </Provider>
  );
}
