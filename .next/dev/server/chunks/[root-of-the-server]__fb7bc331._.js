module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[project]/backend/gemini.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generatePlanFromGemini",
    ()=>generatePlanFromGemini,
    "generateTipsFromGemini",
    ()=>generateTipsFromGemini
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$buffer__$5b$external$5d$__$28$buffer$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/buffer [external] (buffer, cjs)");
;
const GEMINI_MODEL = process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";
const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta";
const DEFAULT_MOTIVATION = "Your plan is ready. Stay consistent and you'll see results.";
function buildPrompt(body) {
    const lines = [
        "You are an expert fitness coach and dietitian.",
        "Respond ONLY with valid JSON. Do not include code fences, markdown, or prose.",
        "Ensure all keys and string values are enclosed in double quotes.",
        "Do not use trailing commas.",
        "Fields: workouts (array of {name, sets, reps, rest, focus, imagePrompt}), meals (array of {meal, items, calories, protein, carbs, fats, imagePrompt}), tips (array of strings), motivation (single string).",
        "Keep workouts 4-6 items, meals 4 items (breakfast, lunch, snack, dinner).",
        "Tailor to the user's goals, level, location, dietary preferences, and medical notes.",
        `User data: ${JSON.stringify(body)}`
    ];
    return lines.join("\n");
}
function buildTipsPrompt(body, plan) {
    const lines = [
        "You are a motivational fitness coach.",
        "Respond ONLY with JSON containing { \"tips\": string[], \"motivation\": string }.",
        "Tips must be actionable (max 2 sentences each). Motivation should be a single uplifting quote.",
        `User data: ${JSON.stringify(body)}`
    ];
    if (plan) {
        lines.push(`Current plan context: ${JSON.stringify(plan)}`);
    }
    return lines.join("\n");
}
const extractJson = (text)=>{
    const fenced = text.match(/```json([\s\S]*?)```/i);
    if (fenced?.[1]) return fenced[1].trim();
    const braces = text.match(/\{[\s\S]*\}/);
    if (braces?.[0]) return braces[0].trim();
    return null;
};
const repairJson = (text)=>{
    // 1. Remove markdown code blocks
    let cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
    // 2. Attempt to fix common JSON syntax errors
    // Replace single quotes with double quotes for keys/values, but be careful about apostrophes in text
    // This is hard to do perfectly with regex. 
    // Instead, let's focus on the structure.
    // If the model returns "key": "value" "key2": "value" (missing comma)
    // We can try to insert commas between value and key.
    // Look for " (end of string) followed by whitespace/newlines then " (start of key)
    cleaned = cleaned.replace(/"\s+(?=")/g, '", ');
    // If the model returns number followed by key without comma: 123 "key"
    cleaned = cleaned.replace(/(\d+)\s+(?=")/g, '$1, ');
    // If the model returns boolean followed by key without comma: true "key"
    cleaned = cleaned.replace(/(true|false)\s+(?=")/g, '$1, ');
    // Remove trailing commas before closing braces/brackets
    cleaned = cleaned.replace(/,\s*([\]}])/g, '$1');
    return cleaned;
};
async function requestGemini(prompt) {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not set");
    }
    const geminiRes = await fetch(`${GEMINI_BASE}/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: prompt
                        }
                    ]
                }
            ],
            generationConfig: {
                temperature: 0.8,
                maxOutputTokens: 8192,
                responseMimeType: "application/json"
            }
        })
    });
    if (!geminiRes.ok) {
        const errorText = await geminiRes.text();
        throw new Error(errorText || "Gemini request failed");
    }
    const geminiJson = await geminiRes.json();
    const parts = geminiJson?.candidates?.[0]?.content?.parts;
    const rawText = Array.isArray(parts) ? parts.map((p)=>{
        if (typeof p?.text === "string") return p.text;
        if (p?.inlineData?.data) {
            try {
                const buf = __TURBOPACK__imported__module__$5b$externals$5d2f$buffer__$5b$external$5d$__$28$buffer$2c$__cjs$29$__["Buffer"].from(p.inlineData.data, "base64").toString("utf8");
                return buf;
            } catch  {
                return "";
            }
        }
        if (p?.json) {
            try {
                return JSON.stringify(p.json);
            } catch  {
                return "";
            }
        }
        return "";
    }).join("\n").trim() : undefined;
    if (!rawText) {
        throw new Error("No content returned from Gemini");
    }
    return rawText;
}
function parseJsonPayload(rawText) {
    try {
        const cleaned = extractJson(rawText) ?? rawText.trim();
        return JSON.parse(cleaned);
    } catch (err) {
        const repaired = repairJson(rawText);
        return JSON.parse(repaired);
    }
}
async function generatePlanFromGemini(body) {
    const prompt = buildPrompt(body);
    const rawText = await requestGemini(prompt);
    const parsed = parseJsonPayload(rawText);
    return {
        workouts: parsed.workouts || [],
        meals: parsed.meals || [],
        tips: parsed.tips || [],
        motivation: parsed.motivation || DEFAULT_MOTIVATION
    };
}
async function generateTipsFromGemini(body, plan) {
    const prompt = buildTipsPrompt(body, plan);
    const rawText = await requestGemini(prompt);
    const parsed = parseJsonPayload(rawText);
    return {
        tips: parsed.tips || [],
        motivation: parsed.motivation || DEFAULT_MOTIVATION
    };
}
}),
"[project]/app/api/generate-tips/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$gemini$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/backend/gemini.ts [app-route] (ecmascript)");
;
;
async function POST(req) {
    try {
        const { userData, plan } = await req.json();
        if (!userData) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Missing user data"
            }, {
                status: 400
            });
        }
        const tips = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$gemini$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateTipsFromGemini"])(userData, plan);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(tips);
    } catch (error) {
        const message = error.message;
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__fb7bc331._.js.map