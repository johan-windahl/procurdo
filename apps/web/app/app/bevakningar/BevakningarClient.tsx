"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { useSearchPreferences } from "@/components/app/providers/SearchPreferencesProvider";
import { useToast } from "@/components/ui/toast";
import {
  filtersToQueryString,
  monitorFrequencyLabel,
  summarizeFilters,
} from "@/lib/search/utils";
import { Play, Edit, Trash2, Eye, Pause, Play as PlayIcon, Search } from "lucide-react";

const dateFormatter = new Intl.DateTimeFormat("sv-SE", { dateStyle: "medium", timeStyle: "short" });

const formatDateTime = (iso?: string) => {
  if (!iso) return "–";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return dateFormatter.format(date);
};

export function BevakningarClient() {
  const router = useRouter();
  const { push } = useToast();
  const { monitors, savedSearches, addMonitor, updateMonitor, deleteMonitor, toggleMonitorStatus } = useSearchPreferences();

  const sortedMonitors = useMemo(
    () => [...monitors].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [monitors],
  );

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(sortedMonitors.length / pageSize));
  const paginatedMonitors = sortedMonitors.slice((page - 1) * pageSize, page * pageSize);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    savedSearchId: "",
    frequency: "daily" as "daily" | "weekly",
  });

  const [monitorForm, setMonitorForm] = useState({
    savedSearchId: savedSearches[0]?.id ?? "",
    frequency: "daily" as "daily" | "weekly",
  });

  useEffect(() => {
    if (!monitorForm.savedSearchId && savedSearches.length > 0) {
      setMonitorForm((prev) => ({ ...prev, savedSearchId: savedSearches[0]!.id }));
    }
  }, [savedSearches, monitorForm.savedSearchId]);

  useEffect(() => {
    setPage(1);
  }, [sortedMonitors.length]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const openEdit = (id: string) => {
    const monitor = monitors.find((item) => item.id === id);
    if (!monitor) return;
    setEditForm({
      savedSearchId: monitor.savedSearchId,
      frequency: monitor.frequency,
    });
    setEditingId(id);
  };

  const closeEdit = () => {
    setEditingId(null);
  };

  const handleUpdate = () => {
    if (!editingId) return;
    const monitor = monitors.find((item) => item.id === editingId);
    if (!monitor) return;
    const search = savedSearches.find((item) => item.id === editForm.savedSearchId);
    const derivedName = search ? `${search.name} (${monitorFrequencyLabel[editForm.frequency]})` : monitor.name;
    updateMonitor(editingId, {
      savedSearchId: editForm.savedSearchId,
      frequency: editForm.frequency,
      name: derivedName,
    });
    setEditingId(null);
    push({ title: "Bevakning uppdaterad" });
  };

  const handleDelete = (id: string) => {
    const monitor = monitors.find((item) => item.id === id);
    if (!monitor) return;
    const confirmed = window.confirm(`Ta bort bevakningen "${monitor.name}"?`);
    if (!confirmed) return;
    deleteMonitor(id);
    push({ title: "Bevakning borttagen" });
  };

  const handleToggle = (id: string) => {
    const monitor = monitors.find((item) => item.id === id);
    if (!monitor) return;
    toggleMonitorStatus(id);
    push({ title: monitor.status === "active" ? "Bevakning pausad" : "Bevakning återupptagen" });
  };

  const handleRun = (savedSearchId: string) => {
    const search = savedSearches.find((item) => item.id === savedSearchId);
    if (!search) return;
    const query = filtersToQueryString(search.filters);
    router.push(`/app/sok${query}`);
  };

  const handleCreateMonitor = () => {
    if (!monitorForm.savedSearchId) {
      push({ title: "Välj sparad sökning", description: "Du behöver välja en sparad sökning", variant: "warning" });
      return;
    }
    const selectedSavedSearch = savedSearches.find((s) => s.id === monitorForm.savedSearchId);
    const monitor = addMonitor({
      name: `${selectedSavedSearch?.name || "Bevakning"} (${monitorFrequencyLabel[monitorForm.frequency]})`,
      savedSearchId: monitorForm.savedSearchId,
      frequency: monitorForm.frequency,
    });
    setCreateModalOpen(false);
    setMonitorForm((prev) => ({ ...prev, savedSearchId: monitor.savedSearchId }));
    push({ title: "Bevakning skapad" });
  };

  const selectedSavedSearch = savedSearches.find((s) => s.id === monitorForm.savedSearchId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold">Bevakningar</h1>
            <p className="text-sm text-muted-foreground">
              Överblicka dina bevakningar, pausa tillfälligt eller uppdatera intervall och underliggande sökning.
            </p>
          </div>
          <Button
            onClick={() => setCreateModalOpen(true)}
            disabled={savedSearches.length === 0}
            title={savedSearches.length === 0 ? "Du behöver spara en sökning först" : undefined}
          >
            Skapa bevakning
          </Button>
        </div>
      </div>

      {sortedMonitors.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card/40 p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Du har inga bevakningar än. Spara först en sökning och skapa sedan din första bevakning med knappen ovan.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/60 text-left text-sm font-medium text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Namn</th>
                <th className="px-4 py-3">Status</th>
                <th className="hidden md:table-cell px-4 py-3">Frekvens</th>
                <th className="hidden md:table-cell px-4 py-3">Senaste körning</th>
                <th className="px-4 py-3 text-right">Åtgärder</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70 text-sm">
              {paginatedMonitors.map((monitor) => {
                const baseSearch = savedSearches.find((item) => item.id === monitor.savedSearchId);
                const isExpanded = expandedId === monitor.id;
                const isEditing = editingId === monitor.id;
                const filterSummary = baseSearch ? summarizeFilters(baseSearch.filters) : [];

                if (isEditing) {
                  return (
                    <tr key={monitor.id}>
                      <td colSpan={5} className="px-4 py-6">
                        <div className="space-y-6">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <label className="text-sm font-medium" htmlFor={`edit-saved-search-${monitor.id}`}>
                                Baserad på
                              </label>
                              <Select
                                id={`edit-saved-search-${monitor.id}`}
                                value={editForm.savedSearchId}
                                onChange={(e) => setEditForm((prev) => ({ ...prev, savedSearchId: e.target.value }))}
                              >
                                {savedSearches.map((search) => (
                                  <option key={search.id} value={search.id}>
                                    {search.name}
                                  </option>
                                ))}
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium" htmlFor={`edit-frequency-${monitor.id}`}>
                                Frekvens
                              </label>
                              <Select
                                id={`edit-frequency-${monitor.id}`}
                                value={editForm.frequency}
                                onChange={(e) =>
                                  setEditForm((prev) => ({ ...prev, frequency: e.target.value as "daily" | "weekly" }))
                                }
                              >
                                <option value="daily">Dagligen</option>
                                <option value="weekly">Veckovis</option>
                              </Select>
                            </div>
                          </div>
                          {savedSearches.length > 0 ? (
                            <div className="rounded-md border bg-muted/40 p-3 text-sm">
                              <p className="font-medium text-foreground">Filteröversikt</p>
                              <ul className="mt-2 flex flex-wrap gap-2">
                                {summarizeFilters(
                                  savedSearches.find((search) => search.id === editForm.savedSearchId)?.filters ??
                                  savedSearches[0]!.filters,
                                ).map((item) => (
                                  <li
                                    key={`${editForm.savedSearchId}-${item.label}`}
                                    className="rounded-full bg-card px-3 py-1 text-xs text-muted-foreground"
                                  >
                                    <span className="font-medium text-foreground">{item.label}:</span> {item.value}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : null}
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" type="button" onClick={closeEdit}>
                              Avbryt
                            </Button>
                            <Button type="button" onClick={handleUpdate}>
                              Spara ändringar
                            </Button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                }

                return [
                  <tr key={monitor.id} className="hover:bg-muted/40">
                    <td className="px-4 py-3 align-top">
                      <div className="font-medium text-foreground">{monitor.name}</div>
                      <p className="text-xs text-muted-foreground">Baserad på: {baseSearch?.name ?? "Sökning borttagen"}</p>
                    </td>
                    <td className="px-4 py-3 align-center w-16">
                      <div
                        className={`h-5 w-5 rounded-full ${monitor.status === "active" ? "bg-emerald-500" : "bg-amber-500"
                          }`}
                      />
                    </td>
                    <td className="hidden md:table-cell px-4 py-3 align-top text-muted-foreground">
                      {monitorFrequencyLabel[monitor.frequency]}
                    </td>
                    <td className="hidden md:table-cell px-4 py-3 align-top text-muted-foreground">{formatDateTime(monitor.lastRunAt)}</td>
                    <td className="px-4 py-3 align-top">
                      <div className="grid grid-cols-2 gap-2 md:flex md:justify-end">
                        {baseSearch ? (
                          <Button variant="ghost" size="sm" type="button" onClick={() => handleRun(baseSearch.id)}>
                            <Search className="md:hidden" />
                            <span className="hidden md:inline">Öppna sökning</span>
                          </Button>
                        ) : null}
                        <Button
                          variant="ghost"
                          size="sm"
                          type="button"
                          onClick={() => setExpandedId((prev) => (prev === monitor.id ? null : monitor.id))}
                        >
                          <Eye className="md:hidden" />
                          <span className="hidden md:inline">{isExpanded ? "Dölj resultat" : "Visa senaste resultat"}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          type="button"
                          onClick={() => (isEditing ? closeEdit() : openEdit(monitor.id))}
                        >
                          <Edit className="md:hidden" />
                          <span className="hidden md:inline">Redigera</span>
                        </Button>
                        <Button
                          className="md:w-20"
                          variant="ghost"
                          size="sm"
                          type="button"
                          onClick={() => handleToggle(monitor.id)}
                        >
                          {monitor.status === "active" ? (
                            <>
                              <Pause className="h-20 w-20 md:hidden" />
                              <span className="hidden md:inline">Pausa</span>
                            </>
                          ) : (
                            <>
                              <PlayIcon className="h-20 w-20 md:hidden" />
                              <span className="hidden md:inline">Återuppta</span>
                            </>
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          type="button"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(monitor.id)}
                        >
                          <Trash2 className="md:hidden" />
                          <span className="hidden md:inline">Ta bort</span>
                        </Button>
                      </div>
                    </td>
                  </tr>,
                  ...(isExpanded ? [
                    <tr key={`${monitor.id}-expanded`}>
                      <td colSpan={5} className="px-4 py-4">
                        <div className="space-y-4 rounded-xl border border-dashed bg-muted/20 p-4">
                          <h3 className="text-sm font-semibold text-foreground">Senaste resultat</h3>
                          {monitor.latestNotices && monitor.latestNotices.length > 0 ? (
                            <ul className="space-y-3">
                              {monitor.latestNotices.slice(0, 5).map((notice) => (
                                <li key={notice.publicationNumber} className="rounded-lg border bg-background p-4">
                                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="space-y-1">
                                      <h4 className="text-sm font-semibold text-foreground">
                                        {notice.documentUrl ? (
                                          <a href={notice.documentUrl} target="_blank" rel="noreferrer" className="hover:underline">
                                            {notice.title}
                                          </a>
                                        ) : (
                                          notice.title
                                        )}
                                      </h4>
                                      <p className="text-xs text-muted-foreground">
                                        {notice.buyerName} • Publicerad {notice.publicationDate}
                                      </p>
                                    </div>
                                    <span className="text-xs text-muted-foreground sm:text-right">
                                      {notice.publicationNumber}
                                    </span>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-muted-foreground">Inga resultat att visa ännu.</p>
                          )}
                        </div>
                      </td>
                    </tr>
                  ] : [])
                ];
              })}
            </tbody>
          </table>
        </div>
      )
      }

      {
        sortedMonitors.length > pageSize ? (
          <div className="flex items-center justify-between rounded-lg border bg-card px-4 py-3 text-sm text-muted-foreground">
            <span>
              Visar {Math.min((page - 1) * pageSize + 1, sortedMonitors.length)}–
              {Math.min(page * pageSize, sortedMonitors.length)} av {sortedMonitors.length}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Föregående
              </Button>
              <span>
                Sida {page} / {totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Nästa
              </Button>
            </div>
          </div>
        ) : null
      }

      <Modal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Skapa bevakning"
        description="Välj sparad sökning och hur ofta vi ska skicka nya träffar."
        footer={
          <>
            <Button variant="ghost" type="button" onClick={() => setCreateModalOpen(false)}>
              Avbryt
            </Button>
            <Button type="button" onClick={handleCreateMonitor} disabled={!monitorForm.savedSearchId}>
              Skapa bevakning
            </Button>
          </>
        }
      >
        {monitorForm.savedSearchId ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="monitor-search">
                Baserad på
              </label>
              <Select
                id="monitor-search"
                value={monitorForm.savedSearchId}
                onChange={(e) => setMonitorForm((prev) => ({ ...prev, savedSearchId: e.target.value }))}
              >
                {savedSearches.map((search) => (
                  <option key={search.id} value={search.id}>
                    {search.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="monitor-frequency">
                  Frekvens
                </label>
                <Select
                  id="monitor-frequency"
                  value={monitorForm.frequency}
                  onChange={(e) =>
                    setMonitorForm((prev) => ({ ...prev, frequency: e.target.value as "daily" | "weekly" }))
                  }
                >
                  <option value="daily">Dagligen</option>
                  <option value="weekly">Veckovis</option>
                </Select>
              </div>
            </div>
            {selectedSavedSearch ? (
              <div className="rounded-md border bg-muted/40 p-3 text-sm">
                <p className="font-medium text-foreground">Filteröversikt</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {summarizeFilters(selectedSavedSearch.filters).map((item) => (
                    <li key={`${selectedSavedSearch.id}-${item.label}`} className="rounded-full bg-card px-3 py-1 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{item.label}:</span> {item.value}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Du behöver spara en sökning innan du kan skapa bevakningar.
          </p>
        )}
      </Modal>
    </div >
  );
}
