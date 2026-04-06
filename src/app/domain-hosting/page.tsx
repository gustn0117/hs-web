import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "도메인 & 호스팅이란? | HS WEB",
  description: "도메인과 호스팅이 무엇인지, 웹사이트 유지에 왜 필요한지 쉽고 자세하게 설명합니다. 도메인 등록, 호스팅 서버, 비용까지 한눈에 알아보세요.",
  alternates: { canonical: "https://hsweb.pics/domain-hosting" },
};

/* ─── SVG 일러스트 컴포넌트들 ─── */

function DomainIllust() {
  return (
    <svg viewBox="0 0 400 260" fill="none" className="w-full max-w-[400px] mx-auto">
      {/* 브라우저 */}
      <rect x="40" y="30" width="320" height="200" rx="16" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2" />
      <rect x="40" y="30" width="320" height="40" rx="16" fill="#e2e8f0" />
      <rect x="40" y="54" width="320" height="16" fill="#e2e8f0" />
      <circle cx="64" cy="50" r="6" fill="#f87171" />
      <circle cx="84" cy="50" r="6" fill="#fbbf24" />
      <circle cx="104" cy="50" r="6" fill="#34d399" />
      {/* 주소창 */}
      <rect x="130" y="40" width="200" height="20" rx="6" fill="white" stroke="#94a3b8" strokeWidth="1" />
      <text x="155" y="55" fontSize="10" fill="#3b82f6" fontWeight="700" fontFamily="monospace">hsweb.pics</text>
      {/* 잠금 아이콘 */}
      <rect x="138" y="46" width="8" height="7" rx="2" fill="none" stroke="#22c55e" strokeWidth="1.5" />
      <path d="M140 46v-2a2 2 0 014 0v2" fill="none" stroke="#22c55e" strokeWidth="1.5" />
      {/* 웹사이트 내용 */}
      <rect x="60" y="85" width="280" height="12" rx="3" fill="#cbd5e1" />
      <rect x="60" y="105" width="200" height="10" rx="3" fill="#e2e8f0" />
      <rect x="60" y="125" width="120" height="40" rx="8" fill="#3b82f6" opacity="0.15" />
      <rect x="200" y="125" width="120" height="40" rx="8" fill="#3b82f6" opacity="0.1" />
      <rect x="60" y="180" width="260" height="8" rx="2" fill="#e2e8f0" />
      <rect x="60" y="195" width="180" height="8" rx="2" fill="#f1f5f9" />
      {/* 화살표: 도메인 → 브라우저 */}
      <path d="M200 10 L200 28" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 3" markerEnd="url(#arrow)" />
      <text x="130" y="10" fontSize="11" fill="#3b82f6" fontWeight="700">도메인 = 인터넷 주소</text>
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
        </marker>
      </defs>
    </svg>
  );
}

function HostingIllust() {
  return (
    <svg viewBox="0 0 400 280" fill="none" className="w-full max-w-[400px] mx-auto">
      {/* 서버 */}
      <rect x="130" y="20" width="140" height="180" rx="12" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2" />
      <text x="168" y="16" fontSize="10" fill="#64748b" fontWeight="600">서버 (호스팅)</text>
      {/* 서버 슬롯 1 */}
      <rect x="148" y="40" width="104" height="28" rx="6" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
      <circle cx="162" cy="54" r="4" fill="#22c55e" />
      <rect x="174" y="50" width="50" height="4" rx="2" fill="#94a3b8" />
      <circle cx="240" cy="54" r="3" fill="#3b82f6" />
      {/* 서버 슬롯 2 */}
      <rect x="148" y="78" width="104" height="28" rx="6" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
      <circle cx="162" cy="92" r="4" fill="#22c55e" />
      <rect x="174" y="88" width="40" height="4" rx="2" fill="#94a3b8" />
      <circle cx="240" cy="92" r="3" fill="#fbbf24" />
      {/* 서버 슬롯 3 */}
      <rect x="148" y="116" width="104" height="28" rx="6" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
      <circle cx="162" cy="130" r="4" fill="#22c55e" />
      <rect x="174" y="126" width="60" height="4" rx="2" fill="#94a3b8" />
      <circle cx="240" cy="130" r="3" fill="#3b82f6" />
      {/* 파일들 */}
      <rect x="155" y="155" width="24" height="30" rx="3" fill="#3b82f6" opacity="0.2" />
      <text x="160" y="174" fontSize="7" fill="#3b82f6" fontWeight="600">HTML</text>
      <rect x="185" y="155" width="24" height="30" rx="3" fill="#8b5cf6" opacity="0.2" />
      <text x="192" y="174" fontSize="7" fill="#8b5cf6" fontWeight="600">CSS</text>
      <rect x="215" y="155" width="24" height="30" rx="3" fill="#f59e0b" opacity="0.2" />
      <text x="221" y="174" fontSize="7" fill="#f59e0b" fontWeight="600">IMG</text>
      {/* 사용자들 */}
      <circle cx="50" cy="100" r="20" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1.5" />
      <circle cx="50" cy="93" r="7" fill="#3b82f6" opacity="0.3" />
      <path d="M36 110 a14 14 0 0128 0" fill="#3b82f6" opacity="0.2" />
      <circle cx="350" cy="80" r="20" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1.5" />
      <circle cx="350" cy="73" r="7" fill="#3b82f6" opacity="0.3" />
      <path d="M336 90 a14 14 0 0128 0" fill="#3b82f6" opacity="0.2" />
      <circle cx="350" cy="140" r="20" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1.5" />
      <circle cx="350" cy="133" r="7" fill="#3b82f6" opacity="0.3" />
      <path d="M336 150 a14 14 0 0128 0" fill="#3b82f6" opacity="0.2" />
      {/* 연결선 */}
      <path d="M70 100 L130 100" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 3" />
      <path d="M270 60 L330 80" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 3" />
      <path d="M270 120 L330 140" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 3" />
      {/* 레이블 */}
      <text x="20" y="140" fontSize="9" fill="#64748b" fontWeight="600">방문자</text>
      <text x="330" y="170" fontSize="9" fill="#64748b" fontWeight="600">방문자들</text>
      {/* 하단 설명 */}
      <text x="110" y="224" fontSize="11" fill="#1e293b" fontWeight="700">파일을 저장하고 전달하는 컴퓨터</text>
      <text x="130" y="242" fontSize="10" fill="#64748b">= 24시간 켜져있는 내 사이트의 집</text>
    </svg>
  );
}

function FlowIllust() {
  return (
    <svg viewBox="0 0 600 120" fill="none" className="w-full max-w-[600px] mx-auto">
      {/* 사용자 */}
      <circle cx="60" cy="50" r="28" fill="#dbeafe" stroke="#93c5fd" strokeWidth="2" />
      <circle cx="60" cy="42" r="9" fill="#3b82f6" opacity="0.3" />
      <path d="M43 65 a17 17 0 0134 0" fill="#3b82f6" opacity="0.2" />
      <text x="36" y="95" fontSize="10" fill="#1e293b" fontWeight="600">사용자</text>
      {/* 화살표 1 */}
      <path d="M95 50 L175 50" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowF)" />
      <text x="110" y="42" fontSize="8" fill="#3b82f6" fontWeight="600">hsweb.pics</text>
      <text x="115" y="66" fontSize="8" fill="#94a3b8">주소 입력</text>
      {/* 도메인 (DNS) */}
      <rect x="180" y="25" width="100" height="50" rx="12" fill="#eff6ff" stroke="#93c5fd" strokeWidth="2" />
      <text x="196" y="47" fontSize="9" fill="#3b82f6" fontWeight="700">도메인 (DNS)</text>
      <text x="198" y="62" fontSize="8" fill="#64748b">주소 → IP 변환</text>
      {/* 화살표 2 */}
      <path d="M285 50 L365 50" stroke="#8b5cf6" strokeWidth="2" markerEnd="url(#arrowF2)" />
      <text x="300" y="42" fontSize="8" fill="#8b5cf6" fontWeight="600">123.45.67.89</text>
      <text x="305" y="66" fontSize="8" fill="#94a3b8">IP로 이동</text>
      {/* 호스팅 서버 */}
      <rect x="370" y="20" width="110" height="60" rx="12" fill="#f5f3ff" stroke="#a78bfa" strokeWidth="2" />
      <text x="382" y="45" fontSize="9" fill="#7c3aed" fontWeight="700">호스팅 서버</text>
      <text x="385" y="60" fontSize="8" fill="#64748b">사이트 파일 저장</text>
      {/* 화살표 3 */}
      <path d="M485 50 L540 50" stroke="#22c55e" strokeWidth="2" markerEnd="url(#arrowF3)" />
      <text x="492" y="42" fontSize="8" fill="#22c55e" fontWeight="600">응답</text>
      {/* 화면 */}
      <rect x="545" y="28" width="50" height="44" rx="6" fill="#f0fdf4" stroke="#86efac" strokeWidth="2" />
      <rect x="551" y="40" width="38" height="22" rx="3" fill="#bbf7d0" />
      <text x="553" y="90" fontSize="8" fill="#1e293b" fontWeight="600">사이트 표시!</text>
      <defs>
        <marker id="arrowF" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" /></marker>
        <marker id="arrowF2" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#8b5cf6" /></marker>
        <marker id="arrowF3" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#22c55e" /></marker>
      </defs>
    </svg>
  );
}

