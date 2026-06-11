import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import * as models from "@/models/schemas";

const MONGODB_URI = process.env.MONGODB_URI || "";
const MOCK_DB_PATH = path.join(process.cwd(), "src", "data", "mockDb.json");

// Helper to ensure mock database directory and file exist
function getMockDbData(): {
  projects: any[];
  websites: any[];
  pages: any[];
  sections: any[];
  deployments: any[];
} {
  const dirPath = path.dirname(MOCK_DB_PATH);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  if (!fs.existsSync(MOCK_DB_PATH)) {
    const initialData = {
      projects: [],
      websites: [],
      pages: [],
      sections: [],
      deployments: [],
    };
    fs.writeFileSync(MOCK_DB_PATH, JSON.stringify(initialData, null, 2), "utf8");
    return initialData;
  }
  try {
    const fileContent = fs.readFileSync(MOCK_DB_PATH, "utf8");
    return JSON.parse(fileContent);
  } catch (e) {
    console.error("Error reading mock DB file, resetting:", e);
    const initialData = {
      projects: [],
      websites: [],
      pages: [],
      sections: [],
      deployments: [],
    };
    fs.writeFileSync(MOCK_DB_PATH, JSON.stringify(initialData, null, 2), "utf8");
    return initialData;
  }
}

function writeMockDbData(data: any) {
  const dirPath = path.dirname(MOCK_DB_PATH);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  fs.writeFileSync(MOCK_DB_PATH, JSON.stringify(data, null, 2), "utf8");
}

// Mongoose Connection caching
let cachedConnection: any = (global as any).mongoose;

