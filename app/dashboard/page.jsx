"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";
import {
  BarChart3,
  Users,
  DollarSign,
  TrendingUp,
  Bell,
  Settings,
  Search,
  Menu,
  X,
  User,
  LogOut,
  Home,
  FileText,
  Calendar,
  Mail,
  Activity,
  ChevronDown,
} from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    // Optional: decode token to verify expiration
    try {
      const decoded = jwt.decode(token);
      if (Date.now() >= decoded.exp * 1000) {
        localStorage.removeItem("token");
        router.push("/login");
      } else {
        // Set user info from token
        setUser({
          name: decoded.name || "John Doe",
          email: decoded.email || "john@example.com",
          avatar: decoded.avatar || null,
        });
      }
    } catch (e) {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const sidebarItems = [
    { icon: Home, label: "Dashboard", active: true },
    { icon: BarChart3, label: "Analytics" },
    { icon: Users, label: "Users" },
    { icon: FileText, label: "Reports" },
    { icon: Calendar, label: "Calendar" },
    { icon: Mail, label: "Messages" },
    { icon: Settings, label: "Settings" },
  ];

  const stats = [
    {
      title: "Total Revenue",
      value: "$45,231",
      change: "+20.1%",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Active Users",
      value: "2,420",
      change: "+15.3%",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Sales",
      value: "1,320",
      change: "+8.2%",
      icon: TrendingUp,
      color: "text-purple-600",
    },
    {
      title: "Performance",
      value: "98.3%",
      change: "+2.1%",
      icon: Activity,
      color: "text-orange-600",
    },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-8">
          {sidebarItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                item.active
                  ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                  : ""
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100 mr-2"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-semibold text-gray-900">
                Dashboard
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
                    <div className="py-1">
                      <a
                        href="#"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <User className="w-4 h-4 mr-3" />
                        Profile
                      </a>
                      <a
                        href="#"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Settings
                      </a>
                      <div className="border-t border-gray-100"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6">
          {/* Welcome Message */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user.name}!
            </h2>
            <p className="text-gray-600">
              Here's what's happening with your business today.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg bg-gray-50 ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      stat.change.startsWith("+")
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </h3>
                <p className="text-gray-600 text-sm">{stat.title}</p>
              </div>
            ))}
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart Placeholder */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Revenue Overview
              </h3>
              <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Chart will be displayed here</p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {[
                  {
                    action: "New user registered",
                    time: "2 minutes ago",
                    type: "user",
                  },
                  {
                    action: "Sale completed",
                    time: "1 hour ago",
                    type: "sale",
                  },
                  {
                    action: "Report generated",
                    time: "3 hours ago",
                    type: "report",
                  },
                  {
                    action: "System updated",
                    time: "1 day ago",
                    type: "system",
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Activity className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.action}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
