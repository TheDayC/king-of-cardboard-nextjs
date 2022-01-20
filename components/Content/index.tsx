import React, { ReactNode } from 'react';
import { BLOCKS, MARKS, INLINES, Document, Block, Inline } from '@contentful/rich-text-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

import { parseAsString, safelyParse } from '../../utils/parsers';
import Image from 'next/image';
import { fetchAsset } from '../../utils/content';
import ContentImage from './ContentImage';

interface ContentProps {
    content: Document[];
}

const options = {
    renderMark: {
        [MARKS.BOLD]: (text: ReactNode) => <span className="font-bold">{text}</span>,
        [MARKS.ITALIC]: (text: ReactNode) => <span className="italic">{text}</span>,
        [MARKS.CODE]: (text: ReactNode) => <code>{text}</code>,
        [MARKS.UNDERLINE]: (text: ReactNode) => <span className="underline">{text}</span>,
    },
    renderNode: {
        [BLOCKS.PARAGRAPH]: (node: Block | Inline, children: ReactNode) => <p className="mb-4">{children}</p>,
        [BLOCKS.HEADING_1]: (node: Block | Inline, children: ReactNode) => (
            <h1 className="text-4xl lg:text-5xl mb-4" role="heading" data-testid="h1">
                {children}
            </h1>
        ),
        [BLOCKS.HEADING_2]: (node: Block | Inline, children: ReactNode) => (
            <h2 className="text-3xl lg:text-4xl my-4 lg:mb-6 lg:mt-8" role="heading" data-testid="h2">
                {children}
            </h2>
        ),
        [BLOCKS.HEADING_3]: (node: Block | Inline, children: ReactNode) => (
            <h3 className="text-2xl lg:text-3xl my-4 lg:mb-4 lg:mt-6" role="heading" data-testid="h3">
                {children}
            </h3>
        ),
        [BLOCKS.HEADING_4]: (node: Block | Inline, children: ReactNode) => (
            <h4 className="text-xl lg:text-2xl my-4" role="heading" data-testid="h4">
                {children}
            </h4>
        ),
        [BLOCKS.HEADING_5]: (node: Block | Inline, children: ReactNode) => (
            <h5 className="text-lg lg:text-xl my-4" role="heading" data-testid="h5">
                {children}
            </h5>
        ),
        [BLOCKS.UL_LIST]: (node: Block | Inline, children: ReactNode) => (
            <ul className="list-disc pl-6 lg:pl-10">{children}</ul>
        ),
        [BLOCKS.OL_LIST]: (node: Block | Inline, children: ReactNode) => (
            <ol className="list-decimal pl-6 lg:pl-10">{children}</ol>
        ),
        [INLINES.HYPERLINK]: (node: Block | Inline, children: ReactNode) => (
            <a
                href={safelyParse(node, 'data.uri', parseAsString, '')}
                className="text-secondary cursor-pointer hover:underline"
            >
                {children}
            </a>
        ),
        [BLOCKS.EMBEDDED_ASSET]: (node: Block | Inline) => (
            <ContentImage assetId={safelyParse(node, 'data.target.sys.id', parseAsString, '')} />
        ),
    },
};

export const Content: React.FC<ContentProps> = ({ content }) => (
    <React.Fragment>
        {content.map((document, i) => (
            <React.Fragment key={`document-${i}`}>{documentToReactComponents(document, options)}</React.Fragment>
        ))}
    </React.Fragment>
);

export default Content;
