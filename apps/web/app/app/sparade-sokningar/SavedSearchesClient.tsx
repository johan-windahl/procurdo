"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SearchForm } from "@/components/ui/search/SearchForm";
import { useSearchPreferences } from "@/components/app/providers/SearchPreferencesProvider";
import { useToast } from "@/components/ui/toast";
import { filtersToQueryString, summarizeFilters } from "@/lib/search/utils";
import type { Filters } from "@/lib/search/types";

const dateFormatter = new Intl.DateTimeFormat("sv-SE", { dateStyle: "medium" });

const formatDate = (iso?: string) => {
  if (!iso) return "–";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return dateFormatter.format(date);
};

export function SavedSearchesClient() {
  const router = useRouter();
  const { push } = useToast();
  const { savedSearches, updateSavedSearch, deleteSavedSearch } = useSearchPreferences();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", description: "", filters: {} as Filters });

  const sortedSearches = useMemo(
    () => [...savedSearches].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [savedSearches],
  );
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(sortedSearches.length / pageSize));
  const paginatedSearches = sortedSearches.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage(1);
  }, [sortedSearches.length]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const startEdit = (id: string) => {
    const search = savedSearches.find((item) => item.id === id);
    if (!search) return;
    setEditingId(id);
    setEditForm({
      name: search.name,
      description: search.description ?? "",
      filters: {
        ...search.filters,
        cpvs: [...search.filters.cpvs],
      },
    });
  };

  const handleUpdate = () => {
    if (!editingId) return;
    updateSavedSearch(editingId, {
      name: editForm.name.trim(),
      description: editForm.description.trim() ? editForm.description.trim() : undefined,
      filters: editForm.filters,
    });
    setEditingId(null);
    push({ title: "Sökning uppdaterad" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    const search = savedSearches.find((item) => item.id === id);
    if (!search) return;
    const confirmed = window.confirm(`Ta bort "${search.name}"? Denna åtgärd går inte att ångra.`);
    if (!confirmed) return;
    deleteSavedSearch(id);
    push({ title: "Sökning borttagen" });
  };

  const handleRun = (id: string) => {
    const search = savedSearches.find((item) => item.id === id);
    if (!search) return;
    const query = filtersToQueryString(search.filters);
    router.push(`/app/sok${query}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Sparade sökningar</h1>
        <p className="text-sm text-muted-foreground">
          Hantera sparade filterset för upphandlingar. Kör dem direkt eller redigera namn, beskrivning och sökfilter direkt i tabellen.
        </p>
      </div>

      {sortedSearches.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card/40 p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Du har inte sparat några sökningar ännu. Gå till sökflödet för att skapa din första.
          </p>
          <Button
            className="mt-4"
            variant="outline"
            type="button"
            onClick={() => router.push("/app/sok")}
          >
            Öppna sökflödet
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/60 text-left text-sm font-medium text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Namn</th>
                <th className="px-4 py-3">Skapad</th>
                <th className="px-4 py-3">Filter</th>
                <th className="px-4 py-3 text-right">Åtgärder</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70 text-sm">
              {paginatedSearches.map((search) => {
                const isEditing = editingId === search.id;
                const summary = summarizeFilters(search.filters);
                const visible = summary.slice(0, 3);
                const remaining = summary.length - visible.length;

                if (isEditing) {
                  return (
                    <tr key={search.id}>
                      <td colSpan={4} className="px-4 py-6">
                        <div className="space-y-6">
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium" htmlFor={`edit-name-${search.id}`}>
                                Namn
                              </label>
                              <Input
                                id={`edit-name-${search.id}`}
                                value={editForm.name}
                                onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium" htmlFor={`edit-description-${search.id}`}>
                                Beskrivning
                              </label>
                              <Textarea
                                id={`edit-description-${search.id}`}
                                value={editForm.description}
                                onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                                placeholder="Valfritt"
                              />
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="border-t pt-4">
                              <h3 className="text-sm font-medium mb-3">Sökfilter</h3>
                              <SearchForm
                                key={editingId}
                                initial={editForm.filters}
                                onSearch={(filters) => setEditForm((prev) => ({ ...prev, filters }))}
                              />
                            </div>
                          </div>

                          <div className="flex justify-end gap-2 pt-4 border-t">
                            <Button variant="ghost" type="button" onClick={handleCancelEdit}>
                              Avbryt
                            </Button>
                            <Button type="button" onClick={handleUpdate} disabled={!editForm.name.trim()}>
                              Spara ändringar
                            </Button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={search.id} className="hover:bg-muted/40">
                    <td className="px-4 py-3 align-top">
                      <div className="font-medium text-foreground">{search.name}</div>
                      {search.description ? (
                        <p className="text-xs text-muted-foreground">{search.description}</p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 align-top text-muted-foreground">{formatDate(search.createdAt)}</td>
                    <td className="px-4 py-3 align-top">
                      <div className="flex flex-wrap gap-2">
                        {visible.map((item) => (
                          <span key={`${search.id}-${item.label}`} className="rounded-full bg-accent/40 px-3 py-1 text-xs text-muted-foreground">
                            <span className="font-medium text-foreground">{item.label}:</span> {item.value}
                          </span>
                        ))}
                        {remaining > 0 ? (
                          <span className="rounded-full bg-accent/20 px-3 py-1 text-xs text-muted-foreground">+{remaining} fler</span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" type="button" onClick={() => handleRun(search.id)}>
                          Kör
                        </Button>
                        <Button variant="ghost" size="sm" type="button" onClick={() => startEdit(search.id)}>
                          Redigera
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          type="button"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(search.id)}
                        >
                          Ta bort
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {sortedSearches.length > pageSize ? (
        <div className="flex items-center justify-between rounded-lg border bg-card px-4 py-3 text-sm text-muted-foreground">
          <span>
            Visar {Math.min((page - 1) * pageSize + 1, sortedSearches.length)}–
            {Math.min(page * pageSize, sortedSearches.length)} av {sortedSearches.length}
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
      ) : null}

    </div>
  );
}
