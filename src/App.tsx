/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Student, Grade, Announcement, AttendanceLog, Feedback, Milestone, Reply } from './types';
import {
  INITIAL_STUDENTS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_GRADES,
  INITIAL_MILESTONES
} from './data';
import AdminPortal from './components/AdminPortal';
import UserPortal from './components/UserPortal';
import LoginGateway from './components/LoginGateway';
import {
  School,
  User,
  Settings,
  Bell,
  MessageSquare,
  Activity,
  Trash2,
  Award,
  Smartphone,
  RefreshCw,
  Clock,
  ArrowRight,
  Sparkles,
  BookOpen,
  MapPin
} from 'lucide-react';

export default function App() {
  // Global States loaded with LocalStorage
  const [students, setStudents] = useState<Student[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>([]);
  
  // Simulation activity logger list (displays SMS events & state transitions)
  const [systemLogs, setSystemLogs] = useState<Array<{ id: string; time: string; text: string; type: 'sms' | 'sys' | 'success' }>>([]);

  // Active workspace viewpoint: "admin" | "user"
  const [activeRole, setActiveRole] = useState<'admin' | 'user'>('admin');

  // Unified global login session states
  const [isAdminLogged, setIsAdminLogged] = useState<boolean>(false); // Starts false for clean entry page
  const [isUserLogged, setIsUserLogged] = useState<boolean>(false);
  const [selectedUserStudent, setSelectedUserStudent] = useState<Student | null>(null);

  // Load state on startup
  useEffect(() => {
    try {
      const storedStudents = localStorage.getItem('ptca_students');
      const storedAnns = localStorage.getItem('ptca_announcements');
      const storedGrades = localStorage.getItem('ptca_grades');
      const storedMilestones = localStorage.getItem('ptca_milestones');
      const storedFeedbacks = localStorage.getItem('ptca_feedbacks');
      const storedLogs = localStorage.getItem('ptca_attendance_logs');

      setStudents(storedStudents ? JSON.parse(storedStudents) : INITIAL_STUDENTS);
      setAnnouncements(storedAnns ? JSON.parse(storedAnns) : INITIAL_ANNOUNCEMENTS);
      setGrades(storedGrades ? JSON.parse(storedGrades) : INITIAL_GRADES);
      setMilestones(storedMilestones ? JSON.parse(storedMilestones) : INITIAL_MILESTONES);
      setFeedbacks(storedFeedbacks ? JSON.parse(storedFeedbacks) : []);
      setAttendanceLogs(storedLogs ? JSON.parse(storedLogs) : []);

      // Seed initial logs
      setSystemLogs([
        { 
          id: "sys-init", 
          time: new Date().toLocaleTimeString(), 
          text: "System initialized. Seeded default student archives, academic rosters, and interactive dialogues.", 
          type: 'sys' 
        }
      ]);
    } catch (err) {
      console.error("Storage load error:", err);
    }
  }, []);

  // Save changes hook state
  const saveState = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const addSystemLog = (text: string, type: 'sms' | 'sys' | 'success' = 'sys') => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setSystemLogs(prev => [
      { id: "log-" + Date.now() + Math.random(), time: timestamp, text, type },
      ...prev.slice(0, 49) // Keep last 50
    ]);
  };

  // --- CONTROLLERS ---

  const handleRegisterStudent = (newStudent: Student) => {
    const updated = [...students, newStudent];
    setStudents(updated);
    saveState('ptca_students', updated);
  };

  const handlePostAnnouncement = (newAnn: Announcement) => {
    const updated = [newAnn, ...announcements];
    setAnnouncements(updated);
    saveState('ptca_announcements', updated);
  };

  const handleUploadGrade = (newGrade: Grade) => {
    const updated = [newGrade, ...grades];
    setGrades(updated);
    saveState('ptca_grades', updated);
  };

  const handleLogAttendance = (newLog: AttendanceLog) => {
    const updated = [newLog, ...attendanceLogs];
    setAttendanceLogs(updated);
    saveState('ptca_attendance_logs', updated);

    // Automatically trigger visual simulated SMS text alert!
    const smsContent = newLog.type === 'IN' 
      ? `TCM School Alert: ${newLog.studentName} has safety checked-in at ${new Date(newLog.timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}. Attendance logged.`
      : `TCM School Alert: Fetching Complete. ${newLog.studentName} has authorized checkout status and is ready for safe handover.`;

    addSystemLog(`[SMS Gateway Dispatched to ${newLog.notificationPhone} (${newLog.notificationSentTo})]: ${smsContent}`, 'sms');
  };

  const handleAddReplyToAnnouncement = (announcementId: string, reply: Reply) => {
    const updated = announcements.map(ann => {
      if (ann.id === announcementId) {
        return {
          ...ann,
          replies: [...(ann.replies || []), reply]
        };
      }
      return ann;
    });
    setAnnouncements(updated);
    saveState('ptca_announcements', updated);
    addSystemLog(`Parent user sent feedback message response: "${reply.content.slice(0, 30)}..."`, 'success');
  };

  const handleAddFeedbackToGrade = (newFeedback: Feedback) => {
    const updated = [newFeedback, ...feedbacks];
    setFeedbacks(updated);
    saveState('ptca_feedbacks', updated);
    addSystemLog(`Academic feedback submitted concerning grade ID: ${newFeedback.gradeId}`, 'success');
  };

  const handleAddMilestone = (newMilestone: Milestone) => {
    const updated = [newMilestone, ...milestones];
    setMilestones(updated);
    saveState('ptca_milestones', updated);
    addSystemLog(`Milestone award recorded for ${newMilestone.studentName}: ${newMilestone.title}`, 'success');
  };

  const handleDispatchMilestoneAcknowledgment = (milestoneId: string) => {
    const updated = milestones.map(m => {
      if (m.id === milestoneId) {
        return {
          ...m,
          notified: true,
          notifiedAt: new Date().toISOString()
        };
      }
      return m;
    });
    setMilestones(updated);
    saveState('ptca_milestones', updated);
    
    // Simulate notification print
    const milestone = milestones.find(m => m.id === milestoneId);
    if (milestone) {
      const student = students.find(s => s.id === milestone.studentId);
      if (student) {
        addSystemLog(`[SMS Gateway Dispatched to ${student.parentPhone}]: Congratulations! ${student.name} received high honors certificate: "${milestone.title}"!`, 'sms');
      }
    }
  };

  const handleResetSandboxData = () => {
    if (window.confirm("Are you sure you want to restore default demo records?")) {
      localStorage.clear();
      setStudents(INITIAL_STUDENTS);
      setAnnouncements(INITIAL_ANNOUNCEMENTS);
      setGrades(INITIAL_GRADES);
      setMilestones(INITIAL_MILESTONES);
      setFeedbacks([]);
      setAttendanceLogs([]);
      setSystemLogs([
        { id: "sys-reset", time: new Date().toLocaleTimeString(), text: "State reset to pre-seeded school database.", type: 'sys' }
      ]);
      addSystemLog("Sandbox school registers restored to original status.", "sys");
    }
  };

  return (
   
    <div
      className="min-h-screen flex flex-col font-sans"
      id="ptca-main-wrapper"
      style={{
        backgroundImage: "url('/img/cmBG2.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Professional Polish Design Theme Top Navigation Header */}
      <nav className="sticky top-0 z-50 mx-auto mt-3 w-[calc(100%-1rem)] max-w-7xl rounded-2xl border border-white/40 bg-white/30 backdrop-blur-xl shadow-[0_10px_40px_rgba(15,23,42,0.16)] flex flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 xl:px-10 xl:max-w-[1400px] xl:py-4 shrink-0">
        <div className="flex flex-wrap items-center gap-3 lg:flex-nowrap">
          <img
            src="/img/CMlogoNBG.png"
            alt="CM Logo"
            className="h-12 w-12 flex-shrink-0 object-contain sm:h-14 sm:w-14 lg:h-16 lg:w-16"
          />
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base lg:text-lg font-black tracking-[0.02em] text-slate-900 drop-shadow-[0_1px_2px_rgba(255,255,255,0.85)]">
              PTCA Class Link <span className="ml-1 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 bg-clip-text text-transparent italic">{activeRole === 'admin' ? 'Admin Portal' : 'Parents Portal'}</span>
            </h1>
            <p className="mt-1 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.3em] text-slate-700/90">TCM Elementary Department</p>
          </div>
        </div>

        {/* Dynamic Sandbox Selector & Control Viewpoint */}
        <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-end">
          <div className="flex items-center gap-1 rounded-xl border border-white/50 bg-white/70 p-1 shadow-sm">
            <button
              onClick={() => {
                setActiveRole('admin');
                addSystemLog("Simulator Viewpoint: Switched to Administrative Link");
              }}
              className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold transition duration-150 ${
                activeRole === 'admin'
                  ? 'bg-blue-700 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-200/70 hover:text-slate-900'
              }`}
            >
              <Settings className="h-3.5 w-3.5" />
              <span>Admin Link</span>
            </button>

            <button
              onClick={() => {
                setActiveRole('user');
                addSystemLog("Simulator Viewpoint: Switched to Parents & Students Link");
              }}
              className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold transition duration-150 ${
                activeRole === 'user'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-200/70 hover:text-slate-900'
              }`}
            >
              <User className="h-3.5 w-3.5" />
              <span>User Link</span>
            </button>
          </div>

          <div className="hidden h-5 w-px bg-slate-300/80 sm:block"></div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetSandboxData}
              title="Reset Sandbox Database"
              className="flex items-center gap-1 rounded-lg border border-white/60 bg-white/70 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition duration-150 hover:bg-slate-100 hover:text-red-600"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Reset Demo</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Workspace Frame split with the SIMULATOR LOGS */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 grid grid-cols-1 gap-5" id="main-grid-layout">
        
        {/* ACTIVE VIEWPORT (Admin Portal or User Portal) */}
        <section className="flex flex-col gap-4 items-center" id="view-portal-column">
          {activeRole === 'admin' ? (
            !isAdminLogged ? (
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-2 mx-auto w-full max-w-2xl flex justify-center bg-white/50" id="login-gateway-admin-wrapper">
                <LoginGateway 
                  students={students}
                  activeRole="admin"
                  onAdminLoginSuccess={() => {
                    setIsAdminLogged(true);
                  }}
                  onUserLoginSuccess={(student) => {
                    setSelectedUserStudent(student);
                    setIsUserLogged(true);
                    setActiveRole('user');
                  }}
                  addSystemLog={addSystemLog}
                />
              </div>
            ) : (
              <AdminPortal 
                students={students}
                grades={grades}
                announcements={announcements}
                feedbacks={feedbacks}
                attendanceLogs={attendanceLogs}
                onRegisterStudent={handleRegisterStudent}
                onPostAnnouncement={handlePostAnnouncement}
                onUploadGrade={handleUploadGrade}
                onLogAttendance={handleLogAttendance}
                onAddMilestone={handleAddMilestone}
                addSystemLog={addSystemLog}
                isAdminLogged={isAdminLogged}
                setIsAdminLogged={setIsAdminLogged}
              />
            )
          ) : (
            !isUserLogged ? (
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-2 mx-auto w-full max-w-2xl flex justify-center bg-white/50" id="login-gateway-user-wrapper">
                <LoginGateway 
                  students={students}
                  activeRole="user"
                  onAdminLoginSuccess={() => {
                    setIsAdminLogged(true);
                    setActiveRole('admin');
                  }}
                  onUserLoginSuccess={(student) => {
                    setSelectedUserStudent(student);
                    setIsUserLogged(true);
                  }}
                  addSystemLog={addSystemLog}
                />
              </div>
            ) : (
              <UserPortal 
                students={students}
                grades={grades}
                announcements={announcements}
                milestones={milestones}
                feedbacks={feedbacks}
                onAddReplyToAnnouncement={handleAddReplyToAnnouncement}
                onAddFeedbackToGrade={handleAddFeedbackToGrade}
                onDispatchMilestoneAcknowledgment={handleDispatchMilestoneAcknowledgment}
                addSystemLog={addSystemLog}
                isLogged={isUserLogged}
                setIsLogged={setIsUserLogged}
                selectedStudent={selectedUserStudent}
                setSelectedStudent={setSelectedUserStudent}
              />
            )
          )}
        </section>

      

      </main>

      {/* Corporate Footing and school info */}
      <footer
        className="border-t border-white/30 py-4 px-4 md:px-6 backdrop-blur-2xl bg-white/25 shadow-[0_-10px_35px_rgba(15,23,42,0.12)]"
        id="project-footer"
        style={{ backgroundColor: activeRole === 'admin' ? 'rgba(65, 109, 229, 0.78)' : 'rgba(71, 184, 97, 0.78)' }}
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-xs text-slate-900 md:flex-row">
          <p className="flex flex-wrap items-center justify-center gap-2 text-center font-medium md:justify-start md:text-left">
            <span className="rounded-full bg-white/35 px-2.5 py-1 font-semibold shadow-sm">© THE COLLEGE OF MAASIN Elementary Department.</span>
            <span className="rounded-full bg-white/35 px-2.5 py-1 font-semibold shadow-sm">"Nisi Dominus Frustra"</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/30 px-2.5 py-1 text-slate-800/90 shadow-sm">
              <MapPin className="h-3.5 w-3.5" />
              R. Kangleon Street, Maasin City, Southern Leyte, 6600 
            </span>
          </p>
          <div className="flex items-center gap-3 font-mono text-[11px] text-slate-900/90">
            <span className="rounded-full border border-white/40 bg-white/40 px-2.5 py-1 shadow-sm">School ID: 404718</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
