'use client'

import { useRouter } from 'next/navigation';
import { UserResource } from "@clerk/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import DataAccessLogsPage from '../data-access-logs/page';
import PermissionsPage from '../permissions/page';

interface OverviewSectionProps {
  user: UserResource;
  approvalRequests: {
    id: number;
    platform: string;
    description: string;
    status: string;
  }[];
  handleApproval: (id: number, action: "approved" | "denied") => void;
}

export default function OverviewPage({ user, approvalRequests, handleApproval }: OverviewSectionProps) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* Data Access Logs Section */}
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Data Access Logs</CardTitle>
          <Button onClick={() => router.push('/data-access-logs')}>View All Logs</Button>
        </CardHeader>
        <CardContent>
          <DataAccessLogsPage approvalRequests={approvalRequests} />
        </CardContent>
      </Card>

      {/* Permissions Section */}
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Permissions</CardTitle>
          <Button onClick={() => router.push('/permissions')}>Manage All Permissions</Button>
        </CardHeader>
        <CardContent>
          <PermissionsPage 
            handleApproval={handleApproval}
            approvalRequests={approvalRequests}
          />
        </CardContent>
      </Card>
    </div>
  )
}