import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cuentos de Medianoche',
  description: 'Historias para dormir con tu voz',
  themeColor: '#0a0b14',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
