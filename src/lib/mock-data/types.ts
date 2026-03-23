// SkyStratos Aviation Operations Dashboard — Type Definitions

export type AircraftType = 'B737-800' | 'B737 MAX 8' | 'A320neo' | 'A321neo' | 'B787-9' | 'B777-300ER' | 'A350-900' | 'E175';
export type AircraftStatus = 'In Flight' | 'On Ground' | 'In Maintenance' | 'AOG';

export interface AircraftPosition {
  lat: number;
  lng: number;
  altitude: number;        // feet MSL
  heading: number;         // degrees
  groundSpeed: number;     // knots
  verticalRate: number;    // ft/min, positive = climbing
  callsign: string | null; // e.g., "UAL1234"
  origin: string | null;   // IATA code
  destination: string | null; // IATA code
}

export interface Aircraft {
  id: string;
  tailNumber: string;
  registration: string;
  type: AircraftType;
  msn: string;
  deliveryDate: string;
  totalFlightHours: number;
  totalCycles: number;
  status: AircraftStatus;
  currentPosition: AircraftPosition;
  currentRoute: string | null;   // e.g., "ORD → LAX"
  currentAirport: string | null; // IATA code when on ground
  costPerFlightHour: number;
  dailyCost: number;
  lastCheckDate: string;
  nextScheduledCheck: string;
  nextCheckType: CheckType;
  activeMELCount: number;
  engineType: string;
  engineHours: number;
}

export type CheckType = 'Line Check' | 'A-Check' | 'B-Check' | 'C-Check' | 'D-Check' | 'Engine Shop Visit' | 'Landing Gear Overhaul' | 'AD Compliance' | 'Service Bulletin';
export type MaintenanceTrigger = 'flight_hours' | 'cycles' | 'calendar' | 'condition' | 'ad_mandate';
export type MaintenanceCategory = 'Engines' | 'Airframe' | 'Avionics' | 'Landing Gear' | 'APU' | 'Hydraulics' | 'Pressurization' | 'Flight Controls' | 'Electrical' | 'Interiors';
export type MaintenanceStatus = 'Completed' | 'In Progress' | 'Scheduled' | 'Overdue';
export type MaintenancePriority = 'Critical' | 'High' | 'Medium' | 'Low';

export interface MaintenanceRecord {
  id: string;
  aircraftId: string;
  tailNumber: string;
  checkType: CheckType;
  trigger: MaintenanceTrigger;
  category: MaintenanceCategory;
  description: string;
  status: MaintenanceStatus;
  priority: MaintenancePriority;
  scheduledDate: string;
  completedDate: string | null;
  hoursRemaining: number | null;
  cyclesRemaining: number | null;
  costEstimate: number;
  actualCost: number | null;
  downtimeHours: number;
  mroFacility: string;
  vendor: string;
  adReference: string | null;
  sbReference: string | null;
  linkedProcurementIds: string[];
}

export interface MELItem {
  id: string;
  aircraftId: string;
  tailNumber: string;
  ataChapter: string;
  description: string;
  category: 'A' | 'B' | 'C' | 'D';
  deferredDate: string;
  expiryDate: string;
  dispatchConditions: string;
  rectificationAction: string;
  status: 'active' | 'rectified' | 'extended';
}

export type PartCategory = 'Rotables' | 'Expendables' | 'Consumables' | 'Engine Parts' | 'Avionics LRUs' | 'Safety Equipment' | 'Cabin Parts' | 'Tooling';
export type InventoryLocation = 'ORD MRO Hub' | 'LAX Parts Depot' | 'LHR Stores' | 'SIN MRO Center' | 'DFW Warehouse' | 'On Aircraft' | 'Vendor Repair Shop';
export type InventoryStatus = 'In Stock' | 'Low Stock' | 'Out of Stock' | 'On Order';

export interface InventoryItem {
  id: string;
  partNumber: string;
  alternatePN: string[];
  description: string;
  category: PartCategory;
  currentStock: number;
  minimumStock: number;
  reorderPoint: number;
  unitCost: number;
  location: InventoryLocation;
  status: InventoryStatus;
  lastRestocked: string;
  nextDelivery: string | null;
  leadTimeDays: number;
  isRotable: boolean;
  shelfLife: string | null;
  condition: 'serviceable' | 'unserviceable' | 'in_inspection';
}

export type ProcurementStatus = 'Ordered' | 'Shipped' | 'Delivered' | 'Pending Approval' | 'Emergency Order';

export interface ProcurementRecord {
  id: string;
  aircraftId: string;
  tailNumber: string;
  category: PartCategory;
  item: string;
  quantity: number;
  unitPrice: number;
  totalCost: number;
  status: ProcurementStatus;
  orderDate: string;
  expectedDelivery: string;
  actualDelivery: string | null;
  supplier: string;
  isEmergency: boolean;
  leadTime: number;
  premiumPct: number;
}

export interface AircraftCostBreakdown {
  aircraftId: string;
  tailNumber: string;
  totalCost: number;
  dailyAverage: number;
  overBudget: boolean;
}

export interface MonthlyCostData {
  month: string;
  totalFleetCost: number;
  fuelCost: number;
  scheduledMaintenanceCost: number;
  unscheduledMaintenanceCost: number;
  crewCost: number;
  airportFees: number;
  insuranceCost: number;
  procurementCost: number;
  aogProcurementCost: number;
  aogDowntimeCost: number;
  budgetedCost: number;
  variance: number;
  aircraftBreakdown: AircraftCostBreakdown[];
}

export type AlertType = 'cost' | 'maintenance' | 'procurement' | 'inventory' | 'safety' | 'mel' | 'compliance';
export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  description: string;
  aircraftId: string | null;
  tailNumber: string | null;
  createdAt: string;
  acknowledged: boolean;
}

export interface ScheduledFlight {
  id: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  aircraftId: string;
  estimatedRevenue: number;
  passengerCount: number;
}
