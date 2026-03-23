/**
 * Tower AI — Tool Handlers
 *
 * Server-side functions that execute tool calls against fleet data.
 * Each handler matches a tool defined in tools.ts and returns structured
 * JSON for Claude to incorporate into its response.
 */

import {
  getAircraft,
  getMaintenanceRecords,
  getMELItems,
  getProcurementRecords,
  getInventoryItems,
  getCostData,
  getAlerts,
  getScheduledFlights,
} from "@/lib/data";

import type {
  Aircraft,
  MaintenanceRecord as MockMaintenanceRecord,
  MELItem,
  ProcurementRecord as MockProcurementRecord,
  InventoryItem,
  MonthlyCostData,
} from "@/lib/data";

import type {
  TowerToolName,
  TowerToolInputs,
  TowerToolResults,
  AnomalyRecord,
  GeneratedReport,
  AircraftStatus as ToolAircraftStatus,
  MaintenanceStatus as ToolMaintenanceStatus,
  MaintenanceCategory as ToolMaintenanceCategory,
  MaintenancePriority as ToolMaintenancePriority,
  PartCategory as ToolPartCategory,
  StockLevel,
  ProcurementStatus as ToolProcurementStatus,
  ProcurementUrgency,
  CheckType as ToolCheckType,
  MaintenanceTrigger as ToolMaintenanceTrigger,
  MELCategory,
  MELStatus,
  DashboardView,
} from "./tools";

// ---------------------------------------------------------------------------
// Utility helpers
// ---------------------------------------------------------------------------

/** Case-insensitive partial match */
function nameMatches(haystack: string, needle: string): boolean {
  return haystack.toLowerCase().includes(needle.toLowerCase());
}

/** Map mock-data AircraftStatus to tools.ts AircraftStatus */
function normalizeAircraftStatus(status: string): ToolAircraftStatus {
  const map: Record<string, ToolAircraftStatus> = {
    "In Flight": "in_flight",
    "On Ground": "on_ground",
    "In Maintenance": "in_maintenance",
    AOG: "aog",
  };
  return map[status] ?? "on_ground";
}

/** Map mock-data MaintenanceStatus to tools.ts status */
function normalizeMaintenanceStatus(status: string): ToolMaintenanceStatus {
  const map: Record<string, ToolMaintenanceStatus> = {
    Completed: "completed",
    "In Progress": "in_progress",
    Scheduled: "scheduled",
    Overdue: "overdue",
  };
  return map[status] ?? "scheduled";
}

/** Map mock-data MaintenanceCategory to tools.ts category */
function normalizeMaintenanceCategory(
  category: string
): ToolMaintenanceCategory {
  const map: Record<string, ToolMaintenanceCategory> = {
    Engines: "engines",
    Airframe: "airframe",
    Avionics: "avionics",
    "Landing Gear": "landing_gear",
    APU: "apu",
    Hydraulics: "hydraulics",
    Pressurization: "pressurization",
    "Flight Controls": "flight_controls",
    Electrical: "electrical",
    Interiors: "interiors",
  };
  return map[category] ?? "airframe";
}

/** Map mock-data MaintenancePriority to tools.ts priority */
function normalizeMaintenancePriority(
  priority: string
): ToolMaintenancePriority {
  return priority.toLowerCase() as ToolMaintenancePriority;
}

/** Map mock-data CheckType to tools.ts CheckType */
function normalizeCheckType(checkType: string): ToolCheckType {
  const map: Record<string, ToolCheckType> = {
    "Line Check": "line_check",
    "A-Check": "a_check",
    "B-Check": "b_check",
    "C-Check": "c_check",
    "D-Check": "d_check",
    "Engine Shop Visit": "engine_shop_visit",
    "Landing Gear Overhaul": "landing_gear_overhaul",
    "AD Compliance": "ad_compliance",
    "Service Bulletin": "service_bulletin",
  };
  return map[checkType] ?? "line_check";
}

/** Map mock-data MaintenanceTrigger to tools.ts trigger */
function normalizeMaintenanceTrigger(
  trigger: string
): ToolMaintenanceTrigger {
  return trigger as ToolMaintenanceTrigger;
}

/** Map mock-data PartCategory to tools.ts PartCategory */
function normalizePartCategory(category: string): ToolPartCategory {
  const map: Record<string, ToolPartCategory> = {
    Rotables: "rotables",
    Expendables: "expendables",
    Consumables: "consumables",
    "Engine Parts": "engine_parts",
    "Avionics LRUs": "avionics_lrus",
    "Safety Equipment": "safety_equipment",
    "Cabin Parts": "cabin_parts",
    Tooling: "tooling",
  };
  return map[category] ?? "expendables";
}

/** Map mock-data InventoryStatus to tools.ts StockLevel */
function normalizeStockLevel(status: string): StockLevel {
  const map: Record<string, StockLevel> = {
    "In Stock": "adequate",
    "Low Stock": "low",
    "Out of Stock": "out_of_stock",
    "On Order": "low",
  };
  return map[status] ?? "adequate";
}

/** Map mock-data ProcurementStatus to tools.ts status */
function normalizeProcurementStatus(
  status: string
): ToolProcurementStatus {
  const map: Record<string, ToolProcurementStatus> = {
    Ordered: "ordered",
    Shipped: "shipped",
    Delivered: "delivered",
    "Pending Approval": "pending_approval",
    "Emergency Order": "emergency_order",
  };
  return map[status] ?? "ordered";
}

/** Derive procurement urgency */
function deriveProcurementUrgency(
  record: MockProcurementRecord
): ProcurementUrgency {
  if (record.isEmergency) return "emergency";
  if (record.status === "Emergency Order") return "emergency";
  if (record.leadTime <= 7) return "urgent";
  return "planned";
}

/** Get date range boundaries from a preset */
function getDateRange(
  preset?: string,
  dateFrom?: string,
  dateTo?: string
): { start: Date; end: Date } | null {
  if (!preset) return null;
  const now = new Date();
  const end = dateTo ? new Date(dateTo) : now;
  let start: Date;

  switch (preset) {
    case "today":
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "last_7_days":
      start = new Date(now.getTime() - 7 * 86400000);
      break;
    case "last_30_days":
      start = new Date(now.getTime() - 30 * 86400000);
      break;
    case "last_90_days":
      start = new Date(now.getTime() - 90 * 86400000);
      break;
    case "last_quarter":
      start = new Date(now.getTime() - 90 * 86400000);
      break;
    case "year_to_date":
      start = new Date(now.getFullYear(), 0, 1);
      break;
    case "custom":
      start = dateFrom
        ? new Date(dateFrom)
        : new Date(now.getTime() - 30 * 86400000);
      break;
    default:
      return null;
  }
  return { start, end };
}

