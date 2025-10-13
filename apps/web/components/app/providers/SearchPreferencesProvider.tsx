"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type {
  Filters,
  Notice,
  SavedSearch,
  SearchMonitor,
  MonitorFrequency,
  MonitorRange,
} from "@/lib/search/types";
import { normalizeFilters } from "@/lib/search/utils";

type SavedSearchInput = {
  name: string;
  description?: string;
  filters: Filters;
};

type SavedSearchUpdate = Partial<Omit<SavedSearchInput, "filters">> & {
  filters?: Filters;
};

type MonitorInput = {
  name: string;
  savedSearchId: string;
  frequency: MonitorFrequency;
  timeOfDay: string;
  relativeRange: MonitorRange;
  customRangeDays?: number;
};

type MonitorUpdate = Partial<Omit<MonitorInput, "savedSearchId">> & {
  savedSearchId?: string;
  lastRunAt?: string;
  status?: SearchMonitor["status"];
};

type SearchPreferencesContextValue = {
  savedSearches: SavedSearch[];
  monitors: SearchMonitor[];
  addSavedSearch: (input: SavedSearchInput) => SavedSearch;
  updateSavedSearch: (id: string, update: SavedSearchUpdate) => void;
  deleteSavedSearch: (id: string) => void;
  addMonitor: (input: MonitorInput) => SearchMonitor;
  updateMonitor: (id: string, update: MonitorUpdate) => void;
  deleteMonitor: (id: string) => void;
  toggleMonitorStatus: (id: string) => void;
  setMonitorNotices: (id: string, notices: Notice[]) => void;
};

const SearchPreferencesContext = createContext<SearchPreferencesContextValue | null>(null);

const randomId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `id-${Math.random().toString(16).slice(2, 10)}`;

const sampleNotices: Notice[] = [
  {
    publicationNumber: "2024/S 102-320111",
    publicationDate: "2024-09-18",
    deadlineDate: "2024-10-20",
    title: "IT-konsulttjänster för digitalisering av leverantörskedjor",
    buyerName: "Stockholms Stad",
    buyerCity: "Stockholm",
    country: "Sverige",
    documentUrl: "https://example.com/it-konsult",
    value: "4 500 000",
    valueCurrency: "SEK",
    classification: "72222300",
    noticeType: "Contract Notice",
    procedureType: "Open",
    frameworkAgreement: true,
    contractNature: "services",
  },
  {
    publicationNumber: "2024/S 098-302045",
    publicationDate: "2024-09-03",
    deadlineDate: "2024-09-30",
    title: "Ramavtal för byggservice i Skåne",
    buyerName: "Region Skåne",
    buyerCity: "Malmö",
    country: "Sverige",
    documentUrl: "https://example.com/byggservice",
    value: "12 000 000",
    valueCurrency: "SEK",
    classification: "45262690",
    noticeType: "Contract Notice",
    procedureType: "Restricted",
    frameworkAgreement: true,
    contractNature: "works",
  },
  {
    publicationNumber: "2024/S 085-265901",
    publicationDate: "2024-08-21",
    deadlineDate: "2024-09-15",
    title: "Upphandling av molnbaserade HR-system",
    buyerName: "Göteborgs Stad",
    buyerCity: "Göteborg",
    country: "Sverige",
    documentUrl: "https://example.com/hr-system",
    value: "8 800 000",
    valueCurrency: "SEK",
    classification: "72261000",
    noticeType: "Contract Notice",
    procedureType: "Competitive procedure with negotiation",
    frameworkAgreement: false,
    contractNature: "services",
  },
  {
    publicationNumber: "2024/S 079-249991",
    publicationDate: "2024-08-12",
    deadlineDate: "2024-09-05",
    title: "Leverans av skyddsutrustning till vård- och omsorg",
    buyerName: "Region Västra Götaland",
    buyerCity: "Göteborg",
    country: "Sverige",
    documentUrl: "https://example.com/skyddsutrustning",
    value: "6 100 000",
    valueCurrency: "SEK",
    classification: "33140000",
    noticeType: "Contract Notice",
    procedureType: "Open",
    frameworkAgreement: false,
    contractNature: "supplies",
  },
  {
    publicationNumber: "2024/S 061-188521",
    publicationDate: "2024-07-25",
    deadlineDate: "2024-08-28",
    title: "Förstudie för hållbarhetsrådgivning",
    buyerName: "Vinnova",
    country: "Sverige",
    documentUrl: "https://example.com/hallbarhet",
    value: "2 200 000",
    valueCurrency: "SEK",
    classification: "90713000",
    noticeType: "Contract Notice",
    procedureType: "Open",
    frameworkAgreement: false,
    contractNature: "services",
  },
];

