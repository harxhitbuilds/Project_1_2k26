import { navConfig } from "@/config/navbar";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ModeToggle from "@/components/theme/mode-toggle";
import { MenuIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  return (
    <div className="bg-white dark:bg-black">
      <nav className="max-w-[1600px] mx-auto h-18 flex items-center justify-between px-6 md:px-16    sticky top-0 z-20">
        <div className="flex items-center justify-center gap-16">
          <div className="flex items-center gap-2">
            <Image
              src={navConfig.logo.src}
              alt={navConfig.logo.src}
              height={20}
              width={20}
              className="dark:invert"
            />
            <h1 className="pb-1 font-semibold text-lg">{navConfig.product}</h1>
          </div>

          <div className="text-xs  items-center gap-12 hidden md:flex">
            {navConfig.links.map((item, index) => (
              <Link
                key={index}
                href={item.link}
                className="flex items-center gap-2  text-shadow-md"
              >
                {item.title}
                {item?.icon}
              </Link>
            ))}
          </div>
        </div>

        <div className=" items-center gap-4 hidden md:flex">
          <ModeToggle />
          {navConfig.buttons.map((item, index) => (
            <Link key={index} href={item.link}>
              <Button className="rounded-sm shadow-inner hover:shadow-zinc-700 shadow-sm">
                {item.title}
              </Button>
            </Link>
          ))}
        </div>

        <MobileNav />
      </nav>
    </div>
  );
}

const MobileNav = () => {
  return (
    <div className="flex items-center gap-4 md:hidden">
      <ModeToggle />
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button className="bg-transparent border-border hover:bg-transparent text-black dark:text-white">
            <MenuIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 mr-4">
          {navConfig.links.map((item, index) => (
            <Link key={index} href={item.link}>
              <DropdownMenuItem>{item.title}</DropdownMenuItem>
            </Link>
          ))}
          <DropdownMenuSeparator />
          {navConfig.buttons.map((item, index) => (
            <Link key={index} href={item.link}>
              <DropdownMenuItem>{item.title}</DropdownMenuItem>
            </Link>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
