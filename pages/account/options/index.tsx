import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { BiSave } from 'react-icons/bi';

import AccountWrapper from '../../../components/AccountWrapper';
import { authOptions } from '../../api/auth/[...nextauth]';
import { parseAsRole, parseAsString, safelyParse } from '../../../utils/parsers';
import { Roles } from '../../../enums/auth';
import { getOptions, updateOptions } from '../../../utils/account/options';
import { Options } from '../../../types/account';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const session = await unstable_getServerSession(req, res, authOptions);
    const role = safelyParse(session, 'user.role', parseAsRole, Roles.User);
    const userId = safelyParse(session, 'user.id', parseAsString, null);
    const isAdmin = role === Roles.Admin;

    if (!session || !isAdmin || !userId) {
        return {
            redirect: {
                permanent: false,
                destination: '/login',
            },
        };
    }

    const options = await getOptions(true);

    return {
        props: {
            options,
        },
    };
};

interface OptionsPageProps {
    options: Options;
}

export const OptionsPage: React.FC<OptionsPageProps> = ({ options }) => {
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            isOnHoliday: options.isOnHoliday,
            errorMessage: options.errorMessage,
        },
    });
    const hasErrors = Object.keys(errors).length > 0;

    const onSubmit: SubmitHandler<FieldValues> = async (data: FieldValues) => {
        if (hasErrors || isLoading) {
            return;
        }
        const { isOnHoliday, errorMessage } = data;

        setIsLoading(true);

        await updateOptions({
            isOnHoliday,
            errorMessage,
        });

        setIsLoading(false);
    };

    return (
        <AccountWrapper title="Options - Account - King of Cardboard" description="Options page">
            <div className="flex flex-col w-full justify-start items-start p-2 md:p-4 md:p-8 md:flex-row relative">
                <div className="flex flex-col relative w-full space-y-4" data-testid="content">
                    <div className="flex flex-row justify-between items-center mb-4 pb-4 border-b border-solid border-gray-300">
                        <h1 className="text-5xl">Options</h1>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col space-y-4">
                            <div className="form-control">
                                <label className="label cursor-pointer">
                                    <span className="label-text">Holiday Mode</span>
                                    <input
                                        {...register('isOnHoliday')}
                                        type="checkbox"
                                        className="toggle toggle-primary"
                                    />
                                </label>
                            </div>
                            <div className="form-control">
                                <label className="label cursor-pointer">
                                    <span className="label-text">Error Message</span>
                                    <input
                                        {...register('errorMessage')}
                                        type="text"
                                        placeholder="Error message..."
                                        className="input input-bordered w-1/2"
                                    />
                                </label>
                            </div>
                            <div className="form-control">
                                <button
                                    type="submit"
                                    className={`btn btn-block btn-primary rounded-md${isLoading ? ' loading' : ''}`}
                                >
                                    {!isLoading && (
                                        <React.Fragment>
                                            <BiSave className="inline-block text-xl mr-2" />
                                            Save Options
                                        </React.Fragment>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AccountWrapper>
    );
};

export default OptionsPage;
