/**
 * Tower AI — Tool Definitions
 *
 * Anthropic API tool-calling schemas for the Tower copilot.
 * These define the structured tools Tower can invoke to query
 * fleet data, generate reports, and control the dashboard.
 */

import type { Tool } from "@anthropic-ai/sdk/resources/messages";

// ---------------------------------------------------------------------------
// Shared enums & types used across tool parameters
// ---------------------------------------------------------------------------

export type AircraftType =
  | "B737-800"
  | "B737 MAX 8"
  | "A320neo"
  | "A321neo"
  | "B787-9"
  | "B777-300ER"
  | "A350-900"
  | "E175";

export type AircraftStatus =
  | "in_flight"
  | "on_ground"
  | "in_maintenance"
  | "aog";

export type MaintenanceStatus =
  | "scheduled"
  | "overdue"
  | "in_progress"
  | "completed";

export type MaintenanceCategory =
  | "engines"
  | "airframe"
  | "avionics"
  | "landing_gear"
  | "apu"
  | "hydraulics"
  | "pressurization"
  | "flight_controls"
  | "electrical"
  | "interiors";

export type MaintenancePriority = "critical" | "high" | "medium" | "low";

export type CheckType =
  | "line_check"
  | "a_check"
  | "b_check"
  | "c_check"
  | "d_check"
  | "engine_shop_visit"
  | "landing_gear_overhaul"
  | "ad_compliance"
  | "service_bulletin";

export type MaintenanceTrigger =
  | "flight_hours"
  | "cycles"
  | "calendar"
  | "condition"
  | "ad_mandate";

export type ProcurementStatus =
  | "ordered"
  | "shipped"
  | "delivered"
  | "pending_approval"
  | "emergency_order";

export type ProcurementUrgency = "planned" | "urgent" | "emergency";

export type PartCategory =
  | "rotables"
  | "expendables"
  | "consumables"
  | "engine_parts"
  | "avionics_lrus"
  | "safety_equipment"
  | "cabin_parts"
  | "tooling";

export type InventoryLocation =
  | "ORD MRO Hub"
  | "LAX Parts Depot"
  | "LHR Stores"
  | "SIN MRO Center"
  | "DFW Warehouse"
  | "On Aircraft"
  | "Vendor Repair Shop";

export type StockLevel = "adequate" | "low" | "critical" | "out_of_stock";

export type MELCategory = "A" | "B" | "C" | "D";

export type MELStatus = "active" | "rectified" | "extended";

export type ComplianceStatus =
  | "complied"
  | "in_progress"
  | "not_due"
  | "overdue";

export type ReportType =
  | "fleet_status"
  | "cost_analysis"
  | "maintenance_summary"
  | "procurement_summary"
  | "inventory_status"
  | "aircraft_profile"
  | "anomaly_report"
  | "aog_analysis"
  | "dispatch_reliability"
  | "mel_summary";

export type AnomalyDomain =
  | "cost"
  | "maintenance"
  | "procurement"
  | "inventory"
  | "mel"
  | "compliance"
  | "all";

export type DashboardView =
  | "fleet_map"
  | "fleet_table"
  | "maintenance_board"
  | "procurement_pipeline"
  | "inventory_grid"
  | "cost_dashboard"
  | "aircraft_detail"
  | "mel_board"
  | "compliance_tracker";

export type SortDirection = "asc" | "desc";

export type DateRangePreset =
  | "today"
  | "last_7_days"
  | "last_30_days"
  | "last_90_days"
  | "last_quarter"
  | "year_to_date"
  | "custom";

// ---------------------------------------------------------------------------
// Tool result payload types (what the backend returns)
// ---------------------------------------------------------------------------

