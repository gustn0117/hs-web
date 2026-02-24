export interface Client {
  id: string;
  username: string;
  password_hash: string;
  name: string;
  email: string | null;
  phone: string | null;
  memo: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type ClientPublic = Omit<Client, "password_hash">;

export interface Project {
  id: string;
  client_id: string;
  name: string;
  website_url: string | null;
  tech_stack: string | null;
  admin_url: string | null;
  admin_id: string | null;
  admin_pw: string | null;
  status: string;
  description: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Hosting {
  id: string;
  client_id: string;
  provider: string;
  plan: string | null;
  amount: number;
  billing_cycle: string;
  start_date: string;
  end_date: string | null;
  auto_renew: boolean;
  memo: string | null;
  created_at: string;
  updated_at: string;
}

export interface Domain {
  id: string;
  client_id: string;
  domain_name: string;
  registrar: string | null;
  registered_date: string | null;
  expires_date: string | null;
  auto_renew: boolean;
  nameservers: string | null;
  memo: string | null;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  client_id: string;
  amount: number;
  type: string;
  description: string | null;
  payment_date: string;
  status: string;
  memo: string | null;
  created_at: string;
  updated_at: string;
}
