本文介绍可以用来构建能够让__多个团队__ 独立交付项目代码的__现代web app__ 技术，策略以及实践方法

Techniques, strategies and recipes for building a __modern web app__ with __multiple teams__ that can __ship features independently__.

## What are Micro Frontends? 什么是微前端

The term __Micro Frontends__ first came up in [ThoughtWorks Technology Radar](https://www.thoughtworks.com/radar/techniques/micro-frontends) at the end of 2016. It extends the concepts of micro services to the frontend world. The current trend is to build a feature-rich and powerful browser application, aka single page app, which sits on top of a micro service architecture. Over time the frontend layer, often developed by a separate team, grows and gets more difficult to maintain. That's what we call a [Frontend Monolith](https://www.youtube.com/watch?v=pU1gXA0rfwc).

__微前端__这个名词，第一次被提出还是在2016年底，那是在 [ThoughtWorks Technology Radar](https://www.thoughtworks.com/radar/techniques/micro-frontends)。这个概念将微服务这个被广泛应用于服务端的技术范式扩展到前端领域。现代的前端应用的发展趋势正在变得越来越富功能化，富交互化，也就是传说中的SPA(单页面应用)；这样越来越复杂的单体前端应用，背后的后端应用则是数量庞大的微服务集群。被一个团队维护的前端项目，随着时间推进，会变得越来越庞大，越来越难以维护。所以我们给这种应用起名为[巨石单体应用](https://www.youtube.com/watch?v=pU1gXA0rfwc)。

The idea behind Micro Frontends is to think about a website or web app as __a composition of features__ which are owned by __independent teams__. Each team has a __distinct area of business__ or __mission__ it cares about and specialises in. A team is __cross functional__ and develops its features __end-to-end__, from database to user interface.

微前端背后的思想是认为：现代复杂的web app或者网站，通常由很多__相对独立的功能模块组合而成__，而对这些模块负责的应该是__相互独立的多个团队__。这些独立的团队由于专业分工不同，会负责着__特定的业务领域__，以及完成__特定的开发任务__。这样的团队，通常在人员组成方面囊括了从前端开发到服务端开发，从UI实现到数据库设计这样__端到端__的__跨职能人员__构成。

However, this idea is not new. It has a lot in common with the [Self-contained Systems](http://scs-architecture.org/) concept. In the past approaches like this went by the name of [Frontend Integration for Verticalised Systems](https://dev.otto.de/2014/07/29/scaling-with-microservices-and-vertical-decomposition/). But Micro Frontends is clearly a more friendly and less bulky term.

然而微前端这个概念并不新鲜。它实际上与 [自包含系统](http://scs-architecture.org/) 概念一脉相承。在过去，微前端之类的思路，会被称为 [面向垂直划分系统的前端集成](https://dev.otto.de/2014/07/29/scaling-with-microservices-and-vertical-decomposition/)。但很显然，微前端这个概念，对于前端开发人员来说更加易于理解，况且这个名词里也没有那么多不容易理解的大词。

__Monolithic Frontends__ __单体巨石前端应用__
![Monolithic Frontends](./ressources/diagrams/organisational/monolith-frontback-microservices.png)

__Organisation in Verticals__ __面向垂直划分系统的前端架构__
![End-To-End Teams with Micro Frontends](./ressources/diagrams/organisational/verticals-headline.png)

## What's a Modern Web App? 什么是现代的Web App？

In the introduction I've used the phrase "building a modern web app". Let's define the assumptions that are connected with this term.

在最前面的介绍部分，我使用了构建 “现代web app” 这样的表述。接下来让我们一起来讨论一下如何定义这个概念。

To put this into a broader perspective, [Aral Balkan](https://ar.al/) has written a blog post about what he calls the [Documents‐to‐Applications Continuum](https://ar.al/notes/the-documents-to-applications-continuum/). He comes up with the concept of a sliding scale where a site, built out of __static documents__, connected via links, is __on the left__ end and a pure behaviour driven, __contentless application__ like an online photo editor is __on the right__.

从更宽泛的角度来说，[Aral Balkan](https://ar.al/) 曾经在一篇blog中提及关于 [联机文档与网络应用的边界](https://ar.al/notes/the-documents-to-applications-continuum/) 的看法。他认为如果在联机文档与网络应用之间有一个清晰的边界的话，那么通过超链接的形式组成的一堆__静态文档__就应该属于__边界的最左侧__，也即联机文档这一侧；而另外一端，则应该属于通过行为驱动的__与内容无关__的应用，比如在线相册(它提供的是一个功能，内容只是功能所提供的的价值)。

If you would position your project on the __left side of this spectrum__, an __integration on webserver level__ is a good fit. With this model a server collects and __concatenates HTML strings__ from all components that make up the page requested by the user. Updates are done by reloading the page from the server or replacing parts of it via ajax. [Gustaf Nilsson Kotte](https://twitter.com/gustaf_nk/) has written a [comprehensive article](https://gustafnk.github.io/microservice-websites/) on this topic.

如果你认为你的项目在__这个序列中__应该位列左侧，那么一个简单的web服务器的集成就已经足够了。对这种网络架构来说，一个web服务器把__散落于组件中的HTML标签__集成起来，之后把集成好的HTML文档传输给请求的用户即可。页面的更新无非是通过刷新浏览器，或者通过ajax请求更新页面中部分的静态内容。关于这个话题， [Gustaf Nilsson Kotte](https://twitter.com/gustaf_nk/) 也曾经专门写过一篇文章 [comprehensive article](https://gustafnk.github.io/microservice-websites/) 。

When your user interface has to provide __instant feedback__, even on unreliable connections, a pure server rendered site is not sufficient anymore. To implement techniques like [Optimistic UI](https://www.smashingmagazine.com/2016/11/true-lies-of-optimistic-user-interfaces/) or [Skeleton Screens](http://www.lukew.com/ff/entry.asp?1797) you need to be able to also __update__ your UI __on the device itself__. Google's term [Progressive Web Apps](https://developers.google.com/web/progressive-web-apps/) aptly describes the __balancing act__ of being a good citizen of the web (progressive enhancement) while also providing app-like performance. This kind of application is located somewhere __around the middle of the site-app-continuum__. Here a solely server based solution is not sufficient anymore. We have to move the __integration into the browser__, and this is the focus of this article.

但你的应用需要提供即时__更新的UI__特性，甚至是在不怎么好的网络环境之下，那么一个纯粹的服务端渲染的架构就显然力不从心了。为了追求更加优秀的用户体验，如果要实现类似于__积极的UI__或者__骨架屏__之类的技术，甚至需要在终端设备自身(不依赖服务端)进行UI的__更新操作__。比如Google发明的名词 [Progressive Web Apps](https://developers.google.com/web/progressive-web-apps/) （PWA）就认为这种__平衡技术__需要做到：即能够具备良好的web公民素质(做到渐进增强)的同时，也需要提供原生APP的性能表现。这样的web app位于上边所说的__那个图谱的中间部分__。前端应用发展至今，单个web服务器的架构已经不足以满足业务的需求，所以我们必须向更深远的方向考虑，一个web应用应该如何更加深入的与浏览器进行结合，而这，就是这篇文章关注的焦点。

## Core Ideas behind Micro Frontends 微前端架构背后的核心思维

* __Be Technology Agnostic__ __技术不可知主义__<br>Each team should be able to choose and upgrade their stack without having to coordinate with other teams. [Custom Elements](#the-dom-is-the-api) are a great way to hide implementation details while providing a neutral interface to others.

  每个团队应该选择自己的技术栈以及技术进化路线，而不是与其他团队步调一致。在项目中可以通过引入[自定义元素](#the-dom-is-the-api)来提供技术栈无关的接口，同时还隐藏了复杂的内部实现。也许在微前端的语境之下，框架将不是未来架构师主要考虑的问题，如何高效的提供可复用的WebComponent会成为核心问题。

* __Isolate Team Code__ __隔离团队之间的代码__<br>Don’t share a runtime, even if all teams use the same framework. Build independent apps that are self contained. Don't rely on shared state or global variables.

  即便所有团队都使用同样的框架，也不要共享同一个运行时环境。构建自包含的Apps。不要依赖共享的状态或者全局变量。

* __Establish Team Prefixes __ __建立团队自己的前缀__<br>Agree on naming conventions where isolation is not possible yet. Namespace CSS, Events, Local Storage and Cookies to avoid collisions and clarify ownership.

  在还不能做到完全隔离的环境下，通过命名规约进行隔离。对于CSS， 事件，Local Storage 以及 Cookies之类的环境之下，通过命名空间进行的隔离可以避免冲突，以及所有权。

* __Favor Native Browser Features over Custom APIs__ __原生浏览器标准优先于框架封装的API__<br>Use [Browser Events for communication](#parent-child-communication--dom-modification) instead of building a global PubSub system. If you really have to build a cross team API, try keeping it as simple as possible.

  使用 [用于通信的原生浏览器事件机制](#parent-child-communication--dom-modification) ，而不是自己构建一个PubSub系统。如果确实需要设计一个跨团队的通信API，那么也尽量让设计简单为好。

* __Build a Resilient Site__ __构建高可用的网络应用__<br>Your feature should be useful, even if JavaScript failed or hasn't executed yet. Use [Universal Rendering](#serverside-rendering--universal-rendering) and Progressive Enhancement to improve perceived performance.

  即便在Javascript执行失败的情况下，站点的功能也应保证可用。使用[同构渲染](#serverside-rendering--universal-rendering)以及渐进增强来提升体验和性能。

---

## The DOM is the API DOM 就是 API

[Custom Elements](https://developers.google.com/web/fundamentals/getting-started/primers/customelements), the interoperability aspect from the Web Components Spec, are a good primitive for integration in the browser. Each team builds their component __using their web technology of choice__ and __wraps it inside a Custom Element__ (e.g. `<order-minicart></order-minicart>`). The DOM specification of this particular element (tag-name, attributes & events) acts as the contract or public API for other teams. The advantage is that they can use the component and its functionality without having to know the implementation. They just have to be able to interact with the DOM.

Web Component规范中关于[Custom Elements](https://developers.google.com/web/fundamentals/getting-started/primers/customelements) 的描述，表明其可以直接集成到浏览器的强大原生能力。每一个独立的团队可以通过他们__自行选择的web 技术__把功能__封装到Custom Element组件中去__(e.g. `<order-minicart></order-minicart>`)。 而由于这些封装之后的原生组件所具有的原生DOM属性(tag-name, attributes & events)，就可以成为事实上的对外公开API协议。这种实现方式的优势在于，其他团队完全不需要了解构建组件的团队所使用的技术栈或者具体的技术实现，就可以直接使用这个UI组件。而花去的精力不过是了解这个组件在DOM层留给使用者的API。

But Custom Elements alone are not the solution to all our needs. To address progressive enhancement, universal rendering or routing we need additional pieces of software.

但是只是组件级别的自定义元素并不能解决我们所有的问题。为了实现渐进增强，同构渲染机制和路由机制则是整个拼图剩下的部分。

This page is divided into two main areas. First we will discuss [Page Composition](#page-composition) - how to assemble a page out of components owned by different teams. After that we'll show examples for implementing clientside [Page Transition](#page-transition).

以下段落我们会分为两大部分。首先我们要讨论[页面组成](#page-composition) - 如何把各个团队开发的组件组装到一起，最终能够形成一个完整的页面。 在那之后我们利用一个例子来展开第二个话题，如何在客户端进行[页面转变](#page-transition)。

## Page Composition 页面组成

Beside the __client-__ and __serverside__ integration of code written in __different frameworks__ itself, there are a lot of side topics that should be discussed: mechanisms to __isolate js__, __avoid css conflicts__, __load resources__ as needed, __share common resources__ between teams, handle __data fetching__ and think about good __loading states__ for the user. We'll go into these topics one step at a time.

抛开__前后端__如何集成来自于__不同开发框架__的代码这个问题本身，还有很多其他值得讨论的话题：用来__隔离js作用域__的机制，避免__css样式冲突__，按需__加载资源__，团队之间__共用资源的共享__，__处理获取数据的流程__以及因此产生的如何通过__更好的加载状态管理__来为用户带来更好的体验。关于这些话题，我们接下来会一步一步的深入剖析。

### The Base Prototype 基础的原型

The product page of this model tractor store will serve as the basis for the following examples.

下面这个展示各种拖拉机型号的店铺页面将作为演示的例子。

It features a __variant selector__ to switch between the three different tractor models. On change product image, name, price and recommendations are updated. There is also a __buy button__, which adds the selected variant to the basket and a __mini basket__ at the top that updates accordingly.

这个页面的主要功能是提供一个__型号选择器__，用来切换三种不同型号的拖拉机。一旦切换了不同的拖拉机图片，那么与之相关的型号名称，价格和推荐商品也会一并切换。页面上还有一个__购买的按键__，用来将选定好的型号放入购物框中，此外页面顶端也有一个__小的购物框组件__用来显示已经加入购物框中的商品。

[![Example 0 - Product Page - Plain JS](./ressources/video/model-store-0.gif)](./0-model-store/)

[在浏览器中打开](./0-model-store/) & [查看代码](https://github.com/neuland/micro-frontends/tree/master/0-model-store)

All HTML is generated client side using __plain JavaScript__ and ES6 Template Strings with __no dependencies__. The code uses a simple state/markup separation and re-renders the entire HTML client side on every change - no fancy DOM diffing and __no universal rendering__ for now. Also __no team separation__ - [the code](https://github.com/neuland/micro-frontends/tree/master/0-model-store) is written in one js/css file.

所有的HTML都是通过__原生Javascript__和ES6的字符串模板能力在客户端生成的，没有其他的第三方依赖了。前端代码通过数据状态和标记语言分离的方式，一旦有任何状态变更都会在客户端对整个HTML进行重新渲染。截至目前位置，整个过程中没有什么高级的DOM diff算法，也没有__同构渲染__技术的使用。也没有__不同团队__这个问题 - [所有代码](https://github.com/neuland/micro-frontends/tree/master/0-model-store)都是写在一个 js/css 文件之内的

### Clientside Integration 客户端集成

In this example, the page is split into separate components/fragments owned by three teams. __Team Checkout__ (blue) is now responsible for everything regarding the purchasing process - namely the __buy button__ and __mini basket__. __Team Inspire__ (green) manages the __product recommendations__ on this page. The page itself is owned by __Team Product__ (red).

同一个页面，这次我们把这个页面分割成几个独立的组件/片段，而这些组件分别归属三个不同的团队。__下单团队__ (蓝色框标注) 负责开发所有跟下单相关的流程 - 也就是__购买按钮__和__小购物框组件__。__用户启发团队__ (绿色框标注) 负责页面中__推荐商品的模块__。而整个页面的布局和页面内剩下的部分则归属于__产品模块团队__ (红色框标注)。

[![Example 1 - Product Page - Composition](./ressources/screen/three-teams.png)](./1-composition-client-only/)

[在浏览器中打开](./1-composition-client-only/) & [查看代码](https://github.com/neuland/micro-frontends/tree/master/1-composition-client-only)

__Team Product__ decides which functionality is included and where it is positioned in the layout. The page contains information that can be provided by Team Product itself, like the product name, image and the available variants. But it also includes fragments (Custom Elements) from the other teams.

__产品模块团队__决定整个页面中需要包含哪些功能，以及对应的组件如何布局。页面中包含产品模块团队自己就可以提供的信息，比如产品名称，图片和型号变体。但这个页面仍然也包含由其他团队提供的片段(自定义元素)。

### How to Create a Custom Element? 如何创建一个Custom Elements？

Lets take the __buy button__ as an example. Team Product includes the button simply adding `<blue-buy sku="t_porsche"></blue-buy>` to the desired position in the markup. For this to work, Team Checkout has to register the element `blue-buy` on the page.

以__购买按钮__为例。产品模块团队只需要简单的把`<blue-buy sku="t_porsche"></blue-buy>`这段代码引入到页面内就可以了。在这之前，需要下单团队在页面上注册`blue-buy`这个自定义元素。

    class BlueBuy extends HTMLElement {
      connectedCallback() {
        this.innerHTML = `<button type="button">buy for 66,00 €</button>`;
      }
    
      disconnectedCallback() { ... }
    }
    window.customElements.define('blue-buy', BlueBuy);

Now every time the browser comes across a new `blue-buy` tag, the `connectedCallback` is called. `this` is the reference to the root DOM node of the custom element. All properties and methods of a standard DOM element like `innerHTML` or `getAttribute()` can be used.

注册之后每次浏览器发现`blue-buy` 标签，`connectedCallback` 方法就会被调用。代码中的`this` 指向的是custom element的父级元素。所有标准DOM元素的属性和方法都可以被应用在自定义元素上，比如innerHTML或者`getAttribute()` 方法。

![Custom Element in Action](./ressources/video/custom-element.gif)

When naming your element the only requirement the spec defines is that the name must __include a dash (-)__ to maintain compatibility with upcoming new HTML tags. In the upcoming examples the naming convention `[team_color]-[feature]` is used. The team namespace guards against collisions and this way the ownership of a feature becomes obvious, simply by looking at the DOM.

为你的自定义元素进行命名时，需要满足自定义元素的标准中提到的一个条件：自定义元素的名称中需要__包含一个（-）__。这是为了保持与新增加的HTML标签的兼容性。在下面的例子中可以看到采用了`[团队颜色]-[功能]` 这种命名规约。使用团队相关的命名空间保证了自定义元素不会与其他团队的自定义元素发生冲突，并且组件的维护者也会一目了然，只需要看一下DOM的命名就知道是哪个团队在维护了。

### Parent-Child Communication / DOM Modification 父子通信 / DOM 修改

When the user selects another tractor in the __variant selector__, the __buy button has to be updated__ accordingly. To achieve this Team Product can simply __remove__ the existing element from the DOM __and insert__ a new one.

当用户通过__变体选择器__选择了其他型号的拖拉机，__购买按钮应该相应的作出改变__。产品模块团队可以通过简单的替换页面上的`blue-buy`元素即可。

    container.innerHTML;
    // => <blue-buy sku="t_porsche">...</blue-buy>
    container.innerHTML = '<blue-buy sku="t_fendt"></blue-buy>';

The `disconnectedCallback` of the old element gets invoked synchronously to provide the element with the chance to clean up things like event listeners. After that the `connectedCallback` of the newly created `t_fendt` element is called.

当摘除原先的购买按钮时，`disconnectedCallback` 方法会被同步执行，以便组件的使用者进行其他清理工作，比如清除事件监听。之后当新的带有`sku="t_fendt"` 属性的购买按钮被加入到页面上的同时，会调用新组件的`connectedCallback`方法。

Another more performant option is to just update the `sku` attribute on the existing element.

另外一种更加高效的操作方式则是直接改变当前元素的`sku` 属性。

    document.querySelector('blue-buy').setAttribute('sku', 't_fendt');

If Team Product used a templating engine that features DOM diffing, like React, this would be done by the algorithm automatically.

如果产品模块团队使用带有DOM diff的模板引擎进行开发，比如React，这个操作将会通过框架内部的算法自动执行。

![Custom Element Attribute Change](./ressources/video/custom-element-attribute.gif)

To support this the Custom Element can implement the `attributeChangedCallback` and specify a list of `observedAttributes` for which this callback should be triggered.

对于自定义元素来说，则可以通过实现`attributeChangedCallback` 方法达到同样的效果。在BlueBuy 类中可以通过声明`observedAttributes`以便对应的属性改变后自动触发`attributeChangedCallback` 回调方法。

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

为了避免代码重复，我们抽象了一个`render()` 方法，用来在`connectedCallback`方法和`attributeChangedCallback`方法中进行调用。这个渲染方法负责进行对DOM所需的数据进行处理，以及最终的HTML片段的插入。所以哪天你决定要在自定义元素内部使用一些更加复杂的模板引擎或者框架，他们的初始化代码放到这里就比较合适。

### Browser Support 浏览器支持

The above example uses the Custom Element V1 Spec which is currently [supported in Chrome, Safari and Opera](http://caniuse.com/#feat=custom-elementsv1). But with [document-register-element](https://github.com/WebReflection/document-register-element) a lightweight and battle-tested polyfill is available to make this work in all browsers. Under the hood, it uses the [widely supported](http://caniuse.com/#feat=mutationobserver) Mutation Observer API, so there is no hacky DOM tree watching going on in the background.

上面的示例代码使用了自定义元素的V1版本的标准，这个标准当前[被Chrome, Safari和Opera支持](http://caniuse.com/#feat=custom-elementsv1)。但是如果有[document-register-element](https://github.com/WebReflection/document-register-element) 这个轻量级实战检验过的polyfill 加持的话，以上代码就可以运行在所有浏览器中了。其底层实际上是使用了被[广泛支持的](http://caniuse.com/#feat=mutationobserver) MutationObserver 这个API，所以并没有在幕后藏着什么DOM tree 检查之类的hack技巧。 

### Framework Compatibility 框架兼容性

Because Custom Elements are a web standard, all major JavaScript frameworks like Angular, React, Preact, Vue or Hyperapp support them. But when you get into the details, there are still a few implementation problems in some frameworks. At [Custom Elements Everywhere](https://custom-elements-everywhere.com/) [Rob Dodson](https://twitter.com/rob_dodson) has put together a compatibility test suite that highlights unresolved issues.

由于自定义元素是就是web标准，所有主流的JavaScript框架诸如Angular, React, Preact, Vue以及Hyperapp 都支持。不过在一些细节上，某些框架仍然有一些具体实现方面的问题。关于这些问题[Rob Dodson](https://twitter.com/rob_dodson) 在这篇文章中[Custom Elements Everywhere](https://custom-elements-everywhere.com/) 汇编了兼容性测试中没通过测试的具体问题列表。

### Child-Parent or Siblings Communication / DOM Events 子父，同级通信 / DOM 事件

But passing down attributes is not sufficient for all interactions. In our example the __mini basket should refresh__ when the user performs a __click on the buy button__.

但是，通过从外向内传递DOM元素的属性并不能解决所有场景的通信问题。在例子中__小购物框__ 组件应该在用户__点击了购买按钮__之后也即时进行改变。

Both fragments are owned by Team Checkout (blue), so they could build some kind of internal JavaScript API that lets the mini basket know when the button was pressed. But this would require the component instances to know each other and would also be an isolation violation.

这两个组件都属于下单团队 (蓝色)，所以想当然的他们可以自己设计某种用于通信的Javascript API，以便可以让购物框知道购买按钮被点击了。但这样的设计就需要两个组件实例知晓对方的存在，这种设计违反了隔离原则。

A cleaner way is to use a PubSub mechanism, where a component can publish a message and other components can subscribe to specific topics. Luckily browsers have this feature built-in. This is exactly how browser events like `click`, `select` or `mouseover` work. In addition to native events there is also the possibility to create higher level events with `new CustomEvent(...)`. Events are always tied to the DOM node they were created/dispatched on. Most native events also feature bubbling. This makes it possible to listen for all events on a specific sub-tree of the DOM. If you want to listen to all events on the page, attach the event listener to the window element. Here is how the creation of the `blue:basket:changed`-event looks in the example:

更优化的解决方案是应用PubSub机制，这样一来组件可以发布信息，而其他组件可以根据自身的需要来选择订阅某些特定的话题。幸运的是，浏览器本身就内置了这样的特性。实际上这也就是`click`，`select` 或者 `mouseover` 这些浏览器事件能够工作的幕后英雄。除了浏览器定义的原生事件以外，我们也可以通过调用`new CustomEvent()` 来创建上层的自定义事件。浏览器事件总是与创建/分发这些事件的DOM节点绑定在一起。大多数原生事件也都具有冒泡的特性。由于具有冒泡的特性，所以我们可以在DOM树中的某个特定子节点监听到所有的事件。如果你一定要监听到整个页面上的所有事件，那就把事件监听的处理句柄直接绑定到window元素上。关于原理我们就讲这么多，下面的代码展示了如何创建一个形如`blue:basket:changed` 的自定义事件：

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

小购物框组件就可以使用下面的代码来订阅__window__元素上发生的这个特定事件，一旦在购买按钮上触发了这个事件，购物框组件内部就会收到事件发生的通知，随后执行`refresh()` 方法。

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

通过这种方式小购物框组件就能够监听到在它自身DOM范围之外的节点上发生的事件(在这个示例中就是发生在`window`上)。对于很多场景来说，这么做应该没什么问题，但是如果你觉得挂在全局变量的方式让你感到不妥，那么你仍然可以实现其他方法来达到同样的目的。比如在页面组件上(由产品模块团队维护) 监听购买按钮按下的事件，同样的，仍然由页面组件负责主动调用购物框组件的`refresh()` 方法来达到通知购物框组件的目的。

    // page.js
    const $ = document.getElementsByTagName;
    
    $('blue-buy')[0].addEventListener('blue:basket:changed', function() {
      $('blue-basket')[0].refresh();
    });

Imperatively calling DOM methods is quite uncommon, but can be found in [video element api](https://developer.mozilla.org/de/docs/Web/HTML/Using_HTML5_audio_and_video#Controlling_media_playback) for example. If possible the use of the declarative approach (attribute change) should be preferred.

直接调用DOM元素的方法并不常见，但也可以在[video element api](https://developer.mozilla.org/de/docs/Web/HTML/Using_HTML5_audio_and_video#Controlling_media_playback) 中找到例子。不过如果可以的话，还是应该优先采用声明式的方式(改变子组件的attribute)进行通信。

## Serverside Rendering / Universal Rendering 服务端渲染 / 同构渲染

Custom Elements are great for integrating components inside the browser. But when building a site that is accessible on the web, chances are that initial load performance matters and users will see a white screen until all js frameworks are downloaded and executed. Additionally, it's good to think about what happens to the site if the JavaScript fails or is blocked. [Jeremy Keith](https://adactio.com/) explains the importance in his ebook/podcast [Resilient Web Design](https://resilientwebdesign.com/). Therefore the ability to render the core content on the server is key. Sadly the web component spec does not talk about server rendering at all. No JavaScript, no Custom Elements :(

自定义元素对于在浏览器环境下集成组件来说非常棒。但是当构建一个web网站时，大概率我们会考虑加载效率的问题，毕竟在所有静态资源加载完成之前，用户能看到的只有一个白屏。另外还得考虑如果JavaScript脚本执行失败或者被阻断的时候，我们的网站应该如何显示。[Jeremy Keith](https://adactio.com/) 在他的电子书/podcast节目中[Resilient Web Design](https://resilientwebdesign.com/)说明了这个问题的重要性。所以服务端是否能把页面的核心部分渲染出来就成了页面加载效率的关键点。可惜的是web component的标准中根本没有涉及到服务端渲染这件事情。没有JavaScript，没有自定义元素 :(

### Custom Elements + Server Side Includes = ❤️ 自定义元素 + 服务端引用 = ❤️

To make server rendering work, the previous example is refactored. Each team has their own express server and the `render()` method of the Custom Element is also accessible via url.

为了让自定义元素在服务端渲染环境下也能适用，之前的例子就需要做一些重构。每个团队都部署他们自己的express服务器，并且自定义元素的`render()`方法也可以通过url进行调用。

    $ curl http://127.0.0.1:3000/blue-buy?sku=t_porsche
    <button type="button">buy for 66,00 €</button>

The Custom Element tag name is used as the path name - attributes become query parameters. Now there is a way to server-render the content of every component. In combination with the `<blue-buy>`-Custom Elements something that is quite close to a __Universal Web Component__ is achieved:

把自定义元素的标签名称作为请求的路径 - attributes作为url参数。这样的话就可以让服务器把每一种组件相对应的HTML返回出来。这个方法再加上基于浏览器的自定义组件能力，这个奇妙的组合产生了一种类似__同构Web Component__ 的东西。

    <blue-buy sku="t_porsche">
      <!--#include virtual="/blue-buy?sku=t_porsche" -->
    </blue-buy>

The `#include` comment is part of [Server Side Includes](https://en.wikipedia.org/wiki/Server_Side_Includes), which is a feature that is available in most web servers. Yes, it's the same technique used back in the days to embed the current date on our web sites. There are also a few alternative techniques like [ESI](https://en.wikipedia.org/wiki/Edge_Side_Includes), [nodesi](https://github.com/Schibsted-Tech-Polska/nodesi), [compoxure](https://github.com/tes/compoxure) and [tailor](https://github.com/zalando/tailor), but for our projects SSI has proven itself as a simple and incredibly stable solution.

`#include` 注释是一种[服务端引用](https://en.wikipedia.org/wiki/Server_Side_Includes)方式，大多数web server都支持这个特性。没错这玩意就是很久以前我们用来在网站上显示一个嵌入在网页中的当前时间的技术。还有一些其他可以替代的技术比如[ESI](https://en.wikipedia.org/wiki/Edge_Side_Includes), [nodesi](https://github.com/Schibsted-Tech-Polska/nodesi), [compoxure](https://github.com/tes/compoxure) 以及 [tailor](https://github.com/zalando/tailor)，不过对于我们这个项目来说，SSI已经被证明是一个非常简单而且可靠的解决方案了。

The `#include` comment is replaced with the response of `/blue-buy?sku=t_porsche` before the web server sends the complete page to the browser. The configuration in nginx looks like this:

`#include` 注释会在web server将整个页面发送给浏览器之前，被替换为`/blue-buy?sku=t_porsche`这个请求的响应。下面是对应的nginx配置：

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

Nginx指令 `ssi: on;` 开启SSI特性。另外 `upstream` 和 `location` 的配置，分别给三个团队设置了对应的路由。比如url以 `/blue` 开头的请求被路由到正确的应用上(`team_blue:3001`) 上。另外 `/` 也被路由到红色团队(产品模块团队)，这是为了把根路径，也就是产品页面本身路由到产品模块团队的web server上。

This animation shows the tractor store in a browser which has __JavaScript disabled__.

下面的动画展示了这个拖拉机商店在一个关闭了JavaScript 能力的浏览器上是什么样的表现。

[![Serverside Rendering - Disabled JavaScript](./ressources/video/server-render.gif)](./ressources/video/server-render.mp4)

[查看代码](https://github.com/neuland/micro-frontends/tree/master/2-composition-universal)

The variant selection buttons now are actual links and every click leads to a reload of the page. The terminal on the right illustrates the process of how a request for a page is routed to team red, which controls the product page and after that the markup is supplemented by the fragments from team blue and green.

变体选择器按钮现在就变成了链接的形态，每一次点击都会让浏览器重新刷新页面。右边的终端界面呈现的就是一个请求是如何路由到红色团队服务器的，红色团队的nginx进程在返回整个产品信息页面的同时，也负责根据URL将蓝色团队和绿色团队实现的对应代码片段载入页面。

When switching JavaScript back on, only the server log messages for the first request will be visible. All subsequent tractor changes are handled client side, just like in the first example. In a later example the product data will be extracted from the JavaScript and loaded via a REST api as needed.

当我们把JavaScript能力开启之后，服务端的日志只留下第一次请求的记录。接下来所有的拖拉机型号的切换都在客户端处理了，就跟最开始的例子是一样的。稍后我们还会给出一个通过API获取数据场景的样例。

You can play with this sample code on your local machine. Only [Docker Compose](https://docs.docker.com/compose/install/) needs to be installed.

当前这个例子的代码你也可以在本地开启把玩一番。只不过你需要先安装[Docker Compose](https://docs.docker.com/compose/install/)。

    git clone https://github.com/neuland/micro-frontends.git
    cd micro-frontends/2-composition-universal
    docker-compose up --build

Docker then starts the nginx on port 3000 and builds the node.js image for each team. When you open [http://127.0.0.1:3000/](http://127.0.0.1:3000/) in your browser you should see a red tractor. The combined log of `docker-compose` makes it easy to see what is going on in the network. Sadly there is no way to control the output color, so you have to endure the fact that team blue might be highlighted in green :)

执行以上命令之后Docker会在3000端口启动nginx，并且为三个团队分别构建他们各自的node.js 镜像。当你在浏览器中访问[http://127.0.0.1:3000/](http://127.0.0.1:3000/) 时，你会看到一个红色的拖拉机。`docker-compose` 整合出的日志可以让我们轻松的了解网络传输中到底发生了些什么。不过我们并不能控制输出日志的颜色，所以你只能忍受一下由绿色团队的服务产生的日志实际上却是以蓝色显示的。

The `src` files are mapped into the individual containers and the node application will restart when you make a code change. Changing the `nginx.conf` requires a restart of `docker-compose` in order to have an effect. So feel free to fiddle around and give feedback.

`src`目录下的文件会被映射到独立的容器之内，当你修改了其中的源代码，node 服务也会随之重启。而如果修改了`nginx.conf` 就需要重新启动`docker-compose` 才能看到修改后的效果。欢迎大家摆弄这一坨代码，也欢迎你把你的想法反馈给我们。 

### Data Fetching & Loading States 数据获取 & 加载状态

A downside of the SSI/ESI approach is, that the __slowest fragment determines the response time__ of the whole page.
So it's good when the response of a fragment can be cached.
For fragments that are expensive to produce and hard to cache it's often a good idea to exclude them from the initial render.
They can be loaded asynchronously in the browser.
In our example the `green-recos` fragment, that shows personalized recommendations is a candidate for this.

SSI/ESI 这种解决方案的缺陷在于，整个页面的响应时间由__页面中生成最慢的那个代码片段的响应时间决定__。

所以能把动态生成的代码片段缓存起来是最好的。

如果有的代码片段动态生成的成本非常高，同时缓存也很困难的话，最好能够把它从首次渲染中排除出去。这类组件在页面载入之后通过浏览器异步加载就可以。

在示例代码中，那个叫做`green-recos` 的组件——用来展示根据个人推荐产品的模块——就是一个适合这种加载方式的强力候选人。

One possible solution would be that team red just skips the SSI Include.

对我们来说，我们的解决方案就是在SSI引用过程中，红色团队的渲染服务直接跳过这个组件。

**Before 之前的SSI配置** 

    <green-recos sku="t_porsche">
      <!--#include virtual="/green-recos?sku=t_porsche" -->
    </green-recos>

**After 修改之后的SSI配置**

    <green-recos sku="t_porsche"></green-recos>

*Important Side-note: Custom Elements [cannot be self-closing](https://developers.google.com/web/fundamentals/architecture/building-components/customelements#jsapi), so writing `<green-recos sku="t_porsche" />` would not work correctly.*

*重要小提示：自定义元素标签[不能自闭合](https://developers.google.com/web/fundamentals/architecture/building-components/customelements#jsapi) ，所以如果写成`<green-recos sku="t_porsche" />` 是不能正确工作的*

<img alt="Reflow" src="./ressources/video/data-fetching-reflow.gif" style="width: 500px" />

The rendering only takes place in the browser.
But, as can be seen in the animation, this change has now introduced a __substantial reflow__ of the page.
The recommendation area is initially blank.
Team greens JavaScript is loaded and executed.
The API call for fetching the personalized recommendation is made.
The recommendation markup is rendered and the associated images are requested.
The fragment now needs more space and pushes the layout of the page.

渲染的过程只发生在浏览器中。但是在动画中也可以看到，这种浏览器动态引入的方式也引入了一次__实实在在的重排__。推荐模块在一开始的时候是一片空白。之后绿色团队的组件在浏览器中载入，然后执行。紧接着为了获取个人推荐数据的API请求被发送出去。请求返回的数据在组件内被渲染，同时需要进行渲染的图片文件也开始进行请求并渲染。于是整个组件的高度被撑开，这个组件的高度也影响着整个页面的布局。

There are different options to avoid an annoying reflow like this.
Team red, which controls the page, could __fixate the recommendation containers height__.
On a responsive website its often tricky to determine the height, because it could differ for different screen sizes.
But the more important issue is, that __this kind of inter-team agreement creates a tight coupling__ between team red and green.
If team green wants to introduce an additional sub-headline in the reco element, it would have to coordinate with team red on the new height.
Both teams would have to rollout their changes simultaneously to avoid a broken layout.

有很多种选项可用来避免这种恼人的重排现象发生。控制整个页面的红色团队，可以__固定推荐组件的容器高度__。但如果这种事情发生在一个自适应布局的页面上的话，想要固定一个高度就非常困难了，因为对于不同的屏幕尺寸这个组件的高度可能是不同的。这还不算主要问题，更重要的问题在于，这种__跨团队的规约会造成一种紧耦合的状况发生__，控制整个页面的红色团队需要控制绿色团队组件的内部属性。如果绿色团队后来希望在组件的顶部增加一个副标题，那么他们需要与红色团队沟通协调，然后为这个组件的固定高度一起制定一个新的值。两个团队必须同时更新版本才能避免布局被破坏。

A better way is to use a technique called [Skeleton Screens](https://blog.prototypr.io/luke-wroblewski-introduced-skeleton-screens-in-2013-through-his-work-on-the-polar-app-later-fd1d32a6a8e7).
Team red leaves the `green-recos` SSI Include in the markup.
In addition team green changes the __server-side render method__ of its fragment so that it produces a __schematic version of the content__.
The __skeleton markup__ can reuse parts of the real content's layout styles.
This way it __reserves the needed space__ and the fill-in of the actual content does not lead to a jump.

更好的方法是使用一种叫做[骨架屏](https://blog.prototypr.io/luke-wroblewski-introduced-skeleton-screens-in-2013-through-his-work-on-the-polar-app-later-fd1d32a6a8e7)的技术。红色团队仍然保留nginx中对于`green-recos` 组件的SSI引入。之后绿色团队改变这个组件的渲染方式，不要在服务端渲染真实的数据，而只是渲染一个__组件内容概要版本__的HTML片段。__骨架标记__仍然可以使用部分真实内容的样式，以保证整个组件在骨架阶段和真实数据渲染之后的布局是大致类似的。如此一来产品推荐模块就可以__保留整个组件所需要占用的布局空间__，而之后真实数据填充进来也不会导致整个页面布局的跳动。

<img alt="Skeleton Screen" src="./ressources/video/data-fetching-skeleton.gif" style="width: 500px" />

Skeleton screens are also __very useful for client rendering__.
When your custom element is inserted into the DOM due to a user action it could __instantly render the skeleton__ until the data it needs from the server has arrived.

骨架屏技术__对于客户端渲染的场景也非常有用__。比如一次用户的交互导致你的自定义元素动态插入到DOM中，骨架屏可以迅速渲染出__组件的概要结构__，然后就可以悠闲的等待数据返回之后再渲染真实数据了。

Even on an __attribute change__ like for the _variant select_ you can decide to switch to skeleton view until the new data arrives.
This ways the user gets an indication that something is going on in the fragment.
But when your endpoint responds quickly a short __skeleton flicker__ between the old and new data could also be annoying.
Preserving the old data or using intelligent timeouts can help.
So use this technique wisely and try to get user feedback.

即便是类似__attribute 改变__这样的情况，你也可以考虑在界面内容切换过程中，在真实数据还未返回之前使用骨架屏技术。这样的界面交互，用户会自然预期到这块的界面片段接下来会发生改变。但是如果你的接口返回非常迅速，那么渲染数据前后产生的__骨架屏闪烁__体验上也会有些烦人。保留老数据的渲染结果，或者使用一个类似截流的技巧(timeout)可以改善这种体验上的不足。总结来说骨架屏技巧在具体使用上还需要结合实际情况制定一些具体的策略，同时也要多倾听用户真实的反馈。

## Navigating Between Pages 页面间跳转

__to be continued soon ... (I promise)__ __未完待续 (我发誓会续上的)__

watch the [Github Repo](https://github.com/neuland/micro-frontends) to get notified

watch [Github Repo](https://github.com/neuland/micro-frontends), 有新情况会通知你的



## Additional Resources 其他相关资源
- [书: Micro Frontends in Action](https://www.manning.com/books/micro-frontends-in-action?a_aid=mfia&a_bid=5f09fdeb) 作者即本文作者.
- [演讲: Micro Frontends - MicroCPH, Copenhagen 2019](https://www.youtube.com/watch?v=wCHYILvM7kU) ([Slides](https://noti.st/naltatis/zQb2m5/micro-frontends-the-nitty-gritty-details-or-frontend-backend-happyend)) The Nitty Gritty Details or Frontend, Backend, 🌈 Happyend
- [演讲: Micro Frontends - Web Rebels, Oslo 2018](https://www.youtube.com/watch?v=dTW7eJsIHDg) ([Slides](https://noti.st/naltatis/HxcUfZ/micro-frontends-think-smaller-avoid-the-monolith-love-the-backend)) Think Smaller, Avoid the Monolith, ❤️the Backend
- [幻灯片: Micro Frontends - JSUnconf.eu 2017](https://speakerdeck.com/naltatis/micro-frontends-building-a-modern-webapp-with-multiple-teams)
- [演讲: Break Up With Your Frontend Monolith - JS Kongress 2017](https://www.youtube.com/watch?v=W3_8sxUurzA) Elisabeth Engel talks about implementing Micro Frontends at gutefrage.net
- [文章: Micro Frontends](https://martinfowler.com/articles/micro-frontends.html) Article by Cam Jackson on Martin Fowlers Blog
- [日志: Micro frontends - a microservice approach to front-end web development](https://medium.com/@tomsoderlund/micro-frontends-a-microservice-approach-to-front-end-web-development-f325ebdadc16) Tom Söderlund explains the core concept and provides links on this topic
- [日志: Microservices to Micro-Frontends](http://www.agilechamps.com/microservices-to-micro-frontends/) Sandeep Jain summarizes the key principals behind microservices and micro frontends
- [相关资源链接集合: Micro Frontends by Elisabeth Engel](https://micro-frontends.zeef.com/elisabeth.engel?ref=elisabeth.engel&share=ee53d51a914b4951ae5c94ece97642fc) extensive list of posts, talks, tools and other resources on this topic
- [Awesome Micro Frontends](https://github.com/ChristianUlbrich/awesome-microfrontends) a curated list of links by Christian Ulbrich 🕶
- [Custom Elements Everywhere](https://custom-elements-everywhere.com/) Making sure frameworks and custom elements can be BFFs
- 拖拉机可以在这里购买 [manufactum.com](https://www.manufactum.com/) :)<br>_这个在线商店由两个团队共同开发，所使用的技术就是这篇文章中所提及的_

## Related Techniques 相关技巧
- [日志 Cookie Cutter Scaling](https://paulhammant.com/categories.html#Cookie_Cutter_Scaling) David Hammet wrote a series of blog posts on this topic.
- [Wikipedia: Java Portlet Specification](https://en.wikipedia.org/wiki/Java_Portlet_Specification) Specification that addresses similar topics for building enterprise portals.

---

## Things to come ... (very soon) 接下来会发布的 ... (马上)

- Use Cases 用例
  - Navigating between pages 页面间跳转
    - soft vs. hard navigation 软跳转 vs 硬跳转
    - universal router 同构路由
  - ...
- Side Topics 其他话题
  - Isolated CSS / Coherent User Interface / Style Guides & Pattern Libraries CSS隔离 / UI一致性 / 样式指引 & 模式库
  - Performance on initial load 首次载入的性能表现
  - Performance while using the site 使用站点时的性能表现
  - Loading CSS 载入CSS
  - Loading JS 载入JS
  - Integration Testing 集成测试
  - ...

## Contributors 贡献者
- [Koike Takayuki](https://github.com/koiketakayuki) 翻译的日文版 [Japanese](https://micro-frontends-japanese.org/).
- [Jorge Beltrán](https://github.com/scipion) 翻译的西班牙语版 [Spanish](https://micro-frontends-es.org).
- [Bruno Carneiro](https://github.com/Tautorn) 翻译的葡萄牙语版 [Portuguese](https://tautorn.github.io/micro-frontends/).

This site is generated by Github Pages. Its source can be found at [neuland/micro-frontends](https://github.com/neuland/micro-frontends/).
