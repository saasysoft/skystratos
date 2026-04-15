/**
 * Data-level translation layer for mock data strings.
 * Maps English data values to zh-TW equivalents.
 * Usage: td(value) in components — returns translated string if zh-TW, original if en.
 */
import type { Locale } from './context';

// ── Status / Category / Priority / CheckType maps ───────────────────

const statusMap: Record<string, string> = {
  'Overdue': '逾期',
  'Completed': '已完成',
  'In Progress': '進行中',
  'Scheduled': '已排程',
  'In Flight': '飛行中',
  'On Ground': '地面待命',
  'In Maintenance': '維修中',
  'AOG': '停飛 (AOG)',
  'Emergency Order': '緊急訂單',
  'Pending Approval': '待核准',
  'Delivered': '已交付',
  'Shipped': '已出貨',
  'Ordered': '已下單',
  'Out of Stock': '缺貨',
  'Low Stock': '低庫存',
  'In Stock': '庫存充足',
  'active': '啟用中',
};

const categoryMap: Record<string, string> = {
  'Engines': '引擎',
  'Airframe': '機身',
  'Avionics': '航電',
  'Landing Gear': '起落架',
  'Flight Controls': '飛行控制',
  'Hydraulics': '液壓',
  'Pressurization': '增壓',
  'Electrical': '電氣',
  'APU': 'APU',
  'Interiors': '內裝',
  'Engine Parts': '引擎零件',
  'Avionics LRUs': '航電 LRU',
  'Rotables': '可翻修件',
  'Expendables': '消耗件',
  'Consumables': '耗材',
  'Safety Equipment': '安全設備',
  'Cabin Parts': '客艙零件',
  'Tooling': '工具',
};

const priorityMap: Record<string, string> = {
  'Critical': '危急',
  'High': '高',
  'Medium': '中',
  'Low': '低',
};

const checkTypeMap: Record<string, string> = {
  'Engine Shop Visit': '引擎進廠維修',
  'AD Compliance': 'AD 合規',
  'Service Bulletin': '服務通報',
  'C-Check': 'C 檢',
  'A-Check': 'A 檢',
  'B-Check': 'B 檢',
  'Landing Gear Overhaul': '起落架翻修',
  'Line Check': '航線檢查',
};

const triggerMap: Record<string, string> = {
  'condition': '狀況',
  'calendar': '日曆',
  'cycles': '起降次數',
  'ad_mandate': 'AD 強制',
  'flight_hours': '飛行時數',
};

const severityMap: Record<string, string> = {
  'critical': '危急',
  'high': '高',
  'medium': '中',
  'low': '低',
};

const locationMap: Record<string, string> = {
  'ORD MRO Hub': 'ORD 維修中心',
  'LAX Parts Depot': 'LAX 零件倉庫',
  'LHR Stores': 'LHR 倉儲',
  'SIN MRO Center': 'SIN 維修中心',
  'DFW Warehouse': 'DFW 倉庫',
  'ORD Line Maintenance': 'ORD 航線維修',
  'LAX MRO Center': 'LAX 維修中心',
  'DFW Heavy Maintenance': 'DFW 重維修',
  'SIN MRO Hub': 'SIN 維修中心',
  'LHR Line Maintenance': 'LHR 航線維修',
};

const causeMap: Record<string, string> = {
  'Maintenance': '維修',
  'Parts/Inventory': '零件/庫存',
  'Weather': '天氣',
  'Crew': '機組',
  'Other': '其他',
};

// ── MEL descriptions ────────────────────────────────────────────────

