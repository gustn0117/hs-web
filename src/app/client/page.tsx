"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import PortalIcon from "@/components/client/PortalIcon";
import {
  canUseBiometrics,
  isNativeApp,
  loginWithBiometrics,
} from "@/lib/native";

export default function ClientLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [faceIdReady, setFaceIdReady] = useState(false);
  const [inApp, setInApp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // 앱으로 열었고 이 기기가 지문·Face ID 를 쓸 수 있을 때만 버튼을 낸다.
    const check = setTimeout(async () => {
      if (!isNativeApp()) return;
      setInApp(true);
      setFaceIdReady(await canUseBiometrics());
    }, 0);
    return () => clearTimeout(check);
  }, []);

  const signIn = async (id: string, pw: string) => {
    const res = await fetch("/api/client-auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: id, password: pw }),
    });
    return { ok: res.ok, data: await res.json() };
  };

  const handleBiometric = async () => {
    setError("");
    const saved = await loginWithBiometrics();
    if (!saved) return;

    setLoading(true);
    try {
      const { ok, data } = await signIn(saved.username, saved.password);
      if (!ok) {
        setError(
          data.error ||
            "저장해 둔 정보로 열지 못했습니다. 비밀번호로 로그인해 주세요.",
        );
        return;
      }
      router.push("/client/dashboard");
    } catch {
      setError("연결이 원활하지 않아요. 잠시 후 다시 로그인해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/client-auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "로그인에 실패했습니다.");
        return;
      }

      router.push("/client/dashboard");
    } catch {
      setError("서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="portal-login">
      <header className="portal-login-header">
        <Link
          href="/client"
          className="portal-brand"
          aria-label="하온 고객센터"
        >
          <Image
            src="/brand/haon-mark.png"
            alt=""
            width={40}
            height={40}
            priority
          />
          <span>
            하온<span className="portal-brand-caption">고객센터</span>
          </span>
        </Link>
        {!inApp && (
          <Link href="/" className="portal-login-home">
            하온 홈페이지 ↗
          </Link>
        )}
      </header>
      <main className="portal-login-main">
        <div className="portal-login-intro">
          <p className="portal-eyebrow">나의 비즈니스 파트너, 하온</p>
          <h1>
            비즈니스의 모든 순간,
            <br />더 가까이에서.
          </h1>
          <p>
            프로젝트 현황부터 결제, 서비스 관리까지.
            <br />
            이제 한곳에서 편안하게 확인하세요.
          </p>
          <div className="portal-login-preview" aria-label="고객센터 주요 기능">
            <div>
              <span className="portal-icon-box tone-blue">
                <PortalIcon name="project" />
              </span>
              <span>
                <strong>내 프로젝트를 한눈에</strong>
                <p>진행 현황과 운영 정보를 간편하게</p>
              </span>
            </div>
            <div>
              <span className="portal-icon-box tone-green">
                <PortalIcon name="shield" />
              </span>
              <span>
                <strong>운영도 안심하고</strong>
                <p>호스팅부터 도메인 갱신까지</p>
              </span>
            </div>
          </div>
        </div>
        <div>
          <div className="portal-login-form-wrap">
            <h2>반가워요 👋</h2>
            <p>하온 계정으로 내 비즈니스를 만나보세요.</p>
            <form onSubmit={handleSubmit} className="portal-login-form">
              {error && (
                <div role="alert" className="portal-feedback-error">
                  {error}
                </div>
              )}
              <div>
                <label className="portal-field-label" htmlFor="client-username">
                  아이디
                </label>
                <input
                  id="client-username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder="아이디를 입력해 주세요"
                />
              </div>
              <div>
                <label className="portal-field-label" htmlFor="client-password">
                  비밀번호
                </label>
                <div className="portal-password-field">
                  <input
                    id="client-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="비밀번호를 입력해 주세요"
                  />
                  <button
                    type="button"
                    className="portal-icon-button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "비밀번호 숨기기" : "비밀번호 보기"
                    }
                    aria-pressed={showPassword}
                  >
                    <PortalIcon name={showPassword ? "lock" : "eye"} />
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="portal-button portal-button-primary"
              >
                {loading ? "로그인하고 있어요…" : "로그인"}
              </button>
              {faceIdReady && (
                <button
                  type="button"
                  onClick={handleBiometric}
                  disabled={loading}
                  className="portal-button portal-button-soft"
                >
                  <PortalIcon name="shield" />
                  지문 · Face ID로 로그인
                </button>
              )}
            </form>
            <div className="portal-login-help">
              계정 정보가 기억나지 않으면 담당자에게 문의해 주세요.
            </div>
          </div>
          <p className="portal-login-security">
            <PortalIcon name="lock" />내 비즈니스 정보, 안전하게 관리해요
          </p>
        </div>
      </main>
      <footer className="portal-footer">
        <span>HAON</span>
        <p>더 나은 비즈니스, 더 가까운 하온</p>
      </footer>
    </div>
  );
}
