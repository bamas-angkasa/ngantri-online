import Image from "next/image";

import { cn } from "@/lib/utils";

type NgantriLogoProps = {
  className?: string;
  iconClassName?: string;
};

export function NgantriLogo({
  className,
  iconClassName,
}: NgantriLogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <Image
        alt="Ngantri"
        className={cn("size-10 object-contain", iconClassName)}
        height={80}
        priority
        src="/brand/ngantri-logo-mark.png"
        width={80}
      />
    </span>
  );
}
