import fs from 'fs';
import path from 'path';
import { MailDataRequired } from '@sendgrid/mail';

import { CartItem } from '../types/cart';
import { AttachmentData } from '../types/webhooks';
import { parseImgData } from './webhooks';
import { Address, CustomerDetails } from '../types/checkout';
import { getPrettyPrice } from './account/products';
import { formatOrderNumber } from './checkout';
import { Fulfillment, Payment, Status } from '../enums/orders';
import { getFulfillmentStatusTitle, getPaymentStatusTitle, getStatusTitle } from './account';

const orderEmailPath = path.resolve(process.cwd(), 'html', 'order.html');
const orderUpdatePath = path.resolve(process.cwd(), 'html', 'statusChange.html');
const logo = fs.readFileSync(path.resolve(process.cwd(), 'images', 'logo-full.png'));

export function getStatusMessage(status: Status): string {
    switch (status) {
        case Status.Approved:
        case Status.Fulfilled:
            return '<span class="badge badge-green"></span>Order status: Approved';
        case Status.Placed:
            return '<span class="badge badge-yellow"></span>Order status: Placed';
        case Status.Cancelled:
            return '<span class="badge badge-red"></span>Order status: Cancelled';
        default:
            return '<span class="badge"></span>Order status: Pending';
    }
}

export function getPaymentStatusMessage(paymentStatus: Payment): string {
    switch (paymentStatus) {
        case Payment.Paid:
            return '<span class="badge badge-green"></span>Payment status: Paid';
        case Payment.Authorised:
            return '<span class="badge badge-yellow"></span>Payment status: Authorised';
        case Payment.Refunded:
            return '<span class="badge badge-red"></span>Payment status: Refunded';
        default:
            return '<span class="badge badge-grey"></span>Payment status: Unpaid';
    }
}

export function getFulfillmentStatusMessage(fulfillmentStatus: Fulfillment): string {
    switch (fulfillmentStatus) {
        case Fulfillment.Fulfilled:
            return '<span class="badge badge-green"></span>Fulfillment status: Fulfilled';
        case Fulfillment.InProgress:
            return '<span class="badge badge-yellow"></span>Fulfillment status: In progress';
        default:
            return '<span class="badge badge-grey"></span>Fulfillment status: Unfulfilled';
    }
}

function createItemsHTML(items: CartItem[]): string[] {
    return items.map(({ _id, title, sku, quantity, price }) => {
        return `<tr>
                <td align="center"><img src="cid:${_id}" alt="${title} line item image" title="${title} image" class="productImg" /></td>
                <td>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        <tbody>
                            <tr>
                                <td align="center">
                                    <h4 class="itemName">${title}</h4>
                                    <p class="skuCode">${sku}</p>
                                    <p class="quantity">Quantity: ${quantity}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
                <td align="center"><p class="amount">${getPrettyPrice(price * quantity)}</p></td>
            </tr>`;
    });
}

function createItemsText(items: CartItem[]): string[] {
    return items.map(({ title, sku, quantity, price }) => {
        return `
            Name: ${title}
            SKU: ${sku}
            Quantity: ${quantity}
            Total: ${getPrettyPrice(price * quantity)}
        `;
    });
}

export async function createImageData(items: CartItem[]): Promise<AttachmentData[]> {
    const itemsImgData: AttachmentData[] = [];

    for (const item of items) {
        const imgData = await parseImgData(item._id, item.mainImage.url);

        itemsImgData.push(imgData);
    }

    return itemsImgData;
}

function createHTML(
    orderNumber: number,
    name: string,
    customerDetails: CustomerDetails,
    billingAddress: Address,
    shippingAddress: Address,
    items: CartItem[],
    subTotal: number,
    shipping: number,
    discount: number,
    total: number,
    trackingNumber: string | null,
    status: Status,
    paymentStatus: Payment,
    fulfillmentStatus: Fulfillment,
    isUpdate: boolean = false
): string {
    const htmlData = fs.readFileSync(isUpdate ? orderUpdatePath : orderEmailPath, 'utf8');
    const itemsHtml = createItemsHTML(items);
    const tracking = trackingNumber ? trackingNumber : 'Not yet applied.';

    return htmlData
        .replace('{{orderNumber}}', `${formatOrderNumber(orderNumber)}`)
        .replace('{{trackingNumber}}', tracking)
        .replace('{{status}}', getStatusMessage(status))
        .replace('{{paymentStatus}}', getPaymentStatusMessage(paymentStatus))
        .replace('{{fulfillmentStatus}}', getFulfillmentStatusMessage(fulfillmentStatus))
        .replace('{{name}}', name)
        .replace('{{email}}', customerDetails.email)
        .replace('{{firstName}}', customerDetails.firstName)
        .replace('{{lastName}}', customerDetails.lastName)
        .replace('{{phone}}', customerDetails.phone || '')
        .replace('{{lineOne}}', billingAddress.lineOne)
        .replace('{{lineTwo}}', billingAddress.lineTwo)
        .replace('{{city}}', billingAddress.city)
        .replace('{{postcode}}', billingAddress.postcode)
        .replace('{{county}}', billingAddress.county)
        .replace('{{shippingLineOne}}', shippingAddress.lineOne)
        .replace('{{shippingLineTwo}}', shippingAddress.lineTwo)
        .replace('{{shippingCity}}', shippingAddress.city)
        .replace('{{shippingPostcode}}', shippingAddress.postcode)
        .replace('{{shippingCounty}}', shippingAddress.county)
        .replace('{{items}}', itemsHtml.join(''))
        .replace('{{subTotal}}', getPrettyPrice(subTotal))
        .replace('{{discount}}', getPrettyPrice(discount))
        .replace('{{shipping}}', getPrettyPrice(shipping))
        .replace('{{total}}', getPrettyPrice(total));
}

