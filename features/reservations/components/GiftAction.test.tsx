import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { GiftAction } from "@/features/reservations/components/GiftAction";
import type { ReserveResult } from "@/features/reservations/components/ReservationsProvider";
import {
  MAX_NAME_LENGTH,
  type Reservation,
} from "@/features/reservations/lib/reservations-api";

const mocks = vi.hoisted(() => ({ useReservations: vi.fn() }));

vi.mock("@/features/reservations/components/ReservationsProvider", () => ({
  useReservations: mocks.useReservations,
}));

const ok: ReserveResult = { ok: true };

function mockReservations({
  status = "ready",
  reservation,
  reserve = vi.fn(async () => ok),
  release = vi.fn(async () => ok),
}: {
  status?: "disabled" | "loading" | "ready" | "error";
  reservation?: Reservation;
  reserve?: (slug: string, name: string) => Promise<ReserveResult>;
  release?: (slug: string) => Promise<ReserveResult>;
} = {}) {
  mocks.useReservations.mockReturnValue({
    status,
    getReservation: () => reservation,
    ownerMode: false,
    toggleOwnerMode: vi.fn(),
    reserve,
    release,
  });

  return { reserve, release };
}

function renderGiftAction() {
  return render(
    <GiftAction productSlug="benq-screenbar-pro" productName="BenQ ScreenBar Pro" />,
  );
}

const nameField = () => screen.getByLabelText("O teu nome");
const submitButton = () => screen.getByRole("button", { name: /vou oferecer/i });

beforeEach(() => {
  mocks.useReservations.mockReset();
});

describe("GiftAction", () => {
  it("não aparece sem o serviço configurado", () => {
    // Sem Supabase, as reservas não existem — o catálogo é que é o produto.
    mockReservations({ status: "disabled" });
    const { container } = renderGiftAction();

    expect(container).toBeEmptyDOMElement();
  });

  it("não aparece quando o serviço falha", () => {
    // Um erro nas reservas não pode transformar-se em ruído numa página que
    // continua perfeitamente utilizável.
    mockReservations({ status: "error" });
    const { container } = renderGiftAction();

    expect(container).toBeEmptyDOMElement();
  });

  it("mostra o estado de espera enquanto carrega (DOD-006)", () => {
    mockReservations({ status: "loading" });
    renderGiftAction();

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.queryByLabelText("O teu nome")).not.toBeInTheDocument();
  });

  it("exige um nome antes de reservar", async () => {
    // Reservar sem nome deixava os outros visitantes sem saber quem tratou do
    // presente, que é a única coisa que a funcionalidade tem de garantir.
    const { reserve } = mockReservations();
    renderGiftAction();

    await userEvent.click(submitButton());

    expect(reserve).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent("Escreve o teu nome");
    expect(nameField()).toHaveAttribute("aria-invalid", "true");
  });

  it("não aceita um nome só com espaços", async () => {
    const { reserve } = mockReservations();
    renderGiftAction();

    await userEvent.type(nameField(), "   ");
    await userEvent.click(submitButton());

    expect(reserve).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("reserva com o nome sem espaços e limpa o campo", async () => {
    const { reserve } = mockReservations();
    renderGiftAction();

    await userEvent.type(nameField(), "  Ana  ");
    await userEvent.click(submitButton());

    await waitFor(() =>
      expect(reserve).toHaveBeenCalledWith("benq-screenbar-pro", "Ana"),
    );
    await waitFor(() => expect(nameField()).toHaveValue(""));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("limita o nome ao tamanho aceite pelo servidor", () => {
    mockReservations();
    renderGiftAction();

    expect(nameField()).toHaveAttribute("maxLength", String(MAX_NAME_LENGTH));
  });

  it("avisa quando alguém se antecipou", async () => {
    // A corrida entre o carregamento e o clique é real: duas pessoas podem
    // abrir a mesma página ao mesmo tempo.
    mockReservations({
      reserve: vi.fn(async () => ({ ok: false, reason: "taken" }) as const),
    });
    renderGiftAction();

    await userEvent.type(nameField(), "Ana");
    await userEvent.click(submitButton());

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Alguém se antecipou",
    );
  });

  it("explica quando o browser bloqueia o armazenamento local", async () => {
    mockReservations({
      reserve: vi.fn(async () => ({ ok: false, reason: "no-token" }) as const),
    });
    renderGiftAction();

    await userEvent.type(nameField(), "Ana");
    await userEvent.click(submitButton());

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "armazenamento local",
    );
  });

  it("mostra quem já vai oferecer, sem formulário", () => {
    mockReservations({
      reservation: {
        productSlug: "benq-screenbar-pro",
        reserverName: "Ana",
        isMine: false,
      },
    });
    renderGiftAction();

    expect(screen.getByText("Ana")).toBeInTheDocument();
    expect(screen.queryByLabelText("O teu nome")).not.toBeInTheDocument();
  });

  it("deixa desfazer a própria reserva", async () => {
    const { release } = mockReservations({
      reservation: {
        productSlug: "benq-screenbar-pro",
        reserverName: "Ana",
        isMine: true,
      },
    });
    renderGiftAction();

    expect(screen.getByText("Vais oferecer este.")).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", { name: /afinal já não vou/i }),
    );

    await waitFor(() =>
      expect(release).toHaveBeenCalledWith("benq-screenbar-pro"),
    );
  });

  it("avisa quando desfazer falha", async () => {
    mockReservations({
      reservation: {
        productSlug: "benq-screenbar-pro",
        reserverName: "Ana",
        isMine: true,
      },
      release: vi.fn(async () => ({ ok: false, reason: "failed" }) as const),
    });
    renderGiftAction();

    await userEvent.click(
      screen.getByRole("button", { name: /afinal já não vou/i }),
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Não foi possível desfazer",
    );
  });

  it("identifica o produto no botão para leitores de ecrã", () => {
    // Numa página com vários cartões, "Vou oferecer" sozinho não diz o quê.
    mockReservations();
    renderGiftAction();

    expect(submitButton()).toHaveAccessibleName(/BenQ ScreenBar Pro/);
  });
});
