import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  Plus,
  Trash2,
  ChevronRight,
  ArrowLeft,
  Calendar,
  HelpCircle,
  Award,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export const Route = createFileRoute("/pb-admin/quizzes-rewards")({
  head: () => ({
    meta: [
      { title: "Quiz & Rewards — PixelBooks Admin" },
      {
        name: "description",
        content: "Manage educational quizzes, reward points schedules, and gamified reader challenges.",
      },
    ],
  }),
  component: QuizzesRewardsPage,
});

export interface QuizItem {
  id: string;
  quizName: string;
  quizType: string; // e.g. "General", "eBook Quiz", "Publisher Quiz"
  duration: string; // e.g. "Jul 24 – Jul 31, 2026"
  startDate: string;
  endDate: string;
  rewardPoints: number;
  status: boolean;
  isExpired?: boolean;
}

const INITIAL_QUIZZES: QuizItem[] = [
  {
    id: "quiz-1",
    quizName: "General",
    quizType: "General",
    duration: "Jul 24 – Jul 31, 2026",
    startDate: "2026-07-24",
    endDate: "2026-07-31",
    rewardPoints: 500,
    status: true,
  },
  {
    id: "quiz-2",
    quizName: "eBook Quiz",
    quizType: "eBook Quiz",
    duration: "Jul 24 – Jul 31, 2026",
    startDate: "2026-07-24",
    endDate: "2026-07-31",
    rewardPoints: 1000,
    status: true,
  },
  {
    id: "quiz-3",
    quizName: "Spring Literature Trivia",
    quizType: "Author Trivia",
    duration: "Jan 01 – Mar 31, 2026",
    startDate: "2026-01-01",
    endDate: "2026-03-31",
    rewardPoints: 750,
    status: false,
    isExpired: true,
  },
];

const QUIZ_TYPES = [
  "Choose Quiz Type",
  "General",
  "eBook Quiz",
  "Publisher Quiz",
  "Author Trivia",
  "Reward Challenge",
];

