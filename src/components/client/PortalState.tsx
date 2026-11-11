"use client";

import Link from "next/link";
import PortalIcon from "@/components/client/PortalIcon";

export function PortalLoading({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`portal-state ${compact ? "is-compact" : ""}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="portal-loading-symbol">
        <PortalIcon name="project" />
      </div>
      <p>내 비즈니스를 불러오고 있어요</p>
      <div className="portal-loading-track" aria-hidden="true">
        <span />
      </div>
    </div>
  );
}

export function PortalErrorState({ message }: { message: string }) {
  return (
    <main className="portal-state">
      <div className="portal-card portal-error-card">
        <span className="portal-icon-box tone-blue">
          <PortalIcon name="globe" />
        </span>
        <h1>정보를 불러오지 못했어요</h1>
        <p>{message}</p>
        <button
          className="portal-button portal-button-primary"
          onClick={() => window.location.reload()}
        >
          다시 불러오기
        </button>
        <Link href="/client" className="portal-main-link">
          로그인 화면으로
          <PortalIcon name="arrow" />
        </Link>
      </div>
    </main>
  );
}
