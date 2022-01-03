import { BreaksState } from '../types/state';

const breaksInitialState: BreaksState = {
    currentPage: 1,
    isLoadingBreaks: false,
    currentBreak: {
        id: '',
        title: '',
        slug: '',
        sku_code: '',
        description: '',
        types: '',
        images: {
            items: [],
        },
        cardImage: {
            title: '',
            description: '',
            url: '',
        },
        amount: '',
        compare_amount: '',
        inventory: {
            available: false,
            quantity: 0,
            levels: [],
        },
        breakSlots: [],
        breakDate: '',
        tags: [],
        format: '',
        isLive: false,
        isComplete: false,
        vodLink: '',
    },
};

export default breaksInitialState;
