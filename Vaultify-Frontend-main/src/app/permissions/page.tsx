'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Poppins } from "next/font/google"

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });

interface PermissionsSectionProps {
  handleApproval: (id: number, action: "approved" | "denied") => void;
  approvalRequests: {
    id: number;
    platform: string;
    description: string;
    status: string;
  }[];
}

export default function PermissionsPage({ handleApproval, approvalRequests }: PermissionsSectionProps) {
  const permissions = [
    {
      platform: "Amazon",
      status: "Active",
      lastUpdated: "2024-03-25",
      accessLevel: "Full",
      dataTypes: ["Personal Info", "Payment Data", "Usage Stats"],
    },
    {
      platform: "eBay",
      status: "Restricted",
      lastUpdated: "2024-03-24",
      accessLevel: "Limited",
      dataTypes: ["Personal Info"],
    },
    {
      platform: "Google",
      status: "Pending",
      lastUpdated: "2024-03-23",
      accessLevel: "Read-only",
      dataTypes: ["Usage Stats"],
    },
  ];

  return (
    <div className={`${poppins.className} space-y-6`}>
      {/* Approval Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Approval Requests</CardTitle>
          <CardDescription>
            Approve or deny access requests from connected platforms.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(approvalRequests || []).map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h4 className="font-semibold">{request.platform}</h4>
                  <p className="text-sm text-gray-500">{request.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleApproval(request.id, "approved")}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleApproval(request.id, "denied")}
                  >
                    Deny
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Platform Permissions */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Permissions</CardTitle>
          <CardDescription>
            Manage data access permissions for connected platforms.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(permissions || []).map((permission, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={`https://avatar.vercel.sh/${permission.platform}.png`} />
                    <AvatarFallback>{permission.platform[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{permission.platform}</h4>
                    <p className="text-sm text-gray-500">
                      Last updated: {permission.lastUpdated}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge
                    variant={
                      permission.status === "Active"
                        ? "success"
                        : permission.status === "Restricted"
                        ? "warning"
                        : "secondary"
                    }
                  >
                    {permission.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
