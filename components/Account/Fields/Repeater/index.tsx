import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { BsBoxSeam, BsCartFill, BsDashCircleFill, BsFillPlusCircleFill } from 'react-icons/bs';

interface RepeaterFieldProps {
    fieldOne: string;
    fieldOneLabel: string;
    fieldOneIcon: JSX.Element;
    fieldTwo: string;
    fieldTwoLabel: string;
    fieldTwoIcon: JSX.Element;
    rowCount: number;
    register: UseFormRegister<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
    isLastRow: boolean;
    addRepeaterRow: (e: React.MouseEvent<HTMLButtonElement>) => void;
    removeRepeaterRow: (rowCount: number) => void;
}

export const RepeaterField: React.FC<RepeaterFieldProps> = ({
    fieldOne,
    fieldOneLabel,
    fieldOneIcon,
    fieldTwo,
    fieldTwoLabel,
    fieldTwoIcon,
    rowCount,
    register,
    isLastRow,
    addRepeaterRow,
    removeRepeaterRow,
}) => {
    const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        removeRepeaterRow(rowCount);
    };

    return (
        <div className="flex flex-row space-x-4 items-start justify-start">
            <div className="form-control inline-block">
                <label className="input-group input-group-md">
                    <span className="bg-base-200">{fieldOneIcon}</span>
                    <input
                        type="text"
                        placeholder={fieldOneLabel}
                        {...register(`${fieldOne}.${rowCount}`, {
                            required: false,
                        })}
                        className="input input-md input-bordered w-full"
                    />
                </label>
            </div>
            <div className="form-control inline-block">
                <label className="input-group input-group-md">
                    <span className="bg-base-200">{fieldTwoIcon}</span>
                    <input
                        type="number"
                        placeholder={fieldTwoLabel}
                        {...register(`${fieldTwo}.${rowCount}`, {
                            required: false,
                        })}
                        className="input input-md input-bordered w-full"
                    />
                </label>
            </div>
            {rowCount !== 0 && (
                <div className="form-control inline-block">
                    <button type="submit" className="btn btn-block btn-ghost rounded-md" onClick={handleRemove}>
                        <BsDashCircleFill className="inline-block w-5 h-5" />
                    </button>
                </div>
            )}
            {isLastRow && (
                <div className="form-control inline-block">
                    <button type="submit" className="btn btn-block btn-secondary rounded-md" onClick={addRepeaterRow}>
                        <BsFillPlusCircleFill className="inline-block w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default RepeaterField;
