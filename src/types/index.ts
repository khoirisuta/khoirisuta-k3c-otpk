export type ContainerSize = '20ft' | '40ft' | '45ft';
export type ContainerType = 'Dry' | 'Reefer' | 'Open Top' | 'Flat Rack' | 'Tank';
export type ContainerStatus = 'FCL' | 'LCL' | 'Empty';

export interface YardSlot {
  block: string;
  bay: number;
  row: number;
  tier: number;
}

export interface ContainerMaster {
  id: string;
  containerNo: string;
  size: ContainerSize;
  type: ContainerType;
  isoCode: string;
  tareWeightKg: number;
  maxGrossWeightKg: number;
  currentGrossWeightKg: number;
  shippingLine: string;
  status: ContainerStatus;
  yardSlot: YardSlot;
  dwellDays: number;
  sealNo: string;
  tempSetpoint?: number; // for reefer
  vesselName?: string;
  createdAt: string;
  updatedAt: string;
}

export type VesselStatus = 'Sailing' | 'Anchored' | 'Berthing' | 'Departed';

export interface VesselMaster {
  id: string;
  name: string;
  imoNo: string;
  callSign: string;
  lengthMeters: number;
  berthId: string;
  shippingAgent: string;
  eta: string;
  etd: string;
  status: VesselStatus;
  totalTeusPlanned: number;
  teusLoaded: number;
  teusDischarged: number;
  quayCraneAssigned: string[];
}

export interface YardBlockMaster {
  id: string;
  code: string;
  name: string;
  maxBays: number;
  maxRows: number;
  maxTiers: number;
  isReeferZone: boolean;
  totalCapacityTeus: number;
  currentOccupancyTeus: number;
  category: 'Import' | 'Export' | 'Domestic' | 'Empty' | 'Reefer';
}

export interface ShippingLineMaster {
  id: string;
  code: string;
  name: string;
  country: string;
  contactPerson: string;
  phone: string;
  email: string;
  colorHex: string;
}

export type GateInStatus = 'Completed' | 'Pending Inspection' | 'Rejected';

export interface GateInTransaction {
  id: string;
  eirNo: string; // Equipment Interchange Receipt
  timestamp: string;
  containerNo: string;
  size: ContainerSize;
  type: ContainerType;
  truckPlate: string;
  driverName: string;
  shippingLine: string;
  grossWeightKg: number;
  sealNo: string;
  allocatedSlot: string; // e.g. "BLK-A-03-02-1"
  gateLane: string;
  status: GateInStatus;
  notes?: string;
}

export type CustomsClearanceStatus = 'Clear' | 'Red Line Inspection' | 'Yellow Line' | 'Pending';

export interface GateOutTransaction {
  id: string;
  gatePassNo: string;
  timestamp: string;
  containerNo: string;
  doNumber: string; // Delivery Order
  sppbNumber: string; // Surat Persetujuan Pengeluaran Barang
  truckPlate: string;
  driverName: string;
  destination: string;
  shippingLine: string;
  customsStatus: CustomsClearanceStatus;
  status: 'Completed' | 'Pending Clearance';
  notes?: string;
}

export type StevedoringType = 'Discharge' | 'Loading';

export interface StevedoringTransaction {
  id: string;
  vesselId: string;
  vesselName: string;
  type: StevedoringType;
  containerNo: string;
  size: ContainerSize;
  craneId: string; // e.g. QC-01, QC-02
  rtgOperator: string;
  hatchBay: string;
  timestamp: string;
  status: 'Completed' | 'In Progress' | 'Scheduled';
}

export type DatabaseProvider = 'local' | 'supabase' | 'neon' | 'firebase';

export interface DatabaseConfig {
  activeProvider: DatabaseProvider;
  supabaseUrl: string;
  supabaseAnonKey: string;
  neonConnectionString: string;
  neonEndpoint: string;
  firebaseProjectId: string;
  firebaseApiKey: string;
  lastSyncTime: string | null;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  errorMessage?: string;
  isLiveConnected?: boolean;
}

export interface AuthUser {
  username: string;
  displayName: string;
  role: string;
  terminalCode: string;
  isLoggedIn: boolean;
}
