import React from 'react';
import { FieldValues, UseFormRegister } from 'react-hook-form';

interface ImageUploadProps {
    fieldName: string;
    title: string;
    label: string;
    error: string | null;
    isRequired: boolean;
    isMultiple: boolean;
    register: UseFormRegister<FieldValues>;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
    fieldName,
    title,
    label,
    error,
    isRequired,
    isMultiple,
    register,
}) => {
    const required = isRequired ? { value: true, message: `${title} is required` } : false;

    return (
        <div className="flex flex-row space-x-4">
            <div className="form-control rounded-md">
                <label className="label">
                    <span className="label-text">{label}</span>
                </label>
                <input
                    type="file"
                    className={`file-input file-input-bordered w-full max-w-xs${error ? ' input-error' : ''}`}
                    multiple={isMultiple}
                    {...register(fieldName, { required })}
                />
                {error && (
                    <label className="label">
                        <span className={`label-text-alt${error ? ' text-error' : ''}`}>{error}</span>
                    </label>
                )}
            </div>
        </div>
    );
};

export default ImageUpload;