/** Sort helper — generic comparator */
function sortBy<T>(
  arr: T[],
  field: string,
  direction: "asc" | "desc" = "asc"
): T[] {
  return [...arr].sort((a, b) => {
    const aVal = (a as Record<string, unknown>)[field];
    const bVal = (b as Record<string, unknown>)[field];
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return 1;
    if (bVal == null) return -1;
    const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return direction === "desc" ? -cmp : cmp;
  });
}

/** Map priority strings to numeric weight for sorting */
function priorityWeight(p: string): number {
  const map: Record<string, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
  };
  return map[p.toLowerCase()] ?? 4;
}

/** Estimate CPFH budget based on aircraft type */
function getCPFHBudget(type: string): number {
  const budgets: Record<string, number> = {
    "B737-800": 3000,
    "B737 MAX 8": 2600,
    A320neo: 2700,
    A321neo: 2900,
    "B787-9": 5000,
    "B777-300ER": 5800,
    "A350-900": 4600,
    E175: 2000,
  };
  return budgets[type] ?? 3000;
}

/** Convert Aircraft to the AircraftRecord shape the tools expect */
function toAircraftRecord(ac: Aircraft) {
  const cpfhBudget = getCPFHBudget(ac.type);
  const variancePct = Math.round(
    ((ac.costPerFlightHour - cpfhBudget) / cpfhBudget) * 100
  );
  return {
    aircraft_id: ac.id,
    tail_number: ac.tailNumber,
    registration: ac.registration,
    aircraft_type: ac.type,
    status: normalizeAircraftStatus(ac.status),
    position: {
      lat: ac.currentPosition.lat,
      lng: ac.currentPosition.lng,
      altitude: ac.currentPosition.altitude,
    },
    ground_speed_knots: ac.currentPosition.groundSpeed,
    heading: ac.currentPosition.heading,
    origin: ac.currentPosition.origin,
    destination: ac.currentPosition.destination,
    current_route: ac.currentRoute,
    current_airport: ac.currentAirport,
    cpfh_usd: ac.costPerFlightHour,
    cpfh_budget_usd: cpfhBudget,
    cpfh_variance_pct: variancePct,
    daily_cost_usd: ac.dailyCost,
    total_flight_hours: ac.totalFlightHours,
    total_cycles: ac.totalCycles,
    last_check_date: ac.lastCheckDate,
    next_check_due: ac.nextScheduledCheck,
    next_check_type: ac.nextCheckType,
    active_mel_count: ac.activeMELCount,
    engine_type: ac.engineType,
    engine_hours: ac.engineHours,
  };
}

// ---------------------------------------------------------------------------
// Tool Handlers
// ---------------------------------------------------------------------------

function handleQueryFleetStatus(
  input: TowerToolInputs["query_fleet_status"]
): TowerToolResults["query_fleet_status"] {
  let filtered = getAircraft();

  if (input.aircraft_id) {
    filtered = filtered.filter((a) => a.id === input.aircraft_id);
  }
  if (input.tail_number) {
    filtered = filtered.filter((a) =>
      nameMatches(a.tailNumber, input.tail_number!)
    );
  }
  if (input.aircraft_type) {
    filtered = filtered.filter((a) => a.type === input.aircraft_type);
  }
  if (input.status) {
    filtered = filtered.filter(
      (a) => normalizeAircraftStatus(a.status) === input.status
    );
  }
  if (input.over_budget_only) {
    filtered = filtered.filter((a) => {
      const budget = getCPFHBudget(a.type);
      return a.costPerFlightHour > budget;
    });
  }

  let records = filtered.map(toAircraftRecord);

  const sortField = input.sort_by ?? "tail_number";
  const sortDir = input.sort_direction ?? "asc";
  records = sortBy(records, sortField, sortDir);

  const limit = input.limit ?? 30;
  const total = records.length;
  records = records.slice(0, limit);

  return { aircraft: records, total };
}

function handleQueryMaintenance(
  input: TowerToolInputs["query_maintenance"]
): TowerToolResults["query_maintenance"] {
  let filtered = getMaintenanceRecords();

  if (input.aircraft_id) {
    filtered = filtered.filter((m) => m.aircraftId === input.aircraft_id);
  }
  if (input.tail_number) {
    filtered = filtered.filter((m) =>
      nameMatches(m.tailNumber, input.tail_number!)
    );
  }
  if (input.status) {
    filtered = filtered.filter(
      (m) => normalizeMaintenanceStatus(m.status) === input.status
    );
  }
  if (input.category) {
    filtered = filtered.filter(
      (m) => normalizeMaintenanceCategory(m.category) === input.category
    );
  }
  if (input.priority) {
    filtered = filtered.filter(
      (m) => m.priority.toLowerCase() === input.priority
    );
  }
  if (input.check_type) {
    filtered = filtered.filter(
      (m) => normalizeCheckType(m.checkType) === input.check_type
    );
  }
  if (input.trigger) {
    filtered = filtered.filter(
      (m) => normalizeMaintenanceTrigger(m.trigger) === input.trigger
    );
  }
  if (input.overdue_only) {
    filtered = filtered.filter((m) => m.status === "Overdue");
  }

  // Date range filtering on scheduledDate
  const range = getDateRange(input.date_range);
  if (range) {
    filtered = filtered.filter((m) => {
      const d = new Date(m.scheduledDate);
      return d >= range.start && d <= range.end;
    });
  }

  // Map to tool result shape
  const now = new Date();
  let records = filtered.map((m) => {
    const dueDate = new Date(m.scheduledDate);
    const daysOverdue =
      m.status === "Overdue"
        ? Math.max(
            0,
            Math.floor((now.getTime() - dueDate.getTime()) / 86400000)
          )
        : 0;
    return {
      id: m.id,
      aircraft_id: m.aircraftId,
      tail_number: m.tailNumber,
      check_type: m.checkType,
      trigger: m.trigger,
      category: normalizeMaintenanceCategory(m.category),
      description: m.description,
      status: normalizeMaintenanceStatus(m.status),
      priority: normalizeMaintenancePriority(m.priority),
      scheduled_date: m.scheduledDate,
      completed_date: m.completedDate,
      days_overdue: daysOverdue,
      hours_remaining: m.hoursRemaining,
      cycles_remaining: m.cyclesRemaining,
      estimated_cost_usd: m.costEstimate,
      actual_cost_usd: m.actualCost,
      downtime_hours: m.downtimeHours,
      mro_facility: m.mroFacility,
      vendor: m.vendor,
      ad_reference: m.adReference,
      sb_reference: m.sbReference,
      linked_procurement_ids: m.linkedProcurementIds,
    };
  });

  // Sort
  const sortField = input.sort_by ?? "scheduled_date";
  const sortDir =
    input.sort_direction ?? (input.overdue_only ? "desc" : "asc");

  if (sortField === "priority") {
    records = [...records].sort((a, b) => {
      const cmp = priorityWeight(a.priority) - priorityWeight(b.priority);
      return sortDir === "desc" ? -cmp : cmp;
    });
  } else {
    records = sortBy(records, sortField, sortDir);
  }

  const limit = input.limit ?? 50;
  const total = records.length;
  records = records.slice(0, limit);

  return { records, total };
}