function HouseIllust() {
  return (
    <svg viewBox="0 0 400 200" fill="none" className="w-full max-w-[360px] mx-auto">
      {/* 왼쪽: 도메인 = 주소 */}
      <rect x="20" y="40" width="150" height="140" rx="12" fill="#eff6ff" stroke="#93c5fd" strokeWidth="1.5" />
      <text x="56" y="32" fontSize="12" fill="#3b82f6" fontWeight="800">도메인</text>
      {/* 도로 표지판 */}
      <rect x="65" y="60" width="60" height="40" rx="6" fill="white" stroke="#3b82f6" strokeWidth="1.5" />
      <text x="72" y="75" fontSize="7" fill="#3b82f6" fontWeight="700">서울시 강남구</text>
      <text x="72" y="88" fontSize="7" fill="#3b82f6" fontWeight="700">테헤란로 123</text>
      <line x1="95" y1="100" x2="95" y2="125" stroke="#94a3b8" strokeWidth="2" />
      <text x="95" y="148" fontSize="9" fill="#64748b" textAnchor="middle">집의 &quot;주소&quot; 역할</text>
      <text x="95" y="165" fontSize="8" fill="#94a3b8" textAnchor="middle">주소가 없으면</text>
      <text x="95" y="177" fontSize="8" fill="#94a3b8" textAnchor="middle">찾아갈 수 없습니다</text>
      {/* 오른쪽: 호스팅 = 건물 */}
      <rect x="230" y="40" width="150" height="140" rx="12" fill="#f5f3ff" stroke="#a78bfa" strokeWidth="1.5" />
      <text x="268" y="32" fontSize="12" fill="#7c3aed" fontWeight="800">호스팅</text>
      {/* 집 모양 */}
      <path d="M305 70 L275 95 L335 95 Z" fill="#a78bfa" opacity="0.2" stroke="#7c3aed" strokeWidth="1.5" />
      <rect x="283" y="95" width="44" height="30" fill="white" stroke="#7c3aed" strokeWidth="1.5" />
      <rect x="298" y="105" width="14" height="20" fill="#ddd6fe" />
      <text x="305" y="148" fontSize="9" fill="#64748b" textAnchor="middle">집의 &quot;건물&quot; 역할</text>
      <text x="305" y="165" fontSize="8" fill="#94a3b8" textAnchor="middle">건물이 없으면</text>
      <text x="305" y="177" fontSize="8" fill="#94a3b8" textAnchor="middle">살 수 없습니다</text>
      {/* 가운데 + */}
      <text x="192" y="115" fontSize="24" fill="#cbd5e1" fontWeight="900">+</text>
    </svg>
  );
}

