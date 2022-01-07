/* eslint-disable */
import Document, { Html, Head, Main, NextScript } from 'next/document';
import Cookies from 'js-cookie';

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx);
        return { ...initialProps };
    }

    render() {
        const cookieConsent = Boolean(Cookies.get('cookieConsent'));

        return (
            <Html data-theme="king">
                <Head>
                    {/* Global Site Tag (gtag.js) - Google Analytics */}
                    {cookieConsent && (
                        <script
                            async
                            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
                        />
                    )}
                    {cookieConsent && (
                        <script
                            dangerouslySetInnerHTML={{
                                __html: `
                                    window.dataLayer = window.dataLayer || [];
                                    function gtag(){dataLayer.push(arguments);}
                                    gtag('js', new Date());
                                    gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
                                    page_path: window.location.pathname,
                                    });
                                `,
                            }}
                        />
                    )}
                </Head>
                <body className="bg-neutral">
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