function handleQueryProcurement(
  input: TowerToolInputs["query_procurement"]
): TowerToolResults["query_procurement"] {
  let filtered = getProcurementRecords();

  if (input.aircraft_id) {
    filtered = filtered.filter((p) => p.aircraftId === input.aircraft_id);
  }
  if (input.tail_number) {
    filtered = filtered.filter((p) =>
      nameMatches(p.tailNumber, input.tail_number!)
    );
  }
  if (input.status) {
    filtered = filtered.filter(
      (p) => normalizeProcurementStatus(p.status) === input.status
    );
  }
  if (input.urgency) {
    filtered = filtered.filter(
      (p) => deriveProcurementUrgency(p) === input.urgency
    );
  }
  if (input.category) {
    filtered = filtered.filter(
      (p) => normalizePartCategory(p.category) === input.category
    );
  }
  if (input.emergency_only) {
    filtered = filtered.filter((p) => p.isEmergency);
  }
  if (input.min_cost_usd) {
    filtered = filtered.filter((p) => p.totalCost >= input.min_cost_usd!);
  }

  // Date range on orderDate
  const range = getDateRange(input.date_range);
  if (range) {
    filtered = filtered.filter((p) => {
      const d = new Date(p.orderDate);
      return d >= range.start && d <= range.end;
    });
  }

  // Map to tool result shape
  let records = filtered.map((p) => ({
    id: p.id,
    aircraft_id: p.aircraftId,
    tail_number: p.tailNumber,
    item_description: p.item,
    category: normalizePartCategory(p.category),
    urgency: deriveProcurementUrgency(p),
    status: normalizeProcurementStatus(p.status),
    order_date: p.orderDate,
    expected_delivery: p.expectedDelivery,
    actual_delivery: p.actualDelivery,
    quantity: p.quantity,
    unit_price_usd: p.unitPrice,
    total_cost_usd: p.totalCost,
    premium_pct: p.premiumPct,
    supplier: p.supplier,
    is_emergency: p.isEmergency,
    linked_maintenance_id: null as string | null,
  }));

  // Sort
  const sortField = input.sort_by ?? "order_date";
  const sortDir = input.sort_direction ?? "desc";
  records = sortBy(records, sortField, sortDir);

  const limit = input.limit ?? 50;
  const total = records.length;
  records = records.slice(0, limit);

  return { records, total };
}

function handleQueryInventory(
  input: TowerToolInputs["query_inventory"]
): TowerToolResults["query_inventory"] {
  let filtered = getInventoryItems();

  if (input.location) {
    filtered = filtered.filter((i) => i.location === input.location);
  }
  if (input.category) {
    filtered = filtered.filter(
      (i) => normalizePartCategory(i.category) === input.category
    );
  }
  if (input.stock_level) {
    filtered = filtered.filter(
      (i) => normalizeStockLevel(i.status) === input.stock_level
    );
  }
  if (input.critical_only) {
    filtered = filtered.filter(
      (i) => i.status === "Out of Stock" || i.status === "Low Stock"
    );
  }
  if (input.below_reorder_point) {
    filtered = filtered.filter((i) => i.currentStock <= i.reorderPoint);
  }
  if (input.part_number) {
    filtered = filtered.filter((i) =>
      i.partNumber.toLowerCase().includes(input.part_number!.toLowerCase())
    );
  }
  if (input.description_search) {
    filtered = filtered.filter((i) =>
      nameMatches(i.description, input.description_search!)
    );
  }
  if (input.max_days_until_stockout) {
    filtered = filtered.filter((i) => {
      const daysUntil = estimateDaysUntilStockout(i);
      return (
        daysUntil !== null && daysUntil <= input.max_days_until_stockout!
      );
    });
  }

  // Map to tool result shape
  let items = filtered.map((i) => ({
    part_number: i.partNumber,
    description: i.description,
    category: normalizePartCategory(i.category),
    location: i.location,
    quantity_on_hand: i.currentStock,
    minimum_stock: i.minimumStock,
    reorder_point: i.reorderPoint,
    stock_level: normalizeStockLevel(i.status),
    unit_cost_usd: i.unitCost,
    total_value_usd: i.currentStock * i.unitCost,
    last_restock_date: i.lastRestocked,
    next_delivery: i.nextDelivery,
    lead_time_days: i.leadTimeDays,
    days_until_stockout: estimateDaysUntilStockout(i),
    is_rotable: i.isRotable,
    condition: i.condition,
  }));

  // Sort
  const sortField = input.sort_by ?? "days_until_stockout";
  const sortDir = input.sort_direction ?? "asc";
  items = sortBy(items, sortField, sortDir);

  const limit = input.limit ?? 50;
  const total = items.length;
  items = items.slice(0, limit);

  return { items, total };
}

function estimateDaysUntilStockout(item: InventoryItem): number | null {
  if (item.currentStock === 0) return 0;
  // Estimate based on category: rotables consume slower, consumables faster
  const consumptionRate =
    item.category === "Consumables"
      ? 1 / 5
      : item.category === "Expendables"
        ? 1 / 7
        : 1 / 21;
  return Math.floor(item.currentStock / consumptionRate);
}

function handleQueryMELStatus(
  input: TowerToolInputs["query_mel_status"]
): TowerToolResults["query_mel_status"] {
  let filtered = getMELItems();

  if (input.aircraft_id) {
    filtered = filtered.filter((m) => m.aircraftId === input.aircraft_id);
  }
  if (input.tail_number) {
    filtered = filtered.filter((m) =>
      nameMatches(m.tailNumber, input.tail_number!)
    );
  }
  if (input.category) {
    filtered = filtered.filter((m) => m.category === input.category);
  }
  if (input.ata_chapter) {
    filtered = filtered.filter((m) =>
      m.ataChapter.startsWith(input.ata_chapter!)
    );
  }
  if (input.status) {
    filtered = filtered.filter((m) => m.status === input.status);
  }
  if (input.days_until_expiry !== undefined) {
    const now = new Date();
    filtered = filtered.filter((m) => {
      const expiry = new Date(m.expiryDate);
      const daysUntil = Math.ceil(
        (expiry.getTime() - now.getTime()) / 86400000
      );
      return daysUntil <= input.days_until_expiry!;
    });
  }

  // Map to tool result shape
  const now = new Date();
  let items = filtered.map((m) => {
    const expiry = new Date(m.expiryDate);
    const daysUntilExpiry = Math.ceil(
      (expiry.getTime() - now.getTime()) / 86400000
    );
    return {
      id: m.id,
      aircraft_id: m.aircraftId,
      tail_number: m.tailNumber,
      ata_chapter: m.ataChapter,
      description: m.description,
      category: m.category as MELCategory,
      deferred_date: m.deferredDate,
      expiry_date: m.expiryDate,
      days_until_expiry: daysUntilExpiry,
      dispatch_conditions: m.dispatchConditions,
      rectification_action: m.rectificationAction,
      status: m.status as MELStatus,
    };
  });

  // Sort
  const sortField = input.sort_by ?? "days_until_expiry";
  const sortDir = input.sort_direction ?? "asc";

  if (sortField === "category") {
    const catOrder: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };
    items = [...items].sort((a, b) => {
      const cmp = (catOrder[a.category] ?? 4) - (catOrder[b.category] ?? 4);
      return sortDir === "desc" ? -cmp : cmp;
    });
  } else {
    items = sortBy(items, sortField, sortDir);
  }

  const limit = input.limit ?? 50;
  const total = items.length;
  items = items.slice(0, limit);

  return { items, total };
}

