# 승인 (2026-11-24 확인)

**앱이 App Store 에 올라갔다.**

| 항목 | 값 |
|---|---|
| 앱 | 하온 · `com.haonlabs.customer` · SKU `haon-customer-001` |
| 버전 | 1.0 (빌드 5) |
| 상태 | `READY_FOR_SALE` / `READY_FOR_DISTRIBUTION` |
| 공개 설정 | `AFTER_APPROVAL` — 승인 즉시 공개 |
| 심사건 | `443c5d4a` → `COMPLETE`, 항목 `APPROVED` |
| 주소 | https://apps.apple.com/kr/app/id6832865615 (HTTP 200, 「하온 앱 - App Store」) |

**재제출은 하지 않았다.** 2026-11-23 에 Resolution Center 회신(3,994자)만
보냈고 애플이 그 심사건을 이어서 승인했다. 「재제출 안 함」 절의 판단이 맞았다.

이로써 **push 금지가 풀린다.**

---

# 하온 iOS 1.0 — 심사 기록

거부와 회신을 시간순으로 모아 둔다. 처음은 Guideline 5.6,
두 번째는 5.1.2(i) + 2.1(b).

App Store Connect Resolution Center 대화 사본. 항목을 떼어내기 전(2026-11-21)에
남겨 둔다. ASC 쪽에서 사라져도 내용은 여기 있다.

- 앱: 하온 (Apple ID 6832865615, `com.haonlabs.customer`)
- 버전: 1.0 / 빌드 1.0.0 (5)
- 최초 제출: 2026-11-11 00:27 KST
- 제출 ID: `443c5d4a-c643-4043-bcd6-af4190d10251`

---

## Apple — 2026-11-17 01:35

> **Guideline 5.6 - Developer Code of Conduct**
>
> **Issue Description**
>
> We've identified a pattern of unusual behavior with the app that is commonly
> associated with fraudulent activity. Specifically, the app contains features
> that appear to have been intentionally hidden during the review process.
>
> Manipulative and misleading behavior is not consistent with guideline 5.6.
>
> **Resources**
>
> - Learn more about Developer Code of Conduct requirements in guideline 5.6.
> - Learn more about supporting apps on compatible devices.
> - See tips from App Review for a smooth review experience.

## 심현수 — 2026-11-17 02:16

> Thank you for the review. We want to respond directly to the 5.6 concern,
> because nothing was hidden intentionally and we can account for what you saw.
>
> **WHAT HAPPENED**
> Our app is a hybrid app. The screens are served live from our own website
> at https://haonlabs.com/client/dashboard.
>
> We submitted on November 11, 2026 at 00:27 KST. About 23 hours later, at
> 23:44 KST the same day, we deployed a visual redesign of that portal. We
> did not realize this would make the reviewed app differ from the submitted
> screenshots. By the time the review began, the app showed a new design with
> renamed tabs, and our screenshots still showed the old one. We also edited
> the review notes on November 14 to match the new design, which we now
> understand made the change look deliberate.
>
> This was poor judgment on our part, not an attempt to mislead. There is no
> code in the app that detects App Review, no feature flag, and no remote
> switch. Every visitor to that address sees exactly what the reviewer sees.
>
> **WHAT ELSE IS ON OUR DOMAIN**
> So that nothing is left undisclosed: the same domain also hosts our public
> marketing website and a staff-only administration console at /admin. The
> console is used by our own employees to manage client records and invoices.
> It uses a separate credential from client accounts, the demo account cannot
> access it, and no link inside the app points to it. We have now described
> both in the App Review notes.
>
> **WHAT WE HAVE CHANGED**
> 1. All screenshots have been replaced with captures of the current portal.
> 2. The App Review notes now disclose the hybrid architecture, the admin
>    console, and the timeline above.
> 3. We will not deploy any change to the portal until this review is decided.
>
> We would be glad to answer anything else, or to provide additional accounts
> or access if that helps verify the app.
>
> App Name: 하온 (Haon)
> Apple ID: 6832865615
> Submission ID: 443c5d4a-c643-4043-bcd6-af4190d10251

---

## 그 뒤 한 일

