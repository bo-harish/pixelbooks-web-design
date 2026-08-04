import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  Plus,
  Trash2,
  ChevronRight,
  ArrowLeft,
  CalendarDays,
  HelpCircle,
  X,
  CheckCircle2,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Switch } from "@/components/ui/switch";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { type DateRange } from "react-day-picker";
import { format, isValid, addDays, startOfMonth, endOfMonth } from "date-fns";
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

export interface QuestionItem {
  id: string;
  questionText: string;
  options: string[];
  correctOptionIndex?: number;
}

export interface QuizItem {
  id: string;
  quizName: string;
  quizType: string;
  duration: string;
  startDate: string;
  endDate: string;
  rewardPoints: number;
  status: boolean;
  isExpired?: boolean;
  questions?: QuestionItem[];
}

const INITIAL_QUIZZES: QuizItem[] = [
  {
    id: "quiz-1",
    quizName: "General",
    quizType: "General",
    duration: "31 Jul 2026 - 14 Aug 2026",
    startDate: "2026-07-31",
    endDate: "2026-08-14",
    rewardPoints: 32,
    status: true,
    questions: [
      {
        id: "q-1",
        questionText: "2+2",
        options: ["2", "4", "6", "8"],
        correctOptionIndex: 1,
      },
    ],
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
    questions: [],
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
    questions: [],
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

  // Form State matching screenshot 1
  const [quizNameInput, setQuizNameInput] = useState("");
  const [quizTypeInput, setQuizTypeInput] = useState("General");
  const [rewardPointsInput, setRewardPointsInput] = useState("32");
  const [startDateInput, setStartDateInput] = useState("2026-07-31");
  const [endDateInput, setEndDateInput] = useState("2026-08-14");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date("2026-07-31T00:00:00"),
    to: new Date("2026-08-14T00:00:00"),
  });

  // Quiz Questions state inside Edit / Add Quiz screen
  const [questions, setQuestions] = useState<QuestionItem[]>([]);

  // Add / Edit Question Modal dialog state matching screenshot 2
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [questionTextInput, setQuestionTextInput] = useState("");
  const [optionInputs, setOptionInputs] = useState<string[]>(["Option 1", "Option 2", "Option 3", "Option 4"]);
  const [selectedCorrectOption, setSelectedCorrectOption] = useState<number>(0);

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from) {
      const sStr = format(range.from, "yyyy-MM-dd");
      setStartDateInput(sStr);
    }
    if (range?.to) {
      const eStr = format(range.to, "yyyy-MM-dd");
      setEndDateInput(eStr);
    } else if (range?.from) {
      const sStr = format(range.from, "yyyy-MM-dd");
      setEndDateInput(sStr);
    }
  };

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

  const resetForm = () => {
    setQuizNameInput("");
    setQuizTypeInput("General");
    setRewardPointsInput("32");
    setStartDateInput("2026-07-31");
    setEndDateInput("2026-08-14");
    setDateRange({
      from: new Date("2026-07-31T00:00:00"),
      to: new Date("2026-08-14T00:00:00"),
    });
    setQuestions([]);
    setEditingQuiz(null);
  };

  // Open Edit Quiz screen for clicked row
  const handleOpenEditQuiz = (item: QuizItem) => {
    setEditingQuiz(item);
    setQuizNameInput(item.quizName);
    setQuizTypeInput(item.quizType || "General");
    setRewardPointsInput(String(item.rewardPoints || "32"));
    const sStr = item.startDate || "2026-07-31";
    const eStr = item.endDate || "2026-08-14";
    setStartDateInput(sStr);
    setEndDateInput(eStr);
    const fromD = new Date(sStr + "T00:00:00");
    const toD = new Date(eStr + "T00:00:00");
    setDateRange({
      from: isValid(fromD) ? fromD : undefined,
      to: isValid(toD) ? toD : undefined,
    });
    setQuestions(
      item.questions && item.questions.length > 0
        ? [...item.questions]
        : [
          {
            id: "q-1",
            questionText: "2+2",
            options: ["2", "4", "6", "8"],
            correctOptionIndex: 1,
          },
        ]
    );
    setViewMode("create");
  };

  // Open Add New Quiz form
  const handleOpenAddNewQuiz = () => {
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
      if (!dateStr) return "31 Jul 2026";
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    };

    const pts = parseInt(rewardPointsInput, 10) || 32;

    if (editingQuiz) {
      // Update existing item
      setQuizzes((prev) =>
        prev.map((q) =>
          q.id === editingQuiz.id
            ? {
              ...q,
              quizName: quizNameInput,
              quizType: quizTypeInput !== "Choose Quiz Type" ? quizTypeInput : "General",
              duration: `${formatMonthDay(startDateInput)} - ${formatMonthDay(endDateInput)}`,
              startDate: startDateInput,
              endDate: endDateInput,
              rewardPoints: pts,
              questions: [...questions],
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
        duration: `${formatMonthDay(startDateInput)} - ${formatMonthDay(endDateInput)}`,
        startDate: startDateInput,
        endDate: endDateInput,
        rewardPoints: pts,
        status: true,
        questions: [...questions],
      };
      setQuizzes((prev) => [newQuiz, ...prev]);
      toast.success(`Quiz "${quizNameInput}" created successfully!`);
    }

    resetForm();
    setViewMode("list");
  };

  // Question Modal actions matching screenshot 2
  const handleOpenAddQuestionModal = () => {
    setEditingQuestionId(null);
    setQuestionTextInput("");
    setOptionInputs(["Option 1", "Option 2", "Option 3", "Option 4"]);
    setSelectedCorrectOption(0);
    setIsQuestionModalOpen(true);
  };

  const handleOpenEditQuestionModal = (q: QuestionItem) => {
    setEditingQuestionId(q.id);
    setQuestionTextInput(q.questionText);
    setOptionInputs(
      q.options && q.options.length === 4
        ? [...q.options]
        : ["Option 1", "Option 2", "Option 3", "Option 4"]
    );
    setSelectedCorrectOption(q.correctOptionIndex ?? 0);
    setIsQuestionModalOpen(true);
  };

  const handleSaveQuestionModal = (addNext: boolean = false) => {
    if (!questionTextInput.trim()) {
      toast.error("Please enter the question text.");
      return;
    }

    if (editingQuestionId) {
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === editingQuestionId
            ? {
              ...q,
              questionText: questionTextInput,
              options: [...optionInputs],
              correctOptionIndex: selectedCorrectOption,
            }
            : q
        )
      );
      toast.success("Question updated successfully!");
    } else {
      const newQ: QuestionItem = {
        id: `q-${Date.now()}`,
        questionText: questionTextInput,
        options: [...optionInputs],
        correctOptionIndex: selectedCorrectOption,
      };
      setQuestions((prev) => [...prev, newQ]);
      toast.success("Question added!");
    }

    if (addNext) {
      setEditingQuestionId(null);
      setQuestionTextInput("");
      setOptionInputs(["Option 1", "Option 2", "Option 3", "Option 4"]);
      setSelectedCorrectOption(0);
    } else {
      setIsQuestionModalOpen(false);
    }
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    toast.success("Question removed.");
  };

  const pageTitle =
    viewMode === "create"
      ? editingQuiz
        ? "Edit Quiz"
        : "Edit Quiz"
      : "Quiz";

  const pageSubtitle =
    viewMode === "create"
      ? "Configure quiz details, point allocations, campaign schedules, and questions."
      : "Manage active quizzes, reader engagement trivia, and reward points distribution.";

  return (
    <AppShell title={pageTitle} subtitle={pageSubtitle}>
      <div className="p-4 sm:p-6 md:p-8 space-y-6 w-full max-w-[1600px] mx-auto">
        {viewMode === "list" ? (
          /* ========================================================================
           * MAIN QUIZ LISTING VIEW
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
                <DropdownSelect
                  value={statusFilter}
                  options={["All Status", "Active", "Inactive", "Expired"]}
                  onChange={(v) => setStatusFilter(v as any)}
                  className="min-w-[130px]"
                />

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
                    <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <th className="px-6 py-4 min-w-[200px] font-semibold">Quiz Name</th>
                      <th className="px-6 py-4 whitespace-nowrap font-semibold">Quiz Duration</th>
                      <th className="px-6 py-4 whitespace-nowrap font-semibold">Enable/Disable</th>
                      <th className="px-6 py-4 text-center whitespace-nowrap font-semibold">Delete</th>
                      <th className="px-6 py-4 w-10 font-semibold"></th>
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
           * CREATE / EDIT QUIZ FORM VIEW (Matching Screenshot 1 & 2)
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
              {/* Card 1: Edit Quiz Form Box */}
              <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-2xs space-y-6 w-full">
                <h2 className="text-base font-extrabold text-foreground">
                  {quizNameInput || (editingQuiz ? "Edit Quiz" : "Add Quiz")}
                </h2>

                {/* Form 2-Column Grid matching screenshot 1 */}
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
                      className="w-full h-11 rounded-lg border border-border bg-card px-3.5 text-sm text-foreground outline-none focus:border-[var(--brand)]"
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
                      className="w-full h-11 rounded-lg border border-border bg-card px-3.5 text-sm text-foreground outline-none focus:border-[var(--brand)]"
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
                      className="w-full h-11 rounded-lg border border-border bg-card px-3.5 text-sm text-foreground outline-none focus:border-[var(--brand)]"
                    />
                  </div>

                  {/* Start Date - End Date */}
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Start Date - End Date <span className="text-red-500">*</span>
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="flex h-11 w-full items-center justify-between rounded-lg border border-border bg-card px-3.5 text-sm text-foreground hover:bg-secondary/40 focus:outline-none focus:border-[var(--brand)] transition-colors cursor-pointer shadow-none"
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <span className="truncate text-xs sm:text-sm font-medium">
                              {dateRange?.from ? (
                                dateRange.to ? (
                                  <>
                                    <span className="font-semibold text-foreground">{format(dateRange.from, "dd MMM yyyy")}</span>
                                    <span className="text-muted-foreground mx-1.5">-</span>
                                    <span className="font-semibold text-foreground">{format(dateRange.to, "dd MMM yyyy")}</span>
                                  </>
                                ) : (
                                  <>
                                    <span className="font-semibold text-foreground">{format(dateRange.from, "dd MMM yyyy")}</span>
                                  </>
                                )
                              ) : (
                                <span className="text-muted-foreground">Select date range</span>
                              )}
                            </span>
                          </div>
                          <CalendarDays size={18} className="text-muted-foreground shrink-0 ml-2" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-auto p-4 bg-card border-border shadow-xl rounded-xl">
                        {/* Selected status header inside popover */}
                        <div className="flex items-center justify-between pb-3 mb-2 border-b border-border text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="text-muted-foreground">From:</span>
                            <span className="font-semibold text-foreground">
                              {dateRange?.from ? format(dateRange.from, "dd MMM yyyy") : "—"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-muted-foreground">To:</span>
                            <span className="font-semibold text-foreground">
                              {dateRange?.to ? format(dateRange.to, "dd MMM yyyy") : "—"}
                            </span>
                          </div>
                        </div>

                        {/* Single Calendar with range mode */}
                        <Calendar
                          mode="range"
                          defaultMonth={dateRange?.from || new Date("2026-07-01")}
                          selected={dateRange}
                          onSelect={handleDateRangeSelect}
                          numberOfMonths={1}
                          className="rounded-md border-0"
                        />

                        {/* Quick Presets */}
                        <div className="pt-3 mt-2 border-t border-border flex flex-wrap items-center justify-between gap-1.5 text-xs">
                          <button
                            type="button"
                            onClick={() => {
                              const today = new Date();
                              const next7 = addDays(today, 7);
                              handleDateRangeSelect({ from: today, to: next7 });
                            }}
                            className="px-2.5 py-1 rounded-md bg-muted/60 hover:bg-muted text-foreground transition-colors font-medium cursor-pointer"
                          >
                            Next 7 Days
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const today = new Date();
                              const next30 = addDays(today, 30);
                              handleDateRangeSelect({ from: today, to: next30 });
                            }}
                            className="px-2.5 py-1 rounded-md bg-muted/60 hover:bg-muted text-foreground transition-colors font-medium cursor-pointer"
                          >
                            Next 30 Days
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const today = new Date();
                              const startM = startOfMonth(today);
                              const endM = endOfMonth(today);
                              handleDateRangeSelect({ from: startM, to: endM });
                            }}
                            className="px-2.5 py-1 rounded-md bg-muted/60 hover:bg-muted text-foreground transition-colors font-medium cursor-pointer"
                          >
                            This Month
                          </button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* + Add Questions Button matching screenshot 1 */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleOpenAddQuestionModal}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[var(--brand)] px-5 text-sm font-semibold text-white shadow-2xs transition-opacity hover:opacity-90 cursor-pointer"
                  >
                    <Plus size={16} />
                    <span>Add Questions</span>
                  </button>
                </div>
              </div>

              {/* Quiz Questions Section & Table - Separate Card / Table matching screenshot 1 */}
              <div className="space-y-3 w-full">
                <h3 className="text-base font-extrabold text-foreground">
                  Quiz Questions
                </h3>

                <div className="rounded-xl border border-border bg-card overflow-hidden shadow-2xs w-full">
                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-border text-left text-xs font-semibold text-muted-foreground">
                          <th className="px-6 py-4 font-semibold">Question Preview</th>
                          <th className="px-6 py-4 whitespace-nowrap font-semibold">Update</th>
                          <th className="px-6 py-4 text-center whitespace-nowrap font-semibold">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {questions.length === 0 ? (
                          <tr>
                            <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">
                              <p className="text-sm font-medium">No questions added yet</p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                Click "+ Add Questions" button above to add questions to this quiz.
                              </p>
                            </td>
                          </tr>
                        ) : (
                          questions.map((q, idx) => (
                            <tr key={q.id} className="transition-colors hover:bg-secondary/30">
                              {/* Question Preview Column matching screenshot 1 */}
                              <td className="px-6 py-4 font-medium text-foreground text-sm">
                                <span className="font-bold text-foreground mr-2">
                                  {String(idx + 1).padStart(2, "0")}.
                                </span>
                                <span>{q.questionText}</span>
                              </td>

                              {/* Update Column matching screenshot 1 */}
                              <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditQuestionModal(q)}
                                  className="px-3.5 py-1.5 text-xs font-medium rounded-md border border-border bg-card text-foreground hover:bg-secondary transition-colors cursor-pointer shadow-2xs"
                                >
                                  Edit
                                </button>
                              </td>

                              {/* Action Trash Icon Column matching screenshot 1 */}
                              <td className="px-6 py-4 text-center whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteQuestion(q.id)}
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                                  title="Delete Question"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Form Action Buttons at bottom right matching screenshot 1 */}
              <div className="flex items-center justify-end gap-3 pt-4 w-full">
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
                  {editingQuiz ? "Update Quiz" : "Update Quiz"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Enhanced Add / Edit Question Modal Dialog */}
      <Dialog open={isQuestionModalOpen} onOpenChange={setIsQuestionModalOpen}>
        <DialogContent className="sm:max-w-[520px] bg-card border-border p-6 rounded-2xl shadow-2xl space-y-0">
          {/* Header */}
          <DialogHeader className="pb-4 border-b border-border/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand)]/12 text-[var(--brand)] border border-[var(--brand)]/20 shadow-2xs">
                  <HelpCircle size={20} />
                </div>
                <div>
                  <DialogTitle className="text-lg font-extrabold text-foreground tracking-tight">
                    {editingQuestionId ? "Edit Question" : "Add Question"}
                  </DialogTitle>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">
                    Fill in the question prompt and select the correct answer.
                  </p>
                </div>
              </div>

            </div>
          </DialogHeader>

          {/* Form Content */}
          <div className="space-y-5 py-4">
            {/* Question Textarea */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-foreground">
                  Question Text <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-muted-foreground font-medium">Required</span>
              </div>
              <textarea
                rows={3}
                value={questionTextInput}
                onChange={(e) => setQuestionTextInput(e.target.value)}
                placeholder="Enter the Question"
                className="w-full rounded-xl border border-border bg-card p-3.5 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/10 resize-none shadow-2xs"
              />
            </div>

            {/* 4 Options Header & Cards */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-foreground">
                  Answer Options
                </label>
                <span className="text-[11px] text-muted-foreground font-medium">
                  Radio = Correct Answer
                </span>
              </div>

              <div className="space-y-2">
                {[0, 1, 2, 3].map((index) => {
                  const isSelected = selectedCorrectOption === index;
                  const optionLetters = ["A", "B", "C", "D"];
                  return (
                    <div
                      key={index}
                      className={`flex items-center gap-3 rounded-xl border p-2.5 transition-all shadow-2xs ${isSelected
                        ? "border-[var(--brand)]/60 bg-[var(--brand)]/5 ring-1 ring-[var(--brand)]/20"
                        : "border-border/80 bg-card hover:border-border"
                        }`}
                    >
                      {/* Radio button selector */}
                      <label className="flex items-center justify-center cursor-pointer shrink-0 ml-1">
                        <input
                          type="radio"
                          name="correctOption"
                          checked={isSelected}
                          onChange={() => setSelectedCorrectOption(index)}
                          className="h-4 w-4 accent-[var(--brand)] cursor-pointer"
                          title="Mark as correct answer"
                        />
                      </label>

                      {/* Option letter pill */}
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-extrabold shrink-0 transition-colors ${isSelected
                          ? "bg-[var(--brand)] text-white shadow-2xs"
                          : "bg-muted text-muted-foreground"
                          }`}
                      >
                        {optionLetters[index]}
                      </span>

                      {/* Option Text Input */}
                      <input
                        type="text"
                        value={optionInputs[index] || ""}
                        onChange={(e) => {
                          const updated = [...optionInputs];
                          updated[index] = e.target.value;
                          setOptionInputs(updated);
                        }}
                        placeholder={`Option ${index + 1}`}
                        className="w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
                      />

                      {/* Correct answer indicator badge */}
                      {isSelected && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 shrink-0">
                          <CheckCircle2 size={10} />
                          <span>Correct</span>
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <DialogFooter className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-4 border-t border-border/60">
            <button
              type="button"
              onClick={() => handleSaveQuestionModal(false)}
              className="w-full sm:w-auto flex h-10 items-center justify-center px-5 rounded-lg border border-border bg-card text-xs font-bold text-foreground hover:bg-secondary transition-all cursor-pointer shadow-2xs"
            >
              Save & Close
            </button>
            <button
              type="button"
              onClick={() => handleSaveQuestionModal(true)}
              className="w-full sm:w-auto flex h-10 items-center justify-center gap-1.5 px-5 rounded-lg bg-[var(--brand)] text-white text-xs font-bold hover:opacity-90 transition-all cursor-pointer shadow-2xs"
            >
              <Plus size={14} />
              <span>Save & Add Next</span>
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
