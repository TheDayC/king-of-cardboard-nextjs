import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { BsInstagram, BsTwitter, BsTwitch, BsYoutube } from 'react-icons/bs';
import { FaEbay } from 'react-icons/fa';

import { parseAsString, safelyParse } from '../../../../utils/parsers';
import { fetchSocialMedia } from '../../../../store/slices/account';
import selector from './selector';
import { addError, addSuccess } from '../../../../store/slices/alerts';
import { updateSocialMedia } from '../../../../utils/account';
import { useCustomSession } from '../../../../hooks/auth';

interface SubmitData {
    instagram: string;
    twitter: string;
    twitch: string;
    youtube: string;
    ebay: string;
}

export const SocialMediaLinks: React.FC = () => {
    const { socialMedia } = useSelector(selector);
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();
    const [loading, setLoading] = useState(false);
    const [shouldFetch, setShouldFetch] = useState(true);
    const { data: session } = useCustomSession();
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
            dispatch(fetchSocialMedia(emailAddress));
        } else {
            dispatch(addError('Failed to update social media.'));
        }

        setLoading(false);
    };

    useEffect(() => {
        if (emailAddress && shouldFetch) {
            setShouldFetch(false);
            dispatch(fetchSocialMedia(emailAddress));
        }
    }, [emailAddress, dispatch, shouldFetch]);

    useEffect(() => {
        if (socialMedia) {
            setValue('instagram', socialMedia.instagram);
            setValue('twitter', socialMedia.twitter);
            setValue('twitch', socialMedia.twitch);
            setValue('youtube', socialMedia.youtube);
            setValue('ebay', socialMedia.ebay);
        }
    }, [socialMedia, setValue]);

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
