import dynamic from 'next/dynamic';

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
    ssr: false,
    loading: () => <p>Loading ...</p>,
});

const modules = {
    toolbar: [
        [{ header: '1' }, { header: '2' }, { font: [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
        ['link', 'image', 'video'],
        ['clean'],
    ],
    clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: false,
    },
};
/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'video',
];

interface RichTextEditorProps {
    placeholder: string;
    value: string;
    onChange(content: string): void;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ placeholder, value, onChange }) => {
    console.log('🚀 ~ file: index.tsx:50 ~ value', value);
    const handleChange = (content: string) => {
        onChange(content);
    };

    return (
        <QuillNoSSRWrapper
            modules={modules}
            formats={formats}
            theme="snow"
            placeholder={placeholder}
            onChange={handleChange}
            value={value}
        />
    );
};

export default RichTextEditor;