function handleQueryCompliance(
  input: TowerToolInputs["query_compliance"]
): TowerToolResults["query_compliance"] {
  // Build compliance records from maintenance records that have AD/SB references
  const allMaint = getMaintenanceRecords();
  const allAircraft = getAircraft();
  const now = new Date();

  let complianceRecords = allMaint
    .filter((m) => m.adReference || m.sbReference)
    .map((m) => {
      const ac = allAircraft.find((a) => a.id === m.aircraftId);
      const deadline = m.scheduledDate;
      const deadlineDate = new Date(deadline);
      const daysUntilDeadline = Math.ceil(
        (deadlineDate.getTime() - now.getTime()) / 86400000
      );

      let complianceStatus: "complied" | "in_progress" | "not_due" | "overdue";
      if (m.status === "Completed") {
        complianceStatus = "complied";
      } else if (m.status === "Overdue") {
        complianceStatus = "overdue";
      } else if (m.status === "In Progress") {
        complianceStatus = "in_progress";
      } else {
        complianceStatus = "not_due";
      }

      return {
        id: m.id,
        aircraft_id: m.aircraftId,
        tail_number: m.tailNumber,
        reference: m.adReference || m.sbReference || "",
        reference_type: (m.adReference ? "AD" : "SB") as "AD" | "SB",
        description: m.description,
        compliance_status: complianceStatus,
        compliance_deadline: deadline,
        days_until_deadline: daysUntilDeadline,
        affected_aircraft_type: (ac?.type ?? "B737-800") as TowerToolInputs["query_compliance"]["aircraft_type"] & string,
      };
    });

  // Apply filters
  if (input.ad_reference) {
    complianceRecords = complianceRecords.filter(
      (r) =>
        r.reference_type === "AD" &&
        nameMatches(r.reference, input.ad_reference!)
    );
  }
  if (input.sb_reference) {
    complianceRecords = complianceRecords.filter(
      (r) =>
        r.reference_type === "SB" &&
        nameMatches(r.reference, input.sb_reference!)
    );
  }
  if (input.aircraft_type) {
    complianceRecords = complianceRecords.filter(
      (r) => r.affected_aircraft_type === input.aircraft_type
    );
  }
  if (input.compliance_status) {
    complianceRecords = complianceRecords.filter(
      (r) => r.compliance_status === input.compliance_status
    );
  }

  // Sort
  const sortField = input.sort_by ?? "compliance_deadline";
  complianceRecords = sortBy(complianceRecords, sortField, "asc");

  const limit = input.limit ?? 50;
  const total = complianceRecords.length;
  complianceRecords = complianceRecords.slice(0, limit);

  return { records: complianceRecords, total };
}

// ---------------------------------------------------------------------------
// Report Generation
// ---------------------------------------------------------------------------

function handleGenerateReport(
  input: TowerToolInputs["generate_report"]
): TowerToolResults["generate_report"] {
  const now = new Date().toISOString();
  const range = getDateRange(input.date_range ?? "last_30_days");
  const periodStart =
    range?.start.toISOString().slice(0, 10) ?? "2026-02-21";
  const periodEnd = range?.end.toISOString().slice(0, 10) ?? "2026-03-23";

  switch (input.report_type) {
    case "fleet_status":
      return buildFleetStatusReport(now, periodStart, periodEnd);
    case "cost_analysis":
      return buildCostAnalysisReport(now, periodStart, periodEnd);
    case "maintenance_summary":
      return buildMaintenanceSummaryReport(now, periodStart, periodEnd);
    case "procurement_summary":
      return buildProcurementSummaryReport(now, periodStart, periodEnd);
    case "inventory_status":
      return buildInventoryStatusReport(now, periodStart, periodEnd);
    case "aircraft_profile":
      return buildAircraftProfileReport(
        now,
        periodStart,
        periodEnd,
        input.aircraft_id
      );
    case "anomaly_report":
      return buildAnomalyReportWrapper(now, periodStart, periodEnd);
    case "aog_analysis":
      return buildAOGAnalysisReport(now, periodStart, periodEnd);
    case "dispatch_reliability":
      return buildDispatchReliabilityReport(now, periodStart, periodEnd);
    case "mel_summary":
      return buildMELSummaryReport(now, periodStart, periodEnd);
    default:
      return buildFleetStatusReport(now, periodStart, periodEnd);
  }
}

function buildFleetStatusReport(
  now: string,
  periodStart: string,
  periodEnd: string
): GeneratedReport {
  const allAircraft = getAircraft();
  const inFlight = allAircraft.filter((a) => a.status === "In Flight").length;
  const onGround = allAircraft.filter((a) => a.status === "On Ground").length;
  const inMaint = allAircraft.filter(
    (a) => a.status === "In Maintenance"
  ).length;
  const aog = allAircraft.filter((a) => a.status === "AOG").length;
  const totalDailyCost = allAircraft.reduce((s, a) => s + a.dailyCost, 0);

  return {
    report_type: "fleet_status",
    title: "Fleet Status Report",
    generated_at: now,
    period: { start: periodStart, end: periodEnd },
    sections: [
      {
        heading: "Fleet Overview",
        content: `Total Fleet: ${allAircraft.length} aircraft | In Flight: ${inFlight} | On Ground: ${onGround} | In Maintenance: ${inMaint} | AOG: ${aog}`,
        data: [
          { metric: "Total Aircraft", value: allAircraft.length },
          { metric: "In Flight", value: inFlight },
          { metric: "On Ground", value: onGround },
          { metric: "In Maintenance", value: inMaint },
          { metric: "AOG", value: aog },
        ],
      },
      {
        heading: "Daily Cost Summary",
        content: `Total daily fleet cost: $${totalDailyCost.toLocaleString()}. AOG aircraft cost: $${allAircraft.filter((a) => a.status === "AOG").reduce((s, a) => s + a.dailyCost, 0).toLocaleString()}/day in lost revenue and maintenance holding costs.`,
      },
      {
        heading: "Overdue Maintenance",
        content: `${getMaintenanceRecords({ status: "Overdue" }).length} overdue work orders across the fleet. Total estimated cost: $${getMaintenanceRecords({ status: "Overdue" }).reduce((s, m) => s + m.costEstimate, 0).toLocaleString()}.`,
      },
    ],
  };
}

