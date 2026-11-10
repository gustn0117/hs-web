# 하온 고객센터 iOS 앱 — 올리는 법

고객이 홈 화면에서 아이콘을 눌러 바로 들어오게 하려고 만든 앱입니다.
화면은 `haonlabs.com/client` 를 그대로 띄우고, 웹으로 못 하는 일(알림,
Face ID, 상태바)만 네이티브로 처리합니다.

- 번들 ID: `com.haonlabs.customer`
- 앱 이름: 하온 고객센터
- 들어가면 열리는 곳: `https://haonlabs.com/client/dashboard`

## 1. 코드 고친 뒤에 할 일

앱 껍데기는 거의 안 바뀝니다. 포털 화면만 고쳤다면 **서버에 배포만 하면
앱에도 바로 반영됩니다.** 앱을 다시 올릴 필요가 없습니다.

`capacitor.config.ts` 나 플러그인을 건드렸을 때만:

```sh
export PATH="/opt/homebrew/opt/node@22/bin:$PATH"   # Capacitor 는 node 22 이상
npx cap sync ios
```

이 맥의 기본 node 는 20이고, 서버 Docker 도 node 20 입니다. Capacitor CLI 만
node 22 가 필요해서 위처럼 그때만 바꿔 씁니다.

## 2. Xcode 에서 열기

```sh
export PATH="/opt/homebrew/opt/node@22/bin:$PATH"
npx cap open ios
```

처음 한 번은 Xcode 에서 직접 해야 합니다:

1. **App 타겟 > Signing & Capabilities**
   - Team 을 하온 개발자 계정으로
   - `+ Capability` → **Push Notifications** 추가
2. **General > Identity**
   - Version `1.0.0`, Build `1` (올릴 때마다 Build 를 올립니다)

## 3. 알림 키 만들기 (한 번만)

알림을 보내려면 애플에서 키를 받아 서버에 넣어야 합니다.

