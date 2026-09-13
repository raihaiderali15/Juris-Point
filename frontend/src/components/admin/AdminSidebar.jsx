import {
  FolderOpen,
  Scale,
  MessageSquare,
  Video,
  Settings,
  BarChart3,
  Users,
} from "lucide-react";

const NAV_ITEMS = [
  { id: "upload-notes", label: "Upload Notes", icon: FolderOpen },
  { id: "case-law", label: "Add Case Law", icon: Scale },
  { id: "daily-quote", label: "Daily Quote", icon: MessageSquare },
  { id: "lectures", label: "Lectures", icon: Video },
  { id: "services", label: "Services", icon: Settings },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "users", label: "Users", icon: Users },
];

export default function AdminSidebar({ activeItem = "upload-notes" }) {
  return (
    <nav className="border-r border-border py-8">
      {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
        const isActive = id === activeItem;
        return (
          <div
            key={id}
            className={[
              "flex items-center gap-2.5 px-8 py-3 text-sm transition-all duration-200",
              isActive
                ? "border-l-2 border-gold bg-gold/[0.08] text-gold"
                : "border-l-2 border-transparent text-text-muted hover:bg-dark3 hover:text-text",
            ].join(" ")}
          >
            <Icon size={16} strokeWidth={1.75} />
            <span>{label}</span>
          </div>
        );
      })}
    </nav>
  );
}