function buildCostAnalysisReport(
  now: string,
  periodStart: string,
  periodEnd: string
): GeneratedReport {
  const costData = getCostData();
  const recentMonths = costData.slice(-3);
  const latestMonth = recentMonths[recentMonths.length - 1];
  const prevMonth =
    recentMonths.length > 1 ? recentMonths[recentMonths.length - 2] : null;

  const sections: GeneratedReport["sections"] = [
    {
      heading: "Monthly Cost Trend",
      content: recentMonths
        .map(
          (m) =>
            `${m.month.slice(0, 7)}: $${(m.totalFleetCost / 1e6).toFixed(1)}M (budget: $${(m.budgetedCost / 1e6).toFixed(1)}M, variance: $${(m.variance / 1e6).toFixed(1)}M)`
        )
        .join(" | "),
      data: recentMonths.map((m) => ({
        month: m.month.slice(0, 7),
        total: m.totalFleetCost,
        budget: m.budgetedCost,
        variance: m.variance,
      })),
    },
  ];

  if (latestMonth) {
    sections.push({
      heading: "Cost Breakdown (Latest Month)",
      content: `Fuel: $${(latestMonth.fuelCost / 1e6).toFixed(1)}M | Scheduled Maint: $${(latestMonth.scheduledMaintenanceCost / 1e6).toFixed(1)}M | Unscheduled Maint: $${(latestMonth.unscheduledMaintenanceCost / 1e6).toFixed(2)}M | Crew: $${(latestMonth.crewCost / 1e6).toFixed(1)}M | AOG Procurement: $${(latestMonth.aogProcurementCost / 1e6).toFixed(2)}M | AOG Downtime: $${(latestMonth.aogDowntimeCost / 1e6).toFixed(2)}M`,
    });
  }

  if (latestMonth && prevMonth) {
    const aogTrend =
      latestMonth.aogProcurementCost - prevMonth.aogProcurementCost;
    sections.push({
      heading: "AOG Procurement Trend",
      content: `AOG procurement ${aogTrend > 0 ? "INCREASED" : "decreased"} by $${Math.abs(aogTrend).toLocaleString()} month-over-month. Current rate: $${latestMonth.aogProcurementCost.toLocaleString()}/month.`,
    });
  }

  return {
    report_type: "cost_analysis",
    title: "CPFH & Cost Analysis Report",
    generated_at: now,
    period: { start: periodStart, end: periodEnd },
    sections,
  };
}

function buildMaintenanceSummaryReport(
  now: string,
  periodStart: string,
  periodEnd: string
): GeneratedReport {
  const allMaint = getMaintenanceRecords();
  const overdue = allMaint.filter((m) => m.status === "Overdue");
  const inProgress = allMaint.filter((m) => m.status === "In Progress");
  const scheduled = allMaint.filter((m) => m.status === "Scheduled");
  const critical = allMaint.filter((m) => m.priority === "Critical");
  const overdueTotal = overdue.reduce((s, m) => s + m.costEstimate, 0);

  return {
    report_type: "maintenance_summary",
    title: "Maintenance Summary Report",
    generated_at: now,
    period: { start: periodStart, end: periodEnd },
    sections: [
      {
        heading: "Status Breakdown",
        content: `Overdue: ${overdue.length} | In Progress: ${inProgress.length} | Scheduled: ${scheduled.length} | Critical Priority: ${critical.length}`,
      },
      {
        heading: "Overdue Work Orders",
        content:
          overdue.length > 0
            ? overdue
                .slice(0, 10)
                .map(
                  (m) =>
                    `- ${m.tailNumber}: ${m.description} (Est: $${m.costEstimate.toLocaleString()}, Priority: ${m.priority})`
                )
                .join("\n")
            : "No overdue work orders.",
      },
      {
        heading: "Financial Impact",
        content: `Total estimated cost of overdue maintenance: $${overdueTotal.toLocaleString()}. Deferred maintenance increases AOG risk and emergency procurement premiums by 40-120%.`,
      },
    ],
  };
}

function buildProcurementSummaryReport(
  now: string,
  periodStart: string,
  periodEnd: string
): GeneratedReport {
  const allProc = getProcurementRecords();
  const total = allProc.length;
  const emergency = allProc.filter((p) => p.isEmergency);
  const emergencyRate = ((emergency.length / total) * 100).toFixed(1);
  const emergencyCost = emergency.reduce((s, p) => s + p.totalCost, 0);
  const totalCost = allProc.reduce((s, p) => s + p.totalCost, 0);

  return {
    report_type: "procurement_summary",
    title: "Procurement Summary Report",
    generated_at: now,
    period: { start: periodStart, end: periodEnd },
    sections: [
      {
        heading: "Overview",
        content: `Total orders: ${total} | Emergency/AOG orders: ${emergency.length} (${emergencyRate}%) | Total spend: $${totalCost.toLocaleString()} | AOG spend: $${emergencyCost.toLocaleString()}`,
      },
      {
        heading: "Top AOG Orders",
        content: emergency
          .sort((a, b) => b.totalCost - a.totalCost)
          .slice(0, 5)
          .map(
            (p) =>
              `- ${p.tailNumber}: ${p.item} - $${p.totalCost.toLocaleString()} (${p.supplier}, ${p.premiumPct}% premium)`
          )
          .join("\n"),
      },
      {
        heading: "Recommendation",
        content: `Emergency procurement rate of ${emergencyRate}% exceeds the 5% target. Root causes: inventory stockouts of critical rotables and deferred maintenance leading to AOG events. Recommend increasing safety stock for top 10 high-MTBR components.`,
      },
    ],
  };
}

function buildInventoryStatusReport(
  now: string,
  periodStart: string,
  periodEnd: string
): GeneratedReport {
  const allInv = getInventoryItems();
  const outOfStock = allInv.filter((i) => i.status === "Out of Stock");
  const lowStock = allInv.filter((i) => i.status === "Low Stock");
  const belowReorder = allInv.filter((i) => i.currentStock <= i.reorderPoint);
  const totalValue = allInv.reduce(
    (s, i) => s + i.currentStock * i.unitCost,
    0
  );

  return {
    report_type: "inventory_status",
    title: "Inventory Status Report",
    generated_at: now,
    period: { start: periodStart, end: periodEnd },
    sections: [
      {
        heading: "Stock Level Summary",
        content: `Total items tracked: ${allInv.length} | Out of Stock: ${outOfStock.length} | Low Stock: ${lowStock.length} | Below Reorder Point: ${belowReorder.length} | Total inventory value: $${totalValue.toLocaleString()}`,
      },
      {
        heading: "Critical Shortages",
        content:
          outOfStock.length > 0
            ? outOfStock
                .map(
                  (i) =>
                    `- ${i.description} (${i.partNumber}): 0 units at ${i.location}, min stock: ${i.minimumStock}, next delivery: ${i.nextDelivery ?? "NONE SCHEDULED"}`
                )
                .join("\n")
            : "No items currently out of stock.",
      },
    ],
  };
}

