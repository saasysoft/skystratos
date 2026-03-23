// Skyline Aviation — Scheduled Flights Mock Data (3-day forward schedule)
// "Today" = 2026-03-23. Schedule covers 2026-03-23, 2026-03-24, 2026-03-25.
// AOG aircraft (N73805=ac-005, N320A3=ac-015) have flights in schedule but are grounded.

import type { ScheduledFlight } from './types';

// Helper to generate flight IDs
function flt(day: number, seq: number): string {
  return `flt-${day.toString().padStart(2, '0')}-${seq.toString().padStart(3, '0')}`;
}

// Day 1: 2026-03-23
const day1: ScheduledFlight[] = [
  // B737-800 flights (N73801-N73808, excluding N73805 AOG and N73808 In Maintenance)
  { id: flt(23, 1), flightNumber: 'SKY101', origin: 'ORD', destination: 'LAX', departureTime: '2026-03-23T07:00:00Z', arrivalTime: '2026-03-23T09:30:00Z', aircraftId: 'ac-001', estimatedRevenue: 135000, passengerCount: 162 },
  { id: flt(23, 2), flightNumber: 'SKY102', origin: 'LAX', destination: 'ORD', departureTime: '2026-03-23T11:00:00Z', arrivalTime: '2026-03-23T16:30:00Z', aircraftId: 'ac-001', estimatedRevenue: 128000, passengerCount: 155 },
  { id: flt(23, 3), flightNumber: 'SKY103', origin: 'ORD', destination: 'DEN', departureTime: '2026-03-23T18:30:00Z', arrivalTime: '2026-03-23T20:00:00Z', aircraftId: 'ac-001', estimatedRevenue: 95000, passengerCount: 148 },
  { id: flt(23, 4), flightNumber: 'SKY204', origin: 'DFW', destination: 'LAX', departureTime: '2026-03-23T06:30:00Z', arrivalTime: '2026-03-23T08:15:00Z', aircraftId: 'ac-002', estimatedRevenue: 118000, passengerCount: 158 },
  { id: flt(23, 5), flightNumber: 'SKY205', origin: 'LAX', destination: 'DFW', departureTime: '2026-03-23T10:00:00Z', arrivalTime: '2026-03-23T14:30:00Z', aircraftId: 'ac-002', estimatedRevenue: 112000, passengerCount: 150 },
  { id: flt(23, 6), flightNumber: 'SKY206', origin: 'DFW', destination: 'MIA', departureTime: '2026-03-23T16:30:00Z', arrivalTime: '2026-03-23T20:00:00Z', aircraftId: 'ac-002', estimatedRevenue: 105000, passengerCount: 145 },
  { id: flt(23, 7), flightNumber: 'SKY310', origin: 'ORD', destination: 'JFK', departureTime: '2026-03-23T08:00:00Z', arrivalTime: '2026-03-23T11:00:00Z', aircraftId: 'ac-003', estimatedRevenue: 125000, passengerCount: 160 },
  { id: flt(23, 8), flightNumber: 'SKY311', origin: 'JFK', destination: 'ORD', departureTime: '2026-03-23T13:00:00Z', arrivalTime: '2026-03-23T15:30:00Z', aircraftId: 'ac-003', estimatedRevenue: 120000, passengerCount: 155 },
  { id: flt(23, 9), flightNumber: 'SKY415', origin: 'DFW', destination: 'ORD', departureTime: '2026-03-23T07:30:00Z', arrivalTime: '2026-03-23T10:30:00Z', aircraftId: 'ac-004', estimatedRevenue: 110000, passengerCount: 152 },
  { id: flt(23, 10), flightNumber: 'SKY416', origin: 'ORD', destination: 'ATL', departureTime: '2026-03-23T12:30:00Z', arrivalTime: '2026-03-23T15:00:00Z', aircraftId: 'ac-004', estimatedRevenue: 108000, passengerCount: 148 },
  { id: flt(23, 11), flightNumber: 'SKY417', origin: 'ATL', destination: 'DFW', departureTime: '2026-03-23T17:00:00Z', arrivalTime: '2026-03-23T19:00:00Z', aircraftId: 'ac-004', estimatedRevenue: 95000, passengerCount: 140 },
  // N73805 AOG — flights exist but aircraft grounded
  { id: flt(23, 12), flightNumber: 'SKY510', origin: 'ORD', destination: 'DFW', departureTime: '2026-03-23T08:00:00Z', arrivalTime: '2026-03-23T10:30:00Z', aircraftId: 'ac-005', estimatedRevenue: 115000, passengerCount: 155 },
  { id: flt(23, 13), flightNumber: 'SKY511', origin: 'DFW', destination: 'ORD', departureTime: '2026-03-23T13:00:00Z', arrivalTime: '2026-03-23T15:30:00Z', aircraftId: 'ac-005', estimatedRevenue: 112000, passengerCount: 150 },
  { id: flt(23, 14), flightNumber: 'SKY512', origin: 'ORD', destination: 'MIA', departureTime: '2026-03-23T18:00:00Z', arrivalTime: '2026-03-23T21:30:00Z', aircraftId: 'ac-005', estimatedRevenue: 130000, passengerCount: 160 },
  // N73806
  { id: flt(23, 15), flightNumber: 'SKY620', origin: 'LAX', destination: 'SFO', departureTime: '2026-03-23T09:00:00Z', arrivalTime: '2026-03-23T10:15:00Z', aircraftId: 'ac-006', estimatedRevenue: 80000, passengerCount: 130 },
  { id: flt(23, 16), flightNumber: 'SKY621', origin: 'SFO', destination: 'LAX', departureTime: '2026-03-23T12:00:00Z', arrivalTime: '2026-03-23T13:15:00Z', aircraftId: 'ac-006', estimatedRevenue: 82000, passengerCount: 135 },
  { id: flt(23, 17), flightNumber: 'SKY622', origin: 'LAX', destination: 'DEN', departureTime: '2026-03-23T15:30:00Z', arrivalTime: '2026-03-23T18:30:00Z', aircraftId: 'ac-006', estimatedRevenue: 105000, passengerCount: 148 },
  // N73807
  { id: flt(23, 18), flightNumber: 'SKY522', origin: 'ORD', destination: 'DEN', departureTime: '2026-03-23T06:00:00Z', arrivalTime: '2026-03-23T07:45:00Z', aircraftId: 'ac-007', estimatedRevenue: 92000, passengerCount: 142 },
  { id: flt(23, 19), flightNumber: 'SKY523', origin: 'DEN', destination: 'ORD', departureTime: '2026-03-23T10:00:00Z', arrivalTime: '2026-03-23T13:30:00Z', aircraftId: 'ac-007', estimatedRevenue: 95000, passengerCount: 145 },
  { id: flt(23, 20), flightNumber: 'SKY524', origin: 'ORD', destination: 'MSP', departureTime: '2026-03-23T15:30:00Z', arrivalTime: '2026-03-23T16:45:00Z', aircraftId: 'ac-007', estimatedRevenue: 85000, passengerCount: 138 },

  // B737 MAX 8 flights
  { id: flt(23, 21), flightNumber: 'SKY630', origin: 'DEN', destination: 'LAX', departureTime: '2026-03-23T07:00:00Z', arrivalTime: '2026-03-23T08:45:00Z', aircraftId: 'ac-009', estimatedRevenue: 100000, passengerCount: 155 },
  { id: flt(23, 22), flightNumber: 'SKY631', origin: 'LAX', destination: 'DEN', departureTime: '2026-03-23T11:00:00Z', arrivalTime: '2026-03-23T14:00:00Z', aircraftId: 'ac-009', estimatedRevenue: 98000, passengerCount: 150 },
  { id: flt(23, 23), flightNumber: 'SKY632', origin: 'DEN', destination: 'ORD', departureTime: '2026-03-23T16:00:00Z', arrivalTime: '2026-03-23T19:30:00Z', aircraftId: 'ac-009', estimatedRevenue: 95000, passengerCount: 148 },
  { id: flt(23, 24), flightNumber: 'SKY718', origin: 'DFW', destination: 'ATL', departureTime: '2026-03-23T06:30:00Z', arrivalTime: '2026-03-23T09:30:00Z', aircraftId: 'ac-010', estimatedRevenue: 105000, passengerCount: 152 },
  { id: flt(23, 25), flightNumber: 'SKY719', origin: 'ATL', destination: 'JFK', departureTime: '2026-03-23T11:30:00Z', arrivalTime: '2026-03-23T14:00:00Z', aircraftId: 'ac-010', estimatedRevenue: 115000, passengerCount: 158 },
  { id: flt(23, 26), flightNumber: 'SKY720', origin: 'JFK', destination: 'DFW', departureTime: '2026-03-23T16:30:00Z', arrivalTime: '2026-03-23T19:30:00Z', aircraftId: 'ac-010', estimatedRevenue: 120000, passengerCount: 155 },
  { id: flt(23, 27), flightNumber: 'SKY825', origin: 'ORD', destination: 'BOS', departureTime: '2026-03-23T07:30:00Z', arrivalTime: '2026-03-23T10:30:00Z', aircraftId: 'ac-011', estimatedRevenue: 108000, passengerCount: 150 },
  { id: flt(23, 28), flightNumber: 'SKY826', origin: 'BOS', destination: 'ORD', departureTime: '2026-03-23T13:00:00Z', arrivalTime: '2026-03-23T15:30:00Z', aircraftId: 'ac-011', estimatedRevenue: 105000, passengerCount: 148 },
  { id: flt(23, 29), flightNumber: 'SKY827', origin: 'ORD', destination: 'DFW', departureTime: '2026-03-23T18:00:00Z', arrivalTime: '2026-03-23T20:30:00Z', aircraftId: 'ac-011', estimatedRevenue: 100000, passengerCount: 145 },
  { id: flt(23, 30), flightNumber: 'SKY830', origin: 'ORD', destination: 'LAX', departureTime: '2026-03-23T09:00:00Z', arrivalTime: '2026-03-23T11:30:00Z', aircraftId: 'ac-012', estimatedRevenue: 130000, passengerCount: 160 },
  { id: flt(23, 31), flightNumber: 'SKY831', origin: 'LAX', destination: 'ORD', departureTime: '2026-03-23T14:00:00Z', arrivalTime: '2026-03-23T19:30:00Z', aircraftId: 'ac-012', estimatedRevenue: 125000, passengerCount: 158 },

  // A320neo flights
  { id: flt(23, 32), flightNumber: 'SKY901', origin: 'ORD', destination: 'PHX', departureTime: '2026-03-23T06:30:00Z', arrivalTime: '2026-03-23T08:45:00Z', aircraftId: 'ac-013', estimatedRevenue: 110000, passengerCount: 150 },
  { id: flt(23, 33), flightNumber: 'SKY902', origin: 'PHX', destination: 'ORD', departureTime: '2026-03-23T11:00:00Z', arrivalTime: '2026-03-23T15:30:00Z', aircraftId: 'ac-013', estimatedRevenue: 108000, passengerCount: 148 },
  { id: flt(23, 34), flightNumber: 'SKY903', origin: 'ORD', destination: 'DFW', departureTime: '2026-03-23T18:00:00Z', arrivalTime: '2026-03-23T20:15:00Z', aircraftId: 'ac-013', estimatedRevenue: 100000, passengerCount: 145 },
  { id: flt(23, 35), flightNumber: 'SKY1015', origin: 'DFW', destination: 'MIA', departureTime: '2026-03-23T07:00:00Z', arrivalTime: '2026-03-23T10:30:00Z', aircraftId: 'ac-014', estimatedRevenue: 115000, passengerCount: 155 },
  { id: flt(23, 36), flightNumber: 'SKY1016', origin: 'MIA', destination: 'DFW', departureTime: '2026-03-23T13:00:00Z', arrivalTime: '2026-03-23T15:30:00Z', aircraftId: 'ac-014', estimatedRevenue: 112000, passengerCount: 150 },
  { id: flt(23, 37), flightNumber: 'SKY1017', origin: 'DFW', destination: 'ORD', departureTime: '2026-03-23T18:00:00Z', arrivalTime: '2026-03-23T20:30:00Z', aircraftId: 'ac-014', estimatedRevenue: 105000, passengerCount: 148 },
  // N320A3 AOG — flights exist but aircraft grounded
  { id: flt(23, 38), flightNumber: 'SKY1110', origin: 'LAX', destination: 'SFO', departureTime: '2026-03-23T08:00:00Z', arrivalTime: '2026-03-23T09:15:00Z', aircraftId: 'ac-015', estimatedRevenue: 82000, passengerCount: 135 },
  { id: flt(23, 39), flightNumber: 'SKY1111', origin: 'SFO', destination: 'LAX', departureTime: '2026-03-23T11:30:00Z', arrivalTime: '2026-03-23T12:45:00Z', aircraftId: 'ac-015', estimatedRevenue: 80000, passengerCount: 130 },
  { id: flt(23, 40), flightNumber: 'SKY1120', origin: 'ORD', destination: 'IAH', departureTime: '2026-03-23T07:30:00Z', arrivalTime: '2026-03-23T10:00:00Z', aircraftId: 'ac-016', estimatedRevenue: 108000, passengerCount: 150 },
  { id: flt(23, 41), flightNumber: 'SKY1121', origin: 'IAH', destination: 'ORD', departureTime: '2026-03-23T12:30:00Z', arrivalTime: '2026-03-23T15:30:00Z', aircraftId: 'ac-016', estimatedRevenue: 105000, passengerCount: 148 },
  { id: flt(23, 42), flightNumber: 'SKY1230', origin: 'ATL', destination: 'JFK', departureTime: '2026-03-23T08:00:00Z', arrivalTime: '2026-03-23T10:30:00Z', aircraftId: 'ac-017', estimatedRevenue: 118000, passengerCount: 155 },
  { id: flt(23, 43), flightNumber: 'SKY1231', origin: 'JFK', destination: 'ATL', departureTime: '2026-03-23T13:00:00Z', arrivalTime: '2026-03-23T15:30:00Z', aircraftId: 'ac-017', estimatedRevenue: 115000, passengerCount: 152 },
  { id: flt(23, 44), flightNumber: 'SKY1232', origin: 'ATL', destination: 'ORD', departureTime: '2026-03-23T18:00:00Z', arrivalTime: '2026-03-23T19:30:00Z', aircraftId: 'ac-017', estimatedRevenue: 105000, passengerCount: 148 },
  { id: flt(23, 45), flightNumber: 'SKY1135', origin: 'DFW', destination: 'LAX', departureTime: '2026-03-23T09:30:00Z', arrivalTime: '2026-03-23T11:15:00Z', aircraftId: 'ac-018', estimatedRevenue: 112000, passengerCount: 150 },
  { id: flt(23, 46), flightNumber: 'SKY1136', origin: 'LAX', destination: 'DFW', departureTime: '2026-03-23T14:00:00Z', arrivalTime: '2026-03-23T18:30:00Z', aircraftId: 'ac-018', estimatedRevenue: 110000, passengerCount: 148 },

  // A321neo flights
  { id: flt(23, 47), flightNumber: 'SKY1340', origin: 'JFK', destination: 'MIA', departureTime: '2026-03-23T07:00:00Z', arrivalTime: '2026-03-23T10:00:00Z', aircraftId: 'ac-019', estimatedRevenue: 140000, passengerCount: 195 },
  { id: flt(23, 48), flightNumber: 'SKY1341', origin: 'MIA', destination: 'JFK', departureTime: '2026-03-23T13:00:00Z', arrivalTime: '2026-03-23T16:00:00Z', aircraftId: 'ac-019', estimatedRevenue: 135000, passengerCount: 190 },
  { id: flt(23, 49), flightNumber: 'SKY1445', origin: 'LAX', destination: 'SFO', departureTime: '2026-03-23T08:30:00Z', arrivalTime: '2026-03-23T09:45:00Z', aircraftId: 'ac-020', estimatedRevenue: 90000, passengerCount: 175 },
  { id: flt(23, 50), flightNumber: 'SKY1446', origin: 'SFO', destination: 'JFK', departureTime: '2026-03-23T12:00:00Z', arrivalTime: '2026-03-23T20:00:00Z', aircraftId: 'ac-020', estimatedRevenue: 150000, passengerCount: 200 },
  // N321A3 In Maintenance — no flights
  { id: flt(23, 51), flightNumber: 'SKY1550', origin: 'DFW', destination: 'MSP', departureTime: '2026-03-23T07:00:00Z', arrivalTime: '2026-03-23T09:30:00Z', aircraftId: 'ac-022', estimatedRevenue: 110000, passengerCount: 185 },
  { id: flt(23, 52), flightNumber: 'SKY1551', origin: 'MSP', destination: 'DFW', departureTime: '2026-03-23T12:00:00Z', arrivalTime: '2026-03-23T14:30:00Z', aircraftId: 'ac-022', estimatedRevenue: 108000, passengerCount: 180 },
  { id: flt(23, 53), flightNumber: 'SKY1552', origin: 'DFW', destination: 'JFK', departureTime: '2026-03-23T17:00:00Z', arrivalTime: '2026-03-23T21:00:00Z', aircraftId: 'ac-022', estimatedRevenue: 135000, passengerCount: 195 },

  // B787-9 widebody flights
  { id: flt(23, 54), flightNumber: 'SKY1601', origin: 'ORD', destination: 'LHR', departureTime: '2026-03-23T17:00:00Z', arrivalTime: '2026-03-24T06:30:00Z', aircraftId: 'ac-023', estimatedRevenue: 480000, passengerCount: 280 },
  { id: flt(23, 55), flightNumber: 'SKY1705', origin: 'LHR', destination: 'ORD', departureTime: '2026-03-23T10:00:00Z', arrivalTime: '2026-03-23T13:30:00Z', aircraftId: 'ac-024', estimatedRevenue: 460000, passengerCount: 270 },
  { id: flt(23, 56), flightNumber: 'SKY1706', origin: 'ORD', destination: 'LHR', departureTime: '2026-03-23T19:00:00Z', arrivalTime: '2026-03-24T08:30:00Z', aircraftId: 'ac-024', estimatedRevenue: 490000, passengerCount: 285 },
  { id: flt(23, 57), flightNumber: 'SKY1808', origin: 'LHR', destination: 'JFK', departureTime: '2026-03-23T11:00:00Z', arrivalTime: '2026-03-23T14:00:00Z', aircraftId: 'ac-025', estimatedRevenue: 520000, passengerCount: 290 },
  { id: flt(23, 58), flightNumber: 'SKY1820', origin: 'LHR', destination: 'SIN', departureTime: '2026-03-23T22:00:00Z', arrivalTime: '2026-03-24T16:00:00Z', aircraftId: 'ac-026', estimatedRevenue: 620000, passengerCount: 295 },

  // B777-300ER flights
  { id: flt(23, 59), flightNumber: 'SKY1910', origin: 'LAX', destination: 'SIN', departureTime: '2026-03-23T01:00:00Z', arrivalTime: '2026-03-24T08:00:00Z', aircraftId: 'ac-027', estimatedRevenue: 750000, passengerCount: 350 },
  // N77702 In Maintenance at SIN — no flights

  // A350-900 flights
  { id: flt(23, 60), flightNumber: 'SKY2010', origin: 'SIN', destination: 'LHR', departureTime: '2026-03-23T02:00:00Z', arrivalTime: '2026-03-23T09:30:00Z', aircraftId: 'ac-029', estimatedRevenue: 580000, passengerCount: 300 },
  { id: flt(23, 61), flightNumber: 'SKY2020', origin: 'SIN', destination: 'ORD', departureTime: '2026-03-23T23:00:00Z', arrivalTime: '2026-03-24T06:00:00Z', aircraftId: 'ac-030', estimatedRevenue: 650000, passengerCount: 305 },
];

