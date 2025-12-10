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
"[externals]/pg [external] (pg, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("pg");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/backend/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "fetchPlanByEmail",
    ()=>fetchPlanByEmail,
    "fetchUserAccount",
    ()=>fetchUserAccount,
    "updateUserProfile",
    ()=>updateUserProfile,
    "upsertPlanRecord",
    ()=>upsertPlanRecord,
    "upsertUserAccount",
    ()=>upsertUserAccount
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/pg [external] (pg, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
const pool = new __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__["Pool"]({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});
const initPromise = pool.query(`
  create table if not exists user_accounts (
    email            text primary key,
    password_hash    text not null,
    name             text,
    age              integer,
    gender           text,
    height           numeric(6,2),
    weight           numeric(6,2),
    goal             text,
    level            text,
    location         text,
    dietary_prefs    text[],
    medical_history  text,
    stress_level     text,
    created_at       timestamptz default now(),
    updated_at       timestamptz default now()
  );

  create table if not exists user_plans (
    email      text primary key references user_accounts(email) on delete cascade,
    user_data  jsonb,
    plan       jsonb not null,
    updated_at timestamptz default now()
  );
`);
const TABLE = "user_plans";
const USER_TABLE = "user_accounts";
function normalizeProfile(profile) {
    return {
        name: profile.name ?? null,
        age: profile.age ?? null,
        gender: profile.gender ?? null,
        height: profile.height ?? null,
        weight: profile.weight ?? null,
        goal: profile.goal ?? null,
        level: profile.level ?? null,
        location: profile.location ?? null,
        dietaryPrefs: profile.dietaryPrefs ?? null,
        medicalHistory: profile.medicalHistory ?? null,
        stressLevel: profile.stressLevel ?? null
    };
}
async function fetchPlanByEmail(email) {
    await initPromise;
    const { rows } = await pool.query(`select email, user_data, plan, updated_at from ${TABLE} where email = $1 limit 1`, [
        email
    ]);
    return rows[0] || null;
}
async function upsertPlanRecord(email, userData, plan) {
    await initPromise;
    const { rows } = await pool.query(`insert into ${TABLE} (email, user_data, plan, updated_at)
     values ($1, $2::jsonb, $3::jsonb, now())
     on conflict (email) do update set
       user_data = EXCLUDED.user_data,
       plan = EXCLUDED.plan,
       updated_at = now()
     returning email, user_data, plan, updated_at`, [
        email,
        JSON.stringify(userData || {}),
        JSON.stringify(plan)
    ]);
    return rows[0];
}
async function fetchUserAccount(email) {
    await initPromise;
    const { rows } = await pool.query(`select * from ${USER_TABLE} where email = $1 limit 1`, [
        email
    ]);
    return rows[0] || null;
}
async function upsertUserAccount(account) {
    await initPromise;
    const { email, password_hash, ...profile } = account;
    const normalized = normalizeProfile(profile);
    const { rows } = await pool.query(`insert into ${USER_TABLE} (
        email, password_hash, name, age, gender, height, weight, goal, level, location,
        dietary_prefs, medical_history, stress_level, updated_at
     ) values (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::text[], $12, $13, now()
     )
     on conflict (email) do update set
        password_hash = EXCLUDED.password_hash,
        name = EXCLUDED.name,
        age = EXCLUDED.age,
        gender = EXCLUDED.gender,
        height = EXCLUDED.height,
        weight = EXCLUDED.weight,
        goal = EXCLUDED.goal,
        level = EXCLUDED.level,
        location = EXCLUDED.location,
        dietary_prefs = EXCLUDED.dietary_prefs,
        medical_history = EXCLUDED.medical_history,
        stress_level = EXCLUDED.stress_level,
        updated_at = now()
     returning *`, [
        email,
        password_hash,
        normalized.name,
        normalized.age,
        normalized.gender,
        normalized.height,
        normalized.weight,
        normalized.goal,
        normalized.level,
        normalized.location,
        normalized.dietaryPrefs,
        normalized.medicalHistory,
        normalized.stressLevel
    ]);
    return rows[0];
}
async function updateUserProfile(email, profile) {
    await initPromise;
    const normalized = normalizeProfile(profile);
    const { rows } = await pool.query(`update ${USER_TABLE}
     set
       name = coalesce($2, name),
       age = coalesce($3::integer, age),
       gender = coalesce($4, gender),
       height = coalesce($5::numeric, height),
       weight = coalesce($6::numeric, weight),
       goal = coalesce($7, goal),
       level = coalesce($8, level),
       location = coalesce($9, location),
       dietary_prefs = coalesce($10::text[], dietary_prefs),
       medical_history = coalesce($11, medical_history),
       stress_level = coalesce($12, stress_level),
       updated_at = now()
     where email = $1
     returning *`, [
        email,
        normalized.name,
        normalized.age,
        normalized.gender,
        normalized.height,
        normalized.weight,
        normalized.goal,
        normalized.level,
        normalized.location,
        normalized.dietaryPrefs,
        normalized.medicalHistory,
        normalized.stressLevel
    ]);
    return rows[0] || null;
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/app/api/plan/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/backend/db.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");
        if (!email) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Missing email"
            }, {
                status: 400
            });
        }
        const record = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fetchPlanByEmail"])(email);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            record
        });
    } catch (error) {
        const message = error.message;
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: message
        }, {
            status: 500
        });
    }
}
async function POST(req) {
    try {
        const { email, userData, plan } = await req.json();
        if (!email || !plan) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Missing email or plan"
            }, {
                status: 400
            });
        }
        const record = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["upsertPlanRecord"])(email, userData, plan);
        if (userData && Object.keys(userData).length > 0) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateUserProfile"])(email, userData);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            record
        });
    } catch (error) {
        const message = error.message;
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: message
        }, {
            status: 500
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__cafc34ce._.js.map