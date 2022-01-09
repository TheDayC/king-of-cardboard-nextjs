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
                    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                    <link rel="manifest" href="/site.webmanifest" />
                    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#676767" />
                    <meta name="msapplication-TileColor" content="#676767" />
                    <meta name="theme-color" content="#676767" />
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
