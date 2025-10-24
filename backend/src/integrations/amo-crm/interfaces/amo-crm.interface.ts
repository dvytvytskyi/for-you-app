export interface AmoAuthResponse {
  token_type: string;
  expires_in: number;
  access_token: string;
  refresh_token: string;
}

export interface AmoLead {
  id?: number;
  name: string;
  price?: number;
  status_id?: number;
  pipeline_id?: number;
  responsible_user_id?: number;
  created_at?: number;
  updated_at?: number;
  custom_fields_values?: AmoCustomField[];
  _embedded?: {
    contacts?: Array<{ id: number }>;
    companies?: Array<{ id: number }>;
  };
}

export interface AmoContact {
  id?: number;
  name: string;
  first_name?: string;
  last_name?: string;
  responsible_user_id?: number;
  created_at?: number;
  updated_at?: number;
  custom_fields_values?: AmoCustomField[];
  _embedded?: {
    leads?: Array<{ id: number }>;
    companies?: Array<{ id: number }>;
    tags?: Array<{ id: number; name: string }>;
  };
}

export interface AmoCustomField {
  field_id: number;
  field_name?: string;
  field_code?: string;
  field_type?: string;
  values: Array<{
    value: string | number;
    enum_id?: number;
    enum_code?: string;
  }>;
}

export interface AmoWebhookPayload {
  leads?: {
    status?: Array<{
      id: number;
      status_id: number;
      pipeline_id: number;
      old_status_id?: number;
    }>;
    add?: Array<{ id: number }>;
    update?: Array<{ id: number }>;
    delete?: Array<{ id: number }>;
  };
  contacts?: {
    add?: Array<{ id: number }>;
    update?: Array<{ id: number }>;
  };
  tasks?: {
    add?: Array<{ id: number }>;
    update?: Array<{ id: number }>;
    delete?: Array<{ id: number }>;
  };
  account?: {
    id: string;
    subdomain: string;
  };
}

export interface AmoPipeline {
  id: number;
  name: string;
  sort: number;
  is_main: boolean;
  is_unsorted_on: boolean;
  is_archive: boolean;
  account_id: number;
  _links?: {
    self: {
      href: string;
    };
  };
  _embedded?: {
    statuses?: AmoStatus[];
  };
}

export interface AmoStatus {
  id: number;
  name: string;
  sort: number;
  is_editable: boolean;
  pipeline_id: number;
  color: string | null;
  type: number;
  account_id: number;
}

export interface AmoUser {
  id: number;
  name: string;
  email: string;
  lang: string;
  rights: any;
  _links?: {
    self: {
      href: string;
    };
  };
  _embedded?: {
    roles?: AmoUserRole[];
    groups?: AmoUserGroup[];
  };
}

export interface AmoUserRole {
  id: number;
  name: string;
  rights?: any;
  _links?: {
    self: {
      href: string;
    };
  };
  _embedded?: {
    users?: number[];
  };
}

export interface AmoUserGroup {
  id: number;
  name: string;
}

export interface AmoTask {
  id?: number;
  text: string;
  task_type_id?: number;
  complete_till: number;
  is_completed?: boolean;
  responsible_user_id?: number;
  entity_id?: number;
  entity_type?: string;
  duration?: number;
  result?: {
    text?: string;
  };
  created_by?: number;
  updated_by?: number;
  created_at?: number;
  updated_at?: number;
  group_id?: number;
  account_id?: number;
}

