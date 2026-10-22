import type { ServiceSite } from "@/lib/service-sites";
import type { NavItem, PanelGroup } from "./ServiceNav";

const I = {
  home: "M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75",
  info: "M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z",
  route: "M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z",
  folder:
    "M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z",
  card: "M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z",
  chat: "M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z",
  book: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25",
  user: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z",
  star: "M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z",
};

/** 그 사이트에 실제로 내용이 있는 메뉴만 띄운다. */
export function buildNav(site: ServiceSite): NavItem[] {
  const nav: NavItem[] = [{ label: "홈", href: "/" }];
  if (site.concept) nav.push({ label: "서비스 소개", href: "/about" });
  if (site.steps) nav.push({ label: "진행 절차", href: "/process" });
  if (site.showcaseCategories) nav.push({ label: "제작 사례", href: "/cases" });
  nav.push({ label: "가격", href: "/pricing" });
  nav.push({ label: "자주 묻는 질문", href: "/faq" });
  nav.push({ label: "문의", href: "/contact" });
  return nav;
}

export function buildPanelGroups(site: ServiceSite): PanelGroup[] {
  const service = [{ href: "/", label: "홈", icon: I.home }];
  if (site.concept) service.push({ href: "/about", label: "서비스 소개", icon: I.info });
  if (site.steps) service.push({ href: "/process", label: "진행 절차", icon: I.route });
  if (site.showcaseCategories) service.push({ href: "/cases", label: "제작 사례", icon: I.folder });
  service.push({ href: "/pricing", label: "가격 안내", icon: I.card });

  const help = [{ href: "/faq", label: "자주 묻는 질문", icon: I.chat }];
  if (site.glossary) help.push({ href: "/glossary", label: "용어 풀이", icon: I.book });
  help.push({ href: "/contact", label: "상담 신청", icon: I.user });

  return [
    { key: "서비스", items: service },
    { key: "도움말", items: help },
    {
      key: "하온",
      items: [
        { href: "https://hsweb.pics", label: "본 사이트", icon: I.home },
        { href: "https://hsweb.pics/portfolio", label: "전체 제작 사례", icon: I.folder },
        { href: "https://hsweb.pics/why-hs-web", label: "하온을 선택하는 이유", icon: I.star },
      ],
    },
  ];
}
