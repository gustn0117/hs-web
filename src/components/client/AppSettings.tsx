"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  canUseBiometrics,
  clearBiometricLogin,
  enablePushNotifications,
  isNativeApp,
  saveBiometricLogin,
} from "@/lib/native";

const BIOMETRIC_FLAG = "haon-client-biometric-on";

const cardClass = "bg-white border border-gray-200 rounded-2xl shadow-sm p-5";
const inputClass =
  "w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-[var(--color-dark)] focus:outline-none focus:border-[var(--color-primary)]";

/**
 * 앱에서만 뜨는 설정과, 어디서든 떠야 하는 계정 삭제.
 *
 * 계정 삭제는 앱스토어 심사 지침 5.1.1(v) 가 요구한다 — 계정을 만들 수 있으면
 * 앱 안에서 지울 수도 있어야 한다. 그래서 앱이든 웹이든 항상 보인다.
 */
export default function AppSettings({ username }: { username: string }) {
  const router = useRouter();
  const [native, setNative] = useState(false);
  const [biometricReady, setBiometricReady] = useState(false);
  const [biometricOn, setBiometricOn] = useState(false);
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  const [deleting, setDeleting] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const check = setTimeout(async () => {
      const inApp = isNativeApp();
      setNative(inApp);
      if (!inApp) return;
      setBiometricReady(await canUseBiometrics());
      try {
        setBiometricOn(localStorage.getItem(BIOMETRIC_FLAG) === "1");
      } catch {
        // 저장이 막혀 있으면 꺼진 것으로 본다
      }
    }, 0);
    return () => clearTimeout(check);
  }, []);

  const turnOnBiometric = async () => {
    if (!password) {
      setNotice("지금 쓰는 비밀번호를 입력해 주세요.");
      return;
    }
    setBusy(true);
    setNotice("");
    try {
      // 저장하기 전에 이 비밀번호가 맞는지 서버에 물어본다. 틀린 걸 넣어 두면
      // 다음에 지문으로 열 때 로그인이 실패한다.
      const res = await fetch("/api/client-auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        setNotice("비밀번호가 맞지 않습니다.");
        return;
      }
      if (!(await saveBiometricLogin(username, password))) {
        setNotice("이 기기에서는 지문·Face ID를 쓸 수 없습니다.");
        return;
      }
      try {
        localStorage.setItem(BIOMETRIC_FLAG, "1");
      } catch {
        // 저장이 막혀도 금고에는 들어갔다
      }
      setBiometricOn(true);
      setPassword("");
      setNotice("다음부터 지문·Face ID로 바로 열 수 있습니다.");
    } finally {
      setBusy(false);
    }
  };

  const turnOffBiometric = async () => {
    await clearBiometricLogin();
    try {
      localStorage.removeItem(BIOMETRIC_FLAG);
    } catch {
      // 못 지워도 금고는 비웠다
    }
    setBiometricOn(false);
    setNotice("지문·Face ID 로그인을 껐습니다.");
  };

  const removeAccount = async () => {
    setDeleting(true);
    setDeleteError("");
    try {
      const res = await fetch("/api/client-auth/account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: deletePassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setDeleteError(data.error || "계정을 지우지 못했습니다.");
        return;
      }
      await clearBiometricLogin();
      try {
        localStorage.removeItem(BIOMETRIC_FLAG);
      } catch {
        // 지우지 못해도 계정은 닫혔다
      }
      router.push("/client");
    } catch {
      setDeleteError("처리 중 문제가 생겼습니다. 잠시 뒤 다시 시도해 주세요.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {notice && (
        <div role="status" className="px-4 py-3 rounded-xl border border-blue-200 bg-blue-50 text-blue-800 text-sm">
          {notice}
        </div>
      )}

      {native && (
        <div className={cardClass}>
          <h4 className="text-sm font-semibold text-[var(--color-dark)]">앱 설정</h4>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-[var(--color-dark)]">알림 받기</p>
              <p className="mt-0.5 text-xs text-[var(--color-gray)]">
                결제 확인, 도메인 만료, 신청 처리 소식을 알려드립니다.
              </p>
            </div>
            <button
              type="button"
              onClick={async () => {
                const ok = await enablePushNotifications();
                setNotice(
                  ok
                    ? "알림을 켰습니다."
                    : "휴대폰 설정 → 하온 고객센터 → 알림에서 켜주세요."
                );
              }}
              className="shrink-0 min-h-[40px] px-4 bg-gray-50 border border-gray-200 text-[var(--color-dark)] rounded-xl text-xs font-semibold cursor-pointer hover:bg-gray-100"
            >
              켜기
            </button>
          </div>

          {biometricReady && (
            <div className="mt-5 pt-5 border-t border-gray-100">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[var(--color-dark)]">지문 · Face ID 로그인</p>
                  <p className="mt-0.5 text-xs text-[var(--color-gray)]">
                    비밀번호를 매번 입력하지 않아도 됩니다.
                  </p>
                </div>
                {biometricOn && (
                  <button
                    type="button"
                    onClick={turnOffBiometric}
                    className="shrink-0 min-h-[40px] px-4 bg-gray-50 border border-gray-200 text-[var(--color-gray)] rounded-xl text-xs font-semibold cursor-pointer hover:bg-gray-100"
                  >
                    끄기
                  </button>
                )}
              </div>

              {!biometricOn && (
                <div className="mt-3 flex gap-2">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="지금 쓰는 비밀번호"
                    autoComplete="current-password"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={turnOnBiometric}
                    disabled={busy}
                    className="shrink-0 min-h-[44px] px-4 bg-[var(--color-primary)] text-white rounded-xl text-xs font-semibold border-none cursor-pointer hover:opacity-90 disabled:opacity-50"
                  >
                    {busy ? "확인 중..." : "켜기"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className={cardClass}>
        <h4 className="text-sm font-semibold text-[var(--color-dark)]">계정 지우기</h4>
        <p className="mt-2 text-[13px] text-[var(--color-gray)] leading-[1.7]">
          계정을 지우면 바로 로그인할 수 없고, 연락처(전화·메일)도 함께 지워집니다.
          다만 계약·결제 기록은 전자상거래법에 따라 5년간 보관한 뒤 지웁니다.
          다시 쓰시려면 하온에 연락해 새로 만드셔야 합니다.
        </p>

        {deleteError && (
          <div className="mt-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {deleteError}
          </div>
        )}

        {deleteOpen ? (
          <div className="mt-4 space-y-2">
            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              autoComplete="current-password"
              className={inputClass}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={removeAccount}
                disabled={deleting || !deletePassword}
                className="pressWide flex-1 min-h-[44px] bg-red-600 text-white rounded-xl text-sm font-semibold border-none cursor-pointer hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "지우는 중..." : "계정을 지웁니다"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setDeleteOpen(false);
                  setDeletePassword("");
                  setDeleteError("");
                }}
                className="min-h-[44px] px-5 bg-gray-50 border border-gray-200 text-[var(--color-gray)] rounded-xl text-sm font-medium cursor-pointer hover:bg-gray-100"
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            className="mt-4 min-h-[44px] px-5 bg-white border border-red-200 text-red-600 rounded-xl text-sm font-semibold cursor-pointer hover:bg-red-50"
          >
            계정 지우기
          </button>
        )}
      </div>
    </div>
  );
}
