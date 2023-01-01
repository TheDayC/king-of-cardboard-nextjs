import React, { useEffect, useRef, useState } from 'react';
import { UseFormRegister } from 'react-hook-form';
import { BiEditAlt } from 'react-icons/bi';
import { AiOutlineFileAdd } from 'react-icons/ai';

import { isArray } from '../../../../utils/typeguards';
import Previews from './Previews';

interface ImageUploadProps {
    fieldName: string;
    title: string;
    label: string;
    error: string | null;
    isRequired: boolean;
    isMultiple: boolean;
    currentImages?: string | string[];
    register: UseFormRegister<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
    setFileList: (fileList: FileList) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
    fieldName,
    title,
    label,
    error,
    isRequired,
    isMultiple,
    currentImages,
    register,
    setFileList,
}) => {
    const required = isRequired ? { value: true, message: `${title} is required` } : false;
    const { ref, ...fields } = register(fieldName, { required });
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [previews, setPreviews] = useState<string[]>([]);
    const hasPreviews = previews.length > 0;

    const handleButtonClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    const handleOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const files = e.target.files;

        // If no files are selected return and don't update previews.
        if (!files) return;

        // Dump the old previews out of memory first.
        unloadFileUrls(previews);

        // Loop over files and create URL objects from each for previews.
        const fileURLs: string[] = [];
        const images = Array.from(files);

        images.forEach((image) => {
            const objectUrl = URL.createObjectURL(image);

            fileURLs.push(objectUrl);
        });

        // Save the previews to state.
        setPreviews(fileURLs);

        // Save the files to state
        setFileList(files);
    };

    // Cleanup memory usage for existing object urls.
    const unloadFileUrls = (objectUrls: string[]) => {
        objectUrls.forEach((objectUrl) => {
            URL.revokeObjectURL(objectUrl);
        });
    };

    // Free up object url memory use cases when this component is unmounted.
    useEffect(() => {
        return () => {
            if (previews) {
                unloadFileUrls(previews);
            }
        };
    }, [previews]);

    // If images already exist, build the url and add to previews
    useEffect(() => {
        if (currentImages) {
            if (isArray(currentImages)) {
                setPreviews(currentImages.map((img) => `https://kocardboard-images.s3.eu-west-1.amazonaws.com/${img}`));
            } else {
                setPreviews([`https://kocardboard-images.s3.eu-west-1.amazonaws.com/${currentImages}`]);
            }
        }
    }, [currentImages]);

    return (
        <div className="flex flex-row space-x-4 h-full">
            <div className="form-control rounded-md hidden">
                <label className="label">
                    <span className="label-text">{label}</span>
                </label>
                <input
                    type="file"
                    className={`file-input file-input-bordered w-full max-w-xs${error ? ' input-error' : ''}`}
                    multiple={isMultiple}
                    ref={(instance) => {
                        ref(instance); // RHF wants a reference to this input
                        inputRef.current = instance; // We also need it to manipulate the element
                    }}
                    {...fields}
                    onChange={handleOnChange}
                />
                {error && (
                    <label className="label">
                        <span className={`label-text-alt${error ? ' text-error' : ''}`}>{error}</span>
                    </label>
                )}
            </div>

            <div className="flex flex-row space-x-2 w-full items-center justify-start">
                <div className="flex flex-col space-y-2 items-start">
                    <h3 className="text-3xl">{title}</h3>
                    <Previews previews={previews} />
                </div>

                <button className={`btn btn-md btn-secondary rounded-md`} onClick={handleButtonClick}>
                    {hasPreviews ? (
                        <BiEditAlt className="text-xl mr-2" />
                    ) : (
                        <AiOutlineFileAdd className="text-xl mr-2" />
                    )}
                    {hasPreviews ? `Edit ${title}` : `Add ${title}`}
                </button>
            </div>
        </div>
    );
};

export default ImageUpload;
