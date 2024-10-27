'use client'

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Poppins } from "next/font/google";
import { useRouter } from 'next/navigation';

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });

interface ApprovalRequest {
  id: number;
  platform: string;
  description: string;
  status: string;
}

interface Log {
  id: string;
  date: string;
  time: string;
  platform: string;
  action: string;
  status: string;
  user: string;
  location: string;
}

interface DataLogsSectionProps {
  approvalRequests: ApprovalRequest[];
}

export default function DataAccessLogsPage({ approvalRequests }: DataLogsSectionProps) {
  const initialLogs: Log[] = [
    {
      id: uuidv4(),
      date: "2024-03-25",
      time: "14:32:45",
      platform: "Famazon",
      action: "Data Access",
      status: "Granted",
      user: "System API",
      location: "US-East",
    },
    {
      id: uuidv4(),
      date: "2024-03-25",
      time: "12:15:30",
      platform: "eBay",
      action: "Authentication",
      status: "Denied",
      user: "Mobile App",
      location: "EU-West",
    },
    {
      id: uuidv4(),
      date: "2024-03-24",
      time: "23:45:12",
      platform: "Google",
      action: "Permission Update",
      status: "Completed",
      user: "Admin Panel",
      location: "AS-East",
    },
  ];

  const [logs, setLogs] = useState<Log[]>(initialLogs);
  const router = useRouter();

  useEffect(() => {
    if (approvalRequests) {
      const transformedRequests: Log[] = approvalRequests.map((request) => ({
        id: uuidv4(),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        platform: "Famazon",
        action: "Approval Request",
        status: request.status,
        user: "User Dashboard",
        location: "Unknown",
      }));
    
      setLogs((prevLogs) => [...transformedRequests, ...prevLogs]);
    }
  }, [approvalRequests]);

  const handleApprove = (logId: string) => {
    updateLogStatus(logId, "Approved");
    router.push('/order-confirmation'); // Redirect to order confirmation page
  };

  const handleDeny = (logId: string) => {
    updateLogStatus(logId, "Denied");
    router.push('/order-rejected'); // Redirect to order rejection page (implement as needed)
  };

  const updateLogStatus = (logId: string, newStatus: string) => {
    setLogs((prevLogs) =>
      prevLogs.map((log) =>
        log.id === logId ? { ...log, status: newStatus } : log
      )
    );
  };

  return (
    <Card className={poppins.className}>
      <CardHeader>
        <CardTitle>Data Access Logs</CardTitle>
        <CardDescription>
          Comprehensive view of all data access attempts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
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
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(logs || []).map((log) => (
                  <tr key={log.id} className="border-b">
                    <td className="px-4 py-3">
                      <div className="font-medium">{log.date}</div>
                      <div className="text-gray-500">{log.time}</div>
                    </td>
                    <td className="px-4 py-3">{log.platform}</td>
                    <td className="px-4 py-3">{log.action}</td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          log.status === "Granted" || log.status === "Approved"
                            ? "success"
                            : log.status === "Denied"
                            ? "destructive"
                            : "default"
                        }
                      >
                        {log.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">{log.user}</td>
                    <td className="px-4 py-3">{log.location}</td>
                    <td className="px-4 py-3 flex space-x-2">
                      {log.status === "Pending Approval" && (
                        <>
                          <Button onClick={() => handleApprove(log.id)} variant="success">Approve</Button>
                          <Button onClick={() => handleDeny(log.id)} variant="destructive">Deny</Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
