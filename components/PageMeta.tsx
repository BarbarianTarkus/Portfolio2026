import { Head } from "fresh/runtime";

interface PageMetaProps {
  title: string;
  description: string;
}

/**
 * Document metadata shared by every route: title, description and the Open
 * Graph pair used when a link is shared.
 */
export function PageMeta({ title, description }: PageMetaProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
    </Head>
  );
}
