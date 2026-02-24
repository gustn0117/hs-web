"use client";

import { useEffect, useRef, useState } from "react";

const faqs = [
  {
    q: "홈페이지 제작 비용은 얼마인가요?",
    a: "프로젝트 규모와 요구사항에 따라 80만원~별도 견적까지 다양합니다. 기본 홈페이지는 80만원부터, 맞춤형 디자인은 200만원부터 시작됩니다. 정확한 견적은 무료 상담을 통해 안내드립니다.",
  },
  {
    q: "제작 기간은 얼마나 걸리나요?",
    a: "기본 홈페이지는 2~3주, 전문 홈페이지는 4~6주 정도 소요됩니다. 쇼핑몰이나 웹 애플리케이션 등 복잡한 프로젝트는 별도 협의를 통해 일정을 조율합니다.",
  },
  {
    q: "반응형 웹디자인이 포함되나요?",
    a: "네, 모든 플랜에 반응형 디자인이 기본 포함됩니다. PC, 태블릿, 모바일 등 모든 디바이스에서 최적화된 화면을 제공합니다.",
  },
  {
    q: "제작 후 수정이 가능한가요?",
    a: "물론입니다. 플랜에 따라 1~6개월의 무상 유지보수 기간이 제공되며, 이 기간 동안 콘텐츠 수정, 디자인 미세 조정 등이 가능합니다. 유지보수 기간 이후에도 합리적인 비용으로 지원해드립니다.",
  },
  {
    q: "도메인과 호스팅도 해주시나요?",
    a: "도메인 등록과 호스팅 설정을 안내해드리며, 필요시 대행도 가능합니다. 이미 보유하신 도메인이 있다면 그대로 연결해드립니다.",
  },
  {
    q: "SEO(검색엔진 최적화)도 해주시나요?",
    a: "네, 모든 플랜에 기본 SEO 설정이 포함됩니다. Professional 이상 플랜에서는 고급 SEO 최적화(사이트맵, 메타태그, 구조화 데이터 등)를 제공하여 검색 노출을 극대화합니다.",
  },
];

export default function FAQ() {
  const ref = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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
    <section className="pt-32 pb-24 bg-[var(--color-light)]" ref={ref}>
      <div className="max-w-[800px] mx-auto px-6">
        <div className="text-center mb-14 fade-up">
          <p className="text-[var(--color-primary)] font-semibold text-sm uppercase tracking-[2px] mb-3">
            FAQ
          </p>
          <div className="section-divider" />
          <h2 className="text-[2.2rem] font-extrabold text-[var(--color-dark)] mb-4 tracking-tight">
            자주 묻는 질문
          </h2>
          <p className="text-[var(--color-gray)] text-lg max-w-[550px] mx-auto">
            고객님들이 자주 물어보시는 질문들을 모았습니다.
          </p>
        </div>

        <div className="space-y-3 fade-up" style={{ transitionDelay: "100ms" }}>
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`bg-white rounded-xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "border-l-[3px] border-l-[var(--color-primary)] border-gray-100 shadow-md"
                    : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 bg-transparent border-none cursor-pointer"
                >
                  <span className={`font-semibold text-[0.95rem] transition-colors ${isOpen ? "text-[var(--color-primary)]" : "text-[var(--color-dark)]"}`}>
                    {faq.q}
                  </span>
                  <svg
                    className={`w-5 h-5 shrink-0 text-[var(--color-gray)] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    maxHeight: isOpen ? "200px" : "0px",
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <p className="px-6 pb-5 text-[var(--color-gray)] text-[0.9rem] leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
