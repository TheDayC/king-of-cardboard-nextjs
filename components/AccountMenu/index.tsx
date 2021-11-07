import React from 'react';
import { CgDetailsMore } from 'react-icons/cg';
import { BsFillPersonLinesFill, BsFillCartCheckFill, BsFillAwardFill } from 'react-icons/bs';

export const AccountMenu: React.FC = () => {
    return (
        <ul className="menu p-4 shadow-lg bg-base-100 rounded-md">
            <li className="menu-title">
                <span>Account Menu</span>
            </li>
            <li>
                <a>
                    <CgDetailsMore className="inline-block w-5 h-5 mr-2 stroke-current" />
                    Details
                </a>
            </li>
            <li>
                <a>
                    <BsFillPersonLinesFill className="inline-block w-5 h-5 mr-2 stroke-current" />
                    Profile
                </a>
            </li>
            <li>
                <a>
                    <BsFillCartCheckFill className="inline-block w-5 h-5 mr-2 stroke-current" />
                    Order History
                </a>
            </li>
            <li>
                <a>
                    <BsFillAwardFill className="inline-block w-5 h-5 mr-2 stroke-current" />
                    Achievements
                </a>
            </li>
        </ul>
    );
};

export default AccountMenu;
