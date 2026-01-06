import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { EVENTS, historyService, type HistoryItem } from "@pokemon-mf/shared";

const Wrap = styled.div`
  max-width: 920px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
`;

const List = styled.div`
  margin-top: 12px;
  display: grid;
  gap: 12px;
`;

const Card = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.card};
  border-radius: 12px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Img = styled.img`
  width: 56px;
  height: 56px;
  object-fit: contain;
`;

const Name = styled.div`
  font-weight: 800;
  text-transform: capitalize;
`;

const Meta = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.muted};
`;

const BtnRow = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.card2};
  color: ${({ theme }) => theme.text};
  border-radius: 10px;
  padding: 9px 12px;
  font-weight: 800;
  cursor: pointer;
  line-height: 1;
  transition: transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadow};
  }

  &:active {
    transform: translateY(0);
    opacity: 0.92;
    box-shadow: none;
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const GhostButton = styled(Button)`
  background: transparent;
`;

export default function HistoryPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<HistoryItem[]>(() => historyService.list());

  const empty = useMemo(() => items.length === 0, [items.length]);

  const refresh = () => setItems(historyService.list());

  useEffect(() => {
    const onVisited = () => refresh();

    const onStorage = (e: StorageEvent) => {
      if (!e.key) return;
      if (
        e.key.includes("pokemon_mf_history") ||
        e.key.includes("pokemon_mf_lastVisited")
      ) {
        refresh();
      }
    };

    window.addEventListener(EVENTS.visited, onVisited as EventListener);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener(EVENTS.visited, onVisited as EventListener);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const clear = () => {
    historyService.clear();
    refresh();
  };

  return (
    <Wrap>
      <Header>
        <div>
          <h2 style={{ margin: 0 }}>Historial</h2>
          <div style={{ marginTop: 6, color: "inherit", opacity: 0.85 }}>
            Visitas acumuladas por Pokémon.
          </div>
        </div>

        <BtnRow>
          <GhostButton onClick={refresh}>Refrescar</GhostButton>
          <Button onClick={clear} disabled={empty}>
            Limpiar
          </Button>
        </BtnRow>
      </Header>

      {empty ? (
        <div style={{ marginTop: 16, color: "inherit", opacity: 0.85 }}>
          Aún no hay historial.
        </div>
      ) : (
        <List>
          {items.map((it) => (
            <Card key={it.name}>
              <Img src={it.image} alt={it.name} />
              <div style={{ flex: 1 }}>
                <Name>{it.name}</Name>
                <Meta>Visitas: {it.visits}</Meta>
              </div>
              <Button onClick={() => navigate(`/pokemon/${it.name}`)}>Ver</Button>
            </Card>
          ))}
        </List>
      )}
    </Wrap>
  );
}
