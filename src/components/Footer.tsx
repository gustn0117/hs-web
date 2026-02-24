const footerSections = [
  {
    title: "서비스",
    links: ["반응형 홈페이지", "쇼핑몰 구축", "랜딩페이지", "웹 애플리케이션"],
  },
  {
    title: "회사",
    links: ["포트폴리오", "제작 과정", "가격 안내", "문의하기"],
  },
  {
    title: "고객지원",
    links: ["개인정보처리방침", "이용약관", "FAQ", "블로그"],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[var(--color-dark)] pt-14 pb-8">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div>
            <a
              href="#"
              className="text-[1.3rem] font-extrabold text-white no-underline inline-block mb-4"
            >
              HS <span className="text-[var(--color-primary)]">WEB</span>
            </a>
            <p className="text-[var(--color-gray-light)] text-[0.9rem] leading-relaxed max-w-[260px]">
              감각적인 디자인과 최신 기술력으로 비즈니스 성장을 돕는 웹 전문
              에이전시입니다.
            </p>
          </div>
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-white font-semibold mb-4 text-[0.95rem]">
                {section.title}
              </h4>
              <ul className="list-none space-y-2.5">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[var(--color-gray-light)] no-underline text-[0.9rem] hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[var(--color-gray-light)] text-[0.85rem]">
            &copy; 2026 HS WEB. All rights reserved.
          </p>
          <div className="flex gap-3">
            {["Instagram", "Blog", "KakaoTalk", "YouTube"].map((s) => (
              <a
                key={s}
                href="#"
                title={s}
                className="w-9 h-9 bg-white/[0.06] rounded-lg flex items-center justify-center text-[var(--color-gray-light)] no-underline text-xs font-semibold hover:bg-[var(--color-primary)] hover:text-white transition-all"
              >
                {s[0]}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
