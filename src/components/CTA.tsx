export default function CTA() {
  return (
    <section className="bg-emerald-50 text-center py-24">
      <div className="max-w-[1200px] mx-auto px-6">
        <h2 className="text-[2.2rem] font-extrabold text-[var(--color-dark)] mb-4">
          프로젝트를 시작할 준비가 되셨나요?
        </h2>
        <p className="text-[var(--color-gray)] text-lg mb-9">
          지금 무료 상담을 신청하시면 맞춤 견적과 전략을 제안해드립니다.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a
            href="#contact"
            className="bg-[var(--color-primary)] text-white px-9 py-4 rounded-lg font-bold text-[1.05rem] hover:bg-[var(--color-primary-dark)] transition-all no-underline"
          >
            무료 상담 신청 →
          </a>
          <a
            href="tel:010-0000-0000"
            className="bg-white text-[var(--color-dark)] border border-gray-200 px-9 py-4 rounded-lg font-semibold hover:border-gray-400 transition-all no-underline"
          >
            전화 상담
          </a>
        </div>
      </div>
    </section>
  );
}
