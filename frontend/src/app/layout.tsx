import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  title: 'CardioGuard | Federated Heart Attack Risk Prediction',
  description:
    'Cloud-Based Federated Learning System for Heart Attack Risk Prediction (Logistic Regression + FedAvg)',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-[#EAF7FB] text-[#20343A]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
