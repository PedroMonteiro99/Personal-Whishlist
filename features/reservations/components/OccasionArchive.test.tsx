import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { OccasionArchive } from "@/features/reservations/components/OccasionArchive";

const mocks = vi.hoisted(() => ({
  useReservations: vi.fn(),
  fetchReservations: vi.fn(),
  getReservationToken: vi.fn(),
}));

vi.mock("@/features/reservations/components/ReservationsProvider", () => ({
  useReservations: mocks.useReservations,
}));

vi.mock("@/features/reservations/lib/reservations-api", () => ({
  fetchReservations: mocks.fetchReservations,
  getReservationToken: mocks.getReservationToken,
}));

const products = [{ slug: "benq-screenbar-pro", name: "BenQ ScreenBar Pro" }];

beforeEach(() => {
  vi.clearAllMocks();
  mocks.useReservations.mockReturnValue({ status: "ready" });
  mocks.getReservationToken.mockReturnValue("browser-token");
  mocks.fetchReservations.mockResolvedValue([
    {
      productSlug: "benq-screenbar-pro",
      reserverName: "Rita",
      isMine: false,
    },
  ]);
});

describe("OccasionArchive", () => {
  it("mostra o nome de quem ofereceu a qualquer visitante", async () => {
    render(<OccasionArchive occasionSlug="natal-2026" products={products} />);

    expect(await screen.findByText("Rita")).toBeInTheDocument();
    expect(mocks.fetchReservations).toHaveBeenCalledWith(
      "natal-2026",
      "browser-token",
    );
    expect(
      screen.getByRole("link", { name: /BenQ ScreenBar Pro/ }),
    ).toHaveAttribute("href", "/produto/benq-screenbar-pro");
  });

  it("mantém o arquivo sem o serviço de reservas", () => {
    mocks.useReservations.mockReturnValue({ status: "disabled" });

    render(<OccasionArchive occasionSlug="natal-2026" products={products} />);

    expect(
      screen.getByRole("link", { name: /BenQ ScreenBar Pro/ }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Rita")).not.toBeInTheDocument();
    expect(mocks.fetchReservations).not.toHaveBeenCalled();
  });
});
