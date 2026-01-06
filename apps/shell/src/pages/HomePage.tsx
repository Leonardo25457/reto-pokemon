import styled from "styled-components";
import { useQueries } from "@tanstack/react-query";
import {
  extractPokemonIdFromUrl,
  pokeApi,
  type TypeResponse,
} from "@pokemon-mf/shared";
import { useNavigate } from "react-router-dom";

const TYPES = [
  "fire",
  "water",
  "grass",
  "electric",
  "psychic",
  "ghost",
  "dragon",
  "dark",
] as const;

const PageHeader = styled.header`
  display: grid;
  gap: 6px;
  margin-bottom: 18px;
`;

const H1 = styled.h1`
  margin: 0;
  font-size: 34px;
  letter-spacing: -0.4px;
`;

const Sub = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.muted};
  line-height: 1.45;
`;

const Sections = styled.div`
  display: grid;
  gap: 18px;
`;

const Section = styled.section`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.card};
  border-radius: 16px;
  padding: 14px;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
`;

const H2 = styled.h2`
  margin: 0;
  text-transform: capitalize;
  font-size: 18px;
  letter-spacing: -0.2px;
`;

const Counter = styled.span`
  color: ${({ theme }) => theme.muted};
  font-size: 12px;
`;

const Grid = styled.div`
  margin-top: 12px;
  display: grid;
  gap: 12px;

  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));

  @media (min-width: 1024px) {
    grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  }
`;

const Card = styled.button`
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.card2};
  border-radius: 14px;
  padding: 12px;
  color: inherit;
  text-align: left;
  cursor: pointer;

  display: grid;
  gap: 10px;

  transition: transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease,
    background 120ms ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadow};
    border-color: color-mix(
      in srgb,
      ${({ theme }) => theme.text} 14%,
      ${({ theme }) => theme.border}
    );
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }

  &:focus-visible {
    outline: 2px solid
      color-mix(in srgb, ${({ theme }) => theme.text} 22%, transparent);
    outline-offset: 2px;
  }
`;

const ImgWrap = styled.div`
  border-radius: 12px;
  background: transparent;
  display: grid;
  place-items: center;
  padding: 6px;
`;

const Img = styled.img`
  width: 100%;
  height: 120px;
  object-fit: contain;
  display: block;
`;

const Name = styled.div`
  font-weight: 900;
  text-transform: capitalize;
  letter-spacing: -0.2px;
`;

function buildArtworkUrlFromId(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

function pickFirst10(type: TypeResponse) {
  return type.pokemon.slice(0, 10).map((p) => p.pokemon);
}

export default function HomePage() {
  const navigate = useNavigate();

  const results = useQueries({
    queries: TYPES.map((t) => ({
      queryKey: ["type", t],
      queryFn: () => pokeApi.getType(t),
      staleTime: 5 * 60_000,
    })),
  });

  const anyLoading = results.some((r) => r.isLoading);
  const anyError = results.some((r) => r.isError);

  if (anyLoading) return <div>Cargando tipos...</div>;
  if (anyError) return <div>Ocurrió un error cargando tipos.</div>;

  return (
    <div>
      <PageHeader>
        <H1>Home</H1>
        <Sub>
          8 tipos, 10 Pokémon por tipo. Click en un Pokémon para ver el detalle.
        </Sub>
      </PageHeader>

      <Sections>
        {results.map((r, idx) => {
          const typeName = TYPES[idx];
          const data = r.data!;
          const items = pickFirst10(data);

          return (
            <Section key={typeName}>
              <TitleRow>
                <H2>{typeName}</H2>
                <Counter>{items.length} / 10</Counter>
              </TitleRow>

              <Grid>
                {items.map((it) => {
                  const id = extractPokemonIdFromUrl(it.url);
                  const img = id ? buildArtworkUrlFromId(id) : undefined;

                  return (
                    <Card
                      key={it.name}
                      onClick={() => navigate(`/pokemon/${it.name}`)}
                    >
                      {img ? (
                        <ImgWrap>
                          <Img src={img} alt={it.name} loading="lazy" />
                        </ImgWrap>
                      ) : null}
                      <Name>{it.name}</Name>
                    </Card>
                  );
                })}
              </Grid>
            </Section>
          );
        })}
      </Sections>
    </div>
  );
}
