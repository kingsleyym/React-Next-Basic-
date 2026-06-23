import React from 'react';
import { Button, Card } from '@repo/ui';
import { useAuth } from '@/features/auth/hooks/use-auth';

export function DashboardScreen() {
  const { user, logout } = useAuth();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-2xl p-8 text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Welcome, {user?.name || 'User'}!</h1>
          <p className="text-gray-500">You have successfully logged in to the test platform.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-8">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <span className="block text-sm text-blue-600 font-medium">Role</span>
            <span className="text-xl font-semibold capitalize">{user?.role}</span>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <span className="block text-sm text-green-600 font-medium">Status</span>
            <span className="text-xl font-semibold">Active</span>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
            <span className="block text-sm text-purple-600 font-medium">User ID</span>
            <span className="text-xs font-mono truncate block">{user?.id}</span>
          </div>
        </div>

        <Button variant="outline" onClick={() => logout.mutate()} disabled={logout.isPending}>
          {logout.isPending ? 'Signing out...' : 'Sign Out'}
        </Button>
      </Card>
    </div>
  );
}