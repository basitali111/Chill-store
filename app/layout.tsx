import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Providers from '@/components/Providers';
import DrawerButton from '@/components/DrawerButton';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/header/Header';
import { Roboto, Lora } from 'next/font/google';
import WhatsappChat from '@/components/WhatsappChat';

const roboto = Roboto({ subsets: ['latin'], weight: ['400', '500', '700'] });
const lora = Lora({ subsets: ['latin'], weight: ['400', '700'] });

export const metadata: Metadata = {
  title: 'Kensin Store',
  description: 'Modern ECommerce Website',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${roboto.className} ${lora.className}`}>
        <Providers>
          <div className="drawer">
            <DrawerButton />
            <div className="drawer-content">
              <div className="min-h-screen flex flex-col">
                <Header />
                {children}
              </div>
            </div>
            <div className="drawer-side">
              <label
                htmlFor="my-drawer"
                aria-label="close sidebar"
                className="drawer-overlay"
              ></label>
              <Sidebar />
            </div>
            <WhatsappChat/>
          </div>
        </Providers>
      </body>
    </html>
  );
}
