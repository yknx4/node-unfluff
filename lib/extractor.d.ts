/// <reference types="cheerio" />
declare const _default: {
    date(doc: cheerio.Root): string | null;
    copyright(doc: cheerio.Root): string | null;
    author(doc: cheerio.Root): string[];
    publisher(doc: cheerio.Root): string | null;
    title(doc: cheerio.Root): string;
    softTitle(doc: cheerio.Root): string;
    text(doc: cheerio.Root, topNode: cheerio.Cheerio | null | undefined, lang: 'es' | 'en'): string;
    image(doc: cheerio.Root): string | null;
    links(doc: cheerio.Root, topNode: cheerio.Cheerio, lang: 'es' | 'en'): {
        text: string;
        href: any;
    }[];
    videos(doc: cheerio.Root, topNode: cheerio.Cheerio): {
        src: string;
        height: string;
        width: string;
    }[];
    favicon(doc: cheerio.Root): string | undefined;
    lang(doc: cheerio.Root): 'es' | 'en' | null;
    description(doc: cheerio.Root): string | undefined;
    keywords(doc: cheerio.Root): string | undefined;
    canonicalLink(doc: cheerio.Root): string | undefined;
    tags(doc: cheerio.Root): string[];
    calculateBestNode(doc: cheerio.Root, lang: 'es' | 'en'): cheerio.Cheerio;
};
export default _default;
//# sourceMappingURL=extractor.d.ts.map