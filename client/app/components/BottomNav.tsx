"use client"

import { Home, MapPin, MessageCircle, MoreHorizontal } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

export default function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/maps", icon: MapPin, label: "Maps" },
    { href: "/chat", icon: MessageCircle, label: "Chat" },
    { href: "/more", icon: MoreHorizontal, label: "More" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex justify-around items-center px-4 py-3">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          // Special styling for the Chat button (center with dog icon)
          if (item.label === "Chat") {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center relative"
              >
                <div className="absolute -top-8 bg-orange-100 rounded-full p-4 border-4 border-white shadow-lg">
                  <span className="text-2xl">🐶</span>
                </div>
                <div className="h-6"></div>
              </Link>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 transition-colors ${
                isActive ? "text-pink-400" : "text-gray-400"
              }`}
            >
              <Icon size={24} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

// Made with Bob
