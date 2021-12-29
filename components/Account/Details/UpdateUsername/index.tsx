import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiOutlineUser } from 'react-icons/ai';
import axios from 'axios';
import { useSession } from 'next-auth/react';

import { parseAsString, safelyParse } from '../../../../utils/parsers';
import { useDispatch } from 'react-redux';
import { AlertLevel } from '../../../../enums/system';
import { addAlert } from '../../../../store/slices/alerts';
import { errorHandler } from '../../../../middleware/errors';
import { updateUsername } from '../../../../utils/account';
import { isArrayOfErrors } from '../../../../utils/typeguards';

const USER_PATTERN = /^[a-zA-Z]{4,}$/;

interface SubmitData {
    username: string;
}

export const UpdateUsername: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const { data: session } = useSession();
    const dispatch = useDispatch();

    const hasErrors = Object.keys(errors).length > 0;
    const usernameErr = safelyParse(errors, 'username.message', parseAsString, null);
    const emailAddress = safelyParse(session, 'user.email', parseAsString, null);

    const onSubmit = async (data: SubmitData) => {
        const { username } = data;

        if (!username || !emailAddress) return;

        setLoading(true);

        const hasUpdatedUsername = updateUsername(emailAddress, username);

        if (isArrayOfErrors(hasUpdatedUsername)) {
            hasUpdatedUsername.forEach((value) => {
                dispatch(addAlert({ message: value.description, level: AlertLevel.Error }));
            });
        } else {
            dispatch(addAlert({ message: 'Username Updated!', level: AlertLevel.Success }));
        }

        setLoading(false);
    };

    useEffect(() => {
        if (success) {
            dispatch(addAlert({ message: success, level: AlertLevel.Success }));
        }
    }, [success]);

    return (
        <React.Fragment>
            <div className="text-xs text-error">
                <p>Usernames must:</p>
                <ul className="list-disc list-inside pl-6 mb-4">
                    <li>Contain a minimum of 4 characters.</li>
                    <li>Contain a maximum of 20 characters.</li>
                    <li>Not begin with an underscore or period.</li>
                    <li>Not end with an underscore or period.</li>
                    <li>Not contain any special characters.</li>
                </ul>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-control">
                    <label className="input-group input-group-md">
                        <span className="bg-base-200">
                            <AiOutlineUser className="w-5 h-5" />
                        </span>
                        <input
                            type="text"
                            placeholder="Username"
                            {...register('username', {
                                required: { value: true, message: 'Username required' },
                                pattern: USER_PATTERN,
                            })}
                            className={`input input-md input-bordered w-full${usernameErr ? ' input-error' : ''}`}
                        />
                    </label>
                    {usernameErr && (
                        <label className="label">
                            <span className="label-text-alt">{usernameErr}</span>
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
                        {loading ? '' : 'Update Username'}
                    </button>
                </div>
            </form>
        </React.Fragment>
    );
};

export default UpdateUsername;
