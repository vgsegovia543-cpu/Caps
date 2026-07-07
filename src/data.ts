/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Student, Announcement, Grade, Milestone } from './types';

export const INITIAL_STUDENTS: Student[] = [
  {
    id: "1001",
    name: "Alex G. Rivera",
    yearLevel: "Grade 4",
    parentName: "Maria Rivera",
    parentPhone: "+63 917 123 4567",
    parentEmail: "maria.rivera@example.com",
    birthday: "2016-08-14",
    registeredAt: "2025-06-01T08:00:00Z",
    accountPassword: "alex1001"
  },
  {
    id: "1002",
    name: "Sofia Marie Santos",
    yearLevel: "Grade 5",
    parentName: "Roberto Santos",
    parentPhone: "+63 918 987 6543",
    parentEmail: "rob.santos@example.com",
    birthday: "2015-04-23",
    registeredAt: "2025-06-01T08:30:00Z",
    accountPassword: "sofia1002"
  },
  {
    id: "1003",
    name: "John Paul Alcantara",
    yearLevel: "Grade 6",
    parentName: "Helen Alcantara",
    parentPhone: "+63 920 444 5555",
    parentEmail: "helen.alcantara@example.com",
    birthday: "2014-11-05",
    registeredAt: "2025-06-01T09:15:00Z",
    accountPassword: "john1003"
  },
  {
    id: "1004",
    name: "Chloe Bianca Cruz",
    yearLevel: "Grade 3",
    parentName: "Arlene Cruz",
    parentPhone: "+63 915 222 3333",
    parentEmail: "arlene.cruz@example.com",
    birthday: "2017-01-30",
    registeredAt: "2025-06-10T10:00:00Z",
    accountPassword: "chloe1004"
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann-1",
    title: "Urgent: Mid-Term General Assembly and PTCA Liaison",
    content: "Greetings TCM Parents, Guardians, and Teachers! We will hold our 1st Mid-Term General Assembly this coming Friday at 2:00 PM at the School Auditorium. Agenda includes department budgets, year-end plans, and student safety updates. Your attendance is highly appreciated.",
    date: "2026-06-21T09:00:00Z",
    author: "Mrs. Susan Dela Cruz (PTCA President)",
    category: "PTCA Meeting",
    targetAudience: "Everyone",
    replies: [
      {
        id: "rep-1",
        authorName: "Maria Rivera",
        role: "Parent",
        content: "I will definitely attend! Thank you for the update.",
        timestamp: "2026-06-21T10:30:00Z"
      },
      {
        id: "rep-2",
        authorName: "Roberto Santos",
        role: "Parent",
        content: "Can we join online? Is there a Zoom link option?",
        timestamp: "2026-06-21T11:15:00Z"
      }
    ]
  },
  {
    id: "ann-2",
    title: "Nutrition Month Flag Ceremony & Healthy Baon Activity",
    content: "Please guide our pupils to bring healthy, home-cooked food in their lunchboxes on Wednesday for our Nutrition Month Exhibition. Best nutrition-packed lunchboxes will stand a chance to win school supplies!",
    date: "2026-06-18T14:45:00Z",
    author: "Mr. Juan Reyes (Elementary Coordinator)",
    category: "Event",
    targetAudience: "Everyone",
    replies: []
  },
  {
    id: "ann-3",
    title: "Vaccination and Health Log Submission Guidelines",
    content: "Urgent checklist: Please submit a photocopy of your child's updated health log/vaccination card to the clinic nurse by June 28, 2026. This is crucial for department record keeping.",
    date: "2026-06-15T08:00:00Z",
    author: "School Administration Team",
    category: "Urgent",
    targetAudience: "Everyone",
    replies: []
  }
];

export const INITIAL_GRADES: Grade[] = [
  {
    id: "g-1",
    studentId: "1001",
    studentName: "Alex G. Rivera",
    grades: {
      English: 92,
      Mathematics: 88,
      Science: 91,
      Filipino: 94,
      MAPEH: 93,
      AralingPanlipunan: 90
    },
    academicYear: "2025-2026",
    term: "1st Quarter",
    uploadedAt: "2026-06-20T10:00:00Z",
    comments: "Alex shows exceptional analytical skills in English and Science. Keep it up!"
  },
  {
    id: "g-2",
    studentId: "1002",
    studentName: "Sofia Marie Santos",
    grades: {
      English: 89,
      Mathematics: 94,
      Science: 92,
      Filipino: 88,
      MAPEH: 95,
      AralingPanlipunan: 89
    },
    academicYear: "2025-2026",
    term: "1st Quarter",
    uploadedAt: "2026-06-20T11:30:00Z",
    comments: "Sofia has marvelous mathematical potential. She participates in quiz bees active."
  }
];

export const INITIAL_MILESTONES: Milestone[] = [
  {
    id: "m-1",
    studentId: "1001",
    studentName: "Alex G. Rivera",
    title: "Outstanding Explorer Award",
    description: "Ranked Top 3 in Science Practical Quiz Bowl with superb creativity.",
    category: "Academic Excellence",
    date: "2026-06-10",
    notified: true,
    notifiedAt: "2026-06-10T14:00:00Z"
  },
  {
    id: "m-2",
    studentId: "1002",
    studentName: "Sofia Marie Santos",
    title: "Perfect Attendance Badge",
    description: "Zero absences or tardiness logged for the entire school quarter.",
    category: "Perfect Attendance",
    date: "2026-06-12",
    notified: false
  },
  {
    id: "m-3",
    studentId: "1003",
    studentName: "John Paul Alcantara",
    title: "Presidential Leadership Certificate",
    description: "Successfully spearheaded the Campus Environmental Clean-up Drive.",
    category: "Leadership",
    date: "2026-06-14",
    notified: false
  }
];
