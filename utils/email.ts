import fs from 'fs';
import path from 'path';
import sgMail, { MailDataRequired } from '@sendgrid/mail';

import { CartItem } from '../types/cart';
import { AttachmentData } from '../types/webhooks';
import { parseImgData } from './webhooks';
import { Address, CustomerDetails } from '../types/checkout';
import { getPrettyPrice } from './account/products';
import { formatOrderNumber } from './checkout';

const filePath = path.resolve(process.cwd(), 'html', 'order.html');
const logo = fs.readFileSync(path.resolve(process.cwd(), 'images', 'logo-full.png'));

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
    total: number
): string {
    const htmlData = fs.readFileSync(filePath, 'utf8');
    const itemsHtml = createItemsHTML(items);

    return htmlData
        .replace('{{orderNumber}}', `${formatOrderNumber(orderNumber)}`)
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
    name: string,
    customerDetails: CustomerDetails,
    billingAddress: Address,
    shippingAddress: Address,
    items: CartItem[],
    subTotal: number,
    shipping: number,
    discount: number,
    total: number,
    isNotification: boolean
): string {
    const itemsText = createItemsText(items);

    const bodyText = isNotification
        ? `
    The order below has been placed, ensure to fulfill. 
    `
        : `
    Thank you for placing your order with King of Cardboard, we hope you enjoy the products you've bought!
    Below you'll find a summary of your order, you can also review these details by logging into your account on the website and using the account menu to navigate to your order history.`;

    return `
        Hi ${name},

        ${bodyText}
        
        # Order Details
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
    isNotification: boolean
): MailDataRequired {
    return {
        to: email,
        from: process.env.MAILER_ADDRESS || 'noreply@kingofcardboard.co.uk',
        subject: `${isNotification ? 'Order Confirmation' : 'Order Placed'} - ${formatOrderNumber(
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
            total
        ),
        text: createText(
            name,
            customerDetails,
            billingAddress,
            shippingAddress,
            items,
            subTotal,
            shipping,
            discount,
            total,
            isNotification
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
