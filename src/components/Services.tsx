"use client";

import { useEffect, useRef } from "react";

const services = [
  {
    icon: "🎨",
    title: "반응형 홈페이지",
    desc: "PC, 태블릿, 모바일 모든 디바이스에서 완벽하게 보이는 반응형 홈페이지를 제작합니다.",
    tags: ["PC / 모바일 최적화", "SEO 적용", "빠른 로딩"],
  },
  {
    icon: "🛒",
    title: "쇼핑몰 구축",
    desc: "결제 시스템 연동부터 상품 관리까지, 매출을 극대화하는 온라인 쇼핑몰을 구축합니다.",
    tags: ["PG 결제 연동", "재고 관리", "회원 시스템"],
  },
  {
    icon: "🚀",
    title: "랜딩페이지",
    desc: "전환율을 극대화하는 마케팅 랜딩페이지로 광고 효과를 높여드립니다.",
    tags: ["전환율 최적화", "A/B 테스트", "애니메이션"],
  },
  {
    icon: "⚡",
    title: "웹 애플리케이션",
    desc: "React, Vue 등 최신 프레임워크를 활용한 고성능 웹 앱을 개발합니다.",
    tags: ["React / Vue", "Node.js", "API 개발"],
  },
  {
    icon: "📱",
    title: "UI/UX 디자인",
    desc: "사용자 경험을 최우선으로 고려한 직관적이고 세련된 디자인을 제공합니다.",
    tags: ["Figma", "프로토타입", "디자인 시스템"],
  },
  {
    icon: "🔧",
    title: "유지보수 & 관리",
    desc: "제작 후에도 안정적인 운영을 위한 정기 유지보수와 기술 지원을 제공합니다.",
    tags: ["보안 업데이트", "성능 모니터링", "콘텐츠 수정"],
  },
];

export default function Services() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="services" className="py-[100px] bg-[var(--color-light)]" ref={ref}>
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-[60px] fade-up">
          <div className="inline-flex items-center gap-2 text-[var(--color-primary)] font-semibold text-[0.9rem] uppercase tracking-[2px] mb-4">
            <span className="w-[30px] h-[2px] bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]" />
            SERVICES
          </div>
          <h2 className="text-[2.5rem] font-extrabold text-[var(--color-dark)] mb-4 tracking-tight">
            제공 서비스
          </h2>
          <p className="text-[var(--color-gray)] text-lg max-w-[600px] mx-auto leading-relaxed">
            비즈니스 목표에 맞는 최적의 웹 솔루션을 제안하고, 기획부터 런칭까지
            원스톱으로 진행합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {services.map((s, i) => (
            <div
              key={i}
              className="fade-up bg-white p-10 rounded-[20px] border border-black/[0.04] transition-all duration-400 hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(0,0,0,0.15)] relative overflow-hidden group before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-[var(--color-primary)] before:to-[var(--color-accent)] before:scale-x-0 before:transition-transform hover:before:scale-x-100"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-[rgba(37,99,235,0.1)] to-[rgba(6,182,212,0.1)] rounded-[14px] flex items-center justify-center text-2xl mb-[22px]">
                {s.icon}
              </div>
              <h3 className="text-[1.25rem] font-bold mb-3">{s.title}</h3>
              <p className="text-[var(--color-gray)] text-[0.95rem] leading-relaxed">
                {s.desc}
              </p>
              <div className="mt-[18px] flex flex-wrap gap-2">
                {s.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[0.78rem] px-3 py-1 bg-[var(--color-light)] text-[var(--color-gray)] rounded-full font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
