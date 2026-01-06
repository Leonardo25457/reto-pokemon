export const EVENTS = {
  visited: "pokemon:visited",
} as const;

export type VisitedDetail = {
  name: string;
  image: string;
  visitId: number;
  visitedAt: number;
};

export function emitVisited(detail: VisitedDetail) {
  window.dispatchEvent(new CustomEvent(EVENTS.visited, { detail }));
}
