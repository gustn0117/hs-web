"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { getServiceBySlug, services } from "@/lib/services";

export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const service = getServiceBySlug(slug);
  const ref = useRef<HTMLDivElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
    ref.current
      ?.querySelectorAll(".fade-up")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [service]);

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-light)]">
        <h1 className="text-2xl font-bold text-[var(--color-dark)] mb-4">
          서비스를 찾을 수 없습니다
        </h1>
        <Link
          href="/services"
          className="text-[var(--color-primary)] font-semibold no-underline hover:underline"
        >
          서비스 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  // Find adjacent services for navigation
  const currentIdx = services.findIndex((s) => s.slug === slug);
  const prevService = currentIdx > 0 ? services[currentIdx - 1] : null;
  const nextService =
    currentIdx < services.length - 1 ? services[currentIdx + 1] : null;

  return (
    <div ref={ref}>
      {/* Hero */}
      <section
        className={`pt-32 pb-20 relative overflow-hidden ${service.color.bg}`}
      >
        <div className="absolute inset-0 dot-pattern pointer-events-none opacity-50" />
        <div
          className={`absolute top-20 right-[10%] w-80 h-80 bg-gradient-to-br ${service.color.from} ${service.color.to} rounded-full blur-[120px] opacity-10`}
        />
        <div
          className={`absolute bottom-0 left-[5%] w-60 h-60 bg-gradient-to-br ${service.color.from} ${service.color.to} rounded-full blur-[100px] opacity-10`}
        />

        <div className="max-w-[900px] mx-auto px-6 relative z-10">
          <div className="fade-up">
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-[var(--color-gray)] text-sm no-underline hover:text-[var(--color-primary)] transition-colors mb-6"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
              전체 서비스
            </Link>

            <div className="flex items-center gap-4 mb-6">
              <div
                className={`w-14 h-14 bg-gradient-to-br ${service.color.from} ${service.color.to} text-white rounded-2xl flex items-center justify-center shadow-lg ${service.color.shadow}`}
              >
                <svg
                  className="w-7 h-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={service.iconPath}
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--color-dark)] tracking-tight">
                  {service.title}
                </h1>
                <p className="text-[var(--color-gray)] text-lg mt-1">
                  {service.subtitle}
                </p>
              </div>
            </div>

            <p className="text-[var(--color-gray)] text-lg leading-relaxed max-w-[700px] mb-8">
              {service.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {service.tags.map((tag) => (
                <span
                  key={tag}
                  className={`px-3 py-1.5 ${service.color.bg} border border-gray-200/60 rounded-full text-sm font-medium text-[var(--color-dark-2)]`}
                >
                  {tag}
                </span>
              ))}
              <span
                className={`px-3 py-1.5 bg-gradient-to-r ${service.color.from} ${service.color.to} text-white rounded-full text-sm font-semibold`}
              >
                {service.metric}
              </span>
            </div>

            <div className="flex gap-4 flex-wrap">
              <Link
                href="/contact"
                className={`inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r ${service.color.from} ${service.color.to} hover:shadow-xl ${service.color.shadow} transition-all duration-300 no-underline hover:scale-[1.02]`}
              >
                무료 상담 받기
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-[var(--color-dark)] border border-gray-200 hover:border-gray-300 transition-all duration-300 no-underline bg-white/80 backdrop-blur-sm"
              >
                관련 포트폴리오 보기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="max-w-[900px] mx-auto px-6">
          <div className="text-center mb-14 fade-up">
            <p
              className={`text-sm font-semibold uppercase tracking-[2px] mb-3`}
              style={{
                background: `linear-gradient(to right, var(--tw-gradient-stops))`,
              }}
            >
              <span
                className={`bg-gradient-to-r ${service.color.from} ${service.color.to} bg-clip-text text-transparent`}
              >
                FEATURES
              </span>
            </p>
            <h2 className="text-[2rem] font-extrabold text-[var(--color-dark)] tracking-tight">
              주요 기능
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {service.features.map((f, i) => (
              <div
                key={i}
                className="fade-up bg-[var(--color-light)] rounded-2xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-lg hover:shadow-gray-200/40 transition-all duration-300 hover:-translate-y-1 group"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div
                  className={`w-10 h-10 bg-gradient-to-br ${service.color.from} ${service.color.to} text-white rounded-xl flex items-center justify-center mb-4 shadow-md ${service.color.shadow} group-hover:scale-110 transition-transform duration-300`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={f.iconPath}
                    />
                  </svg>
                </div>
                <h3 className="font-bold text-[0.95rem] text-[var(--color-dark)] mb-2">
                  {f.title}
                </h3>
                <p className="text-[var(--color-gray)] text-[0.82rem] leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free maintenance highlight */}
      <section className="py-16 bg-gradient-to-r from-emerald-50 to-teal-50 border-y border-emerald-100">
        <div className="max-w-[900px] mx-auto px-6">
          <div className="fade-up flex flex-col md:flex-row items-center gap-8">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-400 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
              <svg
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-[var(--color-dark)] mb-2">
                유지보수 무료
              </h3>
              <p className="text-[var(--color-gray)] leading-relaxed">
                HS WEB에서 제작한 모든 프로젝트는{" "}
                <span className="text-emerald-600 font-semibold">
                  도메인과 호스팅 비용을 제외한 모든 수정 작업이 무료
                </span>
                입니다. 큰 규모의 리뉴얼이 아닌 이상, 텍스트 변경부터 레이아웃
                수정까지 추가 비용 없이 지속적으로 지원해드립니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-20 bg-white">
        <div className="max-w-[900px] mx-auto px-6">
          <div className="text-center mb-10 fade-up">
            <p className="text-sm font-semibold uppercase tracking-[2px] mb-3">
              <span
                className={`bg-gradient-to-r ${service.color.from} ${service.color.to} bg-clip-text text-transparent`}
              >
                TECH STACK
              </span>
            </p>
            <h2 className="text-[2rem] font-extrabold text-[var(--color-dark)] tracking-tight">
              사용 기술
            </h2>
          </div>

          <div className="fade-up flex flex-wrap justify-center gap-3">
            {service.technologies.map((tech) => (
              <span
                key={tech}
                className="px-5 py-2.5 bg-[var(--color-light)] border border-gray-200 rounded-xl text-[var(--color-dark)] text-sm font-medium hover:border-gray-300 hover:shadow-sm transition-all"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-[var(--color-light)]">
        <div className="max-w-[700px] mx-auto px-6">
          <div className="text-center mb-10 fade-up">
            <p className="text-sm font-semibold uppercase tracking-[2px] mb-3">
              <span
                className={`bg-gradient-to-r ${service.color.from} ${service.color.to} bg-clip-text text-transparent`}
              >
                FAQ
              </span>
            </p>
            <h2 className="text-[2rem] font-extrabold text-[var(--color-dark)] tracking-tight">
              자주 묻는 질문
            </h2>
          </div>

          <div className="space-y-3">
            {service.faqs.map((faq, i) => (
              <div
                key={i}
                className="fade-up bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer bg-transparent border-none"
                >
                  <span className="font-semibold text-[var(--color-dark)] text-[0.95rem] pr-4">
                    {faq.q}
                  </span>
                  <svg
                    className={`w-5 h-5 text-[var(--color-gray)] shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${openFaq === i ? "max-h-40 pb-5" : "max-h-0"}`}
                >
                  <p className="px-6 text-[var(--color-gray)] text-[0.88rem] leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation between services */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-[900px] mx-auto px-6">
          <div className="flex justify-between items-center">
            {prevService ? (
              <Link
                href={`/services/${prevService.slug}`}
                className="flex items-center gap-3 text-[var(--color-gray)] hover:text-[var(--color-primary)] transition-colors no-underline group"
              >
                <svg
                  className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
                <div>
                  <p className="text-xs text-[var(--color-gray)]">이전</p>
                  <p className="font-semibold text-sm">{prevService.title}</p>
                </div>
              </Link>
            ) : (
              <div />
            )}
            {nextService ? (
              <Link
                href={`/services/${nextService.slug}`}
                className="flex items-center gap-3 text-[var(--color-gray)] hover:text-[var(--color-primary)] transition-colors no-underline group text-right"
              >
                <div>
                  <p className="text-xs text-[var(--color-gray)]">다음</p>
                  <p className="font-semibold text-sm">{nextService.title}</p>
                </div>
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className={`py-20 bg-gradient-to-br ${service.color.from} ${service.color.to} relative overflow-hidden`}
      >
        <div className="absolute inset-0 dot-pattern pointer-events-none opacity-10" />
        <div className="max-w-[600px] mx-auto px-6 text-center relative z-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4 tracking-tight">
            {service.title}가 필요하신가요?
          </h2>
          <p className="text-white/80 text-lg mb-8 leading-relaxed">
            무료 상담을 통해 프로젝트에 맞는 최적의 솔루션을 제안해드립니다.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[var(--color-dark)] rounded-xl font-bold text-lg no-underline hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
          >
            무료 상담 신청하기
            <span>→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
