"use client";

import { useEffect, useRef } from "react";

const projects = [
  {
    emoji: "☕",
    gradient: "from-[#667eea] to-[#764ba2]",
    category: "브랜드 홈페이지",
    title: "프리미엄 카페 브랜딩",
    desc: "온라인 예약 시스템과 메뉴 관리 기능을 갖춘 카페 브랜드 사이트",
  },
  {
    emoji: "👗",
    gradient: "from-[#f093fb] to-[#f5576c]",
    category: "쇼핑몰",
    title: "패션 온라인 스토어",
    desc: "결제 연동, 재고 관리, 회원 시스템을 갖춘 패션 이커머스 플랫폼",
  },
  {
    emoji: "🏥",
    gradient: "from-[#4facfe] to-[#00f2fe]",
    category: "기업 홈페이지",
    title: "메디컬 클리닉",
    desc: "온라인 예약과 진료 안내를 위한 의료기관 전용 웹사이트",
  },
  {
    emoji: "🏠",
    gradient: "from-[#a18cd1] to-[#fbc2eb]",
    category: "랜딩페이지",
    title: "부동산 분양 랜딩",
    desc: "아파트 분양 마케팅을 위한 고전환율 랜딩페이지",
  },
  {
    emoji: "📊",
    gradient: "from-[#43e97b] to-[#38f9d7]",
    category: "웹 애플리케이션",
    title: "SaaS 대시보드",
    desc: "실시간 데이터 시각화와 관리 기능을 갖춘 B2B SaaS 플랫폼",
  },
  {
    emoji: "🍕",
    gradient: "from-[#fa709a] to-[#fee140]",
    category: "쇼핑몰",
    title: "F&B 온라인 주문",
    desc: "실시간 주문 관리와 배달 추적이 가능한 음식 배달 플랫폼",
  },
];

export default function Portfolio() {
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
    <section id="portfolio" className="py-[100px]" ref={ref}>
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-[60px] fade-up">
          <div className="inline-flex items-center gap-2 text-[var(--color-primary)] font-semibold text-[0.9rem] uppercase tracking-[2px] mb-4">
            <span className="w-[30px] h-[2px] bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]" />
            PORTFOLIO
          </div>
          <h2 className="text-[2.5rem] font-extrabold text-[var(--color-dark)] mb-4 tracking-tight">
            최근 작업물
          </h2>
          <p className="text-[var(--color-gray)] text-lg max-w-[600px] mx-auto">
            다양한 산업군의 클라이언트와 함께한 프로젝트들을 소개합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {projects.map((p, i) => (
            <div
              key={i}
              className="fade-up rounded-[20px] overflow-hidden bg-white shadow-sm border border-black/[0.04] transition-all duration-400 hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(0,0,0,0.15)] group"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="h-[220px] relative overflow-hidden">
                <div
                  className={`w-full h-full bg-gradient-to-br ${p.gradient} flex items-center justify-center text-5xl transition-transform duration-500 group-hover:scale-105`}
                >
                  {p.emoji}
                </div>
                <div className="absolute inset-0 bg-[var(--color-dark)]/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white border-[1.5px] border-white rounded-full px-6 py-2.5 font-medium text-[0.9rem] hover:bg-white hover:text-[var(--color-dark)] transition-all cursor-pointer">
                    자세히 보기
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="text-[0.8rem] text-[var(--color-primary)] font-semibold uppercase tracking-[1px]">
                  {p.category}
                </div>
                <h3 className="text-[1.15rem] font-bold mt-2">{p.title}</h3>
                <p className="text-[var(--color-gray)] text-[0.9rem] mt-2">
                  {p.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