// Day 2: 2026-03-24
const day2: ScheduledFlight[] = [
  // Narrowbody rotations
  { id: flt(24, 1), flightNumber: 'SKY101', origin: 'ORD', destination: 'LAX', departureTime: '2026-03-24T07:00:00Z', arrivalTime: '2026-03-24T09:30:00Z', aircraftId: 'ac-001', estimatedRevenue: 132000, passengerCount: 160 },
  { id: flt(24, 2), flightNumber: 'SKY102', origin: 'LAX', destination: 'ORD', departureTime: '2026-03-24T11:00:00Z', arrivalTime: '2026-03-24T16:30:00Z', aircraftId: 'ac-001', estimatedRevenue: 130000, passengerCount: 158 },
  { id: flt(24, 3), flightNumber: 'SKY103', origin: 'ORD', destination: 'JFK', departureTime: '2026-03-24T18:30:00Z', arrivalTime: '2026-03-24T21:30:00Z', aircraftId: 'ac-001', estimatedRevenue: 125000, passengerCount: 155 },
  { id: flt(24, 4), flightNumber: 'SKY204', origin: 'DFW', destination: 'ORD', departureTime: '2026-03-24T06:30:00Z', arrivalTime: '2026-03-24T09:30:00Z', aircraftId: 'ac-002', estimatedRevenue: 108000, passengerCount: 148 },
  { id: flt(24, 5), flightNumber: 'SKY205', origin: 'ORD', destination: 'ATL', departureTime: '2026-03-24T12:00:00Z', arrivalTime: '2026-03-24T14:30:00Z', aircraftId: 'ac-002', estimatedRevenue: 105000, passengerCount: 145 },
  { id: flt(24, 6), flightNumber: 'SKY206', origin: 'ATL', destination: 'DFW', departureTime: '2026-03-24T16:30:00Z', arrivalTime: '2026-03-24T18:30:00Z', aircraftId: 'ac-002', estimatedRevenue: 100000, passengerCount: 140 },
  { id: flt(24, 7), flightNumber: 'SKY310', origin: 'ORD', destination: 'BOS', departureTime: '2026-03-24T08:00:00Z', arrivalTime: '2026-03-24T11:00:00Z', aircraftId: 'ac-003', estimatedRevenue: 115000, passengerCount: 155 },
  { id: flt(24, 8), flightNumber: 'SKY311', origin: 'BOS', destination: 'ORD', departureTime: '2026-03-24T13:30:00Z', arrivalTime: '2026-03-24T16:00:00Z', aircraftId: 'ac-003', estimatedRevenue: 112000, passengerCount: 150 },
  { id: flt(24, 9), flightNumber: 'SKY415', origin: 'DFW', destination: 'MIA', departureTime: '2026-03-24T07:00:00Z', arrivalTime: '2026-03-24T10:30:00Z', aircraftId: 'ac-004', estimatedRevenue: 115000, passengerCount: 155 },
  { id: flt(24, 10), flightNumber: 'SKY416', origin: 'MIA', destination: 'DFW', departureTime: '2026-03-24T13:00:00Z', arrivalTime: '2026-03-24T15:30:00Z', aircraftId: 'ac-004', estimatedRevenue: 110000, passengerCount: 150 },
  { id: flt(24, 11), flightNumber: 'SKY417', origin: 'DFW', destination: 'ORD', departureTime: '2026-03-24T18:00:00Z', arrivalTime: '2026-03-24T20:30:00Z', aircraftId: 'ac-004', estimatedRevenue: 100000, passengerCount: 145 },
  // N73805 AOG flights
  { id: flt(24, 12), flightNumber: 'SKY510', origin: 'ORD', destination: 'LAX', departureTime: '2026-03-24T07:30:00Z', arrivalTime: '2026-03-24T10:00:00Z', aircraftId: 'ac-005', estimatedRevenue: 128000, passengerCount: 158 },
  { id: flt(24, 13), flightNumber: 'SKY511', origin: 'LAX', destination: 'ORD', departureTime: '2026-03-24T13:00:00Z', arrivalTime: '2026-03-24T18:30:00Z', aircraftId: 'ac-005', estimatedRevenue: 125000, passengerCount: 155 },
  { id: flt(24, 14), flightNumber: 'SKY620', origin: 'LAX', destination: 'PHX', departureTime: '2026-03-24T08:00:00Z', arrivalTime: '2026-03-24T09:30:00Z', aircraftId: 'ac-006', estimatedRevenue: 85000, passengerCount: 135 },
  { id: flt(24, 15), flightNumber: 'SKY621', origin: 'PHX', destination: 'LAX', departureTime: '2026-03-24T12:00:00Z', arrivalTime: '2026-03-24T13:15:00Z', aircraftId: 'ac-006', estimatedRevenue: 82000, passengerCount: 130 },
  { id: flt(24, 16), flightNumber: 'SKY622', origin: 'LAX', destination: 'ORD', departureTime: '2026-03-24T16:00:00Z', arrivalTime: '2026-03-24T21:30:00Z', aircraftId: 'ac-006', estimatedRevenue: 130000, passengerCount: 158 },
  { id: flt(24, 17), flightNumber: 'SKY522', origin: 'ORD', destination: 'MSP', departureTime: '2026-03-24T07:00:00Z', arrivalTime: '2026-03-24T08:15:00Z', aircraftId: 'ac-007', estimatedRevenue: 85000, passengerCount: 138 },
  { id: flt(24, 18), flightNumber: 'SKY523', origin: 'MSP', destination: 'ORD', departureTime: '2026-03-24T10:30:00Z', arrivalTime: '2026-03-24T12:00:00Z', aircraftId: 'ac-007', estimatedRevenue: 82000, passengerCount: 135 },
  { id: flt(24, 19), flightNumber: 'SKY524', origin: 'ORD', destination: 'DEN', departureTime: '2026-03-24T14:30:00Z', arrivalTime: '2026-03-24T16:15:00Z', aircraftId: 'ac-007', estimatedRevenue: 92000, passengerCount: 142 },

  // MAX 8 day 2
  { id: flt(24, 20), flightNumber: 'SKY630', origin: 'ORD', destination: 'LAX', departureTime: '2026-03-24T08:00:00Z', arrivalTime: '2026-03-24T10:30:00Z', aircraftId: 'ac-009', estimatedRevenue: 130000, passengerCount: 160 },
  { id: flt(24, 21), flightNumber: 'SKY631', origin: 'LAX', destination: 'DFW', departureTime: '2026-03-24T13:00:00Z', arrivalTime: '2026-03-24T17:30:00Z', aircraftId: 'ac-009', estimatedRevenue: 118000, passengerCount: 155 },
  { id: flt(24, 22), flightNumber: 'SKY718', origin: 'DFW', destination: 'JFK', departureTime: '2026-03-24T07:00:00Z', arrivalTime: '2026-03-24T11:00:00Z', aircraftId: 'ac-010', estimatedRevenue: 125000, passengerCount: 158 },
  { id: flt(24, 23), flightNumber: 'SKY719', origin: 'JFK', destination: 'DFW', departureTime: '2026-03-24T14:00:00Z', arrivalTime: '2026-03-24T17:00:00Z', aircraftId: 'ac-010', estimatedRevenue: 120000, passengerCount: 155 },
  { id: flt(24, 24), flightNumber: 'SKY825', origin: 'ORD', destination: 'ATL', departureTime: '2026-03-24T07:30:00Z', arrivalTime: '2026-03-24T10:00:00Z', aircraftId: 'ac-011', estimatedRevenue: 105000, passengerCount: 148 },
  { id: flt(24, 25), flightNumber: 'SKY826', origin: 'ATL', destination: 'MIA', departureTime: '2026-03-24T12:30:00Z', arrivalTime: '2026-03-24T14:00:00Z', aircraftId: 'ac-011', estimatedRevenue: 90000, passengerCount: 140 },
  { id: flt(24, 26), flightNumber: 'SKY827', origin: 'MIA', destination: 'ORD', departureTime: '2026-03-24T16:30:00Z', arrivalTime: '2026-03-24T20:00:00Z', aircraftId: 'ac-011', estimatedRevenue: 120000, passengerCount: 155 },
  { id: flt(24, 27), flightNumber: 'SKY830', origin: 'ORD', destination: 'DFW', departureTime: '2026-03-24T09:00:00Z', arrivalTime: '2026-03-24T11:30:00Z', aircraftId: 'ac-012', estimatedRevenue: 105000, passengerCount: 150 },
  { id: flt(24, 28), flightNumber: 'SKY831', origin: 'DFW', destination: 'ORD', departureTime: '2026-03-24T14:00:00Z', arrivalTime: '2026-03-24T16:30:00Z', aircraftId: 'ac-012', estimatedRevenue: 102000, passengerCount: 148 },

  // A320neo day 2
  { id: flt(24, 29), flightNumber: 'SKY901', origin: 'ORD', destination: 'DEN', departureTime: '2026-03-24T07:00:00Z', arrivalTime: '2026-03-24T08:45:00Z', aircraftId: 'ac-013', estimatedRevenue: 95000, passengerCount: 145 },
  { id: flt(24, 30), flightNumber: 'SKY902', origin: 'DEN', destination: 'ORD', departureTime: '2026-03-24T11:00:00Z', arrivalTime: '2026-03-24T14:30:00Z', aircraftId: 'ac-013', estimatedRevenue: 92000, passengerCount: 142 },
  { id: flt(24, 31), flightNumber: 'SKY1015', origin: 'DFW', destination: 'JFK', departureTime: '2026-03-24T07:30:00Z', arrivalTime: '2026-03-24T11:30:00Z', aircraftId: 'ac-014', estimatedRevenue: 130000, passengerCount: 158 },
  { id: flt(24, 32), flightNumber: 'SKY1016', origin: 'JFK', destination: 'DFW', departureTime: '2026-03-24T14:00:00Z', arrivalTime: '2026-03-24T17:00:00Z', aircraftId: 'ac-014', estimatedRevenue: 125000, passengerCount: 155 },
  // N320A3 AOG flights
  { id: flt(24, 33), flightNumber: 'SKY1110', origin: 'LAX', destination: 'DFW', departureTime: '2026-03-24T08:00:00Z', arrivalTime: '2026-03-24T12:30:00Z', aircraftId: 'ac-015', estimatedRevenue: 115000, passengerCount: 150 },
  { id: flt(24, 34), flightNumber: 'SKY1111', origin: 'DFW', destination: 'LAX', departureTime: '2026-03-24T15:00:00Z', arrivalTime: '2026-03-24T17:00:00Z', aircraftId: 'ac-015', estimatedRevenue: 112000, passengerCount: 148 },
  { id: flt(24, 35), flightNumber: 'SKY1120', origin: 'ORD', destination: 'MIA', departureTime: '2026-03-24T07:30:00Z', arrivalTime: '2026-03-24T11:00:00Z', aircraftId: 'ac-016', estimatedRevenue: 120000, passengerCount: 152 },
  { id: flt(24, 36), flightNumber: 'SKY1121', origin: 'MIA', destination: 'ORD', departureTime: '2026-03-24T13:30:00Z', arrivalTime: '2026-03-24T16:30:00Z', aircraftId: 'ac-016', estimatedRevenue: 118000, passengerCount: 150 },
  { id: flt(24, 37), flightNumber: 'SKY1230', origin: 'ORD', destination: 'LAX', departureTime: '2026-03-24T08:00:00Z', arrivalTime: '2026-03-24T10:30:00Z', aircraftId: 'ac-017', estimatedRevenue: 132000, passengerCount: 158 },
  { id: flt(24, 38), flightNumber: 'SKY1231', origin: 'LAX', destination: 'ORD', departureTime: '2026-03-24T14:00:00Z', arrivalTime: '2026-03-24T19:30:00Z', aircraftId: 'ac-017', estimatedRevenue: 128000, passengerCount: 155 },
  { id: flt(24, 39), flightNumber: 'SKY1135', origin: 'DFW', destination: 'ATL', departureTime: '2026-03-24T09:00:00Z', arrivalTime: '2026-03-24T12:00:00Z', aircraftId: 'ac-018', estimatedRevenue: 105000, passengerCount: 148 },
  { id: flt(24, 40), flightNumber: 'SKY1136', origin: 'ATL', destination: 'DFW', departureTime: '2026-03-24T14:30:00Z', arrivalTime: '2026-03-24T16:30:00Z', aircraftId: 'ac-018', estimatedRevenue: 100000, passengerCount: 142 },

  // A321neo day 2
  { id: flt(24, 41), flightNumber: 'SKY1340', origin: 'JFK', destination: 'LAX', departureTime: '2026-03-24T08:00:00Z', arrivalTime: '2026-03-24T11:30:00Z', aircraftId: 'ac-019', estimatedRevenue: 148000, passengerCount: 200 },
  { id: flt(24, 42), flightNumber: 'SKY1341', origin: 'LAX', destination: 'JFK', departureTime: '2026-03-24T14:30:00Z', arrivalTime: '2026-03-24T22:30:00Z', aircraftId: 'ac-019', estimatedRevenue: 145000, passengerCount: 195 },
  { id: flt(24, 43), flightNumber: 'SKY1445', origin: 'SFO', destination: 'ORD', departureTime: '2026-03-24T08:00:00Z', arrivalTime: '2026-03-24T13:30:00Z', aircraftId: 'ac-020', estimatedRevenue: 135000, passengerCount: 190 },
  { id: flt(24, 44), flightNumber: 'SKY1446', origin: 'ORD', destination: 'SFO', departureTime: '2026-03-24T16:00:00Z', arrivalTime: '2026-03-24T18:30:00Z', aircraftId: 'ac-020', estimatedRevenue: 130000, passengerCount: 185 },
  { id: flt(24, 45), flightNumber: 'SKY1550', origin: 'DFW', destination: 'LAX', departureTime: '2026-03-24T07:30:00Z', arrivalTime: '2026-03-24T09:15:00Z', aircraftId: 'ac-022', estimatedRevenue: 118000, passengerCount: 188 },
  { id: flt(24, 46), flightNumber: 'SKY1551', origin: 'LAX', destination: 'DFW', departureTime: '2026-03-24T12:00:00Z', arrivalTime: '2026-03-24T16:30:00Z', aircraftId: 'ac-022', estimatedRevenue: 115000, passengerCount: 185 },

  // Widebody day 2
  { id: flt(24, 47), flightNumber: 'SKY1602', origin: 'LHR', destination: 'ORD', departureTime: '2026-03-24T10:00:00Z', arrivalTime: '2026-03-24T13:30:00Z', aircraftId: 'ac-023', estimatedRevenue: 470000, passengerCount: 275 },
  { id: flt(24, 48), flightNumber: 'SKY1706', origin: 'LHR', destination: 'JFK', departureTime: '2026-03-24T11:00:00Z', arrivalTime: '2026-03-24T14:00:00Z', aircraftId: 'ac-024', estimatedRevenue: 500000, passengerCount: 280 },
  { id: flt(24, 49), flightNumber: 'SKY1808', origin: 'JFK', destination: 'LHR', departureTime: '2026-03-24T19:00:00Z', arrivalTime: '2026-03-25T06:30:00Z', aircraftId: 'ac-025', estimatedRevenue: 510000, passengerCount: 288 },
  { id: flt(24, 50), flightNumber: 'SKY1820', origin: 'SIN', destination: 'LHR', departureTime: '2026-03-24T23:00:00Z', arrivalTime: '2026-03-25T06:00:00Z', aircraftId: 'ac-026', estimatedRevenue: 600000, passengerCount: 290 },
  { id: flt(24, 51), flightNumber: 'SKY1910', origin: 'SIN', destination: 'LAX', departureTime: '2026-03-24T13:00:00Z', arrivalTime: '2026-03-24T10:00:00Z', aircraftId: 'ac-027', estimatedRevenue: 720000, passengerCount: 345 },
  { id: flt(24, 52), flightNumber: 'SKY2010', origin: 'LHR', destination: 'SIN', departureTime: '2026-03-24T22:00:00Z', arrivalTime: '2026-03-25T16:00:00Z', aircraftId: 'ac-029', estimatedRevenue: 590000, passengerCount: 300 },
  { id: flt(24, 53), flightNumber: 'SKY2020', origin: 'ORD', destination: 'LHR', departureTime: '2026-03-24T18:00:00Z', arrivalTime: '2026-03-25T07:30:00Z', aircraftId: 'ac-030', estimatedRevenue: 480000, passengerCount: 280 },
];

