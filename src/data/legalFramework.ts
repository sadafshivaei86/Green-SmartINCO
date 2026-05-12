import React from 'react';

export interface LegalRef {
  source: 'Incoterms 2020' | 'UCP 600' | 'ISBP 745';
  article: string;
}

export interface LegalDoc {
  name: string;
  description: string;
  refs: LegalRef[];
  isLCRequired: boolean;
  whoPrepares: 'Seller' | 'Buyer';
  legalBasis: string;
  bankingRequirement?: string;
  practicalNote: string;
}

export interface LegalFramework {
  code: string;
  name: string;
  sellerDocs: LegalDoc[];
  buyerDocs: LegalDoc[];
  note: string;
  isSeaOnly?: boolean;
}

export const LEGAL_DATA: Record<string, LegalFramework> = {
  EXW: {
    code: 'EXW',
    name: 'Ex Works',
    sellerDocs: [
      {
        name: 'Commercial Invoice',
        description: 'Compulsory accounting document for customs and payment.',
        refs: [{ source: 'Incoterms 2020', article: 'A1' }, { source: 'UCP 600', article: 'Art. 18' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'Incoterms 2020 Article A1',
        bankingRequirement: 'Must be issued by seller, made out to applicant. UCP 600 Art 18 specifies no signature is mandatory unless stated.',
        practicalNote: 'Must match credit currency and include precise shipping marks as per ISBP 745 Paragraph C1.'
      },
      {
        name: 'Packing List / Weight Note',
        description: 'Detailed inventory of gross/net weights and dimensions.',
        refs: [{ source: 'Incoterms 2020', article: 'A1' }, { source: 'ISBP 745', article: 'Para. C1' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'Incoterms 2020 Article A1',
        bankingRequirement: 'ISBP 745 specifies document must not conflict with invoice or transport docs.',
        practicalNote: 'Essential for customs inspection and calculating container utilization at buyer\'s warehouse.'
      },
      {
        name: 'Warehouse Release Note',
        description: 'Internal document confirming goods are ready for collection at named premises.',
        refs: [{ source: 'Incoterms 2020', article: 'A2' }],
        isLCRequired: false,
        whoPrepares: 'Seller',
        legalBasis: 'Incoterms 2020 Article A2',
        practicalNote: 'Under EXW, the seller\'s only delivery obligation is making goods available at their own facility.'
      }
    ],
    buyerDocs: [
      {
        name: 'Export Customs Declaration (SAD)',
        description: 'The formal filing to origin country customs for export clearance.',
        refs: [{ source: 'Incoterms 2020', article: 'B2' }],
        isLCRequired: false,
        whoPrepares: 'Buyer',
        legalBasis: 'Incoterms 2020 Article B2',
        practicalNote: 'CRITICAL RISK: Buyer must handle local export formalities. If buyer is foreign, they may need a local agent or VAT registration.'
      },
      {
        name: 'Carrier Booking Confirmation',
        description: 'Evidence of transport arrangement for collection.',
        refs: [{ source: 'Incoterms 2020', article: 'B4' }],
        isLCRequired: false,
        whoPrepares: 'Buyer',
        legalBasis: 'Incoterms 2020 Article B4',
        practicalNote: 'The buyer bears all costs and risks from the moment goods are placed at their disposal.'
      },
      {
        name: 'Transit Insurance Policy',
        description: 'Insurance covering the full journey from seller\'s door.',
        refs: [{ source: 'Incoterms 2020', article: 'B5' }],
        isLCRequired: false,
        whoPrepares: 'Buyer',
        legalBasis: 'Article B5',
        practicalNote: 'Seller should provide info for insurance but has no duty to procure it.'
      }
    ],
    note: 'In EXW, the buyer is the exporter of record. ICC advises using FCA instead if the seller is to handle export clearance or for L/C transactions where an on-board document is needed.'
  },
  FCA: {
    code: 'FCA',
    name: 'Free Carrier',
    sellerDocs: [
      {
        name: 'Commercial Invoice',
        description: 'Primary record of transacted value for customs.',
        refs: [{ source: 'Incoterms 2020', article: 'A1' }, { source: 'UCP 600', article: 'Art. 18' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'A1',
        practicalNote: 'Must mention the exact FCA delivery point named in the contract.'
      },
      {
        name: 'Packing List',
        description: 'Details for logistics and handling.',
        refs: [{ source: 'Incoterms 2020', article: 'A1' }, { source: 'ISBP 745', article: 'Para. C1' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'A1',
        practicalNote: 'Required by carrier for container stuffing and manifest filing.'
      },
      {
        name: 'Export Clearance / SAD',
        description: 'Customs declaration for clearing export at origin.',
        refs: [{ source: 'Incoterms 2020', article: 'A2' }],
        isLCRequired: false,
        whoPrepares: 'Seller',
        legalBasis: 'A2',
        practicalNote: 'Unlike EXW, the Seller is responsible for export clearance in FCA.'
      },
      {
        name: 'Proof of Delivery to Carrier',
        description: 'FCR (Forwarder\'s Certificate of Receipt) or CMR/AWB copy.',
        refs: [{ source: 'Incoterms 2020', article: 'A6' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'A6',
        practicalNote: 'Serves as proof that the seller\'s delivery obligation is fulfilled.'
      },
      {
        name: 'On-board Bill of Lading (Option)',
        description: 'B/L with "on-board" notation for banking purposes.',
        refs: [{ source: 'Incoterms 2020', article: 'A6' }, { source: 'UCP 600', article: 'Art. 20' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'A6 (2020 Amendment)',
        bankingRequirement: 'UCP 600 Art. 20. Must show date of loading.',
        practicalNote: 'A 2020 update allows parties to agree that the seller receives an on-board B/L from the carrier at buyer cost.'
      }
    ],
    buyerDocs: [
      {
        name: 'Transport Booking (Main Carriage)',
        description: 'Instructions to the carrier for global transport.',
        refs: [{ source: 'Incoterms 2020', article: 'B4' }],
        isLCRequired: false,
        whoPrepares: 'Buyer',
        legalBasis: 'B4',
        practicalNote: 'Buyer selects the carrier and pays global freight charges.'
      }
    ],
    note: 'FCA is the most flexible term for containerized cargo. The 2020 amendment specifically addresses L/C bank requirements for on-board documents.'
  },
  CPT: {
    code: 'CPT',
    name: 'Carriage Paid To',
    sellerDocs: [
      {
        name: 'Commercial Invoice',
        description: 'Settlement document for the sold goods.',
        refs: [{ source: 'Incoterms 2020', article: 'A1' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'A1',
        practicalNote: 'Must specify the named place of destination.'
      },
      {
        name: 'Packing List',
        description: 'Detailed specification of goods in the shipment.',
        refs: [{ source: 'Incoterms 2020', article: 'A1' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'A1',
        practicalNote: 'Standard requirement for multimodal transport.'
      },
      {
        name: 'Multimodal Transport Document',
        description: 'Through Bill of Lading, Air Waybill or courier receipt.',
        refs: [{ source: 'Incoterms 2020', article: 'A6' }, { source: 'UCP 600', article: 'Art. 19' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'A6',
        bankingRequirement: 'UCP 600 Art. 19. Must show "Freight Prepaid" to destination.',
        practicalNote: 'The seller contracts for carriage to the destination, but risk transfers at the first carrier.'
      },
      {
        name: 'Export Customs Authorization',
        description: 'Proof of export clearance.',
        refs: [{ source: 'Incoterms 2020', article: 'A2' }],
        isLCRequired: false,
        whoPrepares: 'Seller',
        legalBasis: 'A2',
        practicalNote: 'Seller handles all origin formalities.'
      }
    ],
    buyerDocs: [
      {
        name: 'Import Customs Declaration',
        description: 'SAD or equivalent for import.',
        refs: [{ source: 'Incoterms 2020', article: 'B2' }],
        isLCRequired: false,
        whoPrepares: 'Buyer',
        legalBasis: 'B2',
        practicalNote: 'Buyer clears customs at destination.'
      },
      {
        name: 'Private Cargo Insurance',
        description: 'Self-procured insurance for the journey.',
        refs: [{ source: 'Incoterms 2020', article: 'B5' }],
        isLCRequired: false,
        whoPrepares: 'Buyer',
        legalBasis: 'B5',
        practicalNote: 'Highly recommended as risk transfers to buyer early in the journey.'
      }
    ],
    note: 'CPT is suitable for all modes including air and multimodal. Risk transfers at origin carrier, while costs transfer at destination.'
  },
  CIP: {
    code: 'CIP',
    name: 'Carriage and Insurance Paid To',
    sellerDocs: [
      {
        name: 'Commercial Invoice',
        description: 'Valuation for sale and customs.',
        refs: [{ source: 'Incoterms 2020', article: 'A1' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'A1',
        practicalNote: 'Standard.'
      },
      {
        name: 'Insurance Policy / Certificate',
        description: 'Negotiable insurance doc covering All Risks (ICC A).',
        refs: [{ source: 'Incoterms 2020', article: 'A5' }, { source: 'UCP 600', article: 'Art. 28' }, { source: 'ISBP 745', article: 'Para. K' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'A5',
        bankingRequirement: 'Minimum 110% CIF/CIP value coverage in the L/C currency.',
        practicalNote: 'Incoterms 2020 increased CIP insurance requirement to ICC A (All Risks).'
      },
      {
        name: 'Transport Document (Multimodal)',
        description: 'Combined transport B/L, AWB, etc.',
        refs: [{ source: 'Incoterms 2020', article: 'A6' }, { source: 'UCP 600', article: 'Art. 19' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'A6',
        practicalNote: 'Must be issued in negotiable form if required by L/C.'
      }
    ],
    buyerDocs: [
      {
        name: 'Import Clearance Docs',
        description: 'Destination customs filing.',
        refs: [{ source: 'Incoterms 2020', article: 'B2' }],
        isLCRequired: false,
        whoPrepares: 'Buyer',
        legalBasis: 'B2',
        practicalNote: 'Buyer handles VAT and duties at destination.'
      }
    ],
    note: 'CIP requires the seller to provide maximum insurance coverage (ICC A), unlike CIF which only requires ICC C.'
  },
  DAP: {
    code: 'DAP',
    name: 'Delivered at Place',
    sellerDocs: [
      {
        name: 'Commercial Invoice',
        description: 'Record of sale.',
        refs: [{ source: 'Incoterms 2020', article: 'A1' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'A1',
        practicalNote: 'Standard.'
      },
      {
        name: 'Transport Document / Delivery Order',
        description: 'Evidence of delivery ready for unloading.',
        refs: [{ source: 'Incoterms 2020', article: 'A6' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'A6',
        practicalNote: 'Seller bears all risks until delivery at the named place.'
      },
      {
        name: 'Arrival Notice',
        description: 'Coordination document for destination arrival.',
        refs: [{ source: 'Incoterms 2020', article: 'A6' }],
        isLCRequired: false,
        whoPrepares: 'Seller',
        legalBasis: 'A6',
        practicalNote: 'Instructs buyer on shipment arrival status.'
      }
    ],
    buyerDocs: [
      {
        name: 'Import Customs SAD',
        description: 'Import duty and tax filing.',
        refs: [{ source: 'Incoterms 2020', article: 'B2' }],
        isLCRequired: false,
        whoPrepares: 'Buyer',
        legalBasis: 'B2',
        practicalNote: 'Seller delivers to door, but Buyer clears customs.'
      },
      {
        name: 'Unloading Log',
        description: 'Confirmation of receipt after unloading.',
        refs: [{ source: 'Incoterms 2020', article: 'B4' }],
        isLCRequired: false,
        whoPrepares: 'Buyer',
        legalBasis: 'B4',
        practicalNote: 'Buyer is responsible for unloading the goods.'
      }
    ],
    note: 'DAP is common for road and rail. It is hard to use with L/Cs if a specific bank-negotiable document is required before arrival.'
  },
  DPU: {
    code: 'DPU',
    name: 'Delivered at Place Unloaded',
    sellerDocs: [
      {
        name: 'Commercial Invoice',
        description: 'Standard invoice.',
        refs: [{ source: 'Incoterms 2020', article: 'A1' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'A1',
        practicalNote: 'Standard.'
      },
      {
        name: 'Unloading Evidence / Tally Sheet',
        description: 'Proof that unloading at destination is completed.',
        refs: [{ source: 'Incoterms 2020', article: 'A6' }],
        isLCRequired: false,
        whoPrepares: 'Seller',
        legalBasis: 'A6',
        practicalNote: 'The only term where seller must unload. Risk transfers after unloading.'
      },
      {
        name: 'Customs Export Clearance',
        description: 'SAD for origin clearance.',
        refs: [{ source: 'Incoterms 2020', article: 'A2' }],
        isLCRequired: false,
        whoPrepares: 'Seller',
        legalBasis: 'A2',
        practicalNote: 'Seller handles all export formalities.'
      }
    ],
    buyerDocs: [
      {
        name: 'Import Entry',
        description: 'Customs clearance at destination.',
        refs: [{ source: 'Incoterms 2020', article: 'B2' }],
        isLCRequired: false,
        whoPrepares: 'Buyer',
        legalBasis: 'B2',
        practicalNote: 'Buyer clears customs.'
      }
    ],
    note: 'DPU replaces the old DAT (Delivered at Terminal) to clarify that delivery can occur anywhere, not just a terminal, as long as it is unloaded.'
  },
  DDP: {
    code: 'DDP',
    name: 'Delivered Duty Paid',
    sellerDocs: [
      {
        name: 'Commercial Invoice',
        description: 'Invoice.',
        refs: [{ source: 'Incoterms 2020', article: 'A1' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'A1',
        practicalNote: 'Standard.'
      },
      {
        name: 'Import Duty Receipt',
        description: 'Official receipt of tax payment at destination.',
        refs: [{ source: 'Incoterms 2020', article: 'A2' }],
        isLCRequired: false,
        whoPrepares: 'Seller',
        legalBasis: 'A2',
        practicalNote: 'Seller acts as importer of record. This is legally complex.'
      },
      {
        name: 'Final Delivery Pod',
        description: 'Proof of Delivery to buyer\'s door.',
        refs: [{ source: 'Incoterms 2020', article: 'A6' }],
        isLCRequired: false,
        whoPrepares: 'Seller',
        legalBasis: 'A6',
        practicalNote: 'End of all risk and cost for the seller.'
      },
      {
        name: 'Export Clearance SAD',
        description: 'Origin customs documents.',
        refs: [{ source: 'Incoterms 2020', article: 'A2' }],
        isLCRequired: false,
        whoPrepares: 'Seller',
        legalBasis: 'A2',
        practicalNote: 'Seller handles everything.'
      }
    ],
    buyerDocs: [
      {
        name: 'Inventory Receiving Note',
        description: 'Receipt of goods after unloading.',
        refs: [{ source: 'Incoterms 2020', article: 'B4' }],
        isLCRequired: false,
        whoPrepares: 'Buyer',
        legalBasis: 'B4',
        practicalNote: 'Buyer\'s only duty is unloading and checking.'
      }
    ],
    note: 'DDP is the maximum obligation for the seller. It requires the seller to handle import clearance, which might be impossible without a local entity.'
  },
  FAS: {
    code: 'FAS',
    name: 'Free Alongside Ship',
    isSeaOnly: true,
    sellerDocs: [
      {
        name: 'Commercial Invoice',
        description: 'Invoice.',
        refs: [{ source: 'Incoterms 2020', article: 'A1' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'A1',
        practicalNote: 'Standard.'
      },
      {
        name: 'Alongside Dock Receipt',
        description: 'Non-negotiable proof of delivery to ship side.',
        refs: [{ source: 'Incoterms 2020', article: 'A6' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'A6',
        practicalNote: 'Common in breakbulk or heavy lift cargo.'
      },
      {
        name: 'Export Clearance SAD',
        description: 'Origin clearance docs.',
        refs: [{ source: 'Incoterms 2020', article: 'A2' }],
        isLCRequired: false,
        whoPrepares: 'Seller',
        legalBasis: 'A2',
        practicalNote: 'Seller clears the goods.'
      }
    ],
    buyerDocs: [
      {
        name: 'Vessel Nomination / Booking',
        description: 'Instructions to port for ship readiness.',
        refs: [{ source: 'Incoterms 2020', article: 'B4' }],
        isLCRequired: false,
        whoPrepares: 'Buyer',
        legalBasis: 'B4',
        practicalNote: 'Buyer must coordinate ship arrival with seller\'s delivery.'
      },
      {
        name: 'Marine Insurance Policy',
        description: 'Insurance for sea transit.',
        refs: [{ source: 'Incoterms 2020', article: 'B5' }],
        isLCRequired: false,
        whoPrepares: 'Buyer',
        legalBasis: 'B5',
        practicalNote: 'Highly recommended for sea transit.'
      }
    ],
    note: 'FAS is only for sea transport. It is mostly used for bulk goods where the cargo is placed on the quay next to the vessel.'
  },
  FOB: {
    code: 'FOB',
    name: 'Free On Board',
    isSeaOnly: true,
    sellerDocs: [
      {
        name: 'Commercial Invoice',
        description: 'Record of sale.',
        refs: [{ source: 'Incoterms 2020', article: 'A1' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'A1',
        practicalNote: 'Standard.'
      },
      {
        name: 'Shipped On Board Bill of Lading',
        description: 'Clean negotiable transport document.',
        refs: [{ source: 'Incoterms 2020', article: 'A6' }, { source: 'UCP 600', article: 'Art. 20' }, { source: 'ISBP 745', article: 'Para. E6' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'A6',
        bankingRequirement: 'Must be issued in a full set of originals and show "Clean On Board".',
        practicalNote: 'Risk transfers once goods are "On Board".'
      },
      {
        name: 'Packing List',
        description: 'Detailed weights and counts.',
        refs: [{ source: 'Incoterms 2020', article: 'A1' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'A1',
        practicalNote: 'Needed for port loading tally.'
      }
    ],
    buyerDocs: [
      {
        name: 'Ship Nomination / Booking',
        description: 'Freight arrangement with carrier.',
        refs: [{ source: 'Incoterms 2020', article: 'B4' }],
        isLCRequired: false,
        whoPrepares: 'Buyer',
        legalBasis: 'B4',
        practicalNote: 'Buyer pays sea freight and selects the vessel.'
      },
      {
        name: 'Import Clearance Docs',
        description: 'SAD at destination.',
        refs: [{ source: 'Incoterms 2020', article: 'B2' }],
        isLCRequired: false,
        whoPrepares: 'Buyer',
        legalBasis: 'B2',
        practicalNote: 'Standard.'
      }
    ],
    note: 'FOB is often misused for containerized cargo; ICC recommends FCA for containers instead. The B/L is the core document for FOB L/Cs.'
  },
  CFR: {
    code: 'CFR',
    name: 'Cost and Freight',
    isSeaOnly: true,
    sellerDocs: [
      {
        name: 'Commercial Invoice',
        description: 'Invoice.',
        refs: [{ source: 'Incoterms 2020', article: 'A1' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'A1',
        practicalNote: 'Standard.'
      },
      {
        name: 'On-board Bill of Lading (Prepaid)',
        description: 'Negotiable B/L showing freight paid.',
        refs: [{ source: 'Incoterms 2020', article: 'A6' }, { source: 'UCP 600', article: 'Art. 20' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'A6',
        bankingRequirement: 'Must show "Freight Prepaid" notation.',
        practicalNote: 'Seller pays for sea transport but risk transfers at loading port.'
      },
      {
        name: 'Export Custom Document',
        description: 'Cleared SAD.',
        refs: [{ source: 'Incoterms 2020', article: 'A2' }],
        isLCRequired: false,
        whoPrepares: 'Seller',
        legalBasis: 'A2',
        practicalNote: 'Seller clears for export.'
      }
    ],
    buyerDocs: [
      {
        name: 'Destination Import Doc',
        description: 'SAD for destination.',
        refs: [{ source: 'Incoterms 2020', article: 'B2' }],
        isLCRequired: false,
        whoPrepares: 'Buyer',
        legalBasis: 'B2',
        practicalNote: 'Buyer clears customs.'
      },
      {
        name: 'Sea Cargo Insurance',
        description: 'Insurance for the voyage.',
        refs: [{ source: 'Incoterms 2020', article: 'B5' }],
        isLCRequired: false,
        whoPrepares: 'Buyer',
        legalBasis: 'B5',
        practicalNote: 'Strongly advised as risk transfers to buyer once on board.'
      }
    ],
    note: 'CFR is for sea transport. The seller is responsible for the transport contract but not for insurance.'
  },
  CIF: {
    code: 'CIF',
    name: 'Cost, Insurance and Freight',
    isSeaOnly: true,
    sellerDocs: [
      {
        name: 'Commercial Invoice',
        description: 'Valuation doc.',
        refs: [{ source: 'Incoterms 2020', article: 'A1' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'A1',
        practicalNote: 'Standard.'
      },
      {
        name: 'On-board Bill of Lading',
        description: 'Full set of negotiable B/Ls.',
        refs: [{ source: 'Incoterms 2020', article: 'A6' }, { source: 'UCP 600', article: 'Art. 20' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'A6',
        bankingRequirement: 'Clean on-board Bill of Lading issued to order.',
        practicalNote: 'The master document in CIF transactions.'
      },
      {
        name: 'Marine Insurance Policy',
        description: 'Cargo insurance certificate (ICC C minimum).',
        refs: [{ source: 'Incoterms 2020', article: 'A5' }, { source: 'UCP 600', article: 'Art. 28' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'A5',
        bankingRequirement: '110% of CIF value, covering from port to port.',
        practicalNote: 'CIF only requires ICC C (limited risks) coverage. Buyers may request higher coverage.'
      }
    ],
    buyerDocs: [
      {
        name: 'Import Clearance SAD',
        description: 'Standard customs filing.',
        refs: [{ source: 'Incoterms 2020', article: 'B2' }],
        isLCRequired: false,
        whoPrepares: 'Buyer',
        legalBasis: 'B2',
        practicalNote: 'Buyer handles all destination duties.'
      }
    ],
    note: 'CIF is the most widely used sea term for L/C transactions. Consistency between Invoice, B/L, and Insurance is vital for payment.'
  }
};
