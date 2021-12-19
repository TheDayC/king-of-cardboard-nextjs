import React from 'react';

interface DetailsProps {
    name: string;
    tags: string[] | null;
    description: string[] | null;
}

export const Details: React.FC<DetailsProps> = ({ name, tags, description }) => (
    <React.Fragment>
        <h1 className="card-title mb-2 text-center text-xl md:text-2xl lg:text-4xl lg:text-left lg:mb-4">{name}</h1>
        <div className="flex flex-row flex-wrap justify-center items-center mb-4 space-x-2 lg:justify-start">
            {tags &&
                tags.map((tag) => (
                    <div className="badge badge-secondary badge-outline m-1" key={`tag-${tag}`}>
                        {tag}
                    </div>
                ))}
        </div>
        {description && (
            <div className="description">
                {description.map((d, i) => (
                    <p className="mb-4" key={`description-${i}`}>
                        {d}
                    </p>
                ))}
            </div>
        )}
    </React.Fragment>
);

export default Details;
