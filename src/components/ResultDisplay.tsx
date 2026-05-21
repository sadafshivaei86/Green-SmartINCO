import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf, Info, Shield, Truck, Ship, Package, Globe, CheckCircle2, RefreshCcw, BarChart3, Binary, Download, LayoutGrid, ShieldCheck, Umbrella, Lock } from 'lucide-react';
import { INCOTERMS } from '../data/incoterms';

import LegalCompliance from './LegalCompliance';

interface ResultDisplayProps {
  code: string;
  onReset: () => void;
}

const STAGES = [
  { label: 'Origin Factory', icon: Package },
  { label: 'Inland Freight', icon: Truck },
  { label: 'Export Customs', icon: Globe },
  { label: 'Alongside Vessel', icon: Ship },
  { label: 'Main Carriage', icon: Ship },
  { label: 'Import Customs', icon: Binary },
  { label: 'Destination', icon: CheckCircle2 },
];

const getTransferIndices = (code: string) => {
  const mapping: Record<string, { risk: number; cost: number }> = {
    'EXW': { risk: 0, cost: 0 },
    'FCA': { risk: 1, cost: 1 },
    'FAS': { risk: 3, cost: 3 },
    'FOB': { risk: 3, cost: 3 },
    'CFR': { risk: 3, cost: 5 },
    'CIF': { risk: 3, cost: 5 },
    'CPT': { risk: 1, cost: 6 },
    'CIP': { risk: 1, cost: 6 },
    'DAP': { risk: 6, cost: 6 },
    'DPU': { risk: 6, cost: 6 },
    'DDP': { risk: 6, cost: 6 }
  };
  return mapping[code] || { risk: 0, cost: 0 };
};

interface GhgCsrdMetric {
  rating: string;
  ratingColor: string;
  doubleCountingRisk: 'Low' | 'Medium' | 'High' | 'Critical';
  operationalControl: string;
  sellerScope3Category: string;
  buyerScope3Category: string;
  csrdMateriality: string;
  esrsDisclosureRequired: string;
  auditActionSeller: string;
  auditActionBuyer: string;
  sellerRoleDetails: string;
  buyerRoleDetails: string;
  regulatoryStandard: string;
}

interface GreenerOption {
  code: string;
  reason: string;
  ghgVisibility: 'High' | 'Medium' | 'Low';
  csrdReadiness: 'High' | 'Medium' | 'Low';
  sellerControl: 'High' | 'Medium' | 'Low';
}

interface SplitGreenerSuggestion {
  buyerSuggestions: GreenerOption[];
  sellerSuggestions: GreenerOption[];
}

const getGreenerSuggestionsSeparate = (currentCode: string): SplitGreenerSuggestion => {
  const defaults: Record<string, { ghgVisibility: 'High' | 'Medium' | 'Low'; csrdReadiness: 'High' | 'Medium' | 'Low'; sellerControl: 'High' | 'Medium' | 'Low' }> = {
    'EXW': { ghgVisibility: 'High', csrdReadiness: 'Low', sellerControl: 'Low' },
    'FCA': { ghgVisibility: 'High', csrdReadiness: 'High', sellerControl: 'Low' },
    'FAS': { ghgVisibility: 'Medium', csrdReadiness: 'Medium', sellerControl: 'Low' },
    'FOB': { ghgVisibility: 'High', csrdReadiness: 'Medium', sellerControl: 'Low' },
    'CFR': { ghgVisibility: 'Low', csrdReadiness: 'Low', sellerControl: 'Medium' },
    'CIF': { ghgVisibility: 'Low', csrdReadiness: 'Low', sellerControl: 'Medium' },
    'CPT': { ghgVisibility: 'Medium', csrdReadiness: 'Medium', sellerControl: 'Medium' },
    'CIP': { ghgVisibility: 'Medium', csrdReadiness: 'Medium', sellerControl: 'Medium' },
    'DAP': { ghgVisibility: 'High', csrdReadiness: 'High', sellerControl: 'High' },
    'DPU': { ghgVisibility: 'High', csrdReadiness: 'High', sellerControl: 'High' },
    'DDP': { ghgVisibility: 'High', csrdReadiness: 'High', sellerControl: 'High' }
  };

  const getMetrics = (code: string) => defaults[code] || { ghgVisibility: 'Medium', csrdReadiness: 'Medium', sellerControl: 'Medium' };

  const buildOption = (code: string, reason: string): GreenerOption => ({
    code,
    reason,
    ...getMetrics(code)
  });

  const suggestions: Record<string, SplitGreenerSuggestion> = {
    'EXW': {
      buyerSuggestions: [
        buildOption('FCA', 'FCA is the closest matches; it transitions loaded origin handover to the carrier terminal, avoiding early drayage reporting gaps at the factory door.')
      ],
      sellerSuggestions: [
        buildOption('CPT', 'CPT is more operational; it enables you to arrange carrier consolidation, maximizing vehicle fill rates and reporting continuous pre-delivery transport metrics.')
      ]
    },
    'FCA': {
      buyerSuggestions: [
        buildOption('FOB', 'FOB is the key ocean equivalent; moving custody up on-board allows you to trace terminal loading crane electrical footprints and select precise eco-efficient ocean routes.')
      ],
      sellerSuggestions: [
        buildOption('CPT', 'CPT lets you consolidate carriage contracts directly, maximizing vehicle fill rates and reporting continuous pre-delivery transport metrics.')
      ]
    },
    'FAS': {
      buyerSuggestions: [
        buildOption('FOB', 'FOB is the closest ocean alternative; it moves custody up on-board, allowing you to trace port crane electrical usage and terminal load carbon factors.')
      ],
      sellerSuggestions: [
        buildOption('FCA', 'FCA is the closest intermodal option; it avoids complex port barge transfers by opting for inland terminal container handover, reducing drayage congestion emissions.')
      ]
    },
    'FOB': {
      buyerSuggestions: [
        buildOption('FCA', 'FCA gives you earlier inland terminal handover control, allowing you to streamline multimodal routing and optimize pre-carriage emissions directly.')
      ],
      sellerSuggestions: [
        buildOption('CFR', 'CFR lets you arrange ship bookings to negotiate directly with certified low-sulfur or bio-LNG powered ocean freight lines.')
      ]
    },
    'CFR': {
      buyerSuggestions: [
        buildOption('FOB', 'FOB returns direct carrier selection power to you, allowing you to mandate clean-fuel or wind-assisted vessels instead of remaining passive.')
      ],
      sellerSuggestions: [
        buildOption('CIF', 'CIF is the closest; it pairs ocean transit bookings with low-carbon maritime risk certificates and green-standard transit insurance.')
      ]
    },
    'CIF': {
      buyerSuggestions: [
        buildOption('FOB', 'FOB is the most direct control shift, letting you regain active carrier selection to mandate low-emission shipping lines.')
      ],
      sellerSuggestions: [
        buildOption('CIP', 'CIP is the closest; it modernizes sea transport splits into intermodal lanes and unifies supply chain tracking for continuous verification.')
      ]
    },
    'CPT': {
      buyerSuggestions: [
        buildOption('FCA', 'FCA returns direct carrier selection and routing rights to you, letting you implement zero-emission regional distribution.')
      ],
      sellerSuggestions: [
        buildOption('CIP', 'CIP is the closest; it adds verified transit insurance parameters to streamline regulatory audit compliance and risk reviews.')
      ]
    },
    'CIP': {
      buyerSuggestions: [
        buildOption('FCA', 'FCA returns complete logistics control to you, enabling you to select carbon-neutral transport providers directly.')
      ],
      sellerSuggestions: [
        buildOption('DAP', 'DAP is the closest; it extends your transport responsibilities to the destination gate to maximize cross-border logistical consolidation and reduce empty backhauls.')
      ]
    },
    'DAP': {
      buyerSuggestions: [
        buildOption('DPU', 'DPU is the closest; responsibility is expanded to unloading, allowing you to run and log your eco-compliant terminal cranes at destination.')
      ],
      sellerSuggestions: [
        buildOption('DDP', 'DDP is the closest; incorporates customs clearance and port duty filings directly, packaging total logistics tracking into one portal to streamline paperless green clearance.')
      ]
    },
    'DPU': {
      buyerSuggestions: [
        buildOption('DAP', 'DAP is the closest alternative; it returns unloading control to your own certified eco-efficient terminal handlers at the destination place.')
      ],
      sellerSuggestions: [
        buildOption('DDP', 'DDP is the closest; it integrates customs and port duty filing to streamline administrative paperwork, minimizing truck idling times during border delays.')
      ]
    },
    'DDP': {
      buyerSuggestions: [
        buildOption('FCA', 'FCA is the closest F-term alternative; it returns direct eco-friendly ocean and road carrier selection rights to you instead of complete logistics passivity.')
      ],
      sellerSuggestions: [
        buildOption('CIP', 'CIP is a collaborative shift; renegotiating to CIP allows you to share logistics responsibility and collaborate on carbon data systems with the buyer.')
      ]
    }
  };

  return suggestions[currentCode] || { buyerSuggestions: [], sellerSuggestions: [] };
};

