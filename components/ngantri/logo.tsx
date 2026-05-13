import Image from "next/image";

import { cn } from "@/lib/utils";

type NgantriLogoProps = {
  className?: string;
  iconClassName?: string;
  showText?: boolean;
};

export function NgantriLogo({
  className,
  iconClassName,
  showText = true,
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
      {/* {showText && <span className="text-lg font-black tracking-tight">Ngantri</span>} */}
    </span>
  );
}
