import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
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
  MessageCircle
} from 'lucide-react';
import { EVENT_CONFIG } from '../config/eventConfig';

export default function Admin({ onNavigateHome }) {
  // Auth state
  const [adminKey, setAdminKey] = useState(() => localStorage.getItem('frame_fest_admin_key') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginInput, setLoginInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Data state
  const [registrations, setRegistrations] = useState([]);
  const [stats, setStats] = useState({ total: 0, confirmed: 0, pending: 0, cancelled: 0 });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [sectionFilter, setSectionFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal for Viewing Details
  const [selectedReg, setSelectedReg] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Check login on load
  useEffect(() => {
    if (adminKey) {
      verifyAdminKey(adminKey);
    }
  }, []);

  const verifyAdminKey = async (key) => {
    try {
      let isSuccess = false;
      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key })
        });
        if (res.ok) {
          isSuccess = true;
        } else if (key === 'admin2026') {
          isSuccess = true;
        }
      } catch {
        if (key === 'admin2026') {
          isSuccess = true;
        }
      }

      if (isSuccess) {
        setIsAuthenticated(true);
        localStorage.setItem('frame_fest_admin_key', key);
        fetchData(key);
      } else {
        setIsAuthenticated(false);
        localStorage.removeItem('frame_fest_admin_key');
        setLoginError('Invalid admin passkey. Please try again.');
      }
    } catch {
      setLoginError('Unable to connect to server.');
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginInput.trim()) {
      setLoginError('Please enter admin passkey.');
      return;
    }
    setLoginError('');
    setAdminKey(loginInput.trim());
    verifyAdminKey(loginInput.trim());
  };

  const handleLogout = () => {
    localStorage.removeItem('frame_fest_admin_key');
    setAdminKey('');
    setIsAuthenticated(false);
    setRegistrations([]);
  };

  // Fetch registrations and stats
  const fetchData = async (key = adminKey) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (deptFilter !== 'ALL') params.append('department', deptFilter);
      if (sectionFilter !== 'ALL') params.append('section', sectionFilter);
      if (statusFilter !== 'ALL') params.append('status', statusFilter);

      let fetched = false;
      try {
        const [regRes, statsRes] = await Promise.all([
          fetch(`/api/admin/registrations?${params.toString()}`, {
            headers: { 'x-admin-key': key }
          }),
          fetch('/api/admin/stats', {
            headers: { 'x-admin-key': key }
          })
        ]);

        if (regRes.ok && statsRes.ok) {
          const regJson = await regRes.json();
          const statsJson = await statsRes.json();
          setRegistrations(regJson.data || []);
          setStats(statsJson);
          fetched = true;
        }
      } catch {}

      if (!fetched) {
        // Fallback for static hosting (e.g. GitHub Pages)
        let local = JSON.parse(localStorage.getItem('frame_fest_registrations') || '[]');
        if (searchTerm) {
          const s = searchTerm.toLowerCase();
          local = local.filter(r => (r.name || '').toLowerCase().includes(s) || (r.registerNumber || '').toLowerCase().includes(s) || (r.email || '').toLowerCase().includes(s));
        }
        if (deptFilter !== 'ALL') local = local.filter(r => r.department === deptFilter);
        if (sectionFilter !== 'ALL') local = local.filter(r => r.section === sectionFilter);
        if (statusFilter !== 'ALL') local = local.filter(r => (r.status || 'Confirmed') === statusFilter);

        setRegistrations(local);
        const allLocal = JSON.parse(localStorage.getItem('frame_fest_registrations') || '[]');
        setStats({
          total: allLocal.length,
          confirmed: allLocal.filter(r => (r.status || 'Confirmed') === 'Confirmed').length,
          pending: allLocal.filter(r => r.status === 'Pending').length,
          cancelled: allLocal.filter(r => r.status === 'Cancelled').length
        });
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Error loading registration data.');
    } finally {
      setLoading(false);
    }
  };

  // Trigger search on filter changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [searchTerm, deptFilter, sectionFilter, statusFilter]);

  // Update status for a participant
  const handleStatusChange = async (regId, newStatus) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/admin/registrations/${regId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setRegistrations((prev) =>
          prev.map((r) => (r.registrationId === regId ? { ...r, status: newStatus } : r))
        );
        if (selectedReg && selectedReg.registrationId === regId) {
          setSelectedReg((prev) => ({ ...prev, status: newStatus }));
        }
        fetchData();
      } else {
        alert('Failed to update status.');
      }
    } catch (err) {
      alert('Error updating status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    window.open(`/api/admin/export-csv?adminKey=${encodeURIComponent(adminKey)}`, '_blank');
  };

  // Render Login Card if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
        <div className="bg-[#121212] border border-[#262626] rounded-2xl max-w-md w-full p-8 shadow-2xl text-center">
          
          <div className="w-14 h-14 rounded-full bg-[#1b1b1b] border border-[#333] text-[#e50914] flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>

          <h2 className="text-2xl font-black font-cinematic uppercase tracking-tight text-white mb-1">
            ORGANIZER PORTAL
          </h2>
          <p className="text-xs text-neutral-400 mb-6">
            Enter authorized administrator passkey to view {EVENT_CONFIG.name} registrations.
          </p>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                ADMIN PASSKEY
              </label>
              <input
                type="password"
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                placeholder="Enter passkey (default: admin2026)"
                className="w-full px-4 py-3 rounded-lg bg-[#181818] border border-[#333] text-white placeholder-neutral-500 text-sm focus:outline-none focus:ring-1 focus:ring-[#e50914] focus:border-[#e50914]"
              />
            </div>

            {loginError && (
              <p className="text-xs text-red-400">{loginError}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-[#e50914] hover:bg-[#b80710] text-white font-bold tracking-wider uppercase text-sm shadow-[0_0_15px_rgba(229,9,20,0.4)] transition-all"
            >
              UNLOCK DASHBOARD
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

  // Status badge helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED':
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-green-950/40 text-green-400 border border-green-800/50">
            <CheckCircle2 className="w-3 h-3" />
            <span>CONFIRMED</span>
          </span>
        );
      case 'CANCELLED':
      case 'REJECTED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-950/40 text-red-400 border border-red-800/50">
            <XCircle className="w-3 h-3" />
            <span>CANCELLED</span>
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-yellow-950/40 text-yellow-400 border border-yellow-800/50">
            <Clock className="w-3 h-3" />
            <span>PENDING</span>
          </span>
        );
    }
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-[#222] gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono font-bold tracking-widest text-[#e50914] uppercase mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>SECURE ORGANIZER CONSOLE</span>
          </div>
          <h1 className="text-3xl font-black font-cinematic uppercase tracking-tight text-white">
            {EVENT_CONFIG.titlePrefix} <span className="text-[#e50914]">{EVENT_CONFIG.titleYear}</span> REGISTRATIONS
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            {EVENT_CONFIG.department} • {EVENT_CONFIG.college}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => fetchData()}
            disabled={loading}
            className="p-2.5 rounded-lg bg-[#181818] border border-[#2d2d2d] text-neutral-300 hover:text-white hover:border-[#444] transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#e50914]' : ''}`} />
          </button>

          <button
            onClick={handleExportCsv}
            className="px-4 py-2.5 rounded-lg bg-[#181818] border border-[#333] hover:border-[#e50914] text-white text-xs font-bold tracking-wider uppercase flex items-center space-x-2 transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-[#e50914]" />
            <span>EXPORT CSV</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-2.5 rounded-lg bg-red-950/20 border border-red-900/40 text-red-400 hover:bg-red-950/40 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#121212] border border-[#222] rounded-xl p-5 shadow-sm">
          <div className="text-xs font-mono font-bold tracking-widest text-neutral-400 uppercase">
            TOTAL REGISTERED
          </div>
          <div className="text-3xl font-black text-white mt-1 font-mono">
            {stats.total}
          </div>
        </div>

        <div className="bg-[#121212] border border-[#222] rounded-xl p-5 shadow-sm">
          <div className="text-xs font-mono font-bold tracking-widest text-green-500 uppercase">
            CONFIRMED
          </div>
          <div className="text-3xl font-black text-green-400 mt-1 font-mono">
            {stats.confirmed}
          </div>
        </div>

        <div className="bg-[#121212] border border-[#222] rounded-xl p-5 shadow-sm">
          <div className="text-xs font-mono font-bold tracking-widest text-yellow-500 uppercase">
            PENDING
          </div>
          <div className="text-3xl font-black text-yellow-400 mt-1 font-mono">
            {stats.pending}
          </div>
        </div>

        <div className="bg-[#121212] border border-[#222] rounded-xl p-5 shadow-sm">
          <div className="text-xs font-mono font-bold tracking-widest text-red-500 uppercase">
            CANCELLED
          </div>
          <div className="text-3xl font-black text-red-400 mt-1 font-mono">
            {stats.cancelled}
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-[#121212] border border-[#222] rounded-xl p-4 sm:p-5 flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Name, Register No, or Reg ID..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#181818] border border-[#2a2a2a] text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-[#e50914]"
          />
        </div>

        {/* Filter: Department */}
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

        {/* Filter: Section */}
        <select
          value={sectionFilter}
          onChange={(e) => setSectionFilter(e.target.value)}
          className="px-3 py-2.5 rounded-lg bg-[#181818] border border-[#2a2a2a] text-white text-xs focus:outline-none focus:border-[#e50914]"
        >
          <option value="ALL">All Sections</option>
          {EVENT_CONFIG.sections.map((sec, i) => (
            <option key={i} value={sec}>Sec {sec}</option>
          ))}
        </select>

        {/* Filter: Status */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 rounded-lg bg-[#181818] border border-[#2a2a2a] text-white text-xs focus:outline-none focus:border-[#e50914]"
        >
          <option value="ALL">All Statuses</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="PENDING">Pending</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Registrations Table */}
      <div className="bg-[#121212] border border-[#242424] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-[#181818] text-neutral-400 uppercase font-mono tracking-wider text-[11px] border-b border-[#222]">
              <tr>
                <th className="py-3.5 px-4">Reg ID</th>
                <th className="py-3.5 px-4">Participant Name</th>
                <th className="py-3.5 px-4">Register No</th>
                <th className="py-3.5 px-4">Dept / Sec</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e1e]">
              {registrations.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-neutral-500">
                    {loading ? 'Loading registrations...' : 'No registrations found.'}
                  </td>
                </tr>
              ) : (
                registrations.map((reg) => (
                  <tr key={reg.registrationId} className="hover:bg-[#161616] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#e50914]">
                      {reg.registrationId}
                    </td>
                    <td className="py-3 px-4 font-semibold text-white">
                      {reg.name}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {reg.registerNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-white max-w-[160px] truncate">{reg.department}</div>
                      <div className="text-[10px] text-neutral-500">Section {reg.section}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px]">
                      <div>{reg.phone}</div>
                      <div className="text-neutral-500 truncate max-w-[140px]">{reg.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(reg.status)}
                    </td>
                    <td className="py-3 px-4 text-neutral-400 text-[11px] whitespace-nowrap">
                      {new Date(reg.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setSelectedReg(reg)}
                        className="p-1.5 rounded bg-[#202020] hover:bg-[#2c2c2c] text-neutral-200 hover:text-white transition-colors"
                        title="View Participant Profile"
                      >
                        <Eye className="w-4 h-4 text-[#e50914]" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail & Status Modal */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#141414] border border-[#2e2e2e] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#242424] pb-4 mb-6">
              <div>
                <span className="text-xs font-mono font-bold text-[#e50914] uppercase">
                  {selectedReg.registrationId}
                </span>
                <h3 className="text-xl font-black font-cinematic uppercase text-white">
                  {selectedReg.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReg(null)}
                className="p-2 rounded-lg bg-[#222] text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Participant Details */}
            <div className="space-y-3 text-xs bg-[#0d0d0d] p-5 rounded-xl border border-[#222] mb-6">
              <div className="text-neutral-400 font-bold uppercase text-[10px] tracking-wider mb-2">
                PARTICIPANT PROFILE
              </div>
              <div className="flex justify-between py-1 border-b border-[#1c1c1c]">
                <span className="text-neutral-500">Reg Number:</span>
                <span className="font-mono text-white font-bold">{selectedReg.registerNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1c1c1c]">
                <span className="text-neutral-500">Department:</span>
                <span className="text-white font-medium">{selectedReg.department}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1c1c1c]">
                <span className="text-neutral-500">Section:</span>
                <span className="text-white font-bold">{selectedReg.section}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1c1c1c]">
                <span className="text-neutral-500">Phone:</span>
                <span className="font-mono text-white">{selectedReg.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1c1c1c]">
                <span className="text-neutral-500">Email:</span>
                <span className="text-white">{selectedReg.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1c1c1c]">
                <span className="text-neutral-500">Registered At:</span>
                <span className="text-neutral-300">{new Date(selectedReg.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-neutral-500">Current Status:</span>
                {getStatusBadge(selectedReg.status)}
              </div>
            </div>

            {/* Status Update Control */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                CHANGE PARTICIPANT STATUS
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleStatusChange(selectedReg.registrationId, 'CONFIRMED')}
                  disabled={updatingStatus || selectedReg.status === 'CONFIRMED'}
                  className="py-2.5 px-3 rounded-lg bg-green-950/40 hover:bg-green-900/60 border border-green-700/50 text-green-300 text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  CONFIRMED
                </button>

                <button
                  onClick={() => handleStatusChange(selectedReg.registrationId, 'PENDING')}
                  disabled={updatingStatus || selectedReg.status === 'PENDING'}
                  className="py-2.5 px-3 rounded-lg bg-yellow-950/40 hover:bg-yellow-900/60 border border-yellow-700/50 text-yellow-300 text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  PENDING
                </button>

                <button
                  onClick={() => handleStatusChange(selectedReg.registrationId, 'CANCELLED')}
                  disabled={updatingStatus || selectedReg.status === 'CANCELLED'}
                  className="py-2.5 px-3 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-700/50 text-red-300 text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  CANCELLED
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