| 날짜 | 한 일 |
|---|---|
| 11-17 | 스크린샷 10장을 현재 디자인으로 교체 |
| 11-17 | 심사 노트를 3,411자 전면 공개본으로 교체 |
| 11-17 | 설명글 `[ 상품 ]` → `[ 서비스 ]` |
| 11-21 | 중국 본토를 배포 지역에서 제거 (175 → 174) |
| 11-21 | 거부된 제출 건에서 버전을 떼고 새 제출 건으로 재제출 |

## 중국 본토를 뺀 이유

애플이 2026-11-16 에 중국 본토 배포 앱에 **AIGC(생성형 AI) 신고**와
**보안평가 신고**를 신규 앱 필수로 만들었다. 둘 다 안 내면 제출 자체가 막힌다
(`NEW_APP_SUBMISSION_BLOCK`). 채우려면 중국 당국의 알고리즘 등록번호와
보안평가 보고서가 필요해 한국 법인으로는 현실적으로 불가능하다.
홍콩·마카오·대만은 별개 지역이라 그대로 둔다.

나중에 중국 본토가 필요해지면 그 두 신고를 갖춘 뒤 지역을 다시 넣으면 된다.

---
---

# 2차 — Guideline 5.1.2(i) + 2.1(b)

- 심사건: `443c5d4a-c643-4043-bcd6-af4190d10251` → `UNRESOLVED_ISSUES`
- 버전 1.0 → `REJECTED`
- 심사일: 2026-11-23 / iPhone 17 Pro Max / 1.0 (5)

거부가 아니라 **정보 요청** 두 건이다. 앱을 고칠 일은 없고,
ASC 설정 하나와 회신 하나로 끝난다.

## Apple — 2026-11-23

### 5.1.2(i) 개인정보 — 추적 동의

ASC 「앱 개인정보 보호」에 사용자 ID·기기 ID 가 **추적 목적**으로
수집된다고 적혀 있는데, 앱이 App Tracking Transparency 로 동의를
받지 않는다는 지적.

애플이 준 길 세 가지 중 우리에게 맞는 것은 첫 번째다 —
**추적하지 않으니 라벨을 고친다.**

### 2.1(b) 정보 필요 — 사업 구조

앱에서 유료 디지털 콘텐츠에 접근하는 것처럼 보인다며 다섯 가지를 물었다.

## 확인한 사실 (2026-11-23)

회신 전에 코드로 직접 확인한 것들.

| 확인한 것 | 결과 | 어떻게 확인했나 |
|---|---|---|
| 추적·광고 SDK | **없음** | `ios/` 전체에 `AppTrackingTransparency`·`AdSupport`·`IDFA`·`advertisingIdentifier` 0건 |
| 분석 SDK | **없음** | Firebase·AppsFlyer·Adjust·Amplitude·Mixpanel·GA 0건 |
| CocoaPods | **없음** | `ios/App/Podfile` 비어 있음 |
| 서드파티 코드 전체 | Capacitor 8개 + Capgo 생체인증 1개 | `package.json` 의존성 |
| 인앱결제 | **없음** | ASC API `inAppPurchasesV2`·`subscriptionGroups`·`promotedPurchases` 전부 0건 |
| StoreKit | **없음** | `ios/`·`src/` 에 0건 |
| 포털에 가격 표시 | **없음** | 「서비스」탭에 금액·단가 문구 0건 |
| 결제 경로 | 앱 밖 | 계좌번호 복사 → 은행 앱에서 이체 → 「입금했어요」로 알림 → 담당자가 확인 |

즉 애플이 본 「추적」은 앱 동작이 아니라 **우리가 라벨을 잘못 체크한 것**이다.

## 할 일 순서 (순서가 중요하다)

1. **ASC 에서 개인정보 라벨을 먼저 고친다.** 공개 API 로는 불가능 —
   `appDataUsages`·`appPrivacyDetails` 등 7개 경로 전부 404,
   앱 리소스에 개인정보 관계 자체가 없다. 웹에서 손으로 해야 한다.
2. 그 다음 Resolution Center 에 회신한다. 라벨을 안 고치고 회신하면
   애플이 같은 지적을 되풀이한다.
3. 애플이 심사를 이어받는다. **재제출하지 않는다** — 아래 「재제출 안 함」 절 참고.

### ASC 라벨 고치는 길

App Store Connect → 앱 → 왼쪽 「**앱 개인정보 보호**」(App Privacy)
→ 「데이터 유형」 편집.

