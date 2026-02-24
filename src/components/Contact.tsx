"use client";

import { useEffect, useRef, FormEvent } from "react";

const contactItems = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
    label: "이메일",
    value: "contact@hsweb.co.kr",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
    ),
    label: "전화",
    value: "010-0000-0000",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    label: "주소",
    value: "서울특별시 강남구",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: "운영 시간",
    value: "평일 09:00 - 18:00",
  },
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

  const inputClass =
    "w-full px-4 py-3.5 border border-gray-200 rounded-lg text-[0.95rem] transition-all focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-emerald-100";

  return (
    <section className="pt-32 pb-24" ref={ref}>
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-14 fade-up">
          <p className="text-[var(--color-primary)] font-semibold text-sm uppercase tracking-[2px] mb-3">
            CONTACT
          </p>
          <h2 className="text-[2.2rem] font-extrabold text-[var(--color-dark)] mb-4 tracking-tight">
            문의하기
          </h2>
          <p className="text-[var(--color-gray)] text-lg max-w-[550px] mx-auto">
            프로젝트에 대해 자유롭게 상담해주세요. 24시간 내 답변드립니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="fade-up">
            <h3 className="text-[1.6rem] font-extrabold mb-4">
              HS WEB에 문의하세요
            </h3>
            <p className="text-[var(--color-gray)] mb-9 leading-relaxed">
              홈페이지 제작, 리뉴얼, 유지보수 등 궁금하신 점이 있으시면 언제든
              연락 주세요. 친절하게 상담해드리겠습니다.
            </p>
            <div className="space-y-5">
              {contactItems.map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-50 text-[var(--color-primary)] rounded-lg flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-0.5">{item.label}</h4>
                    <p className="text-[var(--color-gray)] text-[0.9rem]">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form
            className="fade-up bg-[var(--color-light)] p-9 rounded-2xl border border-gray-100"
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block font-semibold text-sm mb-2">이름</label>
                <input type="text" placeholder="홍길동" required className={inputClass} />
              </div>
              <div>
                <label className="block font-semibold text-sm mb-2">연락처</label>
                <input type="tel" placeholder="010-0000-0000" required className={inputClass} />
              </div>
            </div>
            <div className="mb-4">
              <label className="block font-semibold text-sm mb-2">이메일</label>
              <input type="email" placeholder="example@email.com" className={inputClass} />
            </div>
            <div className="mb-4">
              <label className="block font-semibold text-sm mb-2">문의 유형</label>
              <select className={`${inputClass} bg-white`}>
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
              <label className="block font-semibold text-sm mb-2">문의 내용</label>
              <textarea
                placeholder="프로젝트에 대해 자유롭게 설명해주세요."
                className={`${inputClass} min-h-[120px] resize-y`}
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 bg-[var(--color-primary)] text-white border-none rounded-lg text-base font-bold cursor-pointer transition-all hover:bg-[var(--color-primary-dark)]"
            >
              상담 신청하기
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