const melDescMap: Record<string, string> = {
  'Hydraulic system B quantity indication failed. System pressure normal, gauge inoperative.': '液壓系統 B 油量指示失效。系統壓力正常，表頭無法運作。',
  'APU fire detection loop B inoperative. Loop A operational.': 'APU 火災偵測迴路 B 失效。迴路 A 正常運作。',
  'Radio altimeter #2 inoperative. #1 system operational.': '無線電高度計 #2 失效。#1 系統正常運作。',
  'Standby AC bus tie relay intermittent. Main bus ties normal.': '備用交流匯流排聯絡繼電器間歇性故障。主匯流排聯絡正常。',
  'Pack 2 flow control valve slow to respond. Pack operates but with delayed modulation.': '組件 2 流量控制閥反應遲緩。組件運作但調節延遲。',
  'Nose wheel steering indication amber on ground. Steering functional.': '鼻輪轉向指示在地面顯示琥珀色。轉向功能正常。',
  'Autothrottle disconnect on engagement above FL350. Manual throttle control normal.': '自動油門在 FL350 以上接合時斷開。手動油門控制正常。',
  'APU bleed air output reduced. Ground air conditioning capability degraded.': 'APU 引氣輸出降低。地面空調能力下降。',
  'Weather radar tilt mechanism sluggish. Manual tilt functional with effort.': '氣象雷達傾斜機構遲緩。手動傾斜需費力操作但可用。',
  'Hydraulic system A pressure fluctuating 2800-3100 PSI. Within dispatch limits but anomalous.': '液壓系統 A 壓力在 2800-3100 PSI 間波動。在派遣限制內但異常。',
  'Zone 3 trim air valve failed closed. Zone temperature controlled by pack output only.': '第 3 區調節空氣閥故障關閉。區域溫度僅由組件輸出控制。',
  'Right generator control unit intermittent BITE fault. Generator output normal.': '右發電機控制單元間歇性 BITE 故障。發電機輸出正常。',
  'FD pitch bar intermittent drop-out on Captain side. FO instruments normal.': '機長側飛行指引俯仰桿間歇性消失。副駕駛儀表正常。',
  'Left main gear brake temperature indication intermittent. Brakes functional.': '左主起落架煞車溫度指示間歇性。煞車功能正常。',
  'Recirculation fan #2 inoperative. #1 fan and packs normal.': '再循環風扇 #2 失效。#1 風扇和組件正常。',
  'APU oil pressure indication fluctuating in green band. APU operational.': 'APU 油壓指示在綠色範圍內波動。APU 可運作。',
  'GPS receiver #2 degraded accuracy. Position drift up to 0.1 NM noted.': 'GPS 接收器 #2 精度降低。位置漂移達 0.1 海里。',
  'Cargo compartment smoke detector zone 4 self-test failure. Adjacent zones operational.': '貨艙煙霧偵測器第 4 區自測失敗。相鄰區域正常運作。',
  'Standby hydraulic pump low-pressure light illuminates momentarily on ground. Pressure recovers.': '備用液壓泵低壓燈在地面瞬間亮起。壓力恢復。',
  'Autopilot altitude capture overshoots by 100-200 ft before correcting. VNAV capture normal.': '自動駕駛高度截獲超過 100-200 英尺後修正。VNAV 截獲正常。',
  'DME #2 interrogator intermittent. DME #1 and GPS position fully operational.': 'DME #2 詢答器間歇性故障。DME #1 和 GPS 定位完全正常。',
  'Galley bus 2 intermittent trip. Galley 2 ovens affected. Other galleys normal.': '廚房匯流排 2 間歇性跳脫。廚房 2 烤箱受影響。其他廚房正常。',
  'Lavatory 3 exhaust fan inoperative. Adjacent lavatory ventilation provides partial airflow.': '洗手間 3 排氣扇失效。相鄰洗手間通風提供部分氣流。',
  'ELT battery approaching expiry. ELT functional but battery due for replacement.': 'ELT 電池接近到期。ELT 功能正常但電池需更換。',
  'Passenger oxygen mask in row 22A deployment mechanism stiff. Manual release available.': '第 22A 排旅客氧氣面罩展開機構僵硬。手動釋放可用。',
};

// ── Maintenance descriptions ────────────────────────────────────────

const mxDescMap: Record<string, string> = {
  'Left engine bleed valve failure — AOG at ORD. Engine requires removal and shop visit for bleed air system overhaul.': '左引擎引氣閥故障 — 於 ORD 停飛。引擎需拆除並進廠翻修引氣系統。',
  'Flight Management Computer failure — AOG at LAX. FMC unit unserviceable, requires replacement and recertification.': '飛行管理電腦故障 — 於 LAX 停飛。FMC 單元無法使用，需更換並重新認證。',
  'CFM LEAP-1A combustion chamber hot section inspection — elevated EGT trend detected. Unscheduled borescope reveals combustion liner cracking.': 'CFM LEAP-1A 燃燒室熱段檢查 — 偵測到 EGT 趨勢升高。非計劃性內視鏡檢查發現燃燒室內襯裂紋。',
  'CFM LEAP-1A combustion chamber inspection — fleet-wide SB compliance. Similar EGT anomaly pattern as N320A1.': 'CFM LEAP-1A 燃燒室檢查 — 機隊範圍 SB 合規。與 N320A1 相似的 EGT 異常模式。',
  'C-Check overdue by 8 days. Full structural inspection, corrosion prevention, and systems check required.': 'C 檢逾期 8 天。需進行完整結構檢查、防腐蝕處理和系統檢查。',
  'Main landing gear overhaul overdue. Cycle limit exceeded by 240 cycles. Requires overhaul at next ground opportunity.': '主起落架翻修逾期。超過循環限制 240 次。需在下次地面機會進行翻修。',
  'Rudder PCU seal inspection per AD-2026-02-08. Overdue by 5 days.': '依 AD-2026-02-08 進行方向舵 PCU 密封檢查。逾期 5 天。',
  'Hydraulic system A pressure fluctuation. Line check to inspect hydraulic pump and relief valves.': '液壓系統 A 壓力波動。航線檢查以檢修液壓泵和洩壓閥。',
  'Cabin pressure controller software update per SB. Minor pressurization oscillation reported by flight crew.': '依 SB 更新客艙壓力控制器軟體。機組報告輕微增壓振盪。',
  'Generator control unit intermittent fault. Requires inspection and potential GCU replacement.': '發電機控制單元間歇性故障。需檢查並可能更換 GCU。',
  'Scheduled A-Check. Full systems inspection, fluid servicing, and component replacements per MPD.': '排定 A 檢。依 MPD 進行完整系統檢查、油液維護和組件更換。',
  'First A-Check for N38M01. Systems inspection and lubrication per Boeing MPD.': 'N38M01 首次 A 檢。依波音 MPD 進行系統檢查和潤滑。',
  'Scheduled A-Check per Airbus maintenance planning document.': '依空中巴士維修計劃文件排定 A 檢。',
};

