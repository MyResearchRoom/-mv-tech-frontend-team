export const ROLES = [
  {
    id: "ADMIN",
    initials: "AD",
    label: "Admin",
    description: "System oversight & approvals",
    demoName: "Arjun Rao",
    demoEmail: "admin@mvtech.in",
  },
  {
    id: "ACCOUNT MANAGER",
    initials: "AM",
    label: "Account Manager",
    description: "Clients, projects & quotations",
    demoName: "Priya Nair",
    demoEmail: "accounts@mvtech.in",
  },
  {
    id: "DESIGN HEAD",
    initials: "RD",
    label: "R&D / Design Head",
    description: "Drawings, design & BOQ",
    demoName: "Vikram Shah",
    demoEmail: "design@mvtech.in",
  },
  {
    id: "INVENTORY MANAGER",
    initials: "IP",
    label: "Inventory Manager",
    description: "Vendors, purchasing & stock",
    demoName: "Sameer Khan",
    demoEmail: "procurement@mvtech.in",
  },
  {
    id: "PROJECT MANAGER",
    initials: "PM",
    label: "Project Manager",
    description: "Installation, inspection & handover",
    demoName: "Rohan Mehta",
    demoEmail: "projects@mvtech.in",
  },
  {
    id: "CLIENT MANAGER",
    initials: "CM",
    label: "Client Manager",
    description: "Client relationships & coordination",
    demoName: "Meera Joshi",
    demoEmail: "client@mvtech.in",
  },
];

export const getRoleById = (id) =>
  ROLES.find((r) => r.id === id) || ROLES[0];