export function QuizzesRewardsPage() {
  const [viewMode, setViewMode] = useState<"list" | "create">("list");
  const [quizzes, setQuizzes] = useState<QuizItem[]>(INITIAL_QUIZZES);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All Status" | "Active" | "Inactive" | "Expired">("All Status");

  // Active editing item (null = creating new quiz)
  const [editingQuiz, setEditingQuiz] = useState<QuizItem | null>(null);

  // Form State matching screenshot 2
  const [quizNameInput, setQuizNameInput] = useState("");
  const [quizTypeInput, setQuizTypeInput] = useState("Choose Quiz Type");
  const [rewardPointsInput, setRewardPointsInput] = useState("");
  const [startDateInput, setStartDateInput] = useState("2026-07-24");
  const [endDateInput, setEndDateInput] = useState("2026-07-31");

  // Filtered Quizzes
  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((q) => {
      // Status filter
      if (statusFilter === "Active" && (!q.status || q.isExpired)) return false;
      if (statusFilter === "Inactive" && (q.status || q.isExpired)) return false;
      if (statusFilter === "Expired" && !q.isExpired) return false;

      // Search filter
      if (!searchQuery.trim()) return true;
      const term = searchQuery.toLowerCase().trim();
      return (
        q.quizName.toLowerCase().includes(term) ||
        q.quizType.toLowerCase().includes(term)
      );
    });
  }, [quizzes, searchQuery, statusFilter]);

  // Toggle status
  const handleToggleStatus = (id: string) => {
    setQuizzes((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const next = !item.status;
          toast.success(`Quiz status updated to ${next ? "Active" : "Inactive"}`);
          return { ...item, status: next };
        }
        return item;
      })
    );
  };

  // Delete quiz
  const handleDeleteQuiz = (id: string, name: string) => {
    setQuizzes((prev) => prev.filter((item) => item.id !== id));
    toast.success(`Deleted quiz "${name}"`);
  };

  // Open Edit Quiz screen for clicked row
  const handleOpenEditQuiz = (item: QuizItem) => {
    setEditingQuiz(item);
    setQuizNameInput(item.quizName);
    setQuizTypeInput(item.quizType || "Choose Quiz Type");
    setRewardPointsInput(String(item.rewardPoints || "500"));
    setStartDateInput(item.startDate || "2026-07-24");
    setEndDateInput(item.endDate || "2026-07-31");
    setViewMode("create");
  };

  // Open Add New Quiz form
  const handleOpenAddNewQuiz = () => {
    setEditingQuiz(null);
    resetForm();
    setViewMode("create");
  };

  // Submit Save/Create Form
  const handleSaveQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizNameInput.trim()) {
      toast.error("Please enter a Quiz Name.");
      return;
    }

    const formatMonthDay = (dateStr: string) => {
      if (!dateStr) return "Jul 24";
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    const pts = parseInt(rewardPointsInput, 10) || 500;

    if (editingQuiz) {
      // Update existing item
      setQuizzes((prev) =>
        prev.map((q) =>
          q.id === editingQuiz.id
            ? {
              ...q,
              quizName: quizNameInput,
              quizType: quizTypeInput !== "Choose Quiz Type" ? quizTypeInput : "General",
              duration: `${formatMonthDay(startDateInput)} – ${formatMonthDay(endDateInput)}`,
              startDate: startDateInput,
              endDate: endDateInput,
              rewardPoints: pts,
            }
            : q
        )
      );
      toast.success(`Quiz "${quizNameInput}" updated successfully!`);
    } else {
      // Add new item
      const newQuiz: QuizItem = {
        id: `quiz-${Date.now()}`,
        quizName: quizNameInput,
        quizType: quizTypeInput !== "Choose Quiz Type" ? quizTypeInput : "General",
        duration: `${formatMonthDay(startDateInput)} – ${formatMonthDay(endDateInput)}`,
        startDate: startDateInput,
        endDate: endDateInput,
        rewardPoints: pts,
        status: true,
      };
      setQuizzes((prev) => [newQuiz, ...prev]);
      toast.success(`Quiz "${quizNameInput}" created successfully!`);
    }

    resetForm();
    setViewMode("list");
  };

  const resetForm = () => {
    setQuizNameInput("");
    setQuizTypeInput("Choose Quiz Type");
    setRewardPointsInput("");
    setStartDateInput("2026-07-24");
    setEndDateInput("2026-07-31");
    setEditingQuiz(null);
  };

  const pageTitle =
    viewMode === "create"
      ? editingQuiz
        ? `Edit Quiz — ${editingQuiz.quizName}`
        : "Create Quiz"
      : "Quiz";

  const pageSubtitle =
    viewMode === "create"
      ? "Configure quiz rules, reward point allocations, and campaign durations."
      : "Manage active quizzes, reader engagement trivia, and reward points distribution.";

  return (
    <AppShell title={pageTitle} subtitle={pageSubtitle}>
      <div className="p-4 sm:p-6 md:p-8 space-y-6 w-full">
        {viewMode === "list" ? (
          /* ========================================================================
           * MAIN QUIZ LISTING VIEW - FULL WIDTH (Matching Screenshot 1)
           * ======================================================================== */
          <>
            {/* Top Toolbar matching screenshot design */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-2xs w-full">
              {/* Search Box */}
              <label className="relative flex h-11 flex-1 items-center rounded-lg border border-border bg-card px-3.5 shadow-none transition-colors focus-within:border-[var(--brand)]">
                <Search size={16} className="mr-2 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </label>

              {/* Status Filter Dropdown & Create Quiz Button */}
              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex h-11 items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground hover:bg-secondary/40 focus:outline-none min-w-[130px] shadow-none cursor-pointer">
                    <span>{statusFilter}</span>
                    <ChevronDown size={16} className="text-muted-foreground shrink-0" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[140px] bg-card border-border shadow-md">
                    {(["All Status", "Active", "Inactive", "Expired"] as const).map((st) => (
                      <DropdownMenuItem
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        className={`cursor-pointer font-medium text-xs ${statusFilter === st ? "bg-[var(--sidebar-highlight)] text-[var(--brand)]" : ""
                          }`}
                      >
                        {st}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <button
                  onClick={handleOpenAddNewQuiz}
                  className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[var(--brand)] px-5 text-sm font-semibold text-white shadow-2xs transition-opacity hover:opacity-90 shrink-0 cursor-pointer"
                >
                  <Plus size={16} />
                  <span>Create Quiz</span>
                </button>
              </div>
            </div>

            {/* Quiz Table Container - Full Width */}
            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-2xs w-full">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground">
                      <th className="px-6 py-4 min-w-[200px]">Quiz Name</th>
                      <th className="px-6 py-4 whitespace-nowrap">Quiz Duration</th>
                      <th className="px-6 py-4 whitespace-nowrap">Status</th>
                      <th className="px-6 py-4 text-center whitespace-nowrap">Delete</th>
                      <th className="px-6 py-4 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredQuizzes.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <HelpCircle size={32} className="text-muted-foreground/60" />
                            <p className="font-medium text-sm">No quizzes found</p>
                            <p className="text-xs text-muted-foreground">
                              Click "+ Create Quiz" to launch your first quiz challenge.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredQuizzes.map((item) => (
                        <tr
                          key={item.id}
                          onClick={() => handleOpenEditQuiz(item)}
                          className="group cursor-pointer border-b border-border/60 transition-colors hover:bg-secondary/50"
                        >
                          {/* Quiz Name Plain Text Column */}
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-foreground text-sm">
                            {item.quizName}
                          </td>

                          {/* Quiz Duration Column */}
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-foreground text-sm">
                            {item.duration}
                          </td>

                          {/* Status Switch Toggle Column */}
                          <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                            <Switch
                              checked={item.status}
                              onCheckedChange={() => handleToggleStatus(item.id)}
                              className="data-[state=checked]:bg-[var(--brand)] shadow-xs"
                            />
                          </td>

                          {/* Delete Trash Icon Column */}
                          <td className="px-6 py-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => handleDeleteQuiz(item.id, item.quizName)}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                              title="Delete Quiz"
                            >
                              <Trash2 size={17} />
                            </button>
                          </td>

                          {/* Chevron Arrow Column */}
                          <td className="px-6 py-4 text-right">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors group-hover:bg-secondary group-hover:text-foreground">
                              <ChevronRight size={16} />
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Footer matching screenshot design */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-2 w-full">
              <div className="text-xs sm:text-sm text-foreground font-normal">
                Showing <span className="font-semibold">{filteredQuizzes.length}</span> from{" "}
                <span className="font-semibold">{filteredQuizzes.length}</span> results
              </div>

              <div className="flex items-center gap-1.5 self-center sm:self-auto text-xs sm:text-sm">
                <button
                  type="button"
                  disabled
                  className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-medium text-muted-foreground transition-colors opacity-40 pointer-events-none"
                >
                  « Previous
                </button>

                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-lg font-bold bg-[var(--sidebar-highlight)] text-[var(--brand)] border border-[var(--brand)]/30"
                >
                  1
                </button>

                <button
                  type="button"
                  disabled
                  className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-medium text-muted-foreground transition-colors opacity-40 pointer-events-none"
                >
                  Next »
                </button>
              </div>
            </div>
          </>
        ) : (
          /* ========================================================================
           * CREATE / EDIT QUIZ FORM VIEW (Matching Screenshot 2)
           * ======================================================================== */
          <div className="space-y-6 w-full">
            {/* Back Navigation Control Style matching Section 8 of style guide */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setViewMode("list");
                  setEditingQuiz(null);
                }}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer shadow-2xs"
                aria-label="Back to Quiz"
              >
                <ArrowLeft size={16} />
              </button>
              <span className="text-sm font-normal text-foreground">
                Back to Quiz
              </span>
            </div>

            {/* Main Form Wrapper */}
            <form onSubmit={handleSaveQuiz} className="space-y-6 w-full">
              {/* Card Container Box */}
              <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-2xs space-y-6 w-full">


                {/* Form 2-Column Grid matching screenshot 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  {/* Quiz Name */}
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Quiz Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={quizNameInput}
                      onChange={(e) => setQuizNameInput(e.target.value)}
                      placeholder="Enter Quiz Name"
                      className="w-full h-11 rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-[var(--brand)]"
                    />
                  </div>

                  {/* Quiz Type */}
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Quiz Type
                    </label>
                    <select
                      value={quizTypeInput}
                      onChange={(e) => setQuizTypeInput(e.target.value)}
                      className="w-full h-11 rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-[var(--brand)]"
                    >
                      {QUIZ_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Total Rewards points */}
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Total Rewards points <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={rewardPointsInput}
                      onChange={(e) => setRewardPointsInput(e.target.value)}
                      placeholder="Enter Reward Points"
                      className="w-full h-11 rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-[var(--brand)]"
                    />
                  </div>

                  {/* Start Date - End Date */}
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Start Date - End Date <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2 w-full">
                      <label className="relative flex h-11 flex-1 items-center rounded-lg border border-border bg-card px-3">
                        <input
                          type="date"
                          value={startDateInput}
                          onChange={(e) => setStartDateInput(e.target.value)}
                          className="w-full bg-transparent text-xs text-foreground outline-none cursor-pointer"
                        />
                      </label>
                      <span className="text-muted-foreground text-xs font-medium">to</span>
                      <label className="relative flex h-11 flex-1 items-center rounded-lg border border-border bg-card px-3">
                        <input
                          type="date"
                          value={endDateInput}
                          onChange={(e) => setEndDateInput(e.target.value)}
                          className="w-full bg-transparent text-xs text-foreground outline-none cursor-pointer"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Action Buttons - Outside Card Box */}
              <div className="flex items-center justify-end gap-3 pt-2 w-full">
                <button
                  type="button"
                  onClick={() => {
                    setViewMode("list");
                    setEditingQuiz(null);
                  }}
                  className="inline-flex h-11 items-center justify-center px-6 rounded-lg border border-border bg-card text-sm font-semibold text-foreground hover:bg-secondary transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center px-6 rounded-lg bg-[var(--brand)] text-white text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow-2xs"
                >
                  {editingQuiz ? "Save Quiz" : "Create Quiz"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AppShell>
  );
}
