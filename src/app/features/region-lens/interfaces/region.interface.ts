
// A region like "Europe", "Asia", etc.
export interface IRegionLens {
  [regionName: string]: ISubRegion;
}
// A subregion like "Northern Europe" or "Southeast Asia"
export interface ISubRegion {
  [subregionName: string]: ICountry[];
}

export interface ICountry {
  country: string;
  population: number;
  wikipedia: string;
  flag: string;
  land_area_km2: number;
}
