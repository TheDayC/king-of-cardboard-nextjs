import { BreaksState } from '../types/state';

const breaksInitialState: BreaksState = {
    currentPage: 1,
    breaksTotal: 0,
    isLoadingBreaks: false,
    isLoadingBreak: false,
    breaks: [],
    currentBreak: {
        id: '',
        title: '',
        slug: '',
        sku_code: '',
        description: [],
        types: '',
        images: [],
        cardImage: {
            title: '',
            description: '',
            url: '',
        },
        breakSlots: [],
        breakDate: '',
        tags: [],
        format: '',
        isLive: false,
        isComplete: false,
        vodLink: '',
    },
    order: 'breakDate_ASC',
};

export default breaksInitialState;