const initialSavedSearches: SavedSearch[] = [
  {
    id: "ss-1",
    name: "IT-konsulter Stockholm",
    description: "Aktuella projekt för digitalisering och systemutveckling",
    filters: {
      cpvs: ["7222300"],
      text: "it konsult",
      dateFrom: "2024-06-01",
      deadlineTo: "",
      country: "SE",
      city: "Stockholm",
      status: "ongoing",
      noticeType: "Contract Notice",
      valueMin: "",
      valueMax: "",
    },
    createdAt: "2024-07-12T08:30:00.000Z",
    lastRunAt: "2024-09-18T06:00:00.000Z",
  },
  {
    id: "ss-2",
    name: "Byggservice Skåne",
    description: "Underhåll och mindre byggprojekt i regionen",
    filters: {
      cpvs: ["45262690"],
      text: "byggservice",
      dateFrom: "2024-05-01",
      deadlineTo: "",
      country: "SE",
      city: "Malmö",
      status: "ongoing",
      noticeType: "Contract Notice",
      valueMin: "2000000",
      valueMax: "",
    },
    createdAt: "2024-06-03T10:15:00.000Z",
    lastRunAt: "2024-09-17T05:30:00.000Z",
  },
  {
    id: "ss-3",
    name: "HR-system offentlig sektor",
    description: "SaaS-lösningar för HR och personaladministration",
    filters: {
      cpvs: ["72261000"],
      text: "hr system",
      dateFrom: "2024-04-01",
      deadlineTo: "",
      country: "SE",
      city: "",
      status: "ongoing",
      noticeType: "Contract Notice",
      valueMin: "",
      valueMax: "10000000",
    },
    createdAt: "2024-05-22T07:45:00.000Z",
    lastRunAt: "2024-09-16T07:15:00.000Z",
  },
];

const initialMonitors: SearchMonitor[] = [
  {
    id: "mon-1",
    name: "Daglig IT-bevakning",
    savedSearchId: "ss-1",
    frequency: "daily",
    timeOfDay: "08:00",
    relativeRange: "24h",
    createdAt: "2024-07-12T09:00:00.000Z",
    lastRunAt: "2024-09-18T08:00:00.000Z",
    status: "active",
    latestNotices: sampleNotices.slice(0, 3),
  },
  {
    id: "mon-2",
    name: "Veckovis bygguppföljning",
    savedSearchId: "ss-2",
    frequency: "weekly",
    timeOfDay: "07:30",
    relativeRange: "7d",
    createdAt: "2024-06-05T11:20:00.000Z",
    lastRunAt: "2024-09-16T07:30:00.000Z",
    status: "paused",
    latestNotices: sampleNotices.slice(1, 4),
  },
];

