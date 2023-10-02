import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';
import { FC } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { BiSearchAlt } from 'react-icons/bi';

export const SearchBar: FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { register, handleSubmit } = useForm({
        defaultValues: {
            search: searchParams.get('s'),
        },
    });

    const onSubmit = async (data: FieldValues) => {
        router.push({
            pathname: '/shop',
            query: { s: data.search },
        });
    };

    return (
        <div className="bg-primary pb-2 pt-1">
            <div className="form-control block mx-auto max-w-7xl">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <label className="input-group input-group-md">
                        <span className="bg-base-200">
                            <BiSearchAlt className="w-5 h-5" />
                        </span>
                        <input
                            type="text"
                            placeholder="Search for a product..."
                            className="input no-border input-md grow"
                            {...register('search', {
                                required: false,
                            })}
                        />
                    </label>
                </form>
            </div>
        </div>
    );
};

export default SearchBar;
