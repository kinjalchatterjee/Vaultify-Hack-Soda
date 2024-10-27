'use client'

import { useState, useEffect } from "react"
import { UserButton } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { LayoutDashboard, Settings, Bell, Check, X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


import { Button } from "@/components/ui/button"
import { Poppins } from "next/font/google"
import Image from "next/image"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] })

export default function Dashboard() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState("overview")
  
  const [approvalRequests, setApprovalRequests] = useState([
    { id: 1, platform: "Famazon", description: "Request to view payment data", status: "Pending" },
  ])
  const [logs, setLogs] = useState([])
  const [newLogEntry, setNewLogEntry] = useState(null)

  const handleApproval = (id, action) => {
    const updatedRequests = approvalRequests.filter((request) => request.id !== id)
    setApprovalRequests(updatedRequests)

    setTimeout(() => {
      const newEntry = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        platform: "Famazon",
        action: "Approval Request",
        status: action === "approve" ? "Approved" : "Denied",
        user: "User Dashboard",
        location: "Unknown",
      }

      setNewLogEntry(newEntry)
      setLogs((prevLogs) => [newEntry, ...prevLogs])

      setTimeout(() => setNewLogEntry(null), 5000)
    }, 1000)

    const targetUrl = action === "approve" ? "/order-confirmation" : "/order-rejection"
    window.open(targetUrl, "_blank")
  }

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-6">
            <PermissionsPage
              approvalRequests={approvalRequests}
              handleApproval={(id, action) => handleApproval(id, action)}
            />
            <DataAccessLogsPage logs={logs} newLogEntry={newLogEntry} />
          </div>
        )
      case "settings":
        return <SettingsPage />
      default:
        return <div>Select a section from the sidebar</div>
    }
  }

  return (
    <div className={`min-h-screen flex bg-gray-50 dark:bg-gray-900 ${poppins.className}`}>
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <Image src="/image2.png" alt="Vaultify Logo" width={48} height={48} />
          </div>
          <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">Vaultify</h1>
        </div>
        <nav className="p-6 space-y-2">
          <button
            onClick={() => setActiveSection("overview")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors w-full ${
              activeSection === "overview"
                ? "bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            <LayoutDashboard size={20} />
            <span className="text-sm font-medium">Overview</span>
          </button>
          <button
            onClick={() => setActiveSection("settings")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors w-full ${
              activeSection === "settings"
                ? "bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            <Settings size={20} />
            <span className="text-sm font-medium">Settings</span>
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Top Navigation */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="h-full px-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Dashboard</h2>
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4 text-blue-500" />
                      <span>New security update available</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4 text-green-500" />
                      <span>Security audit completed</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <UserButton />
            </div>
          </div>
        </header>

        <div className="p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}

function PermissionsPage({ approvalRequests, handleApproval }) {
  return (
    <Card className="bg-white dark:bg-gray-800 p-6">
      <CardHeader>
        <CardTitle>Approval Requests</CardTitle>
        <CardDescription>Approve or deny access requests from connected platforms.</CardDescription>
      </CardHeader>
      <CardContent>
        <AnimatePresence>
          {approvalRequests.length > 0 ? (
            approvalRequests.map((request) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between p-4 border-b"
              >
                <div>
                  <h3 className="font-semibold">{request.platform}</h3>
                  <p className="text-sm text-gray-500">{request.description}</p>
                </div>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => handleApproval(request.id, "approve")}
                  >
                    <Check className="mr-2 h-4 w-4" /> Approve
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-red-500 hover:bg-red-600 text-white"
                    onClick={() => handleApproval(request.id, "deny")}
                  >
                    <X className="mr-2 h-4 w-4" /> Deny
                  </Button>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-500 text-sm"
            >
              No requests available
            </motion.p>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

function DataAccessLogsPage({ logs, newLogEntry }) {
  return (
    <Card className="bg-white dark:bg-gray-800 p-6 mt-6">
      <CardHeader>
        <CardTitle>Data Access Logs</CardTitle>
        <CardDescription>Comprehensive view of all data access attempts.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 dark:bg-gray-800">
                <th className="px-4 py-3 text-left">Date & Time</th>
                <th className="px-4 py-3 text-left">Platform</th>
                <th className="px-4 py-3 text-left">Action</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Location</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {logs.map((log) => (
                  <motion.tr
                    key={log.id}
                    initial={log.id === newLogEntry?.id ? { backgroundColor: "#4CAF50", color: "white" } : {}}
                    animate={{ backgroundColor: "transparent", color: "inherit" }}
                    transition={{ duration: 1 }}
                    className="border-b"
                  >
                    <td className="px-4 py-3">
                      <div>{log.date}</div>
                      <div className="text-gray-500">{log.time}</div>
                    </td>
                    <td className="px-4 py-3">{log.platform}</td>
                    <td className="px-4 py-3">{log.action}</td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          log.status === "Approved" ? "success" : log.status === "Denied" ? "destructive" : "default"
                        }
                      >
                        {log.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">{log.user}</td>
                    <td className="px-4 py-3">{log.location}</td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

function SettingsPage() {
  return (
    <Card className="bg-white dark:bg-gray-800 p-6">
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Manage your account settings and preferences.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Settings content goes here.</p>
      </CardContent>
    </Card>
  )
}