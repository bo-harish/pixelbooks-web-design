import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddBankAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: {
    ifsc: string;
    bankName: string;
    branch: string;
    accountHolder: string;
    accountNumber: string;
  } | null;
  onAdd?: (account: {
    ifsc: string;
    bankName: string;
    branch: string;
    accountHolder: string;
    accountNumber: string;
  }) => void;
}

export function AddBankAccountDialog({ open, onOpenChange, initialData, onAdd }: AddBankAccountDialogProps) {
  const [ifsc, setIfsc] = useState(initialData?.ifsc || "");
  const [bankName, setBankName] = useState(initialData?.bankName || "");
  const [branch, setBranch] = useState(initialData?.branch || "");
  const [accountHolder, setAccountHolder] = useState(initialData?.accountHolder || "");
  const [accountNumber, setAccountNumber] = useState(initialData?.accountNumber || "");
  const [confirmAccountNumber, setConfirmAccountNumber] = useState(initialData?.accountNumber || "");
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [showConfirmNumber, setShowConfirmNumber] = useState(false);

  // Update state when dialog is reopened with new or no initialData
  useEffect(() => {
    if (open) {
      setIfsc(initialData?.ifsc || "");
      setBankName(initialData?.bankName || "");
      setBranch(initialData?.branch || "");
      setAccountHolder(initialData?.accountHolder || "");
      setAccountNumber(initialData?.accountNumber || "");
      setConfirmAccountNumber(initialData?.accountNumber || "");
    }
  }, [open, initialData]);

  const handleAdd = () => {
    onAdd?.({
      ifsc,
      bankName,
      branch,
      accountHolder,
      accountNumber,
    });
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden border-0">
        <div className="bg-card rounded-lg p-8">
          <DialogHeader className="mb-8">
            <DialogTitle className="text-2xl font-semibold text-foreground">
              {initialData ? "Edit Bank Account" : "Add Bank Account"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* IFSC Code */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                IFSC Code
                <span className="text-destructive ml-0.5">*</span>
              </Label>
              <Input
                placeholder="Enter IFSC Code"
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value)}
                className="h-14 px-4 text-base border border-input rounded-lg"
              />
            </div>

            {/* Bank Name */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                Bank Name
                <span className="text-destructive ml-0.5">*</span>
              </Label>
              <Input
                placeholder="Search Bank Name"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="h-14 px-4 text-base border border-input rounded-lg"
              />
            </div>

            {/* Bank Branch */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                Bank Branch
                <span className="text-destructive ml-0.5">*</span>
              </Label>
              <Input
                placeholder="Search Branch Name"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="h-14 px-4 text-base border border-input rounded-lg"
              />
            </div>

            {/* Account Holder Name */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                Account Holder Name
                <span className="text-destructive ml-0.5">*</span>
              </Label>
              <Input
                placeholder="Enter Account Holder Name"
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                className="h-14 px-4 text-base border border-input rounded-lg"
              />
            </div>

            {/* Bank Account Number */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                Bank Account Number
                <span className="text-destructive ml-0.5">*</span>
              </Label>
              <div className="relative">
                <Input
                  type={showAccountNumber ? "text" : "password"}
                  placeholder="Enter Account Number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="h-14 px-4 pr-12 text-base border border-input rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowAccountNumber((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showAccountNumber ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Account Number */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                Confirm Account Number
                <span className="text-destructive ml-0.5">*</span>
              </Label>
              <div className="relative">
                <Input
                  type={showConfirmNumber ? "text" : "password"}
                  placeholder="Confirm Account Number"
                  value={confirmAccountNumber}
                  onChange={(e) => setConfirmAccountNumber(e.target.value)}
                  className="h-14 px-4 pr-12 text-base border border-input rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmNumber((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmNumber ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 mt-8 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-card px-6 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex h-11 items-center justify-center rounded-lg px-6 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{
                backgroundColor: "var(--brand)",
                color: "var(--brand-contrast)",
              }}
            >
              {initialData ? "Save Changes" : "Add Account"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
