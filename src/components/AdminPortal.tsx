/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Student, Grade, Announcement, AttendanceLog, Feedback, Milestone, SubjectGrades } from '../types';
import { 
  Users, 
  PlusCircle, 
  Megaphone, 
  CheckCircle2, 
  Trash2, 
  Upload, 
  QrCode, 
  Eye, 
  BookOpen, 
  Smile, 
  UserPlus, 
  BellRing, 
  Clock, 
  AlertTriangle,
  Award,
  Search,
  Check,
  Maximize2,
  Lock,
  LogOut,
  ChevronRight,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminPortalProps {
  students: Student[];
  grades: Grade[];
  announcements: Announcement[];
  feedbacks: Feedback[];
  attendanceLogs: AttendanceLog[];
  onRegisterStudent: (student: Student) => void;
  onPostAnnouncement: (announcement: Announcement) => void;
  onUploadGrade: (grade: Grade) => void;
  onLogAttendance: (log: AttendanceLog) => void;
  onAddMilestone: (milestone: Milestone) => void;
  addSystemLog: (text: string) => void;
  isAdminLogged: boolean;
  setIsAdminLogged: (val: boolean) => void;
  onlineUserCount: number;
}

export default function AdminPortal({
  students,
  grades,
  announcements,
  feedbacks,
  attendanceLogs,
  onRegisterStudent,
  onPostAnnouncement,
  onUploadGrade,
  onLogAttendance,
  onAddMilestone,
  addSystemLog,
  isAdminLogged,
  setIsAdminLogged,
  onlineUserCount
}: AdminPortalProps) {
  // Authentication states
  const [loginError, setLoginError] = useState<string>('');

  // Inside admin views
  // "announcements" | "grades-upload" | "student-register" | "attendance-scanner" | "student-list" | "reviews"
  const [activeAdminTab, setActiveAdminTab] = useState<'announcements' | 'grades-upload' | 'student-register' | 'attendance-scanner' | 'student-list' | 'reviews'>('announcements');
  const [studentDirectoryQuery, setStudentDirectoryQuery] = useState<string>('');
  const [awardStudentId, setAwardStudentId] = useState<string>(students[0]?.id ?? '');
  const [awardTitle, setAwardTitle] = useState<string>('1st Honor');
  const [awardDescription, setAwardDescription] = useState<string>('');
  const [awardSuccessMessage, setAwardSuccessMessage] = useState<string>('');

  // --- ANNOUNCEMENT WIZARD STATE ---
  // Step 1: Write, Step 2: Preview, Step 3: Posted / Another loop
  const [annStage, setAnnStage] = useState<'write' | 'preview' | 'success'>('write');
  const [annTitle, setAnnTitle] = useState<string>('');
  const [annContent, setAnnContent] = useState<string>('');
  const [annCategory, setAnnCategory] = useState<'Urgent' | 'General' | 'PTCA Meeting' | 'Event'>('PTCA Meeting');
  const [annTarget, setAnnTarget] = useState<'Everyone' | 'Grade 1' | 'Grade 2' | 'Grade 3' | 'Grade 4' | 'Grade 5' | 'Grade 6'>('Everyone');

  // --- GRADES UPLOAD STATE ---
  const [gradeSearchName, setGradeSearchName] = useState<string>('');
  const [selectedStudentForGrade, setSelectedStudentForGrade] = useState<Student | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<string>('1st Quarter');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>('2025-2026');
  const [subjectScores, setSubjectScores] = useState<SubjectGrades>({
    English: 85,
    Mathematics: 85,
    Science: 85,
    Filipino: 85,
    MAPEH: 85,
    AralingPanlipunan: 85
  });
  const [gradeComments, setGradeComments] = useState<string>('');
  const [gradeUploadSuccess, setGradeUploadSuccess] = useState<boolean>(false);

  // --- STUDENT REGISTRATION STATE ---
  const [newPupilId, setNewPupilId] = useState<string>('');
  const [newPupilName, setNewPupilName] = useState<string>('');
  const [newPupilYear, setNewPupilYear] = useState<string>('Grade 1');
  const [newPupilParentName, setNewPupilParentName] = useState<string>('');
  const [newPupilParentPhone, setNewPupilParentPhone] = useState<string>('');
  const [newPupilParentEmail, setNewPupilParentEmail] = useState<string>('');
  const [newPupilBirthday, setNewPupilBirthday] = useState<string>('');
  const [newPupilPassword, setNewPupilPassword] = useState<string>('');
  const [newPupilProfilePreview, setNewPupilProfilePreview] = useState<string>('');
  const [registerSuccessMessage, setRegisterSuccessMessage] = useState<string>('');

  // --- ATTENDANCE SCANNER STATE ---
  const [scanType, setScanType] = useState<'IN' | 'OUT'>('IN'); // IN = Attendance In, OUT = Fetching Out Special Day
  const [inputScanId, setInputScanId] = useState<string>('');
  const [scannedStudent, setScannedStudent] = useState<Student | null>(null);
  const [scanMessage, setScanMessage] = useState<string>('');
  const [scanError, setScanError] = useState<string>('');
  const [authorityContactChecked, setAuthorityContactChecked] = useState<boolean>(true);

  useEffect(() => {
    if (students.length > 0 && !students.some((student) => student.id === awardStudentId)) {
      setAwardStudentId(students[0].id);
    }
  }, [students, awardStudentId]);

  const filteredStudentsForDirectory = students.filter((student) => {
    const query = studentDirectoryQuery.trim().toLowerCase();
    if (!query) return true;
    return student.name.toLowerCase().includes(query) || student.id.toLowerCase().includes(query);
  });

  const academicAwardOptions = [
    '1st Honor',
    '2nd Honor',
    '3rd Honor'
  ];

  const specialRecognitionAwardOptions = [
    'Most Punctual',
    'Most Well-Behaved',
    'Most Responsible',
    'Most Cooperative',
    'Most Helpful',
    'Most Obedient',
    'Most Honest',
    'Most Industrious',
    'Most Polite',
    'Most Neat and Orderly',
    'Leadership Award',
    'Perfect Attendance',
    'Best in English',
    'Best in Mathematics',
    'Best in Science',
    'Best in Filipino',
    'Best in Araling Panlipunan',
    'Best in ESP',
    'Best in MAPEH',
    'Best in Penmanship',
    'Character Award'
  ];

  const awardOptions = [
    { label: 'Academic Awards', options: academicAwardOptions },
    { label: 'Special Recognition Awards', options: specialRecognitionAwardOptions }
  ];

  // Actions for Admin Login
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdminLogged(true);
    setLoginError('');
    addSystemLog('Admin Login: Administrator logged in successfully.');
  };

  const handleAdminLogout = () => {
    setIsAdminLogged(false);
    addSystemLog('Admin Logout: Administrator session terminated.');
  };

  // --- ANNOUNCEMENT WIZARD ACTIONS ---
  const handleAnnGoToPreview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;
    setAnnStage('preview');
    addSystemLog(`Announcement Preview loaded: "${annTitle}"`);
  };

  const handleAnnPublish = () => {
    const newAnn: Announcement = {
      id: "ann-" + Date.now(),
      title: annTitle,
      content: annContent,
      category: annCategory,
      targetAudience: annTarget,
      date: new Date().toISOString(),
      author: "Mrs. Susan Dela Cruz (PTCA Admin Liaison)",
      replies: []
    };

    onPostAnnouncement(newAnn);
    setAnnStage('success');
    addSystemLog(`Announcement officially posted to system database! ID: ${newAnn.id}, Subject: ${newAnn.title}`);
  };

  const handleAnnReset = () => {
    setAnnTitle('');
    setAnnContent('');
    setAnnCategory('PTCA Meeting');
    setAnnTarget('Everyone');
    setAnnStage('write');
  };

  // --- GRADES UPLOAD ACTIONS ---
  const handleScoreChange = (subject: keyof SubjectGrades, val: number) => {
    setSubjectScores(prev => ({
      ...prev,
      [subject]: Math.min(100, Math.max(0, val))
    }));
  };

  const handleUploadGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForGrade) return;

    const newGradeRecord: Grade = {
      id: "g-" + Date.now(),
      studentId: selectedStudentForGrade.id,
      studentName: selectedStudentForGrade.name,
      grades: { ...subjectScores },
      academicYear: selectedAcademicYear,
      term: selectedTerm,
      uploadedAt: new Date().toISOString(),
      comments: gradeComments
    };

    onUploadGrade(newGradeRecord);
    setGradeUploadSuccess(true);
    addSystemLog(`Grade Report Uploaded successfully to class ledger! Student: ${selectedStudentForGrade.name} (${selectedTerm})`);
  };

  const handleGradeResetLoop = () => {
    setSelectedStudentForGrade(null);
    setGradeSearchName('');
    setGradeComments('');
    setSubjectScores({
      English: 85,
      Mathematics: 85,
      Science: 85,
      Filipino: 85,
      MAPEH: 85,
      AralingPanlipunan: 85
    });
    setGradeUploadSuccess(false);
  };

  const handleRegisterPhotoUpload = (file: File | null) => {
    if (!file) {
      setNewPupilProfilePreview('');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        setNewPupilProfilePreview(result);
      }
    };
    reader.readAsDataURL(file);
  };

  // --- STUDENT REGISTRATION ACTIONS ---
  const handleRegisterStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPupilId.trim() || !newPupilName.trim() || !newPupilParentName.trim() || !newPupilParentPhone.trim() || !newPupilPassword.trim()) {
      setRegisterSuccessMessage('');
      return;
    }

    // Check if duplicate ID
    const exists = students.some(s => s.id === newPupilId.trim());
    if (exists) {
      setRegisterSuccessMessage(`⚠️ Pupil ID ${newPupilId} is already registered.`);
      return;
    }

    const newStudent: Student = {
      id: newPupilId.trim(),
      name: newPupilName.trim(),
      yearLevel: newPupilYear,
      parentName: newPupilParentName.trim(),
      parentPhone: newPupilParentPhone.trim(),
      parentEmail: newPupilParentEmail.trim() || `${newPupilParentName.replace(/\s+/g, '').toLowerCase()}@example.com`,
      birthday: newPupilBirthday || '2016-01-01',
      registeredAt: new Date().toISOString(),
      profilePicture: newPupilProfilePreview || undefined,
      accountPassword: newPupilPassword.trim()
    };

    onRegisterStudent(newStudent);
    setRegisterSuccessMessage(`✅ Registered Pupil successfully! ${newStudent.name} is saved under ID ${newStudent.id}.`);
    
    addSystemLog(`Student registered: ${newStudent.name} (${newStudent.yearLevel}) - Guardian alert set to ${newStudent.parentPhone}`);

    // clear states
    setNewPupilId('');
    setNewPupilName('');
    setNewPupilParentName('');
    setNewPupilParentPhone('');
    setNewPupilParentEmail('');
    setNewPupilBirthday('');
    setNewPupilPassword('');
    setNewPupilProfilePreview('');
  };

  const handleAddAward = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedStudent = students.find((student) => student.id === awardStudentId);
    if (!selectedStudent) {
      setAwardSuccessMessage('Please choose a registered student before saving an award.');
      return;
    }

    const milestoneTitle = awardTitle.trim();
    const newMilestone: Milestone = {
      id: 'm-' + Date.now(),
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      title: milestoneTitle,
      description: awardDescription.trim() || `Recognized by the PTCA administration for ${milestoneTitle}.`,
      category: academicAwardOptions.includes(milestoneTitle) ? 'Academic Award' : 'Special Recognition',
      date: new Date().toISOString().split('T')[0],
      notified: false
    };

    onAddMilestone(newMilestone);
    setAwardSuccessMessage(`Award saved for ${selectedStudent.name}: ${milestoneTitle}`);
    setAwardDescription('');
    addSystemLog(`Award recorded: ${selectedStudent.name} received ${milestoneTitle}`);
  };

  // --- ATTENDANCE SCANNER ACTIONS ---
  const handleSearchAttendanceStudent = (idToSearch: string) => {
    setInputScanId(idToSearch);
    setScanError('');
    setScanMessage('');
    const found = students.find(s => s.id === idToSearch.trim());
    if (found) {
      setScannedStudent(found);
    } else {
      setScannedStudent(null);
    }
  };

  const handleProcessAttendanceIn = () => {
    if (!scannedStudent) {
      setScanError('Please select or input a valid registered pupil School ID.');
      return;
    }

    const newLog: AttendanceLog = {
      id: "att-" + Date.now(),
      studentId: scannedStudent.id,
      studentName: scannedStudent.name,
      type: 'IN',
      timestamp: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0],
      notificationSentTo: scannedStudent.parentName,
      notificationPhone: scannedStudent.parentPhone,
      notificationSuccess: true
    };

    onLogAttendance(newLog);
    setScanMessage(`Success! Recorded IN Attendance for ${scannedStudent.name}. Log parsed and auto-sent SMS notification code to parent.`);
    setInputScanId('');
    setScannedStudent(null);
    addSystemLog(`ATTENDANCE IN: Student ${newLog.studentName} logged in. SMS Alert automatically dispatched to parent ${newLog.notificationSentTo} (${newLog.notificationPhone})`);
  };

  const handleProcessAttendanceOut = () => {
    if (!scannedStudent) {
      setScanError('Please select or input a valid registered pupil School ID.');
      return;
    }

    const newLog: AttendanceLog = {
      id: "att-" + Date.now(),
      studentId: scannedStudent.id,
      studentName: scannedStudent.name,
      type: 'OUT',
      timestamp: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0],
      specialDayMessage: "Authorized Fetching Verified. Pupil is accompanied by PTCA protocol.",
      notificationSentTo: scannedStudent.parentName,
      notificationPhone: scannedStudent.parentPhone,
      notificationSuccess: true
    };

    onLogAttendance(newLog);
    setScanMessage(`Success! Recorded OUT Fetching for ${scannedStudent.name}. Automated SMS alert dispatched informing parent that student is ready for pickup.`);
    setInputScanId('');
    setScannedStudent(null);
    addSystemLog(`ATTENDANCE OUT: Fetching authorized. Student ${newLog.studentName} has checked out. SMS Alert dispatched to parent ${newLog.notificationSentTo}`);
  };

  // Filter students for Grade Upload selection list
  const filteredStudentsForGrade = students.filter(s => 
    s.name.toLowerCase().includes(gradeSearchName.toLowerCase()) || 
    s.id.includes(gradeSearchName)
  );

  return (
    <div className="w-full" id="admin-portal-container">
      {!isAdminLogged ? (
        /* ADMIN LOGIN PAGE */
        <div className="max-w-md mx-auto my-12" id="admin-login-box">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-800 mb-2 border border-slate-300">
              <Lock className="w-6 h-6 text-slate-700" />
            </div>
            <h2 className="text-xl font-bold font-sans text-stone-800">Administrative Login</h2>
            <p className="text-xs font-mono text-slate-700 uppercase mt-0.5 tracking-wider">PTCA Class Link Liaison Portal</p>
            <p className="text-xs text-stone-500 mt-1">Authorized access only. Use the credentials below for the capstone review.</p>
          </div>

          <div className="bg-white border rounded-xl p-6 shadow-sm border-stone-200">
            <form onSubmit={handleAdminLogin} className="space-y-4">
              {loginError && (
                <div className="p-2.5 bg-rose-50 text-rose-600 rounded text-xs flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-[11px] text-slate-700">
                <p className="font-semibold text-slate-800">Access the administrative dashboard</p>
                <p className="mt-1">Use the button below to continue to the admin workspace.</p>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-slate-800 text-white font-medium rounded-lg text-sm hover:bg-slate-900 transition duration-150 flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Enter Admin Portal</span>
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* ADMIN DASHBOARD WORKSPACE */
        <div className="space-y-5" id="admin-workspace">
          {/* Admin Header Panel */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-md">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 bg-blue-900/80 text-blue-300 border border-blue-800/60 text-[10px] font-mono font-bold tracking-tight uppercase rounded">
                  PTCA system operator
                </span>
                <span className="text-slate-300 text-xs font-semibold">Administrative Hub</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-200" />
                <span className="text-[11px] uppercase tracking-[0.18em] text-emerald-200 font-semibold">
                  {onlineUserCount} Active Online User{onlineUserCount === 1 ? '' : 's'}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold font-display mt-1 text-white flex items-center gap-2">
                <span>PTCA Class Link Dashboard</span>
              </h2>
            </div>

            <button
              onClick={handleAdminLogout}
              className="px-3 py-1.5 bg-slate-750 hover:bg-slate-700 text-xs text-white border border-slate-600 rounded-lg flex items-center gap-1.5 transition self-stretch sm:self-auto justify-center font-semibold"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Developer Logout</span>
            </button>
          </div>

          {/* Quick Action Navigation Rails */}
          <div className="flex flex-wrap gap-1.5 border-b border-slate-200 pb-2">
            <button
              onClick={() => setActiveAdminTab('announcements')}
              className={`px-3 py-1.5 bg-blue-700 hover:bg-blue-700 text-xs font-bold border border-emerald-700/50 rounded-lg text-xs flex items-center gap-1.5 transition self-stretch sm:self-auto justify-center
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-600  '
              }`}
            >
              📣 Event List: Announcement Wizard
            </button>
            <button
              onClick={() => { setActiveAdminTab('grades-upload'); handleGradeResetLoop(); }}
              className={`px-3 py-1.5 bg-blue-700 hover:bg-blue-700 text-xs font-bold border border-emerald-700/50 rounded-lg text-xs flex items-center gap-1.5 transition self-stretch sm:self-auto justify-center 
                activeAdminTab === 'grades-upload'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-600'
              }`}
            >
              📝  Upload Grades and Awards
            </button>
            <button
              onClick={() => setActiveAdminTab('student-register')}
              className={`px-3 py-1.5 bg-blue-700 hover:bg-blue-700 text-xs font-bold border border-emerald-700/50 rounded-lg text-xs flex items-center gap-1.5 transition self-stretch sm:self-auto justify-center 
                activeAdminTab === 'student-register'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-600'
              }`}
            >
              👤 Event List: Pupil Accounts
            </button>
            <button
              onClick={() => {
                setActiveAdminTab('attendance-scanner');
                setInputScanId('');
                setScannedStudent(null);
                setScanMessage('');
                setScanError('');
              }}
              className={`px-3 py-1.5 bg-blue-700 hover:bg-blue-700 text-xs font-bold border border-emerald-700/50 rounded-lg text-xs flex items-center gap-1.5 transition self-stretch sm:self-auto justify-center 
                activeAdminTab === 'attendance-scanner'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-600'
              }`}
            >
              🔔 Event List: Scan Attendance
            </button>
            <button
              onClick={() => setActiveAdminTab('student-list')}
              className={`px-3 py-1.5 bg-blue-700 hover:bg-blue-700 text-xs font-bold border border-emerald-700/50 rounded-lg text-xs flex items-center gap-1.5 transition self-stretch sm:self-auto justify-center 
                activeAdminTab === 'attendance-scanner'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-600'
              }`}
            >
              👨‍🎓 Student Directory ({students.length})
            </button>
            <button
              onClick={() => setActiveAdminTab('reviews')}
              className={`px-3 py-1.5 bg-blue-700 hover:bg-blue-700 text-xs font-bold border border-emerald-700/50 rounded-lg text-xs flex items-center gap-1.5 transition self-stretch sm:self-auto justify-center 
                activeAdminTab === 'attendance-scanner'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-600'
              }`}
            >
              💬 Feedback Center ({feedbacks.length})
            </button>
          </div>

          {/* Main workspace cards container */}
          <div className="bg-white border rounded-xl p-4 sm:p-5 shadow-sm border-slate-200 bg-white/80">
            <AnimatePresence mode="wait">
              {/* --- TAB 1: ANNOUNCEMENT CREATE, PREVIEW, POST --- */}
              {activeAdminTab === 'announcements' && (
                <motion.div
                  key="admin-announcements"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="space-y-4"
                >
                  <div className="pb-2 border-b">
                    <h3 className="text-sm font-bold text-stone-800 flex items-center gap-1.5">
                      <Megaphone className="w-4 h-4 text-slate-700" />
                      <span>Admin Event List: Create & Post Announcement</span>
                    </h3>
                    <p className="text-xs text-stone-800">Draft notices, trigger live previews, and post directly to the parent portal feed.</p>
                  </div>

                  {annStage === 'write' && (
                    <form onSubmit={handleAnnGoToPreview} className="space-y-3 max-w-2xl">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-stone-900 mb-1">Category Label</label>
                          <select
                            value={annCategory}
                            onChange={(e: any) => setAnnCategory(e.target.value)}
                            className="w-full text-xs px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:border-slate-500"
                          >
                            <option value="PTCA Meeting">PTCA Meeting Liaison</option>
                            <option value="Urgent">⚠️ Urgent Alert</option>
                            <option value="Event">Event Activity</option>
                            <option value="General">General Information</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-stone-900 mb-1">Target Department Level</label>
                          <select
                            value={annTarget}
                            onChange={(e: any) => setAnnTarget(e.target.value)}
                            className="w-full text-xs px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:border-slate-500"
                          >
                            <option value="Everyone">Everyone (All Grades)</option>
                            <option value="Grade 1">Grade 1 Department</option>
                            <option value="Grade 2">Grade 2 Department</option>
                            <option value="Grade 3">Grade 3 Department</option>
                            <option value="Grade 4">Grade 4 Department</option>
                            <option value="Grade 5">Grade 5 Department</option>
                            <option value="Grade 6">Grade 6 Department</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-900 mb-1">Announcement Subject / Title</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Schedule for Monthly Executive PTCA Board Meeting"
                          value={annTitle}
                          onChange={(e) => setAnnTitle(e.target.value)}
                          className="w-full text-xs p-2 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:border-slate-500 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-900 mb-1">Notice Body Content</label>
                        <textarea
                          required
                          placeholder="Provide detailed instructions, agendas, coordinate links, dates, and coordinator contact details..."
                          value={annContent}
                          onChange={(e) => setAnnContent(e.target.value)}
                          rows={4}
                          className="w-full text-xs p-2 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:border-slate-500"
                        />
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-slate-800 text-white font-semibold text-xs rounded hover:bg-slate-900 transition flex items-center gap-1.5"
                        >
                          <span>Step 3: Preview Announcement</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </form>
                  )}

                  {annStage === 'preview' && (
                    <div className="space-y-4 max-w-2xl border p-4 sm:p-5 rounded-xl bg-stone-50/50">
                      <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs font-sans">
                        👉 <strong>Preview Mode:</strong> Please check your content and layout. Review target audiences carefully before publishing.
                      </div>

                      {/* Actual Mockup of how it renders */}
                      <div className="bg-white border rounded-xl p-4 shadow-xs">
                        <div className="flex gap-2 mb-2">
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-[10px] font-semibold uppercase">{annCategory}</span>
                          <span className="text-[10px] text-stone-400 font-mono">Simulated date: Today</span>
                          <span className="ml-auto text-[10px] text-slate-600 bg-slate-100 px-1 rounded">Audience: {annTarget}</span>
                        </div>
                        <h4 className="text-sm font-bold text-stone-900">{annTitle}</h4>
                        <p className="text-xs text-stone-600 mt-2 leading-relaxed whitespace-pre-wrap">{annContent}</p>
                        <div className="text-[10px] text-stone-400 mt-3 border-t pt-2 italic">
                          Author representation: Mrs. Susan Dela Cruz (PTCA Admin Liaison)
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setAnnStage('write')}
                          className="px-3.5 py-1.5 bg-stone-200 text-stone-800 rounded text-xs font-semibold hover:bg-stone-300"
                        >
                          Modify Details
                        </button>
                        <button
                          onClick={handleAnnPublish}
                          className="px-3.5 py-1.5 bg-emerald-600 text-white rounded text-xs font-bold hover:bg-emerald-700 flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4" />
                          <span>Publish Notice</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {annStage === 'success' && (
                    <div className="max-w-md bg-emerald-50 border border-emerald-250 rounded-xl p-5 text-center space-y-3">
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 text-emerald-700">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-stone-800">Announcement Posted Successfully!</h4>
                      <p className="text-xs text-stone-600">The notice is now active and instantly readable on all Parent/Student and Teacher dashboards.</p>
                      
                      <div className="pt-2">
                        <button
                          onClick={handleAnnReset}
                          className="px-3.5 py-1.5 bg-emerald-600 text-white rounded text-xs font-bold hover:bg-emerald-700 transition"
                        >
                          Create Another Announcement?
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* --- TAB 2: UPLOAD STUDENT GRADES --- */}
              {activeAdminTab === 'grades-upload' && (
                <motion.div
                  key="admin-grades"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="space-y-4"
                >
                  <div className="pb-2 border-b">
                    <h3 className="text-sm font-bold text-stone-800 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-slate-700" />
                      <span>Admin Event List: Upload Student Academic Grades</span>
                    </h3>
                    <p className="text-xs text-stone-800">Provide term grades, examine registered students, and submit them directly to database.</p>
                  </div>

                  {!gradeUploadSuccess ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                      {/* Left side: select pupil */}
                      <div className="lg:col-span-5 space-y-3">
                        <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider font-mono">
                          Step 1: Select Student Name from Records
                        </label>

                        <div className="relative">
                          <Search className="w-4 h-4 text-stone-400 absolute left-2.5 top-2.5" />
                          <input
                            type="text"
                            placeholder="Type Pupil's registered name or school ID..."
                            value={gradeSearchName}
                            onChange={(e) => setGradeSearchName(e.target.value)}
                            className="w-full text-xs pl-8 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-slate-500 font-medium"
                          />
                        </div>

                        <div className="bg-stone-50 border border-stone-200 rounded-xl max-h-[220px] overflow-y-auto divide-y">
                          {filteredStudentsForGrade.length === 0 ? (
                            <p className="p-3 text-xs text-stone-400 italic">No registered pupils matched search filters.</p>
                          ) : (
                            filteredStudentsForGrade.map(s => (
                              <button
                                key={s.id}
                                onClick={() => {
                                  setSelectedStudentForGrade(s);
                                  addSystemLog(`Selected Student for grading input: ${s.name} (ID: ${s.id})`);
                                }}
                                className={`w-full px-3 py-2 text-left text-xs transition duration-150 flex justify-between items-center ${
                                  selectedStudentForGrade?.id === s.id 
                                    ? 'bg-slate-800 text-white font-bold' 
                                    : 'hover:bg-stone-100 flex text-stone-700'
                                }`}
                              >
                                <div>
                                  <p className="font-semibold">{s.name}</p>
                                  <p className={`text-[10px] ${selectedStudentForGrade?.id === s.id ? 'text-slate-300' : 'text-stone-400'}`}>
                                    ID: {s.id} • {s.yearLevel}
                                  </p>
                                </div>
                                <span className="text-[10px] uppercase text-b tracking-wider bg-black/45 px-1.5 py-0.5 rounded">
                                  Select
                                </span>
                              </button>
                            ))
                          )}
                        </div>

                        {selectedStudentForGrade && (
                          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs space-y-1">
                            <span className="font-bold font-mono uppercase text-[9px] text-emerald-800 block">Selected Active Student profile:</span>
                            <p className="font-bold text-stone-800">{selectedStudentForGrade.name}</p>
                            <p className="text-stone-600">ID: {selectedStudentForGrade.id} • Parent: {selectedStudentForGrade.parentName}</p>
                          </div>
                        )}
                      </div>

                      {/* Right side: inputs */}
                      <div className="lg:col-span-7 bg-stone-50/50 p-4 rounded-xl border border-stone-200">
                        <form onSubmit={handleUploadGradeSubmit} className="space-y-4">
                          <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider font-mono">
                            Step 2: Enter relevant grade information
                          </label>

                          <div className="grid grid-cols-2 gap-3 pb-2 border-b">
                            <div>
                              <label className="block text-[10px] text-stone-600 font-bold mb-1">Academic Year</label>
                              <select
                                value={selectedAcademicYear}
                                onChange={(e) => setSelectedAcademicYear(e.target.value)}
                                className="w-full text-xs p-1.5 bg-white border rounded"
                              >
                                <option value="2025-2026">2025-2026</option>
                                <option value="2026-2027">2026-2027</option>
                                <option value="2027-2028">2027-2028</option>
                                <option value="2028-2029">2028-2029</option>
                                <option value="2029-2030">2029-2030</option>
                                <option value="2030-2031">2030-2031</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10px] text-stone-600 font-bold mb-1">Grading Quarter Term</label>
                              <select
                                value={selectedTerm}
                                onChange={(e) => setSelectedTerm(e.target.value)}
                                className="w-full text-xs p-1.5 bg-white border rounded"
                              >   
                                <option value="1st Quarter">1st Quarter </option>
                                <option value="2nd Quarter">2nd Quarter </option>
                                <option value="3rd Quarter">3rd Quarter </option>
                                <option value="4th Quarter">4th Quarter </option>
                              </select>
                            </div>
                          </div>

                          <div className="bg-white p-3 rounded-lg border border-stone-150 space-y-2">
                            <span className="block text-[11px] font-bold text-stone-700">Subject Grade Inputs:</span>
                            
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {Object.entries(subjectScores).map(([subj, val]) => (
                                <div key={subj} className="space-y-0.5">
                                  <label className="block text-[10px] font-semibold text-stone-600 truncate">{subj}</label>
                                  <input
                                    type="number"
                                    required
                                    min="50"
                                    max="100"
                                    value={val}
                                    onChange={(e) => handleScoreChange(subj as keyof SubjectGrades, parseInt(e.target.value) || 0)}
                                    className="w-full text-xs px-2 py-1 border rounded focus:outline-none focus:border-slate-500 font-mono text-center font-bold"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-stone-600 mb-1">Teacher's Remarks / Evaluation Comments</label>
                            <input
                              type="text"
                              placeholder="e.g. Exhibited superb progress. Keep up the high effort!"
                              value={gradeComments}
                              onChange={(e) => setGradeComments(e.target.value)}
                              className="w-full text-xs p-2 bg-white border rounded focus:outline-none focus:border-slate-500"
                            />
                          </div>

                          <div className="pt-2">
                            <button
                              type="submit"
                              disabled={!selectedStudentForGrade}
                              className="w-full py-2 bg-slate-800 disabled:opacity-50 text-white font-semibold text-xs rounded hover:bg-slate-800 transition flex items-center justify-center gap-1"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>Upload Student Grades to Database</span>
                            </button>
                          </div>
                        </form>

                        <form onSubmit={handleAddAward} className="mt-4 rounded-xl border border-amber-200 bg-amber-50/80 p-4 shadow-sm space-y-3">
                          <div className="flex items-start gap-2">
                            <div className="rounded-full bg-amber-100 p-2 text-amber-700">
                              <Award className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-stone-800">Student Awards & Recognition</h4>
                              <p className="text-xs text-stone-600">Add a PTCA award here and it will appear in the parent/student milestone report.</p>
                            </div>
                          </div>

                          <div className="grid gap-3 md:grid-cols-2">
                            <div>
                              <label className="mb-1 block text-xs font-semibold text-stone-700">Student</label>
                              <select
                                value={awardStudentId}
                                onChange={(e) => {
                                  setAwardStudentId(e.target.value);
                                  setAwardSuccessMessage('');
                                }}
                                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700 outline-none focus:border-slate-500"
                              >
                                {students.map((student) => (
                                  <option key={student.id} value={student.id}>
                                    {student.name} (ID: {student.id})
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="mb-1 block text-xs font-semibold text-stone-700">Award</label>
                              <select
                                value={awardTitle}
                                onChange={(e) => {
                                  setAwardTitle(e.target.value);
                                  setAwardSuccessMessage('');
                                }}
                                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700 outline-none focus:border-slate-500"
                              >
                                {awardOptions.map((group) => (
                                  <optgroup key={group.label} label={group.label}>
                                    {group.options.map((option) => (
                                      <option key={option} value={option}>{option}</option>
                                    ))}
                                  </optgroup>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="mb-1 block text-xs font-semibold text-stone-700">Optional note</label>
                            <textarea
                              value={awardDescription}
                              onChange={(e) => setAwardDescription(e.target.value)}
                              rows={3}
                              placeholder="Add a short description for the milestone report..."
                              className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700 outline-none focus:border-slate-500"
                            />
                          </div>

                          {awardSuccessMessage && (
                            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                              {awardSuccessMessage}
                            </div>
                          )}

                          <button
                            type="submit"
                            className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-900"
                          >
                            <Award className="w-4 h-4" />
                            Save award to milestone report
                          </button>
                        </form>
                      </div>
                    </div>
                  ) : (
                    <div className="max-w-md bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center space-y-3">
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 text-emerald-700">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-stone-800">Grades Uploaded Successfully!</h4>
                      <p className="text-xs text-stone-600">The pupil's grade card has been archived and is immediately accessible to parents for feedback.</p>
                      
                      <div className="pt-2">
                        <button
                          onClick={handleGradeResetLoop}
                          className="px-3.5 py-1.5 bg-emerald-600 text-white rounded text-xs font-bold hover:bg-emerald-700 transition"
                        >
                          Loop: Process Another Student's Grades?
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* --- TAB 3: REGISTER NEW STUDENT Account --- */}
              {activeAdminTab === 'student-register' && (
                <motion.div
                  key="admin-register"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="space-y-4"
                >
                  <div className="pb-2 border-b">
                    <h3 className="text-sm font-bold text-stone-800 flex items-center gap-1.5">
                      <UserPlus className="w-4 h-4 text-slate-700" />
                      <span>Admin Event List: Register Pupil Account Info</span>
                    </h3>
                    <p className="text-xs text-stone-500">Record biographical details, set emergency guardian coordinates, and deploy ID registration.</p>
                  </div>

                  <form onSubmit={handleRegisterStudent} className="space-y-3 max-w-2xl bg-stone-50/50 p-4 rounded-xl border">
                    <span className="block text-[11px] font-bold text-stone-500 font-mono uppercase tracking-wider">NEW PUPIL ENROLLMENT PROFILE</span>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Pupil School ID Number (Unique)</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 1005"
                          value={newPupilId}
                          onChange={(e) => setNewPupilId(e.target.value)}
                          className="w-full text-xs p-2 bg-white border border-stone-300 rounded focus:outline-none focus:border-slate-500 font-mono font-semibold"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Pupil's Full Name (LastName, FirstName MI.)</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Dela Cruz, Cardo F."
                          value={newPupilName}
                          onChange={(e) => setNewPupilName(e.target.value)}
                          className="w-full text-xs p-2 bg-white border border-stone-300 rounded focus:outline-none focus:border-slate-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Enrollment Year Level</label>
                        <select
                          value={newPupilYear}
                          onChange={(e) => setNewPupilYear(e.target.value)}
                          className="w-full text-xs p-2 bg-white border border-stone-300 rounded focus:outline-none focus:border-emerald-500"
                        >
                          <option value="Grade 1">Grade 1 Department</option>
                          <option value="Grade 2">Grade 2 Department</option>
                          <option value="Grade 3">Grade 3 Department</option>
                          <option value="Grade 4">Grade 4 Department</option>
                          <option value="Grade 5">Grade 5 Department</option>
                          <option value="Grade 6">Grade 6 Department</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Pupil Birthday</label>
                        <input
                          type="date"
                          required
                          value={newPupilBirthday}
                          onChange={(e) => setNewPupilBirthday(e.target.value)}
                          className="w-full text-xs p-2 bg-white border border-stone-300 rounded focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Pupil Password</label>
                        <input
                          type="password"
                          required
                          value={newPupilPassword}
                          onChange={(e) => setNewPupilPassword(e.target.value)}
                          placeholder="Set account password"
                          className="w-full text-xs p-2 bg-white border border-stone-300 rounded focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Student Profile Photo</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0] ?? null;
                            if (file) {
                              handleRegisterPhotoUpload(file);
                            } else {
                              handleRegisterPhotoUpload(null);
                            }
                          }}
                          className="w-full text-xs file:block file:w-full file:border file:border-stone-300 file:px-2 file:py-2 file:rounded-md file:text-xs file:text-slate-700 file:bg-white"
                        />
                        {newPupilProfilePreview && (
                          <div className="mt-2 w-24 h-24 rounded-xl overflow-hidden border border-stone-200">
                            <img src={newPupilProfilePreview} alt="Pupil profile preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Parent/Guardian Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Juan Dela Cruz"
                          value={newPupilParentName}
                          onChange={(e) => setNewPupilParentName(e.target.value)}
                          className="w-full text-xs p-2 bg-white border border-stone-300 rounded focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Parent/Guardian Phone (SIM Target)</label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. +63 917 555 4321"
                          value={newPupilParentPhone}
                          onChange={(e) => setNewPupilParentPhone(e.target.value)}
                          className="w-full text-xs p-2 bg-white border border-stone-300 rounded focus:outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Parent/Guardian Email Address</label>
                        <input
                          type="email"
                          placeholder="e.g. guardian@example.com"
                          value={newPupilParentEmail}
                          onChange={(e) => setNewPupilParentEmail(e.target.value)}
                          className="w-full text-xs p-2 bg-white border border-stone-300 rounded focus:outline-none"
                        />
                      </div>
                    </div>

                    {registerSuccessMessage && (
                      <div className={`p-2.5 rounded text-xs font-medium ${
                        registerSuccessMessage.includes('✅') 
                          ? 'bg-emerald-50 text-emerald-800' 
                          : 'bg-rose-50 text-rose-700'
                      }`}>
                        {registerSuccessMessage}
                      </div>
                    )}

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-slate-800 text-white font-semibold text-xs rounded hover:bg-slate-900 transition flex items-center gap-1.5"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Save Pupil & Register Account</span>
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* --- TAB 4: ID ATTENDANCE IN & OUT WITH NOTIFICATIONS --- */}
              {activeAdminTab === 'attendance-scanner' && (
                <motion.div
                  key="admin-attendance"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="space-y-4"
                >
                  <div className="pb-2 border-b">
                    <h3 className="text-sm font-bold text-stone-800 flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-slate-700" />
                      <span>Admin Event List: ID School Attendance Portal</span>
                    </h3>
                    <p className="text-xs text-stone-500 font-sans">
                      Simulate classroom ID checks (Time-In) or specialized fetching protocols (Time-Out special days). Correct records auto-trigger guardian alerts.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    {/* Log action selector */}
                    <div className="lg:col-span-5 space-y-3">
                      <span className="block text-xs font-bold text-stone-500 font-mono uppercase tracking-wider">Select Attendance Scenario</span>
                      
                      <div className="flex gap-2 bg-stone-100 p-1.5 rounded-lg border border-stone-200">
                        <button
                          onClick={() => {
                            setScanType('IN');
                            setScanMessage('');
                            setScanError('');
                            setScannedStudent(null);
                          }}
                          className={`flex-1 py-1.5 rounded text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                            scanType === 'IN' 
                              ? 'bg-white text-stone-800 shadow-sm border border-stone-200/50' 
                              : 'text-stone-500 hover:text-stone-700'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5 text-blue-600" />
                          <span>Attendance IN (Time-In)</span>
                        </button>
                        <button
                          onClick={() => {
                            setScanType('OUT');
                            setScanMessage('');
                            setScanError('');
                            setScannedStudent(null);
                          }}
                          className={`flex-1 py-1.5 rounded text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                            scanType === 'OUT' 
                              ? 'bg-white text-stone-800 shadow-sm border border-stone-200/50' 
                              : 'text-stone-500 hover:text-stone-700'
                          }`}
                        >
                          <Award className="w-3.5 h-3.5 text-amber-600" />
                          <span>Special Day OUT (Fetching)</span>
                        </button>
                      </div>

                      {/* Pupil hot-links */}
                      <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 space-y-2">
                        <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block font-mono">
                          Simulated ID Scan Hot-List
                        </span>
                        <div className="space-y-1">
                          {students.map(st => (
                            <button
                              key={st.id}
                              onClick={() => handleSearchAttendanceStudent(st.id)}
                              className={`w-full text-left p-2 border rounded-lg text-xs hover:border-slate-500 transition duration-150 flex justify-between items-center bg-white ${
                                scannedStudent?.id === st.id ? 'border-indigo-600 bg-indigo-50/10' : 'border-stone-200'
                              }`}
                            >
                              <div>
                                <p className="font-bold text-stone-700">{st.name}</p>
                                <p className="text-[10px] text-stone-400 font-mono">ID: {st.id} • {st.yearLevel}</p>
                              </div>
                              <span className="text-[9px] font-mono px-1.5 py-0.5 bg-stone-100 rounded text-stone-500 font-bold uppercase transition">
                                Scan Code
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Active verification console */}
                    <div className="lg:col-span-7 bg-stone-50/50 p-4 rounded-xl border border-stone-200 flex flex-col justify-between min-h-[300px]">
                      <div>
                        <div className="flex justify-between items-center mb-3 pb-2 border-b">
                          <span className="text-xs font-bold font-mono tracking-wide uppercase text-slate-800">
                            Scan ID Verification Desk
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                            scanType === 'IN' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            Mode: {scanType === 'IN' ? 'Daily Check-In' : 'Special Day Fetching'}
                          </span>
                        </div>

                        {/* ID Input container */}
                        <div className="space-y-2 mb-4">
                          <label className="block text-xs font-semibold text-stone-700">Enter or Scan Pupil School ID</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="e.g. 1001"
                              value={inputScanId}
                              onChange={(e) => handleSearchAttendanceStudent(e.target.value)}
                              className="w-full text-xs p-2 bg-white border border-stone-300 rounded font-mono font-bold"
                            />
                          </div>
                        </div>

                        {/* Verification feedback info */}
                        {scannedStudent ? (
                          <div className="bg-white border rounded-xl p-3.5 space-y-2 relative border-indigo-200">
                            <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded font-mono text-[9px]">
                              <Check className="w-3 h-3" />
                              <span>Pupil Validated</span>
                            </div>

                            <p className="text-xs font-bold uppercase font-mono text-stone-400 tracking-wider">Registration details matched:</p>
                            
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-stone-400 text-[10px] block">PUPIL NAME:</span>
                                <strong className="text-stone-800">{scannedStudent.name}</strong>
                              </div>
                              <div>
                                <span className="text-stone-400 text-[10px] block">YEAR LEVEL:</span>
                                <strong className="text-stone-800 font-mono text-[11px]">{scannedStudent.yearLevel}</strong>
                              </div>
                              <div>
                                <span className="text-stone-400 text-[10px] block">PARENT / GUARDIAN:</span>
                                <strong className="text-stone-800">{scannedStudent.parentName}</strong>
                              </div>
                              <div>
                                <span className="text-stone-400 text-[10px] block">REGISTERED MOBILE:</span>
                                <strong className="text-stone-850 font-mono">{scannedStudent.parentPhone}</strong>
                              </div>
                            </div>
                          </div>
                        ) : (
                          inputScanId.trim() && (
                            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-1.5">
                              <AlertTriangle className="w-4 h-4 shrink-0" />
                              <span>School ID not recognized. Input correct Pupil ID or register profile.</span>
                            </div>
                          )
                        )}

                        {scanMessage && (
                          <div className="mt-3 p-3 bg-emerald-50 border border-emerald-250 text-emerald-800 rounded-lg text-xs font-sans">
                            {scanMessage}
                          </div>
                        )}

                        {scanError && (
                          <div className="mt-3 p-2 bg-rose-50 border border-rose-100 text-rose-600 rounded text-xs font-mono">
                            {scanError}
                          </div>
                        )}
                      </div>

                      {/* Trigger Actions */}
                      <div className="mt-4 pt-3 border-t border-stone-200">
                        {scanType === 'IN' ? (
                          <button
                            type="button"
                            onClick={handleProcessAttendanceIn}
                            disabled={!scannedStudent}
                            className="w-full py-2 bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded hover:bg-slate-900 transition flex items-center justify-center gap-1"
                          >
                            <BellRing className="w-4 h-4 text-yellow-300 animate-pulse" />
                            <span>Validate & Record Attendance IN (Trigger Notice)</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={handleProcessAttendanceOut}
                            disabled={!scannedStudent}
                            className="w-full py-2 bg-indigo-700 disabled:opacity-90 text-white font-bold text-xs rounded hover:bg-indigo-800 transition flex items-center justify-center gap-1"
                          >
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            <span>Authorize Fetched OUT Special Day (Trigger pickup Notice)</span>
                          </button>
                        )}
                      </div>

                    </div>
                  </div>
                </motion.div>
              )}

              {/* --- TAB 5: STUDENT DIRECTORY --- */}
              {activeAdminTab === 'student-list' && (
                <motion.div
                  key="admin-student-list"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="space-y-4"
                >
                  <div className="pb-2 border-b">
                    <h3 className="text-sm font-bold text-stone-800 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-slate-700" />
                      <span>Admin Event List: Uploaded Student Directory</span>
                    </h3>
                    <p className="text-xs text-stone-500">All students registered by the admin are listed here.</p>
                  </div>

                  <div className="relative max-w-xl">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      value={studentDirectoryQuery}
                      onChange={(e) => setStudentDirectoryQuery(e.target.value)}
                      placeholder="Search by student name or ID"
                      className="w-full rounded-lg border border-stone-300 bg-stone-50 py-2 pl-9 pr-3 text-sm text-stone-700 outline-none focus:border-slate-500"
                    />
                  </div>

                  {students.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-stone-300 p-6 text-center text-sm text-stone-500">
                      No students have been uploaded yet.
                    </div>
                  ) : filteredStudentsForDirectory.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-stone-300 p-6 text-center text-sm text-stone-500">
                      No students match that search.
                    </div>
                  ) : (
                    <div className="grid gap-3 md:grid-cols-2">
                      {filteredStudentsForDirectory.map((student) => (
                        <div key={student.id} className="rounded-xl border border-stone-200 bg-stone-50 p-4 shadow-sm">
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <p className="text-sm font-semibold text-stone-800">{student.name}</p>
                              <p className="text-xs text-stone-500">ID: {student.id}</p>
                            </div>
                            <span className="rounded-full bg-slate-800 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                              {student.yearLevel}
                            </span>
                          </div>
                          <div className="mt-3 space-y-1 text-xs text-stone-600">
                            <p><span className="font-semibold">Parent:</span> {student.parentName}</p>
                            <p><span className="font-semibold">Phone:</span> {student.parentPhone}</p>
                            <p><span className="font-semibold">Birthday:</span> {student.birthday}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* --- TAB 6: FEEDBACKS LOGGER REVIEW --- */}
              {activeAdminTab === 'reviews' && (
                <motion.div
                  key="admin-reviews"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="space-y-4"
                >
                  <div className="pb-2 border-b">
                    <h3 className="text-sm font-bold text-stone-800 flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-slate-700" />
                      <span>Admin Event List: Submitted Feedback & Reply Monitor</span>
                    </h3>
                    <p className="text-xs text-stone-500">Examine written communication, parent comments concerning academic grades, and posted query logs.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Column 1: Academic Grades Feedbacks */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-indigo-700 pb-1 border-b">
                        📊 Grade Catalog Feedbacks ({feedbacks.length})
                      </h4>

                      {feedbacks.length === 0 ? (
                        <p className="text-xs text-stone-400 italic">No parent evaluation comments submitted yet.</p>
                      ) : (
                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                          {feedbacks.map((fb) => (
                            <div key={fb.id} className="bg-stone-50 border p-3 rounded-lg text-xs whitespace-normal">
                              <div className="flex justify-between items-center text-[10px] text-stone-400 mb-1">
                                <span className="font-semibold text-stone-700">By: {fb.parentName}</span>
                                <span>{new Date(fb.timestamp).toLocaleDateString()}</span>
                              </div>
                              <p className="text-stone-500 font-mono text-[10px] mb-1">Concerning: {fb.studentName} (ID: {fb.studentId})</p>
                              <p className="text-stone-800 bg-white p-2 rounded border italic">"{fb.comment}"</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Column 2: Announcement Replies (Read & Reply logs) */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-emerald-700 pb-1 border-b">
                        📣 Announcement Dialogue Replies
                      </h4>

                      <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        {announcements.flatMap(ann => 
                          (ann.replies || []).map(rep => ({
                            annId: ann.id,
                            annTitle: ann.title,
                            ...rep
                          }))
                        ).length === 0 ? (
                          <p className="text-xs text-stone-400 italic">No parent interactive responses left on announcements.</p>
                        ) : (
                          announcements.flatMap(ann => 
                            (ann.replies || []).map(rep => (
                              <div key={rep.id} className="bg-stone-50 border p-3 rounded-lg text-xs">
                                <div className="flex justify-between items-center text-[10px] text-stone-400 mb-0.5">
                                  <span className="font-semibold text-stone-700">Anonymous Parent</span>
                                  <span>{new Date(rep.timestamp).toLocaleDateString()}</span>
                                </div>
                                <p className="text-[10px] text-stone-800 truncate mb-1.5">On: "{ann.title}"</p>
                                <p className="text-stone-850 p-2 bg-white rounded border">"{rep.content}"</p>
                              </div>
                            ))
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
