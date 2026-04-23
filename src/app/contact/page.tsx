import type { Metadata } from "next";
import ContactForm from "./ContactForm";
import { PageShell, Section } from "@/components/PageShell";
import Link from "next/link";

export const metadata: Metadata = {
  title: "무료 상담 · 문의하기 - 홈페이지 제작 견적 문의",
  description:
    "홈페이지 제작, 쇼핑몰 구축, 랜딩페이지 제작 무료 상담을 받아보세요. 프로젝트 규모에 맞는 맞춤 견적을 24시간 내 안내드립니다.",
  keywords: ["홈페이지 제작 문의", "홈페이지 제작 견적", "웹사이트 제작 상담", "홈페이지 제작 비용"],
  alternates: { canonical: "https://hsweb.pics/contact" },
};

export default function ContactPage() {
  return (
    <PageShell
      breadcrumb={[{ label: "문의하기" }]}
      title="무료 상담 · 견적 문의"
      caption="프로젝트 정보를 남겨주시면 24시간 이내 담당자가 회신해드립니다."
      sidebar={
        <>
          <div className="border border-[var(--color-border)] bg-white">
            <div className="p-section-head">
              <h2>연락처 정보</h2>
            </div>
            <dl className="text-[13px]">
              <div className="flex items-center justify-between px-4 h-9 border-b border-[var(--color-border)]">
                <dt className="text-[var(--color-muted)]">전화</dt>
                <dd>
                  <a href="tel:010-3319-2509" className="tnum text-[var(--color-text)] no-underline hover:text-[var(--color-point)]">010-3319-2509</a>
                </dd>
              </div>
              <div className="flex items-center justify-between px-4 h-9 border-b border-[var(--color-border)]">
                <dt className="text-[var(--color-muted)]">운영시간</dt>
                <dd className="text-[var(--color-text-2)]">평일 10:00 ~ 19:00</dd>
              </div>
              <div className="flex items-center justify-between px-4 h-9">
                <dt className="text-[var(--color-muted)]">대표</dt>
                <dd className="text-[var(--color-text-2)]">심현수 · 임진형</dd>
              </div>
            </dl>
          </div>

          <div className="border border-[var(--color-border)] bg-white">
            <div className="p-section-head">
              <h2>바로가기</h2>
            </div>
            <ul className="list-none text-[13px]">
              <li>
                <Link href="/pricing" className="flex items-center justify-between px-4 h-9 border-b border-[var(--color-border)] no-underline text-[var(--color-text)] hover:bg-[var(--color-bg-alt)]">
                  가격 안내
                  <span className="text-[var(--color-muted-2)] text-[11px]">›</span>
                </Link>
              </li>
              <li>
                <Link href="/process" className="flex items-center justify-between px-4 h-9 border-b border-[var(--color-border)] no-underline text-[var(--color-text)] hover:bg-[var(--color-bg-alt)]">
                  제작 과정
                  <span className="text-[var(--color-muted-2)] text-[11px]">›</span>
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="flex items-center justify-between px-4 h-9 no-underline text-[var(--color-text)] hover:bg-[var(--color-bg-alt)]">
                  포트폴리오
                  <span className="text-[var(--color-muted-2)] text-[11px]">›</span>
                </Link>
              </li>
            </ul>
          </div>
        </>
      }
    >
      <Section title="문의 양식">
        <div className="p-4">
          <ContactForm />
        </div>
      </Section>
    </PageShell>
  );
}
