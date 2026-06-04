import { redirect } from 'next/navigation';

type DocsRedirectProps = {
    params: Promise<{
        slug?: string[];
    }>;
};

const DOCS_BASE_URL = 'https://docs.chefuinc.com/academy';

const DocsRedirect = async ({ params }: DocsRedirectProps) => {
    const { slug } = await params;
    const path = slug?.join('/');
    redirect(path ? `${DOCS_BASE_URL}/${path}` : DOCS_BASE_URL);
};

export default DocsRedirect;
