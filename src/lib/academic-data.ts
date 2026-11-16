export interface DepartmentOption {
  id: string;
  name: string;
}

export interface CourseOption {
  id: string;
  name: string;
  departmentName?: string;
}

export interface BatchOption {
  id: string;
  name: string;
  courseName?: string;
}

export const DEFAULT_DEPARTMENTS: DepartmentOption[] = [
  { id: "dept-1", name: "Computer Science" },
  { id: "dept-2", name: "Commerce & Management" },
  { id: "dept-3", name: "Science" },
  { id: "dept-4", name: "Economics" },
  { id: "dept-5", name: "Medical & Health Sciences" },
  { id: "dept-6", name: "Physics" },
];

export const DEFAULT_COURSES: CourseOption[] = [
  { id: "c-1", name: "B.Sc (CS)", departmentName: "Computer Science" },
  { id: "c-2", name: "B.Tech (IT)", departmentName: "Computer Science" },
  { id: "c-3", name: "B.Com (CA)", departmentName: "Commerce & Management" },
  { id: "c-4", name: "M.B.A", departmentName: "Commerce & Management" },
  { id: "c-5", name: "MSC", departmentName: "Science" },
  { id: "c-6", name: "BSc Agriculture", departmentName: "Science" },
  { id: "c-7", name: "NEET Courseware", departmentName: "Medical & Health Sciences" },
];

export const DEFAULT_BATCHES: BatchOption[] = [
  { id: "b-1", name: "2025 - 2029", courseName: "B.Sc (CS)" },
  { id: "b-2", name: "2024 - 2028", courseName: "B.Sc (CS)" },
  { id: "b-3", name: "2023 - 2027", courseName: "B.Tech (IT)" },
  { id: "b-4", name: "2022 - 2026", courseName: "B.Tech (IT)" },
  { id: "b-5", name: "2025 - 2027", courseName: "M.B.A" },
  { id: "b-6", name: "Batch 2025", courseName: "MSC" },
  { id: "b-7", name: "Batch 2026", courseName: "MSC" },
];