if (!cachedConnection) {
  cachedConnection = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToMongo() {
  if (cachedConnection.conn) {
    return cachedConnection.conn;
  }

  if (!cachedConnection.promise) {
    const opts = {
      bufferCommands: false,
    };

    cachedConnection.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cachedConnection.conn = await cachedConnection.promise;
  } catch (e) {
    cachedConnection.promise = null;
    throw e;
  }

  return cachedConnection.conn;
}

export async function connectToDatabase() {
  if (MONGODB_URI) {
    await connectToMongo();
    return true;
  }
  return false;
}

// ==========================================
// DB OPERATIONS LAYER (ABSTRACTED FOR DEV)
// ==========================================

export async function getProjects(userId: string): Promise<any[]> {
  const isMongo = await connectToDatabase();
  if (isMongo) {
    return await models.Project.find({ userId }).sort({ createdAt: -1 });
  } else {
    const db = getMockDbData();
    return db.projects
      .filter((p) => p.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

export async function getProject(projectId: string): Promise<any | null> {
  const isMongo = await connectToDatabase();
  if (isMongo) {
    return await models.Project.findById(projectId);
  } else {
    const db = getMockDbData();
    return db.projects.find((p) => p.id === projectId || p._id === projectId) || null;
  }
}

export async function createProject(projectData: any): Promise<any> {
  const isMongo = await connectToDatabase();
  if (isMongo) {
    return await models.Project.create(projectData);
  } else {
    const db = getMockDbData();
    const newProject = {
      ...projectData,
      id: Math.random().toString(36).substring(2, 9),
      _id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.projects.push(newProject);
    writeMockDbData(db);
    return newProject;
  }
}

export async function updateProject(projectId: string, projectData: any): Promise<any | null> {
  const isMongo = await connectToDatabase();
  if (isMongo) {
    return await models.Project.findByIdAndUpdate(projectId, projectData, { new: true });
  } else {
    const db = getMockDbData();
    const index = db.projects.findIndex((p) => p.id === projectId || p._id === projectId);
    if (index === -1) return null;

    db.projects[index] = {
      ...db.projects[index],
      ...projectData,
      updatedAt: new Date().toISOString(),
    };
    writeMockDbData(db);
    return db.projects[index];
  }
}

export async function deleteProject(projectId: string): Promise<boolean> {
  const isMongo = await connectToDatabase();
  if (isMongo) {
    const res = await models.Project.findByIdAndDelete(projectId);
    return !!res;
  } else {
    const db = getMockDbData();
    const initialLen = db.projects.length;
    db.projects = db.projects.filter((p) => p.id !== projectId && p._id !== projectId);
    writeMockDbData(db);
    return db.projects.length < initialLen;
  }
}

export async function getWebsites(userId: string): Promise<any[]> {
  const isMongo = await connectToDatabase();
  if (isMongo) {
    return await models.Website.find({ userId });
  } else {
    const db = getMockDbData();
    return db.websites.filter((w) => w.userId === userId);
  }
}

export async function getWebsiteByProject(projectId: string): Promise<any | null> {
  const isMongo = await connectToDatabase();
  if (isMongo) {
    return await models.Website.findOne({ projectId });
  } else {
    const db = getMockDbData();
    return db.websites.find((w) => w.projectId === projectId) || null;
  }
}

export async function getWebsiteBySubdomain(subdomain: string): Promise<any | null> {
  const isMongo = await connectToDatabase();
  if (isMongo) {
    return await models.Website.findOne({ subdomain });
  } else {
    const db = getMockDbData();
    return db.websites.find((w) => w.subdomain === subdomain) || null;
  }
}

export async function createWebsite(websiteData: any): Promise<any> {
  const isMongo = await connectToDatabase();
  if (isMongo) {
    return await models.Website.create(websiteData);
  } else {
    const db = getMockDbData();
    const newWebsite = {
      ...websiteData,
      id: Math.random().toString(36).substring(2, 9),
      _id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.websites.push(newWebsite);
    writeMockDbData(db);
    return newWebsite;
  }
}

export async function updateWebsite(websiteId: string, websiteData: any): Promise<any | null> {
  const isMongo = await connectToDatabase();
  if (isMongo) {
    return await models.Website.findByIdAndUpdate(websiteId, websiteData, { new: true });
  } else {
    const db = getMockDbData();
    const index = db.websites.findIndex((w) => w.id === websiteId || w._id === websiteId);
    if (index === -1) return null;

    db.websites[index] = {
      ...db.websites[index],
      ...websiteData,
      updatedAt: new Date().toISOString(),
    };
    writeMockDbData(db);
    return db.websites[index];
  }
}

export async function getPages(websiteId: string): Promise<any[]> {
  const isMongo = await connectToDatabase();
  if (isMongo) {
    return await models.Page.find({ websiteId });
  } else {
    const db = getMockDbData();
    return db.pages.filter((p) => p.websiteId === websiteId);
  }
}

export async function createPage(pageData: any): Promise<any> {
  const isMongo = await connectToDatabase();
  if (isMongo) {
    return await models.Page.create(pageData);
  } else {
    const db = getMockDbData();
    const newPage = {
      ...pageData,
      id: Math.random().toString(36).substring(2, 9),
      _id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.pages.push(newPage);
    writeMockDbData(db);
    return newPage;
  }
}

export async function getSections(pageId: string): Promise<any[]> {
  const isMongo = await connectToDatabase();
  if (isMongo) {
    return await models.Section.find({ pageId }).sort({ position: 1 });
  } else {
    const db = getMockDbData();
    return db.sections
      .filter((s) => s.pageId === pageId)
      .sort((a, b) => a.position - b.position);
  }
}

export async function saveSections(pageId: string, sectionsList: any[]): Promise<any[]> {
  const isMongo = await connectToDatabase();
  if (isMongo) {
    // Delete existing sections for this page
    await models.Section.deleteMany({ pageId });
    // Write new sections
    const created = await models.Section.insertMany(
      sectionsList.map((s, idx) => ({
        pageId,
        type: s.type,
        variant: s.variant,
        position: idx,
        props: s.props,
        style: s.style || {},
      }))
    );
    return created;
  } else {
    const db = getMockDbData();
    // Filter out old ones
    db.sections = db.sections.filter((s) => s.pageId !== pageId);
    // Add new ones
    const newSections = sectionsList.map((s, idx) => ({
      ...s,
      pageId,
      position: idx,
      id: s.id || Math.random().toString(36).substring(2, 9),
      _id: s._id || Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    db.sections.push(...newSections);
    writeMockDbData(db);
    return newSections;
  }
}

export async function createDeployment(deploymentData: any): Promise<any> {
  const isMongo = await connectToDatabase();
  if (isMongo) {
    return await models.Deployment.create(deploymentData);
  } else {
    const db = getMockDbData();
    const newDeployment = {
      ...deploymentData,
      id: Math.random().toString(36).substring(2, 9),
      _id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.deployments.push(newDeployment);
    writeMockDbData(db);
    return newDeployment;
  }
}

export async function getDeployments(websiteId: string): Promise<any[]> {
  const isMongo = await connectToDatabase();
  if (isMongo) {
    return await models.Deployment.find({ websiteId }).sort({ createdAt: -1 });
  } else {
    const db = getMockDbData();
    return db.deployments
      .filter((d) => d.websiteId === websiteId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}
