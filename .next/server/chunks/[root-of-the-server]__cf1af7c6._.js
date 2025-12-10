module.exports=[93695,(e,t,a)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},70406,(e,t,a)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},18622,(e,t,a)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},30056,e=>e.a(async(t,a)=>{try{let t=await e.y("pg");e.n(t),a()}catch(e){a(e)}},!0),15480,e=>e.a(async(t,a)=>{try{var r=e.i(30056),s=t([r]);[r]=s.then?(await s)():s;let h=new r.Pool({connectionString:process.env.DATABASE_URL,ssl:{rejectUnauthorized:!1}}),g=h.query(`
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
`),m="user_plans",f="user_accounts";function n(e){return{name:e.name??null,age:e.age??null,gender:e.gender??null,height:e.height??null,weight:e.weight??null,goal:e.goal??null,level:e.level??null,location:e.location??null,dietaryPrefs:e.dietaryPrefs??null,medicalHistory:e.medicalHistory??null,stressLevel:e.stressLevel??null}}function o(e){return{email:e.email,password_hash:e.password_hash,name:e.name,age:e.age,gender:e.gender,height:e.height?parseFloat(e.height):void 0,weight:e.weight?parseFloat(e.weight):void 0,goal:e.goal,level:e.level,location:e.location,dietaryPrefs:e.dietary_prefs,medicalHistory:e.medical_history,stressLevel:e.stress_level,created_at:e.created_at,updated_at:e.updated_at}}async function i(e){await g;let{rows:t}=await h.query(`select 
       p.email, 
       p.plan, 
       p.updated_at,
       u.name, u.age, u.gender, u.height, u.weight, u.goal, u.level, u.location, 
       u.dietary_prefs, u.medical_history, u.stress_level
     from ${m} p
     left join ${f} u on p.email = u.email
     where p.email = $1 limit 1`,[e]);if(!t[0])return null;let a=t[0],r={name:a.name,age:a.age,gender:a.gender,height:a.height?parseFloat(a.height):void 0,weight:a.weight?parseFloat(a.weight):void 0,goal:a.goal,level:a.level,location:a.location,dietaryPrefs:a.dietary_prefs,medicalHistory:a.medical_history,stressLevel:a.stress_level};return{email:a.email,user_data:r,plan:a.plan,updated_at:a.updated_at}}async function l(e,t,a){await g;let{rows:r}=await h.query(`insert into ${m} (email, user_data, plan, updated_at)
     values ($1, $2::jsonb, $3::jsonb, now())
     on conflict (email) do update set
       user_data = EXCLUDED.user_data,
       plan = EXCLUDED.plan,
       updated_at = now()
     returning email, user_data, plan, updated_at`,[e,JSON.stringify(t||{}),JSON.stringify(a)]);return r[0]}async function u(e){await g;let{rows:t}=await h.query(`select * from ${f} where email = $1 limit 1`,[e]);return t[0]?o(t[0]):null}async function d(e,t){await g,await h.query(`update ${f} set password_hash = $2, updated_at = now() where email = $1`,[e,t])}async function c(e){await g;let{email:t,password_hash:a,...r}=e,s=n(r),{rows:i}=await h.query(`insert into ${f} (
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
     returning *`,[t,a,s.name,s.age,s.gender,s.height,s.weight,s.goal,s.level,s.location,s.dietaryPrefs,s.medicalHistory,s.stressLevel]);return o(i[0])}async function p(e,t){await g;let a=n(t),{rows:r}=await h.query(`update ${f}
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
     returning *`,[e,a.name,a.age,a.gender,a.height,a.weight,a.goal,a.level,a.location,a.dietaryPrefs,a.medicalHistory,a.stressLevel]);return r[0]?o(r[0]):null}e.s(["fetchPlanByEmail",()=>i,"fetchUserAccount",()=>u,"updateUserPassword",()=>d,"updateUserProfile",()=>p,"upsertPlanRecord",()=>l,"upsertUserAccount",()=>c]),a()}catch(e){a(e)}},!1),54799,(e,t,a)=>{t.exports=e.x("crypto",()=>require("crypto"))},82777,e=>e.a(async(t,a)=>{try{var r=e.i(54799),s=e.i(89171),n=e.i(15480),o=t([n]);async function i(e){try{let t=await e.json();console.log("POST /api/user request:",t.mode,t.email);let{mode:a,email:o,password:i,profile:l}=t;if(!a||!o||!i)return s.NextResponse.json({error:"Missing email, password, or mode"},{status:400});let u=(0,r.createHash)("sha256").update(i).digest("hex");if("signup"===a){if(console.log("Checking if user exists:",o),await (0,n.fetchUserAccount)(o))return console.log("User already exists:",o),s.NextResponse.json({error:"Email already exists"},{status:409});console.log("Creating new user:",o);let e=await (0,n.upsertUserAccount)({email:o,password_hash:u,...l});return console.log("User created successfully:",e.email),s.NextResponse.json({user:e})}console.log("Fetching user for login:",o);let d=await (0,n.fetchUserAccount)(o);if(!d)return console.log("User not found:",o),s.NextResponse.json({error:"Account not found"},{status:404});if(d.password_hash!==u)return console.log("Invalid password for:",o),s.NextResponse.json({error:"Invalid credentials"},{status:401});return console.log("Login successful:",o),s.NextResponse.json({user:d})}catch(t){console.error("Error in POST /api/user:",t);let e=t.message;return s.NextResponse.json({error:e},{status:500})}}async function l(e){try{let t=await e.json();console.log("PUT /api/user request:",t.email);let{email:a,profile:r}=t;if(!a||!r)return s.NextResponse.json({error:"Missing email or profile data"},{status:400});let o=await (0,n.updateUserProfile)(a,r);if(!o)return s.NextResponse.json({error:"User not found"},{status:404});return s.NextResponse.json({user:o})}catch(t){console.error("Error in PUT /api/user:",t);let e=t.message;return s.NextResponse.json({error:e},{status:500})}}[n]=o.then?(await o)():o,e.s(["POST",()=>i,"PUT",()=>l]),a()}catch(e){a(e)}},!1),96269,e=>e.a(async(t,a)=>{try{var r=e.i(47909),s=e.i(74017),n=e.i(96250),o=e.i(59756),i=e.i(61916),l=e.i(14444),u=e.i(37092),d=e.i(69741),c=e.i(16795),p=e.i(87718),h=e.i(95169),g=e.i(47587),m=e.i(66012),f=e.i(70101),w=e.i(26937),y=e.i(10372),x=e.i(93695);e.i(52474);var v=e.i(220),_=e.i(82777),E=t([_]);[_]=E.then?(await E)():E;let $=new r.AppRouteRouteModule({definition:{kind:s.RouteKind.APP_ROUTE,page:"/api/user/route",pathname:"/api/user",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/user/route.ts",nextConfigOutput:"",userland:_}),{workAsyncStorage:U,workUnitAsyncStorage:D,serverHooks:P}=$;function R(){return(0,n.patchFetch)({workAsyncStorage:U,workUnitAsyncStorage:D})}async function C(e,t,a){$.isDev&&(0,o.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let r="/api/user/route";r=r.replace(/\/index$/,"")||"/";let n=await $.prepare(e,t,{srcPage:r,multiZoneDraftMode:!1});if(!n)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:_,params:E,nextConfig:R,parsedUrl:C,isDraftMode:U,prerenderManifest:D,routerServerContext:P,isOnDemandRevalidate:A,revalidateOnlyGenerated:j,resolvedPathname:N,clientReferenceManifest:b,serverActionsManifest:T}=n,q=(0,d.normalizeAppPath)(r),L=!!(D.dynamicRoutes[q]||D.routes[N]),S=async()=>((null==P?void 0:P.render404)?await P.render404(e,t,C,!1):t.end("This page could not be found"),null);if(L&&!U){let e=!!D.routes[N],t=D.dynamicRoutes[q];if(t&&!1===t.fallback&&!e){if(R.experimental.adapterPath)return await S();throw new x.NoFallbackError}}let O=null;!L||$.isDev||U||(O=N,O="/index"===O?"/":O);let k=!0===$.isDev||!L,H=L&&!k;T&&b&&(0,l.setReferenceManifestsSingleton)({page:r,clientReferenceManifest:b,serverActionsManifest:T,serverModuleMap:(0,u.createServerModuleMap)({serverActionsManifest:T})});let M=e.method||"GET",I=(0,i.getTracer)(),X=I.getActiveScopeSpan(),F={params:E,prerenderManifest:D,renderOpts:{experimental:{authInterrupts:!!R.experimental.authInterrupts},cacheComponents:!!R.cacheComponents,supportsDynamicResponse:k,incrementalCache:(0,o.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:R.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,r)=>$.onRequestError(e,t,r,P)},sharedContext:{buildId:_}},K=new c.NodeNextRequest(e),B=new c.NodeNextResponse(t),z=p.NextRequestAdapter.fromNodeNextRequest(K,(0,p.signalFromNodeResponse)(t));try{let n=async e=>$.handle(z,F).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=I.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==h.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let s=a.get("next.route");if(s){let t=`${M} ${s}`;e.setAttributes({"next.route":s,"http.route":s,"next.span_name":t}),e.updateName(t)}else e.updateName(`${M} ${r}`)}),l=!!(0,o.getRequestMeta)(e,"minimalMode"),u=async o=>{var i,u;let d=async({previousCacheEntry:s})=>{try{if(!l&&A&&j&&!s)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let r=await n(o);e.fetchMetrics=F.renderOpts.fetchMetrics;let i=F.renderOpts.pendingWaitUntil;i&&a.waitUntil&&(a.waitUntil(i),i=void 0);let u=F.renderOpts.collectedTags;if(!L)return await (0,m.sendResponse)(K,B,r,F.renderOpts.pendingWaitUntil),null;{let e=await r.blob(),t=(0,f.toNodeOutgoingHttpHeaders)(r.headers);u&&(t[y.NEXT_CACHE_TAGS_HEADER]=u),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==F.renderOpts.collectedRevalidate&&!(F.renderOpts.collectedRevalidate>=y.INFINITE_CACHE)&&F.renderOpts.collectedRevalidate,s=void 0===F.renderOpts.collectedExpire||F.renderOpts.collectedExpire>=y.INFINITE_CACHE?void 0:F.renderOpts.collectedExpire;return{value:{kind:v.CachedRouteKind.APP_ROUTE,status:r.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:s}}}}catch(t){throw(null==s?void 0:s.isStale)&&await $.onRequestError(e,t,{routerKind:"App Router",routePath:r,routeType:"route",revalidateReason:(0,g.getRevalidateReason)({isStaticGeneration:H,isOnDemandRevalidate:A})},P),t}},c=await $.handleResponse({req:e,nextConfig:R,cacheKey:O,routeKind:s.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:D,isRoutePPREnabled:!1,isOnDemandRevalidate:A,revalidateOnlyGenerated:j,responseGenerator:d,waitUntil:a.waitUntil,isMinimalMode:l});if(!L)return null;if((null==c||null==(i=c.value)?void 0:i.kind)!==v.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==c||null==(u=c.value)?void 0:u.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});l||t.setHeader("x-nextjs-cache",A?"REVALIDATED":c.isMiss?"MISS":c.isStale?"STALE":"HIT"),U&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let p=(0,f.fromNodeOutgoingHttpHeaders)(c.value.headers);return l&&L||p.delete(y.NEXT_CACHE_TAGS_HEADER),!c.cacheControl||t.getHeader("Cache-Control")||p.get("Cache-Control")||p.set("Cache-Control",(0,w.getCacheControlHeader)(c.cacheControl)),await (0,m.sendResponse)(K,B,new Response(c.value.body,{headers:p,status:c.value.status||200})),null};X?await u(X):await I.withPropagatedContext(e.headers,()=>I.trace(h.BaseServerSpan.handleRequest,{spanName:`${M} ${r}`,kind:i.SpanKind.SERVER,attributes:{"http.method":M,"http.target":e.url}},u))}catch(t){if(t instanceof x.NoFallbackError||await $.onRequestError(e,t,{routerKind:"App Router",routePath:q,routeType:"route",revalidateReason:(0,g.getRevalidateReason)({isStaticGeneration:H,isOnDemandRevalidate:A})}),L)throw t;return await (0,m.sendResponse)(K,B,new Response(null,{status:500})),null}}e.s(["handler",()=>C,"patchFetch",()=>R,"routeModule",()=>$,"serverHooks",()=>P,"workAsyncStorage",()=>U,"workUnitAsyncStorage",()=>D]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__cf1af7c6._.js.map