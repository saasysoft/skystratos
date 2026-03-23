// Skyline Aviation — Data Access Layer
// Abstraction over mock data so panels and tool handlers never import mock data directly.

import {
  aircraft,
  maintenanceRecords,
  melItems,
  procurementRecords,
  inventoryItems,
  monthlyCostData,
  alerts,
  scheduledFlights,
} from '@/lib/mock-data';

import type {
  Aircraft,
  MaintenanceRecord,
  MELItem,
  ProcurementRecord,
  InventoryItem,
  MonthlyCostData,
  Alert,
  ScheduledFlight,
  CheckType,
} from '@/lib/mock-data';

// Re-export all types for consumers
export type {
  Aircraft,
  AircraftPosition,
  AircraftType,
  AircraftStatus,
  MaintenanceRecord,
  MaintenanceTrigger,
  MaintenanceCategory,
  MaintenanceStatus,
  MaintenancePriority,
  CheckType,
  MELItem,
  InventoryItem,
  InventoryLocation,
  InventoryStatus,
  PartCategory,
  ProcurementRecord,
  ProcurementStatus,
  MonthlyCostData,
  AircraftCostBreakdown,
  Alert,
  AlertType,
  AlertSeverity,
  ScheduledFlight,
} from '@/lib/mock-data';

// ─── Aircraft ────────────────────────────────────────────────

export function getAircraft(filters?: {
  type?: string;
  status?: string;
}): Aircraft[] {
  let results = aircraft;
  if (filters?.type) {
    results = results.filter((a) => a.type === filters.type);
  }
  if (filters?.status) {
    results = results.filter((a) => a.status === filters.status);
  }
  return results;
}

export function getAircraftById(id: string): Aircraft | undefined {
  return aircraft.find((a) => a.id === id);
}

// ─── Maintenance ─────────────────────────────────────────────

export function getMaintenanceRecords(filters?: {
  aircraftId?: string;
  status?: string;
  category?: string;
  priority?: string;
}): MaintenanceRecord[] {
  let results = maintenanceRecords;
  if (filters?.aircraftId) {
    results = results.filter((r) => r.aircraftId === filters.aircraftId);
  }
  if (filters?.status) {
    results = results.filter((r) => r.status === filters.status);
  }
  if (filters?.category) {
    results = results.filter((r) => r.category === filters.category);
  }
  if (filters?.priority) {
    results = results.filter((r) => r.priority === filters.priority);
  }
  return results;
}

// ─── MEL Items ───────────────────────────────────────────────

export function getMELItems(filters?: {
  aircraftId?: string;
  category?: string;
  status?: string;
}): MELItem[] {
  let results = melItems;
  if (filters?.aircraftId) {
    results = results.filter((m) => m.aircraftId === filters.aircraftId);
  }
  if (filters?.category) {
    results = results.filter((m) => m.category === filters.category);
  }
  if (filters?.status) {
    results = results.filter((m) => m.status === filters.status);
  }
  return results;
}

// ─── Procurement ─────────────────────────────────────────────

export function getProcurementRecords(filters?: {
  aircraftId?: string;
  isEmergency?: boolean;
  status?: string;
}): ProcurementRecord[] {
  let results = procurementRecords;
  if (filters?.aircraftId) {
    results = results.filter((p) => p.aircraftId === filters.aircraftId);
  }
  if (filters?.isEmergency !== undefined) {
    results = results.filter((p) => p.isEmergency === filters.isEmergency);
  }
  if (filters?.status) {
    results = results.filter((p) => p.status === filters.status);
  }
  return results;
}

// ─── Inventory ───────────────────────────────────────────────

export function getInventoryItems(filters?: {
  location?: string;
  status?: string;
  category?: string;
}): InventoryItem[] {
  let results = inventoryItems;
  if (filters?.location) {
    results = results.filter((i) => i.location === filters.location);
  }
  if (filters?.status) {
    results = results.filter((i) => i.status === filters.status);
  }
  if (filters?.category) {
    results = results.filter((i) => i.category === filters.category);
  }
  return results;
}

// ─── Costs ───────────────────────────────────────────────────

export function getCostData(): MonthlyCostData[] {
  return monthlyCostData;
}

