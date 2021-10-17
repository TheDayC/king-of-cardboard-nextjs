import React from 'react';
import { useSelector } from 'react-redux';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Badge, Tab, Tabs } from '@mui/material';

import selector from './selector';
import logo from '../../images/logo1x.png';
import { a11yProps } from '../../utils/tabs';
import styles from './header.module.css';
import Link from '../Link';

export const Header: React.FC = () => {
    const { cartItemCount } = useSelector(selector);

    const router = useRouter();
    const { slug } = router.query;

    return (
        <div className="navbar mb-4 shadow-md bg-neutral text-neutral-content">
            <div className={styles.logoWrapper}>
                <Link href="/">
                    <Image src={logo} alt="King of Cardboard Logo" title="King of Cardboard" />
                    <span className="text-lg font-bold">King of Cardboard</span>
                </Link>
            </div>

            <Tabs value={slug || '/'}>
                <Tab label="Home" {...a11yProps(0)} value="/" href="/" component={Link} />
                <Tab label="Shop" {...a11yProps(1)} value="/shop" href="/shop" component={Link} />
                <Tab label="Breaks" {...a11yProps(2)} value="/breaks" href="/breaks" component={Link} />
                <Tab label="Streaming" {...a11yProps(3)} value="/streaming" href="/streaming" component={Link} />
            </Tabs>

            <Badge badgeContent={cartItemCount} color="success">
                <Link href="/cart">
                    <AiOutlineShoppingCart />
                </Link>
            </Badge>
        </div>
    );
};

export default Header;
