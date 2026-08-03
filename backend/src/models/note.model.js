import mongoose from "mongoose";
import slugify from "slugify";

const { Schema } = mongoose;

const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Note title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters"],
      maxlength: [200, "Title cannot exceed 200 characters"],
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [20, "Description must be at least 20 characters"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },

    // Free-text author name shown to students
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
      maxlength: [100, "Author name cannot exceed 100 characters"],
    },

    thumbnail: {
      url: {
        type: String,
        default: null,
      },
      publicId: {
        type: String,
        default: null,
      },
    },

    file: {
      url: {
        type: String,
        required: [true, "PDF URL is required"],
      },

      publicId: {
        type: String,
        required: [true, "Cloudinary Public ID is required"],
      },

      originalName: {
        type: String,
        required: true,
      },

      format: {
        type: String,
        enum: {
          values: ["pdf"],
          message: "Only PDF files are allowed.",
        },
        required: true,
      },

      size: {
        type: Number,
        required: true,
        max: [20 * 1024 * 1024, "PDF size cannot exceed 20 MB"],
      },
    },

    accessLevel: {
      type: String,
      enum: {
        values: ["free", "subscriber", "premium"],
        message: "{VALUE} is not a valid access level",
      },
      default: "free",
    },

    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    views: {
      type: Number,
      default: 0,
      min: 0,
    },

    downloadCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);


noteSchema.index(
  {
    title: "text",
    description: "text",
    tags: "text",
  },
  {
    weights: {
      title: 10,
      tags: 5,
      description: 2,
    },
    name: "note_text_search",
  }
);

noteSchema.index({ category: 1 });
noteSchema.index({ uploadedBy: 1 });
noteSchema.index({ isPublished: 1 });
noteSchema.index({ accessLevel: 1 });
noteSchema.index({ createdAt: -1 });
noteSchema.index({ views: -1 });
noteSchema.index({ downloadCount: -1 });



noteSchema.pre("save", async function (next) {
  if (!this.isModified("title")) return next();

  const baseSlug = slugify(this.title, {
    lower: true,
    strict: true,
    trim: true,
  });

  let slug = baseSlug;
  let counter = 1;

  while (
    await mongoose.models.Note.exists({
      slug,
      _id: { $ne: this._id },
    })
  ) {
    slug = `${baseSlug}-${counter++}`;
  }

  this.slug = slug;

});

const Note = mongoose.model("Note", noteSchema);

export default Note;