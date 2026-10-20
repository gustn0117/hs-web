import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, Section } from "@/components/PageShell";
import {
  SignpostFlowDiagram,
  BeforeAfterDiagram,
  ChecklistIllustration,
  PropagationMap,
  DomainPieceIcon,
  SignpostPieceIcon,
  ServerPieceIcon,
} from "./Illustrations";

export const metadata: Metadata = {
  title: "네임서버 변경 가이드 — 가비아·후이즈·호스팅케이알·카페24",
  description:
    "도메인 등록업체별 네임서버 변경 방법을 단계별로 안내합니다. 가비아, 후이즈, 호스팅케이알, 카페24, 아이네임즈, 메가존 등 한국 주요 등록업체의 메뉴 경로와 절차, 주의사항, 전파 시간까지.",
  keywords: [
    "네임서버 변경",
    "도메인 네임서버",
    "DNS 변경",
    "가비아 네임서버",
    "후이즈 네임서버",
    "호스팅케이알 네임서버",
    "카페24 네임서버",
    "Cloudflare 네임서버",
  ],
  alternates: { canonical: "https://hsweb.pics/nameserver-guide" },
};

type Step = { n: number; title: string; desc: string };
type Registrar = {
  slug: string;
  name: string;
  websiteUrl: string;
  websiteLabel: string;
  summary: string;
  menuPath: string;
  steps: Step[];
  propagation: string;
  cautions: string[];
  sources: { label: string; url: string }[];
};