function buildAircraftProfileReport(
  now: string,
  periodStart: string,
  periodEnd: string,
  aircraftId?: string
): GeneratedReport {
  const allAircraft = getAircraft();
  const ac = aircraftId
    ? allAircraft.find((a) => a.id === aircraftId)
    : allAircraft[0];

  if (!ac) {
    return {
      report_type: "aircraft_profile",
      title: "Aircraft Profile - Not Found",
      generated_at: now,
      period: { start: periodStart, end: periodEnd },
      sections: [
        { heading: "Error", content: `No aircraft found with ID ${aircraftId}` },
      ],
    };
  }

  const acMaint = getMaintenanceRecords({ aircraftId: ac.id });
  const acProc = getProcurementRecords({ aircraftId: ac.id });
  const acMEL = getMELItems({ aircraftId: ac.id });
  const overdue = acMaint.filter((m) => m.status === "Overdue");

  return {
    report_type: "aircraft_profile",
    title: `Aircraft Profile - ${ac.tailNumber}`,
    generated_at: now,
    period: { start: periodStart, end: periodEnd },
    sections: [
      {
        heading: "Aircraft Details",
        content: `${ac.tailNumber} (${ac.registration}) | Type: ${ac.type} | MSN: ${ac.msn} | Delivered: ${ac.deliveryDate} | Status: ${ac.status} | Engine: ${ac.engineType}`,
      },
      {
        heading: "Utilization",
        content: `Total Flight Hours: ${ac.totalFlightHours.toLocaleString()} | Total Cycles: ${ac.totalCycles.toLocaleString()} | Engine Hours: ${ac.engineHours.toLocaleString()} | CPFH: $${ac.costPerFlightHour.toLocaleString()} (budget: $${getCPFHBudget(ac.type).toLocaleString()})`,
      },
      {
        heading: "Maintenance & MEL Status",
        content: `Last Check: ${ac.lastCheckDate} | Next Check: ${ac.nextScheduledCheck} (${ac.nextCheckType}) | Active MEL Items: ${acMEL.filter((m) => m.status === "active").length} | Open Work Orders: ${acMaint.filter((m) => m.status !== "Completed").length} | Overdue: ${overdue.length} | Procurement Orders: ${acProc.length}`,
      },
    ],
  };
}

function buildAOGAnalysisReport(
  now: string,
  periodStart: string,
  periodEnd: string
): GeneratedReport {
  const allAircraft = getAircraft();
  const aogAircraft = allAircraft.filter((a) => a.status === "AOG");
  const aogDailyCost = aogAircraft.reduce((s, a) => s + a.dailyCost, 0);
  const emergencyProc = getProcurementRecords({ isEmergency: true });
  const emergencyCost = emergencyProc.reduce((s, p) => s + p.totalCost, 0);

  return {
    report_type: "aog_analysis",
    title: "AOG Analysis Report",
    generated_at: now,
    period: { start: periodStart, end: periodEnd },
    sections: [
      {
        heading: "Currently AOG Aircraft",
        content:
          aogAircraft.length > 0
            ? aogAircraft
                .map(
                  (a) =>
                    `- ${a.tailNumber} (${a.type}): $${a.dailyCost.toLocaleString()}/day revenue impact at ${a.currentAirport ?? "unknown station"}`
                )
                .join("\n")
            : "No aircraft currently AOG.",
      },
      {
        heading: "Financial Impact",
        content: `${aogAircraft.length} AOG aircraft costing $${aogDailyCost.toLocaleString()}/day in lost revenue and holding costs ($${(aogDailyCost * 30).toLocaleString()}/month projected). Emergency procurement total: $${emergencyCost.toLocaleString()}.`,
      },
      {
        heading: "Root Cause Drivers",
        content:
          "Primary AOG drivers: (1) Deferred scheduled maintenance creating cascading failures. (2) Inventory stockouts of critical rotables at outstation locations. (3) Engine trend monitoring alerts not actioned within SOP timeframes.",
      },
    ],
  };
}

function buildDispatchReliabilityReport(
  now: string,
  periodStart: string,
  periodEnd: string
): GeneratedReport {
  const allAircraft = getAircraft();
  const allMEL = getMELItems();
  const activeMEL = allMEL.filter((m) => m.status === "active");
  const schedFlights = getScheduledFlights();
  const dispatched = allAircraft.filter(
    (a) => a.status === "In Flight" || a.status === "On Ground"
  ).length;

  return {
    report_type: "dispatch_reliability",
    title: "Dispatch Reliability Report",
    generated_at: now,
    period: { start: periodStart, end: periodEnd },
    sections: [
      {
        heading: "Fleet Availability",
        content: `Dispatch-ready: ${dispatched} of ${allAircraft.length} (${((dispatched / allAircraft.length) * 100).toFixed(1)}%) | Scheduled flights: ${schedFlights.length} | Active MEL items: ${activeMEL.length} across ${new Set(activeMEL.map((m) => m.aircraftId)).size} aircraft`,
      },
      {
        heading: "MEL Dispatch Restrictions",
        content: `Cat A (urgent): ${activeMEL.filter((m) => m.category === "A").length} | Cat B (3-day): ${activeMEL.filter((m) => m.category === "B").length} | Cat C (10-day): ${activeMEL.filter((m) => m.category === "C").length} | Cat D (120-day): ${activeMEL.filter((m) => m.category === "D").length}`,
      },
      {
        heading: "Approaching Expiry",
        content: (() => {
          const nowDate = new Date();
          const expiringSoon = activeMEL.filter((m) => {
            const exp = new Date(m.expiryDate);
            return (exp.getTime() - nowDate.getTime()) / 86400000 <= 3;
          });
          return expiringSoon.length > 0
            ? expiringSoon
                .map(
                  (m) =>
                    `- ${m.tailNumber}: ATA ${m.ataChapter} — ${m.description} (Cat ${m.category}, expires ${m.expiryDate})`
                )
                .join("\n")
            : "No MEL items expiring within 3 days.";
        })(),
      },
    ],
  };
}

