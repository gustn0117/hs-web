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
    <section id="testimonials" className="py-[100px] bg-[var(--color-dark)]" ref={ref}>
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-[60px] fade-up">
          <div className="inline-flex items-center gap-2 text-[var(--color-accent)] font-semibold text-[0.9rem] uppercase tracking-[2px] mb-4">
            <span className="w-[30px] h-[2px] bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]" />
            TESTIMONIALS
          </div>
          <h2 className="text-[2.5rem] font-extrabold text-white mb-4 tracking-tight">
            고객 후기
          </h2>
          <p className="text-[var(--color-gray-light)] text-lg max-w-[600px] mx-auto">
            HS WEB과 함께한 고객님들의 이야기를 들어보세요.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="fade-up bg-[var(--color-dark-2)] p-9 rounded-[20px] border border-white/[0.06] transition-all hover:border-[rgba(37,99,235,0.3)] hover:-translate-y-1"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="text-amber-400 text-[0.9rem] tracking-[3px] mb-[18px]">
                ★★★★★
              </div>
              <p className="text-white/80 text-[0.95rem] leading-relaxed mb-6">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-[14px]">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white font-bold text-base">
                  {t.initial}
                </div>
                <div>
                  <div className="text-white font-semibold text-[0.95rem]">
                    {t.name}
                  </div>
                  <div className="text-[var(--color-gray-light)] text-[0.8rem]">
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
