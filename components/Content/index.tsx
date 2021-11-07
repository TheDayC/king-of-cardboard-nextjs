/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

interface ContentProps {
    content: any[];
}

export const Content: React.FC<ContentProps> = ({ content }) => {
    return (
        <React.Fragment>
            {content &&
                content.map((node) => {
                    switch (node.nodeType) {
                        case 'heading-1':
                            return node.content.map((item: any, i: number) => (
                                <h1 key={`item-${i}`} className="text-4xl mb-2">
                                    {item.value}
                                </h1>
                            ));
                        case 'heading-2':
                            return node.content.map((item: any, i: number) => (
                                <h2 key={`item-${i}`} className="text-3xl mb-2">
                                    {item.value}
                                </h2>
                            ));
                        case 'heading-3':
                            return node.content.map((item: any, i: number) => (
                                <h3 key={`item-${i}`} className="text-2xl mb-2">
                                    {item.value}
                                </h3>
                            ));
                        case 'paragraph':
                            return node.content.map((item: any, i: number) => (
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
};

export default Content;
