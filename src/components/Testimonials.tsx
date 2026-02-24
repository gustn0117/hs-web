"use client";

import { useEffect, useRef } from "react";

const testimonials = [
  {
    text: "처음부터 끝까지 꼼꼼한 소통과 퀄리티 높은 결과물에 매우 만족합니다. 사이트 오픈 후 문의가 3배 이상 늘었어요.",
    name: "김도현 대표",
    role: "카페 브랜드 대표",
    initial: "김",
  },
  {
    text: "쇼핑몰 구축을 맡겼는데, 기대 이상의 결과물이었습니다. 특히 모바일 최적화가 잘 되어있어 매출 상승에 큰 도움이 됐습니다.",
    name: "박서연 이사",
    role: "패션 브랜드 이사",
    initial: "박",
  },
  {
    text: "납기일을 정확히 지켜주시고, 수정 요청도 신속하게 반영해주셔서 정말 감사했습니다. 다음 프로젝트도 함께하고 싶습니다.",
    name: "이준혁 팀장",
    role: "IT 스타트업 팀장",
    initial: "이",
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
    <section className="pt-32 pb-24 bg-[var(--color-light)]" ref={ref}>
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-14 fade-up">
          <p className="text-[var(--color-primary)] font-semibold text-sm uppercase tracking-[2px] mb-3">
            TESTIMONIALS
          </p>
          <h2 className="text-[2.2rem] font-extrabold text-[var(--color-dark)] mb-4 tracking-tight">
            고객 후기
          </h2>
          <p className="text-[var(--color-gray)] text-lg max-w-[550px] mx-auto">
            HS WEB과 함께한 고객님들의 이야기를 들어보세요.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="fade-up bg-white p-8 rounded-2xl border border-gray-100 transition-all hover:-translate-y-1 hover:shadow-lg"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="text-amber-400 text-sm tracking-[3px] mb-4">
                ★★★★★
              </div>
              <p className="text-[var(--color-dark-2)] text-[0.95rem] leading-relaxed mb-6">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-bold text-sm">
                  {t.initial}
                </div>
                <div>
                  <div className="font-semibold text-[0.95rem]">
                    {t.name}
                  </div>
                  <div className="text-[var(--color-gray)] text-[0.8rem]">
                    {t.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
