"use client";

import { useTheme } from 'next-themes';
import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem,  DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Monitor, Moon, Sun ,Check} from "lucide-react";
import { Button } from './ui/button';

export const ThemeChanger = () => {
    const {theme,setTheme} = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex items-center gap-2 hover:cursor-pointer hover:dark:bg-blue-600 hover:dark:text-white hover:bg-white hover:text-black border-2">
         {theme !== "dark" && theme !== "system" ? <Sun size={18} /> : theme === "dark" ? <Moon size={18} /> : <Monitor size={18} />} 
         <span className='hidden md:inline'>{theme && theme.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-48">
        <DropdownMenuItem onClick={() => setTheme("system")}> 
          <Monitor className="mr-2 size-4" />
          System default
          {theme === "system" && <Check className="ml-auto size-4" />}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 size-4" />
          Light
          {theme === "light" && <Check className="ml-auto size-4" />}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 size-4" />
          Dark
          {theme === "dark" && <Check className="ml-auto size-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
