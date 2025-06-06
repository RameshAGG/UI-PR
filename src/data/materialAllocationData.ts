interface Material {
    materialId: number;
    materialName: string;
    materialNameId: string;
    status: string;
    materialPriority: string;
    requiredOn: string;
    qtyRequired: number;
    width: string;
    height: string;
}

export const selectedRow = {
    sNo: 1,
    reqId: "REQ001",
    siteId: "SITE1001",
    siteName: "Green Tower",
    location: "New York",
    dateOfReq: "2025-03-01",
    priority: "High",
    status: "Pending",
    towerName: "Alpha Tower",
    materialId: "MAT_REQ001",
    siteManagerName: "John Doe",
    siteManagerPhone: "+1 234-567-8901",
    materials: [
        {
            materialId: 1,
            materialName: "Steel Rods",
            materialNameId: "MAT001",
            status: "Available",
            materialPriority: "High",
            requiredOn: "2025-03-05",
            qtyRequired: 50,
            width: "10mm",
            height: "3m",
        },
        {
            materialId: 2,
            materialName: "Concrete Blocks",
            materialNameId: "MAT002",
            status: "Out of Stock",
            materialPriority: "Medium",
            requiredOn: "2025-03-07",
            qtyRequired: 200,
            width: "20cm",
            height: "40cm",
        },
    ],
};

// export const siteData = [
//     {
//         siteName: "Lake View Villas",
//         siteId: "ST009",
//         towerName: "Tower 1",
//         location: "Madhavaram, Chennai",
//         quantityAvailable: 20000,
//     },
//     {
//         siteName: "Lake View Villas",
//         siteId: "ST009",
//         towerName: "Tower 2",
//         location: "Madhavaram, Chennai",
//         quantityAvailable: 20000,
//     },
//     {
//         siteName: "Lake View Villas",
//         siteId: "ST009",
//         towerName: "Tower 3",
//         location: "Madhavaram, Chennai",
//         quantityAvailable: 20000,
//     },
//     {
//         siteName: "Lake View Villas",
//         siteId: "ST009",
//         towerName: "Tower 4",
//         location: "Madhavaram, Chennai",
//         quantityAvailable: 20000,
//     },
// ]; 

export const materialAvailableData = [
    // Inventory Data
    { name: "Inventory 1", location: "Sholinganallur, Chennai", quantityAvailable: 20000, type: "inventory" },
    { name: "Inventory 2", location: "Sholinganallur, Karnataka", quantityAvailable: 15000, type: "inventory" },

    // Site Data
    { siteName: "Lake View Villas", siteId: "ST009", towerName: "Tower 1", location: "Madhavaram, Chennai", quantityAvailable: 20000, type: "site" },
    { siteName: "Lake View Villas", siteId: "ST009", towerName: "Tower 2", location: "Madhavaram, Chennai", quantityAvailable: 20000, type: "site" },
];