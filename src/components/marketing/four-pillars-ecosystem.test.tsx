import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FourPillarsEcosystem } from "./four-pillars-ecosystem";

describe("FourPillarsEcosystem", () => {
  it("merender 4 pilar pembelajaran mengelilingi Matahari", () => {
    render(<FourPillarsEcosystem />);

    expect(
      screen.getByRole("heading", { name: /4 Pilar Pembelajaran Komprehensif/i }),
    ).toBeInTheDocument();

    expect(screen.getAllByText(/Learn \(Jalur Belajar\)/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Practice Labs/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Challenges/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Consultant Project/i).length).toBeGreaterThan(0);
  });

  it("menampilkan tooltip nama planet saat di-hover", () => {
    render(<FourPillarsEcosystem />);

    const merkuriusPlanet = screen.getByLabelText(/Planet Merkurius - Pilar 01 Learn/i);
    expect(merkuriusPlanet).toBeInTheDocument();

    const sunOrb = screen.getByLabelText(/Matahari - Pusat Tata Surya Pembelajaran Zenoba/i);
    expect(sunOrb).toBeInTheDocument();
  });
});
