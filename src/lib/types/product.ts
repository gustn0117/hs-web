/** 하온이 파는 것. 관리자에서 등록하고 고객센터에서 보인다. */
export interface Product {
  id: string;
  name: string;
  tagline: string | null;
  description: string | null;
  /** 상담 후 정하는 상품은 비어 있다. price_note 가 그 자리를 메운다. */
  price: number | null;
  price_note: string | null;
  category: string;
  features: string[];
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

/** 고객이 「이거 해주세요」 누른 것. */
export interface ProductRequest {
  id: string;
  client_id: string;
  product_id: string | null;
  /** 상품이 지워지거나 이름이 바뀌어도 신청 당시 이름이 남아야 한다. */
  product_name: string;
  message: string | null;
  status: ProductRequestStatus;
  created_at: string;
  updated_at: string;
}

export type ProductRequestStatus = "new" | "contacted" | "done" | "cancelled";

export const REQUEST_STATUS_LABEL: Record<ProductRequestStatus, string> = {
  new: "새 신청",
  contacted: "연락함",
  done: "완료",
  cancelled: "취소",
};

export const PRODUCT_CATEGORIES = ["제작", "유지보수", "마케팅", "호스팅", "기타"] as const;
