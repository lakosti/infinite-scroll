import{a as c,S as u,i as d}from"./assets/vendor-848902b3.js";(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const i of t.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function o(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function s(e){if(e.ep)return;e.ep=!0;const t=o(e);fetch(e.href,t)}})();const f=document.querySelector(".js-search-form");document.querySelector(".search-btn");const p=document.querySelector(".js-gallery");f.addEventListener("submit",g);c.defaults.baseURL="https://api.unsplash.com";c.defaults.headers.common.Authorization="Client-ID LxvKVGJqiSe6NcEVZOaLXC-f2JIIWZaq_o0WrF8mwJc";function m(n,r=1,o){return c.get("/search/photos",{params:{page:r,query:n,orientation:"portrait",per_page:o}})}const h={lines:17,length:33,width:52,radius:14,scale:1,corners:1,speed:1.6,rotate:0,animation:"spinner-line-fade-quick",direction:1,color:"#7f9083",fadeColor:"transparent",top:"50%",left:"49%",shadow:"0 0 1px transparent",zIndex:2e9,className:"spinner",position:"absolute"},a=document.querySelector(".js-backdrop"),l=new u(h);async function g(n){n.preventDefault(),L();const r=n.currentTarget,o=r.elements["user-search-query"].value.trim();try{const{data:{results:s}}=await m(o);console.log(s),s.length||d.warning({title:"Caution",message:"Please enter something for search"}),p.innerHTML=y(s)}catch(s){console.log(s)}finally{r.reset(),q()}}function y(n){return n.map(({alt_description:r,urls:{small:o,full:s}})=>`   <li class="gallery-item" >
      <a class="gallery-img" href="${s}" target='blank'>
        <img src="${o}" alt="${r}" />
      </a>
    </li>`).join("")}function L(){l.spin(a),a.classList.remove("is-hidden")}function q(){l.stop(),a.classList.add("is-hidden")}
//# sourceMappingURL=commonHelpers.js.map
