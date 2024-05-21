interface mountProps {
  mount: HTMLElement
}
export function render(element: string, mountContainer?: mountProps): DocumentFragment | HTMLElement;
export function html(strings: TemplateStringsArray, ...values: any[]): string;
export function groupBy<T>(array: T[], keyGetter: (item: T) => any): Map<string, Array<any>>;
export function loadComponentCSS(url: string): void;
export function clamp(value: number, min: number, max: number): number;
