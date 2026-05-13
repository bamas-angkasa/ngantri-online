import { PublicBusinessPage } from "@/components/ngantri/public-business";

export default async function BusinessPublicPage({
  params,
}: {
  params: Promise<{ businessSlug: string }>;
}) {
  const { businessSlug } = await params;
  return <PublicBusinessPage businessSlug={businessSlug} />;
}
