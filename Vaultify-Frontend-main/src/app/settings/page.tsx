'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Poppins } from "next/font/google"

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });

export default function SettingsPage() {
  return (
    <div className={`${poppins.className} space-y-6`}>
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>
            Configure your account security preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-500">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Button variant="outline">Configure</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Login History</h4>
                <p className="text-sm text-gray-500">
                  View your recent login activity
                </p>
              </div>
              <Button variant="outline">View History</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">API Keys</h4>
                <p className="text-sm text-gray-500">
                  Manage your API keys and access tokens
                </p>
              </div>
              <Button variant="outline">Manage Keys</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