**사용자 ID**와 **기기 ID** 각각에서 「이 데이터를 **추적** 목적으로
사용합니까」를 **아니요**로. 「제3자 광고」·「개발자의 광고 또는 마케팅」
용도도 체크돼 있으면 함께 해제한다 — 이 둘은 추적을 뜻한다.

남겨야 하는 답: **앱 기능**(App Functionality) 용도, 「사용자에게 연결된
데이터」. 수집 자체는 사실이니 끄지 않는다.

애플이 "including User ID and Device ID" 라고 썼으므로 **다른 유형도
전부** 추적 체크가 있는지 훑는다. 이름·구매 내역·앱 상호작용도 확인.

편집 후 「**게시**」를 눌러야 반영된다.

## 처리 결과 — 2026-11-23

둘 다 끝났다.

**1. 개인정보 라벨** (오후 5시경 게시)
Resolution Center 회신란은 **4000자 상한**이다. 아래 원고가 6,135자여서
못 들어갔다. 줄여서 3,994자로 보냈다 (「실제로 보낸 글」 절 참고).

라벨은 ASC 웹에서 고쳤다 — 공개 API 에 없는 기능이다.
선언된 데이터 유형은 **기기 ID·사용자 ID 둘뿐**이었고, 둘 다
「사용 목적 = 앱 기능」에 「추적 목적으로 사용됨」이 켜져 있었다.
광고 용도(타사 광고, 개발자의 광고 또는 마케팅)는 애초에 하나도 안 켜져 있었다.

두 항목 모두 마지막 단계의 「추적 목적으로 사용합니까」를 **아니요**로 바꾸고
게시했다. 「신원에 연결됨 = 예」는 사실이라 그대로 뒀다.
결과: 「사용자를 추적하는 데 사용되는 데이터」 섹션이 사라지고
「추적 목적으로 사용됨」 문구가 0개가 됐다.

**2. 회신** (오후 5시 06분 전송, 메시지 4개 중 1건, 중복 없음)

## 재제출 안 함 — 왜 (2026-11-23 확인)

회신만 하면 되고, **재제출은 지금 불가능하다.** ASC 가 길을 막아 둔 상태다.

| 확인한 것 | 결과 |
|---|---|
| 심사건 `443c5d4a` 의 「앱 심사에 다시 제출」 | **비활성** (`disabled=true`, 안내 문구 없음) |
| 버전 페이지의 「심사 업데이트」 | **비활성** |
| 버전 1.0 / 심사건 상태 | `REJECTED` / `UNRESOLVED_ISSUES` (항목 1개 `REJECTED`) |
| 데모 계정 (`appStoreReviewDetail`) | `test` / `1234`, 필요 = true |
| 심사 노트 | 3,411자. 「ABOUT PAYMENTS」 절이 2.1(b) 를 이미 설명함 |

**애플 원문이 근거다.** 5.1.2(i)·2.1(b) 양쪽 모두 재제출을 요구하지 않는다.

> Thank you for your resubmission, but we need additional information
> **before we can continue our review**. Please **reply to this message**
> in App Store Connect with detailed answers to the questions below.

> (2.1(b)) We have **started our review**, but we need additional
> information **to continue**.

5.1.2(i) 의 첫 번째 길도 「라벨을 고치라」까지다. 재제출은 셋째 길
(실제로 추적하는 경우)에만 나온다 — 우리 경우가 아니다.

버튼이 비활성인 것도 같은 뜻이다. 심사건이 **애플 손에 열려 있어서**
우리가 건드릴 수 없는 것이다. 2026-11-21 처럼 **항목을 떼어내면**
강제로 재제출할 수 있지만, 지금 그러면 손해다.

- 리뷰어가 막 읽을 회신이 **끊긴다.** 재제출하면 App Review 가 이전
  메시지에 답할 수 없게 된다.
- 심사 줄 **맨 뒤로 간다.**
- 얻는 것이 없다. 바이너리는 1.0 (5) 그대로고 고칠 것이 없었다.

**재제출할 때:** 애플이 회신에서 명시적으로 요구하거나, 빌드를 새로
올려야 할 때. 그때는 항목 떼어내기 → 버전 「심사 업데이트」 → 제출.

## 실제로 보낸 글 (3,994자)

