import React from 'react';
import { FieldValues, UseFormRegister } from 'react-hook-form';
import { BsBoxSeam, BsCartFill, BsDashCircleFill, BsFillPlusCircleFill } from 'react-icons/bs';

interface RepeaterFieldProps {
    sku?: string;
    quantity?: number;
    rowCount: number;
    register: UseFormRegister<any>;
    isLastRow: boolean;
    addRepeaterRow: (e: React.MouseEvent<HTMLButtonElement>) => void;
    removeRepeaterRow: (rowCount: number) => void;
}

export const RepeaterField: React.FC<RepeaterFieldProps> = ({
    sku,
    quantity,
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
                    <span className="bg-base-200">
                        <BsBoxSeam className="w-5 h-5" />
                    </span>
                    <input
                        type="text"
                        placeholder="SKU"
                        {...register(`sku.${rowCount}`, {
                            required: false,
                        })}
                        className="input input-md input-bordered w-full"
                        defaultValue={sku}
                    />
                </label>
            </div>
            <div className="form-control inline-block">
                <label className="input-group input-group-md">
                    <span className="bg-base-200">
                        <BsCartFill className="w-5 h-5" />
                    </span>
                    <input
                        type="number"
                        placeholder="Quantity"
                        {...register(`quantity.${rowCount}`, {
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
