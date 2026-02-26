"use client";

import { useEffect, useRef } from "react";

const testimonials = [
  {
    text: "처음부터 끝까지 꼼꼼한 소통과 퀄리티 높은 결과물에 매우 만족합니다. 사이트 오픈 후 문의가 크게 늘었어요.",
    name: "김도현 대표",
    role: "카페 브랜드",
    initial: "김",
  },
  {
    text: "쇼핑몰 구축을 맡겼는데, 기대 이상의 결과물이었습니다. 특히 모바일 최적화가 잘 되어있어 매출 상승에 큰 도움이 됐습니다.",
    name: "박서연 이사",
    role: "패션 브랜드",
    initial: "박",
  },
  {
    text: "납기일을 정확히 지켜주시고, 수정 요청도 신속하게 반영해주셔서 정말 감사했습니다. 다음 프로젝트도 함께하고 싶습니다.",
    name: "이준혁 팀장",
    role: "IT 스타트업",
    initial: "이",
  },
  {
    text: "기존 홈페이지를 리뉴얼했는데, 방문자 체류 시간이 크게 늘었습니다. 세련된 디자인과 빠른 로딩 속도에 매우 만족합니다.",
    name: "최민서 대표",
    role: "교육 스타트업",
    initial: "최",
  },
  {
    text: "랜딩페이지 제작 후 광고 전환율이 눈에 띄게 올랐습니다. 디자인 감각이 뛰어나고, A/B 테스트까지 꼼꼼히 진행해주셨어요.",
    name: "정하은 마케터",
    role: "뷰티 브랜드",
    initial: "정",
  },
  {
    text: "ERP 시스템 구축을 의뢰했는데, 복잡한 요구사항을 깔끔하게 정리해주셨습니다. 업무 효율이 크게 올라 직원들도 만족합니다.",
    name: "한지우 부장",
    role: "제조업",
    initial: "한",
  },
];

export default function Testimonials() {
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
    <section className="py-24 bg-[var(--color-light)]" ref={ref}>
      <div className="max-w-[1000px] mx-auto px-6">
        <div className="text-center mb-12 fade-up">
          <p className="text-[var(--color-primary)] font-semibold text-sm uppercase tracking-[2px] mb-3">
            TESTIMONIALS
          </p>
          <div className="section-divider" />
          <h2 className="text-[2.2rem] font-extrabold text-[var(--color-dark)] tracking-tight">
            고객 후기
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="fade-up bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg hover:shadow-gray-200/40 transition-all duration-300"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <p className="text-[var(--color-dark-2)] text-[0.88rem] leading-relaxed mb-5">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                <div className="w-9 h-9 rounded-full bg-[var(--color-dark)] flex items-center justify-center text-white font-bold text-sm">
                  {t.initial}
                </div>
                <div>
                  <div className="font-semibold text-[0.88rem] text-[var(--color-dark)]">{t.name}</div>
                  <div className="text-[var(--color-gray)] text-[0.75rem]">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
