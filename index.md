本文介绍可以用来构建能够让__多个团队__ 独立交付项目代码的__现代web app__ 技术，策略以及实践方法

Techniques, strategies and recipes for building a __modern web app__ with __multiple teams__ that can __ship features independently__.

## What are Micro Frontends? 什么是微前端

The term __Micro Frontends__ first came up in [ThoughtWorks Technology Radar](https://www.thoughtworks.com/radar/techniques/micro-frontends) at the end of 2016. It extends the concepts of micro services to the frontend world. The current trend is to build a feature-rich and powerful browser application, aka single page app, which sits on top of a micro service architecture. Over time the frontend layer, often developed by a separate team, grows and gets more difficult to maintain. That's what we call a [Frontend Monolith](https://www.youtube.com/watch?v=pU1gXA0rfwc).

__微前端__这个名词，第一次被提出还是在2016年底，那是这个名词首次出现在 [ThoughtWorks Technology Radar](https://www.thoughtworks.com/radar/techniques/micro-frontends)。这个概念将微服务这个被广泛应用于服务端技术范式扩展到前端领域。想一想，现代的前端应用，是否变得越来越富功能化，富交互化，而在业界，这样的前端形态被称为SPA 也就是单页面应用；这样越来越复杂的前端应用，其所立足的后端服务，则是建立在分治思想应用的非常成熟的微服务架构的基础上。于是在这样一种现状之下，前端应用反而通常都是有一个完整的团队来进行维护，随着时间更迭，前端应用就会变得越来越庞大，越来越难以维护。所以我们会称这种应用为[巨石单体应用](https://www.youtube.com/watch?v=pU1gXA0rfwc)。

The idea behind Micro Frontends is to think about a website or web app as __a composition of features__ which are owned by __independent teams__. Each team has a __distinct area of business__ or __mission__ it cares about and specialises in. A team is __cross functional__ and develops its features __end-to-end__, from database to user interface.

至于存在于微前端这个概念背后的思想，则是立足于这样一个前提：现代复杂的web app或者网站，通常由很多__相对独立的功能组合构成__，而在这些相对独立的功能组合背后，更是__相互独立的多个团队__进行应用的维护。而这些独立的团队，也都根据其团队自身的定位，负责__特定的业务逻辑实现__，以及完成__特定的开发任务__，这些特性也是由于各个团队的专业性定位所决定的。这样的团队，通常在人员组成方面囊括了从前端开发到服务端开发，从UI实现到数据库设计这样__端到端__的__大跨度的跨职能__构成。

However, this idea is not new. It has a lot in common with the [Self-contained Systems](http://scs-architecture.org/) concept. In the past approaches like this went by the name of [Frontend Integration for Verticalised Systems](https://dev.otto.de/2014/07/29/scaling-with-microservices-and-vertical-decomposition/). But Micro Frontends is clearly a more friendly and less bulky term.

即便说微前端这个概念听上去很新，但实际上它仍然与所谓的 [自包含系统](http://scs-architecture.org/) 概念一脉相承。在过去，面临同样场景的解决方案，会被称为 [面向垂直划分系统的前端集成](https://dev.otto.de/2014/07/29/scaling-with-microservices-and-vertical-decomposition/)。但很显然，微前端这个概念，对于前端开发人员来说更加易于理解，况且这个名词里也没有那么多不容易理解的大词。

__Monolithic Frontends__ __单体巨石前端应用__
![Monolithic Frontends](./ressources/diagrams/organisational/monolith-frontback-microservices.png)

__Organisation in Verticals__ __面向垂直划分系统的前端架构__
![End-To-End Teams with Micro Frontends](./ressources/diagrams/organisational/verticals-headline.png)

## What's a Modern Web App? 到底什么才是现代的Web App？

In the introduction I've used the phrase "building a modern web app". Let's define the assumptions that are connected with this term.

在最前面的介绍部分，我曾经使用过构建 “现代web app” 这个名词。接下来让我们一起来来讨论一下，究竟什么样的边界才能够定义这个概念。

To put this into a broader perspective, [Aral Balkan](https://ar.al/) has written a blog post about what he calls the [Documents‐to‐Applications Continuum](https://ar.al/notes/the-documents-to-applications-continuum/). He comes up with the concept of a sliding scale where a site, built out of __static documents__, connected via links, is __on the left__ end and a pure behaviour driven, __contentless application__ like an online photo editor is __on the right__.

如果我们从更加宽泛的角度来看待这个“现代”的定义，那么可以借鉴[Aral Balkan](https://ar.al/) 曾经在一篇blog中提及关于 [联机文档与网络应用的边界](https://ar.al/notes/the-documents-to-applications-continuum/) 的看法。他说到如果在联机文档与网络应用之间有一个清晰的边界的话，那么通过超链接的形式组成的一堆__静态文档__就应该属于__边界的左边__，也即联机文档这一侧；而另外一端，则应该属于通过行为驱动的与内容无关的UI应用，比如在线相册(它提供的是一个功能，内容只是功能所提供的的价值)。

If you would position your project on the __left side of this spectrum__, an __integration on webserver level__ is a good fit. With this model a server collects and __concatenates HTML strings__ from all components that make up the page requested by the user. Updates are done by reloading the page from the server or replacing parts of it via ajax. [Gustaf Nilsson Kotte](https://twitter.com/gustaf_nk/) has written a [comprehensive article](https://gustafnk.github.io/microservice-websites/) on this topic.

如果你认为你的项目在__这个序列中__应该位列左侧，那么一个简单的web服务器的集成就已经足够了。在这种网络架构上来说，一个web服务器把__散落于组件中的HTML标签__集成起来，之后把集成好的HTML文档传输给请求的用户即可。页面的更新无非是通过刷新浏览器，或者通过ajax请求更新页面中部分的静态内容而已。关于这个话题， [Gustaf Nilsson Kotte](https://twitter.com/gustaf_nk/) 也曾经专门写过一篇文章 [comprehensive article](https://gustafnk.github.io/microservice-websites/) 。

When your user interface has to provide __instant feedback__, even on unreliable connections, a pure server rendered site is not sufficient anymore. To implement techniques like [Optimistic UI](https://www.smashingmagazine.com/2016/11/true-lies-of-optimistic-user-interfaces/) or [Skeleton Screens](http://www.lukew.com/ff/entry.asp?1797) you need to be able to also __update__ your UI __on the device itself__. Google's term [Progressive Web Apps](https://developers.google.com/web/progressive-web-apps/) aptly describes the __balancing act__ of being a good citizen of the web (progressive enhancement) while also providing app-like performance. This kind of application is located somewhere __around the middle of the site-app-continuum__. Here a solely server based solution is not sufficient anymore. We have to move the __integration into the browser__, and this is the focus of this article.

但是当你的应用需要根据交互或者数据的变化发生即时的UI更新，甚至是在不怎么好的网络环境之下，那么一个纯粹的服务端渲染的架构就显然力不从心了。为了追求更加优秀的用户体验，如果要实现类似于__积极的UI__或者__骨架屏__之类的技术，甚至需要在终端设备自身(不依赖服务端)进行UI的__更新操作__。比如Google发明的名词 [Progressive Web Apps](https://developers.google.com/web/progressive-web-apps/) （PWA）就更倾向于将这种看上去 __平衡的哲学__ 描述为：具备良好的web 公民素质(符合W3C标准，也具备激进的用户体验增强)的同时，仍需要类提供原生APP的性能表现。像这样的web app 就比较适合放在上边所说的__那个图谱的中间部分__。前端应用发展至今，单个web服务器的架构已经不足以满足业务的需求，所以我们必须向更深远的方向考虑，一个web应用应该如何更加深入的与浏览器进行结合，而这，就是这篇文章关注的焦点。

## Core Ideas behind Micro Frontends 微前端架构背后的核心思维

* __Be Technology Agnostic__ __技术不可知主义__<br>Each team should be able to choose and upgrade their stack without having to coordinate with other teams. [Custom Elements](#the-dom-is-the-api) are a great way to hide implementation details while providing a neutral interface to others.

  每个团队应该选择自己的技术栈以及技术进化路线，而不是与其他团队步调一致。[Custom Elements](#the-dom-is-the-api)：对于向外界提供中立的编程边界的同时隐藏内部实现的细节这个方法论来说，Custom Element 就是一个非常不错的解决方案。也许在微前端的语境之下，框架将不是未来架构师主要考虑的问题，提供原生的WebComponent 就成了未来前端代码架构的核心。

* __Isolate Team Code__ __隔离团队之间的代码__<br>Don’t share a runtime, even if all teams use the same framework. Build independent apps that are self contained. Don't rely on shared state or global variables.

  即便所有团队都使用同样的框架，也不要共享一个运行时环境。构建自包含的Apps。不要依赖共享的状态或者全局变量。

* __Establish Team Prefixes __ __简历团队自己的前缀__<br>Agree on naming conventions where isolation is not possible yet. Namespace CSS, Events, Local Storage and Cookies to avoid collisions and clarify ownership.

  如果微前端的大环境还不允许环境隔离，那么各个团队要能够在所有层面指定自己的命名空间。具有命名空间的CSS， 事件，Local Storage 以及 Cookies，通过命名空间进行的隔离可以避免冲突，以及更加明确的职责。

* __Favor Native Browser Features over Custom APIs__ __原生浏览器标准由于框架封装的API__<br>Use [Browser Events for communication](#parent-child-communication--dom-modification) instead of building a global PubSub system. If you really have to build a cross team API, try keeping it as simple as possible.

  如果需要团队模块之间的通信机制，我建议你们使用 [用于通信的原生浏览器事件机制](#parent-child-communication--dom-modification) ，而不是自己构建一个PubSub系统。如果确实需要设计一个跨团队的通信API，那么也尽量让设计简单为好。

* __Build a Resilient Site__ __构建适应度高的网络应用__<br>Your feature should be useful, even if JavaScript failed or hasn't executed yet. Use [Universal Rendering](#serverside-rendering--universal-rendering) and Progressive Enhancement to improve perceived performance.

  所有开发的功能应该能够被使用，即便Javascript 执行失败的情况下。使用 [通用渲染](#serverside-rendering--universal-rendering) 策略以及渐进增强的设计来改进可感知的体验和性能。

---

## The DOM is the API DOM 就是 API

[Custom Elements](https://developers.google.com/web/fundamentals/getting-started/primers/customelements), the interoperability aspect from the Web Components Spec, are a good primitive for integration in the browser. Each team builds their component __using their web technology of choice__ and __wraps it inside a Custom Element__ (e.g. `<order-minicart></order-minicart>`). The DOM specification of this particular element (tag-name, attributes & events) acts as the contract or public API for other teams. The advantage is that they can use the component and its functionality without having to know the implementation. They just have to be able to interact with the DOM.

[Custom Elements](https://developers.google.com/web/fundamentals/getting-started/primers/customelements) 所代表的来自于Web Component的可操作性，也是发端于可以直接集成到浏览器的强大原生能力。每一个独立的团队可以通过他们__自行选择的web 技术__ 把功能__封装到Custom Element组件中去__(e.g. `<order-minicart></order-minicart>`)。 而由于这些封装之后的原生组件所具有的原生DOM属性(tag-name, attributes & events)，就可以成为事实上的对外公开API协议。这种实现方式的优势在于，其他团队完全不需要了解组件构建团队所使用的技术栈或者具体的技术实现，只需要明白组件的通信接口，就可以与使用这个UI组件。而花去的精力不过是了解这个组件在DOM层留给使用者的API。

But Custom Elements alone are not the solution to all our needs. To address progressive enhancement, universal rendering or routing we need additional pieces of software.

但是只是组件级别的Custom Element并不能解决我们所有的问题。为了能够实现渐进增强，通用渲染机制和路由机制则是整个拼图剩下的部分。

This page is divided into two main areas. First we will discuss [Page Composition](#page-composition) - how to assemble a page out of components owned by different teams. After that we'll show examples for implementing clientside [Page Transition](#page-transition).

以下段落我们会分为两大部分。首先我们要讨论[页面构成](#page-composition) - 如何把各个团队开发的组件组装到一起，最终能够形成一个完整的页面。 在那之后我们就开战第二个话题，如果进行[页面间转换](#page-transition)。

## Page Composition

Beside the __client-__ and __serverside__ integration of code written in __different frameworks__ itself, there are a lot of side topics that should be discussed: mechanisms to __isolate js__, __avoid css conflicts__, __load resources__ as needed, __share common resources__ between teams, handle __data fetching__ and think about good __loading states__ for the user. We'll go into these topics one step at a time.

### The Base Prototype

The product page of this model tractor store will serve as the basis for the following examples.

It features a __variant selector__ to switch between the three different tractor models. On change product image, name, price and recommendations are updated. There is also a __buy button__, which adds the selected variant to the basket and a __mini basket__ at the top that updates accordingly.

[![Example 0 - Product Page - Plain JS](./ressources/video/model-store-0.gif)](./0-model-store/)

[try in browser](./0-model-store/) & [inspect the code](https://github.com/neuland/micro-frontends/tree/master/0-model-store)

All HTML is generated client side using __plain JavaScript__ and ES6 Template Strings with __no dependencies__. The code uses a simple state/markup separation and re-renders the entire HTML client side on every change - no fancy DOM diffing and __no universal rendering__ for now. Also __no team separation__ - [the code](https://github.com/neuland/micro-frontends/tree/master/0-model-store) is written in one js/css file.

### Clientside Integration

In this example, the page is split into separate components/fragments owned by three teams. __Team Checkout__ (blue) is now responsible for everything regarding the purchasing process - namely the __buy button__ and __mini basket__. __Team Inspire__ (green) manages the __product recommendations__ on this page. The page itself is owned by __Team Product__ (red).

[![Example 1 - Product Page - Composition](./ressources/screen/three-teams.png)](./1-composition-client-only/)

[try in browser](./1-composition-client-only/) & [inspect the code](https://github.com/neuland/micro-frontends/tree/master/1-composition-client-only)

__Team Product__ decides which functionality is included and where it is positioned in the layout. The page contains information that can be provided by Team Product itself, like the product name, image and the available variants. But it also includes fragments (Custom Elements) from the other teams.

### How to Create a Custom Element?

Lets take the __buy button__ as an example. Team Product includes the button simply adding `<blue-buy sku="t_porsche"></blue-buy>` to the desired position in the markup. For this to work, Team Checkout has to register the element `blue-buy` on the page.

    class BlueBuy extends HTMLElement {
      connectedCallback() {
        this.innerHTML = `<button type="button">buy for 66,00 €</button>`;
      }
    
      disconnectedCallback() { ... }
    }
    window.customElements.define('blue-buy', BlueBuy);

Now every time the browser comes across a new `blue-buy` tag, the `connectedCallback` is called. `this` is the reference to the root DOM node of the custom element. All properties and methods of a standard DOM element like `innerHTML` or `getAttribute()` can be used.

![Custom Element in Action](./ressources/video/custom-element.gif)

When naming your element the only requirement the spec defines is that the name must __include a dash (-)__ to maintain compatibility with upcoming new HTML tags. In the upcoming examples the naming convention `[team_color]-[feature]` is used. The team namespace guards against collisions and this way the ownership of a feature becomes obvious, simply by looking at the DOM.

### Parent-Child Communication / DOM Modification

When the user selects another tractor in the __variant selector__, the __buy button has to be updated__ accordingly. To achieve this Team Product can simply __remove__ the existing element from the DOM __and insert__ a new one.

    container.innerHTML;
    // => <blue-buy sku="t_porsche">...</blue-buy>
    container.innerHTML = '<blue-buy sku="t_fendt"></blue-buy>';

The `disconnectedCallback` of the old element gets invoked synchronously to provide the element with the chance to clean up things like event listeners. After that the `connectedCallback` of the newly created `t_fendt` element is called.

Another more performant option is to just update the `sku` attribute on the existing element.

    document.querySelector('blue-buy').setAttribute('sku', 't_fendt');

If Team Product used a templating engine that features DOM diffing, like React, this would be done by the algorithm automatically.

![Custom Element Attribute Change](./ressources/video/custom-element-attribute.gif)

To support this the Custom Element can implement the `attributeChangedCallback` and specify a list of `observedAttributes` for which this callback should be triggered.

    const prices = {
      t_porsche: '66,00 €',
      t_fendt: '54,00 €',
      t_eicher: '58,00 €',
    };
    
    class BlueBuy extends HTMLElement {
      static get observedAttributes() {
        return ['sku'];
      }
      connectedCallback() {
        this.render();
      }
      render() {
        const sku = this.getAttribute('sku');
        const price = prices[sku];
        this.innerHTML = `<button type="button">buy for ${price}</button>`;
      }
      attributeChangedCallback(attr, oldValue, newValue) {
        this.render();
      }
      disconnectedCallback() {...}
    }
    window.customElements.define('blue-buy', BlueBuy);

To avoid duplication a `render()` method is introduced which is called from `connectedCallback` and `attributeChangedCallback`. This method collects needed data and innerHTML's the new markup. When deciding to go with a more sophisticated templating engine or framework inside the Custom Element, this is the place where its initialisation code would go.

### Browser Support

The above example uses the Custom Element V1 Spec which is currently [supported in Chrome, Safari and Opera](http://caniuse.com/#feat=custom-elementsv1). But with [document-register-element](https://github.com/WebReflection/document-register-element) a lightweight and battle-tested polyfill is available to make this work in all browsers. Under the hood, it uses the [widely supported](http://caniuse.com/#feat=mutationobserver) Mutation Observer API, so there is no hacky DOM tree watching going on in the background.

### Framework Compatibility

Because Custom Elements are a web standard, all major JavaScript frameworks like Angular, React, Preact, Vue or Hyperapp support them. But when you get into the details, there are still a few implementation problems in some frameworks. At [Custom Elements Everywhere](https://custom-elements-everywhere.com/) [Rob Dodson](https://twitter.com/rob_dodson) has put together a compatibility test suite that highlights unresolved issues.

### Child-Parent or Siblings Communication / DOM Events

But passing down attributes is not sufficient for all interactions. In our example the __mini basket should refresh__ when the user performs a __click on the buy button__.

Both fragments are owned by Team Checkout (blue), so they could build some kind of internal JavaScript API that lets the mini basket know when the button was pressed. But this would require the component instances to know each other and would also be an isolation violation.

A cleaner way is to use a PubSub mechanism, where a component can publish a message and other components can subscribe to specific topics. Luckily browsers have this feature built-in. This is exactly how browser events like `click`, `select` or `mouseover` work. In addition to native events there is also the possibility to create higher level events with `new CustomEvent(...)`. Events are always tied to the DOM node they were created/dispatched on. Most native events also feature bubbling. This makes it possible to listen for all events on a specific sub-tree of the DOM. If you want to listen to all events on the page, attach the event listener to the window element. Here is how the creation of the `blue:basket:changed`-event looks in the example:

    class BlueBuy extends HTMLElement {
      [...]
      connectedCallback() {
        [...]
        this.render();
        this.firstChild.addEventListener('click', this.addToCart);
      }
      addToCart() {
        // maybe talk to an api
        this.dispatchEvent(new CustomEvent('blue:basket:changed', {
          bubbles: true,
        }));
      }
      render() {
        this.innerHTML = `<button type="button">buy</button>`;
      }
      disconnectedCallback() {
        this.firstChild.removeEventListener('click', this.addToCart);
      }
    }

The mini basket can now subscribe to this event on `window` and get notified when it should refresh its data.

    class BlueBasket extends HTMLElement {
      connectedCallback() {
        [...]
        window.addEventListener('blue:basket:changed', this.refresh);
      }
      refresh() {
        // fetch new data and render it
      }
      disconnectedCallback() {
        window.removeEventListener('blue:basket:changed', this.refresh);
      }
    }

With this approach the mini basket fragment adds a listener to a DOM element which is outside its scope (`window`). This should be ok for many applications, but if you are uncomfortable with this you could also implement an approach where the page itself (Team Product) listens to the event and notifies the mini basket by calling `refresh()` on the DOM element.

    // page.js
    const $ = document.getElementsByTagName;
    
    $('blue-buy')[0].addEventListener('blue:basket:changed', function() {
      $('blue-basket')[0].refresh();
    });

Imperatively calling DOM methods is quite uncommon, but can be found in [video element api](https://developer.mozilla.org/de/docs/Web/HTML/Using_HTML5_audio_and_video#Controlling_media_playback) for example. If possible the use of the declarative approach (attribute change) should be preferred.

## Serverside Rendering / Universal Rendering

Custom Elements are great for integrating components inside the browser. But when building a site that is accessible on the web, chances are that initial load performance matters and users will see a white screen until all js frameworks are downloaded and executed. Additionally, it's good to think about what happens to the site if the JavaScript fails or is blocked. [Jeremy Keith](https://adactio.com/) explains the importance in his ebook/podcast [Resilient Web Design](https://resilientwebdesign.com/). Therefore the ability to render the core content on the server is key. Sadly the web component spec does not talk about server rendering at all. No JavaScript, no Custom Elements :(

### Custom Elements + Server Side Includes = ❤️

To make server rendering work, the previous example is refactored. Each team has their own express server and the `render()` method of the Custom Element is also accessible via url.

    $ curl http://127.0.0.1:3000/blue-buy?sku=t_porsche
    <button type="button">buy for 66,00 €</button>

The Custom Element tag name is used as the path name - attributes become query parameters. Now there is a way to server-render the content of every component. In combination with the `<blue-buy>`-Custom Elements something that is quite close to a __Universal Web Component__ is achieved:

    <blue-buy sku="t_porsche">
      <!--#include virtual="/blue-buy?sku=t_porsche" -->
    </blue-buy>

The `#include` comment is part of [Server Side Includes](https://en.wikipedia.org/wiki/Server_Side_Includes), which is a feature that is available in most web servers. Yes, it's the same technique used back in the days to embed the current date on our web sites. There are also a few alternative techniques like [ESI](https://en.wikipedia.org/wiki/Edge_Side_Includes), [nodesi](https://github.com/Schibsted-Tech-Polska/nodesi), [compoxure](https://github.com/tes/compoxure) and [tailor](https://github.com/zalando/tailor), but for our projects SSI has proven itself as a simple and incredibly stable solution.

The `#include` comment is replaced with the response of `/blue-buy?sku=t_porsche` before the web server sends the complete page to the browser. The configuration in nginx looks like this:

    upstream team_blue {
      server team_blue:3001;
    }
    upstream team_green {
      server team_green:3002;
    }
    upstream team_red {
      server team_red:3003;
    }
    
    server {
      listen 3000;
      ssi on;
    
      location /blue {
        proxy_pass  http://team_blue;
      }
      location /green {
        proxy_pass  http://team_green;
      }
      location /red {
        proxy_pass  http://team_red;
      }
      location / {
        proxy_pass  http://team_red;
      }
    }

The directive `ssi: on;` enables the SSI feature and an `upstream` and `location` block is added for every team to ensure that all urls which start with `/blue` will be routed to the correct application (`team_blue:3001`). In addition the `/` route is mapped to team red, which is controlling the homepage / product page.

This animation shows the tractor store in a browser which has __JavaScript disabled__.

[![Serverside Rendering - Disabled JavaScript](./ressources/video/server-render.gif)](./ressources/video/server-render.mp4)

[inspect the code](https://github.com/neuland/micro-frontends/tree/master/2-composition-universal)

The variant selection buttons now are actual links and every click leads to a reload of the page. The terminal on the right illustrates the process of how a request for a page is routed to team red, which controls the product page and after that the markup is supplemented by the fragments from team blue and green.

When switching JavaScript back on, only the server log messages for the first request will be visible. All subsequent tractor changes are handled client side, just like in the first example. In a later example the product data will be extracted from the JavaScript and loaded via a REST api as needed.

You can play with this sample code on your local machine. Only [Docker Compose](https://docs.docker.com/compose/install/) needs to be installed.

    git clone https://github.com/neuland/micro-frontends.git
    cd micro-frontends/2-composition-universal
    docker-compose up --build

Docker then starts the nginx on port 3000 and builds the node.js image for each team. When you open [http://127.0.0.1:3000/](http://127.0.0.1:3000/) in your browser you should see a red tractor. The combined log of `docker-compose` makes it easy to see what is going on in the network. Sadly there is no way to control the output color, so you have to endure the fact that team blue might be highlighted in green :)

The `src` files are mapped into the individual containers and the node application will restart when you make a code change. Changing the `nginx.conf` requires a restart of `docker-compose` in order to have an effect. So feel free to fiddle around and give feedback.

### Data Fetching & Loading States

A downside of the SSI/ESI approach is, that the __slowest fragment determines the response time__ of the whole page.
So it's good when the response of a fragment can be cached.
For fragments that are expensive to produce and hard to cache it's often a good idea to exclude them from the initial render.
They can be loaded asynchronously in the browser.
In our example the `green-recos` fragment, that shows personalized recommendations is a candidate for this.

One possible solution would be that team red just skips the SSI Include.

**Before**

    <green-recos sku="t_porsche">
      <!--#include virtual="/green-recos?sku=t_porsche" -->
    </green-recos>

**After**

    <green-recos sku="t_porsche"></green-recos>

*Important Side-note: Custom Elements [cannot be self-closing](https://developers.google.com/web/fundamentals/architecture/building-components/customelements#jsapi), so writing `<green-recos sku="t_porsche" />` would not work correctly.*

<img alt="Reflow" src="./ressources/video/data-fetching-reflow.gif" style="width: 500px" />

The rendering only takes place in the browser.
But, as can be seen in the animation, this change has now introduced a __substantial reflow__ of the page.
The recommendation area is initially blank.
Team greens JavaScript is loaded and executed.
The API call for fetching the personalized recommendation is made.
The recommendation markup is rendered and the associated images are requested.
The fragment now needs more space and pushes the layout of the page.

There are different options to avoid an annoying reflow like this.
Team red, which controls the page, could __fixate the recommendation containers height__.
On a responsive website its often tricky to determine the height, because it could differ for different screen sizes.
But the more important issue is, that __this kind of inter-team agreement creates a tight coupling__ between team red and green.
If team green wants to introduce an additional sub-headline in the reco element, it would have to coordinate with team red on the new height.
Both teams would have to rollout their changes simultaneously to avoid a broken layout.

A better way is to use a technique called [Skeleton Screens](https://blog.prototypr.io/luke-wroblewski-introduced-skeleton-screens-in-2013-through-his-work-on-the-polar-app-later-fd1d32a6a8e7).
Team red leaves the `green-recos` SSI Include in the markup.
In addition team green changes the __server-side render method__ of its fragment so that it produces a __schematic version of the content__.
The __skeleton markup__ can reuse parts of the real content's layout styles.
This way it __reserves the needed space__ and the fill-in of the actual content does not lead to a jump.

<img alt="Skeleton Screen" src="./ressources/video/data-fetching-skeleton.gif" style="width: 500px" />

Skeleton screens are also __very useful for client rendering__.
When your custom element is inserted into the DOM due to a user action it could __instantly render the skeleton__ until the data it needs from the server has arrived.

Even on an __attribute change__ like for the _variant select_ you can decide to switch to skeleton view until the new data arrives.
This ways the user gets an indication that something is going on in the fragment.
But when your endpoint responds quickly a short __skeleton flicker__ between the old and new data could also be annoying.
Preserving the old data or using intelligent timeouts can help.
So use this technique wisely and try to get user feedback.

## Navigating Between Pages

__to be continued soon ... (I promise)__

watch the [Github Repo](https://github.com/neuland/micro-frontends) to get notified



## Additional Resources
- [Book: Micro Frontends in Action](https://www.manning.com/books/micro-frontends-in-action?a_aid=mfia&a_bid=5f09fdeb) Written by me.
- [Talk: Micro Frontends - MicroCPH, Copenhagen 2019](https://www.youtube.com/watch?v=wCHYILvM7kU) ([Slides](https://noti.st/naltatis/zQb2m5/micro-frontends-the-nitty-gritty-details-or-frontend-backend-happyend)) The Nitty Gritty Details or Frontend, Backend, 🌈 Happyend
- [Talk: Micro Frontends - Web Rebels, Oslo 2018](https://www.youtube.com/watch?v=dTW7eJsIHDg) ([Slides](https://noti.st/naltatis/HxcUfZ/micro-frontends-think-smaller-avoid-the-monolith-love-the-backend)) Think Smaller, Avoid the Monolith, ❤️the Backend
- [Slides: Micro Frontends - JSUnconf.eu 2017](https://speakerdeck.com/naltatis/micro-frontends-building-a-modern-webapp-with-multiple-teams)
- [Talk: Break Up With Your Frontend Monolith - JS Kongress 2017](https://www.youtube.com/watch?v=W3_8sxUurzA) Elisabeth Engel talks about implementing Micro Frontends at gutefrage.net
- [Article: Micro Frontends](https://martinfowler.com/articles/micro-frontends.html) Article by Cam Jackson on Martin Fowlers Blog
- [Post: Micro frontends - a microservice approach to front-end web development](https://medium.com/@tomsoderlund/micro-frontends-a-microservice-approach-to-front-end-web-development-f325ebdadc16) Tom Söderlund explains the core concept and provides links on this topic
- [Post: Microservices to Micro-Frontends](http://www.agilechamps.com/microservices-to-micro-frontends/) Sandeep Jain summarizes the key principals behind microservices and micro frontends
- [Link Collection: Micro Frontends by Elisabeth Engel](https://micro-frontends.zeef.com/elisabeth.engel?ref=elisabeth.engel&share=ee53d51a914b4951ae5c94ece97642fc) extensive list of posts, talks, tools and other resources on this topic
- [Awesome Micro Frontends](https://github.com/ChristianUlbrich/awesome-microfrontends) a curated list of links by Christian Ulbrich 🕶
- [Custom Elements Everywhere](https://custom-elements-everywhere.com/) Making sure frameworks and custom elements can be BFFs
- Tractors are purchasable at [manufactum.com](https://www.manufactum.com/) :)<br>_This store is developed by two teams using the here described techniques._

## Related Techniques
- [Posts: Cookie Cutter Scaling](https://paulhammant.com/categories.html#Cookie_Cutter_Scaling) David Hammet wrote a series of blog posts on this topic.
- [Wikipedia: Java Portlet Specification](https://en.wikipedia.org/wiki/Java_Portlet_Specification) Specification that addresses similar topics for building enterprise portals.

---

## Things to come ... (very soon)

- Use Cases
  - Navigating between pages
    - soft vs. hard navigation
    - universal router
  - ...
- Side Topics
  - Isolated CSS / Coherent User Interface / Style Guides & Pattern Libraries
  - Performance on initial load
  - Performance while using the site
  - Loading CSS
  - Loading JS
  - Integration Testing
  - ...

## Contributors
- [Koike Takayuki](https://github.com/koiketakayuki) who translated the site to [Japanese](https://micro-frontends-japanese.org/).
- [Jorge Beltrán](https://github.com/scipion) who translated the site to [Spanish](https://micro-frontends-es.org).
- [Bruno Carneiro](https://github.com/Tautorn) who translated the site to [Portuguese](https://tautorn.github.io/micro-frontends/).

This site is generated by Github Pages. Its source can be found at [neuland/micro-frontends](https://github.com/neuland/micro-frontends/).
