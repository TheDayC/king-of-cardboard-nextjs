import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { fetchContentfulBreakTypes } from '../../../utils/breaks';
import { ContentfulBreakTypes } from '../../../types/breaks';

export const Menu: React.FC = () => {
    const [types, setTypes] = useState<ContentfulBreakTypes[] | null>(null);
    const router = useRouter();
    const { cat } = router.query;

    const getTypes = async () => {
        const fetchedTypes = await fetchContentfulBreakTypes();

        if (fetchedTypes) {
            setTypes(fetchedTypes);
        }
    };

    useEffect(() => {
        getTypes();
    }, []);

    return (
        <div className="bg-gradient-to-r from-primary to-primary-focus w-full py-6">
            <div className="container">
                <div className="tabs">
                    {types &&
                        types.map((type) => (
                            <Link href={`/breaks/${type.link}`} key={type.title} passHref>
                                <div className={`tab tab-bordered${cat && cat === type.link ? 'tab-active' : ''}`}>
                                    {type.title}
                                </div>
                            </Link>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default Menu;
