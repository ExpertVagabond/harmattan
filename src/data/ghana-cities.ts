import type { CityData } from "../lib/types";

export const GHANA_CITIES: CityData[] = [
  {
    city: "Accra",
    lat: 5.6037,
    lng: -0.187,
    stations: [
      {
        id: "accra-central",
        name: "Accra Central",
        city: "Accra",
        lat: 5.55,
        lng: -0.2,
        source: "openaq",
      },
      {
        id: "accra-east-legon",
        name: "East Legon",
        city: "Accra",
        lat: 5.635,
        lng: -0.157,
        source: "openaq",
      },
      {
        id: "accra-kaneshie",
        name: "Kaneshie",
        city: "Accra",
        lat: 5.571,
        lng: -0.239,
        source: "waqi",
      },
    ],
  },
  {
    city: "Kumasi",
    lat: 6.6885,
    lng: -1.6244,
    stations: [
      {
        id: "kumasi-central",
        name: "Kumasi Central",
        city: "Kumasi",
        lat: 6.688,
        lng: -1.624,
        source: "openaq",
      },
      {
        id: "kumasi-knust",
        name: "KNUST Campus",
        city: "Kumasi",
        lat: 6.674,
        lng: -1.572,
        source: "waqi",
      },
    ],
  },
  {
    city: "Tema",
    lat: 5.6698,
    lng: -0.0166,
    stations: [
      {
        id: "tema-industrial",
        name: "Tema Industrial Area",
        city: "Tema",
        lat: 5.642,
        lng: -0.005,
        source: "openaq",
      },
      {
        id: "tema-harbour",
        name: "Tema Harbour",
        city: "Tema",
        lat: 5.629,
        lng: 0.009,
        source: "waqi",
      },
    ],
  },
  {
    city: "Takoradi",
    lat: 4.8986,
    lng: -1.76,
    stations: [
      {
        id: "takoradi-port",
        name: "Takoradi Port Area",
        city: "Takoradi",
        lat: 4.89,
        lng: -1.75,
        source: "openaq",
      },
    ],
  },
  {
    city: "Tamale",
    lat: 9.4008,
    lng: -0.8393,
    stations: [
      {
        id: "tamale-central",
        name: "Tamale Central",
        city: "Tamale",
        lat: 9.4,
        lng: -0.84,
        source: "waqi",
      },
    ],
  },
  {
    city: "Cape Coast",
    lat: 5.1036,
    lng: -1.2466,
    stations: [
      {
        id: "cape-coast-ucc",
        name: "UCC Campus",
        city: "Cape Coast",
        lat: 5.115,
        lng: -1.293,
        source: "waqi",
      },
    ],
  },
];
