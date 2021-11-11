import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useDispatch, useSelector } from 'react-redux';

import { parseAsSocialMedia, parseAsString, safelyParse } from '../../../../utils/parsers';
import SuccessAlert from '../../../SuccessAlert';
import { setSocialMedia } from '../../../../store/slices/account';
import selector from './selector';

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
    const [success, setSuccess] = useState<string | null>(null);
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
        const { instagram, twitter, twitch, youtube, ebay } = data;

        setLoading(true);

        try {
            const response = await axios.post('/api/account/updateSocialMedia', {
                emailAddress,
                instagram,
                twitter,
                twitch,
                youtube,
                ebay,
            });

            if (response) {
                setSuccess('Social Media Updated!');
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);

            if (axios.isAxiosError(error)) {
                console.log('🚀 ~ file: index.tsx ~ line 50 ~ onSubmit ~ error', error);
            } else {
                console.log('🚀 ~ file: index.tsx ~ line 50 ~ onSubmit ~ error', error);
            }
        }
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
        [emailAddress]
    );

    useEffect(() => {
        if (emailAddress) {
            fetchSocialMedia(emailAddress);
        }
    }, [emailAddress]);

    useEffect(() => {
        if (savedSocialMedia) {
            setValue('instagram', savedSocialMedia.instagram);
            setValue('twitter', savedSocialMedia.twitter);
            setValue('twitch', savedSocialMedia.twitch);
            setValue('youtube', savedSocialMedia.youtube);
            setValue('ebay', savedSocialMedia.ebay);
        }
    }, [savedSocialMedia]);

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
                        <span className="bg-base-200">https://instagram.com/</span>
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
                        <span className="bg-base-200">https://twitter.com/</span>
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
                        <span className="bg-base-200">https://twitch.com/</span>
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
                        <span className="bg-base-200">https://youtube.com/</span>
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
                        <span className="bg-base-200">https://ebay.com/</span>
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
            {success && (
                <div className="mt-2">
                    <SuccessAlert msg={success} />
                </div>
            )}
        </React.Fragment>
    );
};

export default SocialMediaLinks;
