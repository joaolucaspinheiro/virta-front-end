import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, Search, Tag, Trash2 } from "lucide-react";
import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory,
} from "@/services/categoryService";
import type { Category } from "@/types/category";
import type { TransactionType } from "@/types/transaction";
import { Modal } from "@/components/ui/modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DEFAULT_COLOR = "#4f46e5";

type Filter = "ALL" | TransactionType;

export function CategoriesPage() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [type, setType] = useState<TransactionType>("EXPENSE");
  const [color, setColor] = useState(DEFAULT_COLOR);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<Filter>("ALL");

  async function load() {
    try {
      setCategories(await listCategories());
    } catch (err) {
      fail(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function fail(err: unknown) {
    toast.error(
      err instanceof Error ? err.message : t("login.messages.generic_error"),
    );
  }

  function resetForm() {
    setName("");
    setType("EXPENSE");
    setColor(DEFAULT_COLOR);
  }

  function openCreate() {
    setEditingId(null);
    resetForm();
    setModalOpen(true);
  }

  function openEdit(cat: Category) {
    setEditingId(cat.id);
    setName(cat.name);
    setType(cat.type);
    setColor(cat.color ?? DEFAULT_COLOR);
    setModalOpen(true);
  }

  function handleModalChange(open: boolean) {
    setModalOpen(open);
    if (!open) {
      setEditingId(null);
      resetForm();
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    const payload = { name: name.trim(), type, color };
    try {
      if (editingId != null) {
        await updateCategory(editingId, payload);
        toast.success(t("app.categories.updated"));
      } else {
        await createCategory(payload);
        toast.success(t("app.categories.created"));
      }
      handleModalChange(false);
      await load();
    } catch (err) {
      fail(err);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm(t("app.categories.confirm_delete"))) return;
    try {
      await deleteCategory(id);
      toast.success(t("app.categories.deleted"));
      await load();
    } catch (err) {
      fail(err);
    }
  }

  const inputClass =
    "h-10 w-full px-3 rounded-lg border border-zinc-200 outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10";
  const editing = editingId != null;

  const filtered = categories.filter(
    (c) =>
      (filterType === "ALL" || c.type === filterType) &&
      c.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            {t("app.categories.title")}
          </h1>
          <p className="text-sm text-zinc-600">{t("app.categories.subtitle")}</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 rounded-lg px-4 h-10 font-semibold text-white transition-all hover:shadow-lg cursor-pointer"
          style={{ background: "var(--gradient-primary)" }}
        >
          <Plus className="h-4 w-4" />
          {t("app.categories.new")}
        </button>
      </header>

      {loading ? (
        <div className="grid place-items-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
        </div>
      ) : categories.length === 0 ? (
        <div className="grid place-items-center gap-2 rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center">
          <Tag className="h-8 w-8 text-zinc-300" />
          <p className="text-sm text-zinc-500">{t("app.categories.empty")}</p>
        </div>
      ) : (
        <>
          {/* Filters: search by name + type */}
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("app.categories.search_placeholder")}
                className="h-10 w-full rounded-lg border border-zinc-200 pl-9 pr-3 outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
              />
            </div>
            <div className="sm:w-48">
              <Select
                value={filterType}
                onValueChange={(v) => setFilterType(v as Filter)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">
                    {t("app.categories.filter_all")}
                  </SelectItem>
                  <SelectItem value="INCOME">
                    {t("app.categories.income")}
                  </SelectItem>
                  <SelectItem value="EXPENSE">
                    {t("app.categories.expense")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="py-10 text-center text-sm text-zinc-500">
              {t("app.categories.no_results")}
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((cat) => {
                const c = cat.color ?? "#71717a";
                return (
                  <div
                    key={cat.id}
                    className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4"
                  >
                    <span
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-lg"
                      style={{ backgroundColor: `${c}1a` }}
                    >
                      <Tag className="h-4 w-4" style={{ color: c }} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-zinc-900">
                        {cat.name}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {cat.type === "INCOME"
                          ? t("app.categories.income")
                          : t("app.categories.expense")}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => openEdit(cat)}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 cursor-pointer"
                      aria-label={t("app.categories.edit_action")}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(cat.id)}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-red-500 hover:bg-red-50 cursor-pointer"
                      aria-label={t("app.categories.confirm_delete")}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      <Modal
        open={modalOpen}
        onOpenChange={handleModalChange}
        title={editing ? t("app.categories.edit") : t("app.categories.new")}
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-700">
              {t("app.categories.name")}
            </span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("app.categories.name_placeholder")}
              className={inputClass}
              autoFocus
            />
          </label>
          <div className="grid grid-cols-[1fr_auto] gap-3">
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-zinc-700">
                {t("app.categories.type")}
              </span>
              <Select
                value={type}
                onValueChange={(v) => setType(v as TransactionType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EXPENSE">
                    {t("app.categories.expense")}
                  </SelectItem>
                  <SelectItem value="INCOME">
                    {t("app.categories.income")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-zinc-700">
                {t("app.categories.color")}
              </span>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-10 w-14 cursor-pointer rounded-lg border border-zinc-200"
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="mt-1 h-10 w-full rounded-lg px-5 font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50 cursor-pointer"
            style={{ background: "var(--gradient-primary)" }}
          >
            {submitting
              ? t("login.actions.loading")
              : editing
                ? t("app.categories.save")
                : t("app.categories.add")}
          </button>
        </form>
      </Modal>
    </div>
  );
}
