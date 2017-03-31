**This site is a work in progress and will be extended on a regular basis. Please watch the repository to recieve change notifications.**

# Micro Frontends

This repository ~~contains~~ <u>will contain</u> techniques, strategies and recipes for building a website with multiple indepentent teams.

## What are Micro Frontends?

The term __Micro Frontends__ first came up in [ThoughtWorks Technology Radar](https://www.thoughtworks.com/radar/techniques/micro-frontends) end of 2016. It brings the concepts of micro services to the frontend. The current trend is to build feature rich and powerful browser applications, aka single page apps, which over time become more and more complex and harder to maintain.

The idea behind Micro Frontends is to think about your user interface as a composition of components that are developed by independent teams.

Before the term existed we were calling this technique [Frontend Integration for Verticalized / ](https://dev.otto.de/2014/07/29/scaling-with-microservices-and-vertical-decomposition/)[Self contained Systems](https://www.innoq.com/de/podcast/025-scs-frontend-integration/) or [Micro­service Websites](https://gustafnk.github.io/microservice-websites/). But Micro Frontends is clearly a more friendly and less bulky term.

## The DOM is the API

[Custom Elements](https://developers.google.com/web/fundamentals/getting-started/primers/customelements), the interoperability aspect from the Web Components Spec, are a good primitive for integration in the browser. Each team builds their component using their web technology of choice and wraps it inside a Custom Element (e.g. `<order-minicart></order-minicart>`). The DOM specification of this particular element (tag-name, attributes & events) acts as the contract for other teams to use the component and its functionality without having to know the implementation.

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
