**This site is a work in progress and will be extended on a regular basis. Please watch the repository to recieve change notifications.**

# Micro Frontends

This repository ~~contains~~ <u>will contain</u> techniques, strategies and recipes for building a website with multiple independent teams.

## What are Micro Frontends?

The term __Micro Frontends__ first came up in [ThoughtWorks Technology Radar](https://www.thoughtworks.com/radar/techniques/micro-frontends) at end of 2016. It extends the concepts of micro services to the frontend. The current trend is to build a feature-rich and powerful browser application, aka single page app, that sits ontop of a micro service architecture. Over time the frontend layer, often developed by a seperate team, grows and gets harder to maintain. That's what we call a [Frontend Monolith](https://www.youtube.com/watch?v=pU1gXA0rfwc).

The idea behind Micro Frontends is to think about your UI as a composition of components that are developed by independent teams. This teams are cross functional and develops features end-to-end, from database to user interface.

Before the term existed we were calling this composition technique [Frontend Integration for Verticalized Systems](https://dev.otto.de/2014/07/29/scaling-with-microservices-and-vertical-decomposition/), [Self contained Systems](https://www.innoq.com/de/podcast/025-scs-frontend-integration/) or [Micro­service Websites](https://gustafnk.github.io/microservice-websites/). But Micro Frontends is clearly a more friendly and less bulky term.

## The DOM is the API

[Custom Elements](https://developers.google.com/web/fundamentals/getting-started/primers/customelements), the interoperability aspect from the Web Components Spec, are a good primitive for integration in the browser. Each team builds their component using their web technology of choice and wraps it inside a Custom Element (e.g. `<order-minicart></order-minicart>`). The DOM specification of this particular element (tag-name, attributes & events) acts as the contract for other teams. The advantage is that they can use the component and its functionality without having to know the implementation.

But Custom Elements alone are not the solution to all our needs. To address universal rendering or routing we need additional pieces of software.

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
