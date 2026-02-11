const crypto = require("crypto");

const COOKIE_NAME = "testimonial_owners";
const MAX_AGE = 365 * 24 * 60 * 60 * 1000; // 1 year
const MAX_ENTRIES = 50;

function getSecret() {
  return process.env.TESTIMONIAL_COOKIE_SECRET || process.env.COOKIE_SECRET || "testimonial-owner-secret";
}

function sign(value) {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("hex");
}

function getOwned(req) {
  const raw = req.cookies?.[COOKIE_NAME] || req.cookies?.[COOKIE_NAME.replace(/-/g, "_")];
  if (!raw || typeof raw !== "string") return [];
  const dot = raw.lastIndexOf(".");
  if (dot === -1) return [];
  const value = raw.slice(0, dot);
  const sig = raw.slice(dot + 1);
  if (sign(value) !== sig) return [];
  try {
    const list = JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
    return Array.isArray(list) ? list.slice(0, MAX_ENTRIES) : [];
  } catch {
    return [];
  }
}

function setOwnedCookie(res, list) {
  const limited = list.slice(-MAX_ENTRIES);
  const value = Buffer.from(JSON.stringify(limited), "utf8").toString("base64url");
  const sig = sign(value);
  const cookie = `${value}.${sig}`;
  res.cookie(COOKIE_NAME, cookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });
}

function addOwner(res, req, id, token) {
  const list = getOwned(req);
  const idStr = String(id);
  const filtered = list.filter((e) => e.id !== idStr);
  filtered.push({ id: idStr, token });
  setOwnedCookie(res, filtered);
}

function removeOwner(res, req, id) {
  const idStr = String(id);
  const list = getOwned(req).filter((e) => e.id !== idStr);
  setOwnedCookie(res, list);
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/** Returns true if owned list contains this id with matching token */
function isOwnerFor(owned, id, token) {
  if (!token) return false;
  const e = owned.find((x) => x.id === String(id));
  return e ? hashToken(e.token) === hashToken(token) : false;
}

module.exports = {
  getOwned,
  addOwner,
  removeOwner,
  setOwnedCookie,
  isOwnerFor,
};