// ─── Alerts ──────────────────────────────────────────────────

export function getAlerts(): Alert[] {
  return alerts;
}

// ─── Flights ─────────────────────────────────────────────────

export function getScheduledFlights(aircraftId?: string): ScheduledFlight[] {
  if (aircraftId) {
    return scheduledFlights.filter((f) => f.aircraftId === aircraftId);
  }
  return scheduledFlights;
}

// ─── Computed Helpers ────────────────────────────────────────

// TODO: Thresholds are simplified estimates. In production these would come
// from the OEM maintenance planning document (MPD) for each aircraft type.
const CHECK_THRESHOLDS: Record<CheckType, { hours?: number; cycles?: number; calendarMonths?: number }> = {
  'Line Check': { hours: 500, calendarMonths: 3 },
  'A-Check': { hours: 3000, cycles: 2000, calendarMonths: 15 },
  'B-Check': { hours: 6000, cycles: 4000, calendarMonths: 24 },
  'C-Check': { hours: 12000, cycles: 8000, calendarMonths: 72 },
  'D-Check': { hours: 48000, cycles: 24000, calendarMonths: 144 },
  'Engine Shop Visit': { hours: 20000 },
  'Landing Gear Overhaul': { cycles: 18000, calendarMonths: 120 },
  'AD Compliance': {},
  'Service Bulletin': {},
};

/**
 * Compute when an aircraft's next check of a given type is due.
 * Evaluates hours, cycles, and calendar thresholds and returns the earliest trigger.
 */
export function computeNextDue(
  ac: Aircraft,
  checkType: CheckType
): { dueDate: string; trigger: string; remaining: number } {
  const thresholds = CHECK_THRESHOLDS[checkType];
  const results: { dueDate: string; trigger: string; remaining: number }[] = [];

  // Hours-based
  if (thresholds.hours) {
    const hoursUntilDue = thresholds.hours - (ac.totalFlightHours % thresholds.hours);
    // Estimate days at ~10 hours/day for narrowbody, ~14 for widebody
    const isWidebody = ['B787-9', 'B777-300ER', 'A350-900'].includes(ac.type);
    const dailyHours = isWidebody ? 14 : 10;
    const daysUntilDue = Math.ceil(hoursUntilDue / dailyHours);
    const dueDate = new Date('2026-03-23');
    dueDate.setDate(dueDate.getDate() + daysUntilDue);
    results.push({
      dueDate: dueDate.toISOString().split('T')[0],
      trigger: 'flight_hours',
      remaining: hoursUntilDue,
    });
  }

  // Cycles-based
  if (thresholds.cycles) {
    const cyclesUntilDue = thresholds.cycles - (ac.totalCycles % thresholds.cycles);
    const isWidebody = ['B787-9', 'B777-300ER', 'A350-900'].includes(ac.type);
    const dailyCycles = isWidebody ? 2 : 4;
    const daysUntilDue = Math.ceil(cyclesUntilDue / dailyCycles);
    const dueDate = new Date('2026-03-23');
    dueDate.setDate(dueDate.getDate() + daysUntilDue);
    results.push({
      dueDate: dueDate.toISOString().split('T')[0],
      trigger: 'cycles',
      remaining: cyclesUntilDue,
    });
  }

  // Calendar-based
  if (thresholds.calendarMonths) {
    const lastCheck = new Date(ac.lastCheckDate);
    const dueDate = new Date(lastCheck);
    dueDate.setMonth(dueDate.getMonth() + thresholds.calendarMonths);
    const today = new Date('2026-03-23');
    const daysRemaining = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    results.push({
      dueDate: dueDate.toISOString().split('T')[0],
      trigger: 'calendar',
      remaining: daysRemaining,
    });
  }

  // Return earliest trigger, or the scheduled check date if no thresholds
  if (results.length === 0) {
    return {
      dueDate: ac.nextScheduledCheck,
      trigger: 'calendar',
      remaining: Math.ceil(
        (new Date(ac.nextScheduledCheck).getTime() - new Date('2026-03-23').getTime()) /
          (1000 * 60 * 60 * 24)
      ),
    };
  }

  // Sort by dueDate ascending (earliest first)
  results.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  return results[0];
}
