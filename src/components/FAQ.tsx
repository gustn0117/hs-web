"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

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
  {
    q: "어떤 기술 스택을 사용하나요?",
    a: "프로젝트 특성에 따라 최적의 기술을 선택합니다. 주로 React, Next.js, Vue.js 등 모던 프레임워크를 사용하며, 백엔드는 Node.js, Python 등을 활용합니다. 기술 선택의 이유와 장단점을 투명하게 설명드립니다.",
  },
  {
    q: "프로젝트 진행 상황은 어떻게 확인하나요?",
    a: "전용 프로젝트 관리 시스템을 통해 실시간으로 진행 상황을 확인하실 수 있습니다. 주 1~2회 정기 미팅을 진행하며, 각 단계별 산출물을 공유하고 피드백을 반영합니다. 카카오톡, 이메일 등 편하신 채널로 언제든 소통 가능합니다.",
  },
  {
    q: "보안은 어떻게 관리하나요?",
    a: "모든 프로젝트에 SSL 인증서를 기본 적용하며, 입력값 검증, SQL 인젝션 방지, XSS 방지 등 웹 보안 베스트 프랙티스를 준수합니다. 개인정보 처리가 필요한 경우 개인정보보호법에 맞는 처리 방침을 적용합니다.",
  },
  {
    q: "기존 홈페이지 리뉴얼도 가능한가요?",
    a: "네, 기존 사이트의 디자인 개선, 기능 추가, 성능 최적화 등 리뉴얼 프로젝트도 많이 진행하고 있습니다. 기존 콘텐츠와 데이터를 안전하게 마이그레이션하며, 기존 SEO 성과를 유지하면서 업그레이드합니다.",
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
                  <div className="flex items-center gap-3 flex-1">
                    <span className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className={`font-semibold text-[0.95rem] transition-colors ${isOpen ? "text-[var(--color-primary)]" : "text-[var(--color-dark)]"}`}>
                      {faq.q}
                    </span>
                  </div>
                  <div className={`faq-icon-morph ${isOpen ? 'open text-[var(--color-primary)]' : 'text-[var(--color-gray)]'}`} />
                </button>
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    maxHeight: isOpen ? "200px" : "0px",
                  }}
                >
                  <p className={`px-6 pb-5 pl-16 text-[var(--color-gray)] text-[0.9rem] leading-relaxed ${isOpen ? 'animate-[fade-slide-down_0.4s_ease_forwards]' : ''}`}>
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA box */}
        <div className="mt-10 fade-up" style={{ transitionDelay: "200ms" }}>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col sm:flex-row items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-blue-400 flex items-center justify-center text-white shadow-md shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="font-bold text-[var(--color-dark)] mb-1">궁금한 점이 더 있으신가요?</div>
              <div className="text-[var(--color-gray)] text-[0.88rem]">
                무료 상담을 통해 프로젝트에 대해 자세히 안내드립니다.
              </div>
            </div>
            <Link
              href="/contact"
              className="btn-ripple px-6 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-[var(--color-primary)] to-blue-400 no-underline text-[0.9rem] hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 shrink-0"
            >
              무료 상담 신청
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
