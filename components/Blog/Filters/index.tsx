import { FC } from 'react';
import { useForm, FieldValues } from 'react-hook-form';
import { BsSearch } from 'react-icons/bs';
//import { BsArrowDownUp, BsFilter } from 'react-icons/bs';

interface FiltersProps {
    q: string | null;
    handleSearch(q: string): void;
}

const Filters: FC<FiltersProps> = ({ q, handleSearch }) => {
    const { register, handleSubmit } = useForm({
        defaultValues: {
            q: q || '',
        },
    });

    const onSubmit = async (data: FieldValues) => {
        const { q } = data;

        handleSearch(q);
    };

    return (
        <div className="flex flex-row justify-end w-full space-x-2">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-row space-x-2">
                    <input
                        type="text"
                        placeholder="Search for blog posts..."
                        {...register('q', {
                            required: { value: false, message: 'Required' },
                        })}
                        className="input input-md input-bordered"
                    />
                    <button type="submit" role="button" aria-label="Search blog posts" className="btn btn-primary">
                        <BsSearch />
                    </button>
                </div>
            </form>
            {/* <button className="btn btn-ghost">
                        <BsArrowDownUp className="text-xl" />
                        Sort
                    </button>
                    <button className="btn btn-ghost">
                        <BsFilter className="text-xl" />
                        Filter
                    </button> */}
        </div>
    );
};

export default Filters;
