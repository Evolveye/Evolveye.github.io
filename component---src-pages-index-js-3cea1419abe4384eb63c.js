(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{"10Zl":function(e,t,a){e.exports={banner:"header-module--banner--1kChs",wrapper:"header-module--wrapper--2PxOX",photo:"header-module--photo--1vqT0",description:"header-module--description--1kWu4",title:"header-module--title--NPYyh",content:"header-module--content--tKujh"}},"2AaB":function(e,t,a){e.exports={projectsWrapper:"projects-module--projectsWrapper--3dSAh",project:"projects-module--project--1MbVm",description:"projects-module--description--1nMF-",projectIconWrapper:"projects-module--project-icon-wrapper--1A-x-",projectIcon:"projects-module--project-icon--1kcsI"}},EtsL:function(e,t,a){e.exports={wrapper:"smallProjects-module--wrapper--3hvE_",item:"smallProjects-module--item--SstPS"}},RXBc:function(e,t,a){"use strict";a.r(t);var o=a("q1tI"),n=a.n(o),r=a("Bl7J"),i=a("Wbzz"),l=a("9eSz"),c=a.n(l),s=a("10Zl"),m=a.n(s),p={en:n.a.createElement(n.a.Fragment,null,n.a.createElement("p",null,"I'm type of scientist, programmer experimenter.",n.a.createElement("br",null),"I like to play with code and know what, how, and why it works."),n.a.createElement("p",null,"If I need something related to software, I just do it.",n.a.createElement("br",null),"If is it a challenge or something new -- it only encourages me.")),pl:n.a.createElement(n.a.Fragment,null,n.a.createElement("p",null,"Jestem typem naukowca, programistą eksperymentatorem.",n.a.createElement("br",null),"Lubię bawić się kodem i wiedzieć co, jak, i dlaczego działa."),n.a.createElement("p",null,"Jeśli czegoś związnego z oprogramowaniem potrzebuję, to zwyczajnie to robię.",n.a.createElement("br",null),"Jeśli jest to wyzwanie, lub coś nowego -- tylko mnie to zachęca."))},d=function(e){var t=e.langKey,a=Object(i.useStaticQuery)("2714594879");return n.a.createElement("header",{className:m.a.banner},n.a.createElement("div",{className:m.a.wrapper},n.a.createElement(c.a,{className:"neumorphizm-white "+m.a.photo,fluid:a.photo.childImageSharp.fluid}),n.a.createElement("article",{className:m.a.description},n.a.createElement("h1",{className:"boxed-title is-green "+m.a.title},"Paweł Stolarski"),n.a.createElement("div",{className:m.a.content},p[t]))))},h=a("KQm4"),u=a("dI71"),w=a("EtsL"),g=a.n(w);function y(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}var f=function(e){function t(){for(var t,a=arguments.length,o=new Array(a),r=0;r<a;r++)o[r]=arguments[r];return(t=e.call.apply(e,[this].concat(o))||this).ref=n.a.createRef(),t.ctx=null,t.contentHeight=0,t.padding=0,t.state={objects:[]},t.animate=function(){var e=t.ref.current;if(e){var a=y(t),o=a.ctx,n=a.contentHeight,r=a.padding,i=e.width,l=e.height;o.clearRect(0,0,i,l),t.ctx.fillStyle="#000a";for(var c=1;c<=Math.floor(n/30);c++)o.fillRect(r,l-30*c,i-2*r,20);t.props.title&&o.fillRect(1.5*r,20,110,20),t.state.objects.forEach((function(e){var a=e.x,n=e.y,c=e.color;o.fillStyle=c;var s=l-n+10;o.beginPath(),o.rect(a-3,s-3,6,7),o.arc(a,s-4,3,0,2*Math.PI),o.arc(a,s+4,3,0,2*Math.PI),o.fill(),a>=i-(r+2)?t.configureObject(e):e.x+=2})),requestAnimationFrame(t.animate)}},t.render=function(){return n.a.createElement("canvas",{className:(t.props.className||"")+" loading_box",ref:t.ref})},t}Object(u.a)(t,e);var a=t.prototype;return a.configureObject=function(e,a){void 0===e&&(e={}),void 0===a&&(a=!1);var o=Math.floor,n=Math.random;return e.x=a?o(n()*(this.ref.current.width-40))+this.padding:this.padding+2,e.y=30*(o(n()*(this.contentHeight/30-1))+1),e.color=t.colors[o(n()*t.colors.length)],e},a.componentDidMount=function(){var e=this.props.title,t=this.ref.current,a=[];t.width=t.clientWidth,t.height=t.clientHeight,this.ctx=t.getContext("2d"),this.contentHeight=t.height-(e?50:20);for(var o=0;o<this.contentHeight/10;o++)a.push(this.configureObject({},!0));this.setState({objects:a}),requestAnimationFrame(this.animate)},t}(n.a.Component);f.colors=["#f8cf07","#43c243","#be3922"];var b=function(e){function t(){for(var t,a=arguments.length,o=new Array(a),r=0;r<a;r++)o[r]=arguments[r];return(t=e.call.apply(e,[this].concat(o))||this).state={projects:[]},t.render=function(){for(var e=t.props.langKey,a=t.state.projects,o=a.length<3?3:a.length,r={},i=[],l="neumorphizm "+g.a.item,c=1;c<=o;c++)if(a.length<c)i.push(n.a.createElement(f,{key:c,className:l,title:!0}));else{var s=a[c-1],m=s.title,p=s.description;"@default"in r||(r["@default"]=[]),r["@default"].push(n.a.createElement("article",{className:l+" is-hoverable",key:m[e]},n.a.createElement("h3",null,m[e]),n.a.createElement("p",null,p[e])))}return console.log(),n.a.createElement("section",null,n.a.createElement("h2",{className:"h2 boxed-title is-blue"},"pl"===t.props.langKey?"Małe i proste różności":"Small and trivial miscellaneous"),n.a.createElement("div",{className:g.a.wrapper},[].concat(i,Object(h.a)(r["@default"]||[]))))},t}return Object(u.a)(t,e),t.prototype.componentDidMount=function(){var e=this;a.e(11).then(a.bind(null,"ODXS")).then((function(t){e.setState((function(e){return{projects:[].concat(Object(h.a)(e.projects),[t])}}))}))},t}(n.a.Component),z=a("2AaB"),k=a.n(z),j=[{title:{pl:"Cactu",en:"Cactu"},fluidName:"cactu",description:{pl:n.a.createElement(n.a.Fragment,null,"Rzeczy które tworzę lubię naznaczać konkretnym logiem -- ",n.a.createElement("a",{href:"https://codecactu.github.io/"},"marką Cactu"),". Być moze kiedyś ktoś będzie chciał tworzyć razem ze mną pod wspólnym znakiem, więc sygnowanie projektów znakiem towarowym połączonym niejako z mym nazwiskiem uważam za stosowne. Dodatkowo logo zostało przygotowane tak, aby było łatwe do odwzorowania za pomocą grafiki wektorowej (bowiem zostało za pomocą niej przygotowane). Sprawia to, że naznaczanie nim tworów (przykłądowo porpzez wstawienie do stopki) jest proste, w przeciwieństwie do mojego, niewektorowego, avatara."),en:n.a.createElement(n.a.Fragment,null,"I like to mark a things I create with specific logo -- ",n.a.createElement("a",{href:"https://codecactu.github.io/"},"the Cactu brand"),". Perhaps someday somebody will want to make something with me under common sign, so I consider it appropriate to sign the projects with a trademark connected with my name. In addition, the logo has been prepared so that it is easy to reproduce with vector graphics (it was made in that graphic). It makes marking creations with it (for example, by inserting into footer) very easy, unlike to my non-vector eye-like avatar.")}},{title:{pl:"Discordowy bot",en:"Discord bot"},fluidName:"discordBot",description:{pl:n.a.createElement(n.a.Fragment,null,"Zaczęło się od założenia małej społeczności. Z czasem zainteresowałem się API dostarczanym przez platformę Discord. Tak powstał framework na bazie biblioteki ",n.a.createElement("a",{href:"https://discord.js.org/#/"},"discord.js"),". Obecnie z pomocą tego bota automatyzuję wszystko co potrzebuję. Czy to mało ambitne odpowiedzi tekstem na tekst, czy to edycja grafiki lub odpytywanie zewnętrznych API."),en:n.a.createElement(n.a.Fragment,null,"All have been started from starting small community. Over time I became interested in the API provided by Discord platform. This is how the ",n.a.createElement("a",{href:"https://discord.js.org/#/"},"discord.js")," based framework was created. Currently with the help of that bot I automate everything I need. From unambitious text-to-text responses, thought graphic editing, to querying external APIs.")}},{title:{pl:"Silnik grafiki trójwymiarowej",en:"3D graphgic engine"},fluidName:"webGl",description:{pl:n.a.createElement(n.a.Fragment,null,"Nie lubię korzystać z bibliotek czy frameworków jeśli nie wiem co kryje się w ich wnętrzu. Co sprawia, że dzieje się to co się dzieje. Jako, że chciałem nauczyć się biblioteki ",n.a.createElement("a",{href:"https://threejs.org/"},"Three.js")," przeznaczonej do rysowania rzeczy trójwymairowych, to nie dawał mi spokoju brak umiejętnosci samodzielnego rysowania w 3D. Postanowiłem więc w ramach rozgrzewki zrobić swój prymitywny silnik do wyświetlania kształtów 3D. Podobnie mam z innymi technologiami -- jeśli nie wiem jak działa, to mam wewnętrzną potrzebę się dowiedzieć."),en:n.a.createElement(n.a.Fragment,null,"I don't like to use libraries or framework if I don't know what is inside. What makes what is happening. As i wanted to learn ",n.a.createElement("a",{href:"https://threejs.org/"},"Three.js")," library for drawing three-dimensional things, the lack of the ability to draw in 3D by myself bothered me. So, I decided to make my own primitive 3D engine as part of my warm-up. The same to others technologies -- if I don't know how it works, I have inner need to find out.")}},{title:{pl:"Ta strona",en:"This website"},fluidName:"avatar",description:{pl:n.a.createElement(n.a.Fragment,null,"Programuję w zasadzie codziennie. Pomysłów mam wiele, chęci nauki jeszcze wiecej. Wiele małych dzieł przepadło z tej racji że nie miałem kiedys konta github, lub nie widziałem sensu we wrzucaniu nań projektów. W końcu do tego, że postanowiłem zrobić sobie stronę z której byłbym zadowolony, a na której mógłbym prowadzić swojego devloga."),en:n.a.createElement(n.a.Fragment,null,"I program basically everyday. I have many ideas, the willingness to learn even more. Many small works have been lost because I didn't have Github account, or saw no point to upload projects to it. Finally, I decided to make a website that I would be happy about, and where I could run my devlog (polish only, sorry; but maybe in the future...).")}}],E=function(e){var t=e.langKey,a=Object(i.useStaticQuery)("2416306509");return n.a.createElement("section",null,n.a.createElement("h2",{className:"h2 boxed-title is-red"},"pl"===t?"Projekty coś o mnie mówiące":"Project that say something about me"),n.a.createElement("div",{className:k.a.projectsWrapper},j.map((function(e){var o=e.title,r=e.fluidName,i=e.description;return n.a.createElement("article",{key:o[t],className:k.a.project},n.a.createElement("div",{className:"neumorphizm-white "+k.a.projectIconWrapper},n.a.createElement(c.a,{className:k.a.projectIcon,fluid:a[r].childImageSharp.fluid})),n.a.createElement("div",{className:k.a.description},n.a.createElement("h3",null,o[t]),n.a.createElement("p",null,i[t])))}))))},v=a("zLVn"),I=a("Aw06"),N=a("rgsX"),x=a("TVnl"),P=a.n(x),S={title:{pl:"Moje ostatnie wpisy",en:"My recent entries"}},A=function(e){var t=e.langKey,a=Object(i.useStaticQuery)("1498352166").allMdx.nodes,o=a.length?a.map((function(e){var a=e.id,o=e.excerpt,r=e.frontmatter,i=(r.tags,r.sneakPeek),l=Object(v.a)(r,["tags","sneakPeek"]),c=e.fields;return n.a.createElement(N.a,{key:a,langKey:t,className:P.a.entry,titleLinkAddress:"/post"+c.slug,frontmatter:l,body:i||o})})):n.a.createElement("p",{className:P.a.info},"pl"===t?"Postów jak na razie brak ;/":"Currently, no posts here ;/");return n.a.createElement("section",{className:P.a.blogposts},n.a.createElement("h2",{className:"boxed-title is-green "+P.a.sectionTitle},S.title[t]),"pl"===t?o:n.a.createElement("p",{className:P.a.info},"Oops. This content is exclusive for polish readers. If you wanna be one of them, just click ",n.a.createElement(I.a,{langKey:"pl",to:"/"}," that link"),"."))};t.default=function(e){var t=e.pageContext,a=(t=void 0===t?{}:t).langKey,o=void 0===a?"en":a;return n.a.createElement(r.a,{title:"pl"===o?"Strona domowa":"Homepage",langKey:o},n.a.createElement(d,{langKey:o}),n.a.createElement(b,{langKey:o}),n.a.createElement(E,{langKey:o}),n.a.createElement(A,{langKey:o}))}},TVnl:function(e,t,a){e.exports={info:"lastBlogposts-module--info--3M60P"}}}]);
//# sourceMappingURL=component---src-pages-index-js-3cea1419abe4384eb63c.js.map