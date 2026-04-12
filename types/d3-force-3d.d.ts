declare module "d3-force-3d" {
  export function forceSimulation<N>(nodes?: N[]): Simulation<N>
  export function forceLink<N>(links?: unknown[]): ForceLink<N>
  export function forceManyBody<N>(): ForceManyBody<N>
  export function forceCenter<N>(x?: number, y?: number, z?: number): Force<N>

  interface Simulation<N> {
    numDimensions(n: number): this
    force(name: string, force: Force<N> | null): this
    stop(): this
    tick(): this
    nodes(): N[]
    nodes(nodes: N[]): this
  }

  interface ForceLink<N> extends Force<N> {
    id(fn: (d: N) => string): this
    distance(d: number): this
    links(): unknown[]
    links(links: unknown[]): this
  }

  interface ForceManyBody<N> extends Force<N> {
    strength(s: number): this
  }

  interface Force<N> {
    (alpha: number): void
    initialize?(nodes: N[]): void
  }
}
