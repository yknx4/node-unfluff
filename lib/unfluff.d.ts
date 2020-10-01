declare function unfluff(html: string, language?: 'es' | 'en'): {
    title: string;
    softTitle: string;
    date: string | null;
    author: string[];
    publisher: string | null;
    copyright: string | null;
    favicon: string | undefined;
    description: string | undefined;
    keywords: string | undefined;
    lang: "en" | "es";
    canonicalLink: string | undefined;
    tags: string[];
    image: string | null;
    videos: never[];
    links: never[];
    text: string;
};
declare namespace unfluff {
    var lazy: (html: string, language?: "en" | "es" | undefined) => {
        title(): string;
        softTitle(): string;
        date(): string | null;
        copyright(): string | null;
        author(): string[];
        publisher(): string | null;
        favicon(): string | undefined;
        description(): string | undefined;
        keywords(): string | undefined;
        lang(): "en" | "es" | null;
        canonicalLink(): string | undefined;
        tags(): string[];
        image(): string | null;
        videos(): {
            src: string;
            height: string;
            width: string;
        }[];
        text(): string;
        links(): {
            text: string;
            href: any;
        }[];
    };
}
export default unfluff;
//# sourceMappingURL=unfluff.d.ts.map