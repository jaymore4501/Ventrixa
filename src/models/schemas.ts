import mongoose, { Schema, Document, Types } from "mongoose";

// --- User Interface ---
export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string;          // only for credentials users (bcrypt hash)
  image?: string;
  provider: "credentials" | "google" | "github";
  bio?: string;
  location?: string;
  websiteUrl?: string;
  emailVerified?: Date;
  plan: "free" | "pro" | "agency";
  githubStarred: boolean;
  githubUsername?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, select: false }, // excluded from queries by default
    image: { type: String, default: "" },
    provider: { type: String, enum: ["credentials", "google", "github"], default: "credentials" },
    bio: { type: String, default: "" },
    location: { type: String, default: "" },
    websiteUrl: { type: String, default: "" },
    emailVerified: { type: Date },
    plan: { type: String, enum: ["free", "pro", "agency"], default: "free" },
    githubStarred: { type: Boolean, default: false },
    githubUsername: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);



// --- Project Interface ---
export interface IProject extends Document {
  userId: string;
  name: string;
  description: string;
  industry: string;
  businessType: string;
  targetAudience: string;
  brandVoice: string;
  theme: "dark" | "light";
  colorPalette: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
    name?: string;
  };
  typography: string;
  logoText: string;
  logoType?: "text" | "image";
  logoSrc?: string;
  logoWidth?: number;
  logoHeight?: number;
  selectedPages: string[];
  designTheme: string;
  status: "draft" | "generating" | "completed";
  subdomain?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    industry: { type: String, required: true },
    businessType: { type: String, required: true },
    targetAudience: { type: String, required: true },
    brandVoice: { type: String, required: true },
    theme: { type: String, enum: ["dark", "light"], default: "dark" },
    colorPalette: {
      primary: { type: String, required: true },
      secondary: { type: String, required: true },
      background: { type: String, required: true },
      text: { type: String, required: true },
      accent: { type: String, required: true },
      name: { type: String },
    },
    typography: { type: String, required: true },
    logoText: { type: String, required: true },
    logoType: { type: String, enum: ["text", "image"], default: "text" },
    logoSrc: { type: String, default: "" },
    logoWidth: { type: Number, default: 120 },
    logoHeight: { type: Number, default: 40 },
    selectedPages: [{ type: String }],
    designTheme: { type: String, required: true },
    status: { type: String, enum: ["draft", "generating", "completed"], default: "draft" },
    subdomain: { type: String },
  },
  { timestamps: true }
);

// --- Website Interface ---
export interface IWebsite extends Document {
  projectId: string;
  userId: string;
  subdomain: string;
  customDomain?: string;
  isPublished: boolean;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

const WebsiteSchema = new Schema<IWebsite>(
  {
    projectId: { type: String, required: true },
    userId: { type: String, required: true },
    subdomain: { type: String, required: true, unique: true },
    customDomain: { type: String },
    isPublished: { type: Boolean, default: false },
    version: { type: Number, default: 1 },
  },
  { timestamps: true }
);

// --- Page Interface ---
export interface IPage extends Document {
  websiteId: string;
  name: string;
  slug: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  createdAt: Date;
  updatedAt: Date;
}

const PageSchema = new Schema<IPage>(
  {
    websiteId: { type: String, required: true },
    name: { type: String, required: true },
    slug: { type: String, default: "" },
    seoTitle: { type: String, required: true },
    seoDescription: { type: String, required: true },
    seoKeywords: { type: String, required: true },
  },
  { timestamps: true }
);

// --- Section Interface ---
export interface ISection extends Document {
  pageId: string;
  type: string; // e.g. "navbar", "hero", "features", "cta", "footer"
  variant: string; // e.g. "modern", "minimal", "glassmorphism"
  position: number;
  props: Record<string, any>;
  style: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const SectionSchema = new Schema<ISection>(
  {
    pageId: { type: String, required: true },
    type: { type: String, required: true },
    variant: { type: String, required: true },
    position: { type: Number, required: true },
    props: { type: Schema.Types.Mixed, default: {} },
    style: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

// --- Deployment Interface ---
export interface IDeployment extends Document {
  websiteId: string;
  version: number;
  subdomain: string;
  customDomain?: string;
  status: "pending" | "success" | "failed";
  logs: string[];
  createdAt: Date;
  updatedAt: Date;
}

const DeploymentSchema = new Schema<IDeployment>(
  {
    websiteId: { type: String, required: true },
    version: { type: Number, required: true },
    subdomain: { type: String, required: true },
    customDomain: { type: String },
    status: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
    logs: [{ type: String }],
  },
  { timestamps: true }
);

// --- Prevent compilation errors during Next.js Hot Reloads ---
export const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export const Project = mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);
export const Website = mongoose.models.Website || mongoose.model<IWebsite>("Website", WebsiteSchema);
export const Page = mongoose.models.Page || mongoose.model<IPage>("Page", PageSchema);
export const Section = mongoose.models.Section || mongoose.model<ISection>("Section", SectionSchema);
export const Deployment = mongoose.models.Deployment || mongoose.model<IDeployment>("Deployment", DeploymentSchema);
