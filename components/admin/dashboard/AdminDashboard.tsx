'use client';

import React from 'react';
import { useAuth } from '../../../hooks/useAuth';
import {
  Users,
  Settings,
  BarChart3,
  Shield,
  Activity,
} from 'lucide-react';

const DashboardContent: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-800">1,234</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-gray-600" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">+12% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Sessions</p>
              <p className="text-3xl font-bold text-gray-800">567</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-gray-600" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">+5% from last hour</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">System Load</p>
              <p className="text-3xl font-bold text-gray-800">23%</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-gray-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Normal range</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Security Alerts</p>
              <p className="text-3xl font-bold text-gray-800">0</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-gray-600" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">All systems secure</p>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name || 'Admin'}!
        </h2>
        <p className="text-gray-300">
          Here&apos;s what&apos;s happening with your system today. All systems are running smoothly.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-500 hover:bg-gray-50 transition-colors">
            <Users className="w-6 h-6 text-gray-400" />
            <span className="text-gray-600">Manage Users</span>
          </button>
          <button className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-500 hover:bg-gray-50 transition-colors">
            <BarChart3 className="w-6 h-6 text-gray-400" />
            <span className="text-gray-600">View Analytics</span>
          </button>
          <button className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-500 hover:bg-gray-50 transition-colors">
            <Settings className="w-6 h-6 text-gray-400" />
            <span className="text-gray-600">System Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;