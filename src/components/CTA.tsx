export default function CTA() {
  return (
    <section className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-center py-[100px] relative overflow-hidden">
      <div className="absolute -top-1/2 -right-[20%] w-[600px] h-[600px] bg-white/5 rounded-full" />
      <div className="max-w-[1200px] mx-auto px-6 relative">
        <h2 className="text-[2.5rem] font-extrabold text-white mb-4">
          프로젝트를 시작할 준비가 되셨나요?
        </h2>
        <p className="text-white/85 text-lg mb-9">
          지금 무료 상담을 신청하시면 맞춤 견적과 전략을 제안해드립니다.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a
            href="#contact"
            className="bg-white text-[var(--color-primary)] px-9 py-4 rounded-xl font-bold text-[1.05rem] shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:-translate-y-[3px] hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all no-underline"
          >
            무료 상담 신청 →
          </a>
          <a
            href="tel:010-0000-0000"
            className="bg-transparent text-white border-[1.5px] border-white/40 px-9 py-4 rounded-xl font-semibold hover:bg-white/10 hover:border-white hover:-translate-y-[3px] transition-all no-underline"
          >
            전화 상담
          </a>
        </div>
      </div>
    </section>
  );
}
