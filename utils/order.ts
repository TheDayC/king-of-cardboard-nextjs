import CommerceLayer from '@commercelayer/sdk';

const organization = process.env.NEXT_PUBLIC_ECOM_SLUG || '';

export async function checkIfOrderExists(accessToken: string, orderId: string): Promise<boolean> {
    try {
        const cl = CommerceLayer({ organization, accessToken });

        await cl.orders.retrieve(orderId);

        return true;
    } catch (err) {
        return false;
    }
}