const getGhgCsrdDetails = (code: string): GhgCsrdMetric => {
  const defaults: GhgCsrdMetric = {
    rating: "Split Boundary Allocation",
    ratingColor: "text-amber-800 border-amber-200 bg-amber-50 shadow-sm",
    doubleCountingRisk: "Medium",
    operationalControl: "Shared Transport Booking",
    sellerScope3Category: "Category 9: Downstream Transportation & Distribution",
    buyerScope3Category: "Category 4: Upstream Transportation & Distribution",
    csrdMateriality: "Requires detailed Scope 3 disclosures under ESRS E1 Climate Change mandates.",
    esrsDisclosureRequired: "Energy-related Scope 3 greenhouse gas emissions from third-party maritime, rail, or air logistics.",
    auditActionSeller: "Verify pre-carriage emissions up to point of delivery.",
    auditActionBuyer: "Acquire secondary emission factors for main transport leg.",
    sellerRoleDetails: "Responsible for reporting up to origin delivery point.",
    buyerRoleDetails: "Responsible for reporting international freight and onward delivery.",
    regulatoryStandard: "GHG Protocol (Dual Accounting) & CSRD (ESRS E1)"
  };

  const data: Record<string, GhgCsrdMetric> = {
    'EXW': {
      rating: "High Audit Imbalance",
      ratingColor: "text-red-800 border-red-200 bg-red-50 shadow-sm",
      doubleCountingRisk: "Low",
      operationalControl: "100% Buyer Financial Control",
      sellerScope3Category: "Scope 1 & 2 only (No transit emissions)",
      buyerScope3Category: "Category 4: Upstream (100% of International & Domestic Transit)",
      csrdMateriality: "Under ESRS E1, Buyer must report 100% of logistics emissions starting immediately from Seller's factory door. Seller has practically zero boundary responsibility for transit carbon.",
      esrsDisclosureRequired: "Scope 3 Category 4 (Upstream Transport) detailing all road, port and maritime transit from origin warehouse.",
      auditActionSeller: "Report only Scope 1 & 2 emissions associated with warehousing and loading at factory gate. No transit carbon liability on CSRD balance sheet.",
      auditActionBuyer: "Request gross cargo weights and packaging dimension data from Seller; compute transport footprint using actual carrier fuel/drayage logs.",
      sellerRoleDetails: "Only accounts for factory-door packaging and handling. Excludes any downstream transport.",
      buyerRoleDetails: "Assumes massive Scope 3 Category 4 footprint from the moment goods leave the factory.",
      regulatoryStandard: "ESRS E1-6 Paragraph 37 Boundary Control"
    },
    'FCA': {
      rating: "Split Origin Handover",
      ratingColor: "text-amber-800 border-amber-200 bg-amber-50 shadow-sm",
      doubleCountingRisk: "Medium",
      operationalControl: "Shared at Named Handover Point",
      sellerScope3Category: "Category 9: Downstream (Pre-carriage to Carrier)",
      buyerScope3Category: "Category 4: Upstream (Main Carriage & Forward Legs)",
      csrdMateriality: "ESRS E1 mandates clear boundaries at named handover place. Seller tracks and discloses pre-carriage emissions up to carrier handover; Buyer tracks everything from point of main booking.",
      esrsDisclosureRequired: "Scope 3 Cat 9 (Seller downstream pre-carriage) and Scope 3 Cat 4 (Buyer international legs).",
      auditActionSeller: "Verify truck fuel/efficiency data for the short origin-leg to carrier terminal.",
      auditActionBuyer: "Isolate main international leg from origin terminal. Ensure no double-counting with Seller's pre-carriage.",
      sellerRoleDetails: "Responsible up to carrier surrender. Track local carrier Scope 3 emissions.",
      buyerRoleDetails: "Responsible for main sea/air freight and final delivery carbon metrics.",
      regulatoryStandard: "GHG Protocol Scope 3 Category 4/9 Guidance"
    },
    'FAS': {
      rating: "Port-side Boundary Split",
      ratingColor: "text-amber-800 border-amber-200 bg-amber-50 shadow-sm",
      doubleCountingRisk: "Medium",
      operationalControl: "Alongside Vessel Boundary",
      sellerScope3Category: "Category 9: Downstream (Transport alongside ship)",
      buyerScope3Category: "Category 4: Upstream (Loading, Stowage & Freight)",
      csrdMateriality: "Boundary splits alongside the ship. Seller reports pre-carriage to harbor terminal under Scope 3. Buyer reports loading crane emissions and onward voyage.",
      esrsDisclosureRequired: "Scope 3 Category 9 (Seller local pre-carriage to port) and Scope 3 Category 4 (Buyer maritime loading + shipping).",
      auditActionSeller: "Document terminal tractor or port transit vehicle emissions used for delivery to ship-side.",
      auditActionBuyer: "Verify if terminal loading lift carbon is reported under Buyer Scope 3 Cat 4 or port Scope 1/2.",
      sellerRoleDetails: "Tracks transport up to port berth alongside the named vessel.",
      buyerRoleDetails: "Tracks loading energy (cranes) and all ocean carrier voyage metrics.",
      regulatoryStandard: "GHG Protocol Scope 3 Port Operations"
    },
    'FOB': {
      rating: "On-Board Boundary Split",
      ratingColor: "text-blue-800 border-blue-200 bg-blue-50 shadow-sm",
      doubleCountingRisk: "Medium",
      operationalControl: "Vessel Rail Boundary",
      sellerScope3Category: "Category 9: Downstream (Pre-carriage & Loading)",
      buyerScope3Category: "Category 4: Upstream (International Transport)",
      csrdMateriality: "Handover is completed when goods are safely on board. Under CSRD, Seller accounts for harbor logistics and loading lifting power. Buyer is liable forward from the port departure.",
      esrsDisclosureRequired: "Scope 3 Category 9 for pre-onboard leg; Scope 3 Category 4 for international maritime bunkering.",
      auditActionSeller: "Isolate lifting hook / crane carbon impact at port under Scope 3 Category 9.",
      auditActionBuyer: "Obtain clean ocean freight bunker reports for standard Category 4 accounting.",
      sellerRoleDetails: "Tracks transit to port and loading crane power emissions.",
      buyerRoleDetails: "Tracks major marine bunker emissions from origin port to destination.",
      regulatoryStandard: "ESRS E1 Boundary Alignment"
    },
    'CFR': {
      rating: "High Risk of Double Counting",
      ratingColor: "text-red-800 border-red-200 bg-red-50 shadow-sm",
      doubleCountingRisk: "Critical",
      operationalControl: "Seller Contracted / Buyer Risk",
      sellerScope3Category: "Category 9: Downstream (Seller pays & contracts freight)",
      buyerScope3Category: "Category 4: Upstream (Risk transferred at origin)",
      csrdMateriality: "Under ESRS E1, CFR represents a major audit friction. Since Seller pays the freight but risk belongs to the Buyer during transit, both parties frequently report the ocean carriage. Clear contractual separation is required.",
      esrsDisclosureRequired: "Double materiality declaration under ESRS 2 IRO-1 to reconcile who accounts for ocean carriage fuel.",
      auditActionSeller: "Provide actual maritime carrier emission statements to the Buyer with 'Single Occupancy' declaration.",
      auditActionBuyer: "Ensure Buyer does not report transport Scope 3 Cat 4 if already included in Seller's Scope 3 Cat 9 reports, or coordinate dual-reporting exclusions.",
      sellerRoleDetails: "Contracts main vessel. Must report ocean voyage under down-stream scope 3.",
      buyerRoleDetails: "Risk transfers at vessel rail. Must manage marine cargo safety, but avoids financial booking carbon reporting if properly structured.",
      regulatoryStandard: "CSRD ESRS E1 Double Materiality Guidance"
    },
    'CIF': {
      rating: "High Risk of Double Counting",
      ratingColor: "text-red-800 border-red-200 bg-red-50 shadow-sm",
      doubleCountingRisk: "Critical",
      operationalControl: "Seller Contracted & Insured / Buyer Risk",
      sellerScope3Category: "Category 9: Downstream (Contracts freight & insurance)",
      buyerScope3Category: "Category 4: Upstream (Risk transferred at origin)",
      csrdMateriality: "Identical to CFR double-counting friction. Under CSRD, insurance procurement does not alter the carbon boundary, but Seller must verify carbon footprint of transport of goods to prevent Buyer duplicate filings.",
      esrsDisclosureRequired: "Scope 3 Category 9 emissions matching international marine transit plus verification of green insurance underwriting.",
      auditActionSeller: "Request actual vessel IMO emission logs for period of transit to share with the Buyer's ESG audit team.",
      auditActionBuyer: "Create structured GHG accounting policies stating C-term shipping carbon fallback reporting methods.",
      sellerRoleDetails: "Contracts ocean freight and insurance. Must track downstream logistics footprint.",
      buyerRoleDetails: "Responsible for carbon tracking inside final import port customs and final leg.",
      regulatoryStandard: "GHG Protocol Category 9 Downstream Guidance"
    },
    'CPT': {
      rating: "Multimodal Cost-Split Friction",
      ratingColor: "text-amber-800 border-amber-200 bg-amber-50 shadow-sm",
      doubleCountingRisk: "High",
      operationalControl: "Seller Contracted / First Carrier Risk",
      sellerScope3Category: "Category 9: Downstream (Paid to Named Place)",
      buyerScope3Category: "Category 4: Upstream (Risk transferred at First Carrier)",
      csrdMateriality: "For inland and air multimodal freight. Seller books main carrier, tracking carbon as Category 9 under CSRD. Buyer assumes risk at first carrier, meaning both must verify financial control definitions to align audit files.",
      esrsDisclosureRequired: "Full emissions tracking of multimodal waybills, mapped across rail, flight and road networks.",
      auditActionSeller: "Disclose complete air/rail/truck waybill emissions directly to Buyer under ESG compliance agreements.",
      auditActionBuyer: "Audit carrier sheets. If cost is bundled in product invoice, report under Category 1 (Purchased Goods) to prevent Scope 3 Cat 4 overlap.",
      sellerRoleDetails: "Pays and tracks multi-modal carriage up to the nominated destination point.",
      buyerRoleDetails: "Tracks destination handling, unpacking, and final drayage leg carbon.",
      regulatoryStandard: "GHG Corporate Value Chain Standard"
    },
    'CIP': {
      rating: "Multimodal Cost-Split Friction",
      ratingColor: "text-amber-800 border-amber-200 bg-amber-50 shadow-sm",
      doubleCountingRisk: "High",
      operationalControl: "Seller Contracted & Insured / First Carrier Risk",
      sellerScope3Category: "Category 9: Downstream (Paid to Named Place)",
      buyerScope3Category: "Category 4: Upstream (Risk transferred at First Carrier)",
      csrdMateriality: "Requires detailed Scope 3 reporting. Seller books transport and maps carbon footprints under Category 9. Under CSRD, insurance criteria must align with material ESG risk disclosures.",
      esrsDisclosureRequired: "High-level Scope 3 Category 9 multimodal transport footprint coupled with ESG insurance audits.",
      auditActionSeller: "Establish routine computerized emission-reporting APIs with the multimodal cargo forwarders.",
      auditActionBuyer: "Incorporate Seller-provided freight emission data directly into ESRS Scope 3 disclosures.",
      sellerRoleDetails: "Procures full transit and all-risk cover. Customarily tracks whole travel emission.",
      buyerRoleDetails: "Saves tracking costs by sourcing carbon logs directly from Seller's logistics dashboard.",
      regulatoryStandard: "ESRS E1-6 Scope 3 Multimodal Data"
    },
    'DAP': {
      rating: "Seller-Led Delivery Alignment",
      ratingColor: "text-emerald-800 border-emerald-200 bg-emerald-50 shadow-sm",
      doubleCountingRisk: "Low",
      operationalControl: "95% Seller Controlled End-to-End",
      sellerScope3Category: "Category 9: Downstream (End-to-End Transit)",
      buyerScope3Category: "Category 1: Purchased Goods (No local transit ownership)",
      csrdMateriality: "Under CSRD, Seller must track and disclose the full cross-border transport footprint up to named destination. Buyer has zero transport operational control, simplifying their Scope 3 reporting considerably.",
      esrsDisclosureRequired: "Downstream emission disclosures for Seller; zero-liability transit reporting for Buyer except local yard handling.",
      auditActionSeller: "Validate carrier fuel logs, route efficiencies, and multi-modal transfer emissions for the entire trip.",
      auditActionBuyer: "Ensure zero transport emissions are claimed in Scope 3 Cat 4; simply account for local warehouse unloading power.",
      sellerRoleDetails: "Bears 100% of transit emissions responsibility. Must supply verified data for CSRD.",
      buyerRoleDetails: "Reports only local, point-of-delivery emissions. High audit simplicity.",
      regulatoryStandard: "CSRD ESRS E1 Reporting Boundaries"
    },
    'DPU': {
      rating: "Seller-Led Delivery & Unloading",
      ratingColor: "text-emerald-800 border-emerald-200 bg-emerald-50 shadow-sm",
      doubleCountingRisk: "Low",
      operationalControl: "100% Seller Controlled (Unloaded)",
      sellerScope3Category: "Category 9: Downstream (Transit & Unloading Emissions)",
      buyerScope3Category: "Category 1: Purchased Goods (Post-delivery Storage)",
      csrdMateriality: "Seller is responsible for whole logistics including unloading. Seller accounts for heavy crane or forklift fuel burn at destination. Extremely light ESG reporting requirement for the Buyer.",
      esrsDisclosureRequired: "Carbon metrics for travel, domestic logistics, port drayage, and terminal unloading machinery.",
      auditActionSeller: "Track actual fuel burn and power consumption of unloading machinery at destination port/facility.",
      auditActionBuyer: "Record simple Scope 1/2 from final storage onwards.",
      sellerRoleDetails: "Tracks complete travel and physical unloading energy footprint.",
      buyerRoleDetails: "Receives goods fully delivered and unloaded; zero transit emission liability.",
      regulatoryStandard: "GHG Protocol Lifecycle Accounting"
    },
    'DDP': {
      rating: "Maximum Seller ESG Accountability",
      ratingColor: "text-emerald-800 border-emerald-200 bg-emerald-50 shadow-sm",
      doubleCountingRisk: "Low",
      operationalControl: "100% Seller Controlled (Transit & Customs Clearance)",
      sellerScope3Category: "Category 9: Downstream (Total Logistics & Duties)",
      buyerScope3Category: "Category 1: Purchased Goods (Door-delivered)",
      csrdMateriality: "Under CSRD and GHG Protocol, DDP completely isolates the Buyer from logistics carbon. Seller is legally and operationally liable for reporting emissions of international transport, customs transit, and terminal tasks directly.",
      esrsDisclosureRequired: "Scope 3 Category 9 including double customs clearances and all local onward trucking emissions.",
      auditActionSeller: "Conduct rigorous audit of custom house transport agents and domestic shipping fleets. Report fully under ESRS E1.",
      auditActionBuyer: "Ensure standard product sourcing ESG files reference Seller's DDP emissions. Report transit under Cat 1 only.",
      sellerRoleDetails: "Handles all export, ocean, import, custom transit, and final door-delivery logistics carbon.",
      buyerRoleDetails: "Enjoys perfect audit passivity. Zero direct transport carbon reporting required.",
      regulatoryStandard: "ESRS E1 Integrated Sourcing Framework"
    }
  };

  return data[code] || defaults;
};


interface ResponsibilityData {
  seller: string[];
  buyer: string[];
  insight: string;
}