const REGISTRARS: Registrar[] = [
  {
    slug: "gabia",
    name: "가비아",
    websiteUrl: "https://www.gabia.com",
    websiteLabel: "gabia.com",
    summary: "My가비아 → 서비스 관리 → 도메인 통합 관리툴에서 네임서버 변경",
    menuPath: "로그인 → My가비아 → 서비스 관리 → 도메인 통합 관리툴 → 도메인 정보 변경 → 네임서버 탭",
    steps: [
      { n: 1, title: "가비아 로그인", desc: "gabia.com에 접속해 도메인을 보유한 계정으로 로그인합니다. 우측 상단의 [My가비아] 메뉴를 클릭합니다." },
      { n: 2, title: "서비스 관리", desc: "My가비아 좌측 메뉴에서 [서비스 관리]를 선택해 보유 도메인 목록을 확인합니다. 변경할 도메인이 정상 상태(만료·이전 잠금 아님)인지 먼저 확인하세요." },
      { n: 3, title: "관리툴 진입", desc: "해당 도메인 행의 [관리툴] 버튼(도메인 통합 관리툴)을 클릭합니다. 좌측 트리에서 [도메인 정보 변경]을 선택한 뒤 변경할 도메인에 체크합니다." },
      { n: 4, title: "네임서버 탭", desc: "상단의 [네임서버] 탭으로 이동하면 현재 1·2·3·4차 호스트명이 표시됩니다. 기존 값(ns.gabia.co.kr 등)을 모두 삭제합니다." },
      { n: 5, title: "새 네임서버 입력", desc: "이전할 호스팅에서 발급받은 네임서버(예: xxx.ns.cloudflare.com)를 1·2차에 순서대로 입력합니다. 3·4차가 없으면 비워둬도 됩니다." },
      { n: 6, title: "소유자 인증 후 확인", desc: "하단의 [소유자 인증] 버튼을 클릭해 등록된 이메일·휴대폰으로 인증 코드를 받아 입력합니다. 인증 완료 후 [확인] 버튼을 눌러 저장합니다." },
    ],
    propagation: "변경 후 보통 수 시간 ~ 1일 내 반영되며, 통신사 캐시 상황에 따라 최대 48시간까지 소요될 수 있습니다.",
    cautions: [
      "현재 가비아 DNS에 설정된 A·CNAME·MX·TXT 레코드를 모두 메모·캡처해 새 네임서버 쪽 DNS에 동일하게 옮겨두지 않으면 웹·메일이 끊깁니다.",
      "메일을 가비아 메일호스팅으로 쓰는 경우 네임서버 변경 시 메일도 끊기므로, 새 DNS에 MX·SPF·DKIM 레코드를 반드시 선등록해야 합니다.",
      "도메인 만료일이 임박(7일 이내)하거나 잠금 상태면 네임서버 변경이 거부되므로 갱신·잠금 해제 후 진행하세요.",
    ],
    sources: [
      { label: "가비아 매뉴얼 — 네임서버 변경", url: "https://customer.gabia.com/manual/domain/286/991" },
      { label: "가비아 라이브러리 가이드", url: "https://library.gabia.com/contents/domain/13641/" },
    ],
  },
  {
    slug: "whois",
    name: "후이즈",
    websiteUrl: "https://www.whois.co.kr",
    websiteLabel: "whois.co.kr",
    summary: "마이후이즈 → 내 도메인 자산 관리 → 네임서버 변경",
    menuPath: "로그인 → 마이후이즈 → 내 도메인 자산 관리 → 도메인 선택 → 네임서버 변경",
    steps: [
      { n: 1, title: "후이즈 로그인", desc: "www.whois.co.kr 에 접속해 도메인을 등록한 후이즈 아이디로 로그인합니다. 법인·개인 계정 구분에 주의하세요." },
      { n: 2, title: "도메인 자산 관리", desc: "상단 메뉴에서 [내 도메인 자산 관리](마이후이즈)로 이동합니다. 보조 경로: 상단 [변경/이전] → [등록정보/네임서버 변경]." },
      { n: 3, title: "도메인 선택", desc: "네임서버를 변경할 도메인 좌측 체크박스에 체크한 뒤 상단의 [네임서버 변경] 버튼을 클릭합니다." },
      { n: 4, title: "직접 입력 선택", desc: "[네임서버 정보 직접 입력]을 선택하고 기존 네임서버 값을 모두 삭제합니다. 이전할 호스팅에서 받은 1·2차 네임서버 주소를 입력합니다." },
      { n: 5, title: "신청서 확인", desc: "[다음단계로]를 누르면 신청서 확인 페이지로 이동합니다. 도메인·계정 상태에 따라 휴대폰·이메일 본인확인이 추가로 요구될 수 있습니다." },
      { n: 6, title: "동의 후 신청", desc: "고객 확인사항 동의 체크박스에 체크한 뒤 [신청하기]를 클릭하면 네임서버 변경 신청이 접수됩니다." },
    ],
    propagation: "신청 후 보통 수십 분 ~ 수 시간 내 반영되며, 전 세계 DNS 전파에는 최대 24~48시간(약 1~2일)이 소요될 수 있습니다.",
    cautions: [
      "기존 호스팅의 메일을 계속 사용하려면 네임서버 변경 전에 MX 레코드를 새 DNS에 미리 등록해야 합니다.",
      "다른 메일·호스팅 서비스와 연결된 도메인의 네임서버를 변경하면 기존 서비스가 즉시 중단될 수 있으니, 사전에 모든 레코드를 옮겨두세요.",
      "도메인이 `clientTransferProhibited` 등 잠금 상태면 변경이 거부되므로, 도메인 잠금(이전 잠금) 해제 여부를 먼저 확인합니다.",
    ],
    sources: [
      { label: "후이즈 도메인 관리", url: "https://domain.whois.co.kr/ns_service/index.php" },
      { label: "후이즈 가이드", url: "https://homepage.whois.co.kr/guide/?page=htm%2Fpage%2Faddition_domain_connect" },
    ],
  },
  {
    slug: "hosting-kr",
    name: "호스팅케이알",
    websiteUrl: "https://www.hosting.kr",
    websiteLabel: "hosting.kr",
    summary: "나의 서비스 → 도메인 관리 → 네임서버 주소변경에서 1~4차 입력",
    menuPath: "로그인 → 나의 서비스 → 도메인 관리 → 네임서버 주소변경",
    steps: [
      { n: 1, title: "새 네임서버 확인", desc: "이전할 호스팅 대시보드에서 부여받은 1~4차 네임서버 주소를 미리 메모해 둡니다. Cloudflare는 보통 2개를 제공합니다." },
      { n: 2, title: "로그인", desc: "hosting.kr에 접속해 도메인 소유자 계정으로 로그인합니다. 우측 상단의 [나의 서비스]를 클릭합니다." },
      { n: 3, title: "도메인 관리", desc: "[나의 서비스] 메뉴에서 [도메인 관리]를 클릭하고, 네임서버를 변경할 도메인을 목록에서 선택(체크)합니다." },
      { n: 4, title: "네임서버 주소변경", desc: "도메인 관리 항목에서 [네임서버 주소변경]을 선택한 뒤 [신청하기] 버튼을 클릭해 변경 신청 화면으로 진입합니다." },
      { n: 5, title: "네임서버 입력", desc: "기존 네임서버를 모두 지운 뒤 1단계에서 확인한 새 네임서버를 1차부터 차례로 입력합니다. 각 칸 옆 [IP Check] 버튼으로 유효성을 확인할 수 있습니다." },
      { n: 6, title: "변경하기 클릭", desc: "입력이 끝나면 하단의 [변경하기] 버튼을 클릭해 변경을 완료합니다. 소유자 인증(이메일·휴대폰)이 추가로 요구될 수 있습니다." },
    ],
    propagation: "변경 후 최대 24~48시간 이내 전 세계 DNS에 반영되며, .com 등은 보통 수십 분~수 시간 내 적용됩니다.",
    cautions: [
      "기존 호스팅케이알 네임서버에 설정한 DNS 레코드(A·MX·TXT 등)는 네임서버 변경 시 자동 삭제되므로, 변경 전 새 호스팅에 동일한 레코드를 만들어 두세요.",
      ".kr 도메인은 변경 시 소유자 이메일·휴대폰 인증이 필요할 수 있고 전파 속도가 .com보다 느릴 수 있습니다.",
      "네임서버는 1·2차만 입력해도 동작하지만, 호스팅케이알 화면은 4차까지 칸이 있으니 새 호스팅이 제공하는 개수만큼만 입력하고 나머지는 비워둡니다.",
    ],
    sources: [
      { label: "호스팅케이알 도움말", url: "https://help.hosting.kr/hc/ko/articles/360035319952" },
      { label: "도메인 정보 변경 섹션", url: "https://help.hosting.kr/hc/ko/sections/360007182111" },
    ],
  },
  {
    slug: "cafe24",
    name: "카페24",
    websiteUrl: "https://hosting.cafe24.com",
    websiteLabel: "hosting.cafe24.com",
    summary: "나의 서비스관리 → 도메인관리 → 네임서버 변경",
    menuPath: "로그인 → 나의 서비스관리 → 도메인관리 → 네임서버 변경 (보조: 도메인 정보변경)",
    steps: [
      { n: 1, title: "로그인", desc: "도메인을 구입한 아이디로 hosting.cafe24.com에 로그인합니다. 도메인 등록자와 동일한 계정이어야 합니다." },
      { n: 2, title: "도메인관리 진입", desc: "상단 메뉴에서 [나의 서비스관리] → [도메인관리] → [네임서버 변경]으로 이동합니다. 메뉴를 못 찾을 경우 [도메인 정보변경] 경로도 시도해보세요." },
      { n: 3, title: "본인인증", desc: "네임서버 변경 시 휴대폰·아이핀 본인인증을 완료해야 합니다. 인증 없이는 변경이 불가합니다." },
      { n: 4, title: "DNS 백업", desc: "변경 전 기존 DNS 관리 메뉴에서 A·MX·TXT 등 레코드 값을 미리 메모·캡처해 둡니다. 네임서버 변경 시 카페24 쪽 DNS 레코드가 초기화됩니다." },
      { n: 5, title: "네임서버 입력", desc: "이전할 호스팅에서 제공한 1·2차 네임서버 주소를 정확히 입력합니다. 오타가 있으면 도메인 접속 자체가 불가능해질 수 있습니다." },
      { n: 6, title: "저장 및 확인", desc: "변경사항을 저장한 뒤 whois 조회나 dig 명령으로 네임서버가 정상 반영되었는지 확인합니다. 신규 호스팅 대시보드에서도 활성화 상태를 확인하세요." },
    ],
    propagation: "변경 후 약 24시간 내 반영되며, ISP별 캐시 상황에 따라 최대 48시간까지 걸릴 수 있습니다.",
    cautions: [
      "네임서버 변경 시 기존에 설정한 DNS 레코드 값이 초기화되므로, 메일(MX)·서브도메인(A/CNAME)·SPF/TXT 등은 새 호스팅에 미리 동일하게 등록해 두세요.",
      "본인인증(휴대폰·아이핀)이 완료되어야만 네임서버 변경이 가능하므로, 도메인 등록자 정보가 현재 사용 중인 본인 정보와 일치하는지 사전 확인이 필요합니다.",
      "이전할 호스팅에서 도메인이 'Active' 상태가 되기 전 네임서버를 변경하면 사이트 접속이 끊길 수 있으니, 새 호스팅 설정 완료 후 변경하세요.",
    ],
    sources: [
      { label: "카페24 도움말 — 네임서버 변경", url: "https://help.cafe24.com/faq/domain/dns-management/how_to_change_domain_nameserver/" },
      { label: "카페24 DNS 관리 가이드", url: "https://help.cafe24.com/docs/domain/domain-dns-management-guide/" },
    ],
  },
  {
    slug: "inames",
    name: "아이네임즈",
    websiteUrl: "https://www.inames.co.kr",
    websiteLabel: "inames.co.kr",
    summary: "나의 서비스 → 도메인 관리 → 설정변경 → 네임서버 변경요청",
    menuPath: "로그인 → 나의 서비스 → 도메인 관리 → 설정변경 → 네임서버 변경요청",
    steps: [
      { n: 1, title: "로그인", desc: "www.inames.co.kr 우측 상단의 [로그인] 버튼을 눌러 아이디·비밀번호로 로그인합니다. 법인 도메인은 담당자 계정으로 접속해야 합니다." },
      { n: 2, title: "도메인 목록", desc: "상단 메뉴에서 [나의 서비스] → [도메인 관리]로 이동해 보유 도메인 리스트를 엽니다." },
      { n: 3, title: "도메인 선택", desc: "네임서버를 변경할 도메인 이름을 클릭하거나 좌측 체크박스로 선택한 뒤 상세 관리 화면으로 진입합니다." },
      { n: 4, title: "설정변경 → 네임서버 변경요청", desc: "도메인 관리 화면에서 [설정변경] 섹션의 [네임서버 변경요청] 메뉴를 선택합니다. 직접 URL: dom.inames.co.kr/changes/nsChangeIndex" },
      { n: 5, title: "네임서버 입력", desc: "1·2차(필요 시 3·4차)에 새 호스팅에서 받은 네임서버 주소를 입력합니다. 외부 네임서버는 호스트명만 넣으면 됩니다." },
      { n: 6, title: "저장·확인", desc: "하단 [저장] 또는 [변경] 버튼을 눌러 적용합니다. 변경 완료 메시지와 함께 등록정보 화면에서 새 네임서버가 노출되는지 확인합니다." },
    ],
    propagation: ".kr 도메인은 하루 3회 갱신, .com 등 gTLD는 약 5분 주기로 갱신되며 전 세계 DNS 완전 전파에는 보통 1~2일(최대 48시간)이 걸립니다.",
    cautions: [
      "변경 전 새 호스팅에서 DNS 레코드(A·MX·TXT 등)를 미리 설정해 두어야 메일·사이트 끊김을 막을 수 있습니다.",
      "도메인 잠금(Transfer Lock)이 걸려 있으면 네임서버 변경이 거부될 수 있으므로, 정보변경 메뉴에서 잠금을 먼저 해제하세요.",
      "외부 네임서버 사용 시 1·2차는 필수, 3·4차는 선택입니다. 입력한 호스트명에 오타가 없는지 반드시 확인하세요.",
    ],
    sources: [
      { label: "아이네임즈 공식", url: "https://www.inames.co.kr" },
      { label: "코드DNS 가이드", url: "http://www.codns.com/b/B05-167" },
    ],
  },
  {
    slug: "megazone",
    name: "메가존 (호스트웨이)",
    websiteUrl: "https://sitecontrol.hostway.co.kr",
    websiteLabel: "sitecontrol.hostway.co.kr",
    summary: "SiteControl → 도메인 관리 → 네임서버 메뉴에서 변경",
    menuPath: "SiteControl 로그인 → 도메인 관리 → 도메인 선택 → 네임서버 (Name Servers)",
    steps: [
      { n: 1, title: "SiteControl 로그인", desc: "sitecontrol.hostway.co.kr에 접속해 호스트웨이(메가존) 계정 ID·비밀번호로 로그인합니다. 비밀번호 분실 시 로그인 화면에서 재설정할 수 있습니다." },
      { n: 2, title: "도메인 관리 진입", desc: "상단(또는 좌측) 메뉴에서 [도메인 관리]를 선택합니다. 보유 도메인 목록에서 네임서버를 바꿀 도메인을 클릭합니다." },
      { n: 3, title: "네임서버 메뉴", desc: "도메인 상세 화면에서 [네임서버] 또는 영문 UI의 [Name Servers] 항목을 클릭합니다. 현재 등록된 1·2차 네임서버가 표시됩니다." },
      { n: 4, title: "새 네임서버 입력", desc: "Primary·Secondary에 새 호스팅(예: Cloudflare)의 두 ns 주소를 입력합니다. 국제 도메인(.com·.net)은 호스트명만, 국내 도메인(.kr·.co.kr)은 호스트명과 IP를 함께 입력해야 합니다." },
      { n: 5, title: "Update / 저장", desc: "[Update](영문) 또는 [변경/저장](국문) 버튼을 눌러 신청을 완료합니다. 직접 변경이 어려우면 domain@hostway.co.kr 또는 팩스 0504-848-6012로 요청할 수도 있습니다." },
      { n: 6, title: "전파 확인", desc: "whois 조회나 dig/nslookup으로 새 네임서버가 적용됐는지 확인합니다. 새 호스팅 대시보드에서도 활성화 상태(Active)를 점검합니다." },
    ],
    propagation: "변경 후 보통 수 시간 내 반영되며, 전 세계 DNS 캐시까지 완전히 전파되기까지 최대 24~48시간이 걸릴 수 있습니다.",
    cautions: [
      "기관이전(등록업체 변경) 전에 반드시 네임서버부터 먼저 변경하세요. 이전을 먼저 진행하면 기존 DNS 레코드가 사라져 사이트·메일이 끊어집니다.",
      "이전할 호스팅 측에 사이트를 먼저 추가하고 DNS 레코드(A·CNAME·MX·TXT)를 모두 옮긴 뒤 네임서버를 바꿔야 무중단 전환이 가능합니다.",
      "국내 도메인(.kr 계열)은 호스트명만 입력하면 적용되지 않습니다. 반드시 네임서버 호스트명과 IP 주소를 한 쌍으로 입력해야 합니다.",
      "최소 2개의 권한 있는 네임서버(Primary·Secondary)가 필요합니다.",
    ],
    sources: [
      { label: "호스트웨이 FAQ", url: "https://www.hostway.co.kr/support/faq-list/%EB%8F%84%EB%A9%94%EC%9D%B8" },
      { label: "SiteControl 로그인", url: "https://sitecontrol.hostway.co.kr" },
    ],
  },
];

