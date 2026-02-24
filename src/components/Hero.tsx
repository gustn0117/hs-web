export default function Hero() {
  return (
    <section className="min-h-screen bg-white flex items-center pt-[72px]">
      <div className="max-w-[1200px] mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full text-[var(--color-primary)] text-[0.85rem] font-semibold mb-6">
              <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full" />
              웹 제작 전문 에이전시
            </div>

            <h1 className="text-4xl md:text-[3.2rem] font-black text-[var(--color-dark)] leading-[1.2] mb-5 tracking-tight">
              당신의 비즈니스를
              <br />
              <span className="text-[var(--color-primary)]">빛나게 할 웹사이트</span>
            </h1>

            <p className="text-lg text-[var(--color-gray)] mb-9 max-w-[480px] leading-relaxed mx-auto lg:mx-0">
              HS WEB은 감각적인 디자인과 최신 기술력으로 고객 맞춤형 홈페이지를
              제작합니다. 반응형 웹, 쇼핑몰, 랜딩페이지까지 모든 웹 솔루션을
              제공합니다.
            </p>

            <div className="flex gap-4 flex-wrap justify-center lg:justify-start">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-8 py-[14px] rounded-lg font-semibold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] transition-all no-underline"
              >
                무료 상담 받기 →
              </a>
              <a
                href="#portfolio"
                className="inline-flex items-center gap-2 px-8 py-[14px] rounded-lg font-semibold text-[var(--color-dark)] border border-gray-200 hover:border-gray-400 transition-all no-underline"
              >
                포트폴리오 보기
              </a>
            </div>

            <div className="grid grid-cols-3 gap-5 mt-12">
              {[
                { num: "150+", label: "제작 프로젝트" },
                { num: "98%", label: "고객 만족도" },
                { num: "5년+", label: "업계 경력" },
              ].map((s) => (
                <div key={s.label} className="text-center lg:text-left">
                  <div className="font-extrabold text-2xl md:text-[2rem] text-[var(--color-primary)]">
                    {s.num}
                  </div>
                  <div className="text-[var(--color-gray)] text-[0.85rem] mt-1">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center items-center">
            <div className="w-full max-w-[500px] bg-[var(--color-light)] rounded-2xl overflow-hidden border border-gray-100">
              <div className="flex items-center gap-2 px-5 py-3 bg-gray-50 border-b border-gray-100">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <div className="flex-1 ml-3 bg-white px-3 py-1 rounded text-[var(--color-gray-light)] text-[0.8rem] font-mono border border-gray-100">
                  hsweb.pics
                </div>
              </div>
              <div className="p-8 space-y-4">
                <div className="h-4 bg-[var(--color-primary)] opacity-40 rounded w-[55%]" />
                <div className="h-3 bg-gray-200 rounded w-[80%]" />
                <div className="h-3 bg-gray-200 rounded w-[65%]" />
                <div className="h-3 bg-gray-200 rounded w-[90%]" />
                <div className="h-10 bg-[var(--color-primary)] opacity-20 rounded-lg w-[40%]" />
                <div className="h-[100px] bg-gradient-to-br from-emerald-50 to-indigo-50 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
