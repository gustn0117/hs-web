import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "도메인 & 호스팅이란?",
  description: "도메인과 호스팅이 무엇인지, 웹사이트 유지에 왜 필요한지 쉽고 자세하게 설명합니다.",
  alternates: { canonical: "https://hsweb.pics/domain-hosting" },
};

/* ─── SVG 일러스트 (텍스트 제거 — HTML로 분리) ─── */

function BrowserSvg() {
  return (
    <svg viewBox="0 0 320 200" fill="none" className="w-full">
      <rect x="10" y="10" width="300" height="180" rx="14" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
      <rect x="10" y="10" width="300" height="36" rx="14" fill="#f1f5f9" />
      <rect x="10" y="32" width="300" height="14" fill="#f1f5f9" />
      <circle cx="30" cy="28" r="5" fill="#f87171" />
      <circle cx="46" cy="28" r="5" fill="#fbbf24" />
      <circle cx="62" cy="28" r="5" fill="#34d399" />
      <rect x="90" y="20" width="180" height="16" rx="5" fill="white" stroke="#cbd5e1" strokeWidth="1" />
      <rect x="100" y="24" width="6" height="8" rx="2" fill="none" stroke="#22c55e" strokeWidth="1.2" />
      <path d="M101.5 24v-1.5a1.5 1.5 0 013 0V24" fill="none" stroke="#22c55e" strokeWidth="1.2" />
      <rect x="30" y="60" width="260" height="10" rx="3" fill="#e2e8f0" />
      <rect x="30" y="78" width="180" height="8" rx="3" fill="#f1f5f9" />
      <rect x="30" y="96" width="120" height="36" rx="8" fill="#dbeafe" />
      <rect x="160" y="96" width="120" height="36" rx="8" fill="#eff6ff" />
      <rect x="30" y="144" width="200" height="6" rx="2" fill="#f1f5f9" />
      <rect x="30" y="158" width="140" height="6" rx="2" fill="#f8fafc" />
    </svg>
  );
}

function ServerSvg() {
  return (
    <svg viewBox="0 0 320 220" fill="none" className="w-full">
      <rect x="80" y="10" width="160" height="200" rx="12" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x="98" y={30 + i * 42} width="124" height="30" rx="6" fill="white" stroke="#e2e8f0" strokeWidth="1" />
          <circle cx="112" cy={45 + i * 42} r="4" fill="#22c55e" />
          <rect x="124" y={42 + i * 42} width={50 - i * 10} height="4" rx="2" fill="#cbd5e1" />
          <circle cx="208" cy={45 + i * 42} r="3" fill={i === 1 ? "#fbbf24" : "#3b82f6"} />
        </g>
      ))}
      {/* 파일 아이콘 */}
      <rect x="100" y="162" width="28" height="32" rx="4" fill="#dbeafe" />
      <rect x="136" y="162" width="28" height="32" rx="4" fill="#ede9fe" />
      <rect x="172" y="162" width="28" height="32" rx="4" fill="#fef3c7" />
      {/* 사용자들 */}
      <circle cx="30" cy="80" r="16" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1" />
      <circle cx="30" cy="74" r="5" fill="#93c5fd" />
      <path d="M20 88a10 10 0 0120 0" fill="#bfdbfe" />
      <circle cx="290" cy="60" r="16" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1" />
      <circle cx="290" cy="54" r="5" fill="#93c5fd" />
      <path d="M280 68a10 10 0 0120 0" fill="#bfdbfe" />
      <circle cx="290" cy="120" r="16" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1" />
      <circle cx="290" cy="114" r="5" fill="#93c5fd" />
      <path d="M280 128a10 10 0 0120 0" fill="#bfdbfe" />
      {/* 연결선 */}
      <path d="M46 80 L80 80" stroke="#93c5fd" strokeWidth="1.5" strokeDasharray="4 3" />
      <path d="M240 50 L274 60" stroke="#93c5fd" strokeWidth="1.5" strokeDasharray="4 3" />
      <path d="M240 110 L274 120" stroke="#93c5fd" strokeWidth="1.5" strokeDasharray="4 3" />
    </svg>
  );
}

/* ─── 컴포넌트 ─── */

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`py-16 md:py-24 ${className}`}>{children}</section>;
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-[var(--color-primary)] text-xs font-bold tracking-widest uppercase mb-3">
      {children}
    </span>
  );
}

