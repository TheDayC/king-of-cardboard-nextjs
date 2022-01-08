import React from 'react';

import { ContentJSON } from '../../types/pages';

interface ContentProps {
    content: ContentJSON[];
}

export const Content: React.FC<ContentProps> = ({ content }) => (
    <React.Fragment>
        {content &&
            content.map((node) => {
                switch (node.nodeType) {
                    case 'heading-1':
                        return node.content.map((item, i) => (
                            <h1 key={`item-${i}`} className="text-4xl mb-4" role="heading" data-testid="h1">
                                {item.value}
                            </h1>
                        ));
                    case 'heading-2':
                        return node.content.map((item, i) => (
                            <h2 key={`item-${i}`} className="text-3xl mb-2" role="heading" data-testid="h2">
                                {item.value}
                            </h2>
                        ));
                    case 'heading-3':
                        return node.content.map((item, i) => (
                            <h3 key={`item-${i}`} className="text-2xl mb-2" role="heading" data-testid="h3">
                                {item.value}
                            </h3>
                        ));
                    case 'paragraph':
                        return node.content.map((item, i) => (
                            <p key={`item-${i}`} className="mb-6">
                                {item.value}
                            </p>
                        ));
                    default:
                        return null;
                }
            })}
    </React.Fragment>
);

export default Content;