```
Hello,

Answers to both items are below.


GUIDELINE 5.1.2(i) - THE APP DOES NOT TRACK

The app does not track users, on this or any other platform, and never has.
Our App Privacy information was wrong. We marked "used for tracking purposes"
for User ID and Device ID because we read "tracking" as "we can tell which
account a record belongs to". We now understand it means linking data with
third-party data for advertising, or sharing it with a data broker. The app
does neither.

We have corrected App Privacy in App Store Connect: User ID and Device ID are
now Data Linked to You, collected for App Functionality only, and are no
longer declared as used for tracking. No other answer changed.

- User ID: the identifier of the client's own account on our own server, used
to show that client their own records. Never sent to a third party.
- Device ID: the APNs device token, used only to send that client reminders
about a renewal date or an unpaid invoice. Stored on our server only.

The binary contains no advertising or analytics framework. All third-party
code in it: @capacitor/core, app, haptics, keyboard, preferences,
push-notifications, splash-screen, status-bar (Capacitor by Ionic), and
@capgo/capacitor-native-biometric (Face ID / Touch ID unlock). The app does
not link AdSupport or AppTrackingTransparency and never reads the advertising
identifier, so there is no ATT prompt to point you to. Behaviour is identical in
all regions.


GUIDELINE 2.1(b) - OUR BUSINESS MODEL

Haon is a web development studio in South Korea. We build and maintain
websites for business clients. This app is a portal where an existing client
looks up the status of the work we are doing for them. It is not a store;
nothing can be bought in it.

1. Who uses the paid content? Only existing Haon clients. Our staff creates
each account for a client who has already signed a contract for website
design, development or maintenance. There is no public sign-up: someone who
downloads the app cannot create an account.

2. Where can users purchase? Nowhere in the app, and nowhere on our website.
Services are agreed offline before the account exists, by phone, email or a
meeting. We then invoice, and the client pays by bank transfer. The app has no
payment form, no card entry and no checkout.

3. What previously purchased content can be accessed? No digital content. The
app shows the client their own business records with us: how far along their
website is and its address; their invoice history and our bank account number,
which they copy into their own banking app; days left on their domain and
hosting. Nothing is unlocked, downloaded, streamed or consumed in the app.
What they paid for is a website, used outside the app. One button may look
like a payment and is not: beside an unpaid invoice, "I have made the
transfer" sends no money. The client has already paid in their banking app; it
only asks us to go and check our account.

4. What is unlocked without In-App Purchase? Nothing. There is no paid tier,
subscription or digital content. Every screen is available to every account
from the moment we create it; an unpaid invoice changes the text on the
billing screen and nothing else. What we sell - website design and
development, domain registration, hosting - is used outside the app, which
Guideline 3.1.3(e) says must not use In-App Purchase. The "Services" tab lists
the kinds of work we offer, with no prices. Tapping one sends an enquiry to
the client's account manager, who then contacts them. It is a one-way enquiry
form, not an order form.

5. How do users obtain an account, and is there a fee? Our staff creates it by
hand once a contract is signed, then gives the client the ID and password.
There is no fee to create or keep an account; it is free to our clients. The
client pays only for the development work, invoiced separately and paid by
bank transfer outside the app.


Demo account (every tab has example content):
ID test / Password 1234

Thank you,
Haon
```

## 원고 (6,135자 — 길어서 못 보냄, 근거 기록용)

