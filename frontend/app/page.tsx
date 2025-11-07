"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";

interface Department {
  id: number;
  name: string;
  description: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  department_id: number | null;
  bio?: string;
}

interface Shift {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  shift_type: string;
  status: string;
  department_id: number | null;
}

interface ShiftAssignment {
  id: number;
  user_id: number;
  shift_id: number;
  status: string;
  notes: string | null;
  user?: User;
  shift?: Shift;
}

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Value>(new Date());
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [assignments, setAssignments] = useState<ShiftAssignment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"calendar" | "assignments" | "employees" | "shifts">("calendar");
  
  // Form states
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showAddShift, setShowAddShift] = useState(false);
  const [showAssignShift, setShowAssignShift] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: "", email: "", bio: "", role: "employee", department_id: "" });
  const [newShift, setNewShift] = useState({ date: "", start_time: "", end_time: "", shift_type: "morning", department_id: "" });
  const [newAssignment, setNewAssignment] = useState({ user_id: "", shift_id: "", status: "assigned", notes: "" });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const dateStr = format(selectedDate as Date, "yyyy-MM-dd");
      fetchShiftsForDate(dateStr);
    }
  }, [selectedDate]);

  const fetchData = async () => {
    try {
      const [shiftsRes, assignmentsRes, usersRes, departmentsRes] = await Promise.all([
        axios.get(`${apiUrl}/api/v1/shifts`),
        axios.get(`${apiUrl}/api/v1/shift_assignments`),
        axios.get(`${apiUrl}/api/v1/users`),
        axios.get(`${apiUrl}/api/v1/departments`),
      ]);

      setShifts(shiftsRes.data);
      setAssignments(assignmentsRes.data);
      setUsers(usersRes.data);
      setDepartments(departmentsRes.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setLoading(false);
    }
  };

  const fetchShiftsForDate = async (date: string) => {
    try {
      const res = await axios.get(`${apiUrl}/api/v1/shifts?date=${date}`);
      setShifts(res.data);
    } catch (err) {
      console.error("Error fetching shifts:", err);
    }
  };

  // Add Employee
  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${apiUrl}/api/v1/users`, {
        user: {
          ...newEmployee,
          department_id: newEmployee.department_id ? parseInt(newEmployee.department_id) : null,
        }
      });
      setNewEmployee({ name: "", email: "", bio: "", role: "employee", department_id: "" });
      setShowAddEmployee(false);
      fetchData();
    } catch (err) {
      console.error("Error adding employee:", err);
      alert("Çalışan eklenirken hata oluştu!");
    }
  };

  // Delete Employee
  const handleDeleteEmployee = async (id: number) => {
    if (!confirm("Bu çalışanı silmek istediğinize emin misiniz?")) return;
    try {
      await axios.delete(`${apiUrl}/api/v1/users/${id}`);
      fetchData();
    } catch (err) {
      console.error("Error deleting employee:", err);
      alert("Çalışan silinirken hata oluştu!");
    }
  };

  // Add Shift
  const handleAddShift = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${apiUrl}/api/v1/shifts`, {
        shift: {
          ...newShift,
          date: newShift.date || format(selectedDate as Date, "yyyy-MM-dd"),
          department_id: newShift.department_id ? parseInt(newShift.department_id) : null,
          status: "scheduled",
        }
      });
      setNewShift({ date: "", start_time: "", end_time: "", shift_type: "morning", department_id: "" });
      setShowAddShift(false);
      fetchData();
    } catch (err) {
      console.error("Error adding shift:", err);
      alert("Vardiya eklenirken hata oluştu!");
    }
  };

  // Assign Shift
  const handleAssignShift = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${apiUrl}/api/v1/shift_assignments`, {
        shift_assignment: {
          user_id: parseInt(newAssignment.user_id),
          shift_id: parseInt(newAssignment.shift_id),
          status: newAssignment.status,
          notes: newAssignment.notes || null,
        }
      });
      setNewAssignment({ user_id: "", shift_id: "", status: "assigned", notes: "" });
      setShowAssignShift(false);
      fetchData();
    } catch (err: any) {
      console.error("Error assigning shift:", err);
      alert(err.response?.data?.error || "Vardiya atanırken hata oluştu!");
    }
  };

  // Delete Assignment
  const handleDeleteAssignment = async (id: number) => {
    if (!confirm("Bu atamayı silmek istediğinize emin misiniz?")) return;
    try {
      await axios.delete(`${apiUrl}/api/v1/shift_assignments/${id}`);
      fetchData();
    } catch (err) {
      console.error("Error deleting assignment:", err);
      alert("Atama silinirken hata oluştu!");
    }
  };

  const getShiftTypeColor = (type: string) => {
    switch (type) {
      case "morning":
        return "bg-yellow-100 text-black border-yellow-300";
      case "afternoon":
        return "bg-blue-100 text-black border-blue-300";
      case "night":
        return "bg-purple-100 text-black border-purple-300";
      default:
        return "bg-gray-100 text-black border-gray-300";
    }
  };

  const getShiftTypeLabel = (type: string) => {
    switch (type) {
      case "morning":
        return "Sabah";
      case "afternoon":
        return "Öğle";
      case "night":
        return "Gece";
      default:
        return type;
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    try {
      const time = timeString.includes("T") 
        ? new Date(`2000-01-01T${timeString.split("T")[1]}`)
        : new Date(`2000-01-01T${timeString}`);
      return format(time, "HH:mm");
    } catch {
      const match = timeString.match(/(\d{2}):(\d{2})/);
      return match ? `${match[1]}:${match[2]}` : timeString;
    }
  };

  const getDateShifts = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return shifts.filter((shift) => shift.date === dateStr);
  };

  const getDateAssignments = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const dateShifts = shifts.filter((shift) => shift.date === dateStr);
    const shiftIds = dateShifts.map((s) => s.id);
    return assignments.filter((assignment) => shiftIds.includes(assignment.shift_id));
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const dateShifts = getDateShifts(date);
      if (dateShifts.length > 0) {
        return (
          <div className="mt-1 flex flex-wrap gap-1 justify-center">
            {dateShifts.slice(0, 2).map((shift) => (
              <div
                key={shift.id}
                className={`w-2 h-2 rounded-full ${getShiftTypeColor(shift.shift_type).split(" ")[0]}`}
                title={getShiftTypeLabel(shift.shift_type)}
              />
            ))}
            {dateShifts.length > 2 && (
              <div className="text-xs text-black">+{dateShifts.length - 2}</div>
            )}
          </div>
        );
      }
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-black">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  const selectedDateShifts = selectedDate ? getDateShifts(selectedDate as Date) : [];
  const selectedDateAssignments = selectedDate ? getDateAssignments(selectedDate as Date) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-black mb-2">Vardiya Yönetim Sistemi</h1>
              <p className="text-black">Vardiyaları görüntüle ve yönet</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddEmployee(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                + Çalışan Ekle
              </button>
              <button
                onClick={() => setShowAddShift(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                + Vardiya Ekle
              </button>
              <button
                onClick={() => setShowAssignShift(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                + Atama Yap
              </button>
            </div>
          </div>
        </div>

        {/* Add Employee Modal */}
        {showAddEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4 text-black">Yeni Çalışan Ekle</h2>
              <form onSubmit={handleAddEmployee} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">İsim</label>
                  <input
                    type="text"
                    required
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Bio</label>
                  <textarea
                    value={newEmployee.bio}
                    onChange={(e) => setNewEmployee({ ...newEmployee, bio: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Rol</label>
                  <select
                    value={newEmployee.role}
                    onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="employee">Çalışan</option>
                    <option value="manager">Yönetici</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Departman</label>
                  <select
                    value={newEmployee.department_id}
                    onChange={(e) => setNewEmployee({ ...newEmployee, department_id: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Departman Seçin</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Ekle
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddEmployee(false)}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Shift Modal */}
        {showAddShift && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4 text-black">Yeni Vardiya Ekle</h2>
              <form onSubmit={handleAddShift} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Tarih</label>
                  <input
                    type="date"
                    required
                    value={newShift.date || format(selectedDate as Date, "yyyy-MM-dd")}
                    onChange={(e) => setNewShift({ ...newShift, date: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Başlangıç</label>
                    <input
                      type="time"
                      required
                      value={newShift.start_time}
                      onChange={(e) => setNewShift({ ...newShift, start_time: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Bitiş</label>
                    <input
                      type="time"
                      required
                      value={newShift.end_time}
                      onChange={(e) => setNewShift({ ...newShift, end_time: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Vardiya Tipi</label>
                  <select
                    value={newShift.shift_type}
                    onChange={(e) => setNewShift({ ...newShift, shift_type: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="morning">Sabah</option>
                    <option value="afternoon">Öğle</option>
                    <option value="night">Gece</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Departman</label>
                  <select
                    value={newShift.department_id}
                    onChange={(e) => setNewShift({ ...newShift, department_id: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Departman Seçin</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Ekle
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddShift(false)}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Assign Shift Modal */}
        {showAssignShift && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4 text-black">Vardiya Atama</h2>
              <form onSubmit={handleAssignShift} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Çalışan</label>
                  <select
                    required
                    value={newAssignment.user_id}
                    onChange={(e) => setNewAssignment({ ...newAssignment, user_id: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Çalışan Seçin</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Vardiya</label>
                  <select
                    required
                    value={newAssignment.shift_id}
                    onChange={(e) => setNewAssignment({ ...newAssignment, shift_id: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Vardiya Seçin</option>
                    {shifts.map((shift) => (
                      <option key={shift.id} value={shift.id}>
                        {shift.date} - {getShiftTypeLabel(shift.shift_type)} ({formatTime(shift.start_time)} - {formatTime(shift.end_time)})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Durum</label>
                  <select
                    value={newAssignment.status}
                    onChange={(e) => setNewAssignment({ ...newAssignment, status: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="assigned">Atandı</option>
                    <option value="confirmed">Onaylandı</option>
                    <option value="completed">Tamamlandı</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Notlar</label>
                  <textarea
                    value={newAssignment.notes}
                    onChange={(e) => setNewAssignment({ ...newAssignment, notes: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Ata
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAssignShift(false)}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-black mb-4">Takvim</h2>
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              tileContent={tileContent}
              className="w-full"
            />
          </div>

          {/* Selected Date Info */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-black mb-4">
              {selectedDate ? format(selectedDate as Date, "dd MMMM yyyy") : "Tarih Seçin"}
            </h2>

            {selectedDateShifts.length === 0 ? (
              <p className="text-black text-center py-8">Bu tarihte vardiya yok</p>
            ) : (
              <div className="space-y-3">
                {selectedDateShifts.map((shift) => {
                  const shiftAssignments = assignments.filter(
                    (a) => a.shift_id === shift.id
                  );
                  return (
                    <div
                      key={shift.id}
                      className={`border-2 rounded-lg p-4 ${getShiftTypeColor(shift.shift_type)}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-black">
                          {getShiftTypeLabel(shift.shift_type)} Vardiyası
                        </span>
                        <span className="text-sm text-black">
                          {formatTime(shift.start_time)} - {formatTime(shift.end_time)}
                        </span>
                      </div>
                      {shiftAssignments.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-current border-opacity-30">
                          <p className="text-sm font-medium mb-1 text-black">Atanan Çalışanlar:</p>
                          <ul className="text-sm space-y-1 text-black">
                            {shiftAssignments.map((assignment) => {
                              const user = users.find((u) => u.id === assignment.user_id);
                              return (
                                <li key={assignment.id}>
                                  • {user?.name || "Bilinmeyen"}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 bg-white rounded-xl shadow-md">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab("calendar")}
                className={`px-6 py-3 font-medium ${
                  activeTab === "calendar"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                Vardiyalar
              </button>
              <button
                onClick={() => setActiveTab("assignments")}
                className={`px-6 py-3 font-medium ${
                  activeTab === "assignments"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                Atamalar
              </button>
              <button
                onClick={() => setActiveTab("employees")}
                className={`px-6 py-3 font-medium ${
                  activeTab === "employees"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                Çalışanlar
              </button>
              <button
                onClick={() => setActiveTab("shifts")}
                className={`px-6 py-3 font-medium ${
                  activeTab === "shifts"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                Tüm Vardiyalar
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "calendar" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-black mb-4">Tüm Vardiyalar</h3>
                {shifts.length === 0 ? (
                  <p className="text-black text-center py-8">Henüz vardiya oluşturulmamış</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {shifts.map((shift) => {
                      const shiftAssignments = assignments.filter(
                        (a) => a.shift_id === shift.id
                      );
                      return (
                        <div
                          key={shift.id}
                          className={`border-2 rounded-lg p-4 ${getShiftTypeColor(shift.shift_type)}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-black">
                              {getShiftTypeLabel(shift.shift_type)}
                            </span>
                            <span className="text-xs text-black">{shift.date}</span>
                          </div>
                          <p className="text-sm mb-2 text-black">
                            {formatTime(shift.start_time)} - {formatTime(shift.end_time)}
                          </p>
                          {shiftAssignments.length > 0 && (
                            <p className="text-xs text-black">
                              {shiftAssignments.length} çalışan atanmış
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === "assignments" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-black mb-4">Vardiya Atamaları</h3>
                {assignments.length === 0 ? (
                  <p className="text-black text-center py-8">Henüz atama yapılmamış</p>
                ) : (
                  <div className="space-y-3">
                    {assignments.map((assignment) => {
                      const user = users.find((u) => u.id === assignment.user_id);
                      const shift = shifts.find((s) => s.id === assignment.shift_id);
                      return (
                        <div
                          key={assignment.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-black">
                                {user?.name || "Bilinmeyen"}
                              </p>
                              <p className="text-sm text-black">
                                {shift ? `${shift.date} - ${getShiftTypeLabel(shift.shift_type)} (${formatTime(shift.start_time)} - ${formatTime(shift.end_time)})` : "Vardiya bulunamadı"}
                              </p>
                              {assignment.notes && (
                                <p className="text-xs text-black mt-1">{assignment.notes}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                assignment.status === "confirmed"
                                  ? "bg-green-100 text-black"
                                  : assignment.status === "completed"
                                  ? "bg-blue-100 text-black"
                                  : "bg-gray-100 text-black"
                              }`}>
                                {assignment.status}
                              </span>
                              <button
                                onClick={() => handleDeleteAssignment(assignment.id)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Sil
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === "employees" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-black mb-4">Çalışanlar</h3>
                {users.length === 0 ? (
                  <p className="text-black text-center py-8">Henüz çalışan eklenmemiş</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {users.map((user) => {
                      const department = departments.find((d) => d.id === user.department_id);
                      return (
                        <div
                          key={user.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-semibold text-black">{user.name}</p>
                              <p className="text-sm text-black">{user.email}</p>
                              <p className="text-xs text-black mt-1">
                                {department?.name || "Departman yok"} • {user.role}
                              </p>
                            </div>
                            <button
                              onClick={() => handleDeleteEmployee(user.id)}
                              className="text-red-600 hover:text-red-800 text-sm px-2 py-1"
                            >
                              Sil
                            </button>
                          </div>
                          {user.bio && (
                            <p className="text-sm text-black mt-2">{user.bio}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === "shifts" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-black mb-4">Tüm Vardiyalar</h3>
                {shifts.length === 0 ? (
                  <p className="text-black text-center py-8">Henüz vardiya oluşturulmamış</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {shifts.map((shift) => {
                      const shiftAssignments = assignments.filter(
                        (a) => a.shift_id === shift.id
                      );
                      const department = departments.find((d) => d.id === shift.department_id);
                      return (
                        <div
                          key={shift.id}
                          className={`border-2 rounded-lg p-4 ${getShiftTypeColor(shift.shift_type)}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-black">
                              {getShiftTypeLabel(shift.shift_type)}
                            </span>
                            <span className="text-xs text-black">{shift.date}</span>
                          </div>
                          <p className="text-sm mb-2 text-black">
                            {formatTime(shift.start_time)} - {formatTime(shift.end_time)}
                          </p>
                          {department && (
                            <p className="text-xs mb-2 text-black">Departman: {department.name}</p>
                          )}
                          {shiftAssignments.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-current border-opacity-30">
                              <p className="text-xs font-medium mb-1 text-black">Atanan Çalışanlar:</p>
                              <ul className="text-xs space-y-1 text-black">
                                {shiftAssignments.map((assignment) => {
                                  const user = users.find((u) => u.id === assignment.user_id);
                                  return (
                                    <li key={assignment.id}>
                                      • {user?.name || "Bilinmeyen"}
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
