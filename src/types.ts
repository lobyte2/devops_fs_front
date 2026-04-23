/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AlertStatus = 'PENDING' | 'CONFIRMED';
export type AlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface FireAlert {
  id: string;
  location: string;
  region: string;
  status: AlertStatus;
  severity: AlertSeverity;
  timestamp: string;
  coordinates: [number, number];
  reporter?: {
    email: string;
    deviceId: string;
    timestamp: string;
  };
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
}
