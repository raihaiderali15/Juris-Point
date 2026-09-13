import AdminSidebar from "../admin/AdminSidebar";

export default function AdminLayout({ title, userEmail, activeItem, children }) {
  return (
    <section className="bg-dark2 px-12 py-24">
      <div className="mb-4 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-gold">
        <span className="h-px w-[30px] bg-gold" />
        Admin Portal
      </div>
      <h2 className="mb-6 font-serif text-3xl font-bold text-text md:text-4xl">
        Content Management
      </h2>

      <div className="mt-12 overflow-hidden border border-border bg-dark2">
        <div className="flex items-center justify-between border-b border-border bg-dark3 px-8 py-5">
          <span className="text-sm uppercase tracking-[0.1em] text-gold">
            {title}
          </span>
          {userEmail && (
            <span className="text-sm text-text-muted">
              Logged in as: <span className="text-text">{userEmail}</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr]">
          <AdminSidebar activeItem={activeItem} />
          <div className="p-8">{children}</div>
        </div>
      </div>
    </section>
  );
}