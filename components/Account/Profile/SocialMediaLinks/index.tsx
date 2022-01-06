import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useDispatch, useSelector } from 'react-redux';
import { BsInstagram, BsTwitter, BsTwitch, BsYoutube } from 'react-icons/bs';
import { FaEbay } from 'react-icons/fa';

import { parseAsSocialMedia, parseAsString, safelyParse } from '../../../../utils/parsers';
import { setSocialMedia } from '../../../../store/slices/account';
import selector from './selector';
import { addError, addSuccess } from '../../../../store/slices/alerts';
import { updateSocialMedia } from '../../../../utils/account';

interface SubmitData {
    instagram: string;
    twitter: string;
    twitch: string;
    youtube: string;
    ebay: string;
}

export const SocialMediaLinks: React.FC = () => {
    const { socialMedia: savedSocialMedia } = useSelector(selector);
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();
    const [loading, setLoading] = useState(false);
    const { data: session } = useSession();
    const dispatch = useDispatch();

    const hasErrors = Object.keys(errors).length > 0;
    const instagramErr = safelyParse(errors, 'instagram.message', parseAsString, null);
    const twitterErr = safelyParse(errors, 'twitter.message', parseAsString, null);
    const twitchErr = safelyParse(errors, 'twitch.message', parseAsString, null);
    const youtubeErr = safelyParse(errors, 'youtube.message', parseAsString, null);
    const ebayErr = safelyParse(errors, 'ebay.message', parseAsString, null);
    const emailAddress = safelyParse(session, 'user.email', parseAsString, null);

    const onSubmit = async (data: SubmitData) => {
        if (!emailAddress) return;

        const { instagram, twitter, twitch, youtube, ebay } = data;

        setLoading(true);

        const hasUpdatedSocialMedia = await updateSocialMedia(emailAddress, instagram, twitter, twitch, youtube, ebay);

        if (hasUpdatedSocialMedia) {
            dispatch(addSuccess('Social media updated!'));
        } else {
            dispatch(addError('Failed to update social media.'));
        }

        setLoading(false);
    };

    const fetchSocialMedia = useCallback(
        async (email: string) => {
            const response = await axios.post('/api/account/getSocialMedia', {
                emailAddress: email,
            });

            if (response) {
                const socialMedia = safelyParse(response, 'data.socialMedia', parseAsSocialMedia, null);

                if (socialMedia) {
                    dispatch(setSocialMedia(socialMedia));
                }
            }
        },
        [dispatch]
    );

    useEffect(() => {
        if (emailAddress) {
            fetchSocialMedia(emailAddress);
        }
    }, [emailAddress, fetchSocialMedia]);

    useEffect(() => {
        if (savedSocialMedia) {
            setValue('instagram', savedSocialMedia.instagram);
            setValue('twitter', savedSocialMedia.twitter);
            setValue('twitch', savedSocialMedia.twitch);
            setValue('youtube', savedSocialMedia.youtube);
            setValue('ebay', savedSocialMedia.ebay);
        }
    }, [savedSocialMedia, setValue]);

    return (
        <React.Fragment>
            <div className="text-xs text-italic text-error">
                <p className="mb-2">
                    Think carefully before adding your social media links to your public profile. Leave a social media
                    field blank to remove it.
                </p>
                <p className="mb-2">You only need to add your account identifier, not the whole url.</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-control mt-2">
                    <label className="input-group input-group-md">
                        <span className="bg-base-200">
                            <BsInstagram className="text-3xl" />
                        </span>
                        <input
                            type="text"
                            placeholder="Instagram ID"
                            {...register('instagram', { required: false })}
                            className={`input input-md input-bordered w-full${instagramErr ? ' input-error' : ''}`}
                        />
                    </label>
                    {instagramErr && (
                        <label className="label">
                            <span className="label-text-alt">{instagramErr}</span>
                        </label>
                    )}
                </div>
                <div className="form-control mt-2">
                    <label className="input-group input-group-md">
                        <span className="bg-base-200">
                            <BsTwitter className="text-3xl" />
                        </span>
                        <input
                            type="text"
                            placeholder="Twitter ID"
                            {...register('twitter', { required: false })}
                            className={`input input-md input-bordered w-full${twitterErr ? ' input-error' : ''}`}
                        />
                    </label>
                    {twitterErr && (
                        <label className="label">
                            <span className="label-text-alt">{twitterErr}</span>
                        </label>
                    )}
                </div>
                <div className="form-control mt-2">
                    <label className="input-group input-group-md">
                        <span className="bg-base-200">
                            <BsTwitch className="text-3xl" />
                        </span>
                        <input
                            type="text"
                            placeholder="Twitch ID"
                            {...register('twitch', { required: false })}
                            className={`input input-md input-bordered w-full${twitchErr ? ' input-error' : ''}`}
                        />
                    </label>
                    {twitchErr && (
                        <label className="label">
                            <span className="label-text-alt">{twitchErr}</span>
                        </label>
                    )}
                </div>
                <div className="form-control mt-2">
                    <label className="input-group input-group-md">
                        <span className="bg-base-200">
                            <BsYoutube className="text-3xl" />
                        </span>
                        <input
                            type="text"
                            placeholder="Youtube ID"
                            {...register('youtube', { required: false })}
                            className={`input input-md input-bordered w-full${youtubeErr ? ' input-error' : ''}`}
                        />
                    </label>
                    {youtubeErr && (
                        <label className="label">
                            <span className="label-text-alt">{youtubeErr}</span>
                        </label>
                    )}
                </div>
                <div className="form-control mt-2">
                    <label className="input-group input-group-md">
                        <span className="bg-base-200">
                            <FaEbay className="text-3xl" />
                        </span>
                        <input
                            type="text"
                            placeholder="ebay ID"
                            {...register('ebay', { required: false })}
                            className={`input input-md input-bordered w-full${ebayErr ? ' input-error' : ''}`}
                        />
                    </label>
                    {ebayErr && (
                        <label className="label">
                            <span className="label-text-alt">{ebayErr}</span>
                        </label>
                    )}
                </div>
                <div className="form-control mt-6">
                    <button
                        type="submit"
                        className={`btn btn-block w-full${hasErrors ? ' btn-base-200 btn-disabled' : ' btn-primary'}${
                            loading ? ' loading btn-square' : ''
                        }`}
                    >
                        {loading ? '' : 'Update Social Media'}
                    </button>
                </div>
            </form>
        </React.Fragment>
    );
};

export default SocialMediaLinks;
