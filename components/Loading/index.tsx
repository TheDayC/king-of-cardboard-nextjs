import React from 'react';

import styles from './loading.module.css';

interface LoadingProps {
    show: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ show }) => {
    if (!show) {
        return null;
    }

    return (
        <div className={`${styles.loadingWrapper} absolute top-0 left-0 w-full h-full z-10`}>
            <button className={`btn btn-lg btn-primary btn-circle btn-ghost loading ${styles.btnCustom}`}></button>
        </div>
    );
};

export default Loading;
