"use client";

import { useEffect, useRef, FormEvent } from "react";

const contactItems = [
  { icon: "📧", label: "이메일", value: "contact@hsweb.co.kr" },
  { icon: "📱", label: "전화", value: "010-0000-0000" },
  { icon: "📍", label: "주소", value: "서울특별시 강남구" },
  { icon: "🕐", label: "운영 시간", value: "평일 09:00 - 18:00" },
];

export default function Contact() {
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    alert("상담 신청이 완료되었습니다!\n빠른 시일 내에 연락드리겠습니다.");
    (e.target as HTMLFormElement).reset();
  };

  return (
    <section id="contact" className="py-[100px] bg-[var(--color-light)]" ref={ref}>
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-[60px] fade-up">
          <div className="inline-flex items-center gap-2 text-[var(--color-primary)] font-semibold text-[0.9rem] uppercase tracking-[2px] mb-4">
            <span className="w-[30px] h-[2px] bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]" />
            CONTACT
          </div>
          <h2 className="text-[2.5rem] font-extrabold text-[var(--color-dark)] mb-4 tracking-tight">
            문의하기
          </h2>
          <p className="text-[var(--color-gray)] text-lg max-w-[600px] mx-auto">
            프로젝트에 대해 자유롭게 상담해주세요. 24시간 내 답변드립니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="fade-up">
            <h3 className="text-[1.8rem] font-extrabold mb-4">
              HS WEB에 문의하세요
            </h3>
            <p className="text-[var(--color-gray)] mb-9 leading-relaxed">
              홈페이지 제작, 리뉴얼, 유지보수 등 궁금하신 점이 있으시면 언제든
              연락 주세요. 친절하게 상담해드리겠습니다.
            </p>
            <div className="space-y-6">
              {contactItems.map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-xl shrink-0 shadow-sm">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{item.label}</h4>
                    <p className="text-[var(--color-gray)] text-[0.9rem]">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form
            className="fade-up bg-white p-10 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block font-semibold text-[0.9rem] mb-2">
                  이름
                </label>
                <input
                  type="text"
                  placeholder="홍길동"
                  required
                  className="w-full px-[18px] py-[14px] border-[1.5px] border-[#e2e8f0] rounded-xl text-[0.95rem] transition-all focus:outline-none focus:border-[var(--color-primary)] focus:shadow-[0_0_0_4px_rgba(37,99,235,0.1)]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[0.9rem] mb-2">
                  연락처
                </label>
                <input
                  type="tel"
                  placeholder="010-0000-0000"
                  required
                  className="w-full px-[18px] py-[14px] border-[1.5px] border-[#e2e8f0] rounded-xl text-[0.95rem] transition-all focus:outline-none focus:border-[var(--color-primary)] focus:shadow-[0_0_0_4px_rgba(37,99,235,0.1)]"
                />
              </div>
            </div>
            <div className="mb-5">
              <label className="block font-semibold text-[0.9rem] mb-2">
                이메일
              </label>
              <input
                type="email"
                placeholder="example@email.com"
                className="w-full px-[18px] py-[14px] border-[1.5px] border-[#e2e8f0] rounded-xl text-[0.95rem] transition-all focus:outline-none focus:border-[var(--color-primary)] focus:shadow-[0_0_0_4px_rgba(37,99,235,0.1)]"
              />
            </div>
            <div className="mb-5">
              <label className="block font-semibold text-[0.9rem] mb-2">
                문의 유형
              </label>
              <select className="w-full px-[18px] py-[14px] border-[1.5px] border-[#e2e8f0] rounded-xl text-[0.95rem] transition-all focus:outline-none focus:border-[var(--color-primary)] focus:shadow-[0_0_0_4px_rgba(37,99,235,0.1)] bg-white">
                <option value="">선택해주세요</option>
                <option>홈페이지 제작</option>
                <option>쇼핑몰 구축</option>
                <option>랜딩페이지</option>
                <option>웹 애플리케이션</option>
                <option>유지보수</option>
                <option>기타</option>
              </select>
            </div>
            <div className="mb-5">
              <label className="block font-semibold text-[0.9rem] mb-2">
                문의 내용
              </label>
              <textarea
                placeholder="프로젝트에 대해 자유롭게 설명해주세요."
                className="w-full px-[18px] py-[14px] border-[1.5px] border-[#e2e8f0] rounded-xl text-[0.95rem] transition-all focus:outline-none focus:border-[var(--color-primary)] focus:shadow-[0_0_0_4px_rgba(37,99,235,0.1)] min-h-[120px] resize-y"
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white border-none rounded-xl text-base font-bold cursor-pointer transition-all hover:shadow-[0_4px_20px_rgba(37,99,235,0.4)] hover:-translate-y-0.5"
            >
              상담 신청하기
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