// ── Procurement item names ──────────────────────────────────────────

const procItemMap: Record<string, string> = {
  'Main wheel brake assembly linings set': '主輪煞車總成襯片組',
  'IDG (Integrated Drive Generator) overhauled': 'IDG（整合驅動發電機）翻修品',
  'Hydraulic filter elements kit (A & B systems)': '液壓濾芯套件（A 和 B 系統）',
  'GE90-115B HPT stage 1 blade set': 'GE90-115B 高壓渦輪第 1 級葉片組',
  'GE90-115B combustion liner panels': 'GE90-115B 燃燒室內襯板',
  'Main landing gear shock strut assembly overhauled': '主起落架減震支柱總成翻修品',
  'Cabin air HEPA filter set (full aircraft)': '客艙 HEPA 過濾器組（全機）',
  'Spoiler actuator assembly': '擾流板作動器總成',
  'Trent XWB fan blade individual replacement': 'Trent XWB 風扇葉片單片更換',
  'Generator Control Unit replacement': '發電機控制單元更換',
  'Engine oil filter kit CFM56-7B': 'CFM56-7B 引擎機油濾芯套件',
  'Oxygen generator canisters (set of 40)': '氧氣產生器罐（40 組）',
  'Weather radar transceiver unit': '氣象雷達收發器單元',
  'Elevator feel computer modified unit': '升降舵力感電腦改裝單元',
  'Battery monitoring unit (BMU) upgraded': '電池監控單元（BMU）升級版',
  'Seat track rollers and bearings set (20 rows)': '座椅滑軌滾輪和軸承組（20 排）',
  'LEAP-1A combustion liner segment': 'LEAP-1A 燃燒室內襯段',
  'Lavatory exhaust fan motor assembly': '洗手間排氣扇馬達總成',
  'Nose wheel steering damper': '鼻輪轉向阻尼器',
  'Inertial Reference Unit (IRU)': '慣性參考單元（IRU）',
  'Flight Director Computer #1': '飛行指引電腦 #1',
  'Hydraulic fluid MIL-PRF-83282 (55 gal drum)': '液壓油 MIL-PRF-83282（55 加侖桶）',
  'Hydraulic pump inlet filter set': '液壓泵進口濾芯組',
  'Life raft overhaul service (2 units)': '救生筏翻修服務（2 組）',
  'Engine oil Mobil Jet Oil II (case of 24 qt)': '引擎油 Mobil Jet Oil II（24 夸脫裝）',
  'APU igniter assembly': 'APU 點火器總成',
  'Main tire assembly (set of 4)': '主輪胎總成（4 組）',
  'Galley coffee maker replacement unit': '廚房咖啡機更換單元',
  'C-Check NDT inspection tooling rental': 'C 檢非破壞性檢測工具租賃',
  'Hydraulic pump assembly system A': '液壓泵總成系統 A',
  'GPS receiver unit #2': 'GPS 接收器單元 #2',
  'Cargo smoke detector zone 4 assembly': '貨艙煙霧偵測器第 4 區總成',
  'Flight control computer channel B': '飛行控制電腦通道 B',
  'ELT battery pack replacement': 'ELT 電池組更換',
  'CFM56-7B engine bleed valve assembly (AOG)': 'CFM56-7B 引擎引氣閥總成（AOG）',
  'Engine bleed system gasket and seal kit (AOG)': '引擎引氣系統墊片和密封套件（AOG）',
  'Flight Management Computer unit (AOG)': '飛行管理電腦單元（AOG）',
  'FMC software load media and certification docs (AOG)': 'FMC 軟體載入媒體和認證文件（AOG）',
  'LEAP-1A combustion chamber liner emergency stock': 'LEAP-1A 燃燒室內襯緊急庫存',
  'LEAP-1A borescope inspection tooling (expedited)': 'LEAP-1A 內視鏡檢查工具（加急）',
  'MLG side brace assembly (expedited overhaul)': '主起落架側撐總成（加急翻修）',
  'LEAP-1A engine hot section repair kit': 'LEAP-1A 引擎熱段修復套件',
  'C-Check consumables kit (sealant, lockwire, cotter pins)': 'C 檢耗材套件（密封膠、保險絲、開口銷）',
  'GE90-115B HPT nozzle guide vane set (expedited)': 'GE90-115B 高壓渦輪導向葉片組（加急）',
  'Engine bleed system test rig rental (AOG)': '引擎引氣系統測試台租賃（AOG）',
  'Radio altimeter transceiver #2 (AOG loan)': '無線電高度計收發器 #2（AOG 借調）',
  'Trim air modulating valve (expedited)': '調節空氣調變閥（加急）',
  'Nose wheel steering position sensor (expedited)': '鼻輪轉向位置感測器（加急）',
  'AOG maintenance crew travel and accommodation': 'AOG 維修人員差旅和住宿',
};

