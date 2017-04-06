**This site is a work in progress and will be extended on a regular basis. Please watch the repository to recieve change notifications.**

# Micro Frontends

This repository ~~contains~~ <u>will contain</u> techniques, strategies and recipes for __building a modern web app with multiple independent teams__.

## What are Micro Frontends?

The term __Micro Frontends__ first came up in [ThoughtWorks Technology Radar](https://www.thoughtworks.com/radar/techniques/micro-frontends) at end of 2016. It extends the concepts of micro services to the frontend. The current trend is to build a feature-rich and powerful browser application, aka single page app, that sits ontop of a micro service architecture. Over time the frontend layer, often developed by a seperate team, grows and gets harder to maintain. That's what we call a [Frontend Monolith](https://www.youtube.com/watch?v=pU1gXA0rfwc).

The idea behind Micro Frontends is to think about your __UI as a composition of components__ that maintained by __independent teams__. This teams are cross functional and develops features __end-to-end__, from database to user interface.

Before the term existed we were calling this composition technique [Frontend Integration for Verticalized Systems](https://dev.otto.de/2014/07/29/scaling-with-microservices-and-vertical-decomposition/) or [Self contained Systems](https://www.innoq.com/de/podcast/025-scs-frontend-integration/). But Micro Frontends is clearly a more friendly and less bulky term.

## What's a modern web app?

In the introduction I've used the phrase "building a modern web app". Let's define the assumptions that are connected with this term.

To put this into a broader perspective, [Aral Balkan](https://ar.al/) has written a blog post about what he calls the [Documents‐to‐Applications Continuum](https://ar.al/notes/the-documents-to-applications-continuum/). He comes up with the conecpt of a sliding scale where a site, built out of __static documents__, connected via links is __on the left__ end and a pure behaviour driven, __contentless applications__ like an online photo editor is __on the right__. 

If you would position your project on the __left side of this spectrum__, an __integration on webserver level__ is a good fit. With this model a server collects and __concatenates HTML strings__ from all components that makup the page requested by the user. Updates are done by reloading the page from the server or replacing parts of it via ajax. [Gustaf Nilsson Kotte](https://twitter.com/gustaf_nk/) has written a [comprehensive article](https://gustafnk.github.io/microservice-websites/) on this topic.

When your user interface has to provide __instant feedback__, even on unreliable connections, a pure server rendered site is not sufficient any more. To implement techniques like [Optimistic UI](https://www.smashingmagazine.com/2016/11/true-lies-of-optimistic-user-interfaces/) or [Skeleton Screens](http://www.lukew.com/ff/entry.asp?1797) you need to be able to also __update__ your UI __on the device itself__. Google's term [Progressive Web Apps](https://developers.google.com/web/progressive-web-apps/) describes the __balancing act__ of being a good citican of the web (progressive enhancment) while also providing app-like performance quite good. These kind of applications are located somewhere __around the middle of the site-app-continuum__. Here a solely server based solution is not sufficient anymore. We have to move the __integration into the browser__.

## The DOM is the API

[Custom Elements](https://developers.google.com/web/fundamentals/getting-started/primers/customelements), the interoperability aspect from the Web Components Spec, are a good primitive for integration in the browser. Each team builds their component using their web technology of choice and wraps it inside a Custom Element (e.g. `<order-minicart></order-minicart>`). The DOM specification of this particular element (tag-name, attributes & events) acts as the contract for other teams. The advantage is that they can use the component and its functionality without having to know the implementation.

But Custom Elements alone are not the solution to all our needs. To address progressive enhancment, universal rendering or routing we need additional pieces of software.

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
