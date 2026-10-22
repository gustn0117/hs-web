import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "고객 포털 | 하온",
  robots: { index: false, follow: false },
};

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
