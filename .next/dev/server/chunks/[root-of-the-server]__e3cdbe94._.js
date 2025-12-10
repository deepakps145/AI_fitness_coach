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
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

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
    "deleteUserAccount",
    ()=>deleteUserAccount,
    "fetchPlanByEmail",
    ()=>fetchPlanByEmail,
    "fetchUserAccount",
    ()=>fetchUserAccount,
    "updateUserPassword",
    ()=>updateUserPassword,
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
function mapDbUserToUserAccount(row) {
    return {
        email: row.email,
        password_hash: row.password_hash,
        name: row.name,
        age: row.age,
        gender: row.gender,
        height: row.height ? parseFloat(row.height) : undefined,
        weight: row.weight ? parseFloat(row.weight) : undefined,
        goal: row.goal,
        level: row.level,
        location: row.location,
        dietaryPrefs: row.dietary_prefs,
        medicalHistory: row.medical_history,
        stressLevel: row.stress_level,
        created_at: row.created_at,
        updated_at: row.updated_at
    };
}
async function fetchPlanByEmail(email) {
    await initPromise;
    // Fetch plan from user_plans and latest profile from user_accounts
    const { rows } = await pool.query(`select 
       p.email, 
       p.plan, 
       p.updated_at,
       u.name, u.age, u.gender, u.height, u.weight, u.goal, u.level, u.location, 
       u.dietary_prefs, u.medical_history, u.stress_level
     from ${TABLE} p
     left join ${USER_TABLE} u on p.email = u.email
     where p.email = $1 limit 1`, [
        email
    ]);
    if (!rows[0]) return null;
    const row = rows[0];
    // Construct user_data from the joined user_accounts table
    const user_data = {
        name: row.name,
        age: row.age,
        gender: row.gender,
        height: row.height ? parseFloat(row.height) : undefined,
        weight: row.weight ? parseFloat(row.weight) : undefined,
        goal: row.goal,
        level: row.level,
        location: row.location,
        dietaryPrefs: row.dietary_prefs,
        medicalHistory: row.medical_history,
        stressLevel: row.stress_level
    };
    return {
        email: row.email,
        user_data,
        plan: row.plan,
        updated_at: row.updated_at
    };
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
    return rows[0] ? mapDbUserToUserAccount(rows[0]) : null;
}
async function updateUserPassword(email, passwordHash) {
    await initPromise;
    await pool.query(`update ${USER_TABLE} set password_hash = $2, updated_at = now() where email = $1`, [
        email,
        passwordHash
    ]);
}
async function deleteUserAccount(email) {
    await initPromise;
    await pool.query(`delete from ${USER_TABLE} where email = $1`, [
        email
    ]);
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
    return mapDbUserToUserAccount(rows[0]);
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
    return rows[0] ? mapDbUserToUserAccount(rows[0]) : null;
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/app/api/user/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "POST",
    ()=>POST,
    "PUT",
    ()=>PUT
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/backend/db.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
function hashPassword(password) {
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["createHash"])("sha256").update(password).digest("hex");
}
async function POST(req) {
    try {
        const body = await req.json();
        console.log("POST /api/user request:", body.mode, body.email);
        const { mode, email, password, profile } = body;
        if (!mode || !email || !password) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Missing email, password, or mode"
            }, {
                status: 400
            });
        }
        const passwordHash = hashPassword(password);
        if (mode === "signup") {
            console.log("Checking if user exists:", email);
            const existing = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fetchUserAccount"])(email);
            if (existing) {
                console.log("User already exists:", email);
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "Email already exists"
                }, {
                    status: 409
                });
            }
            console.log("Creating new user:", email);
            const record = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["upsertUserAccount"])({
                email,
                password_hash: passwordHash,
                ...profile
            });
            console.log("User created successfully:", record.email);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                user: record
            });
        }
        console.log("Fetching user for login:", email);
        const record = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fetchUserAccount"])(email);
        if (!record) {
            console.log("User not found:", email);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Account not found"
            }, {
                status: 404
            });
        }
        if (record.password_hash !== passwordHash) {
            console.log("Invalid password for:", email);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Invalid credentials"
            }, {
                status: 401
            });
        }
        console.log("Login successful:", email);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            user: record
        });
    } catch (error) {
        console.error("Error in POST /api/user:", error);
        const message = error.message;
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: message
        }, {
            status: 500
        });
    }
}
async function PUT(req) {
    try {
        const body = await req.json();
        console.log("PUT /api/user request:", body.email);
        const { email, profile } = body;
        if (!email || !profile) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Missing email or profile data"
            }, {
                status: 400
            });
        }
        const updatedUser = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateUserProfile"])(email, profile);
        if (!updatedUser) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "User not found"
            }, {
                status: 404
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            user: updatedUser
        });
    } catch (error) {
        console.error("Error in PUT /api/user:", error);
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

//# sourceMappingURL=%5Broot-of-the-server%5D__e3cdbe94._.js.map