function createText(
    orderNumber: number,
    name: string,
    customerDetails: CustomerDetails,
    billingAddress: Address,
    shippingAddress: Address,
    items: CartItem[],
    subTotal: number,
    shipping: number,
    discount: number,
    total: number,
    isNotification: boolean,
    trackingNumber: string | null,
    status: Status,
    paymentStatus: Payment,
    fulfillmentStatus: Fulfillment
): string {
    const itemsText = createItemsText(items);
    const tracking = trackingNumber ? trackingNumber : 'Not yet applied.';

    const bodyText = isNotification
        ? `
    The order below has been placed, ensure to fulfill and update tracking number. 
    `
        : `
    Thank you for placing your order with King of Cardboard, we hope you enjoy the products you've bought!
    Below you'll find a summary of your order, you can also review these details by logging into your account on the website and using the account menu to navigate to your order history.`;

    return `
        Hi ${name},

        ${bodyText}
        
        # Order Details
        Order number: ${formatOrderNumber(orderNumber)}
        Tracking number: ${tracking}
        Status: ${getStatusTitle(status)}
        Payment status: ${getPaymentStatusTitle(paymentStatus)}
        Fulfillment status: ${getFulfillmentStatusTitle(fulfillmentStatus)}

        ------
        
        ## Personal Details
        Name: ${customerDetails.firstName} ${customerDetails.lastName}
        Email: ${customerDetails.email}
        Phone: ${customerDetails.phone}

        ------

        ### Billing Details 
        ${billingAddress.lineOne}
        ${billingAddress.lineTwo}
        ${billingAddress.city}
        ${billingAddress.postcode}
        ${billingAddress.county}

        ------
        
        ### Shipping Details
        ${shippingAddress.lineOne}
        ${shippingAddress.lineTwo}
        ${shippingAddress.city}
        ${shippingAddress.postcode}
        ${shippingAddress.county}

        ------
        
        ## Items
        ${itemsText.join('\r\n')}

        ------

        Subtotal: ${subTotal}
        Discount: ${discount}
        Shipping: ${shipping}
        Total: ${total}
    `;
}

export function createMailerOptions(
    orderNumber: number,
    name: string,
    email: string,
    customerDetails: CustomerDetails,
    billingAddress: Address,
    shippingAddress: Address,
    items: CartItem[],
    itemImageData: AttachmentData[],
    subTotal: number,
    shipping: number,
    discount: number,
    total: number,
    isNotification: boolean,
    trackingNumber: string | null,
    status: Status,
    paymentStatus: Payment,
    fulfillmentStatus: Fulfillment,
    isUpdate: boolean = false
): MailDataRequired {
    return {
        to: email,
        from: process.env.MAILER_ADDRESS || 'noreply@kingofcardboard.co.uk',
        subject: `${isNotification ? 'Order Placed' : 'Order Confirmation'} - ${formatOrderNumber(
            orderNumber
        )} - King of Cardboard`,
        html: createHTML(
            orderNumber,
            name,
            customerDetails,
            billingAddress,
            shippingAddress,
            items,
            subTotal,
            shipping,
            discount,
            total,
            trackingNumber,
            status,
            paymentStatus,
            fulfillmentStatus,
            isUpdate
        ),
        text: createText(
            orderNumber,
            name,
            customerDetails,
            billingAddress,
            shippingAddress,
            items,
            subTotal,
            shipping,
            discount,
            total,
            isNotification,
            trackingNumber,
            status,
            paymentStatus,
            fulfillmentStatus
        ),
        attachments: [
            ...itemImageData,
            {
                type: 'image/png',
                filename: 'logo.png',
                content: logo.toString('base64'),
                content_id: 'logo',
                disposition: 'inline',
            },
        ],
    };
}
