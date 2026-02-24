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
    { label: "포트폴리오", href: "/admin/portfolio" },
    { label: "클라이언트", href: "/admin/clients" },
  ];

  return (
    <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <h1 className="text-lg font-bold text-white">
          HS <span className="gradient-text">WEB</span>
          <span className="text-[var(--color-gray-light)] font-normal text-sm ml-2">
            Admin
          </span>
        </h1>
        <nav className="flex items-center gap-4">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm no-underline transition-colors ${
                  isActive
                    ? "text-white font-semibold"
                    : "text-[var(--color-gray-light)] hover:text-white"
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
          className="text-[var(--color-gray-light)] text-sm no-underline hover:text-white transition-colors"
        >
          사이트 보기
        </Link>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-white/[0.06] border border-white/10 text-[var(--color-gray-light)] text-sm rounded-lg cursor-pointer hover:bg-white/10 transition-all"
        >
          로그아웃
        </button>
      </div>
    </header>
  );
}
