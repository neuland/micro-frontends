Tecniche, strategie e ricette per sviluppare un'__applicazione web moderna__ con __team diversi che possano __rilasciare funzionalità in maniera indipendente__.

## Cosa sono i Micro Frontend?

Il temine __Micro Frontends__ è apparso per la prima volta su [ThoughtWorks Technology Radar](https://www.thoughtworks.com/radar/techniques/micro-frontends) alla fine del 2016. Estende i concetti di microservizi al mondo del frontend. Il trend, adesso, è di costruire un'applicazione browser potente e ricca di funzionalità - nota come single page application - in cima a un'architettura a microservizi. Con il tempo, lo strato di frontend, sviluppato spesso da un team separato, cresce e diventa difficile da manutenere. Questo lo chiamiamo [Frontend a Monolite](https://www.youtube.com/watch?v=pU1gXA0rfwc).

L'idea dietro i Micro Frontend è - invece - di pensare al sito web o alla web app come una __composizione di funzionalità__ facenti capo a __team indipendenti__. Ogni team ha una __area di business, o missione, diversa__, di cui si prende cura e in cui si specializza. Un team è __cross funzionale__ e sviluppa le sue funzionalità __end-to-end__, dal database all'interfaccia utente.

Comunque, quest'idea non è nuova. Ha molto in comune con il concetto di [Sistemi auto-contenuti](http://scs-architecture.org/).
In passato, approcci simili a questo venivano chiamati [Integrazione del Frontend per Sistemi Verticalizzati](https://dev.otto.de/2014/07/29/scaling-with-microservices-and-vertical-decomposition/). Ma, chiaramente, Micro Frontends è un termine più comodo e snello.

__Frontend monolitici__
<img alt="Monolithic Frontends" src="./ressources/diagrams/organisational/monolith-frontback-microservices.png" loading="lazy" />

__Organizzazione in verticali__
<img alt="End-To-End Teams with Micro Frontends" src="./ressources/diagrams/organisational/verticals-headline.png" loading="lazy" />

##Cos'è un'applicazione web moderna?

Nell'introduzione ho usato la frase "costruire un'applicazione web moderna". Definiamo le assunzioni collegate a questa definizione.

Per metterla in una prospettiva più ampia, [Aral Balkan](https://ar.al/) ha scritto un articolo su quello che chiama il [Continuum documenti-applicazioni](https://ar.al/notes/the-documents-to-applications-continuum/). Espone il concetto di bilancia scorrevole, alla cui sinistra c'è un sito, costruito da __documenti statici__, connessi via link, mentre alla destra c'è un'__applicazione senza contenuti__, guidata puramente da comportamenti (behaviour driven), come un editor di foto.

Se il tuo progetto si posiziona alla __sinistra dello spettro__, è più adatta un'__integrazione a livello di webserver__. In questo modello, un server raccoglie e concatena __stringhe HTML__ da tutti i componenti che costituiscono la pagina richiesta dall'utente. Gli update sono fatti ricaricando la pagina dal server o sostituendone parti con Ajax. [Gustaf Nilsson Kotte](https://twitter.com/gustaf_nk/) ha scritto un [articolo esaustivo](https://gustafnk.github.io/microservice-websites/) su quest'argomento.

Quando la tua interfaccia utente deve mostrare un __feedback immediato__, anche in caso di cattiva connessione, non basta più un sito costruito interamente sul server. Per implementare tecniche come [UI ottimistica](https://www.smashingmagazine.com/2016/11/true-lies-of-optimistic-user-interfaces/) o [Skeleton Screens](http://www.lukew.com/ff/entry.asp?1797) devi poter __aggiornare__ la UI __sul device stesso__. Il termine di Google [Progressive Web Apps](https://developers.google.com/web/progressive-web-apps/) descrive giustamente l'__atto di bilanciamento__ di essere un bravo cittadino del web (progressive enhancement) fornendo allo stesso momento performance simili a quelle di un'app. Questo tipo d'applicazione si pone __più o meno in mezzo al continuum sito-app__. Qui non basta più una soluzione basata solo sul server. Dobbiamo spostare l'__integrazione nel browser__, e questo è il focus di quest'articolo.

## Idee fondamentali alla base dei Micro Frontend

* __Sii Agnostico sulla Tecnologia__<br>Ogni team dovrebbe poter scegliere e upgradare il suo stack senza doversi coordinare con altri team. I [Custom Elements](#the-dom-is-the-api) sono un modo ottimo per nascondere i dettagli implementativi dando al contempo agli altri un'interfaccia neutrale.
* __Isola il Codice del Team__<br>Non condividere il runtime, anche se tutti i team condividono lo stesso framework. Costruisci applicazioni indipendenti e auto-contenute. Non fare affidamento su uno stato condiviso o variabili globali.
* __Stabilisci Prefissi per i Team__<br>Condividi una naming convention dove non sia ancora possibile l'isolamento. Dai un namespace a CSS, Eventi, Local Storage e Cookies per evitare collisioni e per chiarire chi è l'owner.
* __Privilegia le Feature Native del Browser rispetto alle API Custom__ Usa [Gli Eventi del Browser per la comunicazione](#parent-child-communication--dom-modification) invece di costruire un sistema globale PubSub. Se proprio devi creare un'API cross-team, cerca di tenerla la più semplice possibile.
* __Costruisci un Sito Resiliente__<br>Le feature dovrebbero rimanere utili anche se JavaScript fallisce o non è ancora stato eseguito. Usa lo [Universal Rendering](#serverside-rendering--universal-rendering) e l'Enhancement Progressivo per migliorare le performance percepite.
---

## Il DOM è l'API 

I [Custom Elements](https://developers.google.com/web/fundamentals/getting-started/primers/customelements), l'aspetto d'interoperabilità delle Specifiche Web Components, sono una buona primitiva per l'integrazione nel browser. Ogni team costruisce il suo componente __usando la tecnologia che sceglie__ e __la wrappa in un Custom Element__ (esempio: `<order-minicart></order-minicart>`). La specifica DOM di questo particolare elemento (tag-name, attributi ed eventi) fa da contratto o API pubblica per gli altri team. Il vantaggio è che possono usare il componente e le sue funzionalità senza conoscere l'implementazione. Devono solo interagire col DOM.

Ma i Custom Element da soli non sono la soluzione a tutti i nostri problemi. Per indirizzare l'enhancement progressivo, il rendering universali o il routing abbiamo bisogno di software aggiuntivo.

Questa pagina è divisa in due aree principali. Prima dobbiamo discutere della [Page Composition](#page-composition) - come assemblare una pagina da più componenti fatti da team diversi. Dopo, mostreremo esempi per implementare le [Transizioni di Pagina](#page-transition) lato client.


## Composizione della Pagina

Oltre proprio all'integrazione del codice lato __client__ e __server__ scritto con __framework diversi__, ci sono un sacco di argomenti a lato da discutere: i meccanismi per __isolare il javascript__, __evitare i conflitti css__, __caricare le risorse__ quando serve, __condividere le risorse comuni__ fra i team, gestire __il fetch dei dati__ e pensare a una giusta __gestione degli stati__ per l'utente. Affronteremo questi argomenti un passo alla volta.

### Il Prototipo Base

La pagina prodotto di questo negozio di modelli di trattori ci servirà come base degli esempi seguenti.

Presenta un __selettore delle varianti__ per scegliere fra i tre diversi modelli di trattore. Quando il selettore cambia, si aggiornano l'immagine, il nome, il prezzo e le raccomandazioni del prodotto. C'è pure un __pulsante d'acquisto__, che aggiunge la variante selezionata al cestino e un __mini carrello__ in cima alla pagina, che si aggiorna di conseguenza.

[![Esempio 1 - Pagina Prodotto - JS Puro](./ressources/video/model-store-0.gif)](./0-model-store/)

[provalo nel browser](./0-model-store/) & [mostra il codice](https://github.com/neuland/micro-frontends/tree/master/0-model-store)

Tutto l'HTML è generato usando __JavaScript puro__ e stringhe template ES6 senza __nessuna dipendenza__. Il codice usa una semplice separazione stato/markup e ri-renderizza tutto l'HTML lato client a ogni cambiamento - non c'è nessun DOM diffing strano e nessun __rendering universale__ per ora. Inoltre, non c'è __separazione fra team__. - [il codice](https://github.com/neuland/micro-frontends/tree/master/0-model-store) è scritto in un file js/css.

### Integrazione lato Client


In quest'esempio, la pagina è divisa in componenti/frammenti separati, gestiti da tre team. __Team Checkout__ (blu) è adesso responsabile di tutto quello che riguarda il processo d'acquisto - nello specifico, il __pulsante d'acquisto__ e il __mini carrello__. Il __Team Inspire__ (verde) gestisce i __prodotti raccomandati__ su questa pagina. La pagina stessa è gestita dal __Team Product__ (rosso).

[![Esempio 1 - Pagina Prodotto - Composizione](./ressources/screen/three-teams.png)](./1-composition-client-only/)

[prova nel browser](./1-composition-client-only/) & [mostra il codice](https://github.com/neuland/micro-frontends/tree/master/1-composition-client-only)

Ciascun team

Il __Team Product__ decide che funzionalità è inclusa e dove deve essere posizionata nel layout. La pagina contiene informazioni che possono essere fornite dallo stesso Team Product, come il nome del prodotto, l'immagine e le varianti disponibili. La pagina include anche frammenti (elementi custom) dagli altri team.

### Come creare un Elemento Custom?

Prendiamo per esempio il __pulsante d'acquisto__. Il Team Product include il pulsante aggiungendo semplicemente `<blue-buy sku="t_porsche"></blue-buy>` alla posizione desiderata nel markup. Per farlo funzionare, il Team Checkout deve registrare l'elemento `blue-buy` sulla pagina.

    class BlueBuy extends HTMLElement {
      connectedCallback() {
        this.innerHTML = `<button type="button">buy for 66,00 €</button>`;
      }

      disconnectedCallback() { ... }
    }
    window.customElements.define('blue-buy', BlueBuy);

Adesso, ogni volta che il browser trova un nuovo tag `blue-buy`, viene chiamata la `connectedCallback`. `this` è un riferimento al nodo DOM root dell'elemento custom. Si possono usare tutte le proprietà e i metodi di un elemento DOM standard, come `innerHTML` or `getAttribute()`.

<img alt="Custom Element in Action" src="./ressources/video/custom-element.gif" loading="lazy" />

Quando dai un nome all'elemento, l'unico requisito definito dalla specifica è che il nome deve __includere un trattino (-)__ per mantenere la compatiblità con i futuri tag HTML. Nei prossimi esempi, useremo la convenzione `[team_color]-[feature]`. Il namespace del team ci protegge da collisioni e, in questo modo, diventa ovvio chi detiene una feature, guardando semplicemente il DOM.

### Comunicazione Padre-Figlio / Modifica del DOM


When the user selects another tractor in the __variant selector__, the __buy button has to be updated__ accordingly. To achieve this Team Product can simply __remove__ the existing element from the DOM __and insert__ a new one.

    container.innerHTML;
    // => <blue-buy sku="t_porsche">...</blue-buy>
    container.innerHTML = '<blue-buy sku="t_fendt"></blue-buy>';

The `disconnectedCallback` of the old element gets invoked synchronously to provide the element with the chance to clean up things like event listeners. After that the `connectedCallback` of the newly created `t_fendt` element is called.

Another more performant option is to just update the `sku` attribute on the existing element.

    document.querySelector('blue-buy').setAttribute('sku', 't_fendt');

If Team Product used a templating engine that features DOM diffing, like React, this would be done by the algorithm automatically.

<img alt="Custom Element Attribute Change" src="./ressources/video/custom-element-attribute.gif" loading="lazy" />

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

### Avoid Framework Anarchy

Using Custom Elements is a great way to achieve a high amount of decoupling between the fragments of the individual teams. This way, each team is free to pick the frontend framework of their choice. But just because you can does not mean that it's a wise idea to mix different technologies. Try to avoid [Micro Frontends Anarchy](https://www.thoughtworks.com/radar/techniques/micro-frontend-anarchy) and create a reasonable level of alignment between the various teams. This way, teams can share learning and best practices with each other. It will also make your life easier when you want to establish a central pattern library.
That said, the capability of mixing technologies can be handy when you're working with a legacy application and want to migrate to a new tech stack.

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

<img alt="Reflow" src="./ressources/video/data-fetching-reflow.gif" style="width: 500px" loading="lazy" />

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

<img alt="Skeleton Screen" src="./ressources/video/data-fetching-skeleton.gif" style="width: 500px" loading="lazy" />

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
- [Soobin Bak](https://github.com/soobing) who translated the site to [Korean](https://soobing.github.io/micro-frontends/).
- [Sergei Babin](https://github.com/serzn1) who translated the site to [Russian](https://serzn1.github.io/micro-frontends/).
- [Shiwei Yang](https://github.com/swearer23) who translated the site to [Chinese](https://swearer23.github.io/micro-frontends/).

This site is generated by Github Pages. Its source can be found at [neuland/micro-frontends](https://github.com/neuland/micro-frontends/).
