import { currencyFormatter } from '../utils/currencyFormatter';

export const useCurrency = () => {
    return {
        formatCurrency: (amount) => currencyFormatter(amount)
    };
};
