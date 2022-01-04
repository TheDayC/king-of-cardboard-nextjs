import React from 'react';
import { useSelector } from 'react-redux';

import Grid from './Grid';
import Loading from '../Loading';
import selector from './selector';
// import Menu from './Menu';

export const Breaks: React.FC = () => {
    const { isLoadingBreaks } = useSelector(selector);

    return (
        <div className="block relative w-full">
            <Loading show={isLoadingBreaks} />
            {/* <Menu /> */}
            <Grid />
        </div>
    );
};

export default Breaks;
