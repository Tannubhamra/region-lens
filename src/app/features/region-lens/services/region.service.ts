import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IRegionLens } from "../interfaces/region.interface";

@Injectable({
    providedIn: 'root',
  })

export class RegionService {
    private apiUrl = 'assets/api/population.json';
    private http = inject(HttpClient);

    getRegions(): Observable<IRegionLens>{
        return this.http.get<IRegionLens>(this.apiUrl);
    }

}