export interface AircraftRecord {
  aircraft_id: string;
  tail_number: string;
  registration: string;
  aircraft_type: AircraftType;
  status: AircraftStatus;
  position: { lat: number; lng: number; altitude: number };
  ground_speed_knots: number;
  heading: number;
  origin: string | null;
  destination: string | null;
  current_route: string | null;
  current_airport: string | null;
  cpfh_usd: number;
  cpfh_budget_usd: number;
  cpfh_variance_pct: number;
  daily_cost_usd: number;
  total_flight_hours: number;
  total_cycles: number;
  last_check_date: string;
  next_check_due: string;
  next_check_type: string;
  active_mel_count: number;
  engine_type: string;
  engine_hours: number;
}

export interface MaintenanceRecord {
  id: string;
  aircraft_id: string;
  tail_number: string;
  check_type: string;
  trigger: string;
  category: MaintenanceCategory;
  description: string;
  status: MaintenanceStatus;
  priority: MaintenancePriority;
  scheduled_date: string;
  completed_date: string | null;
  days_overdue: number;
  hours_remaining: number | null;
  cycles_remaining: number | null;
  estimated_cost_usd: number;
  actual_cost_usd: number | null;
  downtime_hours: number;
  mro_facility: string;
  vendor: string;
  ad_reference: string | null;
  sb_reference: string | null;
  linked_procurement_ids: string[];
}

export interface ProcurementRecord {
  id: string;
  aircraft_id: string;
  tail_number: string;
  item_description: string;
  category: PartCategory;
  urgency: ProcurementUrgency;
  status: ProcurementStatus;
  order_date: string;
  expected_delivery: string;
  actual_delivery: string | null;
  quantity: number;
  unit_price_usd: number;
  total_cost_usd: number;
  premium_pct: number;
  supplier: string;
  is_emergency: boolean;
  linked_maintenance_id: string | null;
}

export interface InventoryRecord {
  part_number: string;
  description: string;
  category: PartCategory;
  location: InventoryLocation;
  quantity_on_hand: number;
  minimum_stock: number;
  reorder_point: number;
  stock_level: StockLevel;
  unit_cost_usd: number;
  total_value_usd: number;
  last_restock_date: string;
  next_delivery: string | null;
  lead_time_days: number;
  days_until_stockout: number | null;
  is_rotable: boolean;
  condition: string;
}

export interface MELRecord {
  id: string;
  aircraft_id: string;
  tail_number: string;
  ata_chapter: string;
  description: string;
  category: MELCategory;
  deferred_date: string;
  expiry_date: string;
  days_until_expiry: number;
  dispatch_conditions: string;
  rectification_action: string;
  status: MELStatus;
}

export interface ComplianceRecord {
  id: string;
  aircraft_id: string;
  tail_number: string;
  reference: string;
  reference_type: "AD" | "SB";
  description: string;
  compliance_status: ComplianceStatus;
  compliance_deadline: string | null;
  days_until_deadline: number | null;
  affected_aircraft_type: AircraftType;
}

export interface AnomalyRecord {
  id: string;
  domain: AnomalyDomain;
  severity: "critical" | "warning" | "info";
  title: string;
  description: string;
  affected_aircraft: string[];
  financial_impact_usd: number | null;
  recommended_action: string;
  detected_at: string;
}

export interface GeneratedReport {
  report_type: ReportType;
  title: string;
  generated_at: string;
  period: { start: string; end: string };
  sections: Array<{
    heading: string;
    content: string;
    data?: Record<string, unknown>[];
  }>;
}

// ---------------------------------------------------------------------------
// Tool definitions for the Anthropic API
// ---------------------------------------------------------------------------

