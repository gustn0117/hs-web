"use client";

import { useEffect, useRef } from "react";

const testimonials = [
  {
    text: "처음부터 끝까지 꼼꼼한 소통과 퀄리티 높은 결과물에 매우 만족합니다. 사이트 오픈 후 문의가 3배 이상 늘었어요.",
    name: "김도현 대표",
    role: "카페 브랜드 대표",
    initial: "김",
    gradient: "from-emerald-400 to-emerald-600",
  },
  {
    text: "쇼핑몰 구축을 맡겼는데, 기대 이상의 결과물이었습니다. 특히 모바일 최적화가 잘 되어있어 매출 상승에 큰 도움이 됐습니다.",
    name: "박서연 이사",
    role: "패션 브랜드 이사",
    initial: "박",
    gradient: "from-indigo-400 to-indigo-600",
  },
  {
    text: "납기일을 정확히 지켜주시고, 수정 요청도 신속하게 반영해주셔서 정말 감사했습니다. 다음 프로젝트도 함께하고 싶습니다.",
    name: "이준혁 팀장",
    role: "IT 스타트업 팀장",
    initial: "이",
    gradient: "from-amber-400 to-amber-600",
  },
  {
    text: "기존 홈페이지를 리뉴얼했는데, 방문자 체류 시간이 2배 이상 늘었습니다. 세련된 디자인과 빠른 로딩 속도에 매우 만족합니다.",
    name: "최민서 대표",
    role: "교육 스타트업 대표",
    initial: "최",
    gradient: "from-rose-400 to-rose-600",
  },
  {
    text: "랜딩페이지 제작 후 광고 전환율이 40% 이상 올랐습니다. 디자인 감각이 정말 뛰어나고, A/B 테스트까지 꼼꼼히 진행해주셨어요.",
    name: "정하은 마케터",
    role: "뷰티 브랜드 마케터",
    initial: "정",
    gradient: "from-violet-400 to-violet-600",
  },
];

const StarIcon = () => (
  <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

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
    ref.current?.querySelectorAll(".fade-up, .fade-scale").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="pt-32 pb-24 bg-[var(--color-light)] relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 dot-pattern pointer-events-none" />
      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="text-center mb-14 fade-up">
          <p className="text-[var(--color-primary)] font-semibold text-sm uppercase tracking-[2px] mb-3">
            TESTIMONIALS
          </p>
          <div className="section-divider" />
          <h2 className="text-[2.2rem] font-extrabold text-[var(--color-dark)] mb-4 tracking-tight">
            고객 후기
          </h2>
          <p className="text-[var(--color-gray)] text-lg max-w-[550px] mx-auto">
            HS WEB과 함께한 고객님들의 이야기를 들어보세요.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((t, i) => (
            <div
              key={i}
              className="fade-scale bg-white p-8 rounded-2xl border border-gray-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl relative group"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {/* Quote icon */}
              <svg className="w-10 h-10 text-emerald-100 mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11h4v10H0z" />
              </svg>
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, j) => <StarIcon key={j} />)}
              </div>
              <p className="text-[var(--color-dark-2)] text-[0.95rem] leading-relaxed mb-6">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-bold text-sm ring-2 ring-white shadow-md`}>
                  {t.initial}
                </div>
                <div>
                  <div className="font-semibold text-[0.95rem]">{t.name}</div>
                  <div className="text-[var(--color-gray)] text-[0.8rem]">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Second row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 max-w-[800px] mx-auto">
          {testimonials.slice(3).map((t, i) => (
            <div
              key={i + 3}
              className="fade-scale bg-white p-8 rounded-2xl border border-gray-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl relative group"
              style={{ transitionDelay: `${(i + 3) * 80}ms` }}
            >
              <svg className="w-10 h-10 text-emerald-100 mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11h4v10H0z" />
              </svg>
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, j) => <StarIcon key={j} />)}
              </div>
              <p className="text-[var(--color-dark-2)] text-[0.95rem] leading-relaxed mb-6">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-bold text-sm ring-2 ring-white shadow-md`}>
                  {t.initial}
                </div>
                <div>
                  <div className="font-semibold text-[0.95rem]">{t.name}</div>
                  <div className="text-[var(--color-gray)] text-[0.8rem]">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
