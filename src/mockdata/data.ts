import { Site } from "../types/type";

export const sites: Site[] = [
  { siteName: "Mumbai Warehouse", siteId: "S001", location: "Mumbai" },
  {
    siteName: "Vadapalani Hub",
    siteId: "S002",
    location: "Vadapalani, Chennai",
  },
  { siteName: "Bangalore Central", siteId: "S003", location: "Bangalore" },
  { siteName: "Hyderabad Storage", siteId: "S004", location: "Hyderabad" },
  { siteName: "Pune Logistics", siteId: "S005", location: "Pune" },
];
export const towerData = {
  S001: [
    {
      towerId: "T001",
      towerName: "Tower A",
      shortName: "T-A",
      createdAt: "2024-02-01",
      status: "Active",
    },
    {
      towerId: "T002",
      towerName: "Tower B",
      shortName: "T-B",
      createdAt: "2024-01-15",
      status: "Inactive",
    },
    {
      towerId: "T003",
      towerName: "Tower C",
      shortName: "T-C",
      createdAt: "2023-11-20",
      status: "Active",
    },
  ],
  S002: [
    {
      towerId: "T008",
      towerName: "Tower X",
      shortName: "T-X",
      createdAt: "2023-12-10",
      status: "Active",
    },
    {
      towerId: "T009",
      towerName: "Tower Y",
      shortName: "T-Y",
      createdAt: "2023-11-05",
      status: "Inactive",
    },
  ],
  S003: [
    {
      towerId: "T015",
      towerName: "Tower Alpha",
      shortName: "T-Alpha",
      createdAt: "2024-01-10",
      status: "Active",
    },
    {
      towerId: "T016",
      towerName: "Tower Beta",
      shortName: "T-Beta",
      createdAt: "2023-12-15",
      status: "Inactive",
    },
  ],
};
