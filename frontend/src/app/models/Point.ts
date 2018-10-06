export class Point {
  id: number;
  X_WGS84: number;
  Y_WGS84: number;
  X_local?: number;
  Y_local?: number;

  controlType?: string;
  controlClass?: string;
  catalog_number?: string;

  hAmsterdam?: number;
  hKronsztadt?: number;

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
  image?: string;
}

