import { TabA11y } from '../types/tabs';

export function a11yProps(index: number): TabA11y {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
        value: index,
    };
}
