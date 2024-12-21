export interface UrlInterface {
  url: string;
  short: string;
  owner : string;
  redirects: number;
  created_at: string;
}

export interface CreateUrlPayload {
  url: string;
}