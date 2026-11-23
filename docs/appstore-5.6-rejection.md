# 하온 iOS 1.0 — Guideline 5.6 거부 기록

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
