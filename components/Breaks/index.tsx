import React from 'react';
import { useSelector } from 'react-redux';

import Grid from './Grid';
import Loading from '../Loading';
import selector from './selector';
import Menu from './Menu';

export const Breaks: React.FC = () => {
    const { isLoadingBreaks } = useSelector(selector);

    return (
        <div className="flex flex-col md:flex-row relative">
            <Loading show={isLoadingBreaks} />
            {/* <Menu /> */}
            <Grid />
        </div>
    );
};

export default Breaks;
