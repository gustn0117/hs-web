"use client";

import { useEffect, useRef, useState } from "react";

const faqs = [
  {
    q: "홈페이지 제작 비용은 얼마인가요?",
    a: "프로젝트 규모와 요구사항에 따라 달라집니다. 무료 상담을 통해 합리적인 견적을 안내드립니다.",
  },
  {
    q: "제작 기간은 얼마나 걸리나요?",
    a: "프로젝트 규모에 따라 다르지만, 빠르고 효율적으로 제작을 진행합니다. 상담 시 예상 일정을 안내드립니다.",
  },
  {
    q: "반응형 웹디자인이 포함되나요?",
    a: "네, 모든 플랜에 반응형 디자인이 기본 포함됩니다. PC, 태블릿, 모바일 등 모든 디바이스에서 최적화된 화면을 제공합니다.",
  },
  {
    q: "제작 후 수정이 가능한가요?",
    a: "물론입니다. 도메인과 호스팅 비용을 제외한 모든 수정 작업을 무료로 지원합니다. 큰 규모의 리뉴얼이 아닌 이상 추가 비용 없이 수정해드립니다.",
  },
  {
    q: "도메인과 호스팅도 해주시나요?",
    a: "도메인 등록과 호스팅 설정을 안내해드리며, 필요시 대행도 가능합니다. 이미 보유하신 도메인이 있다면 그대로 연결해드립니다.",
  },
  {
    q: "SEO(검색엔진 최적화)도 해주시나요?",
    a: "네, 모든 플랜에 기본 SEO 설정이 포함됩니다. 고급 플랜에서는 사이트맵, 메타태그, 구조화 데이터 등 심화 SEO를 제공합니다.",
  },
  {
    q: "어떤 기술 스택을 사용하나요?",
    a: "프로젝트 특성에 따라 최적의 기술을 선택합니다. 주로 React, Next.js, Vue.js 등 모던 프레임워크를 사용하며, 백엔드는 Node.js, Python 등을 활용합니다.",
  },
  {
    q: "기존 홈페이지 리뉴얼도 가능한가요?",
    a: "네, 디자인 개선, 기능 추가, 성능 최적화 등 리뉴얼 프로젝트도 많이 진행하고 있습니다. 기존 콘텐츠와 SEO 성과를 유지하면서 업그레이드합니다.",
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
    <section className="py-24 bg-[var(--color-light)]" ref={ref}>
      <div className="max-w-[700px] mx-auto px-6">
        <div className="text-center mb-12 fade-up">
          <p className="text-[var(--color-primary)] font-semibold text-sm uppercase tracking-[2px] mb-3">
            FAQ
          </p>
          <div className="section-divider" />
          <h2 className="text-[2.2rem] font-extrabold text-[var(--color-dark)] tracking-tight">
            자주 묻는 질문
          </h2>
        </div>

        <div className="space-y-2 fade-up" style={{ transitionDelay: "100ms" }}>
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 bg-transparent border-none cursor-pointer"
                >
                  <span className={`font-semibold text-[0.93rem] transition-colors ${isOpen ? "text-[var(--color-dark)]" : "text-[var(--color-dark)]"}`}>
                    {faq.q}
                  </span>
                  <svg
                    className={`w-4.5 h-4.5 text-[var(--color-gray)] shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
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
                  style={{ maxHeight: isOpen ? "200px" : "0px" }}
                >
                  <p className="px-6 pb-5 text-[var(--color-gray)] text-[0.88rem] leading-relaxed">
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
