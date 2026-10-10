import { UploadCloud } from "lucide-react";
import AdminLayout from "../components/layout/AdminLayout";
import { Input } from "../components/ui/Input";
import CategoryField from "../components/admin/category";
import { useState } from "react";
const inputClasses =
  "w-full border border-border bg-dark px-3.5 py-2.5 text-sm text-text outline-none transition-colors focus:border-gold";
const labelClasses = "text-xs uppercase tracking-[0.1em] text-text-muted";
const selectArrow = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238B8A99' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
};

export default function UploadNotesPage() {
  const [form, setForm] = useState({title: "", category: "", authorName: "", uploadedBy: "", tags: "", description: ""});
  const [file, setFile] = useState(null);
  const [error, setError] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  
  const formHandler = (e) => {
    e.preventDefault();
    setError({});
    setFormError("");
    // Validate form fields
    let newErrors={};
    if(!form.title) newErrors.title = "Title is required";
    if(!form.category) newErrors.category = "Category is required";
    if(!form.authorName) newErrors.authorName = "Author Name is required";
    if(!form.uploadedBy) newErrors.uploadedBy = "Uploaded By is required";
    if(!form.description) newErrors.description = "Description is required";
    if(!file) newErrors.file = "File is required";
    if(Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }

  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError((prev) => ({ ...prev, [name]: "" }));
  }
  return (
    <AdminLayout
      title="LexNotes Admin — Content Upload"
      userEmail="admin@lexnotes.co.uk"
      activeItem="upload-notes"
    >
      {/* Upload zone */}
     <div className="mb-8">
  <label
    htmlFor="file-upload"
    className="group flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border px-8 py-12 text-center transition-all duration-300 hover:border-gold hover:bg-gold/[0.03]"
  >
    <UploadCloud
      className="mb-4 text-gold transition-transform duration-300 group-hover:-translate-y-1"
      size={44}
      strokeWidth={1.5}
    />

    <p className="mb-2 text-sm text-text">
      <span className="font-semibold">Drag & Drop your file here</span>
    </p>

    <p className="text-xs text-text-muted">
      or <span className="font-medium text-gold">click to browse</span>
    </p>

    <p className="mt-3 text-[11px] text-text-muted">
      Supported formats: PDF, DOCX
    </p>

    <input
      id="file-upload"
      type="file"
      accept=".pdf,.docx"
      className="hidden"
      onChange={(e) => setFile(e.target.files[0])}
    />
  </label>

  {error.file && (
    <p className="mt-2 text-xs text-red-500">{error.file}</p>
  )}
</div>



      {/* Note form */}
      <form onSubmit={formHandler} className="mb-8 flex flex-col gap-6">  
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Input
              label="Note Title"
              type="text"
              placeholder="Introduction to Law"
              name="title"
              value={form.title}
              onChange={handleChange}
              error={error.title}
            />

          </div>
          <div className="flex flex-col gap-1.5 z-50">
            <CategoryField />
            {/* <label className={labelClasses}>Category</label>
            <select className={inputClasses} style={selectArrow}>
              <option>Contract Law</option>
              <option>Criminal Law</option>
              <option>Constitutional Law</option>
              <option>Tort Law</option>
              <option>Equity & Trusts</option>
              <option>Land Law</option>
            </select> */}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Input
              label="Author Name"
              type="text"
              placeholder="Dr. Sarah Ahmed, Barrister"
              name="authorName"
              value={form.authorName}
              onChange={handleChange}
              error={error.authorName}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Input
              label="Uploaded By"
              type="text"
              placeholder="Your Name"
              name="uploadedBy"
              value={form.uploadedBy}
              onChange={handleChange}
              error={error.uploadedBy}
            />

          </div>
        </div>

        <div className="mb-2 flex flex-col gap-1.5">
         <Input
              label="Tags"
              type="text"
              placeholder="contract, formation, offer, acceptance"
              name="tags"
              value={form.tags}
              onChange={handleChange}
            
            />
        <div className="flex flex-col gap-1.5">
          <Input
            label="Description"
            type="text"
            placeholder="A brief overview of the note content"
            name="description"
            value={form.description}
            onChange={handleChange}
            error={error.description}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-br from-gold to-gold-light py-3.5 text-sm font-semibold uppercase tracking-[0.08em] text-dark transition-all hover:opacity-90 hover:-translate-y-px"
        >
          Publish Note →
        </button>
      </div>
      </div>
    </form>
    </AdminLayout>
  );
}