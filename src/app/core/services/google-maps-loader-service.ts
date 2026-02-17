import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import * as countries from "i18n-iso-countries";
import frLocale from "i18n-iso-countries/langs/fr.json";

countries.registerLocale(frLocale);

@Injectable({
  providedIn: 'root',
})
export class GoogleMapsLoaderService {


  private loaded = false;
  private loading!: Promise<void>;
  googleMapsApiKey = environment.googleMapsApiKey;


  load(): Promise<void> {
    if (this.loaded) return Promise.resolve();

    if (this.loading) return this.loading;

    this.loading = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src =
        'https://maps.googleapis.com/maps/api/js' +
        `?key=${this.googleMapsApiKey}&libraries=places`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        this.loaded = true;
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });

    return this.loading;

  }


  getIso2FromCountryName(countryName: string | null): string | null {
    if (!countryName) return null;
    return countries.getAlpha2Code(countryName, "fr") || null;
  }


  parseAddress(fullAdress: string){
    if(!fullAdress){
      return {
        line1: null,
        city: null,
        country: null,
        postal_code: null,
        state: null,
        line2: null,
      };
    }

    const parts = fullAdress.split(',').map(p => p.trim());

    const street = parts[0] || null;
    const cityPart = parts[1] || null;
    const countryLabel = parts[2] || null;

    const iso2 = this.getIso2FromCountryName(countryLabel);

    return {
      line1: street,
      line2: null,
      city: cityPart,
      postal_code: null,
      state: null,
      country: iso2,
      country_label: countryLabel
    }
  }
}