/* ─── 섹션 컴포넌트 ─── */

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`py-16 md:py-24 ${className}`}>{children}</section>;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[var(--color-primary)] text-sm font-semibold tracking-wider uppercase mb-3">{children}</p>;
}

export default function DomainHostingPage() {
  return (
    <div className="pt-[72px]">
      {/* ═══ Hero ═══ */}
      <Section className="bg-gradient-to-b from-blue-50/50 to-white text-center">
        <div className="max-w-[800px] mx-auto px-6">
          <SectionLabel>Domain & Hosting Guide</SectionLabel>
          <h1 className="text-3xl md:text-5xl font-black text-[var(--color-dark)] leading-tight mb-6">
            도메인과 호스팅,<br />
            <span className="text-[var(--color-primary)]">왜 필요할까요?</span>
          </h1>
          <p className="text-lg text-[var(--color-gray)] leading-relaxed max-w-[600px] mx-auto">
            웹사이트를 만든 후에도 사이트가 인터넷에서 계속 작동하려면<br className="hidden md:inline" />
            <strong className="text-[var(--color-dark)]">도메인</strong>과 <strong className="text-[var(--color-dark)]">호스팅</strong> 두 가지가 반드시 필요합니다.
          </p>
        </div>
      </Section>

      {/* ═══ 비유: 집 = 호스팅, 주소 = 도메인 ═══ */}
      <Section>
        <div className="max-w-[900px] mx-auto px-6">
          <div className="text-center mb-12">
            <SectionLabel>쉽게 이해하기</SectionLabel>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-dark)]">
              집에 비유하면 이렇습니다
            </h2>
          </div>
          <HouseIllust />
          <div className="mt-10 max-w-[600px] mx-auto">
            <p className="text-center text-[var(--color-gray)] leading-relaxed">
              웹사이트를 <strong className="text-[var(--color-dark)]">집</strong>이라고 생각해보세요.<br />
              <strong className="text-[var(--color-primary)]">호스팅</strong>은 집 자체(건물)이고,
              <strong className="text-[var(--color-primary)]"> 도메인</strong>은 그 집의 주소입니다.<br /><br />
              건물(호스팅)이 없으면 살 곳이 없고,<br />
              주소(도메인)가 없으면 사람들이 찾아올 수 없습니다.<br />
              <strong className="text-[var(--color-dark)]">둘 다 있어야 웹사이트가 정상적으로 작동합니다.</strong>
            </p>
          </div>
        </div>
      </Section>

      {/* ═══ 도메인이란? ═══ */}
      <Section className="bg-gray-50/50">
        <div className="max-w-[900px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <SectionLabel>Domain</SectionLabel>
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-dark)] mb-6">
                도메인이란?
              </h2>
              <p className="text-[var(--color-gray)] leading-relaxed mb-6">
                도메인은 웹사이트의 <strong className="text-[var(--color-dark)]">인터넷 주소</strong>입니다.<br /><br />
                예를 들어, <code className="bg-blue-50 text-[var(--color-primary)] px-2 py-0.5 rounded text-sm font-mono">hsweb.pics</code>가 도메인입니다.<br /><br />
                원래 웹사이트는 <code className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-sm font-mono">123.45.67.89</code> 같은 숫자(IP 주소)로 접속해야 하는데,
                이걸 사람이 기억하기 쉬운 이름으로 바꿔주는 것이 도메인��니다.
              </p>
              <div className="space-y-3">
                {[
                  { icon: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582", text: ".com, .co.kr, .kr 등 다양한 종류" },
                  { icon: "M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z", text: "보통 연간 1~3만원 수준의 유지 비용" },
                  { icon: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99", text: "매년 갱신(연장)해야 유지됨" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={item.icon} /></svg>
                    </div>
                    <span className="text-sm text-[var(--color-dark-2)]">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <DomainIllust />
          </div>
        </div>
      </Section>

      {/* ═══ 호스팅이란? ═══ */}
      <Section>
        <div className="max-w-[900px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <HostingIllust />
            </div>
            <div className="order-1 md:order-2">
              <SectionLabel>Hosting</SectionLabel>
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-dark)] mb-6">
                호스팅이란?
              </h2>
              <p className="text-[var(--color-gray)] leading-relaxed mb-6">
                호스팅은 웹사이트의 파일(HTML, 이미지, 코드 등)을<br />
                <strong className="text-[var(--color-dark)]">24시간 저장하고 전달해주는 서버 공간</strong>입니다.<br /><br />
                내 컴퓨터를 24시간 켜놓을 수 없으니,<br />
                전문 업체의 서버에 사이트를 올려두는 것입니다.<br /><br />
                누군가 내 사이트에 접속하면, 호스팅 서버가<br />
                사이트 파일을 방문자의 브라우저로 보내줍니다.
              </p>
              <div className="space-y-3">
                {[
                  { icon: "M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z", text: "사이트 파일을 저장하는 서버 공간" },
                  { icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z", text: "24시간 365일 서버가 가동되어야 접속 가능" },
                  { icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z", text: "서버 성능에 따라 사이트 속도가 결정됨" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-violet-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={item.icon} /></svg>
                    </div>
                    <span className="text-sm text-[var(--color-dark-2)]">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══ 전체 흐름 ═══ */}
      <Section className="bg-gray-50/50">
        <div className="max-w-[900px] mx-auto px-6">
          <div className="text-center mb-12">
            <SectionLabel>How It Works</SectionLabel>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-dark)] mb-4">
              사이트가 보이기까지의 과정
            </h2>
            <p className="text-[var(--color-gray)]">
              주소창에 도메인을 입력하면, 이런 일이 일어납니다.
            </p>
          </div>
          <div className="overflow-x-auto">
            <FlowIllust />
          </div>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[700px] mx-auto">
            {[
              { step: "1", title: "주소 입력", desc: "사용자가 브라우저에 도메인(hsweb.pics)을 입력합니다.", color: "blue" },
              { step: "2", title: "IP 변환", desc: "DNS 서버가 도메인을 서버의 실제 IP 주소로 변환합니다.", color: "violet" },
              { step: "3", title: "사이트 표시", desc: "호스팅 서버가 사이트 파일을 보내고, 화면에 표시됩니다.", color: "emerald" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className={`w-10 h-10 bg-${item.color}-100 text-${item.color}-600 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-sm`}>
                  {item.step}
                </div>
                <h4 className="font-semibold text-[var(--color-dark)] mb-1">{item.title}</h4>
                <p className="text-sm text-[var(--color-gray)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ 왜 둘 다 필요한가? ═══ */}
      <Section>
        <div className="max-w-[800px] mx-auto px-6">
          <div className="text-center mb-12">
            <SectionLabel>Why Both?</SectionLabel>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-dark)]">
              도메인과 호스팅,<br />둘 다 없으면 어떻게 될까요?
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                icon: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z",
                title: "도메인만 없는 경우",
                desc: "사이트는 서버에 있지만, 사람들이 접속할 방법이 없습니다. 숫자로 된 IP 주소를 외워서 직접 입력해야 하는데, 이건 사실상 불가능합니다.",
                color: "amber",
              },
              {
                icon: "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636",
                title: "호스팅만 없는 경우",
                desc: "도메인(주소)은 있지만, 접속하면 아무것도 표시되지 않습니다. 파일이 저장된 서버가 없으니, 빈 집에 초대한 것과 같습니다.",
                color: "red",
              },
              {
                icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                title: "둘 다 있는 경우",
                desc: "도메인을 입력하면 호스팅 서버에 저장된 사이트가 정상적으로 표시됩니다. 이것이 우리가 매일 사용하는 웹사이트의 작동 방식입니다.",
                color: "emerald",
              },
            ].map((item, i) => (
              <div key={i} className={`flex items-start gap-5 p-6 rounded-2xl border ${
                item.color === "emerald" ? "bg-emerald-50/50 border-emerald-200" : item.color === "red" ? "bg-red-50/50 border-red-200" : "bg-amber-50/50 border-amber-200"
              }`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  item.color === "emerald" ? "bg-emerald-100" : item.color === "red" ? "bg-red-100" : "bg-amber-100"
                }`}>
                  <svg className={`w-5 h-5 ${
                    item.color === "emerald" ? "text-emerald-600" : item.color === "red" ? "text-red-500" : "text-amber-600"
                  }`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--color-dark)] mb-1">{item.title}</h4>
                  <p className="text-sm text-[var(--color-gray)] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ 비용 안내 ═══ */}
      <Section className="bg-gray-50/50">
        <div className="max-w-[800px] mx-auto px-6">
          <div className="text-center mb-12">
            <SectionLabel>Cost</SectionLabel>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-dark)]">
              비용은 얼마나 들까요?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[var(--color-dark)] mb-2">도메인</h3>
              <p className="text-3xl font-black text-[var(--color-primary)] mb-1">연 1~3만원</p>
              <p className="text-sm text-[var(--color-gray)] mb-4">.com / .co.kr 기준</p>
              <ul className="space-y-2 text-sm text-[var(--color-gray)]">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[var(--color-primary)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  매년 갱신 필요
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[var(--color-primary)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  원하는 이름 선택 가능
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[var(--color-primary)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  갱신 안 하면 주소 사라짐
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[var(--color-dark)] mb-2">호스팅</h3>
              <p className="text-3xl font-black text-violet-600 mb-1">월 1~5만원</p>
              <p className="text-sm text-[var(--color-gray)] mb-4">사이트 규모에 따라 상이</p>
              <ul className="space-y-2 text-sm text-[var(--color-gray)]">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-violet-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  매월 또는 연간 결제
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-violet-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  트래픽/용량에 따라 요금 변동
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-violet-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  해지하면 사이트 접속 불가
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 bg-blue-50 rounded-2xl p-6 border border-blue-100 text-center">
            <p className="text-[var(--color-dark)] font-semibold mb-1">HS WEB에서는?</p>
            <p className="text-sm text-[var(--color-gray)]">
              도메인 등록과 호스팅 설정을 대행해드리며, 관련 비용은 <strong className="text-[var(--color-dark)]">실비</strong>로만 청구합니다.<br />
              별도의 대행 수수료 없이 투명하게 안내드립니다.
            </p>
          </div>
        </div>
      </Section>

      {/* ═══ FAQ ═══ */}
      <Section>
        <div className="max-w-[700px] mx-auto px-6">
          <div className="text-center mb-12">
            <SectionLabel>FAQ</SectionLabel>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-dark)]">자주 묻는 질문</h2>
          </div>
          <div className="space-y-4">
            {[
              { q: "도메인과 호스팅 없이 사이트를 운영할 수 있나요?", a: "인터넷에서 접속 가능한 사이트를 운영하려면 도메인과 호스팅은 필수입니다. 제작 비용과 별개로, 사이트가 살아있으려면 매년/매월 유지해야 합니다." },
              { q: "도메인을 갱신하지 않으면 어떻게 되나요?", a: "만료되면 해당 주소로 접속할 수 없게 됩니다. 일정 기간이 지나면 다른 사람이 그 도메인을 등록할 수도 있으므로, 중요한 도메인은 반드시 갱신하세요." },
              { q: "호스팅을 해지하면 사이트가 삭제되나요?", a: "네, 호스팅 서버에 저장된 파일이 삭제되므로 사이트에 접속할 수 없게 됩니다. 다만 HS WEB에서 제작한 사이트는 소스 코드를 별도로 보관하��� 있어 재배포가 가능합니다." },
              { q: "도메인과 호스팅을 직접 관리해야 하나요?", a: "아닙니다. HS WEB에서 등록, 설정, 갱신까지 모든 과정을 대행해드립니다. 고객님은 사이트 운영에만 집중하시면 됩니다." },
              { q: "이미 가지고 있는 도메인을 사용할 수 있나요?", a: "물론입니다. 기존에 보유하신 도메인을 그대로 연결해드립니다. DNS 설정만 변경하면 되므로 추가 비용은 발생하지 않습니다." },
            ].map((faq, i) => (
              <details key={i} className="group bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none">
                  <span className="font-semibold text-[var(--color-dark)] text-sm pr-4">{faq.q}</span>
                  <svg className="w-5 h-5 text-[var(--color-gray)] shrink-0 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </summary>
                <div className="px-6 pb-5 text-sm text-[var(--color-gray)] leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ CTA ═══ */}
      <Section className="bg-[var(--color-dark)] text-white text-center">
        <div className="max-w-[600px] mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            도메인, 호스팅 걱정 없이<br />사이트를 만들어보세요
          </h2>
          <p className="text-white/60 mb-8">
            HS WEB이 등록부터 관리까지 모두 대행해드립니다.
          </p>
          <a href="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-[var(--color-dark)] bg-white hover:bg-gray-100 transition-colors no-underline">
            무료 상담 받기
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
          </a>
        </div>
      </Section>
    </div>
  );
}