// ── Alert titles ────────────────────────────────────────────────────

const alertTitleMap: Record<string, string> = {
  'AOG: N73805 — Engine Bleed Valve Failure': 'AOG：N73805 — 引擎引氣閥故障',
  'AOG: N320A3 — Flight Management Computer Failure': 'AOG：N320A3 — 飛行管理電腦故障',
  'MEL Expiry Warning: N73805 — 4 Active Items': 'MEL 到期警告：N73805 — 4 項啟用中',
  'MEL Expiry Imminent: N321A1 Weather Radar & N320A3 APU': 'MEL 即將到期：N321A1 氣象雷達和 N320A3 APU',
  'Fleet Pattern: A320neo LEAP-1A Combustion Chamber Issue': '機隊異常模式：A320neo LEAP-1A 燃燒室問題',
  'Overdue C-Check: N77701 (B777-300ER)': 'C 檢逾期：N77701（B777-300ER）',
  'Critical Stock: LEAP-1A Combustion Liners Below Minimum': '庫存危急：LEAP-1A 燃燒室內襯低於最低量',
  'Out of Stock: Flight Director Computer #1 at ORD': '缺貨：ORD 飛行指引電腦 #1',
  'Budget Overrun: Fleet Costs $6.8M Over Budget (March)': '預算超支：機隊成本超出預算 $6.8M（三月）',
  'AOG Procurement Premium: $2.4M in Emergency Orders (March)': 'AOG 採購溢價：$2.4M 緊急訂單（三月）',
  'Heavy Check Upcoming: N77702 Engine Shop Visit at SIN': '即將重維修：N77702 引擎進廠維修於 SIN',
  'AD Compliance Due: Spoiler Actuator Inspection (A320 Fleet)': 'AD 合規到期：擾流板作動器檢查（A320 機隊）',
  'Scheduled: N73808 C-Check Progressing on Track': '排程中：N73808 C 檢按計劃進行',
  'Life Raft Overhaul Due: N78903 Units Approaching Interval': '救生筏翻修到期：N78903 接近翻修間隔',
  'Routine: 8 Aircraft Due for Line Check in Next 30 Days': '例行：8 架航空器在未來 30 天需航線檢查',
};

// ── Combined lookup ─────────────────────────────────────────────────

const allMaps = [
  statusMap, categoryMap, priorityMap, checkTypeMap, triggerMap,
  severityMap, locationMap, causeMap,
  melDescMap, mxDescMap, procItemMap, alertTitleMap,
];

// Build a single flat lookup for O(1) access
const flatMap: Record<string, string> = {};
for (const map of allMaps) {
  for (const [en, zhTW] of Object.entries(map)) {
    flatMap[en] = zhTW;
  }
}

/**
 * Translate a data value based on current locale.
 * Returns the original value for 'en', looks up zh-TW translation for 'zh-TW'.
 * Falls back to original if no translation exists.
 */
export function translateData(value: string, locale: Locale): string {
  if (locale === 'en') return value;
  return flatMap[value] ?? value;
}

/**
 * React hook version — call useDataTranslation() in a component,
 * then use td(value) to translate data strings.
 */
export { translateData as td };
