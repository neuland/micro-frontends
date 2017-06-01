**This site is a work in progress and will be extended on a regular basis. Please watch the repository to receive change notifications.**

# Micro Frontends

This repository ~~contains~~ <u>will contain</u> techniques, strategies and recipes for __building a modern web app with multiple independent teams__.

## What are Micro Frontends?

The term __Micro Frontends__ first came up in [ThoughtWorks Technology Radar](https://www.thoughtworks.com/radar/techniques/micro-frontends) at the end of 2016. It extends the concepts of micro services to the frontend world. The current trend is to build a feature-rich and powerful browser application, aka single page app, which sits on top of a micro service architecture. Over time the frontend layer, often developed by a separate team, grows and gets more difficult to maintain. That's what we call a [Frontend Monolith](https://www.youtube.com/watch?v=pU1gXA0rfwc).

The idea behind Micro Frontends is to think about your __UI as a composition of components__ which is maintained by __independent teams__. These teams are cross functional and develop features __end-to-end__, from database to user interface.

However, this idea is not new, in the past it went by the name of [Frontend Integration for Verticalised Systems](https://dev.otto.de/2014/07/29/scaling-with-microservices-and-vertical-decomposition/) or [Self contained Systems](https://www.innoq.com/de/podcast/025-scs-frontend-integration/). But Micro Frontends is clearly a more friendly and less bulky term.

__Monolithic Frontends__
![Monolithic Frontends](./ressources/diagrams/organisational/monolith-frontback-microservices.png)


__Organisation in Verticals__
![End-To-End Teams with Micro Frontends](./ressources/diagrams/organisational/verticals-headline.png)

## What's a modern web app?

In the introduction I've used the phrase "building a modern web app". Let's define the assumptions that are connected with this term.

To put this into a broader perspective, [Aral Balkan](https://ar.al/) has written a blog post about what he calls the [Documents‐to‐Applications Continuum](https://ar.al/notes/the-documents-to-applications-continuum/). He comes up with the concept of a sliding scale where a site, built out of __static documents__, connected via links is __on the left__ end and a pure behaviour driven, __contentless applications__ like an online photo editor is __on the right__.

If you would position your project on the __left side of this spectrum__, an __integration on webserver level__ is a good fit. With this model a server collects and __concatenates HTML strings__ from all components that make up the page requested by the user. Updates are done by reloading the page from the server or replacing parts of it via ajax. [Gustaf Nilsson Kotte](https://twitter.com/gustaf_nk/) has written a [comprehensive article](https://gustafnk.github.io/microservice-websites/) on this topic.

When your user interface has to provide __instant feedback__, even on unreliable connections, a pure server rendered site is not sufficient anymore. To implement techniques like [Optimistic UI](https://www.smashingmagazine.com/2016/11/true-lies-of-optimistic-user-interfaces/) or [Skeleton Screens](http://www.lukew.com/ff/entry.asp?1797) you need to be able to also __update__ your UI __on the device itself__. Google's term [Progressive Web Apps](https://developers.google.com/web/progressive-web-apps/) aptly describes the __balancing act__ of being a good citizen of the web (progressive enhancement) while also providing app-like performance. This kind of application is located somewhere __around the middle of the site-app-continuum__. Here a solely server based solution is not sufficient anymore. We have to move the __integration into the browser__ and this is the focus of this article.

## The DOM is the API

[Custom Elements](https://developers.google.com/web/fundamentals/getting-started/primers/customelements), the interoperability aspect from the Web Components Spec, are a good primitive for integration in the browser. Each team builds their component __using their web technology of choice__ and __wraps it inside a Custom Element__ (e.g. `<order-minicart></order-minicart>`). The DOM specification of this particular element (tag-name, attributes & events) acts as the contract for other teams. The advantage is that they can use the component and its functionality without having to know the implementation.

But Custom Elements alone are not the solution to all our needs. To address progressive enhancement, universal rendering or routing we need additional pieces of software.

This page is divided into two main areas. First we will discuss [Page Composition](#page-composition) - how to assemble a page out of components owned by different teams. After that we'll show examples for implementing clientside [Page Transition](#page-transition).

## Page Composition

Beside the __client-__ and __serverside__ integration of code written in __different frameworks__ itself, there are a lot of side topics that should be discussed. Mechanisms to __isolate js__, __avoid css conflicts__, __load resources__ as needed, __share common resources__ between teams, handle __data fetching__ and think about good __loading states__ for the user. We'll go into these topics one step at a time.

### The Base Prototype

This product page of the imaginative model store will serve as the basis for the following examples.

It features a __variant selector__ to switch between the three different tractor models. On change product image, name, price and recommendations are updated. There is also a __buy button__, which adds the selected variant to the basket and a __mini basket__ at the top that updates accordingly.

[![Example 0 - Product Page - Plain JS](./ressources/video/model-store-0.gif)](./0-model-store/)

[try in browser](./0-model-store/) & [inspect the code](https://github.com/neuland/micro-frontends/tree/master/0-model-store)

All HTML is generated client side using __plain JavaScript__ and ES6 Template Strings with __no dependencies__. The code uses a simple state/markup separation and rerenders the entire HTML client side on every change - no fancy DOM diffing and __no universal rendering__ for now. Also __no team separation__ - [the code](https://github.com/neuland/micro-frontends/tree/master/0-model-store) is written in one js/css file.

### Clientside Integration

In this example, we've introduced two new teams. __Team Checkout__ (blue) is now responsible for everything regrading the purchasing process - namely the __buy button__ and __mini basket__. __Team Inspire__ (green) manages the __product recommendations__ on this page. The page itself is owned by __Team Product__ (red).

[![Example 1 - Product Page - Composition](./ressources/screen/three-teams.png)](./1-composition-client-only/)

[try in browser](./1-composition-client-only/) & [inspect the code](https://github.com/neuland/micro-frontends/tree/master/1-composition-client-only)

This team decides what functionality is included and where it is positioned in the layout. The page contains information that can be provided by Team Product itself, like the product name, image and the available variants. But it also includes fragments (Custom Elements) from the other teams.

### How to create a Custom Elemente?

Lets take the __buy button__ as an example. Team Product includes the button simply adding `<blue-buy sku="t_porsche"></blue-buy>` to the desired position in the markup. For this to work, Team Checkout has the register the element `blue-buy` on the page.

    class BlueBuy extends HTMLElement {
      constructor() {
        super();
        this.innerHTML = `<button type="button">buy for 66,00 €</button>`;
      }
      disconnectedCallback() { ... }
    }
    window.customElements.define('blue-buy', BlueBuy);

Now every time the browse comes across a new `blue-buy` tag the constructor is called. `this` is the reference to the root DOM node of the custom element. All properties and methods of a standard DOM element like `innerHTML` or `getAttribut()` can be used.

![Custom Element in Action](./ressources/video/custom-element.gif)

When naming your element the only requirement the spec defines, is that your name must __include a dash (-)__ to maintain compatibility with upcoming new HTML tags. In the examples we are using the naming convention `[team_color]-[feature]`. The team namespace guards against collisions and this way the ownership of a features becomes obvious, simply by looking at the DOM.

### Choose another Tractor / Parent Child Communication

When the user selects another tractor in the __variant selector__, the __buy button has to be updated__ accordingly. To archive this Team Product can simply __remove__ the existing element from the DOM __and insert__ a new one.

    container.innerHTML;
    // => <blue-buy sku="t_porsche">...</blue-buy>
    container.innerHTML = '<blue-buy sku="t_fendt"></blue-buy>';

 The `disconnectedCallback` of the old element gets invoked synchronously to provide the element with the chance to clean up things like event listeners. After that the `constructor` of the newly created fendt element is called.

Another more performant option is to just update the `sku`-Attribute on the existing element.

    document.querySelector('blue-buy').setAttribute('sku', 't_fendt');

When Team Product would use a templating engine that features DOM diffing like React, this would be done by the algorithm automatically.

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
      constructor() {
        super();
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

Do avoid duplication we've introduced a `render()` method that is called from `constructor` and `attributeChangedCallback`. This is a method that collects needed data and innerHTML's the new markup. When you decide to go with a more sophisticated templating engine or framework inside the Custom Element, this is the place where its initialisation code would go.

### Browser Support

### Child Parent Communication

### Siblings Communication

###

tba

...

## Page Transition

tba

## Additional Resources
[Slides: Micro Frontends by Michael Geers | JSUnconf.eu 2017](https://speakerdeck.com/naltatis/micro-frontends-building-a-modern-webapp-with-multiple-teams)

---

## TODOs

Working code examples will be added here ...

- Use Cases
  - Composing a page
    - client only
    - universal render
  - Communication
    - parent-child
    - child-parent
    - siblings
  - Navigating between pages
    - soft vs. hard navigation
    - universal router
  - ...
- Side Topics
  - Coherent User Interface / Style Guides & Pattern Libraries
  - Progressive Enhancement
  - Performance on initial load
  - Performance while using the site
  - Loading CSS
  - Loading JS
  - ...
