/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Student, Grade, Announcement, Milestone, Feedback, Reply } from '../types';
import { 
  BookOpen, 
  Award, 
  Megaphone, 
  MessageSquare, 
  Send, 
  SendHorizontal, 
  AlertCircle, 
  TrendingUp, 
  User, 
  LogOut, 
  Calendar,
  CheckCircle, 
  Clock, 
  Eye, 
  Heart,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface UserPortalProps {
  students: Student[];
  grades: Grade[];
  announcements: Announcement[];
  milestones: Milestone[];
  feedbacks: Feedback[];
  onAddReplyToAnnouncement: (announcementId: string, reply: Reply) => void;
  onAddFeedbackToGrade: (feedback: Feedback) => void;
  onDispatchMilestoneAcknowledgment: (milestoneId: string) => void;
  addSystemLog: (text: string) => void;
  isLogged: boolean;
  setIsLogged: (val: boolean) => void;
  selectedStudent: Student | null;
  setSelectedStudent: (student: Student | null) => void;
}

export default function UserPortal({
  students,
  grades,
  announcements,
  milestones,
  feedbacks,
  onAddReplyToAnnouncement,
  onAddFeedbackToGrade,
  onDispatchMilestoneAcknowledgment,
  addSystemLog,
  isLogged,
  setIsLogged,
  selectedStudent,
  setSelectedStudent
}: UserPortalProps) {
  // Authentication states
  const [studentIdInput, setStudentIdInput] = useState<string>('');
  const [birthdayInput, setBirthdayInput] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Tab View inside Portal
  // "announcements" | "grades" | "reports"
  const [activeTab, setActiveTab] = useState<'announcements' | 'grades' | 'reports'>('announcements');

  // Announcement details
  const [replyInput, setReplyInput] = useState<{ [announcementId: string]: string }>({});
  const [replyDecision, setReplyDecision] = useState<{ [announcementId: string]: 'YES' | 'NO' | null }>({});

  // Grade feedback composing
  const [gradeFeedbackInput, setGradeFeedbackInput] = useState<{ [gradeId: string]: string }>({});
  const [showFeedbackModal, setShowFeedbackModal] = useState<string | null>(null); // holds grade.id

  // Quick Account Login Selector for evaluation convenience
  const handleQuickLogin = (student: Student) => {
    setSelectedStudent(student);
    setStudentIdInput(student.id);
    setBirthdayInput(student.birthday);
    setIsLogged(true);
    setErrorMessage('');
    addSystemLog(`User Login: ${student.parentName} (${student.parentPhone}) logged in for Student ${student.name}`);
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentIdInput.trim()) {
      setErrorMessage('Please enter Pupil ID');
      return;
    }

    const found = students.find(s => s.id === studentIdInput.trim());
    if (found) {
      setSelectedStudent(found);
      setIsLogged(true);
      setErrorMessage('');
      addSystemLog(`User Login: Authentication successful for Pupil ID ${found.id} (${found.name})`);
    } else {
      setErrorMessage('Student ID not registered. Refer to Admin to register an account.');
    }
  };

  const handleLogout = () => {
    addSystemLog(`User Logout: Session closed for student ${selectedStudent?.name}`);
    setIsLogged(false);
    setSelectedStudent(null);
    setStudentIdInput('');
    setBirthdayInput('');
  };

  // Reply Event List: Composing and Sending replies
  const handleToggleDecision = (announcementId: string, decision: 'YES' | 'NO') => {
    setReplyDecision(prev => ({ ...prev, [announcementId]: decision }));
    if (decision === 'NO') {
      addSystemLog(`User read announcement "${announcements.find(a => a.id === announcementId)?.title.slice(0, 25)}..." and selected [NO] feedback reply`);
    }
  };

  const handleSubmitReply = (announcementId: string) => {
    const text = replyInput[announcementId]?.trim();
    if (!text) return;

    const newReply: Reply = {
      id: "rep-" + Date.now(),
      authorName: selectedStudent ? selectedStudent.parentName : "Parent User",
      role: 'Parent',
      content: text,
      timestamp: new Date().toISOString()
    };

    onAddReplyToAnnouncement(announcementId, newReply);
    
    // Clear state
    setReplyInput(prev => ({ ...prev, [announcementId]: '' }));
    setReplyDecision(prev => ({ ...prev, [announcementId]: null }));
    
    addSystemLog(`Reply sent by Parent to announcement ID ${announcementId}: "${text.slice(0, 25)}..."`);
  };

  // Grade Feedback submitting
  const handleSubmitGradeFeedback = (gradeId: string) => {
    const text = gradeFeedbackInput[gradeId]?.trim();
    if (!text) return;

    if (!selectedStudent) return;

    const newFeedback: Feedback = {
      id: "fb-" + Date.now(),
      gradeId: gradeId,
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      parentName: selectedStudent.parentName,
      comment: text,
      timestamp: new Date().toISOString()
    };

    onAddFeedbackToGrade(newFeedback);
    setGradeFeedbackInput(prev => ({ ...prev, [gradeId]: '' }));
    setShowFeedbackModal(null);
    addSystemLog(`Feedback submitted by parent for Grade assessment record ${gradeId}: "${text.slice(0, 25)}..."`);
  };

  // System congratulations trigger
  const handleAcknowledgeMilestone = (milestoneId: string, milestoneTitle: string) => {
    onDispatchMilestoneAcknowledgment(milestoneId);
    addSystemLog(`Official Congratulations Notice & digital certificate dispatched to ${selectedStudent?.name} for "${milestoneTitle}"!`);
  };

  const studentGrades = selectedStudent ? grades.filter(g => g.studentId === selectedStudent.id) : [];
  const studentMilestones = selectedStudent ? milestones.filter(m => m.studentId === selectedStudent.id) : [];

  return (
    <div className="w-full max-w-7xl mx-auto px-4" id="user-portal-container">
      {!isLogged ? (
        <div className="max-w-md mx-auto my-6" id="user-login-box">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-850 mb-3 shadow-xs border border-emerald-250">
              <BookOpen className="w-6 h-6 text-emerald-700" />
            </div>
            <h2 className="text-xl font-extrabold font-display text-slate-850 tracking-tight">TCM Elementary Department</h2>
            <p className="text-xs font-mono text-emerald-700 mt-1.5 uppercase tracking-widest font-extrabold">Parents & Students Portal</p>
            <p className="text-xs text-slate-500 mt-2 max-w-xs mx-auto  -relaxed">Access actual school grade releases, announcements, and simulated safety logs</p>
          </div>

          {/* Quick Login selector for convenience */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 mb-5" id="user-quick-login-list">
            <span className="text-xs font-semibold font-mono text-stone-500 block mb-2 uppercase tracking-wide">
              ⚡ Sandbox Utility: Quick Account Hot-Login
            </span>
            <div className="grid grid-cols-2 gap-2">
              {students.map(s => (
                <button
                  key={s.id}
                  onClick={() => handleQuickLogin(s)}
                  className="p-2 text-left bg-white border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/20 rounded-lg text-xs transition duration-200 pointer-events-auto"
                >
                  <p className="font-semibold text-stone-800 truncate">{s.name}</p>
                  <p className="text-stone-500 text-[10px] uppercase font-mono mt-0.5">{s.yearLevel} • ID: {s.id}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Manual Login Form */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-stone-700 mb-4">Credentials Login</h3>
            <form onSubmit={handleManualLogin} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  Pupil School ID Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1001"
                  value={studentIdInput}
                  onChange={(e) => setStudentIdInput(e.target.value)}
                  className="w-full text-sm px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1 flex justify-between">
                  <span>Pupil Birthdate (Verification)</span>
                  <span className="text-stone-400 text-[10px] font-normal">Optional in Sandbox</span>
                </label>
                <input
                  type="date"
                  value={birthdayInput}
                  onChange={(e) => setBirthdayInput(e.target.value)}
                  className="w-full text-sm px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>

              {errorMessage && (
                <div className="flex items-center gap-1.5 p-2 bg-rose-50 text-rose-600 rounded-lg text-xs">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2 bg-emerald-600 text-white font-medium rounded-lg text-sm hover:bg-emerald-700 transition flex items-center justify-center gap-2"
              >
                <span>Access Student Information</span>
                <SendHorizontal className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="space-y-4" id="user-portal-dashboard">
          {/* Active Student Header Bar */}
          <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 text-white p-4 sm:p-5 rounded-xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-emerald-700 text-white rounded text-[10px] font-mono uppercase font-semibold">
                  {selectedStudent?.yearLevel}
                </span>
                <span className="text-xs font-mono text-emerald-300">Pupil school record</span>
              </div>

               <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-neutral-100">
                <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-3 py-2 ring-1 ring-white/10">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                    {selectedStudent?.profilePicture ? (
                      <img
                        src={selectedStudent.profilePicture}
                        alt={`${selectedStudent.name} profile`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      selectedStudent?.name.split(' ').map(n => n[0]).slice(0,2).join('')
                    )}
                  </div>
                  <div className="leading-tight">
                    <p className="text-xs uppercase tracking-[0.18em] text-emerald-200">Student Profile</p>
                    <p className="font-semibold">{selectedStudent?.name}</p>
                  </div>
                </div>
              </div>

              <h2 className="text-lg font-bold mt-1 font-sans text-neutral-50">{selectedStudent?.name}</h2>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-300">
                <span><span>Guardian: </span><strong className="text-white">{selectedStudent?.parentName}</strong></span>
                <span><span>Contact: </span><strong className="text-white font-mono">{selectedStudent?.parentPhone}</strong></span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-emerald-900 hover:bg-emerald-800 text-white border border-emerald-700/50 rounded-lg text-xs flex items-center gap-1.5 transition self-stretch sm:self-auto justify-center"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out portal</span>
            </button>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-stone-200">
            <button
              onClick={() => setActiveTab('announcements')}
              className={`px-3 py-1.5 bg-emerald-900 hover:bg-emerald-800 text-white border border-emerald-700/50 rounded-lg text-xs flex items-center gap-1.5 transition self-stretch sm:self-auto justify-center ${
                activeTab === 'announcements' 
                  ? 'border-emerald-600 text-emerald-700' 
                  : 'border-transparent text-stone-500'
              }`}
            >
              <Megaphone className="w-3.5 h-3.5" />
              <span>Announcements ({announcements.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('grades')}
              className={`px-3 py-1.5 bg-emerald-900 hover:bg-emerald-800 text-white border border-emerald-700/50 rounded-lg text-xs flex items-center gap-1.5 transition self-stretch sm:self-auto justify-center ${
                activeTab === 'grades' 
                  ? 'border-emerald-600 text-emerald-700' 
                  : 'border-transparent text-stone-500'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Academic Grades ({studentGrades.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-3 py-1.5 bg-emerald-900 hover:bg-emerald-800 text-white border border-emerald-700/50 rounded-lg text-xs flex items-center gap-1.5 transition self-stretch sm:self-auto justify-center ${
                activeTab === 'reports' 
                  ? 'border-emerald-600 text-emerald-700' 
                  : 'border-transparent text-stone-500'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Milestone Reports ({studentMilestones.length})</span>
            </button>
          </div>

          {/* Main Views Container */}
          <div className="bg-white rounded-xl border border-stone-200/80 p-4 min-h-[300px] bg-white/80 shadow-sm" id="user-portal-main-view">
            <AnimatePresence mode="wait">
              {activeTab === 'announcements' && (
                <motion.div
                  key="announcements"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="space-y-4"
                  id="announcements-section"
                >
                  <div className="flex justify-between items-center pb-2 border-b border-stone-100">
                    <h3 className="text-sm font-bold text-stone-800">Department School Announcements</h3>
                    <span className="text-xs font-mono text-stone-800">Class Link Feed</span>
                  </div>

                  {announcements.length === 0 ? (
                    <div className="text-center py-12 text-stone-400 text-xs">
                      No announcements posted yet. Check back later.
                    </div>
                  ) : (
                    <div className="divide-y divide-stone-100">
                      {announcements.map((ann) => (
                        <div key={ann.id} className="py-4 first:pt-0 last:pb-0" id={`ann-card-${ann.id}`}>
                          {/* Announcement Metadata */}
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold font-mono ${
                                ann.category === 'Urgent' 
                                  ? 'bg-rose-100 text-rose-700' 
                                  : ann.category === 'PTCA Meeting'
                                  ? 'bg-amber-100 text-amber-700'
                                  : ann.category === 'Event'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-stone-100 text-stone-700'
                              }`}>
                                {ann.category}
                              </span>
                              <span className="text-[11px] font-mono text-stone-800">
                                {new Date(ann.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            </div>
                            <span className="text-[11px] font-mono text-stone-500 bg-stone-50 px-2 py-0.5 rounded border border-stone-150">
                              Audience: {ann.targetAudience}
                            </span>
                          </div>

                          <h4 className="text-sm font-bold text-stone-800">{ann.title}</h4>
                          <p className="text-xs text-stone-600 mt-1.5 leading-relaxed bg-stone-50 p-3 rounded-lg border border-stone-150">
                            {ann.content}
                          </p>

                          <div className="mt-2 text-[11px] text-stone-900 flex items-center gap-1.5 pl-1 italic">
                            <span>Posted by:</span>
                            <span className="font-semibold text-emerald-700 not-italic">{ann.author}</span>
                          </div>

                          {/* Existing Replies view */}
                          <div className="mt-3 pl-4 border-l-2 border-stone-200 space-y-2">
                            {ann.replies && ann.replies.length > 0 && (
                              <div className="text-[10px] font-bold text-stone-800 uppercase tracking-wider mb-1">
                                Comments & Replies List ({ann.replies.length})
                              </div>
                            )}
                            {ann.replies?.map((rep) => (
                              <div key={rep.id} className="bg-stone-50 p-2 rounded text-xs border border-stone-100">
                                <div className="flex justify-between items-center text-[10px] mb-1">
                                  <span className="font-semibold text-stone-700">{rep.authorName} ({rep.role})</span>
                                  <span className="font-mono text-stone-400">{new Date(rep.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                </div>
                                <p className="text-stone-600">{rep.content}</p>
                              </div>
                            ))}
                          </div>

                          {/* Read & Reply event list interactivity */}
                          <div className="mt-3 bg-stone-50/50 rounded-lg p-3 border border-stone-200/60 max-w-lg">
                            <p className="text-xs font-semibold text-stone-700 mb-2 flex items-center gap-1">
                              <MessageSquare className="w-3.5 h-3.5 text-emerald-900" />
                              <span>Do you want to reply to this announcement?</span>
                            </p>

                            <div className="flex gap-2 mb-2">
                              <button
                                onClick={() => handleToggleDecision(ann.id, 'YES')}
                                className={`px-3 py-1 rounded text-xs font-semibold transition ${
                                  replyDecision[ann.id] === 'YES'
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-white text-stone-600 border border-stone-300 hover:bg-stone-50'
                                }`}
                              >
                                YES, write a reply
                              </button>
                              <button
                                onClick={() => handleToggleDecision(ann.id, 'NO')}
                                className={`px-3 py-1 rounded text-xs font-semibold transition ${
                                  replyDecision[ann.id] === 'NO'
                                    ? 'bg-stone-300 text-stone-800'
                                    : 'bg-white text-stone-600 border border-stone-300 hover:bg-stone-50'
                                }`}
                              >
                                NO, bypass reply
                              </button>
                            </div>

                            {replyDecision[ann.id] === 'YES' && (
                              <div className="space-y-2 mt-2">
                                <textarea
                                  placeholder="Type your concern or acknowledgement message here..."
                                  value={replyInput[ann.id] || ''}
                                  onChange={(e) => setReplyInput(prev => ({ ...prev, [ann.id]: e.target.value }))}
                                  rows={2}
                                  className="w-full text-xs p-2 border border-stone-300 rounded focus:outline-none focus:border-emerald-500 bg-white"
                                />
                                <div className="flex justify-end">
                                  <button
                                    onClick={() => handleSubmitReply(ann.id)}
                                    disabled={!replyInput[ann.id]?.trim()}
                                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold rounded flex items-center gap-1 transition"
                                  >
                                    <span>Send Reply</span>
                                    <Send className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            )}

                            {replyDecision[ann.id] === 'NO' && (
                              <p className="text-[11px] text-stone-500 italic mt-1 font-mono">
                                Option bypassed. You have acknowledged reading this announcement.
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'grades' && (
                <motion.div
                  key="grades"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="space-y-4"
                  id="grades-section"
                >
                  <div className="flex justify-between items-center pb-2 border-b border-stone-100">
                    <h3 className="text-sm font-bold text-stone-800">Academic Progress Standards</h3>
                    <span className="text-xs font-mono text-stone-400">Official Report Cards</span>
                  </div>

                  {studentGrades.length === 0 ? (
                    <div className="bg-stone-50 border border-dashed border-stone-300 rounded-lg p-8 text-center text-stone-500 text-xs">
                      No academic grade reports have been uploaded by the administration for this pupil yet.
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {studentGrades.map((g) => {
                        const scoreValues = Object.values(g.grades);
                        const average = parseFloat((scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length).toFixed(1));
                        
                        return (
                          <div key={g.id} className="border border-stone-200 rounded-xl p-4 sm:p-5 bg-white shadow-xs" id={`grade-report-${g.id}`}>
                            {/* Academic Header */}
                            <div className="flex justify-between items-start gap-2 mb-4">
                              <div>
                                <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded text-[10px] font-mono font-bold uppercase">
                                  {g.term} • S.Y. {g.academicYear}
                                </span>
                                <p className="text-xs text-stone-400 font-mono mt-1">Uploaded on: {new Date(g.uploadedAt).toLocaleDateString()}</p>
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] text-stone-400 font-mono block">GENERAL AVERAGE</span>
                                <span className={`text-xl font-black font-mono ${average >= 90 ? 'text-emerald-700' : 'text-stone-700'}`}>
                                  {average}%
                                </span>
                              </div>
                            </div>

                            {/* Subjects Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {Object.entries(g.grades).map(([subj, val]) => (
                                <div key={subj} className="bg-stone-50 border border-stone-100/80 rounded-lg p-2 flex justify-between items-center">
                                  <span className="text-xs font-semibold text-stone-600 truncate mr-1">{subj}</span>
                                  <span className={`text-xs font-bold font-mono px-1.5 py-0.5 rounded ${
                                    val >= 90 
                                      ? 'bg-emerald-50 text-emerald-700 font-extrabold' 
                                      : val >= 80 
                                      ? 'bg-stone-100 text-stone-800' 
                                      : 'bg-rose-50 text-rose-700'
                                  }`}>
                                    {val}
                                  </span>
                                </div>
                              ))}
                            </div>

                            {g.comments && (
                              <div className="mt-4 p-3 bg-amber-50/20 border border-amber-200/50 rounded-lg">
                                <p className="text-[11px] font-bold text-amber-800 font-mono uppercase tracking-wider">Teacher's Evaluation Comment:</p>
                                <p className="text-xs text-stone-600 mt-1 italic">"{g.comments}"</p>
                              </div>
                            )}

                            {/* Feedback Event list interactivity */}
                            <div className="mt-4 pt-3 border-t border-stone-100 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                              <span className="text-xs text-stone-500 font-sans">
                                Do you have feedback or concerns regarding these grades?
                              </span>

                              {showFeedbackModal !== g.id ? (
                                <button
                                  onClick={() => setShowFeedbackModal(g.id)}
                                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-700 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1"
                                >
                                  <MessageSquare className="w-3.5 h-3.5 text-stone-500" />
                                  <span>Yes, leave grade feedback</span>
                                </button>
                              ) : (
                                <div className="w-full space-y-2 mt-2">
                                  <textarea
                                    required
                                    placeholder="Compose your feedback, comments, or concerns for the class advisor..."
                                    value={gradeFeedbackInput[g.id] || ''}
                                    onChange={(e) => setGradeFeedbackInput(prev => ({ ...prev, [g.id]: e.target.value }))}
                                    rows={2}
                                    className="w-full text-xs p-2 border border-stone-300 rounded focus:outline-none focus:border-emerald-500 bg-white"
                                  />
                                  <div className="flex justify-end gap-2">
                                    <button
                                      onClick={() => setShowFeedbackModal(null)}
                                      className="px-2.5 py-1 text-xs text-stone-500 bg-stone-50 border border-stone-200 rounded"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={() => handleSubmitGradeFeedback(g.id)}
                                      disabled={!gradeFeedbackInput[g.id]?.trim()}
                                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold rounded flex items-center gap-1 transition"
                                    >
                                      <span>Submit Comments</span>
                                      <Send className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Historical Feedbacks on this Grade report */}
                            {feedbacks.filter(fb => fb.gradeId === g.id).length > 0 && (
                              <div className="mt-3 pl-3 border-l-2 border-emerald-500 space-y-2">
                                <p className="text-[10px] uppercase font-bold text-emerald-750 font-mono tracking-wider">Submitted Feedbacks:</p>
                                {feedbacks.filter(fb => fb.gradeId === g.id).map(fb => (
                                  <div key={fb.id} className="text-xs bg-stone-50/50 p-2 rounded border border-stone-100">
                                    <div className="flex justify-between items-center text-[10px] text-stone-400 mb-0.5">
                                      <span>By: {fb.parentName}</span>
                                      <span>{new Date(fb.timestamp).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-stone-600 italic">"{fb.comment}"</p>
                                  </div>
                                ))}
                              </div>
                            )}

                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'reports' && (
                <motion.div
                  key="reports"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="space-y-4"
                  id="reports-section"
                >
                  <div className="flex justify-between items-center pb-2 border-b border-stone-100">
                    <h3 className="text-sm font-bold text-stone-800">Student Performance Achievements</h3>
                    <span className="text-xs font-mono text-stone-400">Milestone Certificates</span>
                  </div>

                  {studentMilestones.length === 0 ? (
                    <div className="text-center py-12 text-stone-400 text-xs">
                      No registered milestone records or performance awards for this student yet.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {studentMilestones.map((mile) => (
                        <div key={mile.id} className="bg-amber-50/10 border border-amber-200/80 rounded-xl p-4 flex gap-3.5 relative overflow-hidden" id={`milestone-card-${mile.id}`}>
                          {/* Left Ribbon Accent */}
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500" />
                          
                          <div className="mt-1 flex items-center justify-center w-10 h-10 rounded-full bg-amber-50 text-amber-600 shrink-0 border border-amber-200">
                            <Award className="w-5.5 h-5.5" />
                          </div>

                          <div className="space-y-1 w-full">
                            <div className="flex flex-wrap justify-between items-start gap-1">
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-[9px] font-mono font-bold uppercase">
                                {mile.category}
                              </span>
                              <span className="text-[11px] font-mono text-stone-400">{mile.date}</span>
                            </div>

                            <h4 className="text-sm font-bold text-stone-800">{mile.title}</h4>
                            <p className="text-xs text-stone-600">{mile.description}</p>

                            {/* Reports Event List point 3: System processes and dispatches official acknowledgment notice */}
                            <div className="pt-2 mt-2 border-t border-stone-200/50 flex flex-wrap justify-between items-center gap-2">
                              {mile.notified ? (
                                <div className="flex items-center gap-1 text-emerald-600 text-xs font-mono bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  <span>Official Congratulations & Digital Certificate Dispatched!</span>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleAcknowledgeMilestone(mile.id, mile.title)}
                                  className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition duration-150 flex items-center gap-1 shadow-sm"
                                >
                                  <Send className="w-3 h-3" />
                                  <span>Acknowledge Portal Report & Dispatch Congratulatory Notice</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