export const TOWER_TOOLS: Tool[] = [
  // -- query_fleet_status ---------------------------------------------------
  {
    name: "query_fleet_status",
    description:
      "Query the fleet overview or retrieve detailed data for specific aircraft. " +
      "Returns aircraft positions, operational status, CPFH vs budget, route information, " +
      "and key performance indicators. Use this whenever the user asks about aircraft locations, " +
      "fleet status, cost performance, or individual aircraft details.",
    input_schema: {
      type: "object" as const,
      properties: {
        aircraft_id: {
          type: "string",
          description:
            "Internal aircraft ID. Omit to query the full fleet.",
        },
        tail_number: {
          type: "string",
          description:
            "Tail number to search for (e.g. 'N412SL'). Case-insensitive partial match.",
        },
        aircraft_type: {
          type: "string",
          enum: [
            "B737-800",
            "B737 MAX 8",
            "A320neo",
            "A321neo",
            "B787-9",
            "B777-300ER",
            "A350-900",
            "E175",
          ],
          description: "Filter by aircraft type.",
        },
        status: {
          type: "string",
          enum: ["in_flight", "on_ground", "in_maintenance", "aog"],
          description: "Filter by current operational status.",
        },
        over_budget_only: {
          type: "boolean",
          description:
            "If true, return only aircraft whose CPFH exceeds their type budget.",
        },
        sort_by: {
          type: "string",
          enum: [
            "tail_number",
            "cpfh_usd",
            "cpfh_variance_pct",
            "daily_cost_usd",
            "total_flight_hours",
            "active_mel_count",
          ],
          description: "Field to sort results by. Defaults to 'tail_number'.",
        },
        sort_direction: {
          type: "string",
          enum: ["asc", "desc"],
          description: "Sort direction. Defaults to 'asc'.",
        },
        limit: {
          type: "integer",
          description:
            "Maximum number of aircraft to return. Defaults to 30.",
          minimum: 1,
          maximum: 100,
        },
      },
      required: [],
    },
  },

  // -- query_maintenance ----------------------------------------------------
  {
    name: "query_maintenance",
    description:
      "Query maintenance records across the fleet. Returns scheduled, overdue, in-progress, " +
      "and completed maintenance work orders with cost, timeline, and trigger data. " +
      "Use this when discussing maintenance backlogs, overdue items, check planning, " +
      "or investigating why an aircraft is over budget on CPFH.",
    input_schema: {
      type: "object" as const,
      properties: {
        aircraft_id: {
          type: "string",
          description: "Filter by specific aircraft ID.",
        },
        tail_number: {
          type: "string",
          description: "Filter by tail number (partial match, case-insensitive).",
        },
        status: {
          type: "string",
          enum: ["scheduled", "overdue", "in_progress", "completed"],
          description: "Filter by maintenance status.",
        },
        category: {
          type: "string",
          enum: [
            "engines",
            "airframe",
            "avionics",
            "landing_gear",
            "apu",
            "hydraulics",
            "pressurization",
            "flight_controls",
            "electrical",
            "interiors",
          ],
          description: "Filter by maintenance category.",
        },
        priority: {
          type: "string",
          enum: ["critical", "high", "medium", "low"],
          description: "Filter by priority level.",
        },
        check_type: {
          type: "string",
          enum: [
            "line_check",
            "a_check",
            "b_check",
            "c_check",
            "d_check",
            "engine_shop_visit",
            "landing_gear_overhaul",
            "ad_compliance",
            "service_bulletin",
          ],
          description: "Filter by check type.",
        },
        trigger: {
          type: "string",
          enum: ["flight_hours", "cycles", "calendar", "condition", "ad_mandate"],
          description: "Filter by maintenance trigger.",
        },
        overdue_only: {
          type: "boolean",
          description: "If true, return only overdue maintenance items.",
        },
        date_range: {
          type: "string",
          enum: [
            "today",
            "last_7_days",
            "last_30_days",
            "last_90_days",
            "last_quarter",
            "year_to_date",
            "custom",
          ],
          description: "Preset date range for scheduled_date filtering.",
        },
        sort_by: {
          type: "string",
          enum: [
            "scheduled_date",
            "days_overdue",
            "estimated_cost_usd",
            "priority",
            "tail_number",
          ],
          description: "Field to sort results by. Defaults to 'scheduled_date'.",
        },
        sort_direction: {
          type: "string",
          enum: ["asc", "desc"],
          description:
            "Sort direction. Defaults to 'desc' for overdue queries, 'asc' otherwise.",
        },
        limit: {
          type: "integer",
          description: "Maximum records to return. Defaults to 50.",
          minimum: 1,
          maximum: 500,
        },
      },
      required: [],
    },
  },

  // -- query_procurement ----------------------------------------------------
  {
    name: "query_procurement",
    description:
      "Query procurement records including purchase orders, requisitions, and delivery status. " +
      "Tracks planned vs emergency procurement, cost premiums, supplier performance, and delivery timelines. " +
      "Use this when investigating procurement costs, AOG order spikes, or parts delivery delays.",
    input_schema: {
      type: "object" as const,
      properties: {
        aircraft_id: {
          type: "string",
          description: "Filter by specific aircraft ID.",
        },
        tail_number: {
          type: "string",
          description: "Filter by tail number (partial match, case-insensitive).",
        },
        status: {
          type: "string",
          enum: [
            "ordered",
            "shipped",
            "delivered",
            "pending_approval",
            "emergency_order",
          ],
          description: "Filter by procurement status.",
        },
        urgency: {
          type: "string",
          enum: ["planned", "urgent", "emergency"],
          description: "Filter by urgency level. 'emergency' for AOG premium-cost orders.",
        },
        category: {
          type: "string",
          enum: [
            "rotables",
            "expendables",
            "consumables",
            "engine_parts",
            "avionics_lrus",
            "safety_equipment",
            "cabin_parts",
            "tooling",
          ],
          description: "Filter by parts category.",
        },
        emergency_only: {
          type: "boolean",
          description: "If true, return only emergency/AOG procurement orders.",
        },
        date_range: {
          type: "string",
          enum: [
            "today",
            "last_7_days",
            "last_30_days",
            "last_90_days",
            "last_quarter",
            "year_to_date",
            "custom",
          ],
          description: "Preset date range for order_date filtering.",
        },
        min_cost_usd: {
          type: "number",
          description: "Minimum total cost filter (USD).",
        },
        sort_by: {
          type: "string",
          enum: [
            "order_date",
            "expected_delivery",
            "total_cost_usd",
            "premium_pct",
            "tail_number",
          ],
          description: "Field to sort results by. Defaults to 'order_date'.",
        },
        sort_direction: {
          type: "string",
          enum: ["asc", "desc"],
          description: "Sort direction. Defaults to 'desc'.",
        },
        limit: {
          type: "integer",
          description: "Maximum records to return. Defaults to 50.",
          minimum: 1,
          maximum: 500,
        },
      },
      required: [],
    },
  },

  // -- query_inventory ------------------------------------------------------
  {
    name: "query_inventory",
    description:
      "Query inventory levels across all stations. Returns stock quantities, reorder status, " +
      "days-until-stockout projections, and value summaries. " +
      "Use this when checking parts availability, investigating stockouts that cause AOG, " +
      "or reviewing safety stock adequacy at each hub.",
    input_schema: {
      type: "object" as const,
      properties: {
        aircraft_id: {
          type: "string",
          description: "Filter by aircraft-specific parts (if applicable).",
        },
        location: {
          type: "string",
          enum: [
            "ORD MRO Hub",
            "LAX Parts Depot",
            "LHR Stores",
            "SIN MRO Center",
            "DFW Warehouse",
          ],
          description: "Filter by inventory location/station.",
        },
        category: {
          type: "string",
          enum: [
            "rotables",
            "expendables",
            "consumables",
            "engine_parts",
            "avionics_lrus",
            "safety_equipment",
            "cabin_parts",
            "tooling",
          ],
          description: "Filter by parts category.",
        },
        stock_level: {
          type: "string",
          enum: ["adequate", "low", "critical", "out_of_stock"],
          description: "Filter by current stock level status.",
        },
        critical_only: {
          type: "boolean",
          description:
            "If true, return only items with 'critical' or 'out_of_stock' status.",
        },
        below_reorder_point: {
          type: "boolean",
          description:
            "If true, return only items whose quantity_on_hand is at or below reorder_point.",
        },
        part_number: {
          type: "string",
          description: "Search by specific part number.",
        },
        description_search: {
          type: "string",
          description:
            "Free-text search against item descriptions (e.g. 'brake assembly', 'EGT probe').",
        },
        max_days_until_stockout: {
          type: "integer",
          description:
            "Return items projected to stock out within this many days. " +
            "Useful for proactive reorder alerts.",
          minimum: 1,
        },
        sort_by: {
          type: "string",
          enum: [
            "days_until_stockout",
            "quantity_on_hand",
            "total_value_usd",
            "location",
            "description",
          ],
          description: "Field to sort results by. Defaults to 'days_until_stockout'.",
        },
        sort_direction: {
          type: "string",
          enum: ["asc", "desc"],
          description: "Sort direction. Defaults to 'asc'.",
        },
        limit: {
          type: "integer",
          description: "Maximum records to return. Defaults to 50.",
          minimum: 1,
          maximum: 500,
        },
      },
      required: [],
    },
  },

  // -- query_mel_status -----------------------------------------------------
  {
    name: "query_mel_status",
    description:
      "Query MEL (Minimum Equipment List) items across the fleet. Returns deferred defects, " +
      "their category (A/B/C/D), expiry dates, dispatch conditions, and rectification requirements. " +
      "Use this when checking aircraft dispatch authority, MEL expiry alerts, " +
      "or investigating dispatch restrictions affecting the route network.",
    input_schema: {
      type: "object" as const,
      properties: {
        aircraft_id: {
          type: "string",
          description: "Filter by specific aircraft ID.",
        },
        tail_number: {
          type: "string",
          description: "Filter by tail number (partial match, case-insensitive).",
        },
        category: {
          type: "string",
          enum: ["A", "B", "C", "D"],
          description:
            "Filter by MEL category. A = most urgent (1-3 days), D = least urgent (120 days).",
        },
        ata_chapter: {
          type: "string",
          description: "Filter by ATA chapter (e.g. '21' for Air Conditioning, '32' for Landing Gear).",
        },
        status: {
          type: "string",
          enum: ["active", "rectified", "extended"],
          description: "Filter by MEL item status.",
        },
        days_until_expiry: {
          type: "integer",
          description:
            "Return only MEL items expiring within this many days. " +
            "Useful for proactive rectification planning.",
          minimum: 0,
        },
        sort_by: {
          type: "string",
          enum: [
            "expiry_date",
            "days_until_expiry",
            "category",
            "tail_number",
            "ata_chapter",
          ],
          description: "Field to sort results by. Defaults to 'days_until_expiry'.",
        },
        sort_direction: {
          type: "string",
          enum: ["asc", "desc"],
          description: "Sort direction. Defaults to 'asc'.",
        },
        limit: {
          type: "integer",
          description: "Maximum records to return. Defaults to 50.",
          minimum: 1,
          maximum: 200,
        },
      },
      required: [],
    },
  },

  // -- query_compliance -----------------------------------------------------
  {
    name: "query_compliance",
    description:
      "Query Airworthiness Directive (AD) and Service Bulletin (SB) compliance status " +
      "across the fleet. Returns compliance status, deadlines, and affected aircraft. " +
      "Use this when checking regulatory compliance, upcoming AD deadlines, or SB implementation status.",
    input_schema: {
      type: "object" as const,
      properties: {
        ad_reference: {
          type: "string",
          description: "Filter by specific AD reference number.",
        },
        sb_reference: {
          type: "string",
          description: "Filter by specific SB reference number.",
        },
        aircraft_type: {
          type: "string",
          enum: [
            "B737-800",
            "B737 MAX 8",
            "A320neo",
            "A321neo",
            "B787-9",
            "B777-300ER",
            "A350-900",
            "E175",
          ],
          description: "Filter by aircraft type affected.",
        },
        compliance_status: {
          type: "string",
          enum: ["complied", "in_progress", "not_due", "overdue"],
          description: "Filter by compliance status.",
        },
        sort_by: {
          type: "string",
          enum: [
            "compliance_deadline",
            "compliance_status",
            "reference",
            "tail_number",
          ],
          description: "Field to sort by. Defaults to 'compliance_deadline'.",
        },
        limit: {
          type: "integer",
          description: "Maximum records to return. Defaults to 50.",
          minimum: 1,
          maximum: 500,
        },
      },
      required: [],
    },
  },

  // -- generate_report ------------------------------------------------------
  {
    name: "generate_report",
    description:
      "Generate a structured report for the VP Maintenance. Produces formatted sections with data tables, " +
      "trend analysis, and executive summary. Reports can cover fleet status, cost analysis (CPFH), " +
      "maintenance summaries, procurement reviews, inventory status, AOG analysis, dispatch reliability, " +
      "MEL summaries, or combined anomaly reports. Use when the user asks for a report, summary, or briefing.",
    input_schema: {
      type: "object" as const,
      properties: {
        report_type: {
          type: "string",
          enum: [
            "fleet_status",
            "cost_analysis",
            "maintenance_summary",
            "procurement_summary",
            "inventory_status",
            "aircraft_profile",
            "anomaly_report",
            "aog_analysis",
            "dispatch_reliability",
            "mel_summary",
          ],
          description: "Type of report to generate.",
        },
        aircraft_id: {
          type: "string",
          description:
            "Scope report to a specific aircraft. Required for 'aircraft_profile' report type.",
        },
        aircraft_type: {
          type: "string",
          enum: [
            "B737-800",
            "B737 MAX 8",
            "A320neo",
            "A321neo",
            "B787-9",
            "B777-300ER",
            "A350-900",
            "E175",
          ],
          description: "Scope report to a specific aircraft type.",
        },
        date_range: {
          type: "string",
          enum: [
            "today",
            "last_7_days",
            "last_30_days",
            "last_90_days",
            "last_quarter",
            "year_to_date",
            "custom",
          ],
          description: "Time period for the report. Defaults to 'last_30_days'.",
        },
        compare_to_period: {
          type: "string",
          enum: ["previous_period", "same_period_last_year", "none"],
          description:
            "Include comparison data against a prior period. Defaults to 'previous_period'.",
        },
        include_recommendations: {
          type: "boolean",
          description:
            "If true (default), include actionable recommendations in the report.",
        },
        language: {
          type: "string",
          enum: ["en", "es"],
          description: "Report language. Defaults to the user's current UI language.",
        },
      },
      required: ["report_type"],
    },
  },

  // -- flag_anomalies -------------------------------------------------------
  {
    name: "flag_anomalies",
    description:
      "Scan fleet data for anomalies, outliers, and emerging issues. Checks for aircraft over CPFH budget, " +
      "overdue maintenance creating AOG risk, emergency procurement spikes, inventory stockout risks, " +
      "MEL items approaching expiry, and compliance deadlines at risk. Returns prioritized findings with " +
      "severity, financial impact, and recommended actions. Use this proactively or when the user asks " +
      "'what should I be worried about?'",
    input_schema: {
      type: "object" as const,
      properties: {
        domain: {
          type: "string",
          enum: [
            "cost",
            "maintenance",
            "procurement",
            "inventory",
            "mel",
            "compliance",
            "all",
          ],
          description:
            "Which domain to scan for anomalies. Defaults to 'all' for a comprehensive sweep.",
        },
        aircraft_id: {
          type: "string",
          description: "Scope anomaly scan to a specific aircraft.",
        },
        aircraft_type: {
          type: "string",
          enum: [
            "B737-800",
            "B737 MAX 8",
            "A320neo",
            "A321neo",
            "B787-9",
            "B777-300ER",
            "A350-900",
            "E175",
          ],
          description: "Scope anomaly scan to a specific aircraft type.",
        },
        severity_threshold: {
          type: "string",
          enum: ["critical", "warning", "info"],
          description:
            "Minimum severity to include. 'critical' returns only critical issues. " +
            "'info' returns everything. Defaults to 'warning'.",
        },
        min_financial_impact_usd: {
          type: "number",
          description:
            "Only return anomalies with estimated financial impact above this threshold (USD).",
        },
        limit: {
          type: "integer",
          description: "Maximum anomalies to return. Defaults to 20.",
          minimum: 1,
          maximum: 100,
        },
      },
      required: [],
    },
  },

  // -- update_dashboard_filter ----------------------------------------------
  {
    name: "update_dashboard_filter",
    description:
      "Control the main dashboard view by changing filters, sorts, and the active view panel. " +
      "Tower uses this to direct the VP's attention to specific data — e.g., switching to the " +
      "maintenance board filtered to overdue items, or focusing the fleet map on AOG aircraft. " +
      "This is the 'take action' tool — it changes what the user sees on screen.",
    input_schema: {
      type: "object" as const,
      properties: {
        view: {
          type: "string",
          enum: [
            "fleet_map",
            "fleet_table",
            "maintenance_board",
            "procurement_pipeline",
            "inventory_grid",
            "cost_dashboard",
            "aircraft_detail",
            "mel_board",
            "compliance_tracker",
          ],
          description: "Switch the active dashboard view panel.",
        },
        aircraft_id: {
          type: "string",
          description:
            "Focus on a specific aircraft. For 'aircraft_detail' view, this is required. " +
            "For other views, it highlights/filters to this aircraft.",
        },
        aircraft_type: {
          type: "string",
          enum: [
            "B737-800",
            "B737 MAX 8",
            "A320neo",
            "A321neo",
            "B787-9",
            "B777-300ER",
            "A350-900",
            "E175",
          ],
          description: "Filter the view to show only a specific aircraft type.",
        },
        status_filter: {
          type: "array",
          items: {
            type: "string",
            enum: ["in_flight", "on_ground", "in_maintenance", "aog"],
          },
          description:
            "Filter fleet views by one or more operational statuses. " +
            "E.g., ['aog', 'in_maintenance'] to show only non-earning aircraft.",
        },
        maintenance_status_filter: {
          type: "array",
          items: {
            type: "string",
            enum: ["scheduled", "overdue", "in_progress", "completed"],
          },
          description: "Filter maintenance board by status. E.g., ['overdue'].",
        },
        date_range: {
          type: "string",
          enum: [
            "today",
            "last_7_days",
            "last_30_days",
            "last_90_days",
            "last_quarter",
            "year_to_date",
          ],
          description: "Set the time range for the active view.",
        },
        sort_by: {
          type: "string",
          description:
            "Column or metric to sort the current view by. Valid values depend on the active view.",
        },
        sort_direction: {
          type: "string",
          enum: ["asc", "desc"],
          description: "Sort direction.",
        },
        highlight_anomalies: {
          type: "boolean",
          description:
            "If true, visually highlight anomalous items (over-budget aircraft, overdue maintenance, etc.) " +
            "in the current view with warning indicators.",
        },
        reset: {
          type: "boolean",
          description:
            "If true, clear all filters and return to the default dashboard state.",
        },
      },
      required: [],
    },
  },
];

