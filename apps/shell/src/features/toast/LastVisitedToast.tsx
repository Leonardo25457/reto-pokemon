import { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { EVENTS, historyService, type LastVisited } from "@pokemon-mf/shared";

const Wrap = styled.div`
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 2500;
  max-width: 360px;
`;

const Toast = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.card};
  border-radius: 14px;
  padding: 12px;
  display: flex;
  gap: 12px;
  align-items: center;
  box-shadow: ${({ theme }) => theme.shadow};
`;

const ImgWrap = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 12px;
  background: ${({ theme }) => theme.card2};
  border: 1px solid ${({ theme }) => theme.border};
  display: grid;
  place-items: center;
  flex: 0 0 auto;
`;

const Img = styled.img`
  width: 56px;
  height: 56px;
  object-fit: contain;
  display: block;
`;

const Title = styled.div`
  font-weight: 900;
  letter-spacing: -0.2px;
`;

const Text = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.muted};
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 10px;
`;

const ActionBtn = styled.button`
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.card2};
  color: ${({ theme }) => theme.text};
  border-radius: 10px;
  padding: 9px 12px;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
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
`;

const GhostBtn = styled(ActionBtn)`
  background: transparent;
`;

type VisibleState = { visible: false } | { visible: true; last: LastVisited };

export function LastVisitedToast() {
  const navigate = useNavigate();
  const [state, setState] = useState<VisibleState>({ visible: false });

  const compute = useCallback((): VisibleState => {
    const last = historyService.getLastVisited();
    if (!last) return { visible: false };

    const dismissed = historyService.getToastDismissedVisitId();
    if (dismissed === last.visitId) return { visible: false };

    return { visible: true, last };
  }, []);

  useEffect(() => {
    setState(compute());

    const onVisited = () => setState(compute());

    const onStorage = (e: StorageEvent) => {
      if (!e.key) return;
      if (
        e.key.includes("pokemon_mf_history") ||
        e.key.includes("pokemon_mf_lastVisited") ||
        e.key.includes("pokemon_mf_toastDismissedVisitId")
      ) {
        setState(compute());
      }
    };

    window.addEventListener(EVENTS.visited, onVisited as EventListener);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener(EVENTS.visited, onVisited as EventListener);
      window.removeEventListener("storage", onStorage);
    };
  }, [compute]);

  if (!state.visible) return null;

  const { last } = state;

  const close = () => {
    historyService.dismissToastForVisitId(last.visitId);
    setState({ visible: false });
  };

  const go = () => {
    close();
    navigate(`/pokemon/${last.name}`);
  };

  return (
    <Wrap>
      <Toast>
        <ImgWrap>
          <Img src={last.image} alt={last.name} />
        </ImgWrap>

        <div style={{ flex: 1, minWidth: 0 }}>
          <Title>Último Pokémon visitado</Title>
          <Text style={{ textTransform: "capitalize" }}>{last.name}</Text>

          <Actions>
            <ActionBtn onClick={go}>Ver</ActionBtn>
            <GhostBtn onClick={close}>Cerrar</GhostBtn>
          </Actions>
        </div>
      </Toast>
    </Wrap>
  );
}
