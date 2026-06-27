import React, { useState, useEffect } from 'react';
import { 
  Users, Calendar, Clock, FileText, LogOut, Camera, 
  Settings, Download, Plus, Trash2, CheckCircle, AlertTriangle,
  Key, CalendarDays, Upload, FileSpreadsheet
} from 'lucide-react';

export default function App() {
  // --- STATE MANAGEMENT ---
  const [view, setView] = useState('login'); // 'login', 'admin', 'employee'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState(null);
  const [modal, setModal] = useState({ isOpen: false, type: 'success', title: '', message: '' });
  const [attendanceType, setAttendanceType] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Data Perusahaan Umum
  const [employees, setEmployees] = useState([
    { id: 'EMP-001', name: 'Yusran Tanjung', role: 'Juru Masak', location: 'Tanjung Gading' },
    { id: 'EMP-002', name: 'Yoga Shila', role: 'ADM/Gudang', location: 'Tanjung Gading' },
    { id: 'EMP-003', name: 'Edi Suwanda', role: 'SVP', location: 'Tanjung Gading' },
    { id: 'EMP-004', name: 'Bayu Purnomo', role: 'Juru Masak', location: 'Tanjung Gading' }
  ]);
  
  const [shiftCodes, setShiftCodes] = useState([
    { code: 'H', name: 'Hadir/Biasa', start: '08:00', end: '17:00' },
    { code: 'P', name: 'Pagi', start: '06:00', end: '14:00' },
    { code: 'S', name: 'Siang', start: '14:00', end: '22:00' },
    { code: '2', name: 'Shift 2', start: '10:00', end: '18:00' },
    { code: '3S', name: 'Shift 3S', start: '12:00', end: '20:00' },
    { code: 'M', name: 'Malam', start: '22:00', end: '06:00' },
    { code: 'OFF', name: 'Libur', start: '00:00', end: '00:00' }
  ]);

  const [attendance, setAttendance] = useState([]);

  // --- STATE JADWAL KERJA (CALENDAR DATA) ---
  // Format: { 'EMP-001': { '2026-06-21': 'H', '2026-06-22': 'P' } }
  const [schedules, setSchedules] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(new Date(2026, 5)); // Default Juni 2026 (Sesuai referensi gambar)

  // --- REALTIME CLOCK EFFECT ---
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- MODAL TRIGGER ---
  const triggerModal = (type, title, message) => {
    setModal({ isOpen: true, type, title, message });
  };

  // --- LOGIN LOGIC ---
  const handleLogin = (e) => {
    e.preventDefault();
    const loginId = e.target.loginId.value.trim();

    if (loginId === 'admin') { // Disederhanakan untuk kemudahan prototype
      setView('admin');
      setActiveTab('dashboard');
    } else {
      const emp = employees.find(el => el.id.toLowerCase() === loginId.toLowerCase());
      if (emp) {
        setCurrentUser(emp);
        setView('employee');
      } else {
        triggerModal('error', 'Gagal Masuk', 'ID Karyawan tidak ditemukan di dalam sistem.');
      }
    }
  };

  const handleLogout = () => {
    setView('login');
    setCurrentUser(null);
  };

  // --- ADMIN FUNCTIONS ---
  const generateId = () => {
    const activeIds = employees.map(e => parseInt(e.id.replace('EMP-', ''))).filter(n => !isNaN(n));
    const nextNum = activeIds.length > 0 ? Math.max(...activeIds) + 1 : 1;
    return 'EMP-' + nextNum.toString().padStart(3, '0');
  };

  const addEmployee = (e) => {
    e.preventDefault();
    const newEmp = {
      id: generateId(),
      name: e.target.name.value,
      role: e.target.role.value,
      location: e.target.location.value
    };
    setEmployees([...employees, newEmp]);
    e.target.reset();
    triggerModal('success', 'Karyawan Ditambahkan', `Nama: ${newEmp.name} berhasil terdaftar dengan ID Login: ${newEmp.id}`);
  };

  const deleteEmployee = (id) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  // Fungsi mensimulasikan "Upload & Ekstrak Gambar/Excel Jadwal"
  const simulateScheduleUpload = () => {
    // Data ini direplikasi dari referensi 1000180867.jpg untuk tanggal 21 Juni - 30 Juni 2026
    const mockExtractedData = {
      'EMP-001': { '2026-06-21':'H', '2026-06-22':'H', '2026-06-23':'2', '2026-06-24':'2', '2026-06-25':'2', '2026-06-26':'P', '2026-06-27':'P', '2026-06-28':'H', '2026-06-29':'H', '2026-06-30':'2' }, // Yusran
      'EMP-002': { '2026-06-21':'H', '2026-06-22':'2', '2026-06-23':'2', '2026-06-24':'2', '2026-06-25':'2', '2026-06-26':'2', '2026-06-27':'2', '2026-06-28':'H', '2026-06-29':'H', '2026-06-30':'2' }, // Yoga
      'EMP-003': { '2026-06-21':'H', '2026-06-22':'2', '2026-06-23':'2', '2026-06-24':'2', '2026-06-25':'2', '2026-06-26':'2', '2026-06-27':'2', '2026-06-28':'H', '2026-06-29':'H', '2026-06-30':'2' }, // Edi
      'EMP-004': { '2026-06-21':'H', '2026-06-22':'H', '2026-06-23':'S', '2026-06-24':'S', '2026-06-25':'S', '2026-06-26':'S', '2026-06-27':'S', '2026-06-28':'H', '2026-06-29':'H', '2026-06-30':'25' }  // Bayu
    };
    
    setSchedules(mockExtractedData);
    triggerModal('success', 'Ekstrak Berhasil', 'File jadwal berhasil diurai dan didistribusikan ke kalender masing-masing personel.');
  };

  const handleScheduleChange = (empId, dateString, value) => {
    setSchedules(prev => ({
      ...prev,
      [empId]: {
        ...(prev[empId] || {}),
        [dateString]: value.toUpperCase()
      }
    }));
  };

  // --- EMPLOYEE FUNCTIONS ---
  const processAttendance = (e) => {
    const file = e.target.files[0];
    if (file && currentUser) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const dateString = now.toISOString().split('T')[0];

        // Mendapatkan jadwal karyawan hari ini (jika ada)
        const mySchedule = schedules[currentUser.id] || {};
        const todayShiftCode = mySchedule[dateString] || '-';

        if (attendanceType === 'in') {
          const newRecord = {
            id: Date.now(),
            empId: currentUser.id,
            name: currentUser.name,
            date: dateString,
            timeIn: timeString,
            timeOut: '-',
            shiftInfo: todayShiftCode !== '-' ? `Shift ${todayShiftCode}` : 'Tanpa Jadwal',
            photo: event.target.result,
            status: 'Hadir'
          };
          setAttendance([newRecord, ...attendance]);
          triggerModal('success', 'Absen Masuk Berhasil', `Dicatat pukul ${timeString}. Selamat bekerja!`);
        } else if (attendanceType === 'out') {
          let found = false;
          const updatedAtt = attendance.map(rec => {
            if (rec.empId === currentUser.id && rec.date === dateString) {
              found = true;
              return { ...rec, timeOut: timeString };
            }
            return rec;
          });
          if (found) {
            setAttendance(updatedAtt);
            triggerModal('success', 'Absen Pulang Berhasil', `Waktu pulang dicatat pukul ${timeString}.`);
          } else {
            triggerModal('error', 'Gagal Absen', 'Anda belum terdeteksi absen masuk hari ini.');
          }
        }
        setAttendanceType(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerMockAttendance = (type) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateString = now.toISOString().split('T')[0];
    const mySchedule = schedules[currentUser.id] || {};
    const todayShiftCode = mySchedule[dateString] || '-';

    if (type === 'in') {
      const newRecord = {
        id: Date.now(), empId: currentUser.id, name: currentUser.name, date: dateString,
        timeIn: timeString, timeOut: '-', shiftInfo: todayShiftCode !== '-' ? `Shift ${todayShiftCode}` : 'Tanpa Jadwal',
        photo: null, status: 'Hadir'
      };
      setAttendance([newRecord, ...attendance]);
      triggerModal('success', 'Masuk (Bypass)', `Absen masuk simulasi berhasil pukul ${timeString}.`);
    } else {
      const updatedAtt = attendance.map(rec => {
        if (rec.empId === currentUser.id && rec.date === dateString) return { ...rec, timeOut: timeString };
        return rec;
      });
      setAttendance(updatedAtt);
      triggerModal('success', 'Pulang (Bypass)', `Absen pulang simulasi berhasil pukul ${timeString}.`);
    }
  };

  // --- RENDERERS ---
  const renderModal = () => {
    if (!modal.isOpen) return null;
    return (
      <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[100] p-4">
        <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-slate-100 transform transition-all scale-100 text-center">
          <div className="flex items-center justify-center mb-4">
            {modal.type === 'success' && <div className="text-emerald-500"><CheckCircle size={48} /></div>}
            {modal.type === 'error' && <div className="text-red-500"><AlertTriangle size={48} /></div>}
          </div>
          <h4 className="text-xl font-bold text-slate-800 mb-2">{modal.title}</h4>
          <p className="text-slate-600 text-sm mb-6">{modal.message}</p>
          <button 
            onClick={() => setModal({ ...modal, isOpen: false })}
            className="w-full bg-slate-900 text-white font-semibold rounded-xl py-3 hover:bg-slate-800 transition shadow-md"
          >
            Tutup
          </button>
        </div>
      </div>
    );
  };

  const renderLogin = () => (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-slate-200">
        <div className="text-center mb-8">
          <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
            <Users size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Sistem Presensi</h1>
          <p className="text-slate-500 mt-1 font-medium text-sm">Manajemen Karyawan & Jadwal Kerja</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">ID Karyawan / Admin</label>
            <div className="relative">
              <input 
                type="text" 
                name="loginId"
                required
                className="w-full pl-4 pr-10 py-3.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition font-medium text-slate-800"
                placeholder="Masukkan ID Anda..."
              />
              <Key className="absolute right-3.5 top-3.5 text-slate-400" size={20} />
            </div>
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition duration-200 shadow-md"
          >
            Masuk ke Sistem
          </button>
        </form>
      </div>
    </div>
  );

  const renderAdmin = () => {
    // Generate dates for current selected month grid
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const datesArray = Array.from({length: daysInMonth}, (_, i) => i + 1);

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="w-full lg:w-64 bg-slate-900 text-white flex flex-col print:hidden shadow-xl">
          <div className="p-6 border-b border-slate-800">
            <h2 className="font-bold text-lg tracking-tight">Admin Portal</h2>
            <span className="text-xs text-slate-400">Manajemen Perusahaan</span>
          </div>
          
          <nav className="flex-1 px-4 space-y-1 mt-6">
            {[
              { id: 'dashboard', icon: Users, label: 'Data Karyawan' },
              { id: 'schedule', icon: CalendarDays, label: 'Tabel Jadwal Kerja' },
              { id: 'reports', icon: FileText, label: 'Laporan Absensi' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${activeTab === item.id ? 'bg-blue-600 text-white font-bold' : 'hover:bg-slate-800 text-slate-300'}`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-slate-800">
            <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-500/20 text-red-400 transition font-semibold">
              <LogOut size={20} /> <span>Keluar</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto w-full">
          {activeTab === 'dashboard' && (
            <div className="space-y-6 max-w-5xl">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-black mb-4">Pendaftaran Karyawan Baru</h3>
                <form onSubmit={addEmployee} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input type="text" name="name" required placeholder="Nama Lengkap" className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-400" />
                  <input type="text" name="role" required placeholder="Jabatan" className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-400" />
                  <input type="text" name="location" required placeholder="Lokasi Penugasan" className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-400" />
                  <button type="submit" className="bg-slate-900 text-white font-bold rounded-xl p-3 flex justify-center items-center gap-2">
                    <Plus size={18}/> Tambah
                  </button>
                </form>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-100 text-slate-500 uppercase font-bold text-xs">
                    <tr>
                      <th className="p-4">ID Login</th>
                      <th className="p-4">Nama</th>
                      <th className="p-4">Jabatan</th>
                      <th className="p-4">Lokasi</th>
                      <th className="p-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map(emp => (
                      <tr key={emp.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                        <td className="p-4 font-mono font-bold text-blue-600">{emp.id}</td>
                        <td className="p-4 font-bold">{emp.name}</td>
                        <td className="p-4">{emp.role}</td>
                        <td className="p-4">{emp.location}</td>
                        <td className="p-4 text-center">
                          <button onClick={() => deleteEmployee(emp.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg"><Trash2 size={16}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TABEL JADWAL KERJA */}
          {activeTab === 'schedule' && (
            <div className="space-y-6">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-800">Distribusi Jadwal Karyawan</h2>
                  <p className="text-slate-500 text-sm">Filter jadwal personalisasi. Input di sini akan otomatis tampil di kalender karyawan masing-masing.</p>
                </div>
                <button 
                  onClick={simulateScheduleUpload}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 text-sm shadow-md"
                >
                  <FileSpreadsheet size={18}/> Import Data Jadwal (Simulasi Ekstrak)
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 bg-slate-50 border-b flex items-center justify-between">
                  <div className="font-bold text-slate-800">
                    Periode: {selectedMonth.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">*Ketik kode (H, P, S, 2, dll) di dalam kotak untuk mengubah jadwal individu.</div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-center border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-800 text-white">
                        <th className="p-3 text-left sticky left-0 bg-slate-900 min-w-[150px] z-10">Nama Karyawan</th>
                        {datesArray.map(date => (
                          <th key={date} className="p-2 min-w-[35px] border-l border-slate-700">
                            {date}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map(emp => (
                        <tr key={emp.id} className="border-b border-slate-200 hover:bg-blue-50/30">
                          <td className="p-3 text-left font-bold text-slate-800 sticky left-0 bg-white border-r shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] z-10">
                            <div className="truncate w-full">{emp.name}</div>
                            <div className="text-[10px] text-slate-400 font-normal">{emp.role}</div>
                          </td>
                          {datesArray.map(date => {
                            const dateStr = `${year}-${String(month+1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
                            const val = schedules[emp.id]?.[dateStr] || '';
                            return (
                              <td key={date} className="p-1 border-l border-slate-200">
                                <input
                                  type="text"
                                  value={val}
                                  onChange={(e) => handleScheduleChange(emp.id, dateStr, e.target.value)}
                                  className="w-full text-center py-1.5 font-bold uppercase outline-none focus:bg-blue-100 rounded-sm bg-transparent"
                                  maxLength={3}
                                />
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Legenda Shift */}
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Referensi Kode Shift</h4>
                <div className="flex flex-wrap gap-2">
                  {shiftCodes.map(s => (
                    <div key={s.code} className="bg-slate-100 px-3 py-1.5 rounded-lg text-xs">
                      <strong className="text-blue-600">{s.code}</strong> = {s.name} ({s.start}-{s.end})
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Laporan (Sederhana) */}
          {activeTab === 'reports' && (
             <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-black mb-4">Riwayat Kehadiran (Log Harian)</h3>
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-100 text-slate-500 uppercase font-bold text-xs">
                    <tr><th className="p-3">Tgl</th><th className="p-3">Nama</th><th className="p-3">Masuk</th><th className="p-3">Pulang</th><th className="p-3">Jadwal Shift</th></tr>
                  </thead>
                  <tbody>
                    {attendance.map(r => (
                      <tr key={r.id} className="border-b"><td className="p-3">{r.date}</td><td className="p-3 font-bold">{r.name}</td><td className="p-3 text-emerald-600 font-bold">{r.timeIn}</td><td className="p-3 text-blue-600 font-bold">{r.timeOut}</td><td className="p-3 text-xs">{r.shiftInfo}</td></tr>
                    ))}
                    {attendance.length === 0 && <tr><td colSpan="5" className="p-6 text-center text-slate-400">Belum ada data terekam.</td></tr>}
                  </tbody>
                </table>
             </div>
          )}
        </div>
      </div>
    );
  };

  const renderEmployee = () => {
    // Calendar Generation Logic for Employee Dashboard
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const startDayIndex = firstDay === 0 ? 6 : firstDay - 1; // Adjust so Monday is column 0
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const daysArray = [];
    for (let i = 0; i < startDayIndex; i++) daysArray.push(null); // Empty slots before day 1
    for (let i = 1; i <= daysInMonth; i++) daysArray.push(i);

    const todayDateString = new Date().toISOString().split('T')[0];

    return (
      <div className="min-h-screen bg-slate-100 pb-10 font-sans">
        {/* Header Karyawan */}
        <div className="bg-blue-600 text-white p-6 shadow-lg rounded-b-[2rem] mb-6 flex justify-between items-start max-w-md mx-auto">
          <div>
            <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">Karyawan Aktif</p>
            <h2 className="text-2xl font-black">{currentUser?.name}</h2>
            <div className="mt-2 text-xs opacity-90 font-medium">
              {currentUser?.role} • {currentUser?.location}
            </div>
          </div>
          <button onClick={handleLogout} className="p-2.5 bg-white/10 rounded-xl hover:bg-red-500 text-white transition">
            <LogOut size={20} />
          </button>
        </div>

        <div className="px-4 max-w-md mx-auto space-y-5">
          
          {/* Tombol Aksi Absen */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200">
            <h3 className="text-slate-800 font-black mb-4 flex items-center gap-2">
              <Camera className="text-blue-500" size={18}/> Panel Presensi
            </h3>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button 
                onClick={() => document.getElementById('camera-input').click()}
                onMouseDown={() => setAttendanceType('in')}
                className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl hover:bg-emerald-100 font-bold flex flex-col items-center gap-2"
              >
                <div className="bg-emerald-200 p-2 rounded-full"><Camera size={20}/></div>
                <span>Masuk</span>
              </button>
              <button 
                onClick={() => document.getElementById('camera-input').click()}
                onMouseDown={() => setAttendanceType('out')}
                className="p-4 bg-blue-50 border border-blue-100 text-blue-700 rounded-2xl hover:bg-blue-100 font-bold flex flex-col items-center gap-2"
              >
                <div className="bg-blue-200 p-2 rounded-full"><LogOut size={20}/></div>
                <span>Pulang</span>
              </button>
            </div>

            {/* Tombol Bypass Dummy Desktop */}
            <div className="flex gap-2 text-xs border-t pt-3">
               <button onClick={() => triggerMockAttendance('in')} className="flex-1 py-1.5 bg-slate-100 rounded text-slate-600 font-semibold">Simulasi Masuk</button>
               <button onClick={() => triggerMockAttendance('out')} className="flex-1 py-1.5 bg-slate-100 rounded text-slate-600 font-semibold">Simulasi Pulang</button>
            </div>
          </div>

          <input type="file" id="camera-input" accept="image/*" capture="user" className="hidden" onChange={processAttendance} />

          {/* KALENDER JADWAL PERSONAL */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200">
             <div className="flex justify-between items-center mb-4">
               <h3 className="text-slate-800 font-black flex items-center gap-2">
                <CalendarDays className="text-blue-500" size={18}/> Jadwal Saya
              </h3>
              <div className="text-xs font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                {selectedMonth.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
              </div>
             </div>

             {/* Grid Kalender */}
             <div className="grid grid-cols-7 gap-1 text-center mb-4">
                {['Sn','Sl','Rb','Km','Jm','Sb','Mn'].map(day => (
                  <div key={day} className="text-[10px] font-black text-slate-400 py-1">{day}</div>
                ))}
                
                {daysArray.map((day, idx) => {
                  if (!day) return <div key={`empty-${idx}`} className="p-2"></div>;
                  
                  const dateStr = `${year}-${String(month+1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const myShift = (schedules[currentUser.id] || {})[dateStr];
                  const isToday = dateStr === todayDateString;

                  return (
                    <div key={dateStr} className={`flex flex-col items-center justify-center p-1 rounded-lg border h-[52px] ${isToday ? 'border-blue-400 bg-blue-50' : 'border-slate-100'}`}>
                      <span className={`text-[10px] font-bold ${isToday ? 'text-blue-600' : 'text-slate-500'}`}>{day}</span>
                      {myShift ? (
                        <span className={`text-xs font-black px-1.5 py-0.5 rounded mt-0.5 w-full overflow-hidden ${
                           myShift === 'H' ? 'bg-emerald-100 text-emerald-700' : 
                           myShift === 'OFF' ? 'bg-red-100 text-red-700' : 
                           'bg-amber-100 text-amber-700'
                        }`}>
                          {myShift}
                        </span>
                      ) : (
                         <span className="text-[10px] text-slate-300 mt-1">-</span>
                      )}
                    </div>
                  );
                })}
             </div>

             <div className="text-[10px] text-slate-500 border-t pt-3">
               <strong>Keterangan:</strong> Jadwal ini di-filter otomatis berdasarkan ID Anda. Jika ada kekeliruan atau kosong, harap hubungi Admin perusahaan Anda.
             </div>
          </div>

        </div>
      </div>
    );
  };

  return (
    <>
      {view === 'login' && renderLogin()}
      {view === 'admin' && renderAdmin()}
      {view === 'employee' && renderEmployee()}
      {renderModal()}
    </>
  );
}