export default function NameserverGuidePage() {
  return (
    <PageShell
      breadcrumb={[{ label: "네임서버 변경 가이드" }]}
      overline="NAMESERVER GUIDE"
      title="네임서버를 어디서 바꿔야 하나요?"
      subtitle="도메인을 다른 호스팅으로 옮길 때, 도메인을 산 등록업체 관리 페이지에서 네임서버를 바꿔야 합니다. 6개 주요 등록업체별 절차를 정리했습니다."
      stats={[
        { label: "등록업체", value: String(REGISTRARS.length), suffix: "곳 안내" },
        { label: "평균 전파", value: "24~48", suffix: "시간" },
        { label: "필수 NS", value: "2", suffix: "개~" },
        { label: "비용", value: "무료", suffix: "" },
      ]}
    >
      {/* HERO DIAGRAM — main signpost analogy */}
      <Section>
        <div className="p-6 md:p-10 rounded-[18px] border border-[var(--c-line)] bg-white overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-6 items-center">
            <div>
              <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[var(--c-main)] mb-3">ANALOGY · 한 줄로</p>
              <h3 className="text-[22px] md:text-[26px] font-bold tracking-tight text-[var(--c-text)] mb-3 leading-[1.35]">
                도메인은 <span className="text-[var(--c-main)]">주소</span>,<br />
                네임서버는 그 주소가 <strong>"이쪽으로 가세요"</strong>라고 알려주는 <span className="text-[var(--c-main)]">표지판</span>입니다.
              </h3>
              <p className="text-[14px] text-[var(--c-sub)] leading-[1.75]">
                호스팅을 옮긴다는 건 이 표지판을 새 서버 쪽으로 돌리는 일이에요. 도메인 자체는 그대로,
                <strong className="text-[var(--c-text-2)]"> "어느 서버로 안내할지"만 바꾸는 작업</strong>입니다.
              </p>
            </div>
            <div>
              <SignpostFlowDiagram />
            </div>
          </div>
        </div>
      </Section>

      {/* CONCEPT — 3 pieces */}
      <Section
        overline="CONCEPT"
        title="3가지만 기억하세요"
        subtitle="복잡해 보여도 실제로는 이 세 가지가 어떻게 연결되는지만 이해하면 됩니다."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              Icon: DomainPieceIcon,
              tag: "STEP 1 · 사이트 이름",
              t: "도메인",
              d: "사람이 외울 수 있는 이름(예: yourdomain.com). '가비아·후이즈'에서 사는 그것입니다.",
              bullet: "한 번 사면 그대로 유지",
            },
            {
              Icon: SignpostPieceIcon,
              tag: "STEP 2 · 표지판",
              t: "네임서버",
              d: "도메인 이름을 어느 서버로 보낼지 안내하는 표지판. 이번에 바꿀 부분이 바로 이거예요.",
              bullet: "도메인 산 곳에서 변경",
            },
            {
              Icon: ServerPieceIcon,
              tag: "STEP 3 · 실제 서버",
              t: "호스팅",
              d: "사이트 파일이 실제로 들어가 있는 건물(서버). HS WEB, Cloudflare 등이 여기 해당합니다.",
              bullet: "호스팅이 발급한 주소가 필요",
            },
          ].map((c) => (
            <div key={c.t} className="p-6 rounded-[16px] border border-[var(--c-line)] bg-white hover:border-[var(--c-text)] transition-colors">
              <div className="-mx-2 mb-4">
                <c.Icon />
              </div>
              <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[var(--c-main)] mb-2">{c.tag}</p>
              <h4 className="text-[18px] font-bold text-[var(--c-text)] tracking-tight mb-2">{c.t}</h4>
              <p className="text-[13px] text-[var(--c-sub)] leading-[1.75] mb-4">{c.d}</p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--c-bg-1)] border border-[var(--c-line)] text-[11px] font-semibold text-[var(--c-text-2)]">
                <svg className="w-3 h-3 text-[var(--c-main)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                {c.bullet}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* BEFORE / AFTER */}
      <Section
        overline="BEFORE / AFTER"
        title="이렇게 바뀝니다"
        subtitle="도메인 이름은 그대로, '어디로 보낼지'만 바뀐다는 점에 주목하세요."
      >
        <div className="p-6 md:p-7 rounded-[16px] border border-[var(--c-line)] bg-white">
          <BeforeAfterDiagram />
        </div>
      </Section>

      {/* PREP CHECKLIST */}
      <Section
        overline="PREPARE · 시작 전 준비물"
        title="이 세 가지만 준비하세요"
        subtitle="시작 전에 이것만 챙기면 변경 작업은 5분이면 끝납니다."
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-4 items-center">
          <div className="max-w-[400px] mx-auto w-full">
            <ChecklistIllustration />
          </div>
          <div className="space-y-3">
            {[
              {
                n: "01",
                t: "도메인 등록업체 로그인 정보",
                d: "도메인을 산 곳(가비아·후이즈·호스팅케이알·카페24 등)의 아이디·비밀번호. 어디서 샀는지 모르겠다면 결제 영수증·신용카드 내역을 확인해보세요.",
              },
              {
                n: "02",
                t: "이전할 호스팅의 네임서버 주소 2개",
                d: "Cloudflare 같은 새 호스팅 대시보드에 표시되는 두 개의 ns 주소(예: xxx.ns.cloudflare.com). 이 두 줄을 메모장에 복사해두세요.",
              },
              {
                n: "03",
                t: "기존 DNS 레코드 백업 (선택)",
                d: "메일·서브도메인·인증 TXT 등을 쓰고 있었다면 등록업체 DNS 화면을 캡처해두세요. 변경 후 새 호스팅에 동일하게 다시 등록해야 끊김이 없습니다.",
              },
            ].map((c) => (
              <div key={c.n} className="flex gap-4 p-5 rounded-[14px] border border-[var(--c-line)] bg-white">
                <span className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-[8px] bg-[var(--c-text)] text-white text-[12px] font-bold tnum">
                  {c.n}
                </span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[14px] font-bold text-[var(--c-text)] mb-1 tracking-tight">{c.t}</h4>
                  <p className="text-[12.5px] text-[var(--c-sub)] leading-[1.7]">{c.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* KEY RULE — where to change */}
      <Section>
        <div className="p-6 md:p-8 rounded-[18px] bg-[var(--c-bg-1)] border border-[var(--c-line)]">
          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-5 items-start">
            <span className="shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-[12px] bg-white border border-[var(--c-line)]">
              <svg className="w-6 h-6 text-[var(--c-main)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
            </span>
            <div>
              <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[var(--c-main)] mb-2">KEY · 가장 자주 헷갈리는 점</p>
              <h3 className="text-[18px] md:text-[20px] font-bold tracking-tight text-[var(--c-text)] mb-2 leading-[1.4]">
                네임서버는 <strong>"도메인 산 곳"</strong>에서만 바꿀 수 있어요. 호스팅 업체가 아닙니다.
              </h3>
              <p className="text-[13.5px] text-[var(--c-text-2)] leading-[1.75]">
                새로 옮길 호스팅 업체는 "이런 네임서버로 바꿔주세요"라는 정보를 안내해줄 뿐, 직접 변경하지 못합니다.
                예를 들어 도메인은 가비아에서 사고 호스팅은 Cloudflare로 옮긴다면 → <strong>가비아 관리 페이지</strong>에서 네임서버를 Cloudflare의 ns 주소로 바꿉니다.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* JUMP NAV */}
      <Section overline="REGISTRARS" title="등록업체별 절차 바로가기" subtitle="아래에서 도메인을 산 등록업체를 선택해 절차를 확인하세요.">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {REGISTRARS.map((r) => (
            <a
              key={r.slug}
              href={`#${r.slug}`}
              className="flex flex-col items-center justify-center gap-1 px-3 py-4 rounded-[10px] border border-[var(--c-line)] bg-white hover:border-[var(--c-text)] hover:bg-[var(--c-bg-1)] no-underline transition-all"
            >
              <span className="text-[14px] font-bold text-[var(--c-text)]">{r.name}</span>
              <span className="text-[11px] text-[var(--c-sub)] tnum">{r.websiteLabel}</span>
            </a>
          ))}
        </div>
      </Section>

      {/* PER REGISTRAR */}
      {REGISTRARS.map((r) => (
        <Section
          key={r.slug}
          overline={r.websiteLabel.toUpperCase()}
          title={r.name}
          subtitle={r.summary}
        >
          <div id={r.slug} className="scroll-mt-20 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-3">
            {/* Steps */}
            <div className="p-6 md:p-7 rounded-[16px] border border-[var(--c-line)] bg-white">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 pb-5 border-b border-[var(--c-line)]">
                <div className="min-w-0">
                  <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[var(--c-main)] mb-1.5">메뉴 경로</p>
                  <p className="text-[13px] text-[var(--c-text-2)] leading-[1.6] break-keep">{r.menuPath}</p>
                </div>
                <a
                  href={r.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="self-start shrink-0 inline-flex items-center gap-1.5 h-9 px-3.5 rounded-[8px] bg-[var(--c-bg-1)] border border-[var(--c-line)] text-[12px] font-semibold text-[var(--c-text-2)] no-underline hover:bg-[var(--c-bg-2)] hover:border-[var(--c-text)] transition-colors"
                >
                  사이트
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              </div>

              <ol className="list-none m-0 p-0 space-y-4">
                {r.steps.map((s, i) => (
                  <li key={s.n} className="flex gap-4">
                    <div className="shrink-0 flex flex-col items-center">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[var(--c-text)] text-white text-[12px] font-bold tnum">
                        {s.n}
                      </span>
                      {i < r.steps.length - 1 && <span className="flex-1 w-px bg-[var(--c-line)] mt-1.5" />}
                    </div>
                    <div className="flex-1 pb-2">
                      <h4 className="text-[14.5px] font-bold text-[var(--c-text)] mb-1.5 tracking-tight">{s.title}</h4>
                      <p className="text-[13px] text-[var(--c-sub)] leading-[1.7]">{s.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Cautions + Propagation + Sources */}
            <div className="space-y-3">
              {/* Cautions */}
              <div className="p-6 rounded-[14px] border border-[var(--c-line)] bg-[var(--c-bg-1)]">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white border border-[var(--c-line)]">
                    <svg className="w-3 h-3 text-[var(--c-text-2)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                  </span>
                  <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[var(--c-text-2)]">주의사항</p>
                </div>
                <ul className="list-none m-0 p-0 space-y-2">
                  {r.cautions.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-[12.5px] text-[var(--c-text-2)] leading-[1.7]">
                      <span className="w-1 h-1 rounded-full bg-[var(--c-sub-2)] shrink-0 mt-2" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Propagation */}
              <div className="p-6 rounded-[14px] border border-[var(--c-line)] bg-white">
                <div className="flex items-center gap-2 mb-2.5">
                  <svg className="w-4 h-4 text-[var(--c-main)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[var(--c-main)]">전파 시간</p>
                </div>
                <p className="text-[12.5px] text-[var(--c-text-2)] leading-[1.7]">{r.propagation}</p>
              </div>

              {/* Sources */}
              {r.sources.length > 0 && (
                <div className="p-6 rounded-[14px] border border-[var(--c-line)] bg-white">
                  <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[var(--c-sub)] mb-3">공식 문서</p>
                  <ul className="list-none m-0 p-0 space-y-2">
                    {r.sources.map((s, i) => (
                      <li key={i}>
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[12.5px] text-[var(--c-text-2)] no-underline hover:text-[var(--c-main)] transition-colors"
                        >
                          <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                          </svg>
                          {s.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </Section>
      ))}

      {/* AFTER CHANGE */}
      <Section
        overline="AFTER CHANGE · 변경 후"
        title="변경 직후 사이트가 안 떠도 정상이에요"
        subtitle="네임서버는 즉시 바뀌지만, 전 세계 사용자에게 그 정보가 퍼지는 데는 시간이 걸립니다."
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4 items-start">
          {/* Propagation map */}
          <div className="p-5 md:p-6 rounded-[16px] border border-[var(--c-line)] bg-white">
            <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[var(--c-main)] mb-1.5">DNS PROPAGATION · 전 세계 전파</p>
            <h4 className="text-[16px] font-bold text-[var(--c-text)] mb-3 tracking-tight">변경한 정보가 점점 퍼져 나갑니다</h4>
            <PropagationMap />
            <p className="text-[12.5px] text-[var(--c-sub)] leading-[1.7] mt-3">
              ISP·통신사마다 DNS 캐시 보유 시간이 다르기 때문에, 일부 사용자에게는 옛 서버, 일부에게는 새 서버로 연결되는 혼재 상태가 잠시 발생할 수 있습니다.
            </p>
          </div>

          {/* Checker tools */}
          <div className="space-y-3">
            <p className="text-[12px] font-bold tracking-[0.14em] uppercase text-[var(--c-text-2)] px-1">제대로 바뀌었는지 확인하는 법</p>
            {[
              {
                t: "dnschecker.org",
                d: "전 세계 주요 지역의 DNS 캐시 상태를 한 번에 확인. 도메인 입력 후 NS 타입으로 조회합니다.",
                url: "https://dnschecker.org",
                emoji: "🌍",
              },
              {
                t: "whois.kisa.or.kr",
                d: "한국인터넷진흥원(KISA) 검색에서 현재 등록된 네임서버를 확인할 수 있습니다.",
                url: "https://whois.kisa.or.kr",
                emoji: "🔎",
              },
              {
                t: "터미널 명령어",
                d: "PC 터미널에서 dig ns yourdomain.com 또는 nslookup -type=ns yourdomain.com으로 확인.",
                url: "",
                emoji: "⌨️",
              },
            ].map((c) => (
              <div key={c.t} className="p-5 rounded-[14px] border border-[var(--c-line)] bg-white">
                <div className="flex items-start gap-3">
                  <span className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-[10px] bg-[var(--c-bg-1)] border border-[var(--c-line)] text-[16px]">
                    {c.emoji}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[14px] font-bold text-[var(--c-text)] mb-1 tracking-tight">{c.t}</h4>
                    <p className="text-[12.5px] text-[var(--c-sub)] leading-[1.7]">{c.d}</p>
                    {c.url && (
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-2 text-[12px] font-semibold text-[var(--c-main)] no-underline hover:underline tnum"
                      >
                        {c.url.replace(/^https?:\/\//, "")}
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section overline="FAQ" title="자주 묻는 질문">
        <div className="border-t border-[var(--c-line)]">
          {[
            {
              q: "도메인을 산 등록업체와 호스팅 업체가 다르면 어디서 바꿔요?",
              a: "반드시 도메인을 산 등록업체(가비아·후이즈 등)의 관리 페이지에서 바꿔야 합니다. 호스팅 업체에서는 네임서버를 변경할 수 없으며, 호스팅 업체는 '이런 네임서버로 바꿔주세요'라는 정보만 제공합니다.",
            },
            {
              q: "네임서버를 바꾸면 메일이 끊기나요?",
              a: "기존 메일이 같은 등록업체의 DNS에 의존하고 있었다면 끊깁니다. 변경 전 MX·SPF·DKIM 같은 메일 관련 레코드를 새 DNS에 미리 동일하게 등록해 두어야 끊김 없이 전환됩니다.",
            },
            {
              q: "변경 후 바로 사이트가 새 호스팅으로 연결되나요?",
              a: "아니요. DNS 전파에는 시간이 걸려, 보통 수십 분~수 시간 내 일부 지역부터 반영되고 전 세계 캐시에 완전히 퍼지는 데는 최대 24~48시간이 걸립니다. 전파 중에는 일부 사용자에게 옛 서버, 일부에게 새 서버로 접속되는 혼재 상태가 발생할 수 있습니다.",
            },
            {
              q: "1·2차만 입력해도 되나요?",
              a: "네, 최소 2개의 권한 있는 네임서버만 입력하면 정상 동작합니다. Cloudflare를 비롯한 대부분의 호스팅이 2개를 제공하며, 등록업체 화면에 3·4차 칸이 있어도 비워두면 됩니다.",
            },
            {
              q: "변경이 거부되는 경우는 어떤 상황인가요?",
              a: "도메인이 잠금(Transfer Lock·clientTransferProhibited) 상태이거나, 만료일이 임박하거나, 분쟁 중인 도메인은 네임서버 변경이 거부됩니다. 도메인 잠금 해제·갱신을 먼저 진행한 뒤 다시 시도하세요.",
            },
            {
              q: "외부 도메인을 HS WEB에 연결하려면 어떻게 하나요?",
              a: "HS WEB은 Cloudflare 터널 기반으로 동작하기 때문에 도메인의 네임서버를 Cloudflare가 안내한 두 개의 ns 주소로 변경한 뒤, Cloudflare 대시보드에서 CNAME 레코드를 추가하면 됩니다. 자세한 절차는 개별 상담 시 안내드립니다.",
            },
          ].map((item, i) => (
            <details key={i} className="border-b border-[var(--c-line)] group">
              <summary className="flex items-start justify-between py-5 cursor-pointer list-none gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-[13px] font-bold text-[var(--c-main)] tnum mt-0.5">Q{i + 1}</span>
                  <span className="text-[15px] font-semibold text-[var(--c-text)] leading-[1.5]">{item.q}</span>
                </div>
                <svg className="w-5 h-5 text-[var(--c-sub)] shrink-0 group-open:rotate-180 transition-transform mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </summary>
              <div className="pb-5 pl-7 sm:pl-[40px] text-[14px] text-[var(--c-sub)] leading-[1.75]">{item.a}</div>
            </details>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="p-8 md:p-10 rounded-[18px] bg-[var(--c-text)] text-white text-center">
          <p className="text-[11px] font-bold text-white/60 tracking-[0.15em] uppercase mb-3">CONTACT</p>
          <h3 className="text-[24px] md:text-[30px] font-bold tracking-tight mb-3">네임서버 변경, 어렵게 느껴지시나요?</h3>
          <p className="text-[14px] text-white/70 leading-[1.7] mb-7 max-w-[560px] mx-auto">
            HS WEB과 진행하시는 프로젝트라면 네임서버 변경부터 DNS 레코드 이전까지 함께 도와드립니다.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-[10px] bg-white text-[var(--c-text)] font-bold text-[14px] no-underline hover:bg-[var(--c-bg-2)] transition-colors"
            >
              상담 신청
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href="/domain-hosting"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-[10px] bg-white/10 text-white font-bold text-[14px] no-underline hover:bg-white/15 transition-colors border border-white/15"
            >
              도메인·호스팅 정보 보기
            </Link>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}
