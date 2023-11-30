import { Document } from '@contentful/rich-text-types';
import { ImageItem } from './contentful';

export interface Blog {
    title: string;
    slug: string;
    content: Document | null;
    banner: ImageItem;
    youtubeEmbedId: string | null;
}

export interface ListBlog extends Omit<Blog, 'content' | 'banner' | 'youtubeEmbedId'> {
    preview: string | null;
    image: ImageItem;
}
