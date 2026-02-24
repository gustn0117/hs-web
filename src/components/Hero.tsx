export default function Hero() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-[var(--color-dark)] to-[var(--color-dark-2)] flex items-center relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute -top-1/2 -right-[20%] w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(37,99,235,0.15)_0%,transparent_70%)] rounded-full animate-float" />
      <div className="absolute -bottom-[30%] -left-[10%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(6,182,212,0.1)_0%,transparent_70%)] rounded-full animate-float-reverse" />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-[rgba(37,99,235,0.2)] border border-[rgba(37,99,235,0.3)] px-[18px] py-2 rounded-full text-[var(--color-accent)] text-[0.85rem] font-medium mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 bg-[var(--color-accent)] rounded-full animate-pulse-dot" />
              웹 제작 전문 에이전시
            </div>

            <h1 className="text-4xl md:text-[3.5rem] font-black text-white leading-[1.2] mb-5 tracking-tight">
              당신의 비즈니스를
              <br />
              <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] bg-clip-text text-transparent">
                빛나게 할 웹사이트
              </span>
            </h1>

            <p className="text-lg text-[var(--color-gray-light)] mb-9 max-w-[500px] leading-relaxed mx-auto lg:mx-0">
              HS WEB은 감각적인 디자인과 최신 기술력으로 고객 맞춤형 홈페이지를
              제작합니다. 반응형 웹, 쇼핑몰, 랜딩페이지까지 모든 웹 솔루션을
              제공합니다.
            </p>

            <div className="flex gap-4 flex-wrap justify-center lg:justify-start">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-8 py-[14px] rounded-xl font-semibold text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] shadow-[0_4px_20px_rgba(37,99,235,0.4)] hover:-translate-y-[3px] hover:shadow-[0_8px_30px_rgba(37,99,235,0.5)] transition-all no-underline"
              >
                무료 상담 받기 →
              </a>
              <a
                href="#portfolio"
                className="inline-flex items-center gap-2 px-8 py-[14px] rounded-xl font-semibold text-white border-[1.5px] border-white/25 hover:bg-white/10 hover:border-white/50 hover:-translate-y-[3px] transition-all no-underline"
              >
                포트폴리오 보기
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-5 mt-[50px]">
              {[
                { num: "150+", label: "제작 프로젝트" },
                { num: "98%", label: "고객 만족도" },
                { num: "5년+", label: "업계 경력" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="text-center p-5 bg-white/[0.04] rounded-xl border border-white/[0.06]"
                >
                  <div className="font-extrabold text-2xl md:text-[2rem] bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] bg-clip-text text-transparent">
                    {s.num}
                  </div>
                  <div className="text-[var(--color-gray-light)] text-[0.85rem] mt-1">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mockup */}
          <div className="flex justify-center items-center">
            <div className="w-full max-w-[520px] bg-[var(--color-dark-2)] rounded-2xl overflow-hidden shadow-2xl border border-white/[0.08] lg:[transform:perspective(1000px)_rotateY(-5deg)_rotateX(3deg)] hover:[transform:perspective(1000px)_rotateY(0deg)_rotateX(0deg)] transition-transform duration-500">
              <div className="flex items-center gap-2 px-[18px] py-[14px] bg-black/30">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <div className="flex-1 ml-3 bg-white/[0.08] px-[14px] py-[6px] rounded-md text-[var(--color-gray-light)] text-[0.8rem] font-mono">
                  hsweb.co.kr
                </div>
              </div>
              <div className="p-[30px] min-h-[300px]">
                <div className="h-4 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] opacity-60 rounded mb-[14px] w-[60%]" />
                <div className="h-[10px] bg-white/[0.06] rounded mb-[14px] w-[85%]" />
                <div className="h-[10px] bg-white/[0.06] rounded mb-[14px] w-[70%]" />
                <div className="h-[10px] bg-white/[0.06] rounded mb-[14px] w-[90%]" />
                <div className="h-9 bg-[rgba(6,182,212,0.3)] rounded-lg mb-[14px] w-[45%]" />
                <div className="h-[120px] bg-gradient-to-br from-[rgba(37,99,235,0.15)] to-[rgba(6,182,212,0.15)] rounded-xl mt-[10px]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
