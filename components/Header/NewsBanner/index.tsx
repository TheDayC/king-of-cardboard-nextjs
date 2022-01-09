import React from 'react';
//import { useSelector } from 'react-redux';
//import { AiOutlineClose } from 'react-icons/ai';
import Link from 'next/link';

//import selector from './selector';
//import { setShowNewsBanner } from '../../../store/slices/global';

export const NewsBanner: React.FC = () => {
    //const { showNewsBanner } = useSelector(selector);
    // const dispatch = useDispatch();

    /* const handleClose = () => {
        dispatch(setShowNewsBanner(false));
    }; */

    //if (!showNewsBanner) return null;

    return (
        <div className="flex flex-row justify-center w-full p-2 bg-primary shadow-md text-sm md:text-md">
            <p>
                Welcome to the King of Cardboard Beta. Read our v1.0 roadmap{' '}
                <Link href="/information/roadmap" passHref>
                    <span className="underline cursor-pointer hover:no-underline">here.</span>
                </Link>
            </p>
            {/* <div className="ml-4 cursor-pointer">
                <AiOutlineClose className="inline-block text-xl -mt-1" onClick={handleClose} />
            </div> */}
        </div>
    );
};

export default NewsBanner;
