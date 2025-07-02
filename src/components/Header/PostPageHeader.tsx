// "use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "iconoir-react";

import MainLogo from "../MainLogo";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import Search from "../Search";

import cn from "@/utils/cn";
import RandomPost from "../RandomPost";


interface PostPageHeaderProps {
  className?: string;
}

const PostPageHeader = ({ className }: PostPageHeaderProps) => {
  const router = useRouter();

  const handleBackButtonClick = () => {
    router.back();
  };

  return (
    <nav
      className={cn(
        "z-10 sticky top-0 h-10 w-full flex justify-between items-center px-4 bg-backgroundHeavy/50 border-b-[0.5px] border-textColor/70 backdrop-blur-lg",
        className,
      )}
    >
      <button onClick={handleBackButtonClick}>
        <ArrowLeft />
      </button>
      <MainLogo className="hidden tablet:flex" />
      <div className="flex">
      <Search className="text-2xl" label="🔍" />
      <ThemeToggle className="px-2"/>

      </div>
    </nav>
  );
};

export default PostPageHeader;