// ---------------------------------------------------------------------------
// Convenience export: tool name union type for type-safe handler routing
// ---------------------------------------------------------------------------

export type TowerToolName =
  | "query_fleet_status"
  | "query_maintenance"
  | "query_procurement"
  | "query_inventory"
  | "query_mel_status"
  | "query_compliance"
  | "generate_report"
  | "flag_anomalies"
  | "update_dashboard_filter";

/**
 * Type-safe map of tool names to their expected input parameters.
 */
export interface TowerToolInputs {
  query_fleet_status: {
    aircraft_id?: string;
    tail_number?: string;
    aircraft_type?: AircraftType;
    status?: AircraftStatus;
    over_budget_only?: boolean;
    sort_by?: string;
    sort_direction?: SortDirection;
    limit?: number;
  };
  query_maintenance: {
    aircraft_id?: string;
    tail_number?: string;
    status?: MaintenanceStatus;
    category?: MaintenanceCategory;
    priority?: MaintenancePriority;
    check_type?: CheckType;
    trigger?: MaintenanceTrigger;
    overdue_only?: boolean;
    date_range?: DateRangePreset;
    sort_by?: string;
    sort_direction?: SortDirection;
    limit?: number;
  };
  query_procurement: {
    aircraft_id?: string;
    tail_number?: string;
    status?: ProcurementStatus;
    urgency?: ProcurementUrgency;
    category?: PartCategory;
    emergency_only?: boolean;
    date_range?: DateRangePreset;
    min_cost_usd?: number;
    sort_by?: string;
    sort_direction?: SortDirection;
    limit?: number;
  };
  query_inventory: {
    aircraft_id?: string;
    location?: InventoryLocation;
    category?: PartCategory;
    stock_level?: StockLevel;
    critical_only?: boolean;
    below_reorder_point?: boolean;
    part_number?: string;
    description_search?: string;
    max_days_until_stockout?: number;
    sort_by?: string;
    sort_direction?: SortDirection;
    limit?: number;
  };
  query_mel_status: {
    aircraft_id?: string;
    tail_number?: string;
    category?: MELCategory;
    ata_chapter?: string;
    status?: MELStatus;
    days_until_expiry?: number;
    sort_by?: string;
    sort_direction?: SortDirection;
    limit?: number;
  };
  query_compliance: {
    ad_reference?: string;
    sb_reference?: string;
    aircraft_type?: AircraftType;
    compliance_status?: ComplianceStatus;
    sort_by?: string;
    limit?: number;
  };
  generate_report: {
    report_type: ReportType;
    aircraft_id?: string;
    aircraft_type?: AircraftType;
    date_range?: DateRangePreset;
    compare_to_period?: "previous_period" | "same_period_last_year" | "none";
    include_recommendations?: boolean;
    language?: "en" | "es";
  };
  flag_anomalies: {
    domain?: AnomalyDomain;
    aircraft_id?: string;
    aircraft_type?: AircraftType;
    severity_threshold?: "critical" | "warning" | "info";
    min_financial_impact_usd?: number;
    limit?: number;
  };
  update_dashboard_filter: {
    view?: DashboardView;
    aircraft_id?: string;
    aircraft_type?: AircraftType;
    status_filter?: AircraftStatus[];
    maintenance_status_filter?: MaintenanceStatus[];
    date_range?: DateRangePreset;
    sort_by?: string;
    sort_direction?: SortDirection;
    highlight_anomalies?: boolean;
    reset?: boolean;
  };
}

/**
 * Map of tool names to their expected result types.
 */
export interface TowerToolResults {
  query_fleet_status: { aircraft: AircraftRecord[]; total: number };
  query_maintenance: { records: MaintenanceRecord[]; total: number };
  query_procurement: { records: ProcurementRecord[]; total: number };
  query_inventory: { items: InventoryRecord[]; total: number };
  query_mel_status: { items: MELRecord[]; total: number };
  query_compliance: { records: ComplianceRecord[]; total: number };
  generate_report: GeneratedReport;
  flag_anomalies: { anomalies: AnomalyRecord[]; total: number };
  update_dashboard_filter: {
    success: boolean;
    active_view: DashboardView;
    filters_applied: Record<string, unknown>;
  };
}
