Tecniche, strategie e ricette per sviluppare un'__applicazione web moderna__ con contributo di __team diversificati__ che possano __rilasciare funzionalità in maniera indipendente__.

## Cosa sono i Micro Frontend?

Il temine __Micro Frontend__ è apparso per la prima volta su [ThoughtWorks Technology Radar](https://www.thoughtworks.com/radar/techniques/micro-frontends) alla fine del 2016. Estende al mondo del frontend i concetti dei microservizi. Il trend corrente era di costruire applicazioni browser potenti e ricche di funzionalità - note come single page application - messe sopra ad architetture a microservizi. Con il tempo, questo strato di frontend, sviluppato il più delle volte da un team a sé stante, cresce e diventa difficile da manutenere. Questo lo chiamiamo [Frontend Monolitico](https://www.youtube.com/watch?v=pU1gXA0rfwc).

L'idea alla base dei Micro Frontend è - invece - di pensare al sito web o alla web app come a una __composizione di funzionalità__ che fanno capo a __team indipendenti__. Ogni team ha una sua __area di business, o missione, diversa__, di cui si prende cura e in cui si specializza. Ogni team è __cross funzionale__ e sviluppa le sue funzionalità __end-to-end__, dal database all'interfaccia utente.

C'è da dire che quest'idea non è nuova. Ha molti punti in comune con il concetto di [Sistemi auto-contenuti](http://scs-architecture.org/).
In passato, approcci simili venivano chiamati [Integrazione del Frontend per Sistemi Verticalizzati](https://dev.otto.de/2014/07/29/scaling-with-microservices-and-vertical-decomposition/). Ma, chiaramente, Micro Frontends è un termine più comodo e meno corposo.

__Frontend Monolitici__
<img alt="Frontend Monolitici" src="./ressources/diagrams/organisational/monolith-frontback-microservices.png" loading="lazy" />

__Organizzazione in verticali__
<img alt="Team End to End con Micro Frontends" src="./ressources/diagrams/organisational/verticals-headline.png" loading="lazy" />

## Cos'è un'applicazione web moderna?

Nell'introduzione, ho usato l'espressione "costruire un'applicazione web moderna". Definiamo le assunzioni collegate a questa definizione.

Più in generale, [Aral Balkan](https://ar.al/) ha scritto un articolo su quello che chiama il [Continuum documenti-applicazioni](https://ar.al/notes/the-documents-to-applications-continuum/). Si è inventato l'idea di una bilancia scorrevole, alla cui sinistra c'è un sito costruito da __documenti statici__, connessi via link, mentre alla destra c'è un'__applicazione senza contenuti__, guidata puramente da comportamenti (behaviour driven), come un editor di foto.

Se il tuo progetto si posiziona alla __sinistra dello spettro__, è adatta un'__integrazione a livello di webserver__. In tale modello, un server raccoglie e concatena __stringhe HTML__ provenienti da tutti i componenti che costituiscono la pagina richiesta dall'utente. Gli aggiornamenti sono fatti ricaricando la pagina dal server o sostituendone alcune parti con Ajax. [Gustaf Nilsson Kotte](https://twitter.com/gustaf_nk/) ha scritto un [articolo esaustivo](https://gustafnk.github.io/microservice-websites/) su quest'argomento.

Quando la tua interfaccia utente deve mostrare un __feedback immediato__, anche in caso di cattiva connessione, non basta più un sito costruito interamente sul server. Per implementare tecniche come [UI ottimistica](https://www.smashingmagazine.com/2016/11/true-lies-of-optimistic-user-interfaces/) o [Skeleton Screens](http://www.lukew.com/ff/entry.asp?1797) devi poter __aggiornare__ la UI __sul device stesso__. La definizione di Google [Progressive Web Apps](https://developers.google.com/web/progressive-web-apps/) descrive abilmente l'__atto di bilanciamento__ insito nell'essere un bravo cittadino del web (enhancement progressivo), garantendo nello stesso tempo performance simili a quelle di un'app. Questo tipo d'applicazione si pone __più o meno a metà del continuum sito-app__. Qui non basta più una soluzione basata solo sul server. Dobbiamo spostare l'__integrazione nel browser__, e questo è il focus di quest'articolo.

## Idee fondamentali alla base dei Micro Frontend

* __Sii Agnostico sulla Tecnologia__<br>Ogni team dovrebbe poter scegliere e aggiornare il suo stack senza doversi coordinare con gli altri team. Gli [Elementi Custom](#the-dom-is-the-api) sono un modo ottimo per nascondere i dettagli implementativi, fornendo al contempo un'interfaccia neutrale agli altri.
* __Isola il Codice del Team__<br>Non condividere il runtime, anche se tutti i team usano lo stesso framework. Costruisci applicazioni indipendenti e auto-contenute. Non fare affidamento sullo stato condiviso o su variabili globali.
* __Stabilisci Prefissi per i Team__<br>Condividi una naming convention laddove non sia ancora possibile l'isolamento. Dai un namespace a CSS, Eventi, Local Storage e Cookies per evitare collisioni e per chiarire chi è l'owner.
* __Privilegia le Funzionalità Native del Browser rispetto alle API Custom__ Usa [Gli Eventi del Browser per la comunicazione](#parent-child-communication--dom-modification) invece di mettere su un sistema globale PubSub. Se proprio devi creare un'API cross-team, cerca di tenerla la più semplice possibile.
* __Costruisci un Sito Resiliente__<br>Le feature del sito dovrebbero rimanere utili anche se JavaScript fallisce o non è ancora stato eseguito. Usa il [Rendering Universale](#serverside-rendering--universal-rendering) e l'Enhancement Progressivo per migliorare le performance percepite.
---

## Il DOM è l'API 

Gli [Elementi Custom](https://developers.google.com/web/fundamentals/getting-started/primers/customelements), che rappresentano l'aspetto d'interoperabilità della specifica Web Components, sono una buona primitiva per realizzare un'integrazione nel browser. Ogni team costruisce il suo componente __usando la tecnologia che preferisce__ e __la wrappa in un Elemento Custom__ (esempio: `<order-minicart></order-minicart>`). La specifica DOM di questo particolare elemento (tag-name, attributi ed eventi) fa da contratto o API pubblica per gli altri team. Il vantaggio è che questi ultimi possono usare il componente e le sue funzionalità senza conoscerne l'implementazione: devono solo interagire col DOM.

Ma gli Elementi Custom, da soli, non sono la soluzione a tutti i nostri problemi. Per indirizzare l'enhancement progressivo, il rendering universale e il routing abbiamo bisogno di software aggiuntivo.

Questa pagina è divisa in due aree principali. Prima dobbiamo discutere della [Composizione della Pagina](#page-composition) - ovvero come assemblare una pagina da più componenti gestiti da team diversi. Dopo, mostreremo esempi per implementare le [Transizioni di Pagina](#page-transition) lato client.


## Composizione della Pagina

Oltre proprio all'integrazione del codice lato __client__ e __server__ scritto con __framework diversi__, ci sono un sacco di argomenti a lato da discutere: i meccanismi per __isolare il javascript__, __evitare i conflitti CSS__, __caricare le risorse__ quando serve, __condividere le risorse comuni__ fra i team, gestire __la richiesta di dati__ e pensare a una giusta __gestione degli stati di caricamento__ per l'utente. Affronteremo questi argomenti un passo alla volta.

### Il Prototipo Base

Useremo come base per gli esempi seguenti la pagina prodotto di un negozio di modellini di trattori.

Espone un __selettore di varianti__ per scegliere fra i tre diversi modellini di trattore. A ogni cambio, si aggiornano l'immagine, il nome, il prezzo e le raccomandazioni del prodotto. C'è anche un __pulsante d'acquisto__, che aggiunge la variante selezionata al cestino, e un __mini carrello__ alla sommità della pagina, che si aggiorna di conseguenza.

[![Esempio 1 - Pagina Prodotto - JS Puro](./ressources/video/model-store-0.gif)](./0-model-store/)

[provalo nel browser](./0-model-store/) & [ispeziona il codice](https://github.com/neuland/micro-frontends/tree/master/0-model-store)

Tutto l'HTML è generato usando __JavaScript puro__ e stringhe template ES6 senza __nessuna dipendenza__. Il codice usa una semplice separazione stato/markup e ri-renderizza tutto l'HTML lato client a ogni cambiamento - non c'è nessun DOM diffing strano e nessun __rendering universale__ per ora. Inoltre, non c'è __separazione fra team__ - [il codice](https://github.com/neuland/micro-frontends/tree/master/0-model-store) è scritto in un file js/css.

### Integrazione lato Client

In quest'esempio, la pagina è divisa in componenti/frammenti separati, gestiti da tre team. __Team Checkout__ (blu) adesso è responsabile di tutto quello che riguarda il processo d'acquisto - nello specifico, il __pulsante d'acquisto__ e il __mini carrello__. Il __Team Inspire__ (verde) gestisce i __prodotti raccomandati__ su questa pagina. La pagina stessa è gestita dal __Team Product__ (rosso).

[![Esempio 1 - Pagina Prodotto - Composizione](./ressources/screen/three-teams.png)](./1-composition-client-only/)

[prova nel browser](./1-composition-client-only/) & [ispeziona il codice](https://github.com/neuland/micro-frontends/tree/master/1-composition-client-only)

Ogni Team

Il __Team Product__ decide che funzionalità dev'essere inclusa e dove deve essere posizionata nel layout. La pagina contiene informazioni che possono essere fornite dallo stesso Team Product, come il nome del prodotto, l'immagine e le varianti disponibili. La pagina include anche frammenti (elementi custom) dagli altri team.

### Come creare un Elemento Custom?

Prendiamo per esempio il __pulsante d'acquisto__. Il Team Product include il pulsante aggiungendo semplicemente `<blue-buy sku="t_porsche"></blue-buy>` alla posizione desiderata del markup. Per farlo funzionare, il Team Checkout deve registrare l'elemento `blue-buy` sulla pagina.

    class BlueBuy extends HTMLElement {
      connectedCallback() {
        this.innerHTML = `<button type="button">acquista a 66,00 €</button>`;
      }

      disconnectedCallback() { ... }
    }
    window.customElements.define('blue-buy', BlueBuy);

Adesso, ogni volta che il browser trova un nuovo tag `blue-buy`, viene chiamata la callback `connectedCallback`. `this` è un riferimento al nodo DOM root dell'elemento custom. Si possono usare tutte le proprietà e i metodi di un elemento DOM standard, come `innerHTML` or `getAttribute()`.

<img alt="Elemento Custom in Azione" src="./ressources/video/custom-element.gif" loading="lazy" />

Quando dai un nome all'elemento, l'unico requisito definito dalla specifica è che il nome deve __includere un trattino (-)__ per mantenere la compatiblità con tag HTML futuri. Nei prossimi esempi, useremo la convenzione `[colore_del_team]-[feature]`. Il namespace del team ci protegge da collisioni e, in aggiunta, così diventa ovvio chi detiene una feature, guardando semplicemente il DOM.

### Comunicazione Padre-Figlio / Modifica del DOM

Se l'utente seleziona un altro trattore nel __selettore di varianti__, dev'essere aggiornato corrispondentemente il __pulsante d'acquisto__. A questo scopo, il Team Prodotto può semplicemente __togliere__ l'elemento esistente dal DOM __e inserirne__ uno nuovo.

    container.innerHTML;
    // => <blue-buy sku="t_porsche">...</blue-buy>
    container.innerHTML = '<blue-buy sku="t_fendt"></blue-buy>';
    
La callback `disconnectedCallback` del vecchio elemento viene invocata in maniera sincrona per dare all'elemento la possibilità di fare pulizia di cose come i listener di eventi. Dopo, viene invocata la callback `connectedCallback` dell'elemento appena creato `t_fendt`.

Un'altra possibilità più performante è di aggiornare solo l'attibuto `sku` dell'elemento esistente:

    document.querySelector('blue-buy').setAttribute('sku', 't_fendt');

Se il Team Product usasse un motore di template che implementa il DOM diffing, come React, questo verrebbe eseguito automaticamente dall'algoritmo.

<img alt="Cambio Attributo Elemento Custom" src="./ressources/video/custom-element-attribute.gif" loading="lazy" />

Per supportare questo comportamento, l'Elemento Custom può implementare la callback `attributeChangedCallback` e specificare una lista di `observedAttributes` per cui dovrebbe essere scatenata questa callback.

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
        this.innerHTML = `<button type="button">acquista for ${price}</button>`;
      }
      attributeChangedCallback(attr, oldValue, newValue) {
        this.render();
      }
      disconnectedCallback() {...}
    }
    window.customElements.define('blue-buy', BlueBuy);

Per evitare duplicazioni, introduciamo un metodo `render()` che viene chiamato da `connectedCallback` e `attributeChangedCallback`. Questo metodo raccoglie i dati necessari e il nuovo markup è in innerHTML. Quando si decide di usare un motore o framework di template più sofisticato nell'Elemento Custom, questo è il posto dove dovrebbe andare il suo codice d'inizializzazione.

### Supporto dei Browser

L'esempio precedente usa la specifica versione 1 degli Elementi Custom, che al momento è [supportata da Chrome, Safari e Opera](http://caniuse.com/#feat=custom-elementsv1). Però, con il progetto [document-register-element](https://github.com/WebReflection/document-register-element) è stato reso disponibile un polyfill rodato e leggero per far funzionare tutto questo in tutti i browser. Sotto il cofano, usa un'API [ampiamente supportata](http://caniuse.com/#feat=mutationobserver), la Mutation Observer, dunque non ci sono controlli strani in background dell'albero DOM.

### Compatibilità Framework

Siccome gli Elementi Custom sono uno standard web, li supportano tutti i principali framework JavaScript, come Angular, React, Preact, Vue o Hyperapp. Però, quando entri nei dettagli, alcuni di questi framework hanno ancora qualche problemino implementativo. Su [Custom Elements Everywhere](https://custom-elements-everywhere.com/), [Rob Dodson](https://twitter.com/rob_dodson) ha messo in piedi una suite di test che mette in evidenza i problemi irrisolti.

### Evitiama l'Anarchia dei Framework

Usare gli Elementi Custom è un ottimo modo per raggiungere un alto grado di disaccoppiamento fra i frammenti dei diversi team. In questo modo, ogni team è libero di scegliere un framework di frontend. Però, solo perché puoi farlo non significa che sia saggio mixare tecnologie differenti. Proviamo ad evitare l'[Anarchia dei Micro Frontend](https://www.thoughtworks.com/radar/techniques/micro-frontend-anarchy) e a creare invece un livello di allineamento ragionevole fra i vari team. Così, i team possono scambiarsi insegnamenti e best practice. Ci renderà poi la vita più facile se vogliamo stabilire una pattern library centralizzata.
Detto ciò, la possibilità di mixare le tecnologie può essere utile quando lavori con un'applicazione legacy e vuoi migrarla a uno stack tecnologico nuovo.

### Comunicazione fra Figlio-Genitore o fra Fratelli / Eventi DOM

Ma passare gli attributi non è sufficiente per tutte le interazioni. Nel nostro esempio, il __mini carrello dovrebbe aggiornari__ quando l'utente __clicca sul pulsante d'acquisto__.

Entrambi i frammenti sono di proprietà del Team Checkout (blu), quindi loro potrebbero creare una qualche API JavaScript interna che permettesse al mini carrello di sapere quando è stato premuto un pulsante. Ma questo significherebbe che le istanze dei componenti dovrebbero conoscersi a vicenda e questa sarebbe pure una violazione dell'isolamento.

Un modo più pulito è di usare un meccanismo PubSub, in cui un componente può pubblicare un messaggio e altri componenti possono sottoscriversi a certi topic. Per fortuna, i browser hanno nativamente questa funzionalità. Questo è esattamente come funzionano eventi del browser tipo `click`, `select` o `mouseover`. In aggiunta agli eventi nativi, c'è anche la possibilità di creare eventi di livello superiore con `new CustomEvent(...)`. Gli eventi sono sempre legati al nodo DOM su cui sono stati creati o dispacciati. La maggior parte degli eventi nativi supporta anche il bubbling. Questo rende possibile ascoltare tutti gli eventi su un sotto-albero specifico del DOM. Se vuoi ascoltare tutti gli eventi della pagina, attacca l'event listener all'elemento window. Ecco come appare la creazione dell'evento `blue:basket:changed` nell'esempio:

    class BlueBuy extends HTMLElement {
      [...]
      connectedCallback() {
        [...]
        this.render();
        this.firstChild.addEventListener('click', this.addToCart);
      }
      addToCart() {
        // magari qui chiama un'API
        this.dispatchEvent(new CustomEvent('blue:basket:changed', {
          bubbles: true,
        }));
      }
      render() {
        this.innerHTML = `<button type="button">acquista</button>`;
      }
      disconnectedCallback() {
        this.firstChild.removeEventListener('click', this.addToCart);
      }
    }

Il mini carrello può adesso sottoscriversi a quest'evento su `window` ed essere avvisato quando dovrebbe aggiornare i suoi dati.

    class BlueBasket extends HTMLElement {
      connectedCallback() {
        [...]
        window.addEventListener('blue:basket:changed', this.refresh);
      }
      refresh() {
        // leggi dati nuovi e renderizzali
      }
      disconnectedCallback() {
        window.removeEventListener('blue:basket:changed', this.refresh);
      }
    }

Con quest'approccio, il frammento del mini carrello aggiunge un listener a un elemento del DOM che è fuori dal suo scope (`window`). Questo dovrebbe essere OK in molte applicazioni ma, se proprio non piace, si può anche implementare un approccio in cui la pagina stessa (Team Product) ascolta un evento e notifica il mini carrello chiamando `refresh()` sull'elemento del DOM.

    // page.js
    const $ = document.getElementsByTagName;

    $('blue-buy')[0].addEventListener('blue:basket:changed', function() {
      $('blue-basket')[0].refresh();
    });

Non è comune chiamare imperativamente metodi del DOM, ma si può trovare un esempio nella [video element api](https://developer.mozilla.org/de/docs/Web/HTML/Using_HTML5_audio_and_video#Controlling_media_playback). Se possible, dovrebbe essere preferito l'uso dell'approccio dichiarativo (cambio dell'attributo).

## Rendering lato Server / Rendering Universale

Gli Elementi Custom vanno benissimo per integrare componenti nel browser. Però, quando costruisci un sito che è accessibile dal web, è probabile che siano importanti pure le performance di caricamento iniziale e gli utenti vedranno lo schermo bianco finché non vengono scaricati ed eseguiti tutti i framework JavaScript. In aggiunta, è utile capire cosa succede quando il JavaScript fallisce o è bloccato. [Jeremy Keith](https://adactio.com/) ne spiega l'importanza nel suo eBook / podcast [Resilient Web Design](https://resilientwebdesign.com/). Dunque, la capacità di renderizzare i contentuti core sul server è chiave. Purtroppo, la specifica sui web component non parla proprio di rendering lato server. Niente JavaScript, niente Elementi Custom :(

### Elementi Custom + Server Side Includes = ❤️

Per far funzionare il rendering lato server, bisogna fare refactoring dell'esempio precedente. Ogni team ha il proprio server Express ed è accessible via web anche il metodo `render()` dell'Elemento Custom.

    $ curl http://127.0.0.1:3000/blue-buy?sku=t_porsche
    <button type="button">acquista a 66,00 €</button>

Il nome del tag dell'Elemento Custom viene usato come nome del percorso - gli attributi diventano query parameters. Adesso abbiamo un modo per renderizzare lato server il contenuto di ogni componente. Insieme agli Elementi Custom `<blue-buy>`, si ottiene qualcosa di molto simile a un __Componente Web Universale__:

    <blue-buy sku="t_porsche">
      <!--#include virtual="/blue-buy?sku=t_porsche" -->
    </blue-buy>

Il commento `#include` fa parte dei [Server Side Includes](https://en.wikipedia.org/wiki/Server_Side_Includes), che è una funzionalità disponibile nella maggior parte dei server web. Sì, è la stessa tecnologia che si usava una volta per inglobare la data corrente sui siti web. Ci sono anche tecniche alternative come [ESI](https://en.wikipedia.org/wiki/Edge_Side_Includes), [nodesi](https://github.com/Schibsted-Tech-Polska/nodesi), [compoxure](https://github.com/tes/compoxure) e [tailor](https://github.com/zalando/tailor) ma, per i nostri progetti, le SSI si sono mostrate una soluzione semplice e incredibilmente stabile.

Il commento `#include` viene sostituito dalla risposta di `/blue-buy?sku=t_porsche` prima che il server invii la pagina completa al browser. La configurazione in nginx appare così:

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

La direttiva `ssi: on;` abilita la funzionalità SSI. Viene aggiunto un block `upstream` e `location` per team, per assicurarsi che tutti gli URL che cominciano con `/blue` siano diretti all'applicazione giusta (`team_blue:3001`). In aggiunta, la rotta `/` viene mappata al Team Red, che contolla la homepage / pagina prodotto.

Quest'animazione mostra il negozio di modellini di trattori in un browser che ha __JavaScript disabilitato__.

[![Rendering lato Server - JavaScript Disabilitato](./ressources/video/server-render.gif)](./ressources/video/server-render.mp4)

[ispeziona il codice](https://github.com/neuland/micro-frontends/tree/master/2-composition-universal)

I pulsanti di selezione della variante adesso sono proprio link e ogni click porta a ricaricare la pagina. La linea di comando sulla destra mostra il processo con cui una richiesta della pagina viene inoltrata al Team Rosso, che controlla la pagina prodotto, e dopo il markup viene fornito dai frammenti dei Team Blu e Verde.

Se viene riattivato JavaScript, sarà visibile solo il messaggio di log per la prima richiesta. Tutte le modifiche al trattore successive saranno gestite lato client, come nel primo esempio. In un esempio successivo, i dati dei prodotti saranno estratti dal Javascript e caricati da una API REST per quanto serve.

Puoi giocare con quest'esempio sulla tua macchina locale. Devi installare solo [Docker Compose](https://docs.docker.com/compose/install/).

    git clone https://github.com/neuland/micro-frontends.git
    cd micro-frontends/2-composition-universal
    docker-compose up --build

Docker fa partire nginx sulla porta 3000 e costruisce un'immagine node.js per ogni team. Quando apri [http://127.0.0.1:3000/](http://127.0.0.1:3000/) nel browser, dovresti vedere un trattore rosso. I log combinati di `docker-compose` permettono di vedere facilmente cosa succede sulla rete. Purtroppo non c'è modo di controllare il colore dell'output, quindi devi rassegnarti al fatto ch il Team Blu potrebbe essere evidenziato in verde :)

I file `src` sono mappati nei container individuali e l'applicazione node ripartirà quando fai una modifica al codice. Cambiare il file `nginx.conf` richiede un riavvio di `docker-compose` per avere effetto. Sentiti libero di giochicchiare e di fornire un feedback.

### Lettura dei dati & stati di Caricamento

Uno svantaggio dell'approccio SSI/ESI è che __il frammento più lento determina il tempo di risposta__ dell'intera pagina.
Quindi, è bene cachare la risposta di un frammento.
Per frammenti che sono dispendiosi da produrre e difficili da mettere in cache, è spesso indicato escluderli dal rendering iniziale.
Possono essere caricati in maniera asincrona nel browser.
Nel nostro esempio, un buon candidato per questo è il frammento `green-recos`, che mostra raccomandazioni personalizzate.

Una possibile soluzione sarebbe che il Team Rosso salta proprio l'SSI Include.

**Prima**

    <green-recos sku="t_porsche">
      <!--#include virtual="/green-recos?sku=t_porsche" -->
    </green-recos>

**Dopo**

    <green-recos sku="t_porsche"></green-recos>

*Nota a lato importante. Gli Elementi Custom [non possono essere self-closing](https://developers.google.com/web/fundamentals/architecture/building-components/customelements#jsapi), quindi è sbagliato scrivere `<green-recos sku="t_porsche" />`*

<img alt="Riassestamento" src="./ressources/video/data-fetching-reflow.gif" style="width: 500px" loading="lazy" />

Il rendering avviene solo nel browser.
Ma, come si può vedere nell'animazione, questo cambio ha introdotto un __riassestamento sostanziale__ della pagina.
Il principio, la sezione raccomandazioni è bianca.
Il JavaScript del Team Verde viene caricato ed eseguito.
Viene fatta la chiamata API per ricevere le raccomandazioni personalizzate.
Viene renderizzao il markup delle racconamdazioni e vengono richieste le immagini associate.
Il frammento ora ha bisogno di più spazio e spinge il layout della pagine.

Ci sono diverse opzioni per evitare un riposizionamento fastidioso come questo.

Il Team Rosso, che controlla la pagina, potrebbe __rendere fissa l'altezza del container delle raccomandazioni__.
Su un sito responsive è spesso ingannevole determinare l'altezza, perché potrebbe differire per schermi diversi.
Ma il problema più serio è che __questo tipo di accordi inter-team crea un accoppiamento stretto__ fra i Team Rosso e Verde.
Se i Team Verde vuole introdurre un sottotitolo aggiuntivo nell'elemento raccomandazioni, dovrebbe coordinarsi con il Team Rosso per la nuova altezza. Entrambi i team dovrebbero rilasciare simpultaneamente per evitare che si rompa il layout.

Un metodo migliore è di usare una tecnica chiamata [Skeleton Screens](https://blog.prototypr.io/luke-wroblewski-introduced-skeleton-screens-in-2013-through-his-work-on-the-polar-app-later-fd1d32a6a8e7).
Il Team Rosso lascia l'include SSI `green-recos` nel  markup.
In più, il Team Verde cambia  __il metodo di renderizzazione lato-server__ del suo frammento in modo che produca una __versione schematica del contentuto__.
Il __markup skeleton___ può riusare parte degli stili del layout del contenuto reale.
Così __prenota lo spazio necessario__ e il riempimento del contenuto reale non comporta un salto.

<img alt="Schermo Skeleton" src="./ressources/video/data-fetching-skeleton.gif" style="width: 500px" loading="lazy" />

Gli Skeleton screen sono anche molto __utili per il rendering lato client__.
Quando il tuo Elemento Custom viene inserito nel DOM per un'azione del'utente, potrebbe __renderizzare immediatamente lo scheletro__ finché non arrivano i dati di cui ha bisogno dal server.

Anche per un __cambio d'attributo__ (per esempio per la __selezione di una variante__ si può decidere di passare alla vista scheletro finché non arrivano i nuovi dati.

Im questo modo, l'utente riceve un'indicazione che qualcosa sta succedendo nel frammento. 
Ma quando l'endpoint risponde velocemente, può dare fastidio anche un piccolo __sfarfallio dello scheletro__ fra i dati vecchi e nuovi.
Può aiutare preservare i vecchi dati o usare timeout intelligenti.
Quindi, usa questa tecnica saggiamente e cerca di ottenere il feedback degli utenti.

## Navigare Fra le Pagine

__continua presto ... (Giuro)__

Guarda il [Repo Github](https://github.com/neuland/micro-frontends) per ricevere le notifiche



## Risorse Aggiuntive
- [Libro: Micro Frontends in Action](https://www.manning.com/books/micro-frontends-in-action?a_aid=mfia&a_bid=5f09fdeb) Scritto da me.
- [Discussione: Micro Frontends - MicroCPH, Copenhagen 2019](https://www.youtube.com/watch?v=wCHYILvM7kU) ([Slides](https://noti.st/naltatis/zQb2m5/micro-frontends-the-nitty-gritty-details-or-frontend-backend-happyend)) I dettagli più essenziali di Frontend, Backend, 🌈 Happyend
- [Discussione: Micro Frontends - Web Rebels, Oslo 2018](https://www.youtube.com/watch?v=dTW7eJsIHDg) ([Slides](https://noti.st/naltatis/HxcUfZ/micro-frontends-think-smaller-avoid-the-monolith-love-the-backend)) Pensa in piccolo, Evita il Monolite,❤️ il Backend
- [Slides: Micro Frontends - JSUnconf.eu 2017](https://speakerdeck.com/naltatis/micro-frontends-building-a-modern-webapp-with-multiple-teams)
- [Discussione: Break Up With Your Frontend Monolith - JS Kongress 2017](https://www.youtube.com/watch?v=W3_8sxUurzA) Elisabeth Engel parla dell'implementazione dei Micro Frontends a gutefrage.net
- [Articolo: Micro Frontends](https://martinfowler.com/articles/micro-frontends.html) Articolo di Cam Jackson sul blog di Martin Fowler 
- [Post: Micro frontends - a microservice approach to front-end web development](https://medium.com/@tomsoderlund/micro-frontends-a-microservice-approach-to-front-end-web-development-f325ebdadc16) Tom Söderlund spiega i concetti base e fornisce link sull'argomento
- [Post: Microservices to Micro-Frontends](http://www.agilechamps.com/microservices-to-micro-frontends/) Sandeep Jain riassume i principi chiave di  microservizi e micro frontends
- [Link Collection: Micro Frontends by Elisabeth Engel](https://micro-frontends.zeef.com/elisabeth.engel?ref=elisabeth.engel&share=ee53d51a914b4951ae5c94ece97642fc) una lista esaustiva di post, discorsi, strumenti e altre risorse sull'argomento
- [Awesome Micro Frontends](https://github.com/ChristianUlbrich/awesome-microfrontends) una lista curata di link di Christian Ulbrich 🕶
- [Custom Elements Everywhere](https://custom-elements-everywhere.com/) Per assicurarsi che i framework e gli elementi custom siano BFF (best friend forever)
- I trattori si possono comprare da [manufactum.com](https://www.manufactum.com/) :)<br>_Questo negozio è stato sviluppato da due team usando le tecniche qui descritte._

## Related Techniques
- [Posts: Cookie Cutter Scaling](https://paulhammant.com/categories.html#Cookie_Cutter_Scaling) David Hammet has scritto una serie di blog post su quest'argomento 
- [Wikipedia: Java Portlet Specification](https://en.wikipedia.org/wiki/Java_Portlet_Specification) Specifica che si rivolge ad argomento simili per la costruzione di portali enterprise.
---

## Cose in Arrivo ... (molto presto)

- Use Cases
  - Navigazione fra le pagine
    - navigazione soft vs. hard 
    - universal router
  - ...
- Argomenti a lato
  - CSS Isolato / Interfaccia Utente Coerente / Style Guide & Pattern Library
  - Performance al caricamento iniziale
  - Performance mentre usi il sito
  - Caricare il  CSS
  - Caricare JS
  - Test d'Integrazione
  - ...

## Hanno contribuito
- [Koike Takayuki](https://github.com/koiketakayuki) cha ha tradotto il sito in [Giapponese](https://micro-frontends-japanese.org/).
- [Jorge Beltrán](https://github.com/scipion) cha ha tradotto il sito in [Spagnolo](https://micro-frontends-es.org).
- [Bruno Carneiro](https://github.com/Tautorn) cha ha tradotto il sito in [Portoghese](https://tautorn.github.io/micro-frontends/).
- [Soobin Bak](https://github.com/soobing) cha ha tradotto il sito in [Coreano](https://soobing.github.io/micro-frontends/).
- [Sergei Babin](https://github.com/serzn1) cha ha tradotto il sito in [Russo](https://serzn1.github.io/micro-frontends/).
- [Shiwei Yang](https://github.com/swearer23) cha ha tradotto il sito in [Cinese](https://swearer23.github.io/micro-frontends/).
- [Riccardo Moschetti](https://github.com/RiccardoGMoschetti) che ha tradotto il sito in [Italiano]

Questo sito è generato da Github Pages. Il codice si trova qui: [neuland/micro-frontends](https://github.com/neuland/micro-frontends/).