export const getResponsibilityBreakdown = (incoterm: string): ResponsibilityData => {
  const up = incoterm.toUpperCase();
  switch (up) {
    case 'EXW':
      return {
        seller: [
          "Warehouse packaging & loading readiness",
          "Factory gate risk custody & handling"
        ],
        buyer: [
          "Origin local transport (drayage) to terminal",
          "Export customs clearance & port handling",
          "Main international air/ocean freight booking",
          "Import customs clearance, tariffs & duties",
          "Final delivery logistical emissions"
        ],
        insight: "Under EXW, the seller has virtually zero logistics or emission boundary custody. The buyer assumes entire Scope 3 Category 4 reporting and physical routing risk immediately from the factory door."
      };
    case 'FCA':
      return {
        seller: [
          "Loading onto buyer's carrier at supplier premises",
          "Export compliance and customs clearance",
          "Pre-carriage to carrier terminal (if applicable)"
        ],
        buyer: [
          "Main carriage carrier selection & ocean/air freight booking",
          "Cargo transit damage & loss risk",
          "Destination port handling & import clearance",
          "Final inland trucking drayage to terminal"
        ],
        insight: "FCA shifts loaded handover and export compliance to the seller, but the buyer operates the main international transport leg, retaining major carbon and routing selection power."
      };
    case 'FAS':
      return {
        seller: [
          "Inland pre-carriage to named port berth",
          "Placement alongside named ship under hook",
          "Export customs compliance clearance"
        ],
        buyer: [
          "Port loading crane operation & stevedore handling",
          "Main ocean transit & bunkering emissions",
          "Destination handling & import customs clearance",
          "Onward regional road/rail distribution"
        ],
        insight: "Under FAS, the seller is liable for the inland pre-carriage to the port under hook, while the buyer assumes all carbon reporting starting with loading and onward maritime voyage."
      };
    case 'FOB':
      return {
        seller: [
          "Inland pre-carriage to origin port terminal",
          "Port lifting crane, loading, and stowage on-board",
          "Export customs processing & terminal charges"
        ],
        buyer: [
          "Main ocean freight routing & carbon-efficient carrier booking",
          "Ocean transit fuel emissions & maritime cargo risk",
          "Destination port handling, unpacking & import duties",
          "Final delivery trucking & regional drayage"
        ],
        insight: "FOB splits responsibility cleanly at the vessel rail. The seller covers origin handling and loading emissions, while the buyer regulates the substantial main voyage shipping footprint."
      };
    case 'CFR':
      return {
        seller: [
          "Inland pre-carriage to destination terminal",
          "Port loading and export customs clearance tasks",
          "Main international carriage contracting & freight payments"
        ],
        buyer: [
          "High maritime transit loss risk coverage (retains transfer at origin rail)",
          "Destination harbor unloading fees and operations",
          "Import customs clearance & tariff duties",
          "Final distribution drayage emissions"
        ],
        insight: "Under CFR, a high risk of double carbon-counting exists: the seller contracts the main vessel, but because physical risk is with the buyer, both must carefully coordinate Scope 3 report boundaries."
      };
    case 'CIF':
      return {
        seller: [
          "Main carriage contracting & ocean freight payments",
          "Basic cargo insurance procurement for carriage security",
          "Export customs & loading charges"
        ],
        buyer: [
          "High ocean transit risk (retains risk after ship rail limits)",
          "Destination port handling & unloading emissions",
          "Import customs processing & duty filings",
          "Final leg distribution drayage"
        ],
        insight: "Under CIF, the seller retains main freight shipping coordination and buys transit insurance, but risk officially transfers at the origin rail, leaving the buyer holding physical cargo risk."
      };
    case 'CPT':
      return {
        seller: [
          "Origin drayage, loading & handling tasks",
          "Export compliance & customs clearance",
          "Multimodal main freight transport packaging & payment"
        ],
        buyer: [
          "Transit loss & damage risk coverage from first carrier",
          "Destination terminal handling & unloading",
          "Import clearance, local taxes & port duties",
          "Final delivery trucking emissions"
        ],
        insight: "Under CPT, the seller pays for the main carriage up to the named destination place. However, the buyer bears the cargo transit risks from the moment of handover to the very first carrier."
      };
    case 'CIP':
      return {
        seller: [
          "Multimodal main freight routing & courier booking",
          "Comprehensive multi-risk cargo transit insurance",
          "Export compliance & customs processing"
        ],
        buyer: [
          "Physical loss/damage risk from first carrier handover",
          "Destination terminal unloading operations",
          "Import customs border tax filings & customs clearance",
          "Onward logistics to final warehouse"
        ],
        insight: "Under CIP, the seller manages the main transport and funds full-risk transit insurance, while the buyer is burdened with transit risk from the start of first carrier hand-off."
      };
    case 'DAP':
      return {
        seller: [
          "Origin loading, export clearance, and ocean carriage",
          "Continuous logistics operations, tracking & risk control",
          "Carriage up to named destination place (delivered ready)"
        ],
        buyer: [
          "Terminal unloading charges at destination place",
          "Import customs clearance processing & duties",
          "Destination local storage emissions"
        ],
        insight: "DAP transfers 90% of transport and logistical risk to the seller, who controls emissions continuously up to destination. The buyer reports minimal scope 3 transport metrics."
      };
    case 'DPU':
      return {
        seller: [
          "International transit (multimodal) freight bookings",
          "Risk custody and tracking up to physical unloading at terminal",
          "Destination unloading crane/machinery operations"
        ],
        buyer: [
          "Import custom declarations & tariff duties",
          "Final inland storage facility handling & regional hauling"
        ],
        insight: "Under DPU, the seller controls transit and physical unloading carbon, ensuring the buyer receives cargo unloaded with zero terminal logistics concerns."
      };
    case 'DDP':
    default:
      return {
        seller: [
          "Complete end-to-end transport emissions responsibility",
          "Dual customs clearances (export & import regulatory compliance)",
          "Import duties, VAT, and local port clearance costs"
        ],
        buyer: [
          "Perfect sustainability passivity (zero transit custody or carbon risk)",
          "Final storage facility handling only"
        ],
        insight: "DDP signifies maximum seller accountability. The buyer enjoys complete ESG passivity for transit logistics, transferring 100% of carbon, risk, and customs compliance to the seller."
      };
  }
};


type TabType = 'incoterms' | 'sustainability' | 'compliance' | 'all';
type ViewMode = 'hub' | 'detail';

