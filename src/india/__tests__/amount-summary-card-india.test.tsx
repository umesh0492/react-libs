import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { AmountSummaryCardIndia } from "../components/amount-summary-card-india";
import {
  INDIA_STATES,
  INDIA_CITIES,
  getCitiesForState,
  getStateOptions,
  getCityOptions,
  isMetroCity,
} from "../locations";

describe("AmountSummaryCardIndia & Locations Test Suite", () => {
  describe("AmountSummaryCardIndia Component", () => {
    it("renders intra-state GST breakdown correctly", () => {
      const html = renderToString(
        <AmountSummaryCardIndia
          baseAmount={100000}
          gstRate={18}
          isIntraState={true}
          transportCost={2000}
          tdsPercentage={2}
        />
      );

      // Base amount
      expect(html).toContain("₹1,00,000");
      // CGST 9% (9000) and SGST 9% (9000)
      expect(html).toContain("CGST (9%)");
      expect(html).toContain("SGST (9%)");
      // Freight
      expect(html).toContain("Freight / Transport Charges");
      expect(html).toContain("₹2,000");
      // TDS 2% on 1,00,000 = 2000
      expect(html).toContain("Less: TDS u/s IT Act (2%)");
      expect(html).toContain("-₹2,000");
      // Net: 100000 + 18000 + 2000 - 2000 = 118000
      expect(html).toContain("₹1,18,000");
      expect(html).toContain("Approx. ₹1.18L");
    });

    it("renders inter-state IGST breakdown correctly", () => {
      const html = renderToString(
        <AmountSummaryCardIndia
          baseAmount={50000}
          gstRate={18}
          isIntraState={false}
        />
      );

      expect(html).toContain("IGST (18%)");
      expect(html).toContain("₹9,000");
      expect(html).toContain("₹59,000");
    });

    it("renders urgent badge when isUrgent is true", () => {
      const html = renderToString(
        <AmountSummaryCardIndia
          baseAmount={10000}
          isUrgent={true}
          urgentLabel="Priority Clearance"
        />
      );

      expect(html).toContain("Priority Clearance");
    });
  });

  describe("Locations Utilities", () => {
    it("provides complete states and union territories", () => {
      expect(INDIA_STATES.length).toBeGreaterThanOrEqual(36);
      expect(INDIA_CITIES.length).toBeGreaterThan(50);
      const mh = INDIA_STATES.find((s) => s.code === "MH");
      expect(mh).toBeDefined();
      expect(mh?.name).toBe("Maharashtra");
    });

    it("filters cities by state code", () => {
      const mhCities = getCitiesForState("MH");
      expect(mhCities.length).toBeGreaterThan(0);
      expect(mhCities.some((c) => c.name === "Mumbai")).toBe(true);
      expect(mhCities.some((c) => c.name === "Pune")).toBe(true);
    });

    it("generates select options for states and cities", () => {
      const stateOptions = getStateOptions();
      expect(stateOptions[0]?.value).toBe("");
      expect(stateOptions.length).toBe(INDIA_STATES.length + 1);

      const cityOptions = getCityOptions("KA");
      expect(cityOptions.some((c) => c.label === "Bengaluru")).toBe(true);
    });

    it("identifies metro cities correctly", () => {
      expect(isMetroCity("Mumbai")).toBe(true);
      expect(isMetroCity("Bengaluru")).toBe(true);
      expect(isMetroCity("RandomTown")).toBe(false);
    });
  });
});
