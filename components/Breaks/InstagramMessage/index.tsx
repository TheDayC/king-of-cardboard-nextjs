import React from 'react';
import { BsInstagram } from 'react-icons/bs';

const cardImg =
    'https://images.ctfassets.net/qeycwswfx7l5/1vySGCpOHOG5RvZYyKbah1/4ef5dc9a3be74417b28070aee6979c7d/break-7-front.png?w=400&q=100';

export const InstagramMessage: React.FC = () => (
    <div className="flex flex-col justify-center items-center">
        <div className="card lg:card-side bg-base-100 shadow-xl">
            <figure>
                <img src={cardImg} alt="Break image" title="Break image" />
            </figure>
            <div className="card-body">
                <h2 className="card-title">Our breaks are now on Instagram!</h2>
                <p className="mb-4">
                    As we develop our reputation and continue to offer the best breaking experience in the UK, we have
                    temporarily migrated our break offerings to our Instagram page.
                </p>
                <p className="mb-4">
                    Our goals are still the same but our focus has shifted slightly. You can still find sealed, singles
                    and everything in between in our shop, that won&apos;t go away, but for now breaks will happen in
                    the Instagram ecosystem.
                </p>
                <p className="mb-4">
                    If you wish to get involved with our breaks please click the button below and head over to our
                    Instagram page that will allow you to claim slots by commenting, or even negotiate deals with us!
                </p>
                <div className="card-actions justify-end">
                    <a
                        href="https://instagram.com/kocardboard"
                        target="__blank"
                        role="link"
                        className="btn btn-primary"
                    >
                        <BsInstagram className="text-2xl inline-block mr-2 hover:text-primary" />
                        Instagram
                    </a>
                </div>
            </div>
        </div>
    </div>
);

export default InstagramMessage;
