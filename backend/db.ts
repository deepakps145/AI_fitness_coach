import { Pool } from "pg"
import type { PlanContent } from "@/lib/plan-types"
import type { UserData } from "@/components/app-wrapper"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

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
`)

const TABLE = "user_plans"
const USER_TABLE = "user_accounts"

export interface PlanRecord {
  email: string
  user_data: Partial<UserData>
  plan: PlanContent
  updated_at?: string
}

export interface UserAccount extends Partial<UserData> {
  email: string
  password_hash: string
  created_at?: string
  updated_at?: string
}

function normalizeProfile(profile: Partial<UserData>) {
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
    stressLevel: profile.stressLevel ?? null,
  }
}

function mapDbUserToUserAccount(row: any): UserAccount {
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
    updated_at: row.updated_at,
  }
}

export async function fetchPlanByEmail(email: string): Promise<PlanRecord | null> {
  await initPromise
  // Fetch plan from user_plans and latest profile from user_accounts
  const { rows } = await pool.query(
    `select 
       p.email, 
       p.plan, 
       p.updated_at,
       u.name, u.age, u.gender, u.height, u.weight, u.goal, u.level, u.location, 
       u.dietary_prefs, u.medical_history, u.stress_level
     from ${TABLE} p
     left join ${USER_TABLE} u on p.email = u.email
     where p.email = $1 limit 1`,
    [email],
  )
  
  if (!rows[0]) return null

  const row = rows[0]
  // Construct user_data from the joined user_accounts table
  const user_data: Partial<UserData> = {
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
  }

  return {
    email: row.email,
    user_data,
    plan: row.plan,
    updated_at: row.updated_at,
  }
}

export async function upsertPlanRecord(email: string, userData: Partial<UserData>, plan: PlanContent): Promise<PlanRecord> {
  await initPromise
  const { rows } = await pool.query(
    `insert into ${TABLE} (email, user_data, plan, updated_at)
     values ($1, $2::jsonb, $3::jsonb, now())
     on conflict (email) do update set
       user_data = EXCLUDED.user_data,
       plan = EXCLUDED.plan,
       updated_at = now()
     returning email, user_data, plan, updated_at`,
    [email, JSON.stringify(userData || {}), JSON.stringify(plan)],
  )
  return rows[0] as PlanRecord
}

export async function fetchUserAccount(email: string): Promise<UserAccount | null> {
  await initPromise
  const { rows } = await pool.query(
    `select * from ${USER_TABLE} where email = $1 limit 1`,
    [email],
  )
  return rows[0] ? mapDbUserToUserAccount(rows[0]) : null
}

export async function updateUserPassword(email: string, passwordHash: string): Promise<void> {
  await initPromise
  await pool.query(
    `update ${USER_TABLE} set password_hash = $2, updated_at = now() where email = $1`,
    [email, passwordHash]
  )
}

export async function deleteUserAccount(email: string): Promise<void> {
  await initPromise
  await pool.query(`delete from ${USER_TABLE} where email = $1`, [email])
}

export async function upsertUserAccount(account: UserAccount): Promise<UserAccount> {
  await initPromise
  const { email, password_hash, ...profile } = account
  const normalized = normalizeProfile(profile)

  const { rows } = await pool.query(
    `insert into ${USER_TABLE} (
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
     returning *`,
    [
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
      normalized.stressLevel,
    ],
  )

  return mapDbUserToUserAccount(rows[0])
}

export async function updateUserProfile(email: string, profile: Partial<UserData>): Promise<UserAccount | null> {
  await initPromise
  const normalized = normalizeProfile(profile)
  const { rows } = await pool.query(
    `update ${USER_TABLE}
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
     returning *`,
    [
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
      normalized.stressLevel,
    ],
  )
  return rows[0] ? mapDbUserToUserAccount(rows[0]) : null
}