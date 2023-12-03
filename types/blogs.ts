import { Document } from '@contentful/rich-text-types';
import { ImageItem } from './contentful';

export interface Blog {
    title: string;
    slug: string;
    content: Document | null;
    banner: ImageItem;
    image: ImageItem;
    youtubeEmbedId: string | null;
    publishDate: string;
    reviewTitle: string;
    reviewSummary: string;
    reviewScore: number;
}

export interface ListBlog
    extends Omit<Blog, 'content' | 'banner' | 'youtubeEmbedId' | 'reviewSummary' | 'reviewScore' | 'reviewTitle'> {
    preview: string | null;
}
