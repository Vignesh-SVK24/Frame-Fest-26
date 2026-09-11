import React, { useState, useEffect, useMemo } from 'react';
import { 
  Shield, 
  Search, 
  Download, 
  RefreshCw, 
  Eye, 
  X, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Lock,
  LogOut,
  Users,
  Calendar,
  AlertCircle,
  Check,
  FileSpreadsheet,
  QrCode,
  Sparkles,
  ArrowRight,
  UserCheck,
  UserX,
  Trash2
} from 'lucide-react';
import { EVENT_CONFIG } from '../config/eventConfig';
import { supabase } from '../config/supabaseClient';

export default function Admin({ onNavigateHome }) {
  // Session / Auth state
  const [adminToken, setAdminToken] = useState(() => sessionStorage.getItem('ff26_admin_token') || '');
  const [currentAdmin, setCurrentAdmin] = useState(() => sessionStorage.getItem('ff26_admin_name') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Login form state
  const [loginUsername, setLoginUsername] = useState('Dr. D. Satheesh Kumar');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Data & Dashboard state
  const [registrations, setRegistrations] = useState([]);
  const [stats, setStats] = useState({ total: 0, present: 0, absent: 0, pending: 0 });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Attendance Mode state (Event Date: 18 September 2026)
  const eventDateObj = useMemo(() => new Date('2026-09-18T00:00:00'), []);
  const isEventDayOrAfter = useMemo(() => new Date() >= eventDateObj, [eventDateObj]);
  const [attendanceOpen, setAttendanceOpen] = useState(false);

  // Quick Ticket ID Scanner / Search in Attendance Mode
  const [quickSearchInput, setQuickSearchInput] = useState('');

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [sectionFilter, setSectionFilter] = useState('ALL');
  const [attendanceFilter, setAttendanceFilter] = useState('ALL');

  // Confirmation Modal state for Marking Attendance
  // { reg: Object, targetStatus: 'PRESENT' | 'ABSENT' }
  const [confirmModal, setConfirmModal] = useState(null);
  const [actionProcessing, setActionProcessing] = useState(false);
  const [actionNotice, setActionNotice] = useState({ type: '', text: '' });

  // Confirmation Modal state for Removing / Deleting Member
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);


  // Participant Details Modal
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [viewPaymentModal, setViewPaymentModal] = useState(null); // filename

  // On mount, verify existing session token
  useEffect(() => {
    if (adminToken) {
      verifySession(adminToken);
    }
  }, []);

  const verifySession = async (token) => {
    try {
      const res = await fetch('/api/admin/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setIsAuthenticated(true);
        setCurrentAdmin(data.adminName || 'Admin');
        fetchDashboardData(token);
      } else {
        handleLogout();
      }
    } catch {
      // In offline / fallback demo mode
      if (token) {
        setIsAuthenticated(true);
        fetchDashboardData(token);
      }
    }
  };

  // Submit Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    if (!loginUsername || !loginPassword) {
      setLoginError('Invalid admin name or password.');
      return;
    }

    setIsLoggingIn(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: loginUsername.trim(),
          password: loginPassword
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAdminToken(data.token);
        setCurrentAdmin(data.adminName);
        sessionStorage.setItem('ff26_admin_token', data.token);
        sessionStorage.setItem('ff26_admin_name', data.adminName);
        setIsAuthenticated(true);
        setLoginPassword('');
        fetchDashboardData(data.token);
      } else {
        setLoginError(data.message || 'Invalid admin name or password.');
      }
    } catch (err) {
      // Fallback verification for demo or offline server
      const defaultPass = {
        'Dr. D. Satheesh Kumar': 'aiml26hicet',
        'Ms. V. Devi': 'aiml26hicet',
        'Vignesh S': 'aiml26hicet',
        Satheesh: 'aiml26hicet',
        Devi: 'aiml26hicet',
        Vignesh: 'aiml26hicet'
      };
      if (defaultPass[loginUsername] && defaultPass[loginUsername] === loginPassword) {
        const dummyToken = 'demo-token-' + Date.now();
        setAdminToken(dummyToken);
        setCurrentAdmin(loginUsername);
        sessionStorage.setItem('ff26_admin_token', dummyToken);
        sessionStorage.setItem('ff26_admin_name', loginUsername);
        setIsAuthenticated(true);
        setLoginPassword('');
        fetchDashboardData(dummyToken);
      } else {
        setLoginError('Invalid admin name or password.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Logout
  const handleLogout = () => {
    if (adminToken) {
      fetch('/api/admin/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` }
      }).catch(() => {});
    }
    sessionStorage.removeItem('ff26_admin_token');
    sessionStorage.removeItem('ff26_admin_name');
    setAdminToken('');
    setCurrentAdmin('');
    setIsAuthenticated(false);
    setRegistrations([]);
    setSelectedParticipant(null);
    setConfirmModal(null);
    onNavigateHome();
  };

  // Helper to map snake_case Supabase rows
  const mapDbRow = (r) => ({
    id: r.id,
    registrationId: r.registration_id,
    name: r.name,
    registerNumber: r.register_number,
    department: r.department,
    section: r.section,
    phone: r.phone,
    email: r.email,
    paymentProof: r.payment_proof,
    createdAt: r.created_at,
    registrationDate: r.registration_date,
    attendanceStatus: r.attendance_status || 'PENDING',
    attendanceDate: r.attendance_date,
    attendanceTime: r.attendance_time,
    markedBy: r.marked_by,
    whatsappJoined: r.whatsapp_joined !== undefined ? r.whatsapp_joined : true,
    status: r.status || 'CONFIRMED'
  });

  // Fetch registrations and stats
  const fetchDashboardData = async (token = adminToken) => {
    setLoading(true);
    setErrorMsg('');

    // 1. First attempt via backend API
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (deptFilter !== 'ALL') params.append('department', deptFilter);
      if (sectionFilter !== 'ALL') params.append('section', sectionFilter);
      if (attendanceFilter !== 'ALL') params.append('attendanceStatus', attendanceFilter);

      const [regRes, statsRes] = await Promise.all([
        fetch(`/api/admin/registrations?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (regRes.ok && statsRes.ok) {
        const regJson = await regRes.json();
        const statsJson = await statsRes.json();
        setRegistrations(regJson.data || []);
        setStats({
          total: statsJson.total || 0,
          present: statsJson.present || 0,
          absent: statsJson.absent || 0,
          pending: statsJson.pending || 0
        });
        setLoading(false);
        return;
      }
    } catch (apiErr) {
      console.warn('Backend API request failed, querying Supabase directly:', apiErr);
    }

    // 2. Direct Supabase Query Fallback
    try {
      let query = supabase.from('registrations').select('*');
      if (deptFilter !== 'ALL') query = query.eq('department', deptFilter);
      if (sectionFilter !== 'ALL') query = query.eq('section', sectionFilter);
      if (attendanceFilter !== 'ALL') query = query.eq('attendance_status', attendanceFilter);
      if (searchTerm) {
        const q = searchTerm.trim();
        query = query.or(
          `registration_id.ilike.%${q}%,name.ilike.%${q}%,register_number.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%`
        );
      }
      query = query.order('id', { ascending: true });

      const { data: rows, error: qErr } = await query;
      if (!qErr && Array.isArray(rows)) {
        const mapped = rows.map(mapDbRow);
        setRegistrations(mapped);

        // Fetch stats from Supabase
        const { data: allRows } = await supabase.from('registrations').select('attendance_status');
        if (allRows) {
          setStats({
            total: allRows.length,
            present: allRows.filter((r) => r.attendance_status === 'PRESENT').length,
            absent: allRows.filter((r) => r.attendance_status === 'ABSENT').length,
            pending: allRows.filter((r) => (r.attendance_status || 'PENDING') === 'PENDING').length
          });
        }
      } else {
        throw qErr || new Error('Failed to load from Supabase');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Attendance could not be loaded. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch on filter changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [searchTerm, deptFilter, sectionFilter, attendanceFilter]);

  // Execute Marking Attendance after Confirmation Modal
  const handleExecuteAttendance = async () => {
    if (!confirmModal || !confirmModal.reg || !confirmModal.targetStatus) return;

    const { reg, targetStatus } = confirmModal;
    setActionProcessing(true);
    setActionNotice({ type: '', text: '' });

    // 1. First attempt via backend API
    try {
      const res = await fetch(`/api/admin/attendance/${reg.registrationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status: targetStatus })
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setActionNotice({
            type: 'success',
            text: `Marked ${reg.name} (${reg.registrationId}) as ${targetStatus}.`
          });

          setRegistrations((prev) =>
            prev.map((r) =>
              r.registrationId === reg.registrationId ? json.data : r
            )
          );

          if (selectedParticipant && selectedParticipant.registrationId === reg.registrationId) {
            setSelectedParticipant(json.data);
          }

          setConfirmModal(null);
          fetchDashboardData();
          setQuickSearchInput('');
          setActionProcessing(false);
          return;
        }
      }
    } catch (apiErr) {
      console.warn('API update failed, updating Supabase directly:', apiErr);
    }

    // 2. Direct Supabase Update Fallback
    try {
      const now = new Date();
      const options = { day: '2-digit', month: 'short', year: 'numeric' };
      const formattedDate = now.toLocaleDateString('en-GB', options);
      const timeOpts = { hour: '2-digit', minute: '2-digit', hour12: true };
      const formattedTime = now.toLocaleTimeString('en-US', timeOpts);

      const { data: updatedRows, error: updErr } = await supabase
        .from('registrations')
        .update({
          attendance_status: targetStatus,
          attendance_date: formattedDate,
          attendance_time: formattedTime,
          marked_by: currentAdmin || 'Admin'
        })
        .eq('registration_id', reg.registrationId)
        .select();

      if (!updErr && updatedRows && updatedRows.length > 0) {
        const updated = mapDbRow(updatedRows[0]);
        setActionNotice({
          type: 'success',
          text: `Marked ${reg.name} (${reg.registrationId}) as ${targetStatus}.`
        });

        setRegistrations((prev) =>
          prev.map((r) =>
            r.registrationId === reg.registrationId ? updated : r
          )
        );

        if (selectedParticipant && selectedParticipant.registrationId === reg.registrationId) {
          setSelectedParticipant(updated);
        }

        setConfirmModal(null);
        fetchDashboardData();
        setQuickSearchInput('');
      } else {
        throw updErr || new Error('Could not update Supabase');
      }
    } catch (err) {
      setActionNotice({
        type: 'error',
        text: 'Attendance could not be saved. Please try again.'
      });
    } finally {
      setActionProcessing(false);
    }
  };

  // Execute Deleting / Removing a Member (Protected Admin Action)
  const handleExecuteDeleteMember = async () => {
    if (!deleteConfirmModal) return;

    const targetReg = deleteConfirmModal;
    setIsDeleting(true);
    setActionNotice({ type: '', text: '' });

    // 1. First attempt via backend API
    try {
      const res = await fetch(`/api/admin/registrations/${targetReg.registrationId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setActionNotice({
            type: 'success',
            text: `Removed member ${targetReg.name} (${targetReg.registrationId}) successfully.`
          });

          setRegistrations((prev) =>
            prev.filter((r) => r.registrationId !== targetReg.registrationId)
          );

          if (selectedParticipant && selectedParticipant.registrationId === targetReg.registrationId) {
            setSelectedParticipant(null);
          }

          setDeleteConfirmModal(null);
          fetchDashboardData();
          setIsDeleting(false);
          return;
        }
      }
    } catch (apiErr) {
      console.warn('API delete failed, deleting from Supabase directly:', apiErr);
    }

    // 2. Direct Supabase Delete Fallback
    try {
      const { error: delErr } = await supabase
        .from('registrations')
        .delete()
        .eq('registration_id', targetReg.registrationId);

      if (!delErr) {
        setActionNotice({
          type: 'success',
          text: `Removed member ${targetReg.name} (${targetReg.registrationId}) successfully.`
        });

        setRegistrations((prev) =>
          prev.filter((r) => r.registrationId !== targetReg.registrationId)
        );

        if (selectedParticipant && selectedParticipant.registrationId === targetReg.registrationId) {
          setSelectedParticipant(null);
        }

        setDeleteConfirmModal(null);
        fetchDashboardData();
      } else {
        throw delErr || new Error('Could not delete from Supabase');
      }
    } catch (err) {
      setActionNotice({
        type: 'error',
        text: 'Failed to remove member. Please try again.'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    try {
      const headers = [
        'Ticket ID',
        'Student Name',
        'Register Number',
        'Department',
        'Section',
        'Registration Date',
        'Attendance Status',
        'Attendance Date',
        'Attendance Time',
        'Marked By'
      ];

      const escapeCsv = (val) => {
        if (val === null || val === undefined) return '""';
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      };

      const rows = registrations.map((r) => [
        escapeCsv(r.registrationId),
        escapeCsv(r.name),
        escapeCsv(r.registerNumber),
        escapeCsv(r.department),
        escapeCsv(r.section),
        escapeCsv(r.registrationDate || r.createdAt || ''),
        escapeCsv(r.attendanceStatus || 'PENDING'),
        escapeCsv(r.attendanceDate || '-'),
        escapeCsv(r.attendanceTime || '-'),
        escapeCsv(r.markedBy || '-')
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'frame_fest_26_attendance.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      window.open(`/api/admin/export-csv?adminToken=${encodeURIComponent(adminToken)}`, '_blank');
    }
  };

  // Quick matched participant for Attendance Quick Scan
  const quickMatchedParticipant = useMemo(() => {
    if (!quickSearchInput.trim()) return null;
    const q = quickSearchInput.trim().toUpperCase();
    return registrations.find(
      (r) =>
        r.registrationId.toUpperCase() === q ||
        r.registerNumber.toUpperCase() === q ||
        r.name.toUpperCase().includes(q)
    );
  }, [quickSearchInput, registrations]);

  // Helper for attendance badge
  const getAttendanceBadge = (status) => {
    const s = (status || 'PENDING').toUpperCase();
    if (s === 'PRESENT') {
      return (
        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-950/60 text-green-400 border border-green-800/60 shadow-[0_0_10px_rgba(34,197,94,0.15)]">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>PRESENT</span>
        </span>
      );
    }
    if (s === 'ABSENT') {
      return (
        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-950/60 text-red-400 border border-red-800/60 shadow-[0_0_10px_rgba(239,68,68,0.15)]">
          <XCircle className="w-3.5 h-3.5" />
          <span>ABSENT</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-950/50 text-amber-400 border border-amber-800/50">
        <Clock className="w-3.5 h-3.5" />
        <span>PENDING</span>
      </span>
    );
  };

  // -------------------------------------------------------------
  // VIEW 1: PROTECTED ADMIN LOGIN MODAL / CARD
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
        <div className="bg-[#121212]/90 backdrop-blur-md border border-[#262626]/80 rounded-2xl max-w-md w-full p-8 shadow-2xl relative text-center">
          
          {/* Film Perforation accent */}
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#e50914] to-transparent mb-6"></div>

          <div className="w-14 h-14 rounded-2xl bg-[#181818] border border-[#333] text-[#e50914] flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(229,9,20,0.25)]">
            <Lock className="w-7 h-7" />
          </div>

          <div className="text-[11px] font-mono font-bold tracking-[0.2em] text-[#e50914] uppercase mb-1">
            FRAME FEST ’26
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-cinematic uppercase tracking-tight text-white mb-2">
            ADMIN LOGIN
          </h2>
          <p className="text-xs text-neutral-400 mb-6">
            Authorized administrator access for organizing committee.
          </p>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            {/* Admin Username Dropdown */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                ADMINISTRATOR
              </label>
              <select
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[#181818] border border-[#333] text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#e50914] focus:border-[#e50914]"
              >
                <option value="Dr. D. Satheesh Kumar">Dr. D. Satheesh Kumar</option>
                <option value="Ms. V. Devi">Ms. V. Devi</option>
                <option value="Vignesh S">Vignesh S</option>
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                PASSWORD
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 rounded-lg bg-[#181818] border border-[#333] text-white placeholder-neutral-500 text-sm focus:outline-none focus:ring-1 focus:ring-[#e50914] focus:border-[#e50914]"
                autoFocus
              />
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 rounded-lg bg-[#e50914] hover:bg-[#b80710] text-white font-bold tracking-wider uppercase text-xs sm:text-sm shadow-[0_0_20px_rgba(229,9,20,0.4)] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Shield className="w-4 h-4" />
              <span>{isLoggingIn ? 'AUTHENTICATING...' : 'SIGN IN'}</span>
            </button>

            <button
              type="button"
              onClick={onNavigateHome}
              className="w-full text-center text-xs text-neutral-500 hover:text-neutral-300 transition-colors pt-2 block"
            >
              Return to Website
            </button>
          </form>

        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: AUTHENTICATED ADMIN DASHBOARD & ATTENDANCE REGISTER
  // -------------------------------------------------------------
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      
      {/* Top Header: Welcome [Admin Name] + Logout + Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-[#222] gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono font-bold tracking-widest text-[#e50914] uppercase mb-1">
            <Shield className="w-4 h-4" />
            <span>FRAME FEST ’26 ADMIN CONSOLE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-cinematic uppercase tracking-tight text-white">
            {attendanceOpen ? 'ATTENDANCE REGISTER' : 'ADMIN DASHBOARD'}
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Welcome, <span className="font-bold text-white uppercase">{currentAdmin}</span> • AIML Department, HICET
          </p>
        </div>

        {/* Header Right Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={() => fetchDashboardData()}
            disabled={loading}
            className="p-2.5 rounded-lg bg-[#181818] border border-[#2d2d2d] text-neutral-300 hover:text-white hover:border-[#444] transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#e50914]' : ''}`} />
          </button>

          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2.5 rounded-lg bg-[#181818] border border-[#333] hover:border-[#e50914] text-white text-xs font-bold tracking-wider uppercase flex items-center space-x-2 transition-all shadow-sm"
            title="Export Attendance CSV"
          >
            <Download className="w-4 h-4 text-[#e50914]" />
            <span className="hidden sm:inline">EXPORT ATTENDANCE CSV</span>
            <span className="sm:hidden">CSV</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3 py-2.5 rounded-lg bg-red-950/30 border border-red-900/50 text-red-400 hover:bg-red-950/60 text-xs font-bold tracking-wider uppercase flex items-center space-x-1.5 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
            <span>LOGOUT</span>
          </button>
        </div>
      </div>

      {/* Global Status / Notice Banner */}
      {actionNotice.text && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs animate-fadeIn ${
            actionNotice.type === 'success'
              ? 'bg-green-950/40 border-green-800/60 text-green-300'
              : 'bg-red-950/40 border-red-800/60 text-red-300'
          }`}
        >
          <div className="flex items-center space-x-2">
            {actionNotice.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-green-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400" />
            )}
            <span className="font-semibold">{actionNotice.text}</span>
          </div>
          <button
            onClick={() => setActionNotice({ type: '', text: '' })}
            className="text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 4 Main Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* TOTAL REGISTERED */}
        <div className="bg-[#121212] border border-[#222] rounded-xl p-4 sm:p-5 shadow-sm">
          <div className="text-[11px] font-mono font-bold tracking-widest text-neutral-400 uppercase">
            TOTAL REGISTERED
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-1 font-mono">
            {stats.total}
          </div>
        </div>

        {/* PRESENT */}
        <div className="bg-[#121212] border border-[#222] rounded-xl p-4 sm:p-5 shadow-sm">
          <div className="text-[11px] font-mono font-bold tracking-widest text-green-500 uppercase">
            PRESENT
          </div>
          <div className="text-2xl sm:text-3xl font-black text-green-400 mt-1 font-mono">
            {stats.present}
          </div>
        </div>

        {/* ABSENT */}
        <div className="bg-[#121212] border border-[#222] rounded-xl p-4 sm:p-5 shadow-sm">
          <div className="text-[11px] font-mono font-bold tracking-widest text-red-500 uppercase">
            ABSENT
          </div>
          <div className="text-2xl sm:text-3xl font-black text-red-400 mt-1 font-mono">
            {stats.absent}
          </div>
        </div>

        {/* PENDING ATTENDANCE */}
        <div className="bg-[#121212] border border-[#222] rounded-xl p-4 sm:p-5 shadow-sm">
          <div className="text-[11px] font-mono font-bold tracking-widest text-yellow-500 uppercase">
            PENDING ATTENDANCE
          </div>
          <div className="text-2xl sm:text-3xl font-black text-yellow-400 mt-1 font-mono">
            {stats.pending}
          </div>
        </div>
      </div>

      {/* Event Attendance Gate Banner (Event Date: 18 September 2026) */}
      <div className="bg-[#121212] border border-[#262626] rounded-xl p-5 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="p-3 rounded-lg bg-[#181818] border border-[#2e2e2e] text-[#e50914] shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-[#e50914] uppercase">
                EVENT DATE: 18 SEPTEMBER 2026
              </span>
              {!isEventDayOrAfter && !attendanceOpen && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-yellow-950/60 text-yellow-400 border border-yellow-800/40 uppercase font-bold">
                  ATTENDANCE NOT OPEN
                </span>
              )}
            </div>
            <p className="text-sm font-bold text-white mt-0.5">
              {attendanceOpen
                ? 'Attendance Register Mode is Active. Fast-marking enabled for on-spot verification.'
                : isEventDayOrAfter
                ? 'Event day has arrived. Open attendance to begin verification.'
                : 'Attendance is scheduled for event day. Admin can explicitly open or override below.'}
            </p>
          </div>
        </div>

        <div>
          {attendanceOpen ? (
            <button
              onClick={() => setAttendanceOpen(false)}
              className="px-4 py-2.5 rounded-lg bg-[#1a1a1a] border border-[#333] hover:border-neutral-400 text-neutral-300 hover:text-white text-xs font-bold uppercase tracking-wider transition-all"
            >
              CLOSE ATTENDANCE MODE
            </button>
          ) : (
            <button
              onClick={() => setAttendanceOpen(true)}
              className="px-5 py-3 rounded-lg bg-[#e50914] hover:bg-[#b80710] text-white text-xs font-bold tracking-wider uppercase shadow-[0_0_20px_rgba(229,9,20,0.4)] transition-all flex items-center space-x-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>OPEN REGISTER ATTENDANCE</span>
            </button>
          )}
        </div>
      </div>

      {/* QUICK ATTENDANCE SCANNER & SEARCH (Visible when Attendance Mode is open) */}
      {attendanceOpen && (
        <div className="bg-gradient-to-r from-[#161616] via-[#141414] to-[#161616] border-2 border-[#e50914]/50 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <QrCode className="w-5 h-5 text-[#e50914]" />
              <h3 className="text-base sm:text-lg font-black font-cinematic uppercase tracking-wider text-white">
                FAST ATTENDANCE VERIFICATION
              </h3>
            </div>
            <span className="text-[11px] font-mono text-neutral-400 uppercase">
              Admin: <span className="text-[#e50914] font-bold">{currentAdmin}</span>
            </span>
          </div>

          <div className="relative">
            <Search className="w-5 h-5 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={quickSearchInput}
              onChange={(e) => setQuickSearchInput(e.target.value)}
              placeholder="SCAN / ENTER TICKET ID (e.g. FF26-0001) or Register No..."
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#0a0a0a] border border-[#333] text-white text-sm font-mono placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#e50914] focus:border-[#e50914]"
              autoFocus
            />
          </div>

          {/* Quick Result Match Card */}
          {quickMatchedParticipant ? (
            <div className="bg-[#1c1c1c] border border-[#333] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fadeIn">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-extrabold text-[#e50914] bg-[#e50914]/10 px-2 py-0.5 rounded border border-[#e50914]/30">
                    {quickMatchedParticipant.registrationId}
                  </span>
                  <span className="font-mono text-xs text-neutral-400">
                    {quickMatchedParticipant.registerNumber}
                  </span>
                  <div>{getAttendanceBadge(quickMatchedParticipant.attendanceStatus)}</div>
                </div>

                <div className="text-base sm:text-lg font-extrabold text-white">
                  {quickMatchedParticipant.name}
                </div>

                <div className="text-xs text-neutral-400">
                  {quickMatchedParticipant.department} • Section {quickMatchedParticipant.section}
                </div>

                {quickMatchedParticipant.markedBy && (
                  <div className="text-[11px] text-neutral-500">
                    Marked by {quickMatchedParticipant.markedBy} on {quickMatchedParticipant.attendanceDate} at {quickMatchedParticipant.attendanceTime}
                  </div>
                )}
              </div>

              {/* Fast Action Buttons */}
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() =>
                    setConfirmModal({ reg: quickMatchedParticipant, targetStatus: 'PRESENT' })
                  }
                  disabled={quickMatchedParticipant.attendanceStatus === 'PRESENT'}
                  className="px-4 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-xs font-bold tracking-wider uppercase transition-all flex items-center space-x-1.5 shadow-[0_0_15px_rgba(22,163,74,0.3)]"
                >
                  <Check className="w-4 h-4" />
                  <span>MARK PRESENT</span>
                </button>

                <button
                  onClick={() =>
                    setConfirmModal({ reg: quickMatchedParticipant, targetStatus: 'ABSENT' })
                  }
                  disabled={quickMatchedParticipant.attendanceStatus === 'ABSENT'}
                  className="px-4 py-2.5 rounded-lg bg-[#2a2a2a] hover:bg-red-950/60 border border-neutral-700 hover:border-red-700 text-neutral-300 hover:text-red-300 disabled:opacity-50 text-xs font-bold tracking-wider uppercase transition-all"
                >
                  <UserX className="w-4 h-4" />
                  <span>MARK ABSENT</span>
                </button>
              </div>
            </div>
          ) : quickSearchInput.trim() ? (
            <div className="text-xs text-neutral-400 text-center py-2">
              Participant not found for “{quickSearchInput}”.
            </div>
          ) : null}
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="bg-[#121212] border border-[#222] rounded-xl p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center gap-3 sm:gap-4">
        
        {/* Search Field */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Student Name, Register Number, or Ticket ID..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#181818] border border-[#2a2a2a] text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-[#e50914]"
          />
        </div>

        {/* Department Filter */}
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="px-3 py-2.5 rounded-lg bg-[#181818] border border-[#2a2a2a] text-white text-xs focus:outline-none focus:border-[#e50914]"
        >
          <option value="ALL">All Departments</option>
          {EVENT_CONFIG.departments.map((dept, i) => (
            <option key={i} value={dept}>{dept}</option>
          ))}
        </select>

        {/* Section Filter */}
        <select
          value={sectionFilter}
          onChange={(e) => setSectionFilter(e.target.value)}
          className="px-3 py-2.5 rounded-lg bg-[#181818] border border-[#2a2a2a] text-white text-xs focus:outline-none focus:border-[#e50914]"
        >
          <option value="ALL">All Sections</option>
          {EVENT_CONFIG.sections.map((sec, i) => (
            <option key={i} value={sec}>Section {sec}</option>
          ))}
        </select>

        {/* Attendance Status Filter */}
        <select
          value={attendanceFilter}
          onChange={(e) => setAttendanceFilter(e.target.value)}
          className="px-3 py-2.5 rounded-lg bg-[#181818] border border-[#2a2a2a] text-white text-xs focus:outline-none focus:border-[#e50914]"
        >
          <option value="ALL">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="PRESENT">Present</option>
          <option value="ABSENT">Absent</option>
        </select>
      </div>

      {/* --------------------------------------------------------- */}
      {/* DESKTOP TABLE VIEW (Visible on sm and up)                 */}
      {/* --------------------------------------------------------- */}
      <div className="hidden md:block bg-[#121212] border border-[#242424] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-[#181818] text-neutral-400 uppercase font-mono tracking-wider text-[11px] border-b border-[#222]">
              <tr>
                <th className="py-3.5 px-4">Ticket ID</th>
                <th className="py-3.5 px-4">Student Name</th>
                <th className="py-3.5 px-4">Register Number</th>
                <th className="py-3.5 px-4">Dept / Section</th>
                <th className="py-3.5 px-4">Registration Date</th>
                <th className="py-3.5 px-4">Attendance</th>
                <th className="py-3.5 px-4">Attendance Time</th>
                <th className="py-3.5 px-4">Marked By</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e1e]">
              {registrations.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-neutral-500">
                    {loading ? 'Loading participants...' : 'No participant records found.'}
                  </td>
                </tr>
              ) : (
                registrations.map((reg) => (
                  <tr key={reg.registrationId} className="hover:bg-[#161616] transition-colors">
                    {/* Ticket ID */}
                    <td className="py-3.5 px-4 font-mono font-extrabold text-[#e50914] whitespace-nowrap">
                      {reg.registrationId}
                    </td>

                    {/* Student Name */}
                    <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                      {reg.name}
                    </td>

                    {/* Register Number */}
                    <td className="py-3.5 px-4 font-mono whitespace-nowrap text-neutral-300">
                      {reg.registerNumber}
                    </td>

                    {/* Department & Section */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-white max-w-[170px] truncate" title={reg.department}>
                        {reg.department}
                      </div>
                      <div className="text-[10px] text-neutral-500 font-mono">Sec {reg.section}</div>
                    </td>

                    {/* Registration Date */}
                    <td className="py-3.5 px-4 text-neutral-400 text-[11px] whitespace-nowrap">
                      {reg.registrationDate || new Date(reg.createdAt).toLocaleDateString()}
                    </td>

                    {/* Attendance Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getAttendanceBadge(reg.attendanceStatus)}
                    </td>

                    {/* Attendance Time */}
                    <td className="py-3.5 px-4 text-neutral-400 font-mono text-[11px] whitespace-nowrap">
                      {reg.attendanceTime ? `${reg.attendanceDate || ''} ${reg.attendanceTime}` : '-'}
                    </td>

                    {/* Marked By */}
                    <td className="py-3.5 px-4 text-neutral-300 font-medium text-[11px] whitespace-nowrap">
                      {reg.markedBy || '-'}
                    </td>

                    {/* Actions: View Details / Mark Present / Mark Absent / Remove */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          onClick={() => setSelectedParticipant(reg)}
                          className="p-1.5 rounded bg-[#202020] hover:bg-[#2c2c2c] text-neutral-200 hover:text-white transition-colors"
                          title="View Participant Details"
                        >
                          <Eye className="w-4 h-4 text-[#e50914]" />
                        </button>

                        <button
                          onClick={() => setConfirmModal({ reg, targetStatus: 'PRESENT' })}
                          disabled={reg.attendanceStatus === 'PRESENT'}
                          className="px-2 py-1 rounded bg-green-950/50 hover:bg-green-900/70 border border-green-800/60 text-green-400 disabled:opacity-40 text-[11px] font-bold"
                          title="Mark Present"
                        >
                          Present
                        </button>

                        <button
                          onClick={() => setConfirmModal({ reg, targetStatus: 'ABSENT' })}
                          disabled={reg.attendanceStatus === 'ABSENT'}
                          className="px-2 py-1 rounded bg-red-950/40 hover:bg-red-900/60 border border-red-800/50 text-red-400 disabled:opacity-40 text-[11px] font-bold"
                          title="Mark Absent"
                        >
                          Absent
                        </button>

                        <button
                          onClick={() => setDeleteConfirmModal(reg)}
                          className="p-1.5 rounded bg-[#1c1212] hover:bg-red-950/70 border border-red-900/40 hover:border-red-700 text-red-400 hover:text-red-300 transition-colors"
                          title="Remove Member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --------------------------------------------------------- */}
      {/* MOBILE COMPACT CARDS VIEW (Clean, No Horizontal Scroll)  */}
      {/* --------------------------------------------------------- */}
      <div className="block md:hidden space-y-3">
        {registrations.length === 0 ? (
          <div className="bg-[#121212] border border-[#222] rounded-xl p-8 text-center text-neutral-500 text-xs">
            {loading ? 'Loading participant records...' : 'No participant records found.'}
          </div>
        ) : (
          registrations.map((reg) => (
            <div
              key={reg.registrationId}
              className="bg-[#121212] border border-[#242424] rounded-xl p-4 space-y-3 shadow-md"
            >
              {/* Card Top: Ticket ID + Attendance Status */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-extrabold text-[#e50914]">
                  {reg.registrationId}
                </span>
                <div>{getAttendanceBadge(reg.attendanceStatus)}</div>
              </div>

              {/* Student Name & Register Number */}
              <div>
                <div className="text-base font-bold text-white">{reg.name}</div>
                <div className="text-xs font-mono text-neutral-400">{reg.registerNumber}</div>
              </div>

              {/* Dept, Section, Registration Date */}
              <div className="text-xs text-neutral-400 space-y-0.5 border-t border-[#1e1e1e] pt-2">
                <div>{reg.department} • Sec {reg.section}</div>
                <div className="text-[11px] text-neutral-500">
                  Registered: {reg.registrationDate || new Date(reg.createdAt).toLocaleDateString()}
                </div>
                {reg.markedBy && (
                  <div className="text-[11px] text-neutral-400 font-mono pt-1">
                    Marked by {reg.markedBy} ({reg.attendanceTime})
                  </div>
                )}
              </div>

              {/* Mobile Action Buttons: MARK PRESENT / ABSENT / DETAILS / REMOVE */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1e1e1e]">
                <button
                  onClick={() => setConfirmModal({ reg, targetStatus: 'PRESENT' })}
                  disabled={reg.attendanceStatus === 'PRESENT'}
                  className="py-2 rounded-lg bg-green-950/60 hover:bg-green-900/80 border border-green-800/60 text-green-300 text-xs font-bold uppercase transition-all disabled:opacity-40 flex items-center justify-center space-x-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>PRESENT</span>
                </button>

                <button
                  onClick={() => setConfirmModal({ reg, targetStatus: 'ABSENT' })}
                  disabled={reg.attendanceStatus === 'ABSENT'}
                  className="py-2 rounded-lg bg-red-950/50 hover:bg-red-900/70 border border-red-800/50 text-red-300 text-xs font-bold uppercase transition-all disabled:opacity-40 flex items-center justify-center space-x-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>ABSENT</span>
                </button>

                <button
                  onClick={() => setSelectedParticipant(reg)}
                  className="py-2 rounded-lg bg-[#1e1e1e] hover:bg-[#282828] border border-[#333] text-neutral-200 text-xs font-bold uppercase transition-all flex items-center justify-center space-x-1"
                >
                  <Eye className="w-3.5 h-3.5 text-[#e50914]" />
                  <span>DETAILS</span>
                </button>

                <button
                  onClick={() => setDeleteConfirmModal(reg)}
                  className="py-2 rounded-lg bg-[#1a1111] hover:bg-red-950/70 border border-red-900/50 hover:border-red-700 text-red-400 text-xs font-bold uppercase transition-all flex items-center justify-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  <span>REMOVE</span>
                </button>
              </div>

            </div>
          ))
        )}
      </div>

      {/* --------------------------------------------------------- */}
      {/* ATTENDANCE CONFIRMATION MODAL                             */}
      {/* --------------------------------------------------------- */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#141414] border border-[#2e2e2e] rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#1c1c1c] border border-[#333] flex items-center justify-center mx-auto text-[#e50914]">
              {confirmModal.targetStatus === 'PRESENT' ? (
                <UserCheck className="w-6 h-6 text-green-400" />
              ) : (
                <UserX className="w-6 h-6 text-red-400" />
              )}
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-black font-cinematic uppercase text-white">
                CONFIRM ATTENDANCE
              </h3>
              <p className="text-xs text-neutral-300">
                Mark <span className="font-bold text-white">{confirmModal.reg.name}</span> (
                <span className="font-mono text-[#e50914]">{confirmModal.reg.registrationId}</span>) as{' '}
                <span
                  className={`font-bold ${
                    confirmModal.targetStatus === 'PRESENT' ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {confirmModal.targetStatus}
                </span>?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                disabled={actionProcessing}
                className="py-2.5 rounded-lg bg-[#202020] hover:bg-[#2a2a2a] text-neutral-300 text-xs font-bold uppercase tracking-wider transition-colors"
              >
                CANCEL
              </button>

              <button
                type="button"
                onClick={handleExecuteAttendance}
                disabled={actionProcessing}
                className={`py-2.5 rounded-lg text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md ${
                  confirmModal.targetStatus === 'PRESENT'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {actionProcessing ? 'SAVING...' : 'CONFIRM'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------- */}
      {/* DELETE / REMOVE MEMBER CONFIRMATION MODAL                 */}
      {/* --------------------------------------------------------- */}
      {deleteConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#141414] border border-red-900/60 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-950/60 border border-red-800/80 flex items-center justify-center mx-auto text-red-500">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-black font-cinematic uppercase text-white tracking-wider">
                REMOVE MEMBER
              </h3>
              <p className="text-xs text-neutral-300">
                Are you sure you want to remove <span className="font-bold text-white">{deleteConfirmModal.name}</span> (
                <span className="font-mono text-[#e50914]">{deleteConfirmModal.registrationId}</span>)?
              </p>
              <div className="bg-[#0c0c0c] border border-[#222] rounded-lg p-2.5 text-[11px] font-mono text-neutral-400 text-left space-y-1 my-2">
                <div><span className="text-neutral-500">Reg No:</span> <span className="text-white">{deleteConfirmModal.registerNumber}</span></div>
                <div><span className="text-neutral-500">Dept:</span> <span className="text-white truncate">{deleteConfirmModal.department}</span></div>
                <div><span className="text-neutral-500">Section:</span> <span className="text-white">{deleteConfirmModal.section}</span></div>
              </div>
              <p className="text-[11px] text-red-400 font-medium">
                This action is permanent and will remove their registration record.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmModal(null)}
                disabled={isDeleting}
                className="py-2.5 rounded-lg bg-[#202020] hover:bg-[#2a2a2a] text-neutral-300 text-xs font-bold uppercase tracking-wider transition-colors"
              >
                CANCEL
              </button>

              <button
                type="button"
                onClick={handleExecuteDeleteMember}
                disabled={isDeleting}
                className="py-2.5 rounded-lg bg-[#e50914] hover:bg-[#b80710] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(229,9,20,0.4)] flex items-center justify-center space-x-1.5"
              >
                {isDeleting ? (
                  <span>REMOVING...</span>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>REMOVE</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------- */}
      {/* PARTICIPANT DETAILS MODAL                                 */}
      {/* --------------------------------------------------------- */}
      {selectedParticipant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#141414] border border-[#2e2e2e] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#242424] pb-4 mb-4">
              <div>
                <span className="text-xs font-mono font-bold text-[#e50914] uppercase">
                  TICKET ID: {selectedParticipant.registrationId}
                </span>
                <h3 className="text-xl font-black font-cinematic uppercase text-white">
                  {selectedParticipant.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedParticipant(null)}
                className="p-2 rounded-lg bg-[#222] text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Field Rows */}
            <div className="space-y-2.5 text-xs bg-[#0d0d0d] p-5 rounded-xl border border-[#222] mb-5">
              <div className="flex justify-between py-1 border-b border-[#1c1c1c]">
                <span className="text-neutral-500">Register Number:</span>
                <span className="font-mono text-white font-bold">{selectedParticipant.registerNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1c1c1c]">
                <span className="text-neutral-500">Department:</span>
                <span className="text-white font-medium">{selectedParticipant.department}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1c1c1c]">
                <span className="text-neutral-500">Section:</span>
                <span className="text-white font-bold">{selectedParticipant.section}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1c1c1c]">
                <span className="text-neutral-500">Phone:</span>
                <span className="font-mono text-white">{selectedParticipant.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1c1c1c]">
                <span className="text-neutral-500">Email:</span>
                <span className="text-white">{selectedParticipant.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1c1c1c]">
                <span className="text-neutral-500">Registration Date:</span>
                <span className="text-neutral-300">
                  {selectedParticipant.registrationDate || new Date(selectedParticipant.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1c1c1c]">
                <span className="text-neutral-500">Attendance Status:</span>
                {getAttendanceBadge(selectedParticipant.attendanceStatus)}
              </div>
              <div className="flex justify-between py-1 border-b border-[#1c1c1c]">
                <span className="text-neutral-500">Attendance Date/Time:</span>
                <span className="font-mono text-white">
                  {selectedParticipant.attendanceDate
                    ? `${selectedParticipant.attendanceDate}, ${selectedParticipant.attendanceTime}`
                    : 'Not marked yet'}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-neutral-500">Marked By:</span>
                <span className="font-bold text-white">{selectedParticipant.markedBy || '-'}</span>
              </div>
            </div>

            {/* Payment Proof Button (Securely served only to authenticated admins) */}
            <div className="space-y-4">
              <div className="border border-[#242424] rounded-xl p-4 bg-[#101010] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white uppercase">PAYMENT PROOF</div>
                  <div className="text-[11px] text-neutral-400">
                    {selectedParticipant.paymentProof ? 'Receipt uploaded' : 'Free Registration / No receipt attached'}
                  </div>
                </div>

                {selectedParticipant.paymentProof ? (
                  <button
                    onClick={() => setViewPaymentModal(selectedParticipant.paymentProof)}
                    className="px-3 py-2 rounded-lg bg-[#1e1e1e] hover:bg-[#282828] border border-[#333] text-xs font-bold text-white uppercase tracking-wider transition-colors flex items-center space-x-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#e50914]" />
                    <span>VIEW PAYMENT PROOF</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-neutral-500 italic">No proof file</span>
                )}
              </div>

              {/* Quick status change inside modal */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => {
                    setSelectedParticipant(null);
                    setConfirmModal({ reg: selectedParticipant, targetStatus: 'PRESENT' });
                  }}
                  disabled={selectedParticipant.attendanceStatus === 'PRESENT'}
                  className="py-2.5 rounded-lg bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>MARK PRESENT</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedParticipant(null);
                    setConfirmModal({ reg: selectedParticipant, targetStatus: 'ABSENT' });
                  }}
                  disabled={selectedParticipant.attendanceStatus === 'ABSENT'}
                  className="py-2.5 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5"
                >
                  <X className="w-4 h-4" />
                  <span>MARK ABSENT</span>
                </button>
              </div>

              {/* Remove Member Button */}
              <div className="pt-2 border-t border-[#242424]">
                <button
                  onClick={() => {
                    const reg = selectedParticipant;
                    setSelectedParticipant(null);
                    setDeleteConfirmModal(reg);
                  }}
                  className="w-full py-2.5 rounded-lg bg-[#181010] hover:bg-red-950/60 border border-red-900/40 hover:border-red-700 text-red-400 hover:text-red-300 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-sm"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                  <span>REMOVE MEMBER FROM FEST</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* --------------------------------------------------------- */}
      {/* SECURE PAYMENT PROOF IMAGE MODAL                          */}
      {/* --------------------------------------------------------- */}
      {viewPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#121212] border border-[#2a2a2a] rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-[#222] pb-3">
              <div className="text-xs font-bold uppercase tracking-wider text-white">
                UPLOADED PAYMENT RECEIPT
              </div>
              <button
                onClick={() => setViewPaymentModal(null)}
                className="p-1.5 rounded-lg bg-[#222] text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-auto rounded-lg bg-black flex items-center justify-center p-2 border border-[#222]">
              <img
                src={`/api/admin/payment-proof/${encodeURIComponent(viewPaymentModal)}?adminToken=${encodeURIComponent(adminToken)}`}
                alt="Participant Payment Proof"
                className="max-h-[55vh] object-contain rounded"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '';
                  e.target.alt = 'Receipt image preview not available.';
                }}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
