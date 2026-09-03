import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import * as React from "react";
import { CourseCatalogGrid } from "./course-catalog-grid";
import type { CatalogCourseCard } from "../catalog";

describe("CourseCatalogGrid", () => {
  const mockCourses: CatalogCourseCard[] = [
    {
      id: "c-1",
      slug: "networking",
      title: "Network Foundations",
      track: "networking",
      accessTier: "FREE",
      catalogStatus: "AVAILABLE",
      description: "Fondasi dasar jaringan komputer",
      orderIndex: 1,
      accessLabel: "Gratis",
      availabilityLabel: "Tersedia",
      priceLabel: "Gratis",
      canCheckout: false,
      isOwned: true,
    },
    {
      id: "c-2",
      slug: "cctv",
      title: "CCTV & Video Surveillance",
      track: "cctv",
      accessTier: "PREMIUM",
      catalogStatus: "COMING_SOON",
      description: "IP Camera dan NVR",
      orderIndex: 2,
      accessLabel: "Premium",
      availabilityLabel: "Coming soon",
      priceLabel: "Price announced at launch",
      canCheckout: false,
      isOwned: false,
    },
  ];

  it("renders course cards with honest labels and buttons", () => {
    render(<CourseCatalogGrid courses={mockCourses} />);

    expect(screen.getByText("Network Foundations")).toBeDefined();
    expect(screen.getByText("CCTV & Video Surveillance")).toBeDefined();

    // Free course has direct learning action
    const startLearningLink = screen.getByRole("link", { name: /Mulai Belajar/i });
    expect(startLearningLink.getAttribute("href")).toBe("/learn");

    // Coming soon course shows honest label and disabled button
    expect(screen.getByText("Price announced at launch")).toBeDefined();
    const comingSoonButton = screen.getByRole("button", { name: /Segera Hadir/i });
    expect(comingSoonButton.hasAttribute("disabled")).toBe(true);
  });
});
