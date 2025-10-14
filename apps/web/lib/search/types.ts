export type Filters = {
  cpvs: string[];
  text: string;
  dateFrom: string;
  deadlineTo?: string;
  country: string;
  city: string;
  noticeType?: string;
  valueMin?: number | string;
  valueMax?: number | string;
};

export type Notice = {
  publicationNumber: string;
  publicationDate: string;
  deadlineDate?: string;
  title: string;
  buyerName: string;
  buyerCity?: string;
  country?: string;
  documentUrl?: string;
  value?: string;
  valueCurrency?: string;
  description?: string;
  classification?: string;
  contractNature?: string;
  noticeType?: string;
  procedureType?: string;
  frameworkAgreement?: boolean;
};

export type SavedSearch = {
  id: string;
  name: string;
  description?: string;
  filters: Filters;
  createdAt: string;
  updatedAt?: string;
  lastRunAt?: string;
};

export type MonitorFrequency = "daily" | "weekly";

export type MonitorStatus = "active" | "paused";

export type SearchMonitor = {
  id: string;
  name: string;
  savedSearchId: string;
  frequency: MonitorFrequency;
  createdAt: string;
  lastRunAt?: string;
  status: MonitorStatus;
  latestNotices?: Notice[];
};
