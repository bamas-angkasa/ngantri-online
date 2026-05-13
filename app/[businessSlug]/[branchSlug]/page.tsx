import { PublicBusinessPage } from "@/components/ngantri/public-business";

export default async function BranchPublicPage({
  params,
}: {
  params: Promise<{ branchSlug: string }>;
}) {
  const { branchSlug } = await params;
  return <PublicBusinessPage branchSlug={branchSlug} />;
}
