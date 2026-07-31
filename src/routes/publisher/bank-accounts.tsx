import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  Landmark,
  Building2,
  Copy,
  Check,
  AlertCircle,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AddBankAccountDialog } from "@/components/add-bank-account-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/publisher/bank-accounts")({
  head: () => ({
    meta: [
      { title: "Bank Accounts — PixelBooks" },
      { name: "description", content: "Manage your bank accounts for royalty payouts." },
      { property: "og:title", content: "Bank Accounts — PixelBooks" },
      { property: "og:description", content: "Manage your bank accounts for royalty payouts." },
    ],
  }),
  component: BankAccountsPage,
});

type BankAccount = {
  id: string;
  accountHolder: string;
  accountNumber: string;
  ifsc: string;
  bankName: string;
  branch: string;
  isActive: boolean;
};

const seed: BankAccount[] = [
  {
    id: "ba1",
    accountHolder: "PixelBooks LLC",
    accountNumber: "626705500430",
    ifsc: "ICIC0006267",
    bankName: "ICICI BANK LIMITED",
    branch: "KOTTAYAM",
    isActive: true,
  },
  {
    id: "ba2",
    accountHolder: "PixelBooks Publishing",
    accountNumber: "987654321012",
    ifsc: "HDFC0001234",
    bankName: "HDFC BANK LIMITED",
    branch: "ERNAKULAM",
    isActive: false,
  },
];

function BankAccountsPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>(seed);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [removeId, setRemoveId] = useState<string | null>(null);
  const [setDefaultId, setSetDefaultId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [lastRemoved, setLastRemoved] = useState<{
    account: BankAccount;
    index: number;
  } | null>(null);

  const accountToRemove = removeId ? (accounts.find((acc) => acc.id === removeId) ?? null) : null;
  const accountToEdit = editingId ? (accounts.find((acc) => acc.id === editingId) ?? null) : null;
  const accountToSetDefault = setDefaultId
    ? (accounts.find((acc) => acc.id === setDefaultId) ?? null)
    : null;

  const handleAddOrEdit = (data: {
    ifsc: string;
    bankName: string;
    branch: string;
    accountHolder: string;
    accountNumber: string;
  }) => {
    if (editingId) {
      setAccounts((prev) =>
        prev.map((acc) =>
          acc.id === editingId ? { ...acc, ...data } : acc
        )
      );
    } else {
      const newAccount: BankAccount = {
        id: `ba${Date.now()}`,
        accountHolder: data.accountHolder,
        accountNumber: data.accountNumber,
        ifsc: data.ifsc,
        bankName: data.bankName,
        branch: data.branch,
        isActive: accounts.length === 0,
      };
      setAccounts((prev) => [...prev, newAccount]);
    }
    setEditingId(null);
  };

  const handleConfirmSetDefault = () => {
    if (!accountToSetDefault) return;
    setAccounts((prev) =>
      prev.map((acc) => ({
        ...acc,
        isActive: acc.id === accountToSetDefault.id,
      }))
    );
    setSetDefaultId(null);
  };

  const handleConfirmRemove = () => {
    if (!accountToRemove) return;
    setAccounts((prev) => {
      const idx = prev.findIndex((acc) => acc.id === accountToRemove.id);
      if (idx < 0) return prev;
      setLastRemoved({ account: accountToRemove, index: idx });
      const filtered = prev.filter((acc) => acc.id !== accountToRemove.id);
      if (accountToRemove.isActive && filtered.length > 0) {
        filtered[0].isActive = true;
      }
      return filtered;
    });
    setRemoveId(null);
  };

  const handleUndoRemove = () => {
    if (!lastRemoved) return;
    setAccounts((prev) => {
      const next = [...prev];
      const safeIndex = Math.min(Math.max(lastRemoved.index, 0), next.length);
      next.splice(safeIndex, 0, lastRemoved.account);
      return next;
    });
    setLastRemoved(null);
  };

  const handleCopyNumber = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <AppShell title="Bank Accounts" subtitle="Manage your bank accounts for royalty payouts.">
      <div className="space-y-6 p-4 md:p-8">
        {/* Header Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">Your Bank Accounts</h2>
            <p className="text-sm text-muted-foreground">
              Configure and manage primary bank accounts for automatic royalty payouts.
            </p>
          </div>
        </div>

        {/* Dialogs */}
        <AddBankAccountDialog
          open={dialogOpen || Boolean(editingId)}
          onOpenChange={(open) => {
            if (!open) {
              setDialogOpen(false);
              setEditingId(null);
            }
          }}
          initialData={accountToEdit}
          onAdd={handleAddOrEdit}
        />

        {/* Confirmation Modal for Set as Default */}
        <AlertDialog
          open={Boolean(accountToSetDefault)}
          onOpenChange={(open) => !open && setSetDefaultId(null)}
        >
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <CheckCircle2 className="text-[var(--brand)]" size={20} />
                Set as default bank account?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm pt-2">
                Are you sure you want to set{" "}
                <span className="font-semibold text-foreground">
                  {accountToSetDefault?.bankName} ({accountToSetDefault?.accountHolder})
                </span>{" "}
                as your default account for royalty payouts? All future payouts will be automatically transferred to this account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-4">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmSetDefault}
                style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
              >
                Set as Default
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Confirmation Modal for Remove */}
        <AlertDialog
          open={Boolean(accountToRemove)}
          onOpenChange={(open) => !open && setRemoveId(null)}
        >
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                <AlertCircle size={20} />
                Remove bank account?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm pt-2">
                Are you sure you want to remove{" "}
                <span className="font-semibold text-foreground">
                  {accountToRemove?.bankName} ({accountToRemove?.accountHolder})
                </span>{" "}
                from your account list?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-4">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmRemove}
                style={{ backgroundColor: "var(--danger)", color: "white" }}
              >
                Remove Account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Bank Accounts Grid */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {accounts.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-border bg-card p-12 text-center shadow-2xs">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground mb-4">
                <Landmark size={28} />
              </div>
              <h3 className="text-lg font-bold text-foreground">No bank accounts added yet</h3>
              <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
                Add your bank account details to start receiving automatic monthly royalty payouts.
              </p>
              <button
                onClick={() => setDialogOpen(true)}
                className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold shadow-sm transition-opacity hover:opacity-90"
                style={{ backgroundColor: "var(--brand)", color: "var(--brand-contrast)" }}
              >
                <Plus size={16} />
                Add New Bank Account
              </button>
            </div>
          )}

          {accounts.map((acc) => (
            <div
              key={acc.id}
              className={`rounded-2xl border bg-card p-6 transition-all duration-200 hover:shadow-md flex flex-col justify-between relative ${acc.isActive
                ? "border-[var(--brand)] ring-1 ring-[var(--brand)]/30 shadow-xs"
                : "border-border hover:border-border/80"
                }`}
            >
              <div>
                {/* Header Badge */}
                <div className="mb-5 flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary/80 text-[var(--brand)] border border-border/50">
                      <Building2 size={20} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-base font-bold text-foreground leading-tight truncate">
                        {acc.bankName}
                      </h4>
                      <p className="text-xs text-muted-foreground font-medium truncate mt-0.5">
                        {acc.branch} Branch
                      </p>
                    </div>
                  </div>

                  {acc.isActive && (
                    <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                      <CheckCircle2 size={13} />
                      Default Account
                    </span>
                  )}
                </div>

                {/* Account Details Box */}
                <div className="space-y-3 rounded-xl bg-secondary/30 border border-border/50 p-4">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block mb-0.5">
                      Account Holder Name
                    </span>
                    <span className="text-sm font-bold text-foreground block">
                      {acc.accountHolder}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/40">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block mb-0.5">
                        Account Number
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono font-bold text-foreground">
                          •••• {acc.accountNumber.slice(-4)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyNumber(acc.id, acc.accountNumber)}
                          className="text-muted-foreground hover:text-foreground transition-colors p-0.5"
                          title="Copy account number"
                        >
                          {copiedId === acc.id ? (
                            <Check size={12} className="text-emerald-500" />
                          ) : (
                            <Copy size={12} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block mb-0.5">
                        IFSC Code
                      </span>
                      <span className="text-xs font-mono font-bold text-foreground uppercase">
                        {acc.ifsc}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-6 flex flex-wrap items-center gap-2 pt-2 border-t border-border/40">
                {!acc.isActive && (
                  <button
                    type="button"
                    onClick={() => setSetDefaultId(acc.id)}
                    className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-3 text-xs font-semibold text-foreground transition-all hover:bg-secondary hover:border-border/80"
                  >
                    <CheckCircle2 size={14} className="text-muted-foreground" />
                    Set as default account
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setEditingId(acc.id)}
                  className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-3.5 text-xs font-semibold text-foreground transition-all hover:bg-secondary"
                >
                  <Pencil size={13} />
                  Edit
                </button>
                {!acc.isActive && (
                  <button
                    type="button"
                    onClick={() => setRemoveId(acc.id)}
                    className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-3.5 text-xs font-medium text-muted-foreground transition-colors hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 size={13} />
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Add New Account Card Button */}
          {accounts.length > 0 && (
            <button
              type="button"
              onClick={() => setDialogOpen(true)}
              className="flex min-h-[260px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card/40 p-6 text-center transition-all hover:border-[var(--brand)] hover:bg-secondary/40 group"
            >
              <span
                className="flex h-13 w-13 items-center justify-center rounded-2xl transition-transform group-hover:scale-105"
                style={{
                  backgroundColor: "color-mix(in oklch, var(--brand) 12%, transparent)",
                  color: "var(--brand)",
                }}
              >
                <Plus size={24} />
              </span>
              <div>
                <p className="text-sm font-bold text-foreground group-hover:text-[var(--brand)] transition-colors">
                  Add New Bank Account
                </p>
                <p className="mt-1 text-xs text-muted-foreground max-w-[200px] mx-auto">
                  Add another bank account for receiving royalty payouts.
                </p>
              </div>
            </button>
          )}
        </div>

        {/* Undo Floating Notification */}
        {lastRemoved && (
          <div className="fixed bottom-6 right-6 z-50 rounded-xl border border-border bg-card p-4 shadow-xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2">
            <div>
              <p className="text-xs font-semibold text-foreground">Bank account removed</p>
              <p className="text-[11px] text-muted-foreground">{lastRemoved.account.bankName}</p>
            </div>
            <button
              onClick={handleUndoRemove}
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[var(--sidebar-highlight)] transition-colors"
              style={{ color: "var(--brand)" }}
            >
              Undo
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
