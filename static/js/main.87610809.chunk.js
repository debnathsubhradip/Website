(this.webpackJsonpportfolio=this.webpackJsonpportfolio||[]).push([[0],[,,,,,,,,,,,,,,,,function(e,t,s){},,,,,,function(e,t,s){},function(e,t,s){},function(e,t,s){},function(e,t,s){},function(e,t,s){},function(e,t,s){},function(e,t,s){},function(e,t,s){},function(e,t,s){"use strict";s.r(t);var i=s(1),n=s.n(i),a=s(6),c=s.n(a),l=s(3),r=(s(16),s(43)),o=s(44),d=s(0);function j(e){var t=e.menuOpen,s=e.setMenuOpen;return Object(d.jsx)("div",{className:"topbar "+(t&&"active"),children:Object(d.jsxs)("div",{className:"wrapper",children:[Object(d.jsxs)("div",{className:"left",children:[Object(d.jsx)("a",{href:"#intro",className:"logo",children:"subhradip ."}),Object(d.jsxs)("div",{className:"itemContainer",children:[Object(d.jsx)(r.a,{className:"icon"}),Object(d.jsx)("span",{children:"+91 91230 68376"})]}),Object(d.jsxs)("div",{className:"itemContainer",children:[Object(d.jsx)(o.a,{className:"icon"}),Object(d.jsx)("span",{children:"debnath.subhradip@gmail.com"})]})]}),Object(d.jsx)("div",{className:"right",children:Object(d.jsxs)("div",{className:"hamburger",onClick:function(){return s(!t)},children:[Object(d.jsx)("span",{className:"line1"}),Object(d.jsx)("span",{className:"line2"}),Object(d.jsx)("span",{className:"line3"})]})})]})})}s(22);var b=s(8);function p(){var e=Object(i.useRef)();return Object(i.useEffect)((function(){Object(b.a)(e.current,{showCursor:!0,backDelay:1500,backSpeed:60,strings:["Developer","Engineer","Tutor"]})}),[]),Object(d.jsxs)("div",{className:"intro",id:"intro",children:[Object(d.jsx)("div",{className:"left",children:Object(d.jsx)("div",{className:"imgContainer",children:Object(d.jsx)("img",{src:"assets/me.png",alt:""})})}),Object(d.jsxs)("div",{className:"right",children:[Object(d.jsxs)("div",{className:"wrapper",children:[Object(d.jsx)("h2",{children:"Hi There, I'm"}),Object(d.jsx)("h1",{children:"Subhradip Debnath"}),Object(d.jsxs)("h3",{children:["Software ",Object(d.jsx)("span",{ref:e})]}),Object(d.jsx)("button",{onClick:function(){return window.open("https://drive.google.com/file/d/1RE4ha_sqqKKuONxh6y2AROws94WGoR97/view","_target")},children:"Curriculum Vitae"})]}),Object(d.jsx)("a",{href:"#portfolio",children:Object(d.jsx)("img",{src:"assets/down.png",alt:""})})]})]})}s(23);function m(e){var t=e.id,s=e.title,i=e.active,n=e.setSelected;return Object(d.jsx)("li",{className:i?"portfolioTab active":"portfolioTab",onClick:function(){return n(t)},children:s})}s(24);var h=[{id:1,title:"Singing",img:"assets/portfolio-labels/interests/singing.png"},{id:2,title:"Painting",img:"assets/portfolio-labels/interests/painting.png"},{id:3,title:"Watching Movies",img:"assets/portfolio-labels/interests/watching-movies.png"},{id:4,title:"Playing Games",img:"assets/portfolio-labels/interests/playing-games.png"}],g=[{id:1,title:"Technology Assistance in Learning English",img:"assets/portfolio-labels/research/research.jpg"},{id:2,title:"Next Generation Rainwater Harvesters and Smart Ground Water Replenishment ",img:"assets/portfolio-labels/research/research2.jpg"},{id:3,title:"Security and Privacy of IoT Devices in Healthcare Systems",img:"assets/portfolio-labels/research/research3.png"}],f=[{id:1,title:"Online Proctoring",img:"https://cdn.dribbble.com/users/6384483/screenshots/15468426/media/ce9479fa1f8dba3a4a49840d76e55e31.png?compress=1&resize=1200x900"},{id:2,title:"Online Resource Planning",img:"https://cdn.dribbble.com/users/387658/screenshots/15458608/media/e92ec1dd33dd1170ae3dc9c5272f2693.jpg?compress=1&resize=1200x900"},{id:3,title:"Sea Manifesto Web (SCMTR)",img:"assets/portfolio-labels/projects/sea_manifesto_web.png"},{id:4,title:"Sea Manifesto Java (SCMTR)",img:"assets/portfolio-labels/projects/sea_manifesto_web.png"}],u=[{id:1,title:"Deblines Pvt. Ltd.",img:"assets/portfolio-labels/internship/debgroup.png"},{id:2,title:"Haldia Dock Complex",img:"assets/portfolio-labels/internship/haldiadockcomplex.png"}],O=[{id:1,title:"Python",img:"assets/portfolio-labels/skills/python.png"},{id:2,title:"Javascript",img:"assets/portfolio-labels/skills/javascript.png"},{id:3,title:"NodeJS",img:"assets/portfolio-labels/skills/nodejs.png"},{id:4,title:"React",img:"assets/portfolio-labels/skills/react.png"},{id:5,title:"AWS",img:"assets/portfolio-labels/skills/aws.png"},{id:6,title:"HTML",img:"assets/portfolio-labels/skills/html.png"},{id:7,title:"Css",img:"assets/portfolio-labels/skills/css.png"},{id:5,title:"C",img:"assets/portfolio-labels/skills/c.png"},{id:5,title:"Java",img:"assets/portfolio-labels/skills/java.png"},{id:5,title:"Github",img:"assets/portfolio-labels/skills/github.png"}],x=[{id:1,title:"AWS Cloud Practioner Certification",img:"assets/portfolio-labels/certification/aws.png"},{id:2,title:"University of Michigan Python Specialization",img:"assets/portfolio-labels/certification/python.png"},{id:3,title:"AWS Cloud Practioner Essentials",img:"assets/portfolio-labels/certification/aws.png"},{id:4,title:"AWS Fundamentals Specialization",img:"assets/portfolio-labels/certification/aws.png"},{id:5,title:"Introduction to Cloud Computing",img:"assets/portfolio-labels/certification/ibmcloud.png"}];function v(){var e=Object(i.useState)("featured"),t=Object(l.a)(e,2),s=t[0],n=t[1],a=Object(i.useState)([]),c=Object(l.a)(a,2),r=c[0],o=c[1];return Object(i.useEffect)((function(){switch(s){case"interests":o(h);break;case"research":o(g);break;case"projects":o(f);break;case"internships":o(u);break;case"skills":o(O);break;case"certifications":o(x);break;default:o(h)}}),[s]),Object(d.jsxs)("div",{className:"portfolio",id:"portfolio",children:[Object(d.jsx)("h1",{children:"Portfolio"}),Object(d.jsx)("ul",{children:[{id:"interests",title:"Interests & Hobbies"},{id:"research",title:"Research Papers and Chapters"},{id:"projects",title:"Projects"},{id:"internships",title:"Internships"},{id:"skills",title:"Skills"},{id:"certifications",title:"Certifications"}].map((function(e){return Object(d.jsx)(m,{title:e.title,active:s===e.id,setSelected:n,id:e.id})}))}),Object(d.jsx)("div",{className:"container",children:r.map((function(e){return Object(d.jsxs)("div",{className:"item",children:[Object(d.jsx)("img",{src:e.img,alt:""}),Object(d.jsx)("h3",{children:e.title})]})}))})]})}s(25);function N(){var e=Object(i.useState)(0),t=Object(l.a)(e,2),s=t[0],n=t[1],a=[{id:"1",icon:"./assets/mobile.png",title:"Web Application Development",desc:"Sea Manifesto Web, Online Resource Planning, Online Proctoring ",img:"https://99designs-blog.imgix.net/blog/wp-content/uploads/2018/10/attachment_100040756-e1538485934255.jpeg?auto=format&q=60&fit=max&w=930"},{id:"2",icon:"./assets/globe.png",title:"Java Application",desc:"Sea Manifesto (Java)",img:"https://i.pinimg.com/originals/e9/c9/2f/e9c92f7869d682a6fa5a97fb8a298f30.jpg"}],c=function(e){n("left"===e?s>0?s-1:a.length-1:s<a.length-1?s+1:0)};return Object(d.jsxs)("div",{className:"works",id:"works",children:[Object(d.jsx)("div",{className:"slider",style:{transform:"translateX(-".concat(100*s,"vw)")},children:a.map((function(e){return Object(d.jsx)("div",{className:"container",children:Object(d.jsxs)("div",{className:"item",children:[Object(d.jsx)("div",{className:"left",children:Object(d.jsxs)("div",{className:"leftContainer",children:[Object(d.jsx)("div",{className:"imgContainer",children:Object(d.jsx)("img",{src:e.icon,alt:""})}),Object(d.jsx)("h2",{children:e.title}),Object(d.jsx)("p",{children:e.desc})]})}),Object(d.jsx)("div",{className:"right",children:Object(d.jsx)("img",{src:"https://99designs-blog.imgix.net/blog/wp-content/uploads/2018/10/attachment_100040756-e1538485934255.jpeg?auto=format&q=60&fit=max&w=930",alt:""})})]})})}))}),Object(d.jsx)("img",{src:"assets/arrow.png",className:"arrow left",alt:"",onClick:function(){return c("left")}}),Object(d.jsx)("img",{src:"assets/arrow.png",className:"arrow right",alt:"",onClick:function(){return c()}})]})}s(26);s(27);function k(){var e=Object(i.useState)(!1),t=Object(l.a)(e,2);t[0],t[1];return Object(d.jsxs)("div",{className:"contact",id:"contact",children:[Object(d.jsx)("div",{className:"left",children:Object(d.jsx)("img",{src:"assets/shake.svg",alt:""})}),Object(d.jsxs)("div",{className:"right",children:[Object(d.jsx)("h2",{children:"Contact."}),Object(d.jsx)("br",{}),Object(d.jsx)("button",{onClick:function(){return window.open("mailto:debnath.subhradip@gmail.com")},children:"Send Mail"})]})]})}s(28),s(29);function w(e){var t=e.menuOpen,s=e.setMenuOpen;return Object(d.jsx)("div",{className:"menu "+(t&&"active"),children:Object(d.jsxs)("ul",{children:[Object(d.jsx)("li",{onClick:function(){return s(!1)},children:Object(d.jsx)("a",{href:"#intro",children:"Home"})}),Object(d.jsx)("li",{onClick:function(){return s(!1)},children:Object(d.jsx)("a",{href:"#portfolio",children:"Portfolio"})}),Object(d.jsx)("li",{onClick:function(){return s(!1)},children:Object(d.jsx)("a",{href:"#works",children:"Works"})}),Object(d.jsx)("li",{onClick:function(){return s(!1)},children:Object(d.jsx)("a",{href:"#contact",children:"Contact"})})]})})}var C=function(){var e=Object(i.useState)(!1),t=Object(l.a)(e,2),s=t[0],n=t[1];return Object(d.jsxs)("div",{className:"app",children:[Object(d.jsx)(j,{menuOpen:s,setMenuOpen:n}),Object(d.jsx)(w,{menuOpen:s,setMenuOpen:n}),Object(d.jsxs)("div",{className:"sections",children:[Object(d.jsx)(p,{}),Object(d.jsx)(v,{}),Object(d.jsx)(N,{}),Object(d.jsx)(k,{})]})]})};c.a.render(Object(d.jsx)(n.a.StrictMode,{children:Object(d.jsx)(C,{})}),document.getElementById("root"))}],[[30,1,2]]]);
//# sourceMappingURL=main.87610809.chunk.js.map