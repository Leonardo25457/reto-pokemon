import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  HttpError,
  extractPokemonIdFromUrl,
  normalizePokemonName,
  pokeApi,
} from "@pokemon-mf/shared";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  z-index: 2000;
  display: flex;
`;

const Panel = styled.div`
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.bg};
  display: flex;
  flex-direction: column;
  min-height: 0; /* importante para overflow en hijos */
`;

const TopBar = styled.div`
  height: 64px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bg};
`;

const TopBarInner = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Input = styled.input`
  flex: 1;
  height: 40px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.border};
  background: transparent;
  color: inherit;
`;

const Content = styled.div`
  flex: 1;
  min-height: 0; /* CLAVE */
  padding: 16px;
  overflow: auto;

  /* evita salto visual por scrollbar */
  scrollbar-gutter: stable;

  /* evita rebotes de scroll en mobile/trackpad */
  overscroll-behavior: contain;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
`;

const Card = styled.button`
  text-align: left;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.card};
  border-radius: 12px;
  padding: 12px;
  color: inherit;
  cursor: pointer;

  &:hover {
    filter: brightness(1.03);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.border};
    outline-offset: 2px;
  }
`;

const Img = styled.img`
  width: 100%;
  height: 120px;
  object-fit: contain;
  display: block;
`;

const Name = styled.div`
  font-weight: 700;
  margin-top: 8px;
  text-transform: capitalize;
`;

const Hint = styled.div`
  opacity: 0.85;
  margin: 12px 0;
`;

const ActionsRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const Button = styled.button`
  height: 40px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.card};
  color: inherit;
  cursor: pointer;

  &:hover {
    filter: brightness(1.03);
  }
`;

type Props = {
  open: boolean;
  onClose: () => void;
};

function buildArtworkUrlFromId(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export function SearchModal({ open, onClose }: Props) {
  const navigate = useNavigate();
  const [raw, setRaw] = useState("");
  const [exactQuery, setExactQuery] = useState<string | null>(null);

  const normalized = useMemo(() => normalizePokemonName(raw), [raw]);

  const contentRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const listQuery = useInfiniteQuery({
    queryKey: ["pokemon-list"],
    queryFn: ({ pageParam }) =>
      pokeApi.listPokemon(30, (pageParam as number) ?? 0),
    initialPageParam: 0,
    getNextPageParam: (last, pages) =>
      last.next ? pages.length * 30 : undefined,
    enabled: open && exactQuery === null,
    staleTime: 60_000,
  });

  const exact = useQuery({
    queryKey: ["pokemon-exact", exactQuery],
    queryFn: async () => {
      if (!exactQuery) throw new Error("missing query");
      return pokeApi.getPokemon(exactQuery);
    },
    enabled: open && Boolean(exactQuery),
    retry: false,
  });

  useEffect(() => {
    if (!open) return;

    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    setExactQuery(null);
    setRaw("");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (exactQuery !== null) return;
    const sentinel = sentinelRef.current;
    const rootEl = contentRef.current;
    if (!sentinel || !rootEl) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (!first?.isIntersecting) return;
        if (listQuery.hasNextPage && !listQuery.isFetchingNextPage) {
          void listQuery.fetchNextPage();
        }
      },
      { root: rootEl, rootMargin: "250px", threshold: 0 }
    );

    obs.observe(sentinel);
    return () => obs.disconnect();
  }, [
    open,
    exactQuery,
    listQuery.hasNextPage,
    listQuery.isFetchingNextPage,
    listQuery.fetchNextPage,
  ]);

  if (!open) return null;

  const close = () => onClose();

  const goTo = (name: string) => {
    close();
    navigate(`/pokemon/${name}`);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!normalized) return;
    setExactQuery(normalized);
  };

  const showNotFound =
    exact.isError &&
    exact.error instanceof HttpError &&
    exact.error.status === 404;

  const listItems = listQuery.data?.pages.flatMap((p) => p.results) ?? [];

  const isEmptyList =
    !listQuery.isLoading && !listQuery.isError && listItems.length === 0;

  return (
    <Overlay
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label="Buscar Pokémon"
    >
      <Panel onClick={(e) => e.stopPropagation()}>
        <TopBar>
          <TopBarInner>
            <form
              onSubmit={onSubmit}
              style={{ display: "flex", gap: 12, flex: 1 }}
            >
              <Input
                autoFocus
                value={raw}
                onChange={(e) => setRaw(e.target.value)}
                placeholder="Buscar Pokémon (nombre exacto) o explorar el listado..."
              />
              <Button type="submit">Buscar</Button>
            </form>

            <ActionsRow>
              {exactQuery !== null && (
                <Button type="button" onClick={() => setExactQuery(null)}>
                  Listado
                </Button>
              )}
              <Button type="button" onClick={close} aria-label="Cerrar">
                Cerrar
              </Button>
            </ActionsRow>
          </TopBarInner>
        </TopBar>

        <Content ref={contentRef}>
          <Container>
            {exactQuery ? (
              <>
                {exact.isLoading && <Hint>Buscando...</Hint>}
                {showNotFound && (
                  <Hint>No encontrado. Prueba otro nombre exacto.</Hint>
                )}
                {exact.isError && !showNotFound && (
                  <Hint>Ocurrió un error al buscar.</Hint>
                )}

                {exact.data && (
                  <Grid>
                    <Card onClick={() => goTo(exact.data.name)}>
                      <Img
                        src={
                          exact.data.sprites.other?.dream_world
                            ?.front_default ||
                          exact.data.sprites.other?.["official-artwork"]
                            ?.front_default ||
                          exact.data.sprites.front_default ||
                          buildArtworkUrlFromId(exact.data.id)
                        }
                        alt={exact.data.name}
                        loading="lazy"
                      />
                      <Name>{exact.data.name}</Name>
                    </Card>
                  </Grid>
                )}

                <div style={{ marginTop: 16 }}>
                  <Button type="button" onClick={() => setExactQuery(null)}>
                    Volver al listado
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Hint>
                  Explora el listado (30 por carga) o busca por nombre exacto.
                </Hint>

                {listQuery.isLoading && <Hint>Cargando...</Hint>}
                {listQuery.isError && <Hint>Error cargando el listado.</Hint>}
                {isEmptyList && <Hint>No hay resultados para mostrar.</Hint>}

                <Grid>
                  {listItems.map((item) => {
                    const id = extractPokemonIdFromUrl(item.url);
                    const img = id ? buildArtworkUrlFromId(id) : undefined;

                    return (
                      <Card key={item.name} onClick={() => goTo(item.name)}>
                        {img ? (
                          <Img src={img} alt={item.name} loading="lazy" />
                        ) : null}
                        <Name>{item.name}</Name>
                      </Card>
                    );
                  })}
                </Grid>

                <div ref={sentinelRef} style={{ height: 1 }} />

                {listQuery.isFetchingNextPage && <Hint>Cargando más...</Hint>}
                {!listQuery.hasNextPage && listItems.length > 0 && (
                  <Hint>Fin del listado.</Hint>
                )}
              </>
            )}
          </Container>
        </Content>
      </Panel>
    </Overlay>
  );
}
