export interface EvalScenario {
  id: string;
  description: string;
  query: string;
  expectedBehavior: string;
}

export const scenarios: EvalScenario[] = [
  {
    id: "address_change",
    description: "Detecting address changes between rosters",
    query: "Which providers changed address this month?",
    expectedBehavior: "Returns a table of providers with address changes, including from/to values and source files."
  },
  {
    id: "missing_npi",
    description: "Missing NPI detection",
    query: "Show providers with missing NPI",
    expectedBehavior: "Lists providers without NPI or with invalid NPIs."
  },
  {
    id: "duplicate_providers",
    description: "Duplicate providers",
    query: "Find duplicate providers",
    expectedBehavior: "Identifies providers with same name/NPI but different details."
  },
  {
    id: "specialty_change",
    description: "Specialty changes",
    query: "Providers who changed specialty",
    expectedBehavior: "Shows providers with specialty updates between rosters."
  },
  {
    id: "facility_grouping",
    description: "Facility grouping",
    query: "Group providers by facility",
    expectedBehavior: "Groups providers by address or facility name."
  },
  {
    id: "new_providers",
    description: "New providers",
    query: "New providers this month",
    expectedBehavior: "Lists providers appearing for the first time."
  },
  {
    id: "inactive_providers",
    description: "Inactive providers",
    query: "Providers no longer in roster",
    expectedBehavior: "Shows providers missing from latest roster."
  },
  {
    id: "confidence_scores",
    description: "Low confidence providers",
    query: "Providers with low confidence",
    expectedBehavior: "Lists providers with confidence below threshold."
  },
  {
    id: "anomaly_detection",
    description: "Anomaly detection",
    query: "Detect anomalies in roster",
    expectedBehavior: "Highlights unusual changes or patterns."
  },
  {
    id: "summary_stats",
    description: "Summary statistics",
    query: "Roster summary",
    expectedBehavior: "Provides counts and stats about the roster."
  }
];