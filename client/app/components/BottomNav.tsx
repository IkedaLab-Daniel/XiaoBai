"use client"

import { Home, MapPin, MessageCircle, Languages } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

export default function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/maps", icon: MapPin, label: "Maps" },
    { href: "/chat", icon: MessageCircle, label: "Chat" },
    { href: "/translate", icon: Languages, label: "Translate" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg">
      <div className="flex justify-around items-center px-4 py-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 transition-colors ${
                isActive ? "text-pink-400" : "text-gray-400"
              }`}
            >
              <Icon size={24} strokeWidth={2} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

// Made with Bob
