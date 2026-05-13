import { PublicBusinessPage } from "@/components/ngantri/public-business";

export default async function BranchPublicPage({
  params,
}: {
  params: Promise<{ businessSlug: string; branchSlug: string }>;
}) {
  const { businessSlug, branchSlug } = await params;
  return <PublicBusinessPage businessSlug={businessSlug} branchSlug={branchSlug} />;
}
