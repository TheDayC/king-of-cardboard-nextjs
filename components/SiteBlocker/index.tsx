import React from 'react';

import styles from './siteblocker.module.css';

interface SiteBlocker {
    show: boolean;
}

export const SiteBlocker: React.FC<SiteBlocker> = ({ show }) => {
    if (!show) {
        return null;
    }

    return (
        <div className={styles.loadingWrapper}>
            <div className={styles.ldsRipple}>
                <div></div>
                <div></div>
            </div>
        </div>
    );
};

export default SiteBlocker;