export function SearchPreferencesProvider({ children }: { children: React.ReactNode }) {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(
    initialSavedSearches.map((item) => ({
      ...item,
      filters: normalizeFilters(item.filters),
    })),
  );
  const [monitors, setMonitors] = useState<SearchMonitor[]>(initialMonitors);

  const addSavedSearch = (input: SavedSearchInput): SavedSearch => {
    const nowIso = new Date().toISOString();
    const saved: SavedSearch = {
      id: randomId(),
      name: input.name,
      description: input.description,
      filters: normalizeFilters(input.filters),
      createdAt: nowIso,
      lastRunAt: undefined,
    };
    setSavedSearches((current) => [...current, saved]);
    return saved;
  };

  const updateSavedSearch = (id: string, update: SavedSearchUpdate) => {
    setSavedSearches((current) =>
      current.map((item) =>
        item.id === id
          ? {
            ...item,
            ...("filters" in update && update.filters ? { filters: normalizeFilters(update.filters) } : {}),
            ...(update.name ? { name: update.name } : {}),
            ...(update.description !== undefined ? { description: update.description } : {}),
            lastRunAt: item.lastRunAt,
          }
          : item,
      ),
    );
  };

  const deleteSavedSearch = (id: string) => {
    setSavedSearches((current) => current.filter((item) => item.id !== id));
    setMonitors((current) => current.filter((monitor) => monitor.savedSearchId !== id));
  };

  const addMonitor = (input: MonitorInput): SearchMonitor => {
    const nowIso = new Date().toISOString();
    const monitor: SearchMonitor = {
      id: randomId(),
      name: input.name,
      savedSearchId: input.savedSearchId,
      frequency: input.frequency,
      timeOfDay: input.timeOfDay,
      relativeRange: input.relativeRange,
      customRangeDays: input.customRangeDays,
      createdAt: nowIso,
      lastRunAt: undefined,
      status: "active",
      latestNotices: [],
    };
    setMonitors((current) => [...current, monitor]);
    return monitor;
  };

  const updateMonitor = (id: string, update: MonitorUpdate) => {
    setMonitors((current) =>
      current.map((monitor) =>
        monitor.id === id
          ? {
            ...monitor,
            ...(update.name ? { name: update.name } : {}),
            ...(update.savedSearchId ? { savedSearchId: update.savedSearchId } : {}),
            ...(update.frequency ? { frequency: update.frequency } : {}),
            ...(update.timeOfDay ? { timeOfDay: update.timeOfDay } : {}),
            ...(update.relativeRange ? { relativeRange: update.relativeRange } : {}),
            ...(update.customRangeDays !== undefined ? { customRangeDays: update.customRangeDays } : {}),
            ...(update.lastRunAt ? { lastRunAt: update.lastRunAt } : {}),
            ...(update.status ? { status: update.status } : {}),
          }
          : monitor,
      ),
    );
  };

  const deleteMonitor = (id: string) => {
    setMonitors((current) => current.filter((monitor) => monitor.id !== id));
  };

  const toggleMonitorStatus = (id: string) => {
    setMonitors((current) =>
      current.map((monitor) =>
        monitor.id === id
          ? {
            ...monitor,
            status: monitor.status === "active" ? "paused" : "active",
          }
          : monitor,
      ),
    );
  };

  const setMonitorNotices = (id: string, notices: Notice[]) => {
    setMonitors((current) =>
      current.map((monitor) =>
        monitor.id === id
          ? {
            ...monitor,
            latestNotices: notices,
          }
          : monitor,
      ),
    );
  };

  const value = useMemo<SearchPreferencesContextValue>(
    () => ({
      savedSearches,
      monitors,
      addSavedSearch,
      updateSavedSearch,
      deleteSavedSearch,
      addMonitor,
      updateMonitor,
      deleteMonitor,
      toggleMonitorStatus,
      setMonitorNotices,
    }),
    [savedSearches, monitors],
  );

  return <SearchPreferencesContext.Provider value={value}>{children}</SearchPreferencesContext.Provider>;
}

export function useSearchPreferences() {
  const ctx = useContext(SearchPreferencesContext);
  if (!ctx) {
    throw new Error("useSearchPreferences måste användas inom SearchPreferencesProvider");
  }
  return ctx;
}
