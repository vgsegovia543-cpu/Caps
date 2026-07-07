/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Student {
  id: string; // School ID
  name: string;
  yearLevel: string; // e.g., "Grade 1", "Grade 2", etc.
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  birthday: string;
  registeredAt: string;
  profilePicture?: string;
  accountPassword?: string;
}

export interface SubjectGrades {
  English: number;
  Mathematics: number;
  Science: number;
  Filipino: number;
  MAPEH: number;
  AralingPanlipunan: number;
}

export interface Grade {
  id: string;
  studentId: string;
  studentName: string;
  grades: SubjectGrades;
  academicYear: string; // e.g., "2025-2026"
  term: string; // e.g., "1st Grading", "2nd Grading", etc.
  uploadedAt: string;
  comments?: string;
}

export interface Reply {
  id: string;
  authorName: string;
  role: 'Parent' | 'Teacher' | 'Student';
  content: string;
  timestamp: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  category: 'Urgent' | 'General' | 'PTCA Meeting' | 'Event';
  targetAudience: 'Everyone' | 'Grade 1' | 'Grade 2' | 'Grade 3' | 'Grade 4' | 'Grade 5' | 'Grade 6';
  replies: Reply[];
}

export interface AttendanceLog {
  id: string;
  studentId: string;
  studentName: string;
  type: 'IN' | 'OUT';
  timestamp: string;
  date: string;
  specialDayMessage?: string;
  notificationSentTo: string;
  notificationPhone: string;
  notificationSuccess: boolean;
}

export interface Feedback {
  id: string;
  gradeId: string;
  studentId: string;
  studentName: string;
  parentName: string;
  comment: string;
  timestamp: string;
}

export interface Milestone {
  id: string;
  studentId: string;
  studentName: string;
  title: string;
  description: string;
  category: 'Academic Excellence' | 'Perfect Attendance' | 'Conduct' | 'Leadership' | 'Sports' | 'Academic Award' | 'Special Recognition';
  date: string;
  notified: boolean;
  notifiedAt?: string;
}
