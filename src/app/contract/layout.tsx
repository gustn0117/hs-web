import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "전자 계약 서명",
  robots: { index: false, follow: false, nocache: true },
};

export default function ContractLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
