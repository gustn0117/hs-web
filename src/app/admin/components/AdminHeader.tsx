"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin");
  };

  const navItems = [
    { label: "대시보드", href: "/admin/dashboard" },
    { label: "포트폴리오", href: "/admin/portfolio" },
    { label: "클라이언트", href: "/admin/clients" },
    { label: "서버", href: "/admin/server" },
  ];

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link href="/admin/dashboard" className="no-underline">
          <h1 className="text-lg font-bold text-[var(--color-dark)]">
            HS <span className="gradient-text">WEB</span>
            <span className="text-[var(--color-gray)] font-normal text-sm ml-2">
              Admin
            </span>
          </h1>
        </Link>
        <nav className="flex items-center gap-4">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm no-underline transition-colors ${
                  isActive
                    ? "text-[var(--color-dark)] font-semibold"
                    : "text-[var(--color-gray)] hover:text-[var(--color-dark)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="text-[var(--color-gray)] text-sm no-underline hover:text-[var(--color-dark)] transition-colors"
        >
          사이트 보기
        </Link>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-gray-100 border border-gray-200 text-[var(--color-gray)] text-sm rounded-lg cursor-pointer hover:bg-gray-200 transition-all"
        >
          로그아웃
        </button>
      </div>
    </header>
  );
}