```
Hello,

Thank you for the detailed questions. Answers to both items are below.


=== Guideline 5.1.2(i) — the app does not track users ===

The app does not track users, on this platform or any other, and never has.
Our App Privacy information was filled in incorrectly. That was our error in
answering the questionnaire, not a description of what the app does.

What we got wrong: we marked "used for tracking purposes" for User ID and
Device ID because we read "tracking" as meaning "we can tell which account a
record belongs to". We now understand that tracking means linking the data
with third-party data for advertising, or sharing it with a data broker. The
app does neither.

We have corrected the App Privacy information in App Store Connect. User ID
and Device ID are now declared as Data Linked to You, collected for App
Functionality only, and are no longer declared as used for tracking. We
changed no other answer.

What those two identifiers actually are:

- User ID: the identifier of the client's own portal account on our own
  server. It is used to show that client their own project and invoice
  records, and nothing else. It is never sent to a third party.

- Device ID: the Apple Push Notification service device token. It is used
  only to send that client reminders about a renewal date or an unpaid
  invoice. It is stored on our own server and is never sent to a third party.

There is no advertising framework and no analytics framework in the binary.
The complete list of third-party code in the app is:

  @capacitor/core, @capacitor/app, @capacitor/haptics, @capacitor/keyboard,
  @capacitor/preferences, @capacitor/push-notifications,
  @capacitor/splash-screen, @capacitor/status-bar   (Capacitor, by Ionic)
  @capgo/capacitor-native-biometric    (Face ID / Touch ID unlock only)

The app does not link AdSupport or AppTrackingTransparency and never reads the
advertising identifier. Because the app does not track, there is no App
Tracking Transparency permission request to point you to. The app behaves
identically in every country and region where it is available.


=== Guideline 2.1(b) — our business model ===

Haon is a web development studio in South Korea. We design and build websites
for business clients and maintain them afterwards. This app is a portal where
an existing client can look up the status of the work we are doing for them.
It is not a store. Nothing can be bought in it.

1. Who are the users that will use the paid content, subscriptions, features,
   and services in the app?

   Only existing clients of Haon. Our staff creates each account for a client
   who has already signed a contract with us for website design, development,
   or ongoing maintenance. There is no public sign-up: someone who downloads
   the app cannot create an account and cannot see any content.

2. Where can users purchase the content, subscriptions, features, and services
   that can be accessed in the app?

   Nowhere in the app, and nowhere on our website. Our services are agreed
   offline, before the account exists, by phone, email, or a meeting in
   person. We then invoice the client and they pay by bank transfer to our
   business account. No purchase can be started or completed inside the app.
   The app has no payment form, no card entry, and no checkout.

3. What specific types of previously purchased content, subscriptions,
   features, and services can a user access in the app?

   No digital content of any kind. The app shows the client their own business
   records with us:

   - how far along the website we are building for them is, and its address
   - their invoice history: what is paid, what is outstanding, and our bank
     account number, which they can copy and paste into their banking app
   - how many days are left on their domain registration and their hosting

   Nothing is unlocked, downloaded, streamed, or consumed in the app. What the
   client paid for is a website, which runs on the public internet and is used
   outside the app.

   One button may look like a payment action and is not: next to an unpaid
   invoice there is a button meaning "I have made the transfer". It sends no
   money. The client has already paid in their own banking app; the button
   just tells us to go and check our account, and a member of our staff then
   marks the invoice as paid.

4. What paid content, subscriptions, or features are unlocked within the app
   that do not use In-App Purchase?

   None. The app has no paid tier, no premium feature, no subscription, and no
   digital content. Every screen is available to every account from the moment
   we create it. Whether an invoice is paid or unpaid changes none of it — an
   unpaid invoice changes the text on the billing screen and nothing else.

   The services we sell — website design and development, domain
   registration, and hosting — are carried out by us and used outside the
   app. Under Guideline 3.1.3(e), Goods and Services Outside of the App, these
   must not use In-App Purchase, and we collect no payment for them in the
   app.

   The "Services" tab lists the kinds of work we offer, with no prices on it.
   Tapping one sends an enquiry to the client's account manager, who then
   contacts them to talk it over. It is a one-way enquiry form, not an order
   form: no amount is quoted, nothing is charged, and nothing is unlocked.

5. How do users obtain an account? Do users have to pay a fee to create an
   account?

   Our staff creates it by hand in our internal admin system once a contract
   is signed, then gives the client the ID and password directly.

   There is no fee to create an account and no fee to keep one. The account is
   free to our clients and carries no charge of any kind. The client pays only
   for the web development work itself, which we invoice separately and they
   pay by bank transfer, outside the app.


For your review, please use the demo account. It contains example projects,
invoices, and domains, so every tab has content:

   ID: test
   Password: 1234

Please tell us if any of the above needs more detail.

Thank you,
Haon
```

## 왜 IAP 가 필요 없는가 (근거)

Guideline **3.1.3(e) Goods and Services Outside of the App** —
앱 밖에서 소비되는 재화·서비스는 IAP 를 **쓰면 안 된다**.
우리가 파는 것은 홈페이지 제작·도메인·호스팅이고, 결과물인 홈페이지는
공개 인터넷에서 돌아간다. 앱은 그 기록을 보여주는 창일 뿐이다.

게다가 앱 안에서 결제가 **일어나지 않는다**. 계좌번호를 복사해
은행 앱에서 이체한다. 애플이 가져갈 수수료의 대상 자체가 없다.
