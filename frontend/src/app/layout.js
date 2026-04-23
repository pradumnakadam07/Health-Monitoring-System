import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import I18nProvider from '@/components/I18nProvider';
import Chatbot from '@/components/Chatbot';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
});

export const metadata = {
  title: 'HealthAI - Intelligent Diagnosis & Symptom Analysis',
  description: 'AI-powered early-warning health assistant that predicts health risks from symptoms',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${plusJakarta.variable}`}>
        <AuthProvider>
          <I18nProvider>
            {children}
            <Chatbot />
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