function buildMELSummaryReport(
  now: string,
  periodStart: string,
  periodEnd: string
): GeneratedReport {
  const allMEL = getMELItems();
  const active = allMEL.filter((m) => m.status === "active");
  const rectified = allMEL.filter((m) => m.status === "rectified");
  const extended = allMEL.filter((m) => m.status === "extended");

  return {
    report_type: "mel_summary",
    title: "MEL Summary Report",
    generated_at: now,
    period: { start: periodStart, end: periodEnd },
    sections: [
      {
        heading: "MEL Status Overview",
        content: `Active: ${active.length} | Rectified: ${rectified.length} | Extended: ${extended.length} | Total: ${allMEL.length}`,
      },
      {
        heading: "Active MEL by Category",
        content: `Cat A: ${active.filter((m) => m.category === "A").length} | Cat B: ${active.filter((m) => m.category === "B").length} | Cat C: ${active.filter((m) => m.category === "C").length} | Cat D: ${active.filter((m) => m.category === "D").length}`,
      },
      {
        heading: "Most Affected Aircraft",
        content: (() => {
          const counts = new Map<string, number>();
          active.forEach((m) => {
            counts.set(m.tailNumber, (counts.get(m.tailNumber) ?? 0) + 1);
          });
          return Array.from(counts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([tail, count]) => `- ${tail}: ${count} active MEL items`)
            .join("\n") || "No active MEL items.";
        })(),
      },
    ],
  };
}

