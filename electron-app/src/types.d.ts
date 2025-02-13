declare module 'js-yaml' {
  export function load(input: string): any;
  export function dump(obj: any, options?: {
    indent?: number;
    noArrayIndent?: boolean;
    skipInvalid?: boolean;
    flowLevel?: number;
    styles?: { [key: string]: any };
    schema?: any;
    sortKeys?: boolean;
    lineWidth?: number;
    noRefs?: boolean;
    noCompatMode?: boolean;
    condenseFlow?: boolean;
    quotingType?: "'" | '"';
    forceQuotes?: boolean;
    replacer?: ((key: string, value: any) => any) | null;
  }): string;
}