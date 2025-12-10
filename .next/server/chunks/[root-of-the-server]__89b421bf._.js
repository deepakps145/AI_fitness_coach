module.exports=[93695,(e,t,a)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},70406,(e,t,a)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},18622,(e,t,a)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},30056,e=>e.a(async(t,a)=>{try{let t=await e.y("pg");e.n(t),a()}catch(e){a(e)}},!0),15480,e=>e.a(async(t,a)=>{try{var r=e.i(30056),n=t([r]);[r]=n.then?(await n)():n;let h=new r.Pool({connectionString:process.env.DATABASE_URL,ssl:{rejectUnauthorized:!1}}),g=h.query(`
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
`),m="user_plans",w="user_accounts";function s(e){return{name:e.name??null,age:e.age??null,gender:e.gender??null,height:e.height??null,weight:e.weight??null,goal:e.goal??null,level:e.level??null,location:e.location??null,dietaryPrefs:e.dietaryPrefs??null,medicalHistory:e.medicalHistory??null,stressLevel:e.stressLevel??null}}function i(e){return{email:e.email,password_hash:e.password_hash,name:e.name,age:e.age,gender:e.gender,height:e.height?parseFloat(e.height):void 0,weight:e.weight?parseFloat(e.weight):void 0,goal:e.goal,level:e.level,location:e.location,dietaryPrefs:e.dietary_prefs,medicalHistory:e.medical_history,stressLevel:e.stress_level,created_at:e.created_at,updated_at:e.updated_at}}async function l(e){await g;let{rows:t}=await h.query(`select 
       p.email, 
       p.plan, 
       p.updated_at,
       u.name, u.age, u.gender, u.height, u.weight, u.goal, u.level, u.location, 
       u.dietary_prefs, u.medical_history, u.stress_level
     from ${m} p
     left join ${w} u on p.email = u.email
     where p.email = $1 limit 1`,[e]);if(!t[0])return null;let a=t[0],r={name:a.name,age:a.age,gender:a.gender,height:a.height?parseFloat(a.height):void 0,weight:a.weight?parseFloat(a.weight):void 0,goal:a.goal,level:a.level,location:a.location,dietaryPrefs:a.dietary_prefs,medicalHistory:a.medical_history,stressLevel:a.stress_level};return{email:a.email,user_data:r,plan:a.plan,updated_at:a.updated_at}}async function o(e,t,a){await g;let{rows:r}=await h.query(`insert into ${m} (email, user_data, plan, updated_at)
     values ($1, $2::jsonb, $3::jsonb, now())
     on conflict (email) do update set
       user_data = EXCLUDED.user_data,
       plan = EXCLUDED.plan,
       updated_at = now()
     returning email, user_data, plan, updated_at`,[e,JSON.stringify(t||{}),JSON.stringify(a)]);return r[0]}async function d(e){await g;let{rows:t}=await h.query(`select * from ${w} where email = $1 limit 1`,[e]);return t[0]?i(t[0]):null}async function u(e,t){await g,await h.query(`update ${w} set password_hash = $2, updated_at = now() where email = $1`,[e,t])}async function c(e){await g;let{email:t,password_hash:a,...r}=e,n=s(r),{rows:l}=await h.query(`insert into ${w} (
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
     returning *`,[t,a,n.name,n.age,n.gender,n.height,n.weight,n.goal,n.level,n.location,n.dietaryPrefs,n.medicalHistory,n.stressLevel]);return i(l[0])}async function p(e,t){await g;let a=s(t),{rows:r}=await h.query(`update ${w}
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
     returning *`,[e,a.name,a.age,a.gender,a.height,a.weight,a.goal,a.level,a.location,a.dietaryPrefs,a.medicalHistory,a.stressLevel]);return r[0]?i(r[0]):null}e.s(["fetchPlanByEmail",()=>l,"fetchUserAccount",()=>d,"updateUserPassword",()=>u,"updateUserProfile",()=>p,"upsertPlanRecord",()=>o,"upsertUserAccount",()=>c]),a()}catch(e){a(e)}},!1),23178,e=>e.a(async(t,a)=>{try{var r=e.i(89171),n=e.i(15480),s=t([n]);async function i(e){try{let{searchParams:t}=new URL(e.url),a=t.get("email");if(!a)return r.NextResponse.json({error:"Missing email"},{status:400});let s=await (0,n.fetchPlanByEmail)(a);return r.NextResponse.json({record:s})}catch(t){let e=t.message;return r.NextResponse.json({error:e},{status:500})}}async function l(e){try{let{email:t,userData:a,plan:s}=await e.json();if(!t||!s)return r.NextResponse.json({error:"Missing email or plan"},{status:400});let i=await (0,n.upsertPlanRecord)(t,a,s);return a&&Object.keys(a).length>0&&await (0,n.updateUserProfile)(t,a),r.NextResponse.json({record:i})}catch(t){let e=t.message;return r.NextResponse.json({error:e},{status:500})}}[n]=s.then?(await s)():s,e.s(["GET",()=>i,"POST",()=>l]),a()}catch(e){a(e)}},!1),49366,e=>e.a(async(t,a)=>{try{var r=e.i(47909),n=e.i(74017),s=e.i(96250),i=e.i(59756),l=e.i(61916),o=e.i(14444),d=e.i(37092),u=e.i(69741),c=e.i(16795),p=e.i(87718),h=e.i(95169),g=e.i(47587),m=e.i(66012),w=e.i(70101),y=e.i(26937),v=e.i(10372),f=e.i(93695);e.i(52474);var x=e.i(220),_=e.i(23178),E=t([_]);[_]=E.then?(await E)():E;let $=new r.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/plan/route",pathname:"/api/plan",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/plan/route.ts",nextConfigOutput:"",userland:_}),{workAsyncStorage:D,workUnitAsyncStorage:P,serverHooks:U}=$;function R(){return(0,s.patchFetch)({workAsyncStorage:D,workUnitAsyncStorage:P})}async function C(e,t,a){$.isDev&&(0,i.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let r="/api/plan/route";r=r.replace(/\/index$/,"")||"/";let s=await $.prepare(e,t,{srcPage:r,multiZoneDraftMode:!1});if(!s)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:_,params:E,nextConfig:R,parsedUrl:C,isDraftMode:D,prerenderManifest:P,routerServerContext:U,isOnDemandRevalidate:b,revalidateOnlyGenerated:A,resolvedPathname:j,clientReferenceManifest:N,serverActionsManifest:q}=s,L=(0,u.normalizeAppPath)(r),T=!!(P.dynamicRoutes[L]||P.routes[j]),O=async()=>((null==U?void 0:U.render404)?await U.render404(e,t,C,!1):t.end("This page could not be found"),null);if(T&&!D){let e=!!P.routes[j],t=P.dynamicRoutes[L];if(t&&!1===t.fallback&&!e){if(R.experimental.adapterPath)return await O();throw new f.NoFallbackError}}let S=null;!T||$.isDev||D||(S=j,S="/index"===S?"/":S);let k=!0===$.isDev||!T,H=T&&!k;q&&N&&(0,o.setReferenceManifestsSingleton)({page:r,clientReferenceManifest:N,serverActionsManifest:q,serverModuleMap:(0,d.createServerModuleMap)({serverActionsManifest:q})});let M=e.method||"GET",X=(0,l.getTracer)(),I=X.getActiveScopeSpan(),F={params:E,prerenderManifest:P,renderOpts:{experimental:{authInterrupts:!!R.experimental.authInterrupts},cacheComponents:!!R.cacheComponents,supportsDynamicResponse:k,incrementalCache:(0,i.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:R.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,r)=>$.onRequestError(e,t,r,U)},sharedContext:{buildId:_}},B=new c.NodeNextRequest(e),K=new c.NodeNextResponse(t),z=p.NextRequestAdapter.fromNodeNextRequest(B,(0,p.signalFromNodeResponse)(t));try{let s=async e=>$.handle(z,F).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=X.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==h.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=a.get("next.route");if(n){let t=`${M} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t)}else e.updateName(`${M} ${r}`)}),o=!!(0,i.getRequestMeta)(e,"minimalMode"),d=async i=>{var l,d;let u=async({previousCacheEntry:n})=>{try{if(!o&&b&&A&&!n)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let r=await s(i);e.fetchMetrics=F.renderOpts.fetchMetrics;let l=F.renderOpts.pendingWaitUntil;l&&a.waitUntil&&(a.waitUntil(l),l=void 0);let d=F.renderOpts.collectedTags;if(!T)return await (0,m.sendResponse)(B,K,r,F.renderOpts.pendingWaitUntil),null;{let e=await r.blob(),t=(0,w.toNodeOutgoingHttpHeaders)(r.headers);d&&(t[v.NEXT_CACHE_TAGS_HEADER]=d),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==F.renderOpts.collectedRevalidate&&!(F.renderOpts.collectedRevalidate>=v.INFINITE_CACHE)&&F.renderOpts.collectedRevalidate,n=void 0===F.renderOpts.collectedExpire||F.renderOpts.collectedExpire>=v.INFINITE_CACHE?void 0:F.renderOpts.collectedExpire;return{value:{kind:x.CachedRouteKind.APP_ROUTE,status:r.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:n}}}}catch(t){throw(null==n?void 0:n.isStale)&&await $.onRequestError(e,t,{routerKind:"App Router",routePath:r,routeType:"route",revalidateReason:(0,g.getRevalidateReason)({isStaticGeneration:H,isOnDemandRevalidate:b})},U),t}},c=await $.handleResponse({req:e,nextConfig:R,cacheKey:S,routeKind:n.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:P,isRoutePPREnabled:!1,isOnDemandRevalidate:b,revalidateOnlyGenerated:A,responseGenerator:u,waitUntil:a.waitUntil,isMinimalMode:o});if(!T)return null;if((null==c||null==(l=c.value)?void 0:l.kind)!==x.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==c||null==(d=c.value)?void 0:d.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});o||t.setHeader("x-nextjs-cache",b?"REVALIDATED":c.isMiss?"MISS":c.isStale?"STALE":"HIT"),D&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let p=(0,w.fromNodeOutgoingHttpHeaders)(c.value.headers);return o&&T||p.delete(v.NEXT_CACHE_TAGS_HEADER),!c.cacheControl||t.getHeader("Cache-Control")||p.get("Cache-Control")||p.set("Cache-Control",(0,y.getCacheControlHeader)(c.cacheControl)),await (0,m.sendResponse)(B,K,new Response(c.value.body,{headers:p,status:c.value.status||200})),null};I?await d(I):await X.withPropagatedContext(e.headers,()=>X.trace(h.BaseServerSpan.handleRequest,{spanName:`${M} ${r}`,kind:l.SpanKind.SERVER,attributes:{"http.method":M,"http.target":e.url}},d))}catch(t){if(t instanceof f.NoFallbackError||await $.onRequestError(e,t,{routerKind:"App Router",routePath:L,routeType:"route",revalidateReason:(0,g.getRevalidateReason)({isStaticGeneration:H,isOnDemandRevalidate:b})}),T)throw t;return await (0,m.sendResponse)(B,K,new Response(null,{status:500})),null}}e.s(["handler",()=>C,"patchFetch",()=>R,"routeModule",()=>$,"serverHooks",()=>U,"workAsyncStorage",()=>D,"workUnitAsyncStorage",()=>P]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__89b421bf._.js.map