function buildAnomalyReportWrapper(
  now: string,
  periodStart: string,
  periodEnd: string
): GeneratedReport {
  const anomalies = scanAnomalies({});
  return {
    report_type: "anomaly_report",
    title: "Anomaly & Risk Report",
    generated_at: now,
    period: { start: periodStart, end: periodEnd },
    sections: [
      {
        heading: `${anomalies.length} Issues Detected`,
        content: anomalies
          .slice(0, 15)
          .map(
            (a) =>
              `[${a.severity.toUpperCase()}] ${a.title}${a.financial_impact_usd ? ` - Impact: $${a.financial_impact_usd.toLocaleString()}` : ""}\n  ${a.recommended_action}`
          )
          .join("\n\n"),
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Anomaly scanner
// ---------------------------------------------------------------------------

function scanAnomalies(
  input: TowerToolInputs["flag_anomalies"]
): AnomalyRecord[] {
  const anomalies: AnomalyRecord[] = [];
  const now = new Date();
  const domain = input.domain ?? "all";
  let idCounter = 1;

  const allAircraft = getAircraft();
  const allMaint = getMaintenanceRecords();
  const allProc = getProcurementRecords();
  const allInv = getInventoryItems();
  const allMEL = getMELItems();

  // --- Cost anomalies ---
  if (domain === "all" || domain === "cost") {
    allAircraft.forEach((ac) => {
      const budget = getCPFHBudget(ac.type);
      if (ac.costPerFlightHour > budget) {
        const overAmount = ac.costPerFlightHour - budget;
        const pct = ((overAmount / budget) * 100).toFixed(1);
        anomalies.push({
          id: `ANOM-${String(idCounter++).padStart(3, "0")}`,
          domain: "cost",
          severity: overAmount > 500 ? "critical" : "warning",
          title: `${ac.tailNumber} CPFH $${ac.costPerFlightHour.toLocaleString()} exceeds budget $${budget.toLocaleString()} (+${pct}%)`,
          description: `${ac.tailNumber} (${ac.type}) is ${pct}% over CPFH budget. Review maintenance charges, unscheduled events, and component replacements.`,
          affected_aircraft: [ac.id],
          financial_impact_usd: overAmount * (ac.totalFlightHours / 365),
          recommended_action: `Audit recent maintenance charges on ${ac.tailNumber}. Check for unplanned component replacements and emergency procurement linked to this aircraft.`,
          detected_at: now.toISOString(),
        });
      }
    });
  }

  // --- Maintenance anomalies ---
  if (domain === "all" || domain === "maintenance") {
    const overdue = allMaint.filter((m) => m.status === "Overdue");
    overdue.forEach((m) => {
      const dueDate = new Date(m.scheduledDate);
      const daysOverdue = Math.floor(
        (now.getTime() - dueDate.getTime()) / 86400000
      );
      anomalies.push({
        id: `ANOM-${String(idCounter++).padStart(3, "0")}`,
        domain: "maintenance",
        severity: m.priority === "Critical" ? "critical" : "warning",
        title: `Overdue: ${m.tailNumber} - ${m.description.slice(0, 60)}`,
        description: `${m.description} is ${daysOverdue} days overdue. Priority: ${m.priority}. Estimated cost: $${m.costEstimate.toLocaleString()}.`,
        affected_aircraft: [m.aircraftId],
        financial_impact_usd: m.costEstimate,
        recommended_action: `Schedule ${m.tailNumber} for ${m.category.toLowerCase()} work immediately. Deferred maintenance increases AOG risk and emergency procurement costs.`,
        detected_at: now.toISOString(),
      });
    });
  }

  // --- Procurement anomalies ---
  if (domain === "all" || domain === "procurement") {
    const total = allProc.length;
    const emergencyCount = allProc.filter((p) => p.isEmergency).length;
    const emergencyRate = total > 0 ? (emergencyCount / total) * 100 : 0;
    if (emergencyRate > 5) {
      const emergencyCost = allProc
        .filter((p) => p.isEmergency)
        .reduce((s, p) => s + p.totalCost, 0);
      anomalies.push({
        id: `ANOM-${String(idCounter++).padStart(3, "0")}`,
        domain: "procurement",
        severity: emergencyRate > 15 ? "critical" : "warning",
        title: `Emergency procurement rate: ${emergencyRate.toFixed(1)}% (target: <5%)`,
        description: `${emergencyCount} of ${total} orders are emergency/AOG. Total emergency spend: $${emergencyCost.toLocaleString()}. AOG orders carry 40-120% cost premiums.`,
        affected_aircraft: Array.from(
          new Set(
            allProc
              .filter((p) => p.isEmergency)
              .map((p) => p.aircraftId)
          )
        ),
        financial_impact_usd: emergencyCost,
        recommended_action:
          "Increase safety stock for critical rotables (engine LRUs, hydraulic pumps, APU components). Address root cause: deferred scheduled maintenance across aging B737-800 and B777-300ER fleets.",
        detected_at: now.toISOString(),
      });
    }
  }

  // --- Inventory anomalies ---
  if (domain === "all" || domain === "inventory") {
    const outOfStock = allInv.filter((i) => i.status === "Out of Stock");
    outOfStock.forEach((i) => {
      anomalies.push({
        id: `ANOM-${String(idCounter++).padStart(3, "0")}`,
        domain: "inventory",
        severity:
          i.category === "Engine Parts" || i.category === "Rotables"
            ? "critical"
            : "warning",
        title: `Out of stock: ${i.description}`,
        description: `${i.partNumber} at ${i.location}: 0 units (min stock: ${i.minimumStock}). Next delivery: ${i.nextDelivery ?? "NONE SCHEDULED"}.`,
        affected_aircraft: [],
        financial_impact_usd: i.minimumStock * i.unitCost,
        recommended_action: `Expedite procurement of ${i.description}. Place AOG order if next delivery date exceeds operational need. Check cross-station transfer availability.`,
        detected_at: now.toISOString(),
      });
    });
  }

  // --- MEL anomalies ---
  if (domain === "all" || domain === "mel") {
    const activeMEL = allMEL.filter((m) => m.status === "active");
    activeMEL.forEach((m) => {
      const expiry = new Date(m.expiryDate);
      const daysUntilExpiry = Math.ceil(
        (expiry.getTime() - now.getTime()) / 86400000
      );
      if (daysUntilExpiry <= 3) {
        anomalies.push({
          id: `ANOM-${String(idCounter++).padStart(3, "0")}`,
          domain: "mel",
          severity: daysUntilExpiry <= 1 ? "critical" : "warning",
          title: `MEL expiring: ${m.tailNumber} ATA ${m.ataChapter} Cat ${m.category} — ${daysUntilExpiry} days left`,
          description: `${m.description} on ${m.tailNumber}. Category ${m.category} MEL expires ${m.expiryDate}. Aircraft will lose dispatch authority if not rectified.`,
          affected_aircraft: [m.aircraftId],
          financial_impact_usd: null,
          recommended_action: `Rectify ${m.description} on ${m.tailNumber} before ${m.expiryDate}. Action: ${m.rectificationAction}. If parts needed, check inventory at ${m.tailNumber}'s current station.`,
          detected_at: now.toISOString(),
        });
      }
    });
  }

  // --- Compliance anomalies ---
  if (domain === "all" || domain === "compliance") {
    const adMaint = allMaint.filter(
      (m) => m.adReference && m.status !== "Completed"
    );
    adMaint.forEach((m) => {
      const deadline = new Date(m.scheduledDate);
      const daysUntilDeadline = Math.ceil(
        (deadline.getTime() - now.getTime()) / 86400000
      );
      if (daysUntilDeadline <= 30) {
        anomalies.push({
          id: `ANOM-${String(idCounter++).padStart(3, "0")}`,
          domain: "compliance",
          severity: daysUntilDeadline <= 7 ? "critical" : "warning",
          title: `AD compliance deadline: ${m.tailNumber} — ${m.adReference} in ${daysUntilDeadline} days`,
          description: `${m.description}. AD ${m.adReference} compliance required by ${m.scheduledDate}. Non-compliance risks FAA enforcement action and grounding.`,
          affected_aircraft: [m.aircraftId],
          financial_impact_usd: m.costEstimate,
          recommended_action: `Schedule AD compliance work for ${m.tailNumber} immediately. Coordinate with MRO for slot availability. Ensure required parts are in stock.`,
          detected_at: now.toISOString(),
        });
      }
    });
  }

  // --- Filter by severity ---
  const severityOrder: Record<string, number> = {
    critical: 0,
    warning: 1,
    info: 2,
  };
  const threshold = input.severity_threshold ?? "warning";
  const thresholdLevel = severityOrder[threshold] ?? 1;
  let results = anomalies.filter(
    (a) => (severityOrder[a.severity] ?? 2) <= thresholdLevel
  );

  // --- Filter by aircraft ---
  if (input.aircraft_id) {
    results = results.filter((a) =>
      a.affected_aircraft.includes(input.aircraft_id!)
    );
  }
  if (input.aircraft_type) {
    const typeAircraft = allAircraft
      .filter((a) => a.type === input.aircraft_type)
      .map((a) => a.id);
    results = results.filter((a) =>
      a.affected_aircraft.some((id) => typeAircraft.includes(id))
    );
  }

  // --- Filter by financial impact ---
  if (input.min_financial_impact_usd) {
    results = results.filter(
      (a) =>
        a.financial_impact_usd !== null &&
        a.financial_impact_usd >= input.min_financial_impact_usd!
    );
  }

  // Sort by severity (critical first), then financial impact
  results.sort((a, b) => {
    const sevDiff =
      (severityOrder[a.severity] ?? 2) - (severityOrder[b.severity] ?? 2);
    if (sevDiff !== 0) return sevDiff;
    return (b.financial_impact_usd ?? 0) - (a.financial_impact_usd ?? 0);
  });

  const limit = input.limit ?? 20;
  return results.slice(0, limit);
}

function handleFlagAnomalies(
  input: TowerToolInputs["flag_anomalies"]
): TowerToolResults["flag_anomalies"] {
  const anomalies = scanAnomalies(input);
  return { anomalies, total: anomalies.length };
}

function handleUpdateDashboardFilter(
  input: TowerToolInputs["update_dashboard_filter"]
): TowerToolResults["update_dashboard_filter"] {
  const activeView: DashboardView = input.view ?? "fleet_map";
  const filtersApplied: Record<string, unknown> = {};

  if (input.reset) {
    return {
      success: true,
      active_view: "fleet_map",
      filters_applied: { reset: true },
    };
  }

  if (input.aircraft_id) filtersApplied.aircraft_id = input.aircraft_id;
  if (input.aircraft_type) filtersApplied.aircraft_type = input.aircraft_type;
  if (input.status_filter) filtersApplied.status_filter = input.status_filter;
  if (input.maintenance_status_filter)
    filtersApplied.maintenance_status_filter =
      input.maintenance_status_filter;
  if (input.date_range) filtersApplied.date_range = input.date_range;
  if (input.sort_by) filtersApplied.sort_by = input.sort_by;
  if (input.sort_direction)
    filtersApplied.sort_direction = input.sort_direction;
  if (input.highlight_anomalies)
    filtersApplied.highlight_anomalies = input.highlight_anomalies;

  return {
    success: true,
    active_view: activeView,
    filters_applied: filtersApplied,
  };
}

// ---------------------------------------------------------------------------
// Dispatch — single entry point for the API route
// ---------------------------------------------------------------------------

export type ToolHandlerResult = TowerToolResults[TowerToolName];

export function executeToolCall(
  toolName: string,
  toolInput: Record<string, unknown>
): ToolHandlerResult {
  switch (toolName as TowerToolName) {
    case "query_fleet_status":
      return handleQueryFleetStatus(
        toolInput as TowerToolInputs["query_fleet_status"]
      );
    case "query_maintenance":
      return handleQueryMaintenance(
        toolInput as TowerToolInputs["query_maintenance"]
      );
    case "query_procurement":
      return handleQueryProcurement(
        toolInput as TowerToolInputs["query_procurement"]
      );
    case "query_inventory":
      return handleQueryInventory(
        toolInput as TowerToolInputs["query_inventory"]
      );
    case "query_mel_status":
      return handleQueryMELStatus(
        toolInput as TowerToolInputs["query_mel_status"]
      );
    case "query_compliance":
      return handleQueryCompliance(
        toolInput as TowerToolInputs["query_compliance"]
      );
    case "generate_report":
      return handleGenerateReport(
        toolInput as TowerToolInputs["generate_report"]
      );
    case "flag_anomalies":
      return handleFlagAnomalies(
        toolInput as TowerToolInputs["flag_anomalies"]
      );
    case "update_dashboard_filter":
      return handleUpdateDashboardFilter(
        toolInput as TowerToolInputs["update_dashboard_filter"]
      );
    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
}
