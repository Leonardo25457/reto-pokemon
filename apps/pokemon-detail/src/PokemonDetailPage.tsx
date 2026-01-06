import { useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import {
  emitVisited,
  historyService,
  normalizePokemonName,
  pokeApi,
} from "@pokemon-mf/shared";

const Page = styled.div`
  width: 100%;
  padding: 8px 0 28px;
`;

const Wrap = styled.div`
  max-width: 1040px;
  margin: 0 auto;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 14px;
`;

const Button = styled.button`
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.card2};
  color: ${({ theme }) => theme.text};
  border-radius: 12px;
  padding: 10px 14px;
  font-weight: 800;
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

const Panel = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.card};
  border-radius: 18px;
  padding: 18px;
  box-shadow: ${({ theme }) => theme.shadow};
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 14px;

  @media (max-width: 720px) {
    flex-direction: column;
  }
`;

const TitleBlock = styled.div`
  display: grid;
  gap: 6px;
`;

const Name = styled.h2`
  margin: 0;
  text-transform: capitalize;
  letter-spacing: -0.3px;
  font-size: 28px;
`;

const Meta = styled.div`
  color: ${({ theme }) => theme.muted};
  font-weight: 700;
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 18px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const ImageCard = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.card2};
  border-radius: 16px;
  padding: 14px;
  display: grid;
  gap: 12px;
`;

const ImgWrap = styled.div`
  border-radius: 14px;
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  padding: 10px;
`;

const Img = styled.img`
  width: 100%;
  height: 260px;
  object-fit: contain;
  display: block;
`;

const Description = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.card};
  border-radius: 14px;
  padding: 12px;
  color: ${({ theme }) => theme.muted};
  line-height: 1.45;
`;

const Right = styled.div`
  display: grid;
  gap: 14px;
`;

const BadgeRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const Badge = styled.span`
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.card2};
  color: ${({ theme }) => theme.text};
  border-radius: 999px;
  padding: 7px 10px;
  font-size: 12px;
  font-weight: 800;
  text-transform: capitalize;
`;

const StatBlock = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.card2};
  border-radius: 16px;
  padding: 14px;
`;

const StatTitle = styled.div`
  font-weight: 900;
  margin-bottom: 10px;
  letter-spacing: -0.2px;
`;

const StatGrid = styled.div`
  display: grid;
  gap: 10px;
`;

const StatRow = styled.div`
  display: grid;
  grid-template-columns: 140px 1fr 52px;
  gap: 10px;
  align-items: center;

  @media (max-width: 520px) {
    grid-template-columns: 120px 1fr 46px;
  }
`;

const StatName = styled.div`
  text-transform: capitalize;
  color: ${({ theme }) => theme.text};
  font-weight: 700;
  opacity: 0.95;
`;

const Bar = styled.div`
  height: 10px;
  border-radius: 999px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.card};
`;

const Fill = styled.div<{ $pct: number }>`
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  background: ${({ theme }) => theme.text};
  opacity: 0.35;
`;

const StatVal = styled.div`
  text-align: right;
  color: ${({ theme }) => theme.text};
  font-weight: 800;
  opacity: 0.95;
`;

function pickImage(p: { id: number; sprites: any }) {
  return (
    p.sprites?.other?.dream_world?.front_default ||
    p.sprites?.other?.["official-artwork"]?.front_default ||
    p.sprites?.front_default ||
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`
  );
}

function niceTypeList(types: Array<{ type: { name: string } }>) {
  return types
    .slice()
    .map((t) => t.type.name)
    .join(" / ");
}

type PokemonAbility = {
  ability: { name: string };
  is_hidden?: boolean;
  slot?: number;
};

type PokemonWithAbilities = {
  abilities: PokemonAbility[];
};

export default function PokemonDetailPage() {
  const navigate = useNavigate();
  const params = useParams();

  const name = useMemo(
    () => normalizePokemonName(params.name ?? ""),
    [params.name]
  );

  const lastRegistered = useRef<number | null>(null);

  const q = useQuery({
    queryKey: ["pokemon", name],
    queryFn: () => pokeApi.getPokemon(name),
    enabled: Boolean(name),
    staleTime: 5 * 60_000,
  });

  useEffect(() => {
    if (!q.data) return;
    if (lastRegistered.current === (q.data as any).id) return;
    lastRegistered.current = (q.data as any).id;

    const image = pickImage({
      id: (q.data as any).id,
      sprites: (q.data as any).sprites,
    });

    const last = historyService.registerVisit({
      name: (q.data as any).name,
      image,
    });

    emitVisited(last);
  }, [q.data]);

  if (!name) return <div>Pokémon inválido.</div>;
  if (q.isLoading) return <div>Cargando detalle...</div>;
  if (q.isError) return <div>Error cargando el Pokémon.</div>;
  if (!q.data) return <div>No encontrado.</div>;

  const p = q.data as typeof q.data & PokemonWithAbilities;

  const image = pickImage({ id: (p as any).id, sprites: (p as any).sprites });

  const typesText = niceTypeList(
    (p as any).types
      .slice()
      .sort((a: any, b: any) => a.slot - b.slot)
      .map((t: any) => ({ type: t.type }))
  );

  const abilities = Array.isArray(p.abilities)
    ? p.abilities
        .slice()
        .sort((a, b) => (a.slot ?? 0) - (b.slot ?? 0))
        .map((a) => a.ability.name.replaceAll("-", " "))
        .join(", ")
    : "—";

  const description =
    `${(p as any).name} es un Pokémon #${
      (p as any).id
    } de tipo ${typesText}. ` + `Sus habilidades incluyen: ${abilities}.`;

  return (
    <Page>
      <Wrap>
        <TopBar>
          <Button onClick={() => navigate(-1)}>Regresar</Button>
        </TopBar>

        <Panel>
          <HeaderRow>
            <TitleBlock>
              <Name>{(p as any).name}</Name>
              <Meta>#{(p as any).id}</Meta>
            </TitleBlock>

            <BadgeRow>
              {(p as any).types
                .slice()
                .sort((a: any, b: any) => a.slot - b.slot)
                .map((t: any) => (
                  <Badge key={t.type.name}>{t.type.name}</Badge>
                ))}
            </BadgeRow>
          </HeaderRow>

          <Content>
            <ImageCard>
              <ImgWrap>
                <Img src={image} alt={(p as any).name} />
              </ImgWrap>

              <Description>{description}</Description>
            </ImageCard>

            <Right>
              <StatBlock>
                <StatTitle>Estadísticas</StatTitle>

                <StatGrid>
                  {(p as any).stats.map((s: any) => {
                    const pct = Math.min(
                      100,
                      Math.round((s.base_stat / 200) * 100)
                    );
                    return (
                      <StatRow key={s.stat.name}>
                        <StatName>{s.stat.name.replaceAll("-", " ")}</StatName>
                        <Bar>
                          <Fill $pct={pct} />
                        </Bar>
                        <StatVal>{s.base_stat}</StatVal>
                      </StatRow>
                    );
                  })}
                </StatGrid>
              </StatBlock>
            </Right>
          </Content>
        </Panel>
      </Wrap>
    </Page>
  );
}
