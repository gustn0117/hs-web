"use client";

import { useEffect, useRef, useState } from "react";

const testimonials = [
  {
    text: "처음부터 끝까지 꼼꼼한 소통과 퀄리티 높은 결과물에 매우 만족합니다. 사이트 오픈 후 문의가 3배 이상 늘었어요.",
    name: "김도현 대표",
    role: "카페 브랜드 대표",
    project: "카페 홈페이지",
    metric: "문의 3배 증가",
    initial: "김",
    gradient: "from-emerald-400 to-emerald-600",
  },
  {
    text: "쇼핑몰 구축을 맡겼는데, 기대 이상의 결과물이었습니다. 특히 모바일 최적화가 잘 되어있어 매출 상승에 큰 도움이 됐습니다.",
    name: "박서연 이사",
    role: "패션 브랜드 이사",
    project: "패션 쇼핑몰",
    metric: "모바일 매출 45%↑",
    initial: "박",
    gradient: "from-indigo-400 to-indigo-600",
  },
  {
    text: "납기일을 정확히 지켜주시고, 수정 요청도 신속하게 반영해주셔서 정말 감사했습니다. 다음 프로젝트도 함께하고 싶습니다.",
    name: "이준혁 팀장",
    role: "IT 스타트업 팀장",
    project: "SaaS 웹앱",
    metric: "납기 100% 준수",
    initial: "이",
    gradient: "from-amber-400 to-amber-600",
  },
  {
    text: "기존 홈페이지를 리뉴얼했는데, 방문자 체류 시간이 2배 이상 늘었습니다. 세련된 디자인과 빠른 로딩 속도에 매우 만족합니다.",
    name: "최민서 대표",
    role: "교육 스타트업 대표",
    project: "교육 플랫폼",
    metric: "체류시간 2배↑",
    initial: "최",
    gradient: "from-rose-400 to-rose-600",
  },
  {
    text: "랜딩페이지 제작 후 광고 전환율이 40% 이상 올랐습니다. 디자인 감각이 정말 뛰어나고, A/B 테스트까지 꼼꼼히 진행해주셨어요.",
    name: "정하은 마케터",
    role: "뷰티 브랜드 마케터",
    project: "뷰티 랜딩페이지",
    metric: "전환율 40%↑",
    initial: "정",
    gradient: "from-violet-400 to-violet-600",
  },
  {
    text: "ERP 시스템 구축을 의뢰했는데, 복잡한 요구사항을 깔끔하게 정리해주셨습니다. 업무 효율이 크게 올라 직원들도 만족합니다.",
    name: "한지우 부장",
    role: "제조업 기획부장",
    project: "ERP 시스템",
    metric: "업무효율 60%↑",
    initial: "한",
    gradient: "from-sky-400 to-sky-600",
  },
];

const StarIcon = () => (
  <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export default function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            if (entry.target === ref.current) setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    if (ref.current) {
      observer.observe(ref.current);
      ref.current.querySelectorAll(".fade-up, .fade-scale").forEach((el) => observer.observe(el));
    }
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
          <p className="text-[var(--color-gray)] text-lg max-w-[550px] mx-auto mb-5">
            HS WEB과 함께한 고객님들의 이야기를 들어보세요.
          </p>
          {/* Aggregate rating */}
          <div className="inline-flex items-center gap-3 bg-white border border-gray-100 rounded-full px-5 py-2.5 shadow-sm">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, j) => <StarIcon key={j} />)}
            </div>
            <span className="text-[var(--color-dark)] font-bold text-[0.9rem]">4.9 / 5.0</span>
            <span className="w-px h-4 bg-gray-200" />
            <span className="text-[var(--color-gray)] text-[0.82rem]">50+ 고객 리뷰</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="fade-scale bg-white p-7 rounded-2xl border border-gray-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-gray-200/50 relative group"
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              {/* Top accent */}
              <div className={`absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r ${t.gradient} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

              {/* Quote + Stars row */}
              <div className="flex items-center justify-between mb-4">
                <svg
                  className={`w-8 h-8 text-emerald-100 group-hover:text-emerald-200 transition-all duration-500 ${visible ? 'scale-100' : 'scale-50'}`}
                  style={{ transitionDelay: `${i * 100 + 300}ms` }}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11h4v10H0z" />
                </svg>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, j) => <StarIcon key={j} />)}
                </div>
              </div>

              <p className="text-[var(--color-dark-2)] text-[0.9rem] leading-relaxed mb-4">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Metric badge */}
              <div className="mb-5">
                <span className={`inline-flex items-center gap-1.5 text-[0.72rem] font-semibold px-2.5 py-1 rounded-full bg-gradient-to-r ${t.gradient} text-white`}>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22" />
                  </svg>
                  {t.metric}
                </span>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  {t.initial}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-[0.9rem]">{t.name}</div>
                  <div className="text-[var(--color-gray)] text-[0.78rem]">{t.role}</div>
                </div>
                <span className="text-[0.68rem] px-2 py-0.5 bg-gray-50 text-[var(--color-gray)] rounded-full border border-gray-100">
                  {t.project}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
