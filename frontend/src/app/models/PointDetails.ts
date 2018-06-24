export class PointDetails {
  X_WGS84?: number;
  Y_WGS84?: number;
  X_local?: number;
  Y_local?: number;

  controlType?: string;
  controlClass?: string;
  id?: string;

  hAmsterdam?: string;
  hKronsztadt?: string;

  country?: string;
  state?: string;
  district?: string;
  county?: string;

  locality?: string;
  city_district?: string;

  road?: string;
  house_number?: string;

  stabilization?: string;
  found?: boolean;
}

