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
        name: 'Packing List',
        description: 'Detailed inventory of gross/net weights and dimensions.',
        refs: [{ source: 'Incoterms 2020', article: 'A1' }, { source: 'ISBP 745', article: 'Para. C1' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'Incoterms 2020 Article A1',
        practicalNote: 'ISBP 745 specifies document must not conflict with invoice or transport docs.'
      },
      {
        name: 'Proof of delivery at premises',
        description: 'Confirmation goods are ready/collected at seller gate.',
        refs: [{ source: 'Incoterms 2020', article: 'A2' }],
        isLCRequired: false,
        whoPrepares: 'Seller',
        legalBasis: 'Incoterms 2020 Article A2',
        practicalNote: 'Under EXW the seller\'s only delivery obligation is making goods available at their own facility.'
      }
    ],
    buyerDocs: [
      {
        name: 'Export licence / customs docs',
        description: 'Formal filing to origin country customs.',
        refs: [{ source: 'Incoterms 2020', article: 'B2' }],
        isLCRequired: false,
        whoPrepares: 'Buyer',
        legalBasis: 'Incoterms 2020 Article B2',
        practicalNote: 'Buyer is responsible for export clearance — unusual for a foreign buyer.'
      },
      {
        name: 'Transport booking confirmation',
        description: 'Evidence of transport arrangement.',
        refs: [{ source: 'Incoterms 2020', article: 'B4' }],
        isLCRequired: false,
        whoPrepares: 'Buyer',
        legalBasis: 'Incoterms 2020 Article B4',
        practicalNote: 'The buyer bears all costs and risks from the moment goods are placed at their disposal.'
      },
      {
        name: 'Import licence',
        description: 'Customs clearance at destination.',
        refs: [{ source: 'Incoterms 2020', article: 'B2' }],
        isLCRequired: false,
        whoPrepares: 'Buyer',
        legalBasis: 'Incoterms 2020 Article B2',
        practicalNote: 'Standard requirement for entry into destination country.'
      },
      {
        name: 'Insurance policy',
        description: 'If desired for transit protection.',
        refs: [{ source: 'Incoterms 2020', article: 'B5' }],
        isLCRequired: false,
        whoPrepares: 'Buyer',
        legalBasis: 'Incoterms 2020 Article B5',
        practicalNote: 'Buyer\'s own expense and risk.'
      }
    ],
    note: 'Under EXW the buyer is responsible for export clearance — unusual for a foreign buyer. ICC advises using FCA instead for L/C transactions. [Incoterms 2020 · Guidance Note for EXW]'
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
        legalBasis: 'Article A1',
        practicalNote: 'Must match credit currency and terms.'
      },
      {
        name: 'Packing List',
        description: 'Details for logistics and handling.',
        refs: [{ source: 'Incoterms 2020', article: 'A1' }, { source: 'ISBP 745', article: 'Para. C1' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'Article A1',
        practicalNote: 'Essential for warehouse and carrier manifest processing.'
      },
      {
        name: 'Export licence / customs docs',
        description: 'Formal export clearance at origin.',
        refs: [{ source: 'Incoterms 2020', article: 'A2' }],
        isLCRequired: false,
        whoPrepares: 'Seller',
        legalBasis: 'Incoterms 2020 Article A2',
        practicalNote: 'Unlike EXW, the Seller is responsible for export clearance.'
      },
      {
        name: 'Delivery receipt / CMR / AWB',
        description: 'Proof of delivery to carrier at named point.',
        refs: [{ source: 'Incoterms 2020', article: 'A6' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'Incoterms 2020 Article A6',
        practicalNote: 'Serves as proof that delivery obligation is fulfilled.'
      },
      {
        name: 'On-board B/L (if buyer requests)',
        description: 'B/L with "on-board" notation for banking.',
        refs: [{ source: 'Incoterms 2020', article: 'A6' }, { source: 'UCP 600', article: 'Art. 20' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'Incoterms 2020 · A6 — 2020 amendment',
        practicalNote: 'Incoterms 2020 added a new provision allowing FCA sellers to obtain an on-board Bill of Lading at the buyer\'s request.'
      }
    ],
    buyerDocs: [
      {
        name: 'Transport booking (main carriage)',
        description: 'Instructions to selected carrier.',
        refs: [{ source: 'Incoterms 2020', article: 'B4' }],
        isLCRequired: false,
        whoPrepares: 'Buyer',
        legalBasis: 'Incoterms 2020 Article B4',
        practicalNote: 'Buyer contracts for and pays main carriage.'
      },
      {
        name: 'Import licence',
        description: 'Documentation for entry at destination.',
        refs: [{ source: 'Incoterms 2020', article: 'B2' }],
        isLCRequired: false,
        whoPrepares: 'Buyer',
        legalBasis: 'Incoterms 2020 Article B2',
        practicalNote: 'Buyer clears customs at destination.'
      },
      {
        name: 'Insurance policy',
        description: 'Optional transit protection.',
        refs: [{ source: 'Incoterms 2020', article: 'B5' }],
        isLCRequired: false,
        whoPrepares: 'Buyer',
        legalBasis: 'Incoterms 2020 Article B5',
        practicalNote: 'Highly recommended for international transit.'
      }
    ],
    note: 'Incoterms 2020 added a new provision allowing FCA sellers to obtain an on-board Bill of Lading at the buyer\'s request and cost — resolving the long-standing L/C conflict.'
  },
  CPT: {
    code: 'CPT',
    name: 'Carriage Paid To',
    sellerDocs: [
      {
        name: 'Commercial Invoice',
        description: 'Bill of sale for goods.',
        refs: [{ source: 'Incoterms 2020', article: 'A1' }, { source: 'UCP 600', article: 'Art. 18' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'Article A1',
        practicalNote: 'Must specify delivery to named destination.'
      },
      {
        name: 'Packing List',
        description: 'Details of shipment contents.',
        refs: [{ source: 'Incoterms 2020', article: 'A1' }, { source: 'ISBP 745', article: 'Para. C1' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'Article A1',
        practicalNote: 'Standard requirement for multimodal.'
      },
      {
        name: 'Export licence / customs docs',
        description: 'Export clearance at origin.',
        refs: [{ source: 'Incoterms 2020', article: 'A2' }],
        isLCRequired: false,
        whoPrepares: 'Seller',
        legalBasis: 'Article A2',
        practicalNote: 'Seller handles origin formalities.'
      },
      {
        name: 'Multimodal Transport Document',
        description: 'B/L or Air Waybill showing freight prepaid.',
        refs: [{ source: 'Incoterms 2020', article: 'A6' }, { source: 'UCP 600', article: 'Art. 19' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'Article A6',
        bankingRequirement: 'UCP 600 Art. 19. Must show "Freight Prepaid" to destination.',
        practicalNote: 'CPT does not require the seller to provide insurance.'
      },
      {
        name: 'Freight paid endorsement',
        description: 'Notation proving seller paid carriage.',
        refs: [{ source: 'UCP 600', article: 'Art. 19c(ii)' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'UCP 600 Article 19c(ii)',
        practicalNote: 'Critical for C terms where seller contracts for carriage.'
      }
    ],
    buyerDocs: [
      {
        name: 'Import licence',
        description: 'Customs filing for destination entry.',
        refs: [{ source: 'Incoterms 2020', article: 'B2' }],
        isLCRequired: false,
        whoPrepares: 'Buyer',
        legalBasis: 'Article B2',
        practicalNote: 'Buyer clears customs at destination.'
      },
      {
        name: 'Insurance policy',
        description: 'Procured at own expense.',
        refs: [{ source: 'Incoterms 2020', article: 'B5' }],
        isLCRequired: false,
        whoPrepares: 'Buyer',
        legalBasis: 'Article B5',
        practicalNote: 'Risk transfers to buyer at first carrier.'
      }
    ],
    note: 'CPT does not require the seller to provide insurance. The transport document must show freight prepaid to named destination. [UCP 600 · Art. 19] [ISBP 745 · Para. E]'
  },
  CIP: {
    code: 'CIP',
    name: 'Carriage and Insurance Paid To',
    sellerDocs: [
      {
        name: 'Commercial Invoice',
        description: 'Primary valuation doc.',
        refs: [{ source: 'Incoterms 2020', article: 'A1' }, { source: 'UCP 600', article: 'Art. 18' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'Article A1',
        practicalNote: 'Standard.'
      },
      {
        name: 'Packing List',
        description: 'Detailed inventory.',
        refs: [{ source: 'Incoterms 2020', article: 'A1' }, { source: 'ISBP 745', article: 'Para. C1' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'Article A1',
        practicalNote: 'Essential for multimodal routes.'
      },
      {
        name: 'Export licence / customs docs',
        description: 'Export clearance at origin.',
        refs: [{ source: 'Incoterms 2020', article: 'A2' }],
        isLCRequired: false,
        whoPrepares: 'Seller',
        legalBasis: 'Article A2',
        practicalNote: 'Seller responsibility.'
      },
      {
        name: 'Multimodal Transport Document',
        description: 'Negotiable or non-negotiable transport receipt.',
        refs: [{ source: 'Incoterms 2020', article: 'A6' }, { source: 'UCP 600', article: 'Art. 19' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'Article A6',
        practicalNote: 'Must show freight prepaid.'
      },
      {
        name: 'Insurance Policy / Certificate',
        description: 'Negotiable doc covering All Risks (ICC A).',
        refs: [{ source: 'Incoterms 2020', article: 'A5' }, { source: 'UCP 600', article: 'Art. 28' }, { source: 'ISBP 745', article: 'Para. K' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'Incoterms 2020 · A5',
        bankingRequirement: 'Minimum 110% CIF/CIP value coverage. UCP 600 Art 28 governs.',
        practicalNote: 'Incoterms 2020 upgraded CIP minimum insurance from ICC \'C\' to ICC \'A\' (All Risks).'
      }
    ],
    buyerDocs: [
      {
        name: 'Import licence',
        description: 'Destination customs filing.',
        refs: [{ source: 'Incoterms 2020', article: 'B2' }],
        isLCRequired: false,
        whoPrepares: 'Buyer',
        legalBasis: 'Article B2',
        practicalNote: 'Buyer responsibility.'
      },
      {
        name: 'Additional insurance (optional)',
        description: 'Extra coverage if needed.',
        refs: [{ source: 'Incoterms 2020', article: 'B5' }],
        isLCRequired: false,
        whoPrepares: 'Buyer',
        legalBasis: 'Article B5',
        practicalNote: 'Buyer may want higher limits or specific risks covered.'
      }
    ],
    note: 'Incoterms 2020 upgraded CIP minimum insurance from ICC \'C\' to ICC \'A\'. The insurance certificate presented under an L/C must cover at least 110% of CIF/CIP value. [UCP 600 · Art. 28f(ii)] [ISBP 745 · Para. K9]'
  },
  DAP: {
    code: 'DAP',
    name: 'Delivered at Place',
    sellerDocs: [
      {
        name: 'Commercial Invoice',
        description: 'Record of sale.',
        refs: [{ source: 'Incoterms 2020', article: 'A1' }, { source: 'UCP 600', article: 'Art. 18' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'Article A1',
        practicalNote: 'Standard.'
      },
      {
        name: 'Packing List',
        description: 'Details for unloading and receipt.',
        refs: [{ source: 'Incoterms 2020', article: 'A1' }, { source: 'ISBP 745', article: 'Para. C1' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'Article A1',
        practicalNote: 'Needed by both parties at destination.'
      },
      {
        name: 'Export licence / customs docs',
        description: 'Export clearance.',
        refs: [{ source: 'Incoterms 2020', article: 'A2' }],
        isLCRequired: false,
        whoPrepares: 'Seller',
        legalBasis: 'Article A2',
        practicalNote: 'Seller clears export.'
      },
      {
        name: 'Transport Document (any mode)',
        description: 'Evidence of carriage to destination.',
        refs: [{ source: 'Incoterms 2020', article: 'A6' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'Article A6',
        practicalNote: 'Rarely negotiable.'
      },
      {
        name: 'Delivery order / arrival notice',
        description: 'Instructions for actual site delivery.',
        refs: [{ source: 'Incoterms 2020', article: 'A6' }],
        isLCRequired: false,
        whoPrepares: 'Seller',
        legalBasis: 'Article A6',
        practicalNote: 'Coordination for delivery is critical.'
      }
    ],
    buyerDocs: [
      {
        name: 'Import licence / customs docs',
        description: 'Destination entry filings.',
        refs: [{ source: 'Incoterms 2020', article: 'B2' }],
        isLCRequired: false,
        whoPrepares: 'Buyer',
        legalBasis: 'Article B2',
        practicalNote: 'Buyer clears import.'
      },
      {
        name: 'Unloading arrangements',
        description: 'Equipment/labor for offloading.',
        refs: [{ source: 'Incoterms 2020', article: 'B4' }],
        isLCRequired: false,
        whoPrepares: 'Buyer',
        legalBasis: 'Article B4',
        practicalNote: 'Buyer is responsible for unloading at DAP named place.'
      },
      {
        name: 'Insurance (own expense)',
        description: 'Risk protection.',
        refs: [{ source: 'Incoterms 2020', article: 'B5' }],
        isLCRequired: false,
        whoPrepares: 'Buyer',
        legalBasis: 'Article B5',
        practicalNote: 'Buyer should insure once risk transfers at destination gate.'
      }
    ],
    note: 'DAP is rarely used with a standard L/C because the transport document may not be a negotiable bill of lading. Parties should agree on an acceptable document type under UCP 600 Art. 14. [UCP 600 · Art. 14] [Incoterms 2020 · A6]'
  },
  DPU: {
    code: 'DPU',
    name: 'Delivered at Place Unloaded',
    sellerDocs: [
      {
        name: 'Commercial Invoice',
        description: 'Standard invoice.',
        refs: [{ source: 'Incoterms 2020', article: 'A1' }, { source: 'UCP 600', article: 'Art. 18' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'Article A1',
        practicalNote: 'Must specify unloaded status.'
      },
      {
        name: 'Packing List',
        description: 'Detailed weights/measures.',
        refs: [{ source: 'Incoterms 2020', article: 'A1' }, { source: 'ISBP 745', article: 'Para. C1' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'Article A1',
        practicalNote: 'Needed for unloading tally.'
      },
      {
        name: 'Export licence / customs docs',
        description: 'Origin clearance.',
        refs: [{ source: 'Incoterms 2020', article: 'A2' }],
        isLCRequired: false,
        whoPrepares: 'Seller',
        legalBasis: 'Article A2',
        practicalNote: 'Seller responsibility.'
      },
      {
        name: 'Transport Document',
        description: 'Proof of carriage.',
        refs: [{ source: 'Incoterms 2020', article: 'A6' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'Article A6',
        practicalNote: 'Standard.'
      },
      {
        name: 'Unloading confirmation / receipt',
        description: 'Proof that offloading was completed by seller.',
        refs: [{ source: 'Incoterms 2020', article: 'A6' }],
        isLCRequired: false,
        whoPrepares: 'Seller',
        legalBasis: 'Incoterms 2020 · A6',
        practicalNote: 'The only Incoterm where the seller must unload at destination. Delivery evidence must prove unloading.'
      }
    ],
    buyerDocs: [
      {
        name: 'Import licence / customs docs',
        description: 'Import duty and tax filing.',
        refs: [{ source: 'Incoterms 2020', article: 'B2' }],
        isLCRequired: false,
        whoPrepares: 'Buyer',
        legalBasis: 'Article B2',
        practicalNote: 'Buyer clears import.'
      },
      {
        name: 'Insurance (own expense)',
        description: 'Risk protection post-unloading.',
        refs: [{ source: 'Incoterms 2020', article: 'B5' }],
        isLCRequired: false,
        whoPrepares: 'Buyer',
        legalBasis: 'Article B5',
        practicalNote: 'Buyer responsibility.'
      }
    ],
    note: 'DPU (formerly DAT) is the only Incoterm where the seller must unload at destination. The delivery evidence document must prove unloading is complete. [Incoterms 2020 · A6, Guidance Note]'
  },
  DDP: {
    code: 'DDP',
    name: 'Delivered Duty Paid',
    sellerDocs: [
      {
        name: 'Commercial Invoice',
        description: 'Bill of sale.',
        refs: [{ source: 'Incoterms 2020', article: 'A1' }, { source: 'UCP 600', article: 'Art. 18' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'Article A1',
        practicalNote: 'Includes all costs including duties.'
      },
      {
        name: 'Packing List',
        description: 'Shipment detail.',
        refs: [{ source: 'Incoterms 2020', article: 'A1' }, { source: 'ISBP 745', article: 'Para. C1' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'Article A1',
        practicalNote: 'Essential for import audit.'
      },
      {
        name: 'Export licence / customs docs',
        description: 'Origin clearance.',
        refs: [{ source: 'Incoterms 2020', article: 'A2' }],
        isLCRequired: false,
        whoPrepares: 'Seller',
        legalBasis: 'Article A2',
        practicalNote: 'Standard.'
      },
      {
        name: 'Import customs clearance docs',
        description: 'SAD or equivalent at destination.',
        refs: [{ source: 'Incoterms 2020', article: 'A2' }],
        isLCRequired: false,
        whoPrepares: 'Seller',
        legalBasis: 'Incoterms 2020 · A2',
        practicalNote: 'Seller responsibility — must act as importer of record.'
      },
      {
        name: 'Duty payment receipt / SAD',
        description: 'Proof of tax settlement at destination.',
        refs: [{ source: 'Incoterms 2020', article: 'A2' }],
        isLCRequired: false,
        whoPrepares: 'Seller',
        legalBasis: 'Article A2',
        practicalNote: 'Required to prove delivery duty paid.'
      },
      {
        name: 'Transport Document',
        description: 'Carriage evidence.',
        refs: [{ source: 'Incoterms 2020', article: 'A6' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'Article A6',
        practicalNote: 'Standard.'
      },
      {
        name: 'Delivery receipt at destination',
        description: 'Proof of door delivery.',
        refs: [{ source: 'Incoterms 2020', article: 'A6' }],
        isLCRequired: false,
        whoPrepares: 'Seller',
        legalBasis: 'Article A6',
        practicalNote: 'End of seller risk.'
      }
    ],
    buyerDocs: [
      {
        name: '(Minimal — unloading only)',
        description: 'Offloading from arriving vehicle.',
        refs: [{ source: 'Incoterms 2020', article: 'B4' }],
        isLCRequired: false,
        whoPrepares: 'Buyer',
        legalBasis: 'Incoterms 2020 · B4',
        practicalNote: 'Buyer\'s only duty.'
      }
    ],
    note: 'DDP requires the seller to hold importer-of-record status in the buyer\'s country. ICC strongly advises confirming regulatory feasibility before agreeing DDP.'
  },
  FAS: {
    code: 'FAS',
    name: 'Free Alongside Ship',
    isSeaOnly: true,
    sellerDocs: [
      {
        name: 'Commercial Invoice',
        description: 'Document of sale.',
        refs: [{ source: 'Incoterms 2020', article: 'A1' }, { source: 'UCP 600', article: 'Art. 18' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'Article A1',
        practicalNote: 'Sea/inland waterway.'
      },
      {
        name: 'Packing List',
        description: 'Weights/dims for dock handling.',
        refs: [{ source: 'Incoterms 2020', article: 'A1' }, { source: 'ISBP 745', article: 'Para. C1' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'Article A1',
        practicalNote: 'Needed for wharfage calculations.'
      },
      {
        name: 'Export licence / customs docs',
        description: 'Export clearance.',
        refs: [{ source: 'Incoterms 2020', article: 'A2' }],
        isLCRequired: false,
        whoPrepares: 'Seller',
        legalBasis: 'Article A2',
        practicalNote: 'Seller responsibility.'
      },
      {
        name: 'Alongside receipt / dock receipt',
        description: 'Proof of delivery to quay side.',
        refs: [{ source: 'Incoterms 2020', article: 'A6' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'Incoterms 2020 · A6',
        practicalNote: 'Alongside receipt is not a negotiable document.'
      }
    ],
    buyerDocs: [
      {
        name: 'Vessel nomination',
        description: 'Instruction to terminal for arrival.',
        refs: [{ source: 'Incoterms 2020', article: 'B4' }],
        isLCRequired: false,
        whoPrepares: 'Buyer',
        legalBasis: 'Incoterms 2020 · B4',
        practicalNote: 'Buyer select vessel.'
      },
      {
        name: 'Bill of Lading (via own carrier)',
        description: 'Negotiable status receipt.',
        refs: [{ source: 'Incoterms 2020', article: 'B4' }, { source: 'UCP 600', article: 'Art. 20' }],
        isLCRequired: true,
        whoPrepares: 'Buyer',
        legalBasis: 'UCP 600 · Art. 20',
        practicalNote: 'Buyer contracts for carriage.'
      },
      {
        name: 'Import licence',
        description: 'Destination clearance.',
        refs: [{ source: 'Incoterms 2020', article: 'B2' }],
        isLCRequired: false,
        whoPrepares: 'Buyer',
        legalBasis: 'Article B2',
        practicalNote: 'Standard.'
      },
      {
        name: 'Marine Insurance',
        description: 'Sea voyage protection.',
        refs: [{ source: 'Incoterms 2020', article: 'B5' }],
        isLCRequired: false,
        whoPrepares: 'Buyer',
        legalBasis: 'Article B5',
        practicalNote: 'Risk transfers alongside ship.'
      }
    ],
    note: 'FAS is used for bulk/breakbulk cargo. The alongside receipt is not a negotiable document — parties using L/Cs should clarify acceptable evidence of delivery. [UCP 600 · Art. 14c]'
  },
  FOB: {
    code: 'FOB',
    name: 'Free On Board',
    isSeaOnly: true,
    sellerDocs: [
      {
        name: 'Commercial Invoice',
        description: 'Invoice for goods.',
        refs: [{ source: 'Incoterms 2020', article: 'A1' }, { source: 'UCP 600', article: 'Art. 18' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'Article A1',
        practicalNote: 'Standard.'
      },
      {
        name: 'Packing List',
        description: 'Details for port handling.',
        refs: [{ source: 'Incoterms 2020', article: 'A1' }, { source: 'ISBP 745', article: 'Para. C1' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'Article A1',
        practicalNote: 'Essential for stowage plan.'
      },
      {
        name: 'Export licence / customs docs',
        description: 'Export clearance.',
        refs: [{ source: 'Incoterms 2020', article: 'A2' }],
        isLCRequired: false,
        whoPrepares: 'Seller',
        legalBasis: 'Article A2',
        practicalNote: 'Seller responsibility.'
      },
      {
        name: 'On-board Bill of Lading',
        description: 'Negotiable transport doc with notation.',
        refs: [{ source: 'Incoterms 2020', article: 'A6' }, { source: 'UCP 600', article: 'Art. 20' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'Incoterms 2020 · A6',
        bankingRequirement: 'Must show "on board" notation per ISBP 745 Para. E6.',
        practicalNote: 'The Bill of Lading is the most critical document under FOB L/C transactions.'
      }
    ],
    buyerDocs: [
      {
        name: 'Vessel nomination / freight booking',
        description: 'Instructions to selected vessel.',
        refs: [{ source: 'Incoterms 2020', article: 'B4' }],
        isLCRequired: false,
        whoPrepares: 'Buyer',
        legalBasis: 'Article B4',
        practicalNote: 'Buyer select vessel/carrier.'
      },
      {
        name: 'Import licence',
        description: 'Clearance at destination.',
        refs: [{ source: 'Incoterms 2020', article: 'B2' }],
        isLCRequired: false,
        whoPrepares: 'Buyer',
        legalBasis: 'Article B2',
        practicalNote: 'Buyer responsibility.'
      },
      {
        name: 'Marine Insurance',
        description: 'Sea voyage protection.',
        refs: [{ source: 'Incoterms 2020', article: 'B5' }],
        isLCRequired: false,
        whoPrepares: 'Buyer',
        legalBasis: 'Article B5',
        practicalNote: 'Risk transfers post-loading (on board).'
      }
    ],
    note: 'The Bill of Lading is the most critical document under FOB L/C transactions. It must be a full set of originals and carry the on-board notation with date. [UCP 600 · Art. 20] [ISBP 745 · Para. E2–E8]'
  },
  CFR: {
    code: 'CFR',
    name: 'Cost and Freight',
    isSeaOnly: true,
    sellerDocs: [
      {
        name: 'Commercial Invoice',
        description: 'Bill of sale.',
        refs: [{ source: 'Incoterms 2020', article: 'A1' }, { source: 'UCP 600', article: 'Art. 18' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'Article A1',
        practicalNote: 'Must specify named port of destination.'
      },
      {
        name: 'Packing List',
        description: 'Weights/dims for vessel loading.',
        refs: [{ source: 'Incoterms 2020', article: 'A1' }, { source: 'ISBP 745', article: 'Para. C1' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'Article A1',
        practicalNote: 'Standard requirement.'
      },
      {
        name: 'Export licence / customs docs',
        description: 'Export clearance.',
        refs: [{ source: 'Incoterms 2020', article: 'A2' }],
        isLCRequired: false,
        whoPrepares: 'Seller',
        legalBasis: 'Article A2',
        practicalNote: 'Seller clears export.'
      },
      {
        name: 'On-board Bill of Lading',
        description: 'Full set of originals, freight prepaid.',
        refs: [{ source: 'Incoterms 2020', article: 'A6' }, { source: 'UCP 600', article: 'Art. 20' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'Incoterms 2020 · A6',
        bankingRequirement: 'Must show "freight prepaid" per UCP 600 Art. 20a(iii).',
        practicalNote: 'Seller pays freight but does not insure.'
      },
      {
        name: 'Freight invoice (if separate)',
        description: 'Additional proof of payment.',
        refs: [{ source: 'ISBP 745', article: 'Para. C6' }],
        isLCRequired: false,
        whoPrepares: 'Seller',
        legalBasis: 'ISBP 745 Paragraph C6',
        practicalNote: 'Must not conflict with B/L freight notation.'
      }
    ],
    buyerDocs: [
      {
        name: 'Import licence',
        description: 'Destination customs entry.',
        refs: [{ source: 'Incoterms 2020', article: 'B2' }],
        isLCRequired: false,
        whoPrepares: 'Buyer',
        legalBasis: 'Article B2',
        practicalNote: 'Buyer clears import.'
      },
      {
        name: 'Marine Insurance (own expense)',
        description: 'Sea voyage protection.',
        refs: [{ source: 'Incoterms 2020', article: 'B5' }],
        isLCRequired: false,
        whoPrepares: 'Buyer',
        legalBasis: 'Article B5',
        practicalNote: 'Risk transfers to buyer on board vessel at loading port.'
      }
    ],
    note: 'Under CFR the seller pays freight but does not insure. The B/L must show "freight prepaid." [UCP 600 · Art. 14d] [ISBP 745 · Para. E4]'
  },
  CIF: {
    code: 'CIF',
    name: 'Cost, Insurance and Freight',
    isSeaOnly: true,
    sellerDocs: [
      {
        name: 'Commercial Invoice',
        description: 'Accounting/settlement document.',
        refs: [{ source: 'Incoterms 2020', article: 'A1' }, { source: 'UCP 600', article: 'Art. 18' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'Article A1/B1',
        practicalNote: 'Consistency between Invoice, B/L, and Insurance is vital.'
      },
      {
        name: 'Packing List',
        description: 'Manifest detail for sea transport.',
        refs: [{ source: 'Incoterms 2020', article: 'A1' }, { source: 'ISBP 745', article: 'Para. C1' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'Incoterms 2020 · A1',
        practicalNote: 'Must match marks on B/L.'
      },
      {
        name: 'Export licence / customs docs',
        description: 'Origin clearance.',
        refs: [{ source: 'Incoterms 2020', article: 'A2' }],
        isLCRequired: false,
        whoPrepares: 'Seller',
        legalBasis: 'Article A2',
        practicalNote: 'Seller responsibility.'
      },
      {
        name: 'On-board Bill of Lading',
        description: 'Full set of negotiable originals.',
        refs: [{ source: 'Incoterms 2020', article: 'A6' }, { source: 'UCP 600', article: 'Art. 20' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'UCP 600 · Art. 20',
        bankingRequirement: 'On-board notation with date required. Must show freight prepaid.',
        practicalNote: 'The most document-intensive term for L/C transactions.'
      },
      {
        name: 'Marine Insurance Policy/Certificate',
        description: 'Covering sea risks (ICC C minimum).',
        refs: [{ source: 'Incoterms 2020', article: 'A5' }, { source: 'UCP 600', article: 'Art. 28' }, { source: 'ISBP 745', article: 'Para. K' }],
        isLCRequired: true,
        whoPrepares: 'Seller',
        legalBasis: 'Incoterms 2020 · A5',
        bankingRequirement: 'Must cover 110% of CIF value in L/C currency.',
        practicalNote: 'CIF only requires ICC \'C\' (limited risks) cover. Upgrade may be required by contract.'
      }
    ],
    buyerDocs: [
      {
        name: 'Import licence',
        description: 'Destination clearance docs.',
        refs: [{ source: 'Incoterms 2020', article: 'B2' }],
        isLCRequired: false,
        whoPrepares: 'Buyer',
        legalBasis: 'Article B2',
        practicalNote: 'Buyer clears customs.'
      },
      {
        name: 'Additional insurance (optional)',
        description: 'Extra coverage if ICC C is insufficient.',
        refs: [{ source: 'Incoterms 2020', article: 'B5' }],
        isLCRequired: false,
        whoPrepares: 'Buyer',
        legalBasis: 'Article B5',
        practicalNote: 'Buyer responsibility.'
      }
    ],
    note: 'CIF is the most document-intensive term for L/C transactions. Three core documents — Invoice, B/L, and Insurance — must be consistent in description, value, and currency.'
  }
};
