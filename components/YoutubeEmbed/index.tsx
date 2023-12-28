import { FC } from 'react';

interface YoutubeEmbedProps {
    embedId: string | null;
}

const YoutubeEmbed: FC<YoutubeEmbedProps> = ({ embedId }) => {
    if (!embedId) return null;

    return (
        <div className="videoResponsive">
            <iframe
                width="850"
                height="480"
                src={`https://www.youtube.com/embed/${embedId}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Embedded youtube video"
                style={{
                    //position: "absolute",
                    //top: 0,
                    //left: 0,
                    maxWidth: '100%',
                }}
            />
        </div>
    );
};

export default YoutubeEmbed;