export default function ResultDisplay({ code, onReset }: ResultDisplayProps) {
  const [activeTab, setActiveTab] = useState<TabType>('incoterms');
  const [viewMode, setViewMode] = useState<ViewMode>('hub');
  const [isPrintingReport, setIsPrintingReport] = useState(false);
  const info = INCOTERMS[code];

  if (!info) return null;

  const handleExportPDF = () => {
    setIsPrintingReport(false); // Global export
    setTimeout(() => {
      window.focus();
      window.print();
    }, 100);
  };

  const handleIncotermsReportPDF = () => {
    setIsPrintingReport(true); // Report-only export
    setTimeout(() => {
      window.focus();
      window.print();
      // We don't necessarily need to reset it immediately because window.print blocks, 
      // but a reset in the next tick or after-print event is safer.
      setTimeout(() => setIsPrintingReport(false), 500);
    }, 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-5xl mx-auto space-y-8"
      id="result-container"
    >
      {/* Header Card */}
      <div className={`bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 ${isPrintingReport ? 'print:hidden' : ''}`} id="result-header">
        <div className="bg-slate-900 p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Globe size={180} />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div>
              <div className="flex items-center gap-2 text-blue-400 text-sm font-bold uppercase tracking-widest mb-3">
                <Shield size={16} />
                Strategic Recommendation
              </div>
              <h1 className="text-7xl font-black tracking-tighter" id="incoterm-code">{info.code}</h1>
              <p className="text-2xl text-slate-300 mt-2 font-semibold">{info.name}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 print:hidden">
              <button
                onClick={handleExportPDF}
                className="flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-all shadow-lg hover:shadow-blue-500/50 text-sm font-black uppercase tracking-widest group"
              >
                <Download size={18} className="group-hover:-translate-y-0.5 transition-transform" />
                Export PDF Report
              </button>
              <button
                onClick={onReset}
                className="flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all text-sm font-bold backdrop-blur-md border border-white/10"
                id="start-over-btn"
              >
                <RefreshCcw size={18} />
                New Analysis
              </button>
            </div>
          </div>
        </div>

        {/* Analytics Selection View (Hub) */}
        {viewMode === 'hub' ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-10 space-y-12"
          >
            {/* Quick Responsibility Summary */}
            <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
                <div>
                  <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Responsibility Summary</h2>
                  <p className="text-slate-900 font-black text-xl">Logistical Hierarchy for {info.code}</p>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-600 rounded-full" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Seller</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Buyer</span>
                  </div>
                </div>
              </div>

              {/* Linear Responsibility Timeline */}
              <div className="py-16 px-6">
                <div className="relative pt-8">
                  {/* Legend/Zone Indicators */}
                  <div className="absolute -top-6 left-0 w-full flex justify-between px-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-blue-600" />
                      <span className="text-[8px] font-black uppercase tracking-widest text-blue-600">
                        Seller Managed
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[8px] font-black uppercase tracking-widest text-orange-600 text-right">
                        Buyer Managed
                      </span>
                      <div className="w-2 h-2 rounded-full bg-orange-600" />
                    </div>
                  </div>

                  {/* The Base Line (Buyer background) */}
                  <div className="absolute top-1/2 left-0 w-full h-1.5 bg-orange-100 -translate-y-1/2 rounded-full" />
                  
                  {/* Seller Activity Line (Based on Cost) */}
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(getTransferIndices(code).cost / (STAGES.length - 1)) * 100}%` }}
                    className="absolute top-1/2 left-0 h-1.5 bg-blue-600 -translate-y-1/2 rounded-full z-10 shadow-[0_0_10px_rgba(37,99,235,0.3)]"
                  />

                  <div className="flex justify-between relative z-20">
                    {STAGES.map((stage, idx) => {
                      const { risk, cost } = getTransferIndices(code);
                      const isRiskPoint = risk === idx;
                      const isCostPoint = cost === idx;
                      const isSellerZone = idx <= cost;
                      
                      return (
                        <div key={idx} className="flex flex-col items-center group">
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 rotate-45 shadow-sm group-hover:rotate-0 group-hover:scale-110 ${
                            isSellerZone 
                              ? 'bg-blue-600 text-white shadow-blue-200' 
                              : 'bg-white border-2 border-orange-500 text-orange-600'
                          }`}>
                            <div className="-rotate-45 group-hover:rotate-0 transition-transform">
                              <stage.icon size={16} />
                            </div>
                          </div>
                          
                          <div className="mt-6 flex flex-col items-center text-center">
                            <span className={`text-[8px] font-black uppercase tracking-tighter max-w-[60px] leading-tight mb-2 transition-colors ${
                              isSellerZone ? 'text-blue-600' : 'text-orange-600'
                            }`}>
                              {stage.label}
                            </span>
                            
                            <div className="flex flex-col gap-1.5 min-h-[40px]">
                              {isRiskPoint && (
                                <motion.div 
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="bg-slate-900 text-white text-[7px] font-black px-2 py-1 rounded-lg uppercase tracking-widest whitespace-nowrap shadow-xl flex items-center gap-1 border border-white/20"
                                >
                                  <Shield size={8} /> Risk Transfer
                                </motion.div>
                              )}
                              {isCostPoint && (
                                <motion.div 
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="bg-red-600 text-white text-[7px] font-black px-2 py-1 rounded-lg uppercase tracking-widest whitespace-nowrap shadow-xl flex items-center gap-1 border border-white/20"
                                >
                                  <RefreshCcw size={8} /> Cost Transfer
                                </motion.div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              </div>

              {/* Combined Roadmap & Duties */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <SummaryCard 
                  icon={<Package size={20} />} 
                  label="Packaging & Handling" 
                  responsible="Seller" 
                  details="Goods must be marked and packed for export."
                />
                <SummaryCard 
                  icon={<Truck size={20} />} 
                  label="Export Clearance" 
                  responsible={info.responsibilities.export} 
                  details="Customs duties and export licenses."
                />
                <SummaryCard 
                  icon={<Ship size={20} />} 
                  label="Freight & Transport" 
                  responsible={info.responsibilities.mainTransport} 
                  details="Primary international carriage costs."
                />
                <SummaryCard 
                  icon={<Globe size={20} />} 
                  label="Import & Delivery" 
                  responsible={info.responsibilities.import} 
                  details="Local duties and terminal handling."
                />
              </div>

              <div className="pt-6 border-t border-slate-200 flex flex-wrap gap-10">
                <div className="flex items-center gap-3">
                  <Shield size={18} className="text-slate-400" />
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Insurance</span>
                    <span className={`text-xs font-bold ${info.responsibilities.insurance === 'Seller' ? 'text-blue-600' : 'text-orange-600'}`}>
                      {info.responsibilities.insurance} Responsible
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <BarChart3 size={18} className="text-slate-400" />
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Risk Profile</span>
                    <span className="text-xs font-bold text-slate-600">
                      Balanced Risk allocation
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Explore Analytics Context</h2>
              <p className="text-slate-600 font-medium text-sm">Select a module for deep technical breakdown</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { id: 'all', label: 'All Analytics', icon: LayoutGrid, color: 'text-slate-600', desc: 'Complete end-to-end perspective' },
                { id: 'incoterms', label: 'Incoterms Analysis', icon: Shield, color: 'text-blue-600', desc: 'Transfer points & standard duties' },
                { id: 'sustainability', label: 'Sustainability Analysis', icon: Leaf, color: 'text-emerald-600', desc: 'Scope 3 GHG protocol allocation' },
                { id: 'compliance', label: 'Documentary Compliance', icon: Binary, color: 'text-indigo-600', desc: 'ICC standards & UCP 600 mapping' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as TabType);
                    setViewMode('detail');
                  }}
                  className="flex flex-col items-center justify-center text-center gap-6 p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:border-slate-900 hover:shadow-2xl hover:scale-[1.03] group"
                >
                  <div className={`p-5 rounded-[2rem] bg-white shadow-sm transition-all group-hover:bg-slate-900 group-hover:text-white ${tab.color}`}>
                    <tab.icon size={32} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-2">{tab.label}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed">{tab.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <>
            {/* Analysis Detail View */}
            {/* Context Header with Navigation */}
            <div className={`bg-slate-50 border-b border-slate-200 px-10 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 sticky top-0 z-30 backdrop-blur-sm bg-slate-50/90 print:hidden ${isPrintingReport ? 'print:hidden' : ''}`}>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setViewMode('hub')}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:border-slate-900 hover:text-slate-900 transition-all"
                >
                  <RefreshCcw size={12} className="rotate-180" />
                  Back to Hub
                </button>
                <div className="h-6 w-px bg-slate-200" />
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">Current View:</span>
                  <span className="text-xs font-black uppercase tracking-widest text-slate-900 px-3 py-1 bg-slate-900 text-white rounded-lg">
                    {activeTab === 'all' ? 'All Analytics' : activeTab === 'incoterms' ? 'Incoterms Analysis' : activeTab === 'sustainability' ? 'Sustainability Analysis' : 'Documentary Compliance'}
                  </span>
                </div>
              </div>

              {/* Quick Tab Switcher for convenience */}
              <div className="flex gap-2 p-1 bg-slate-200/50 rounded-xl">
                 {['incoterms', 'sustainability', 'compliance', 'all'].map((t) => (
                   <button
                    key={t}
                    onClick={() => setActiveTab(t as TabType)}
                    className={`p-2 rounded-lg transition-all ${activeTab === t ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                    title={t.toUpperCase()}
                   >
                     {t === 'incoterms' && <Shield size={16} />}
                     {t === 'sustainability' && <Leaf size={16} />}
                     {t === 'compliance' && <Binary size={16} />}
                     {t === 'all' && <LayoutGrid size={16} />}
                   </button>
                 ))}
              </div>
            </div>

            <div className="p-10">
              {/* Content Area */}
              <div className="max-w-4xl mx-auto">
                <div className="space-y-12">
                  <div className={(activeTab === 'all' || activeTab === 'incoterms' || isPrintingReport) ? 'block' : 'hidden print:block'}>
                    {/* Report Header for PDF */}
                    <div className="hidden print:block mb-10 pb-6 border-b-4 border-slate-900">
                      <div className="flex justify-between items-center">
                        <div>
                          <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900">Incoterms® 2020 Technical Report</h2>
                          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1 text-slate-400">Institutional Logistics Analysis Portfolio</p>
                        </div>
                        <div className="text-right">
                          <div className="text-4xl font-black text-slate-900">{info.code}</div>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Standard Code</div>
                        </div>
                      </div>
                    </div>

                    {/* Strategic Risk Transfer Bar */}
                    <section className="space-y-8">
                      <div className="flex justify-between items-center px-4">
                        <h3 className="flex items-center gap-3 text-slate-900 font-black text-2xl">
                          <Shield className="text-blue-600" size={28} />
                          Transfer Point Analysis
                        </h3>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Protocol 2020</span>
                      </div>

                      <div className="grid grid-cols-1 gap-8">
                        {/* Risk Card */}
                        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm transition-all hover:shadow-md">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-slate-50">
                            <div>
                               <div className="flex items-center gap-2 mb-1">
                                 <Shield size={16} className="text-slate-900" />
                                 <h4 className="text-lg font-black uppercase tracking-tight text-slate-900">Legal Risk Boundary</h4>
                               </div>
                               <p className="text-[11px] text-slate-500 font-medium italic tracking-wide">
                                 Incoterms® 2020 Article A2/B2 (Delivery & Transfer of Risks)
                               </p>
                            </div>
                            <div className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest">Risk Transfer</div>
                          </div>
                          
                          <div className="relative pt-12 pb-6 px-4">
                            <div className="relative">
                              <div className="absolute -top-12 left-0 flex flex-col items-start">
                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Seller Origin</span>
                              </div>
                              <div className="absolute -top-12 right-0 flex flex-col items-end">
                                <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">Buyer Destination</span>
                              </div>

                              <div className="relative mt-4">
                                <div className="relative h-6 w-full bg-slate-100 rounded-full overflow-hidden flex border-4 border-white shadow-inner">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${info.transferPosition}%` }}
                                    transition={{ type: "spring", stiffness: 50, delay: 0.5 }}
                                    className="h-full bg-blue-600 shadow-[inset_-5px_0_10px_rgba(0,0,0,0.1)]"
                                  />
                                  <div className="flex-1 h-full bg-orange-500 shadow-[inset_5px_0_10px_rgba(0,0,0,0.1)]" />
                                </div>

                                <motion.div 
                                  initial={{ opacity: 0, scale: 0 }}
                                  animate={{ opacity: 1, scale: 1, left: `${info.transferPosition}%` }}
                                  transition={{ delay: 1, type: "spring" }}
                                  className="absolute top-1/2 -translate-y-1/2 -ml-4 w-8 h-8 bg-white border-4 border-slate-900 rounded-full shadow-2xl z-20 flex items-center justify-center"
                                >
                                  <div className="w-2 h-2 bg-slate-900 rounded-full animate-pulse" />
                                  <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 w-0.5 h-16 bg-slate-900/50 -z-10" />
                                  <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-5 py-3 rounded-2xl text-[10px] font-black tracking-widest uppercase whitespace-nowrap shadow-2xl border border-white/20 text-center">
                                    <div className="opacity-60 text-[8px] mb-0.5">Article A2 Boundary</div>
                                    Risk Transfer Point
                                    <div className="text-[14px] leading-tight normal-case font-black mt-0.5">{info.transferPoint}</div>
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-slate-900" />
                                  </div>
                                </motion.div>
                              </div>
                            </div>                            <div className="flex justify-between mt-12 p-5 bg-slate-50/50 rounded-[1.5rem] border border-slate-100/50">
                              <div className="flex items-center gap-4">
                                <div className="w-4 h-4 bg-blue-600 rounded-full shadow-md" />
                                <div className="flex flex-col">
                                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Seller Exposure</span>
                                  <span className="text-xl font-black text-blue-600">{info.transferPosition}%</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-right">
                                <div className="flex flex-col">
                                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Buyer Exposure</span>
                                  <span className="text-xl font-black text-orange-600">{100 - info.transferPosition}%</span>
                                </div>
                                <div className="w-4 h-4 bg-orange-500 rounded-full shadow-md" />
                              </div>
                            </div>

                            {/* Integrated Operations into Risk Card */}
                            <div className="mt-10 pt-10 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Delivery Place & Time */}
                              <div className="space-y-3">
                                <div className="flex items-center gap-2 text-slate-400">
                                  <Truck size={14} />
                                  <span className="text-[9px] font-black uppercase tracking-widest">Delivery Point</span>
                                </div>
                                <p className="text-[11px] font-bold text-slate-900 leading-tight">
                                  {info.detailedAnalysis.delivery.point}
                                </p>
                                <p className="text-[8px] text-slate-500 font-medium leading-relaxed italic">
                                  Legal transfer point (Art. A2).
                                </p>
                              </div>

                              {/* Notices */}
                              <div className="space-y-3">
                                <div className="flex items-center gap-2 text-slate-400">
                                  <Info size={14} />
                                  <span className="text-[9px] font-black uppercase tracking-widest">Notice (Art. A10/B10)</span>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-[10px] text-slate-700 font-medium leading-tight">
                                    <span className="font-bold text-blue-600 mr-1">S:</span> {info.detailedAnalysis.delivery.notices}
                                  </p>
                                  <p className="text-[10px] text-slate-700 font-medium leading-tight">
                                    <span className="font-bold text-orange-600 mr-1">B:</span> {['EXW', 'FCA', 'FAS', 'FOB'].includes(code) ? "Carrier/vessel identity & time." : "Place/time sync."}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Cost Card */}
                        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm transition-all hover:shadow-md">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-slate-50">
                             <div>
                               <div className="flex items-center gap-2 mb-1">
                                 <BarChart3 size={16} className="text-slate-900" />
                                 <h4 className="text-lg font-black uppercase tracking-tight text-slate-900">Financial Cost Boundary</h4>
                               </div>
                               <p className="text-[11px] text-slate-500 font-medium italic tracking-wide">
                                  Incoterms® 2020 Article A9/B9 (Allocation of Costs)
                               </p>
                            </div>
                            <div className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest">Cost Transfer</div>
                          </div>

                          <div className="space-y-12">
                            <div className="relative pt-12 pb-6 px-4">
                              <div className="relative">
                                <div className="absolute -top-12 left-0 flex flex-col items-start">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Seller Costs</span>
                                </div>
                                <div className="absolute -top-12 right-0 flex flex-col items-end">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">Buyer Costs</span>
                                </div>

                                <div className="relative mt-4">
                                  <div className="relative h-6 w-full bg-slate-100 rounded-full overflow-hidden flex border-4 border-white shadow-inner">
                                    <motion.div 
                                      initial={{ width: 0 }}
                                      animate={{ width: `${info.detailedAnalysis.costAllocation.sellerPercentage}%` }}
                                      transition={{ type: "spring", stiffness: 50, delay: 0.7 }}
                                      className="h-full bg-blue-600 shadow-[inset_-5px_0_10px_rgba(0,0,0,0.1)]"
                                    />
                                    <div className="flex-1 h-full bg-orange-500 shadow-[inset_5px_0_10px_rgba(0,0,0,0.1)]" />
                                  </div>

                                  <motion.div 
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1, left: `${info.detailedAnalysis.costAllocation.sellerPercentage}%` }}
                                    transition={{ delay: 1.2, type: "spring" }}
                                    className="absolute top-1/2 -translate-y-1/2 -ml-4 w-8 h-8 bg-white border-4 border-slate-900 rounded-full shadow-2xl z-20 flex items-center justify-center"
                                  >
                                    <div className="w-2 h-2 bg-slate-900 rounded-full animate-pulse" />
                                    <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 w-0.5 h-16 bg-slate-900/50 -z-10" />
                                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-5 py-3 rounded-2xl text-[10px] font-black tracking-widest uppercase whitespace-nowrap shadow-2xl border border-white/20 text-center">
                                      <div className="opacity-60 text-[8px] mb-0.5">Article A9 Division</div>
                                      Cost Transfer Point
                                      <div className="text-[14px] leading-tight normal-case font-black mt-0.5">{info.detailedAnalysis.costTransferPoint}</div>
                                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-slate-900" />
                                    </div>
                                  </motion.div>
                                </div>
                              </div>
                            </div>

                            {/* Cost Allocation Deep Dive */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Seller's Obligations Box */}
                              <div className="bg-blue-50/50 rounded-3xl p-6 border border-blue-100 flex flex-col">
                                <div className="flex justify-between items-center mb-6">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-6 bg-blue-600 rounded-full" />
                                    <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Seller's Financial Cost List</h5>
                                  </div>
                                  <span className="text-lg font-black text-blue-600">{info.detailedAnalysis.costAllocation.sellerPercentage}%</span>
                                </div>
                                
                                <div className="space-y-2 flex-1">
                                  {[
                                    { label: 'Packaging & Inspection Costs', sellerPays: true },
                                    { label: 'Loading Charges at Origin', sellerPays: code !== 'EXW' },
                                    { label: 'Inland Freight / Pre-carriage', sellerPays: !['EXW', 'FCA'].includes(code) },
                                    { label: 'Origin Terminal Handling Charges (OTHC)', sellerPays: !['EXW', 'FCA', 'FAS'].includes(code) },
                                    { label: 'Main Carriage / International Freight', sellerPays: ['CFR', 'CIF', 'CPT', 'CIP', 'DAP', 'DPU', 'DDP'].includes(code) },
                                    { label: 'Destination Terminal Handling Charges (DTHC)', sellerPays: ['DAP', 'DPU', 'DDP'].includes(code) },
                                    { label: 'Unloading Charges at Destination', sellerPays: code === 'DPU' },
                                  ].filter(item => item.sellerPays).map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-blue-100/50 shadow-sm">
                                      <CheckCircle2 size={12} className="text-blue-500" />
                                      <span className="text-[10px] font-bold text-slate-700">{item.label}</span>
                                    </div>
                                  ))}
                                  {/* If no items, show a minimal placeholder or handle it */}
                                </div>
                                <div className="mt-4 pt-4 border-t border-blue-100">
                                  <p className="text-[8px] text-slate-400 font-medium uppercase tracking-tighter">Obligations under Incoterms® 2020 Article A9</p>
                                </div>
                              </div>

                              {/* Buyer's Obligations Box */}
                              <div className="bg-orange-50/50 rounded-3xl p-6 border border-orange-100 flex flex-col">
                                <div className="flex justify-between items-center mb-6">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-6 bg-orange-500 rounded-full" />
                                    <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Buyer's Financial Cost List</h5>
                                  </div>
                                  <span className="text-lg font-black text-orange-600">{info.detailedAnalysis.costAllocation.buyerPercentage}%</span>
                                </div>
                                
                                <div className="space-y-2 flex-1">
                                  {[
                                    { label: 'Packaging & Inspection Costs', buyerPays: false },
                                    { label: 'Loading Charges at Origin', buyerPays: code === 'EXW' },
                                    { label: 'Inland Freight / Pre-carriage', buyerPays: ['EXW', 'FCA'].includes(code) },
                                    { label: 'Origin Terminal Handling Charges (OTHC)', buyerPays: ['EXW', 'FCA', 'FAS'].includes(code) },
                                    { label: 'Main Carriage / International Freight', buyerPays: ['EXW', 'FCA', 'FAS', 'FOB'].includes(code) },
                                    { label: 'Destination Terminal Handling Charges (DTHC)', buyerPays: !['DAP', 'DPU', 'DDP'].includes(code) },
                                    { label: 'Unloading Charges at Destination', buyerPays: code !== 'DPU' },
                                  ].filter(item => item.buyerPays).map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-orange-100/50 shadow-sm">
                                      <CheckCircle2 size={12} className="text-orange-500" />
                                      <span className="text-[10px] font-bold text-slate-700">{item.label}</span>
                                    </div>
                                  ))}
                                </div>
                                <div className="mt-4 pt-4 border-t border-orange-100">
                                  <p className="text-[8px] text-slate-400 font-medium uppercase tracking-tighter">Obligations under Incoterms® 2020 Article B9</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Insurance Card */}
                        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm transition-all hover:shadow-md relative overflow-hidden">
                          {['CIF', 'CIP'].includes(info.code) && (
                            <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
                          )}
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-slate-50">
                            <div>
                               <div className="flex items-center gap-2 mb-1">
                                 <ShieldCheck size={16} className="text-slate-900" />
                                 <h4 className="text-lg font-black uppercase tracking-tight text-slate-900">Insurance Capability</h4>
                               </div>
                               <p className="text-[11px] text-slate-500 font-medium italic tracking-wide">
                                 Incoterms® 2020 Article A5/B5 (Insurance)
                               </p>
                            </div>
                            <div className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm border transition-all ${
                              ['CIF', 'CIP'].includes(info.code) 
                                ? 'bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-700' 
                                : 'bg-slate-50 text-slate-500 border-slate-200'
                            }`}>
                              {['CIF', 'CIP'].includes(info.code) 
                                ? <ShieldCheck size={14} className="animate-pulse" /> 
                                : <Info size={14} />
                              }
                              {['CIF', 'CIP'].includes(info.code) ? 'Mandatory Requirement' : 'Optional / Party Agreement'}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                             <div className="space-y-6 flex flex-col justify-center">
                                <div className="flex items-center gap-5 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:border-slate-300">
                                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform hover:scale-110 ${
                                      info.detailedAnalysis.insurance.responsible === 'Seller' ? 'bg-blue-600 text-white shadow-blue-200' : 'bg-orange-500 text-white shadow-orange-200'
                                   }`}>
                                      <Umbrella size={28} />
                                   </div>
                                   <div>
                                      <div className="flex items-center gap-2 mb-0.5">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Insurance Responsible</span>
                                        <div className={`px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-wider ${
                                          ['CIF', 'CIP'].includes(info.code) 
                                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                                            : 'bg-slate-200 text-slate-600 border border-slate-300'
                                        }`}>
                                          {['CIF', 'CIP'].includes(info.code) ? 'Mandatory' : 'Optional'}
                                        </div>
                                      </div>
                                      <h5 className="text-xl font-black text-slate-900">{info.detailedAnalysis.insurance.responsible}</h5>
                                   </div>
                                </div>

                                <div className="p-6 bg-slate-900 text-white rounded-[2rem] border border-slate-800 shadow-xl space-y-3 relative overflow-hidden">
                                   <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                                      <Lock size={40} />
                                   </div>
                                   <div className="flex items-center gap-2 relative z-10">
                                      <div className={`p-1 rounded-md ${info.code === 'CIP' ? 'bg-amber-500' : 'bg-blue-500'}`}>
                                        <Lock size={10} className="text-white" />
                                      </div>
                                      <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Global Minimum Coverage Standard</span>
                                   </div>
                                   <div className="relative z-10 space-y-1">
                                      <p className="text-lg font-black leading-tight">
                                        {info.detailedAnalysis.insurance.minimumCoverage}
                                      </p>
                                      {info.code === 'CIF' && (
                                        <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-tight">Requirement: Institute Cargo Clauses (C)</p>
                                      )}
                                      {info.code === 'CIP' && (
                                        <p className="text-[10px] text-amber-400 font-bold uppercase tracking-tight">Requirement: Institute Cargo Clauses (A) - "All Risks"</p>
                                      )}
                                      {!['CIF', 'CIP'].includes(info.code) && (
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Recommended: Institute Cargo Clauses (A)</p>
                                      )}
                                   </div>
                                   <div className="pt-2 border-t border-white/10 mt-2">
                                      <p className="text-[9px] text-white/50 font-medium tracking-wide">Incoterms® 2020 Article A5/B5 standard for {info.code === 'CIP' ? 'high-value multimodal' : 'standard sea freight'} coverage.</p>
                                   </div>
                                </div>
                             </div>

                             <div className="relative bg-slate-50 rounded-[2.5rem] overflow-hidden border border-slate-100 flex items-center justify-center p-8 text-center min-h-[16rem] group">
                                <div className="absolute inset-0 opacity-[0.03] transition-transform duration-700 group-hover:scale-110 pointer-events-none">
                                   <Umbrella size={220} className="absolute -right-16 -bottom-16 rotate-12" />
                                </div>
                                <div className="relative z-10 space-y-4">
                                   <div className={`mx-auto w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner transition-colors duration-500 ${
                                      ['CIF', 'CIP'].includes(info.code) ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                                   }`}>
                                      {['CIF', 'CIP'].includes(info.code) ? <CheckCircle2 size={24} /> : <Info size={24} />}
                                   </div>
                                   <div className="space-y-2">
                                      <h6 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Rule of Law</h6>
                                      <p className="text-[13px] text-slate-700 font-bold leading-relaxed max-w-[240px] mx-auto">
                                         {['CIF', 'CIP'].includes(info.code) 
                                           ? "The Seller is legally bound to provide insurance. Failure to do so is a breach of contract under Incoterms rules." 
                                           : "Insurance is not mandatory by ICC standard, but strictly recommended to mitigate cross-border transit risks."}
                                      </p>
                                   </div>
                                </div>
                             </div>
                          </div>
                        </div>
                      </div>

                        {/* Logistical & Legal Framework */}
                        <div className="pt-12 border-t border-slate-100 space-y-8 mt-12">
                          <div className="text-center md:text-left">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Operational Duties</h4>
                            <p className="text-slate-900 font-black text-xl">Logistical Control & Legal Formalities</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             {/* Customs & Formalities */}
                             <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-5">
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    <Globe size={16} className="text-slate-900" />
                                    <h5 className="font-black text-[10px] uppercase tracking-widest text-slate-900">Customs Formalities (A7/B7)</h5>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  {/* Export Customs Clearance */}
                                  <div className="flex items-center justify-between p-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                    <div className="flex flex-col">
                                      <span className="text-[10px] font-bold text-slate-900">Export Clearance</span>
                                      <span className="text-[7px] text-slate-400 font-black uppercase tracking-tighter">Licenses & Origin Duties</span>
                                    </div>
                                    <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                      code === 'EXW' ? 'bg-orange-100 text-orange-600' : 'bg-blue-600 text-white'
                                    }`}>
                                      {code === 'EXW' ? 'Buyer' : 'Seller'}
                                    </div>
                                  </div>

                                  {/* Transit Customs Clearance */}
                                  <div className="flex items-center justify-between p-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                    <div className="flex flex-col">
                                      <span className="text-[10px] font-bold text-slate-900">Transit Clearance</span>
                                      <span className="text-[7px] text-slate-400 font-black uppercase tracking-tighter">Through Third Countries</span>
                                    </div>
                                    <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                      ['DAP', 'DPU', 'DDP', 'CPT', 'CIP', 'CFR', 'CIF'].includes(code) ? 'bg-blue-600 text-white' : 'bg-orange-100 text-orange-600'
                                    }`}>
                                      {['DAP', 'DPU', 'DDP', 'CPT', 'CIP', 'CFR', 'CIF'].includes(code) ? 'Seller' : 'Buyer'}
                                    </div>
                                  </div>

                                  {/* Import Customs Clearance */}
                                  <div className="flex items-center justify-between p-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                    <div className="flex flex-col">
                                      <span className="text-[10px] font-bold text-slate-900">Import Clearance</span>
                                      <span className="text-[7px] text-slate-400 font-black uppercase tracking-tighter">Duties & Destination Taxes</span>
                                    </div>
                                    <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                      code === 'DDP' ? 'bg-blue-600 text-white' : 'bg-orange-100 text-orange-600'
                                    }`}>
                                      {code === 'DDP' ? 'Seller' : 'Buyer'}
                                    </div>
                                  </div>
                                </div>
                                <p className="text-[8px] text-slate-400 font-medium italic leading-relaxed px-1">
                                  Includes export licenses, valuations, transit security, and final import duties/taxes as per ICC standards.
                                </p>
                             </div>

                             {/* Main Transport */}
                             <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                                <div className="flex justify-between items-center">
                                  <h5 className="font-black text-[10px] uppercase tracking-widest text-slate-900">Freight Control (A4/B4)</h5>
                                  <Truck size={14} className="text-slate-400" />
                                </div>
                                <div className="bg-white p-4 rounded-2xl border border-slate-100">
                                   <div className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1">Main Transport Contracting</div>
                                   <div className="flex items-center gap-2">
                                      <div className={`w-2 h-2 rounded-full ${info.detailedAnalysis.transport.contracting === 'Seller' ? 'bg-blue-600' : 'bg-orange-500'}`} />
                                      <span className="text-sm font-black text-slate-900">{info.detailedAnalysis.transport.contracting} Responsible</span>
                                   </div>
                                </div>
                                <p className="text-[9px] text-slate-500 font-medium leading-tight">Party responsible for booking and paying the primary international carrier.</p>
                             </div>

                             {/* Pre-shipment Inspection (PSI) */}
                             <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                                <div className="flex justify-between items-center">
                                  <h5 className="font-black text-[10px] uppercase tracking-widest text-slate-900">Pre-shipment Inspection (PSI)</h5>
                                  <Binary size={14} className="text-slate-400" />
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between p-3 bg-white rounded-2xl border border-slate-100">
                                    <span className="text-[10px] font-bold text-slate-700">Origin Inspection</span>
                                    <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase ${code === 'EXW' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                                      {code === 'EXW' ? 'Buyer Pays' : 'Seller Pays'}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between p-3 bg-white rounded-2xl border border-slate-100">
                                    <span className="text-[10px] font-bold text-slate-700">Import Inspection</span>
                                    <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase ${code === 'DDP' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                                      {code === 'DDP' ? 'Seller Pays' : 'Buyer Pays'}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-[9px] text-slate-500 font-medium leading-tight">Cost allocation for mandatory pre-shipment inspections (Art. A9).</p>
                             </div>
                          </div>
                        </div>
                    </section>

                    {/* Strategic Insights & Advice */}
                    <section className="space-y-8 mt-12 bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                        <div className="flex justify-between items-center">
                          <h3 className="flex items-center gap-3 text-slate-900 font-black text-xl">
                            <Binary className="text-indigo-600" size={24} />
                            Strategic Insights
                          </h3>
                        </div>

                        <div className="p-8 bg-blue-50/50 rounded-3xl border border-blue-100">
                          <h4 className="flex items-center gap-2 text-slate-900 font-bold text-lg mb-3">
                            <Info className="text-blue-600" size={20} />
                            Expert Advice
                          </h4>
                          <p className="text-slate-800 text-base leading-relaxed font-medium italic">
                            "{info.advice}"
                          </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          {info.insights.map((insight, i) => (
                            <div 
                              key={i} 
                              className={`p-6 rounded-[2rem] border transition-all hover:scale-[1.02] ${
                                insight.type === 'tip' ? 'bg-emerald-50 border-emerald-100 text-emerald-900' :
                                insight.type === 'warning' ? 'bg-amber-50 border-amber-100 text-amber-900' :
                                insight.type === 'danger' ? 'bg-red-50 border-red-100 text-red-900' :
                                'bg-blue-50 border-blue-100 text-blue-900'
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                 <span className="font-black text-[9px] uppercase tracking-[0.2em] opacity-60">
                                   {insight.type === 'info' ? 'Responsibility' : insight.type}
                                 </span>
                              </div>
                              <p className="text-xs font-bold leading-relaxed">{insight.text}</p>
                            </div>
                          ))}
                        </div>

                        {/* Export Strategic Report CTA */}
                        <div className="pt-8 border-t border-slate-100 flex flex-col items-center gap-4">
                           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Finalize Documentation</p>
                           <button
                             onClick={handleIncotermsReportPDF}
                             className="flex items-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-[1.5rem] transition-all shadow-2xl hover:shadow-slate-900/40 hover:scale-[1.02] active:scale-95 text-sm font-black uppercase tracking-widest group print:hidden"
                           >
                             <Download size={20} className="group-hover:-translate-y-0.5 transition-transform" />
                             Incoterms PDF Report
                           </button>
                           <p className="text-[9px] text-slate-400 font-medium">Includes Transfer Points, Sustainability Analysis, and Documentary Compliance</p>
                        </div>
                    </section>
                  </div>

                  <div className={`${(activeTab === 'all' || activeTab === 'sustainability') ? 'block' : 'hidden print:block'} ${isPrintingReport ? 'print:hidden' : ''} space-y-10`}>
                    {/* Sustainability Section 1: Carbon & Risk Responsibility Allocation */}
                    <section className="bg-emerald-50/40 border border-emerald-100/80 rounded-[2.5rem] p-8 md:p-10 shadow-sm space-y-8 relative overflow-hidden text-slate-900 animate-fade-in">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/[0.02] rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
                        
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-emerald-100 pb-6 relative z-10">
                          <div>
                            <h3 className="flex items-center gap-3 text-emerald-950 font-extrabold text-2xl">
                              <Leaf className="text-emerald-600 animate-pulse" size={28} />
                              Carbon & Risk Responsibility Allocation
                            </h3>
                            <p className="text-[11px] text-slate-600 font-semibold italic mt-1">
                              Operational & Financial carbon boundary mapping under international ESG and CSRD disclosures.
                            </p>
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-850 px-3.5 py-1.5 bg-emerald-100/45 border border-emerald-200/55 rounded-xl shadow-sm">
                            GHG Protocol & CSRD (ESRS E1) Directive
                          </span>
                        </div>

                      {/* GHG Protocol Scope 3 Category Breakdown (Visual Bar First) */}
                      <div className="space-y-6 relative z-10 bg-white/70 border border-emerald-100/50 rounded-3xl p-6 md:p-8">
                        <div className="flex justify-between items-center border-b border-emerald-100 pb-4 mb-2">
                          <div className="space-y-0.5">
                            <h4 className="text-emerald-900 font-black text-xs uppercase tracking-wider">GHG Protocol Scope 3 Category Breakdown</h4>
                            <p className="text-[10px] text-slate-500 font-semibold">Real-time custody tracking showing where carbon accountability and risk transfer occur.</p>
                          </div>
                          <span className="text-emerald-600"><Info size={16} /></span>
                        </div>

                        <div className="relative pt-6 pb-4 px-1">
                          {/* Seller & Buyer Indicators with Percentages directly above the track for clear view */}
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl shadow-sm">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              Seller Logistics: {info.sellerCarbonControl}%
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-wider text-orange-800 flex items-center gap-1.5 bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-xl shadow-sm">
                              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                              Buyer Logistics: {info.buyerCarbonControl}%
                            </span>
                          </div>

                          <div className="relative h-12 mt-6 mb-8 flex items-center">
                            {/* The break down allocation segments (Progress Bar) */}
                            <div className="h-10 w-full bg-slate-100 rounded-2xl overflow-hidden flex border border-slate-200/70 shadow-inner relative z-10">
                              {info.scope3Allocation.map((segment, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${segment.percentage}%` }}
                                  transition={{ delay: 1.2 + (i * 0.2) }}
                                  className={`${segment.color} h-full relative group cursor-help`}
                                  title={`${segment.label}: ${segment.percentage}%`}
                                >
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                </motion.div>
                              ))}
                            </div>

                            {/* Percentage-labels overlayed ON the bar dynamically at the centers of seller and buyer boundaries */}
                            {info.sellerCarbonControl > 10 && (
                              <div 
                                style={{ left: `${info.sellerCarbonControl / 2}%` }}
                                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] z-20 pointer-events-none whitespace-nowrap text-center"
                              >
                                Seller {info.sellerCarbonControl}%
                              </div>
                            )}
                            {info.buyerCarbonControl > 10 && (
                              <div 
                                style={{ left: `${info.sellerCarbonControl + (info.buyerCarbonControl / 2)}%` }}
                                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] z-20 pointer-events-none whitespace-nowrap text-center"
                              >
                                Buyer {info.buyerCarbonControl}%
                              </div>
                            )}

                            {/* Precise Carbon Handover Pin Pinprinted exactly at info.sellerCarbonControl% directly ON the progress bar */}
                            <motion.div 
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1, left: `${info.sellerCarbonControl}%` }}
                              transition={{ delay: 1, type: "spring" }}
                              className="absolute top-1/2 -translate-y-1/2 -ml-4 w-8 h-8 bg-white border-4 border-slate-900 rounded-full shadow-2xl z-30 flex items-center justify-center cursor-pointer"
                              whileHover={{ scale: 1.15 }}
                            >
                              <div className="w-2.5 h-2.5 bg-slate-900 rounded-full animate-pulse" />
                              <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 w-0.5 h-12 bg-slate-900/40 -z-10" />
                              
                              {/* Floating elegant tooltip pointing down to the handover point */}
                              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-5 py-3 rounded-2xl text-[10px] font-black tracking-widest uppercase whitespace-nowrap shadow-2xl border border-white/10 text-center z-40">
                                <div className="text-emerald-400 text-[8px] font-black uppercase tracking-[0.2em] mb-0.5">Risk & Sustainability Handover</div>
                                {info.transferPoint}
                                <div className="text-[12px] leading-tight normal-case font-black mt-0.5 text-emerald-300 font-sans tracking-wide">
                                  Handover Point
                                </div>
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-slate-900" />
                              </div>
                            </motion.div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-2">
                          {info.scope3Allocation.map((segment, i) => (
                            <div key={i} className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60 shadow-inner">
                                <span className={`w-2.5 h-2.5 rounded-full ${segment.color}`} />
                                <span className="text-[9px] font-extrabold text-slate-700 uppercase tracking-widest">{segment.label} ({segment.percentage}%)</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Carbon & Risk Responsibility Allocation Cards */}
                      {(() => {
                        const breakdown = getResponsibilityBreakdown(code);
                        return (
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                              {/* Seller Responsibility Card */}
                              <div className="bg-white/90 border border-emerald-100 p-8 rounded-3xl space-y-6 shadow-sm flex flex-col justify-between hover:bg-white transition-all">
                                <div className="space-y-4">
                                  <div className="flex justify-between items-center">
                                    <span className="text-[11px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-50 border border-emerald-100/50 px-2.5 py-1 rounded-lg">
                                      Seller Scope
                                    </span>
                                    <span className="text-3xl font-black text-emerald-950 animate-pulse">
                                      {info.sellerCarbonControl}%
                                    </span>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                      <span>Transport Responsibility Split</span>
                                      <span>{info.sellerCarbonControl}% Alloc</span>
                                    </div>
                                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/70 p-0.5">
                                      <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${info.sellerCarbonControl}%` }}
                                        transition={{ delay: 0.8, duration: 1.5 }}
                                        className="h-full bg-blue-600 rounded-full shadow-[0_0_12px_rgba(37,99,235,0.25)]"
                                      />
                                    </div>
                                  </div>

                                  <div className="pt-4 border-t border-slate-100 space-y-3">
                                    <h4 className="text-xs font-black text-emerald-900 uppercase tracking-widest">
                                      Seller Includes:
                                    </h4>
                                    <ul className="space-y-2.5">
                                      {breakdown.seller.map((item, id) => (
                                        <li key={id} className="flex items-start gap-2.5 text-xs text-slate-700 font-semibold">
                                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                                          <span>{item}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>

                              {/* Buyer Responsibility Card */}
                              <div className="bg-white/90 border border-orange-100 p-8 rounded-3xl space-y-6 shadow-sm flex flex-col justify-between hover:bg-white transition-all">
                                <div className="space-y-4">
                                  <div className="flex justify-between items-center">
                                    <span className="text-[11px] font-black uppercase tracking-widest text-orange-850 bg-orange-50 border border-orange-100/50 px-2.5 py-1 rounded-lg">
                                      Buyer Scope
                                    </span>
                                    <span className="text-3xl font-black text-emerald-950 animate-pulse">
                                      {info.buyerCarbonControl}%
                                    </span>
                                  </div>

                                  <div className="space-y-2">
                                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                      <span>Transport Responsibility Split</span>
                                      <span>{info.buyerCarbonControl}% Alloc</span>
                                    </div>
                                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/70 p-0.5">
                                      <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${info.buyerCarbonControl}%` }}
                                        transition={{ delay: 1, duration: 1.5 }}
                                        className="h-full bg-orange-500 rounded-full shadow-[0_0_12px_rgba(249,115,22,0.25)]"
                                      />
                                    </div>
                                  </div>

                                  <div className="pt-4 border-t border-slate-100 space-y-3">
                                    <h4 className="text-xs font-black text-orange-950 uppercase tracking-widest">
                                      Buyer Includes:
                                    </h4>
                                    <ul className="space-y-2.5">
                                      {breakdown.buyer.map((item, id) => (
                                        <li key={id} className="flex items-start gap-2.5 text-xs text-slate-700 font-semibold">
                                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                                          <span>{item}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Key Insight Card */}
                            <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl relative z-10 space-y-3 transition-colors hover:bg-emerald-100/50 shadow-sm">
                              <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-xs uppercase tracking-widest">
                                <Info size={16} className="text-emerald-600" />
                                Sustainability & Risk Key Insight
                              </div>
                              <p className="text-xs text-slate-800 font-bold leading-relaxed">
                                {breakdown.insight}
                              </p>
                              <p className="text-[10px] text-emerald-700/60 font-medium italic leading-relaxed pt-2.5 border-t border-emerald-100">
                                Carbon emissions depend on carrier choice and transport mode, not Incoterm alone. This analysis shows data visibility and accountability structure only.
                              </p>
                            </div>
                          </>
                        );
                      })()}

                    </section>

                    {/* Section 2: CSRD Compliance & Audit Roadmap */}
                    <section className="bg-white border border-slate-200/80 rounded-[2.5rem] p-8 md:p-10 shadow-sm space-y-8 relative overflow-hidden text-slate-900 animate-fade-in">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/[0.01] rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
                      
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-6 relative z-10">
                        <div>
                          <h3 className="flex items-center gap-3 text-slate-900 font-extrabold text-2xl font-sans tracking-tight">
                            <Shield className="text-blue-600 shadow-sm rounded-lg animate-pulse" size={28} />
                            CSRD Compliance & Audit Roadmap
                          </h3>
                          <p className="text-[11px] text-slate-500 font-semibold italic mt-1">
                            A simplified 3-step operational map for greenhouse gas accounting.
                          </p>
                        </div>
                        <div className={`px-4 py-2 border rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm ${getGhgCsrdDetails(code).ratingColor}`}>
                          {getGhgCsrdDetails(code).rating}
                        </div>
                      </div>

                        {/* 3-Step Infographic Flow */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
                          
                          {/* Step 1: Boundary Setup */}
                          <div className="bg-white border border-emerald-100 rounded-[2rem] p-6 shadow-sm relative overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:border-emerald-200">
                            <div className="absolute -top-4 -left-4 w-12 h-12 bg-emerald-50 rounded-br-3xl flex items-center justify-center font-black text-xs text-emerald-800 border-r border-b border-emerald-100/50">
                              01
                            </div>
                            <div className="pt-4">
                              <div className="flex items-center gap-2 mb-3">
                                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
                                  <LayoutGrid size={16} />
                                </div>
                                <h5 className="font-extrabold text-sm uppercase tracking-wide text-slate-900">Boundary & Control</h5>
                              </div>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Operational Control</p>
                              <div className="text-sm font-extrabold text-slate-900 mb-2">{getGhgCsrdDetails(code).operationalControl}</div>
                              <p className="text-[10px] text-slate-600 leading-tight">
                                Identifies which counterparty controls the fuel burn logistics and owns Scope 3 direct bookings.
                              </p>
                            </div>
                            <div className="mt-5 pt-3 border-t border-slate-50 text-[10px] font-bold">
                              <span className="text-slate-400 uppercase tracking-widest text-[8px] block mb-0.5">ESG Standard Set</span>
                              <span className="text-emerald-800 font-black">{getGhgCsrdDetails(code).regulatoryStandard}</span>
                            </div>
                          </div>

                          {/* Step 2: Risk Check */}
                          <div className="bg-white border border-emerald-100 rounded-[2rem] p-6 shadow-sm relative overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:border-emerald-200">
                            <div className="absolute -top-4 -left-4 w-12 h-12 bg-emerald-50 rounded-br-3xl flex items-center justify-center font-black text-xs text-emerald-800 border-r border-b border-emerald-100/50">
                              02
                            </div>
                            <div className="pt-4">
                              <div className="flex items-center gap-2 mb-3">
                                <div className="p-2 rounded-xl bg-amber-50 text-amber-800">
                                  <ShieldCheck size={16} />
                                </div>
                                <h5 className="font-extrabold text-sm uppercase tracking-wide text-slate-900">Risk Assessment</h5>
                              </div>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Double-Counting Threat</p>
                              
                              <div className="my-2 flex items-center gap-2">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider border ${getGhgCsrdDetails(code).ratingColor}`}>
                                  <RefreshCcw size={8} /> {getGhgCsrdDetails(code).doubleCountingRisk} RISK
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-600 leading-tight">
                                Audits whether duplicate Scope 3 carbon entries might exist under overlapping transportation legs.
                              </p>
                            </div>
                            <div className="mt-5 pt-3 border-t border-slate-50 text-[10px] font-bold">
                              <span className="text-slate-400 uppercase tracking-widest text-[8px] block mb-0.5">Audit Evaluation</span>
                              <span className="text-slate-700 italic font-black">Carbon balance sheet reconciled</span>
                            </div>
                          </div>

                          {/* Step 3: Compliance & Reporting */}
                          <div className="bg-white border border-emerald-100 rounded-[2rem] p-6 shadow-sm relative overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:border-emerald-200">
                            <div className="absolute -top-4 -left-4 w-12 h-12 bg-emerald-50 rounded-br-3xl flex items-center justify-center font-black text-xs text-emerald-800 border-r border-b border-emerald-100/50">
                              03
                            </div>
                            <div className="pt-4">
                              <div className="flex items-center gap-2 mb-3">
                                <div className="p-2 rounded-xl bg-blue-50 text-blue-800">
                                  <Lock size={16} />
                                </div>
                                <h5 className="font-extrabold text-sm uppercase tracking-wide text-slate-900">Audit execution</h5>
                              </div>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">CSRD Disclosure Limit</p>
                              <div className="text-[11px] leading-snug text-slate-800 font-extrabold line-clamp-3">
                                {getGhgCsrdDetails(code).csrdMateriality}
                              </div>
                            </div>
                            <div className="mt-5 pt-3 border-t border-slate-50 text-[10px] font-extrabold">
                              <span className="text-slate-400 uppercase tracking-widest text-[8px] block mb-0.5">ESRS Primary Focus</span>
                              <span className="text-blue-800 block truncate">{getGhgCsrdDetails(code).esrsDisclosureRequired}</span>
                            </div>
                          </div>

                        </div>

                        {/* Audit Readiness Actions - Unified Visual Checklist */}
                        <div className="p-6 bg-emerald-50/40 border border-emerald-100 rounded-3xl space-y-4">
                          <h5 className="text-[10px] font-black uppercase tracking-widest text-emerald-900 flex items-center gap-1.5">
                            <Shield size={12} className="text-emerald-700" /> CSRD Action Checklist by Inbound Role
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Seller role block */}
                            <div className="bg-white/80 border border-slate-100 rounded-2xl p-4 space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                                <span className="text-[9px] font-black uppercase tracking-wider text-blue-950">Seller Action Plan</span>
                              </div>
                              <p className="text-xs font-black text-slate-900 leading-tight">
                                {getGhgCsrdDetails(code).auditActionSeller}
                              </p>
                              <div className="text-[9px] text-slate-500 font-semibold uppercase">
                                <span className="text-[8px] text-slate-400 block tracking-widest leading-none">Category Target</span>
                                {getGhgCsrdDetails(code).sellerScope3Category}
                              </div>
                            </div>

                            {/* Buyer role block */}
                            <div className="bg-white/80 border border-slate-100 rounded-2xl p-4 space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-600" />
                                <span className="text-[9px] font-black uppercase tracking-wider text-orange-950">Buyer Action Plan</span>
                              </div>
                              <p className="text-xs font-black text-slate-900 leading-tight">
                                {getGhgCsrdDetails(code).auditActionBuyer}
                              </p>
                              <div className="text-[9px] text-slate-500 font-semibold uppercase">
                                <span className="text-[8px] text-slate-400 block tracking-widest leading-none">Category Target</span>
                                {getGhgCsrdDetails(code).buyerScope3Category}
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>

                    {/* Section 3: Practical Carbon Reduction & Greener Path Recommendations */}
                    <section className="bg-emerald-50/40 border border-emerald-100/80 rounded-[2.5rem] p-8 md:p-10 shadow-sm space-y-8 relative overflow-hidden text-slate-900 animate-fade-in">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
                      
                      {/* Section Header */}
                      <div className="border-b border-emerald-100 pb-6 relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <h3 className="text-emerald-950 font-black text-2xl flex items-center gap-2">
                            <span>🌿</span> Sustainability & Greener Recommendations
                          </h3>
                          <p className="text-[11px] text-emerald-800 font-semibold italic mt-0.5">
                            Actionable carbon reduction insights and comparison matrices to transition to greener frameworks.
                          </p>
                        </div>
                      </div>

                      {/* Sustainability Insights lists */}
                      <div className="space-y-4 pt-6 bg-white/70 border border-emerald-100/50 rounded-3xl p-6 relative z-10">
                          <h4 className="text-xs font-black uppercase tracking-widest text-emerald-900">
                            Practical Carbon Reduction Recommendations
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {info.sustainabilityInsights.map((insight, i) => (
                              <div 
                                key={i} 
                                className={`p-4 rounded-2xl border text-[11px] leading-relaxed font-bold shadow-sm ${
                                  insight.type === 'tip' ? 'bg-emerald-50 border-emerald-100 text-emerald-900' :
                                  insight.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-900' :
                                  insight.type === 'danger' ? 'bg-red-50 border-red-200 text-red-900' :
                                  'bg-white border-slate-100 text-slate-800'
                                }`}
                              >
                                <span className="uppercase text-[8px] tracking-widest font-black block opacity-60 mb-1">
                                  {insight.type === 'tip' ? '🌱 Eco Recommendation' : insight.type}
                                </span>
                                {insight.text}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Greener Incoterm Suggestion Section */}
                        <div className="pt-8 border-t border-emerald-100 space-y-6">
                          <div>
                            <h4 className="text-sm font-black uppercase tracking-widest text-emerald-900 flex items-center gap-2">
                              <span>🌿</span> Greener Incoterm Recommendations
                            </h4>
                            <p className="text-[11px] text-emerald-800 font-semibold italic mt-0.5">
                              Strategic ESG & carbon footprint optimization pathways, mapped separately for Buyer and Seller logistics roles.
                            </p>
                          </div>

                          {(() => {
                             const splitSuggestion = getGreenerSuggestionsSeparate(code);
                             const hasBuyerOpts = splitSuggestion.buyerSuggestions.length > 0;
                             const hasSellerOpts = splitSuggestion.sellerSuggestions.length > 0;

                             const getTableMetricsForCode = (itemCode: string) => {
                               const codeUpper = itemCode.toUpperCase();
                               
                               // Criteria 1: CSRD Data Visibility
                               let csrdDataVisibility: 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM';
                               if (['DAP', 'DDP', 'DPU', 'CPT', 'CIP'].includes(codeUpper)) {
                                 csrdDataVisibility = 'HIGH';
                               } else if (['EXW', 'FAS'].includes(codeUpper)) {
                                 csrdDataVisibility = 'LOW';
                               }

                               // Criteria 2: Carbon Accountability
                               let carbonAccountability: 'Seller Accountable' | 'Shared' | 'Buyer Accountable' = 'Shared';
                               if (['DAP', 'DDP', 'DPU', 'CPT', 'CIP'].includes(codeUpper)) {
                                 carbonAccountability = 'Seller Accountable';
                               } else if (['EXW', 'FAS'].includes(codeUpper)) {
                                 carbonAccountability = 'Buyer Accountable';
                               }

                               const incData = INCOTERMS[codeUpper];
                               return {
                                 code: itemCode,
                                 csrdDataVisibility,
                                 carbonAccountability,
                                 buyerControl: incData ? incData.buyerCarbonControl : 50,
                                 sellerControl: incData ? incData.sellerCarbonControl : 50
                               };
                             };

                             const buyerFilteredCodes = [code, ...splitSuggestion.buyerSuggestions.map(s => s.code)];
                             const sellerFilteredCodes = [code, ...splitSuggestion.sellerSuggestions.map(s => s.code)];

                             const buyerComparisonData = buyerFilteredCodes.map(c => getTableMetricsForCode(c));
                             const sellerComparisonData = sellerFilteredCodes.map(c => getTableMetricsForCode(c));

                             return (
                               <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-stretch pt-2">
                                 {/* CARD 1: BUYER ESG OPTIMIZATION PATHWAY */}
                                 <div className="bg-white border border-emerald-100/90 rounded-[2rem] p-6 shadow-sm flex flex-col justify-between space-y-6">
                                   <div className="space-y-4">
                                     <div className="flex items-center justify-between border-b border-emerald-50 pb-3">
                                       <div className="flex flex-col">
                                         <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 flex items-center gap-1.5">
                                           👤 BUYER ESG PATHWAY OPTIMIZATION
                                         </span>
                                         <span className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                                           Transition path to closest, analogous greener Selection
                                         </span>
                                       </div>
                                       <span className="text-[9px] bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full font-black">
                                         {splitSuggestion.buyerSuggestions.length} Recommendations
                                       </span>
                                     </div>

                                     {hasBuyerOpts ? (
                                       <div className="space-y-3">
                                         {splitSuggestion.buyerSuggestions.map((item) => (
                                           <div key={item.code} className="border border-emerald-100 bg-emerald-50/20 rounded-2xl p-4 space-y-1">
                                             <div className="flex items-center justify-between">
                                               <span className="text-xs font-black text-emerald-950 font-mono">
                                                 Transition {code} &rarr; {item.code}
                                               </span>
                                               <span className="text-[8px] font-black bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded uppercase font-bold">
                                                 Closest Analogy
                                               </span>
                                             </div>
                                             <p className="text-[11px] text-slate-600 leading-relaxed font-bold">
                                               {item.reason}
                                             </p>
                                           </div>
                                         ))}
                                       </div>
                                     ) : (
                                       <div className="h-32 border border-dashed border-slate-200 rounded-3xl flex items-center justify-center p-4 bg-slate-50/40 text-center">
                                         <p className="text-[10px] font-bold text-slate-400">
                                           Your selected Incoterm ({code}) already offers the optimal direct logistics oversight and reporting boundaries for high-compliance buyers.
                                         </p>
                                       </div>
                                     )}
                                   </div>

                                   {/* Buyer Table */}
                                   <div className="space-y-3 pt-4 border-t border-slate-50">
                                     <div className="flex items-center justify-between">
                                       <span className="text-[10px] font-black uppercase tracking-widest text-emerald-900 block font-bold">
                                         Buyer Comparative Matrix
                                       </span>
                                       <span className="text-[8px] font-black text-emerald-800 uppercase bg-emerald-50 px-2 py-0.5 rounded-full">
                                         Filtered Results
                                       </span>
                                     </div>

                                     <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-slate-50/10">
                                       <table className="w-full text-left border-collapse">
                                         <thead>
                                           <tr className="border-b border-slate-100 bg-slate-100/50">
                                             <th className="px-3 py-2 text-[8px] font-black uppercase tracking-widest text-slate-400">Incoterm</th>
                                             <th className="px-3 py-2 text-[8px] font-black uppercase tracking-widest text-slate-400">CSRD Data Visibility</th>
                                             <th className="px-3 py-2 text-[8px] font-black uppercase tracking-widest text-slate-400">Carbon Accountability</th>
                                             <th className="px-3 py-2 text-[8px] font-black uppercase tracking-widest text-slate-400">Transport Responsibility Split</th>
                                           </tr>
                                         </thead>
                                         <tbody className="divide-y divide-slate-100 bg-white">
                                           {buyerComparisonData.map((item) => {
                                             const isCurrent = item.code === code;
                                             return (
                                               <tr 
                                                 key={item.code}
                                                 className={`transition-colors duration-150 ${
                                                   isCurrent 
                                                     ? 'bg-emerald-500/[0.02] border-l-4 border-l-emerald-600 font-bold' 
                                                     : 'hover:bg-slate-50 border-l-4 border-l-slate-200'
                                                 }`}
                                               >
                                                 <td className="px-3 py-2">
                                                   <div className="flex flex-col">
                                                     <span className={`text-xs font-black ${isCurrent ? 'text-emerald-950 font-black' : 'text-slate-700 font-mono'}`}>
                                                       {item.code}
                                                     </span>
                                                     <span className="text-[6px] font-black uppercase tracking-wider text-slate-400">
                                                       {isCurrent ? 'Active Selection' : 'Recommendation'}
                                                     </span>
                                                   </div>
                                                 </td>
                                                 <td className="px-3 py-2">
                                                   <span className={`inline-block px-1.5 py-0.5 rounded-md text-[7px] font-black uppercase tracking-wider border ${
                                                     item.csrdDataVisibility === 'HIGH' ? 'bg-emerald-500/10 text-emerald-700 border-emerald-300/30' :
                                                     item.csrdDataVisibility === 'MEDIUM' ? 'bg-amber-500/10 text-amber-700 border-amber-300/30' :
                                                     'bg-slate-100 text-slate-500 border-slate-200'
                                                   }`}>
                                                     {item.csrdDataVisibility}
                                                   </span>
                                                 </td>
                                                 <td className="px-3 py-2">
                                                   <span className={`inline-block px-1.5 py-0.5 rounded-md text-[7px] font-black uppercase tracking-wider border ${
                                                     item.carbonAccountability === 'Seller Accountable' ? 'bg-indigo-500/10 text-indigo-700 border-indigo-300/30' :
                                                     item.carbonAccountability === 'Shared' ? 'bg-purple-500/10 text-purple-700 border-purple-300/30' :
                                                     'bg-orange-500/10 text-orange-700 border-orange-300/30'
                                                   }`}>
                                                     {item.carbonAccountability}
                                                   </span>
                                                 </td>
                                                 <td className="px-3 py-2">
                                                   <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-mono tracking-tight font-bold bg-slate-100 text-slate-800 border border-slate-200">
                                                     B: <span className="font-extrabold text-slate-950">{item.buyerControl}%</span> / S: <span className="font-extrabold text-slate-950">{item.sellerControl}%</span>
                                                   </span>
                                                 </td>
                                               </tr>
                                             );
                                           })}
                                         </tbody>
                                       </table>
                                     </div>
                                   </div>
                                 </div>

                                 {/* CARD 2: SELLER ESG OPTIMIZATION PATHWAY */}
                                 <div className="bg-white border border-blue-100/90 rounded-[2rem] p-6 shadow-sm flex flex-col justify-between space-y-6">
                                   <div className="space-y-4">
                                     <div className="flex items-center justify-between border-b border-blue-50 pb-3">
                                       <div className="flex flex-col">
                                         <span className="text-[10px] font-black uppercase tracking-widest text-blue-800 flex items-center gap-1.5 font-bold">
                                           🏢 SELLER ESG PATHWAY OPTIMIZATION
                                         </span>
                                         <span className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                                           Transition path to closest, analogous greener Selection
                                         </span>
                                       </div>
                                       <span className="text-[9px] bg-blue-50 text-blue-800 px-2.5 py-1 rounded-full font-black">
                                         {splitSuggestion.sellerSuggestions.length} Recommendations
                                       </span>
                                     </div>

                                     {hasSellerOpts ? (
                                       <div className="space-y-3">
                                         {splitSuggestion.sellerSuggestions.map((item) => (
                                           <div key={item.code} className="border border-blue-100 bg-blue-50/20 rounded-2xl p-4 space-y-1">
                                             <div className="flex items-center justify-between">
                                               <span className="text-xs font-black text-blue-950 font-mono">
                                                 Transition {code} &rarr; {item.code}
                                               </span>
                                               <span className="text-[8px] font-black bg-blue-100 text-blue-900 px-1.5 py-0.5 rounded uppercase font-bold">
                                                 Closest Analogy
                                               </span>
                                             </div>
                                             <p className="text-[11px] text-slate-600 leading-relaxed font-bold">
                                               {item.reason}
                                             </p>
                                           </div>
                                         ))}
                                       </div>
                                     ) : (
                                       <div className="h-32 border border-dashed border-slate-200 rounded-3xl flex items-center justify-center p-4 bg-slate-50/40 text-center">
                                         <p className="text-[10px] font-bold text-slate-400">
                                           Peak posture reached or maximum transport custody delegated. No additional carbon-leveraging options apply to the Seller.
                                         </p>
                                       </div>
                                     )}
                                   </div>

                                   {/* Seller Table */}
                                   <div className="space-y-3 pt-4 border-t border-slate-50">
                                     <div className="flex items-center justify-between">
                                       <span className="text-[10px] font-black uppercase tracking-widest text-blue-900 block font-bold">
                                         Seller Comparative Matrix
                                       </span>
                                       <span className="text-[8px] font-black text-blue-800 uppercase bg-blue-50 px-2 py-0.5 rounded-full">
                                         Filtered Results
                                       </span>
                                     </div>

                                     <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-slate-50/10">
                                       <table className="w-full text-left border-collapse">
                                         <thead>
                                           <tr className="border-b border-slate-100 bg-slate-100/50">
                                             <th className="px-3 py-2 text-[8px] font-black uppercase tracking-widest text-slate-400">Incoterm</th>
                                             <th className="px-3 py-2 text-[8px] font-black uppercase tracking-widest text-slate-400">CSRD Data Visibility</th>
                                             <th className="px-3 py-2 text-[8px] font-black uppercase tracking-widest text-slate-400">Carbon Accountability</th>
                                             <th className="px-3 py-2 text-[8px] font-black uppercase tracking-widest text-slate-400">Transport Responsibility Split</th>
                                           </tr>
                                         </thead>
                                         <tbody className="divide-y divide-slate-100 bg-white">
                                           {sellerComparisonData.map((item) => {
                                             const isCurrent = item.code === code;
                                             return (
                                               <tr 
                                                 key={item.code}
                                                 className={`transition-colors duration-150 ${
                                                   isCurrent 
                                                     ? 'bg-blue-500/[0.02] border-l-4 border-l-blue-600 font-bold' 
                                                     : 'hover:bg-slate-50 border-l-4 border-l-slate-200'
                                                 }`}
                                               >
                                                 <td className="px-3 py-2">
                                                   <div className="flex flex-col">
                                                     <span className={`text-xs font-black ${isCurrent ? 'text-blue-950 font-black' : 'text-slate-700 font-mono'}`}>
                                                       {item.code}
                                                     </span>
                                                     <span className="text-[6px] font-black uppercase tracking-wider text-slate-400">
                                                       {isCurrent ? 'Active Selection' : 'Recommendation'}
                                                     </span>
                                                   </div>
                                                 </td>
                                                 <td className="px-3 py-2">
                                                   <span className={`inline-block px-1.5 py-0.5 rounded-md text-[7px] font-black uppercase tracking-wider border ${
                                                     item.csrdDataVisibility === 'HIGH' ? 'bg-emerald-500/10 text-emerald-700 border-emerald-300/30' :
                                                     item.csrdDataVisibility === 'MEDIUM' ? 'bg-amber-500/10 text-amber-700 border-amber-300/30' :
                                                     'bg-slate-100 text-slate-500 border-slate-200'
                                                   }`}>
                                                     {item.csrdDataVisibility}
                                                   </span>
                                                 </td>
                                                 <td className="px-3 py-2">
                                                   <span className={`inline-block px-1.5 py-0.5 rounded-md text-[7px] font-black uppercase tracking-wider border ${
                                                     item.carbonAccountability === 'Seller Accountable' ? 'bg-indigo-500/10 text-indigo-700 border-indigo-300/30' :
                                                     item.carbonAccountability === 'Shared' ? 'bg-purple-500/10 text-purple-700 border-purple-300/30' :
                                                     'bg-orange-500/10 text-orange-700 border-orange-300/30'
                                                   }`}>
                                                     {item.carbonAccountability}
                                                   </span>
                                                 </td>
                                                 <td className="px-3 py-2">
                                                   <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-mono tracking-tight font-bold bg-slate-100 text-slate-800 border border-slate-200">
                                                     B: <span className="font-extrabold text-slate-950">{item.buyerControl}%</span> / S: <span className="font-extrabold text-slate-950">{item.sellerControl}%</span>
                                                   </span>
                                                 </td>
                                               </tr>
                                             );
                                           })}
                                         </tbody>
                                       </table>
                                     </div>
                                   </div>
                                 </div>
                               </div>
                             );
                           })()}

                           {/* Disclaimer */}
                           <p className="text-[10px] text-slate-400 font-bold italic text-center max-w-2xl mx-auto leading-relaxed">
                             Carbon emissions depend on carrier choice and transport mode, not Incoterm alone. This analysis shows data visibility and accountability structure only.
                           </p>
                        </div>

                    </section>
                  </div>

                  <div className={`${(activeTab === 'all' || activeTab === 'compliance') ? 'block' : 'hidden print:block'} ${isPrintingReport ? 'print:hidden' : ''}`}>
                    {/* Institutional Standards Section */}
                    <section className="bg-white border border-slate-100 rounded-[2.5rem] p-1 shadow-sm overflow-hidden">
                      <div className="bg-slate-50 p-8 border-b border-slate-100">
                         <h3 className="flex items-center gap-3 text-slate-900 font-black text-2xl">
                          <Binary className="text-blue-600" size={28} />
                          Documentary Compliance
                        </h3>
                        <p className="text-slate-500 text-sm mt-1 font-medium italic">
                          Technical documentation mapped against Incoterms® 2020 rules, UCP 600, and ISBP 745.
                        </p>
                      </div>
                      <div className="p-8">
                        <LegalCompliance initialTerm={code} showSelector={false} showBibliography={true} />
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Risk Disclaimer - Global footer for result */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 italic text-slate-500 text-xs mt-8 max-w-4xl mx-auto mb-10">
              Based on International Chamber of Commerce (ICC) Incoterms® 2020 rules. This analysis is for informational purposes only.
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

function SummaryCard({ icon, label, responsible, details }: { icon: React.ReactNode, label: string, responsible: string, details: string }) {
  const isSeller = responsible === 'Seller';
  return (
    <div className={`p-5 rounded-3xl border flex flex-col gap-3 transition-all hover:shadow-md ${isSeller ? 'bg-blue-50/30 border-blue-100' : 'bg-orange-50/30 border-orange-100'}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSeller ? 'bg-blue-600 text-white' : 'bg-orange-500 text-white'}`}>
        {icon}
      </div>
      <div>
        <div className="text-[10px] font-black uppercase tracking-widest mb-1 text-slate-400">Stage: {label}</div>
        <div className={`text-xs font-black uppercase tracking-wider mb-2 ${isSeller ? 'text-blue-700' : 'text-orange-700'}`}>
          {responsible} Control
        </div>
        <p className="text-[10px] text-slate-500 font-medium leading-tight">{details}</p>
      </div>
    </div>
  );
}

function RoadmapItem({ icon, label, responsible, active }: { icon: React.ReactNode, label: string, responsible: string, active: boolean }) {
  return (
    <div className={`p-6 rounded-3xl flex flex-col items-center text-center gap-4 border shadow-sm transition-all hover:shadow-md ${
      active ? 'bg-white border-slate-200 scale-100' : 'bg-slate-50 border-transparent opacity-50'
    }`}>
      <div className={`p-4 rounded-2xl ${
        responsible === 'Seller' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
      }`}>
        {icon}
      </div>
      <div>
        <div className="text-sm font-black text-slate-900 mb-1">{label}</div>
        <div className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
          responsible === 'Seller' ? 'bg-blue-600 text-white' : 'bg-orange-500 text-white'
        }`}>
          {responsible}
        </div>
      </div>
    </div>
  );
}
