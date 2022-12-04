import React from 'react';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';

interface TitleProps {
    title: string;
}

export const Title: React.FC<TitleProps> = ({ title }) => {
    return (
        <h3 className="text-white text-2xl px-4 py-2 border-b-4 border-primary text-center leading-4">
            <MdOutlineAdminPanelSettings className="w-6 h-6 inline-block mr-2 mb-1" />
            {title}
        </h3>
    );
};

export default Title;