1. [developer.apple.com](https://developer.apple.com) → Certificates, IDs & Profiles → **Keys**
2. `+` → 이름 아무거나 → **Apple Push Notifications service (APNs)** 체크 → Continue → Register
3. `.p8` 파일을 받습니다. **한 번만 받을 수 있으니 잘 보관하세요.**
4. 서버의 `.env.production` 에 넣습니다:

```
APNS_KEY_ID=받은_키_ID
APNS_TEAM_ID=개발자계정_오른쪽위_10자리
APNS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...p8 파일 내용...\n-----END PRIVATE KEY-----"
APNS_BUNDLE_ID=com.haonlabs.customer
APNS_PRODUCTION=true
```

줄바꿈은 `\n` 으로 바꿔 한 줄로 넣습니다. 세 값 중 하나라도 없으면 알림만
안 가고 나머지는 그대로 돕니다.

지금 알림이 나가는 때는 둘입니다.

- 관리자에서 결제를 **완료**로 바꿀 때 → 「입금이 확인됐습니다」
- 관리자에서 상품 신청을 **연락함 / 완료**로 바꿀 때 → 「신청하신 … 」

## 4. 심사에서 걸리는 지점

**4.2 — 「그냥 웹사이트 아니냐」** 가 이 앱의 가장 큰 위험입니다. 화면을
웹에서 가져오기 때문입니다. 그래서 웹으로 못 하는 기능을 넣어 두었습니다.
심사 메모(App Review Notes)에 이걸 적어 주세요.

```
이 앱은 하온이 홈페이지를 만들어 드린 기업 고객 전용 관리 앱입니다.
웹에서 할 수 없는 기능을 담았습니다.

1. 푸시 알림 — 입금 확인, 도메인 만료 임박, 작업 신청 처리 상황을
   실시간으로 알려 드립니다.
2. Face ID / Touch ID 로그인 — 기기 보안 영역(Keychain)에 저장된
   정보로 생체 인증 로그인을 지원합니다.

심사용 계정:
  아이디: (만들어서 적기)
  비밀번호: (적기)
```

심사용 계정은 **관리자 > 클라이언트**에서 하나 만들어 프로젝트·결제
내역이 보이게 채워 두세요. 빈 화면이면 그것만으로도 반려됩니다.

**5.1.1(v) — 계정 삭제**는 이미 들어가 있습니다. 설정 탭 맨 아래
「계정 지우기」입니다. 누르면 바로 로그인이 막히고 연락처가 지워지며,
계약·결제 기록은 전자상거래법에 따라 5년 보관 후 지운다고 화면에
적어 두었습니다.

## 5. TestFlight 로 올리기

### 먼저 — 웹을 배포해 두세요

앱은 화면을 `haonlabs.com/client` 에서 가져옵니다. **웹을 먼저 배포하지 않으면
테스터가 앱을 열어도 예전 포털이 보입니다.** 상품 탭도, 아래 탭 바도, 계정
지우기도 없습니다. 순서는 반드시 이렇습니다.

1. 웹 커밋·푸시·배포 → `haonlabs.com/client` 에 새 포털이 떴는지 확인
2. 그 다음 TestFlight 업로드

### 한 번만 하면 되는 것

**아이폰 한 번 꽂기** — 지금 이것 때문에 막혀 있습니다.

Xcode 로그인은 돼 있습니다(심현수 / 팀 `HYUNSU SIM U4HRK9DX9S`, Admin).
그런데 아카이브를 만들려면 Xcode 가 프로비저닝 프로파일을 받아와야 하고,
애플은 **팀에 등록된 기기가 하나도 없으면 그 프로파일을 안 내줍니다.**

```
Communication with Apple failed:
Your team has no devices from which to generate a provisioning profile.
```

아이폰을 USB 로 한 번 꽂고 Xcode 에서 신뢰를 허용하면 기기가 등록되고,
그 뒤로는 꽂지 않아도 계속 됩니다. 아이폰이 없으면
[developer.apple.com](https://developer.apple.com/account/resources/devices/list)
에서 UDID 를 직접 넣어도 됩니다.

기기가 등록되면 Xcode 가 배포용 인증서(Apple Distribution)와 앱스토어
프로파일을 알아서 만듭니다. 지금 이 맥에는 개발용 인증서밖에 없습니다.

**App Store Connect 에 앱 만들기**

1. [appstoreconnect.apple.com](https://appstoreconnect.apple.com) → 나의 앱 → `+`
2. 플랫폼 iOS, 번들 ID `com.haonlabs.customer`, SKU 아무거나
3. 이름은 앱스토어 전체에서 하나뿐이어야 합니다. 「하온 고객센터」 가 이미
   있으면 「하온 고객센터 - 홈페이지 관리」 처럼 길게 잡으세요

### 올릴 때마다 하는 것

```sh
npm run ios:archive     # 아카이브 (서명 포함)
npm run ios:export      # .ipa 로 빼기
```

빼낸 파일은 `ios/App/build/export/App.ipa` 입니다. 올리는 건 Xcode 로
하는 게 가장 쉽습니다.

- Xcode → `Window` → `Organizer` → 방금 만든 아카이브 선택
- `Distribute App` → `TestFlight & App Store` → `Upload`

올린 뒤 App Store Connect 의 TestFlight 탭에서 처리가 끝나기를 기다립니다
(보통 10~30분). 처리가 끝나면 **내부 테스터**(최대 100명, 심사 없음)에게
바로 보낼 수 있습니다. **외부 테스터**(최대 10,000명)는 애플 심사를 한 번
거칩니다 — 보통 하루 이틀입니다.

### 다음 빌드를 올릴 때

빌드 번호가 겹치면 거부당합니다. `ios/App/App.xcodeproj` 에서
`CURRENT_PROJECT_VERSION` 을 1씩 올리거나, Xcode 의 General > Identity 에서
Build 를 올리세요.

**웹만 고쳤다면 다시 올릴 필요가 없습니다.** 배포만 하면 앱에 바로 반영됩니다.

## 6. App Store Connect 에 올릴 때 필요한 것

| 항목 | 값 |
|---|---|
| 이름 | 하온 고객센터 |
| 부제 | 내 홈페이지 관리 |
| 카테고리 | 비즈니스 |
| 개인정보처리방침 | `https://haonlabs.com/privacy` |
| 지원 URL | `https://haonlabs.com/contact` |
| 연령 등급 | 4+ |
| 스크린샷 | 6.9형(1320×2868) · 6.5형(1242×2688) 각 3장 이상 |

스크린샷은 시뮬레이터에서 찍으면 됩니다. Xcode 에서 iPhone 17 Pro Max 로
실행한 뒤 `Cmd+S` 입니다.

**App Privacy(데이터 수집)** 항목에는 이렇게 적습니다.

- 연락처 정보(이름·전화·메일) — 앱 기능 제공, 사용자에게 연결됨
- 식별자(기기 토큰) — 앱 기능 제공(알림), 사용자에게 연결됨
- 추적 안 함

## 7. 알아 둘 것

- 앱은 인터넷이 없으면 `app-shell/index.html` 의 안내 화면을 보여줍니다.
- `haonlabs.com` 밖으로 가는 링크는 앱 안에서 안 열리고 사파리로 넘어갑니다.
- 세로 화면으로 고정해 두었습니다.
- 아이콘·시작 화면은 `ios/App/App/Assets.xcassets` 에 있습니다. 바꾸려면
  네이비(`#0a2a5e`) 바탕에 흰 마크 1024×1024 로 다시 넣으면 됩니다.