// Day 3: 2026-03-25
const day3: ScheduledFlight[] = [
  // Narrowbody rotations (condensed for Day 3)
  { id: flt(25, 1), flightNumber: 'SKY101', origin: 'ORD', destination: 'DFW', departureTime: '2026-03-25T07:00:00Z', arrivalTime: '2026-03-25T09:15:00Z', aircraftId: 'ac-001', estimatedRevenue: 108000, passengerCount: 150 },
  { id: flt(25, 2), flightNumber: 'SKY102', origin: 'DFW', destination: 'ORD', departureTime: '2026-03-25T12:00:00Z', arrivalTime: '2026-03-25T14:30:00Z', aircraftId: 'ac-001', estimatedRevenue: 105000, passengerCount: 148 },
  { id: flt(25, 3), flightNumber: 'SKY103', origin: 'ORD', destination: 'LAX', departureTime: '2026-03-25T17:00:00Z', arrivalTime: '2026-03-25T19:30:00Z', aircraftId: 'ac-001', estimatedRevenue: 135000, passengerCount: 162 },
  { id: flt(25, 4), flightNumber: 'SKY204', origin: 'MIA', destination: 'DFW', departureTime: '2026-03-25T07:30:00Z', arrivalTime: '2026-03-25T10:00:00Z', aircraftId: 'ac-002', estimatedRevenue: 110000, passengerCount: 150 },
  { id: flt(25, 5), flightNumber: 'SKY205', origin: 'DFW', destination: 'JFK', departureTime: '2026-03-25T13:00:00Z', arrivalTime: '2026-03-25T17:00:00Z', aircraftId: 'ac-002', estimatedRevenue: 128000, passengerCount: 158 },
  { id: flt(25, 6), flightNumber: 'SKY310', origin: 'ORD', destination: 'MIA', departureTime: '2026-03-25T08:00:00Z', arrivalTime: '2026-03-25T11:30:00Z', aircraftId: 'ac-003', estimatedRevenue: 125000, passengerCount: 160 },
  { id: flt(25, 7), flightNumber: 'SKY311', origin: 'MIA', destination: 'ORD', departureTime: '2026-03-25T14:00:00Z', arrivalTime: '2026-03-25T17:30:00Z', aircraftId: 'ac-003', estimatedRevenue: 122000, passengerCount: 155 },
  { id: flt(25, 8), flightNumber: 'SKY415', origin: 'ORD', destination: 'ATL', departureTime: '2026-03-25T07:30:00Z', arrivalTime: '2026-03-25T10:00:00Z', aircraftId: 'ac-004', estimatedRevenue: 105000, passengerCount: 148 },
  { id: flt(25, 9), flightNumber: 'SKY416', origin: 'ATL', destination: 'ORD', departureTime: '2026-03-25T13:00:00Z', arrivalTime: '2026-03-25T15:00:00Z', aircraftId: 'ac-004', estimatedRevenue: 100000, passengerCount: 142 },
  { id: flt(25, 10), flightNumber: 'SKY417', origin: 'ORD', destination: 'DFW', departureTime: '2026-03-25T17:30:00Z', arrivalTime: '2026-03-25T19:45:00Z', aircraftId: 'ac-004', estimatedRevenue: 102000, passengerCount: 145 },
  // N73805 AOG flights
  { id: flt(25, 11), flightNumber: 'SKY510', origin: 'ORD', destination: 'BOS', departureTime: '2026-03-25T08:00:00Z', arrivalTime: '2026-03-25T11:00:00Z', aircraftId: 'ac-005', estimatedRevenue: 118000, passengerCount: 155 },
  { id: flt(25, 12), flightNumber: 'SKY511', origin: 'BOS', destination: 'ORD', departureTime: '2026-03-25T14:00:00Z', arrivalTime: '2026-03-25T16:30:00Z', aircraftId: 'ac-005', estimatedRevenue: 115000, passengerCount: 150 },
  { id: flt(25, 13), flightNumber: 'SKY620', origin: 'ORD', destination: 'LAX', departureTime: '2026-03-25T08:30:00Z', arrivalTime: '2026-03-25T11:00:00Z', aircraftId: 'ac-006', estimatedRevenue: 130000, passengerCount: 158 },
  { id: flt(25, 14), flightNumber: 'SKY621', origin: 'LAX', destination: 'SFO', departureTime: '2026-03-25T13:30:00Z', arrivalTime: '2026-03-25T14:45:00Z', aircraftId: 'ac-006', estimatedRevenue: 80000, passengerCount: 130 },
  { id: flt(25, 15), flightNumber: 'SKY522', origin: 'DEN', destination: 'ORD', departureTime: '2026-03-25T07:00:00Z', arrivalTime: '2026-03-25T10:30:00Z', aircraftId: 'ac-007', estimatedRevenue: 95000, passengerCount: 145 },
  { id: flt(25, 16), flightNumber: 'SKY523', origin: 'ORD', destination: 'DEN', departureTime: '2026-03-25T13:00:00Z', arrivalTime: '2026-03-25T14:45:00Z', aircraftId: 'ac-007', estimatedRevenue: 92000, passengerCount: 142 },
  { id: flt(25, 17), flightNumber: 'SKY524', origin: 'DEN', destination: 'DFW', departureTime: '2026-03-25T17:30:00Z', arrivalTime: '2026-03-25T20:30:00Z', aircraftId: 'ac-007', estimatedRevenue: 100000, passengerCount: 148 },

  // MAX 8 day 3
  { id: flt(25, 18), flightNumber: 'SKY630', origin: 'DFW', destination: 'ORD', departureTime: '2026-03-25T07:00:00Z', arrivalTime: '2026-03-25T09:30:00Z', aircraftId: 'ac-009', estimatedRevenue: 108000, passengerCount: 150 },
  { id: flt(25, 19), flightNumber: 'SKY631', origin: 'ORD', destination: 'DFW', departureTime: '2026-03-25T12:00:00Z', arrivalTime: '2026-03-25T14:30:00Z', aircraftId: 'ac-009', estimatedRevenue: 105000, passengerCount: 148 },
  { id: flt(25, 20), flightNumber: 'SKY718', origin: 'DFW', destination: 'MIA', departureTime: '2026-03-25T07:30:00Z', arrivalTime: '2026-03-25T11:00:00Z', aircraftId: 'ac-010', estimatedRevenue: 115000, passengerCount: 155 },
  { id: flt(25, 21), flightNumber: 'SKY719', origin: 'MIA', destination: 'ATL', departureTime: '2026-03-25T13:30:00Z', arrivalTime: '2026-03-25T15:00:00Z', aircraftId: 'ac-010', estimatedRevenue: 88000, passengerCount: 138 },
  { id: flt(25, 22), flightNumber: 'SKY825', origin: 'ORD', destination: 'JFK', departureTime: '2026-03-25T08:00:00Z', arrivalTime: '2026-03-25T11:00:00Z', aircraftId: 'ac-011', estimatedRevenue: 120000, passengerCount: 155 },
  { id: flt(25, 23), flightNumber: 'SKY826', origin: 'JFK', destination: 'ORD', departureTime: '2026-03-25T14:00:00Z', arrivalTime: '2026-03-25T16:30:00Z', aircraftId: 'ac-011', estimatedRevenue: 118000, passengerCount: 152 },
  { id: flt(25, 24), flightNumber: 'SKY830', origin: 'ORD', destination: 'MSP', departureTime: '2026-03-25T08:00:00Z', arrivalTime: '2026-03-25T09:15:00Z', aircraftId: 'ac-012', estimatedRevenue: 82000, passengerCount: 135 },
  { id: flt(25, 25), flightNumber: 'SKY831', origin: 'MSP', destination: 'ORD', departureTime: '2026-03-25T12:00:00Z', arrivalTime: '2026-03-25T13:30:00Z', aircraftId: 'ac-012', estimatedRevenue: 80000, passengerCount: 132 },

  // A320neo day 3
  { id: flt(25, 26), flightNumber: 'SKY901', origin: 'ORD', destination: 'LAX', departureTime: '2026-03-25T07:00:00Z', arrivalTime: '2026-03-25T09:30:00Z', aircraftId: 'ac-013', estimatedRevenue: 130000, passengerCount: 158 },
  { id: flt(25, 27), flightNumber: 'SKY902', origin: 'LAX', destination: 'ORD', departureTime: '2026-03-25T12:30:00Z', arrivalTime: '2026-03-25T18:00:00Z', aircraftId: 'ac-013', estimatedRevenue: 128000, passengerCount: 155 },
  { id: flt(25, 28), flightNumber: 'SKY1015', origin: 'DFW', destination: 'ORD', departureTime: '2026-03-25T07:30:00Z', arrivalTime: '2026-03-25T10:00:00Z', aircraftId: 'ac-014', estimatedRevenue: 108000, passengerCount: 148 },
  { id: flt(25, 29), flightNumber: 'SKY1016', origin: 'ORD', destination: 'DFW', departureTime: '2026-03-25T13:00:00Z', arrivalTime: '2026-03-25T15:30:00Z', aircraftId: 'ac-014', estimatedRevenue: 105000, passengerCount: 145 },
  // N320A3 AOG flights
  { id: flt(25, 30), flightNumber: 'SKY1110', origin: 'LAX', destination: 'ORD', departureTime: '2026-03-25T08:00:00Z', arrivalTime: '2026-03-25T13:30:00Z', aircraftId: 'ac-015', estimatedRevenue: 128000, passengerCount: 155 },
  { id: flt(25, 31), flightNumber: 'SKY1111', origin: 'ORD', destination: 'LAX', departureTime: '2026-03-25T16:00:00Z', arrivalTime: '2026-03-25T18:30:00Z', aircraftId: 'ac-015', estimatedRevenue: 130000, passengerCount: 158 },
  { id: flt(25, 32), flightNumber: 'SKY1120', origin: 'ORD', destination: 'DFW', departureTime: '2026-03-25T08:00:00Z', arrivalTime: '2026-03-25T10:15:00Z', aircraftId: 'ac-016', estimatedRevenue: 105000, passengerCount: 148 },
  { id: flt(25, 33), flightNumber: 'SKY1121', origin: 'DFW', destination: 'ORD', departureTime: '2026-03-25T13:00:00Z', arrivalTime: '2026-03-25T15:30:00Z', aircraftId: 'ac-016', estimatedRevenue: 102000, passengerCount: 145 },
  { id: flt(25, 34), flightNumber: 'SKY1230', origin: 'ORD', destination: 'ATL', departureTime: '2026-03-25T08:30:00Z', arrivalTime: '2026-03-25T11:00:00Z', aircraftId: 'ac-017', estimatedRevenue: 108000, passengerCount: 150 },
  { id: flt(25, 35), flightNumber: 'SKY1231', origin: 'ATL', destination: 'ORD', departureTime: '2026-03-25T13:30:00Z', arrivalTime: '2026-03-25T15:30:00Z', aircraftId: 'ac-017', estimatedRevenue: 105000, passengerCount: 148 },
  { id: flt(25, 36), flightNumber: 'SKY1135', origin: 'DFW', destination: 'MIA', departureTime: '2026-03-25T08:00:00Z', arrivalTime: '2026-03-25T11:30:00Z', aircraftId: 'ac-018', estimatedRevenue: 112000, passengerCount: 152 },
  { id: flt(25, 37), flightNumber: 'SKY1136', origin: 'MIA', destination: 'DFW', departureTime: '2026-03-25T14:00:00Z', arrivalTime: '2026-03-25T16:30:00Z', aircraftId: 'ac-018', estimatedRevenue: 108000, passengerCount: 148 },

  // A321neo day 3
  { id: flt(25, 38), flightNumber: 'SKY1340', origin: 'JFK', destination: 'MIA', departureTime: '2026-03-25T07:30:00Z', arrivalTime: '2026-03-25T10:30:00Z', aircraftId: 'ac-019', estimatedRevenue: 138000, passengerCount: 192 },
  { id: flt(25, 39), flightNumber: 'SKY1341', origin: 'MIA', destination: 'JFK', departureTime: '2026-03-25T13:30:00Z', arrivalTime: '2026-03-25T16:30:00Z', aircraftId: 'ac-019', estimatedRevenue: 135000, passengerCount: 190 },
  { id: flt(25, 40), flightNumber: 'SKY1445', origin: 'SFO', destination: 'LAX', departureTime: '2026-03-25T08:00:00Z', arrivalTime: '2026-03-25T09:15:00Z', aircraftId: 'ac-020', estimatedRevenue: 88000, passengerCount: 172 },
  { id: flt(25, 41), flightNumber: 'SKY1446', origin: 'LAX', destination: 'JFK', departureTime: '2026-03-25T12:00:00Z', arrivalTime: '2026-03-25T20:00:00Z', aircraftId: 'ac-020', estimatedRevenue: 148000, passengerCount: 198 },
  { id: flt(25, 42), flightNumber: 'SKY1550', origin: 'DFW', destination: 'ORD', departureTime: '2026-03-25T07:00:00Z', arrivalTime: '2026-03-25T09:30:00Z', aircraftId: 'ac-022', estimatedRevenue: 110000, passengerCount: 185 },
  { id: flt(25, 43), flightNumber: 'SKY1551', origin: 'ORD', destination: 'DFW', departureTime: '2026-03-25T12:30:00Z', arrivalTime: '2026-03-25T15:00:00Z', aircraftId: 'ac-022', estimatedRevenue: 108000, passengerCount: 182 },

  // Widebody day 3
  { id: flt(25, 44), flightNumber: 'SKY1601', origin: 'ORD', destination: 'LHR', departureTime: '2026-03-25T17:30:00Z', arrivalTime: '2026-03-26T07:00:00Z', aircraftId: 'ac-023', estimatedRevenue: 485000, passengerCount: 282 },
  { id: flt(25, 45), flightNumber: 'SKY1705', origin: 'JFK', destination: 'LHR', departureTime: '2026-03-25T19:30:00Z', arrivalTime: '2026-03-26T07:00:00Z', aircraftId: 'ac-024', estimatedRevenue: 510000, passengerCount: 288 },
  { id: flt(25, 46), flightNumber: 'SKY1808', origin: 'LHR', destination: 'ORD', departureTime: '2026-03-25T10:00:00Z', arrivalTime: '2026-03-25T13:30:00Z', aircraftId: 'ac-025', estimatedRevenue: 465000, passengerCount: 272 },
  { id: flt(25, 47), flightNumber: 'SKY1820', origin: 'LHR', destination: 'SIN', departureTime: '2026-03-25T22:00:00Z', arrivalTime: '2026-03-26T16:00:00Z', aircraftId: 'ac-026', estimatedRevenue: 610000, passengerCount: 292 },
  { id: flt(25, 48), flightNumber: 'SKY1910', origin: 'LAX', destination: 'SIN', departureTime: '2026-03-25T01:00:00Z', arrivalTime: '2026-03-26T08:00:00Z', aircraftId: 'ac-027', estimatedRevenue: 740000, passengerCount: 348 },
  { id: flt(25, 49), flightNumber: 'SKY2010', origin: 'SIN', destination: 'LHR', departureTime: '2026-03-25T23:00:00Z', arrivalTime: '2026-03-26T06:30:00Z', aircraftId: 'ac-029', estimatedRevenue: 575000, passengerCount: 298 },
  { id: flt(25, 50), flightNumber: 'SKY2020', origin: 'LHR', destination: 'ORD', departureTime: '2026-03-25T10:30:00Z', arrivalTime: '2026-03-25T14:00:00Z', aircraftId: 'ac-030', estimatedRevenue: 460000, passengerCount: 270 },
];

export const scheduledFlights: ScheduledFlight[] = [...day1, ...day2, ...day3];
