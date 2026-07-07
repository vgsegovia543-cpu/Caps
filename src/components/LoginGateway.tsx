/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Student } from '../types';
import { 
  Lock, 
  User, 
  BookOpen, 
  ArrowRight, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles,
  Smartphone,
  Eye,
  CheckCircle,
  Users
} from 'lucide-react';
import { motion } from 'motion/react';

interface LoginGatewayProps {
  students: Student[];
  activeRole: 'admin' | 'user';
  onAdminLoginSuccess: () => void;
  onUserLoginSuccess: (student: Student) => void;
  addSystemLog: (text: string, type: 'sms' | 'sys' | 'success') => void;
}

export default function LoginGateway({
  students,
  activeRole,
  onAdminLoginSuccess,
  onUserLoginSuccess,
  addSystemLog
}: LoginGatewayProps) {
  
  // Admin credentials state
  const [adminUser, setAdminUser] = useState('admin');
  const [adminPass, setAdminPass] = useState('admin123');
  const [adminError, setAdminError] = useState('');

  // Parent login state
  const [pupilId, setPupilId] = useState('');
  const [pupilPassword, setPupilPassword] = useState('');
  const [parentError, setParentError] = useState('');

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUser === 'admin' && adminPass === 'admin123') {
      setAdminError('');
      addSystemLog('Admin Identity Verified successfully via Security Gateway.', 'success');
      onAdminLoginSuccess();
    } else {
      setAdminError('Invalid administrative key or username.');
    }
  };

  const handleParentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pupilId.trim() || !pupilPassword.trim()) {
      setParentError('Please input both Pupil ID and password.');
      return;
    }
    const student = students.find(s => s.id === pupilId.trim());
    if (!student) {
      setParentError('Pupil ID unrecognized. Check the Quick Demo directory.');
      return;
    }
    if (student.accountPassword !== pupilPassword.trim()) {
      setParentError('Invalid pupil password. Please try again.');
      return;
    }
    setParentError('');
    addSystemLog(`Parent Access Granted: Checked in for ${student.name}`, 'success');
    onUserLoginSuccess(student);
  };

  const selectQuickStudent = (student: Student) => {
    setPupilId(student.id);
    setPupilPassword(student.accountPassword || '');
    setParentError('');
    addSystemLog(`Parent Quick-Access link tapped: Pre-filling login fields for ${student.name}`, 'sys');
  };

  return (
    <div className="w-full flex flex-col items-center py-6 sm:py-10 px-4 bg-transparent" id="login-gateway-container">
      {/* Visual Header Branding */}
      <div className="text-center max-w-xl mb-8" id="gateway-branding">
        <div className={`inline-flex items-center justify-center w-14 h-14 text-white rounded-2xl mb-4 shadow-md ${activeRole === 'admin' ? 'bg-gradient-to-tr from-blue-700 to-indigo-600' : 'bg-gradient-to-tr from-emerald-600 to-emerald-400'}`}>
          <BookOpen className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
          PTCA Class Link Gateway
        </h1>
        <p className="text-xs sm:text-sm text-slate-1000 mt-2 font-sans max-w-sm mx-auto leading-relaxed">
          The collaborative communications and student tracker hub for the <span className="font-semibold text-slate-1000">TCM Elementary Department</span>.
        </p>
      </div>

      {/* Main Switcher Box Wrapper */}
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-lg shadow-slate-100 overflow-hidden" id="gateway-card-holder">
        {/* Toggle Switch Tabs */}
        <div className={`flex bg-slate-50 border-b border-slate-200 p-1.5 ${activeRole === 'admin' ? 'bg-blue-100' : 'bg-emerald-100'}`} id="gateway-tabs-tablist">
          {activeRole === 'user' ? (
            <div className="flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-150 flex items-center justify-center gap-2 bg-white text-emerald-800 shadow-xs border border-slate-200/40" id="tab-parent-portal">
              <User className="w-4 h-4 text-emerald-600" />
              <span>Parents & Students Link</span>
            </div>
          ) : (
            <div className="flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-150 flex items-center justify-center gap-2 bg-white text-blue-800 shadow-xs border border-slate-200/40" id="tab-admin-portal">
              <Lock className="w-3.5 h-3.5 text-blue-600" />
              <span>PTCA Administrator Portal</span>
            </div>
          )}
        </div>

        {/* Tab Content Canvas with motion animations */}
        <div className={`p-6 sm:p-8 bg-${activeRole === 'admin' ? 'blue-100' : 'emerald-100'}`} id="gateway-tab-content">
          {activeRole === 'user' ? (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className="space-y-6"
              id="parent-login-viewport"
            >
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  <span>Authorized Parent Access</span>
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Enter your child's student identification code to view live grade publications, safety checkout rosters, and PTCA updates.
                </p>
              </div>

              <form onSubmit={handleParentSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-550 mb-1.5">
                    Pupil ID Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={pupilId}
                      onChange={(e) => setPupilId(e.target.value)}
                      placeholder="e.g. 1001 or 1002"
                      className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white text-slate-800 font-medium placeholder-slate-400"
                    />
                    <div className="absolute right-3 top-2.5 text-slate-400">
                      <Smartphone className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-550 mb-1.5">
                    Pupil Password
                  </label>
                  <input
                    type="password"
                    value={pupilPassword}
                    onChange={(e) => setPupilPassword(e.target.value)}
                    placeholder="Enter pupil password"
                    className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white text-slate-800 font-medium placeholder-slate-400"
                  />
                </div>

                {parentError && (
                  <div className="p-2.5 bg-rose-50 text-rose-700 border border-rose-100 rounded-lg text-xs flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span className="font-medium">{parentError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition duration-150 flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-100 hover:shadow"
                >
                  <span>Access Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className="space-y-6"
              id="admin-login-viewport"
            >
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.55">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Administrative Identity Check</span>
                </h3>
                <p className="text-xs text-slate-800 leading-relaxed">
                  Enter credentials to access teacher grading sheet editors, pupil account enrollment registry, and attendance scanner.
                </p>
              </div>

              <form onSubmit={handleAdminSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-550 mb-1.5">
                    Username
                  </label>
                  <input
                    type="text"
                    value={adminUser}
                    onChange={(e) => setAdminUser(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-550 mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800 font-medium"
                  />
                </div>

                {adminError && (
                  <div className="p-2.5 bg-rose-50 text-rose-700 border border-rose-100 rounded-lg text-xs flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span className="font-medium">{adminError}</span>
                  </div>
                )}

                

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-xs transition duration-150 flex items-center justify-center gap-1.5 shadow-sm shadow-blue-100 hover:shadow"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Authenticate Session</span>
                </button>
              </form>
            </motion.div>
          )}
        </div>
      </div>

      {/* Security Disclaimer Notice */}
      <p className="text-[10px] text-slate-400 font-mono mt-8 uppercase tracking-widest text-center">
        🔒 Real-time safety logs & SMS alerts live simulation active
      </p>
    </div>
  );
}
