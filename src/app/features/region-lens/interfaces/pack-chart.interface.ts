export interface ITransformedCountry {
    name: string;
    population: number;
    area: number;
    result?: number; // toggle population or area
    wikipedia: string;
    flag: string;
  }
  
  export interface ITransformedSubRegion {
    name: string;
    children: ITransformedCountry[];
  }
  
  export interface ITransformedRegion {
    name: string;
    children: ITransformedSubRegion[];
  }
  
  export interface ITransformedData {
    name: string;
    children: ITransformedRegion[];
  }
  

  export interface IChartNode extends 
  d3.HierarchyNode<ITransformedData> {}