function CheckItem({ children, color = "blue" }: { children: React.ReactNode; color?: string }) {
  const colors: Record<string, string> = {
    blue: "text-[var(--color-primary)]",
    violet: "text-violet-600",
  };
  return (
    <div className="flex items-start gap-3">
      <svg className={`w-5 h-5 ${colors[color]} shrink-0 mt-0.5`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
      <span className="text-[0.95rem] text-[var(--color-dark-2)] leading-relaxed">{children}</span>
    </div>
  );
}

export default function DomainHostingPage() {
  return (
    <div className="pt-[72px]">
      {/* ═══ Hero ═══ */}
      <Section className="bg-gradient-to-b from-blue-50/50 to-white text-center">
        <div className="max-w-[800px] mx-auto px-6">
          <Badge>Domain &amp; Hosting Guide</Badge>
          <h1 className="text-3xl md:text-5xl font-black text-[var(--color-dark)] leading-tight mb-6">
            도메인과 호스팅,<br />
            <span className="text-[var(--color-primary)]">왜 필요할까요?</span>
          </h1>
          <p className="text-lg text-[var(--color-gray)] leading-relaxed max-w-[560px] mx-auto">
            웹사이트를 만든 후에도 사이트가 인터넷에서 작동하려면{" "}
            <strong className="text-[var(--color-dark)]">도메인</strong>과{" "}
            <strong className="text-[var(--color-dark)]">호스팅</strong> 두 가지가 반드시 필요합니다.
          </p>
        </div>
      </Section>

      {/* ═══ 비유: 집 ═══ */}
      <Section>
        <div className="max-w-[900px] mx-auto px-6">
          <div className="text-center mb-14">
            <Badge>쉽게 이해하기</Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-dark)]">
              집에 비유하면 이렇습니다
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* 도메인 카드 */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-8 text-center">
              <div className="w-20 h-20 bg-white border border-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
                <svg className="w-10 h-10 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[var(--color-dark)] mb-2">도메인 = 주소</h3>
              <p className="text-[var(--color-gray)] leading-relaxed">
                내 집을 찾아오려면 <strong className="text-[var(--color-dark)]">주소</strong>가 있어야 합니다.<br />
                도메인이 없으면 사이트를 찾을 수 없습니다.
              </p>
            </div>

            {/* 호스팅 카드 */}
            <div className="bg-violet-50/50 border border-violet-100 rounded-2xl p-8 text-center">
              <div className="w-20 h-20 bg-white border border-violet-200 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
                <svg className="w-10 h-10 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[var(--color-dark)] mb-2">호스팅 = 건물</h3>
              <p className="text-[var(--color-gray)] leading-relaxed">
                주소가 있어도 <strong className="text-[var(--color-dark)]">건물</strong>이 없으면 살 수 없습니다.<br />
                호스팅이 없으면 사이트가 표시되지 않습니다.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100">
            <p className="text-[var(--color-dark)] font-semibold text-lg mb-1">
              주소(도메인) + 건물(호스팅) = 웹사이트 운영
            </p>
            <p className="text-[var(--color-gray)] text-sm">둘 다 있어야 사이트가 정상적으로 작동합니다.</p>
          </div>
        </div>
      </Section>

      {/* ═══ 도메인이란? ═══ */}
      <Section className="bg-gray-50/50">
        <div className="max-w-[900px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge>Domain</Badge>
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-dark)] mb-6">도메인이란?</h2>
              <p className="text-[var(--color-gray)] leading-relaxed mb-6">
                도메인은 웹사이트의 <strong className="text-[var(--color-dark)]">인터넷 주소</strong>입니다.
              </p>
              <p className="text-[var(--color-gray)] leading-relaxed mb-6">
                예를 들어, <code className="bg-blue-50 text-[var(--color-primary)] px-2 py-0.5 rounded text-sm font-mono font-bold">hsweb.pics</code>가 도메인입니다.
                원래 웹사이트는 <code className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-sm font-mono">123.45.67.89</code> 같은 숫자(IP 주소)로 접속해야 하는데,
                이걸 사람이 기억하기 쉬운 이름으로 바꿔주는 것이 도메인입니다.
              </p>
              <div className="space-y-3">
                <CheckItem>.com, .co.kr, .kr 등 다양한 종류가 있습니다</CheckItem>
                <CheckItem>보통 <strong>연간 3천원~3만원</strong> 수준의 유지 비용이 듭니다</CheckItem>
                <CheckItem>매년 갱신(연장)해야 유지됩니다</CheckItem>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <BrowserSvg />
              <div className="mt-4 text-center">
                <p className="text-sm font-semibold text-[var(--color-dark)]">브라우저 주소창에 입력하는 것</p>
                <p className="text-xs text-[var(--color-gray)] mt-1">hsweb.pics → 사이트 접속</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══ 호스팅이란? ═══ */}
      <Section>
        <div className="max-w-[900px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <ServerSvg />
                <div className="mt-4 text-center">
                  <p className="text-sm font-semibold text-[var(--color-dark)]">24시간 켜져있는 서버 컴퓨터</p>
                  <p className="text-xs text-[var(--color-gray)] mt-1">방문자에게 사이트 파일을 전달</p>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <Badge>Hosting</Badge>
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-dark)] mb-6">호스팅이란?</h2>
              <p className="text-[var(--color-gray)] leading-relaxed mb-6">
                호스팅은 웹사이트의 파일(HTML, 이미지, 코드 등)을{" "}
                <strong className="text-[var(--color-dark)]">24시간 저장하고 전달해주는 서버 공간</strong>입니다.
              </p>
              <p className="text-[var(--color-gray)] leading-relaxed mb-6">
                내 컴퓨터를 24시간 켜놓을 수 없으니,
                전문 업체의 서버에 사이트를 올려두는 것입니다.
                누군가 내 사이트에 접속하면, 호스팅 서버가 파일을 방문자에게 보내줍니다.
              </p>
              <div className="space-y-3">
                <CheckItem color="violet">사이트 파일을 저장하는 서버 공간</CheckItem>
                <CheckItem color="violet">24시간 365일 가동되어야 접속 가능</CheckItem>
                <CheckItem color="violet">서버 성능에 따라 사이트 속도가 결정됨</CheckItem>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══ 흐름 ═══ */}
      <Section className="bg-gray-50/50">
        <div className="max-w-[900px] mx-auto px-6">
          <div className="text-center mb-14">
            <Badge>How It Works</Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-dark)] mb-4">
              사이트가 보이기까지의 과정
            </h2>
            <p className="text-[var(--color-gray)]">주소창에 도메인을 입력하면, 이런 일이 일어납니다.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { step: "1", title: "주소 입력", desc: "브라우저에 hsweb.pics를 입력합니다.", color: "blue", icon: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3" },
              { step: "2", title: "DNS 변환", desc: "도메인이 서버의 실제 IP 주소로 변환됩니다.", color: "indigo", icon: "M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" },
              { step: "3", title: "서버 응답", desc: "호스팅 서버가 사이트 파일을 보내줍니다.", color: "violet", icon: "M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3" },
              { step: "4", title: "사이트 표시", desc: "브라우저에 사이트가 표시됩니다!", color: "emerald", icon: "M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25" },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm text-center relative">
                <div className={`w-12 h-12 bg-${item.color}-50 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <svg className={`w-6 h-6 text-${item.color}-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </div>
                <span className={`text-xs font-bold text-${item.color}-600 mb-1 block`}>STEP {item.step}</span>
                <h4 className="font-bold text-[var(--color-dark)] mb-2">{item.title}</h4>
                <p className="text-sm text-[var(--color-gray)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ 둘 다 필요한 이유 ═══ */}
      <Section>
        <div className="max-w-[800px] mx-auto px-6">
          <div className="text-center mb-14">
            <Badge>Why Both?</Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-dark)]">
              둘 중 하나만 있으면?
            </h2>
          </div>

          <div className="space-y-5">
            {[
              {
                icon: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z",
                title: "도메인만 없는 경우",
                desc: "사이트는 서버에 있지만, 사람들이 접속할 방법이 없습니다. 숫자로 된 IP 주소를 외워서 직접 입력해야 하는데, 이건 사실상 불가능합니다.",
                bg: "bg-amber-50/50", border: "border-amber-200", iconBg: "bg-amber-100", iconColor: "text-amber-600",
              },
              {
                icon: "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636",
                title: "호스팅만 없는 경우",
                desc: "도메인(주소)은 있지만, 접속하면 아무것도 표시되지 않습니다. 파일이 저장된 서버가 없으니, 빈 집에 초대한 것과 같습니다.",
                bg: "bg-red-50/50", border: "border-red-200", iconBg: "bg-red-100", iconColor: "text-red-500",
              },
              {
                icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                title: "둘 다 있는 경우",
                desc: "도메인을 입력하면 호스팅 서버에 저장된 사이트가 정상적으로 표시됩니다. 이것이 우리가 매일 사용하는 웹사이트의 작동 방식입니다.",
                bg: "bg-emerald-50/50", border: "border-emerald-200", iconBg: "bg-emerald-100", iconColor: "text-emerald-600",
              },
            ].map((item, i) => (
              <div key={i} className={`flex items-start gap-5 p-6 rounded-2xl border ${item.bg} ${item.border}`}>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}>
                  <svg className={`w-5 h-5 ${item.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-[var(--color-dark)] mb-1.5">{item.title}</h4>
                  <p className="text-sm text-[var(--color-gray)] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ 비용 ═══ */}
      <Section className="bg-gray-50/50">
        <div className="max-w-[800px] mx-auto px-6">
          <div className="text-center mb-14">
            <Badge>Cost</Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-dark)]">비용은 얼마나 들까요?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[var(--color-dark)] mb-1">도메인</h3>
              <p className="text-3xl font-black text-[var(--color-primary)] mb-1">연 3천~3만원</p>
              <p className="text-sm text-[var(--color-gray)] mb-5">.com / .co.kr 기준</p>
              <div className="space-y-2.5 text-sm text-[var(--color-gray)]">
                <CheckItem>매년 갱신 필요</CheckItem>
                <CheckItem>원하는 이름 선택 가능</CheckItem>
                <CheckItem>갱신 안 하면 주소 사라짐</CheckItem>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[var(--color-dark)] mb-1">호스팅</h3>
              <p className="text-3xl font-black text-violet-600 mb-1">월 7천~5만원</p>
              <p className="text-sm text-[var(--color-gray)] mb-5">사이트 규모에 따라 상이</p>
              <div className="space-y-2.5 text-sm text-[var(--color-gray)]">
                <CheckItem color="violet">매월 또는 연간 결제</CheckItem>
                <CheckItem color="violet">트래픽/용량에 따라 요금 변동</CheckItem>
                <CheckItem color="violet">해지하면 사이트 접속 불가</CheckItem>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-blue-50 rounded-2xl p-6 border border-blue-100 text-center">
            <p className="text-[var(--color-dark)] font-semibold mb-1">HS WEB에서는?</p>
            <p className="text-sm text-[var(--color-gray)]">
              도메인 등록과 호스팅 설정을 대행해드리며, 관련 비용은 <strong className="text-[var(--color-dark)]">실비</strong>로만 청구합니다.
              별도의 대행 수수료 없이 투명하게 안내드립니다.
            </p>
          </div>
        </div>
      </Section>

      {/* ═══ FAQ ═══ */}
      <Section>
        <div className="max-w-[700px] mx-auto px-6">
          <div className="text-center mb-14">
            <Badge>FAQ</Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-dark)]">자주 묻는 질문</h2>
          </div>
          <div className="space-y-3">
            {[
              { q: "도메인과 호스팅 없이 사이트를 운영할 수 있나요?", a: "인터넷에서 접속 가능한 사이트를 운영하려면 도메인과 호스팅은 필수입니다. 제작 비용과 별개로, 사이트가 살아있으려면 매년/매월 유지해야 합니다." },
              { q: "도메인을 갱신하지 않으면 어떻게 되나요?", a: "만료되면 해당 주소로 접속할 수 없게 됩니다. 일정 기간이 지나면 다른 사람이 그 도메인을 등록할 수도 있으므로, 중요한 도메인은 반드시 갱신하세요." },
              { q: "호스팅을 해지하면 사이트가 삭제되나요?", a: "네, 호스팅 서버에 저장된 파일이 삭제되므로 사이트에 접속할 수 없게 됩니다. 다만 HS WEB에서 제작한 사이트는 소스 코드를 별도로 보관하고 있어 재배포가 가능합니다." },
              { q: "도메인과 호스팅을 직접 관리해야 하나요?", a: "아닙니다. HS WEB에서 등록, 설정, 갱신까지 모든 과정을 대행해드립니다. 고객님은 사이트 운영에만 집중하시면 됩니다." },
              { q: "이미 가지고 있는 도메인을 사용할 수 있나요?", a: "물론입니다. 기존에 보유하신 도메인을 그대로 연결해드립니다. DNS 설정만 변경하면 되므로 추가 비용은 발생하지 않습니다." },
            ].map((faq, i) => (
              <details key={i} className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none select-none">
                  <span className="font-semibold text-[var(--color-dark)] text-[0.95rem] pr-4">{faq.q}</span>
                  <svg className="w-5 h-5 text-[var(--color-gray)] shrink-0 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </summary>
                <div className="px-6 pb-5 text-[0.95rem] text-[var(--color-gray)] leading-relaxed">{faq.a}</div>
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
          <p className="text-white/50 mb-8">HS WEB이 등록부터 관리까지 모두 대행해드립니다.</p>
          <a href="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-[var(--color-dark)] bg-white hover:bg-gray-100 transition-colors no-underline">
            무료 상담 받기
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
          </a>
        </div>
      </Section>
    </div>
  );
}
