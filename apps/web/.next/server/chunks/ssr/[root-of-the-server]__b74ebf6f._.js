module.exports=[53316,(a,b,c)=>{let{createClientModuleProxy:d}=a.r(62e3);a.n(d("[project]/node_modules/.pnpm/next@15.5.2_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/client/script.js <module evaluation>"))},84921,(a,b,c)=>{let{createClientModuleProxy:d}=a.r(62e3);a.n(d("[project]/node_modules/.pnpm/next@15.5.2_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/client/script.js"))},85435,a=>{"use strict";a.i(53316);var b=a.i(84921);a.n(b)},33754,(a,b,c)=>{b.exports=a.r(85435)},13148,a=>{"use strict";a.s(["default",()=>b]);let b=(0,a.i(62e3).registerClientReference)(function(){throw Error("Attempted to call the default export of [project]/apps/web/components/app/Analytics.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/apps/web/components/app/Analytics.tsx <module evaluation>","default")},39814,a=>{"use strict";a.s(["default",()=>b]);let b=(0,a.i(62e3).registerClientReference)(function(){throw Error("Attempted to call the default export of [project]/apps/web/components/app/Analytics.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/apps/web/components/app/Analytics.tsx","default")},75646,a=>{"use strict";a.i(13148);var b=a.i(39814);a.n(b)},85001,a=>{"use strict";a.s(["default",()=>b]);let b=(0,a.i(62e3).registerClientReference)(function(){throw Error("Attempted to call the default export of [project]/apps/web/components/app/CookieConsent.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/apps/web/components/app/CookieConsent.tsx <module evaluation>","default")},47461,a=>{"use strict";a.s(["default",()=>b]);let b=(0,a.i(62e3).registerClientReference)(function(){throw Error("Attempted to call the default export of [project]/apps/web/components/app/CookieConsent.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/apps/web/components/app/CookieConsent.tsx","default")},74504,a=>{"use strict";a.i(85001);var b=a.i(47461);a.n(b)},71256,a=>{a.v({className:"inter_804a8c60-module__WPrDma__className",variable:"inter_804a8c60-module__WPrDma__variable"})},9962,a=>{a.v({className:"inconsolata_3bba4b61-module__ftmnVW__className",variable:"inconsolata_3bba4b61-module__ftmnVW__variable"})},28992,a=>{"use strict";a.s(["default",()=>l,"metadata",()=>k],28992);var b=a.i(38470),c=a.i(33754),d=a.i(35399),e=a.i(75646),f=a.i(74504),g=a.i(71256);let h={className:g.default.className,style:{fontFamily:"'Inter', 'Inter Fallback'",fontStyle:"normal"}};null!=g.default.variable&&(h.variable=g.default.variable);var i=a.i(9962);let j={className:i.default.className,style:{fontFamily:"'Inconsolata', 'Inconsolata Fallback'",fontStyle:"normal"}};null!=i.default.variable&&(j.variable=i.default.variable);let k={metadataBase:new URL("https://www.procurdo.com"),title:{default:"Procurdo – Sök offentliga upphandlingar i Sverige",template:"%s | Procurdo"},description:"Sök offentliga upphandlingar i Sverige. Bevakning av aktuella upphandlingar, ramavtal och anbud – snabbt och gratis att komma igång.",openGraph:{type:"website",url:"https://www.procurdo.com/sv-se",siteName:"Procurdo",title:"Procurdo – Sök offentliga upphandlingar i Sverige",description:"Sök offentliga upphandlingar, bevaka upphandlingar och hitta ramavtal."},twitter:{card:"summary_large_image",site:"@procurdo",title:"Procurdo – Sök offentliga upphandlingar i Sverige",description:"Sök offentliga upphandlingar, bevaka upphandlingar och hitta ramavtal."},icons:{icon:"/favicon.ico"}};function l({children:a}){let g=process.env.NEXT_PUBLIC_GA_ID||"G-2KT03XRWKB";return(0,b.jsx)("html",{lang:"sv-SE",children:(0,b.jsxs)("body",{className:`${h.variable} ${j.variable} antialiased`,children:[(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(c.default,{id:"consent-default",strategy:"beforeInteractive",children:`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);} 
                gtag('consent', 'default', {
                  'ad_storage': 'denied',
                  'ad_user_data': 'denied',
                  'ad_personalization': 'denied',
                  'analytics_storage': 'denied',
                  'functionality_storage': 'denied',
                  'personalization_storage': 'denied',
                  'security_storage': 'granted',
                  'wait_for_update': 500
                });
              `}),(0,b.jsx)(c.default,{id:"gtag-init",strategy:"afterInteractive",children:`
                (function() {
                  var script = document.createElement('script');
                  script.async = true;
                  script.src = 'https://www.googletagmanager.com/gtag/js?id=${g}';
                  document.head.appendChild(script);
                  
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);} 
                  gtag('js', new Date());
                  gtag('config', '${g}', { send_page_view: false });
                })();
              `}),(0,b.jsx)(c.default,{id:"consent-restore",strategy:"afterInteractive",children:`
                (function(){
                  try {
                    var raw = localStorage.getItem('cookie-consent-v2');
                    if (raw) {
                      var state = JSON.parse(raw);
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);} 
                      gtag('consent', 'update', state);
                    }
                  } catch (e) {}
                })();
              `})]}),(0,b.jsx)(d.Suspense,{fallback:null,children:(0,b.jsx)(e.default,{})}),(0,b.jsx)(f.default,{}),a]})})}}];

//# sourceMappingURL=%5Broot-of-the-server%5D__b74ebf6f._.js.map