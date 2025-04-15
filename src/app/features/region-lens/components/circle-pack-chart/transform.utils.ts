import { IRegionLens } from "../../interfaces/region.interface";
import { ITransformedCountry, ITransformedData, ITransformedRegion, ITransformedSubRegion } from "../../interfaces/pack-chart.interface";

export type ValueMode = 'population' | 'area';


export function transformRegionLensToPackData(
  regionLens: IRegionLens = {},
  mode: ValueMode
): ITransformedData {

    if (!regionLens) {
        throw new Error('regionLens is null or undefined');
      }

  const transformedRegions: ITransformedRegion[] = Object.entries(regionLens).map(
    ([regionName, subRegions]) => {
         // Ensure subRegions is valid
      if (!subRegions || typeof subRegions !== 'object') {
        throw new Error(`Invalid subRegions for region: ${regionName}`);
      }

      const transformedSubRegions: ITransformedSubRegion[] = Object.entries(subRegions).map(
        ([subRegionName, countries]) => {
            // Ensure countries is an array
          if (!Array.isArray(countries)) {
            throw new Error(`Invalid countries data for subRegion: ${subRegionName}`);
          }

          const transformedCountries: ITransformedCountry[] = countries.map((country) => ({
            name: country.country,
            population: country.population,
            area: country.land_area_km2,
            result: mode === 'population' ? country.population : country.land_area_km2, // this will toggle between popultion and land
            wikipedia: country.wikipedia,
            flag: country.flag
           
          }));
          return {
            name: subRegionName,
            children: transformedCountries
          };
        }
      );

      return {
        name: regionName,
        children: transformedSubRegions
      };
    }
  );

  return {
    name: 'World',
    children: transformedRegions
  };
}
