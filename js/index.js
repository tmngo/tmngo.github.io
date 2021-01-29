/* Components */

Vue.component('the-header', {
  props: ['href', 'title'],
  template: `<header>
    <a :href="href">
      <h1>{{ title }}</h1>
    </a>
  </header>`
})

Vue.component('project-entry', {
  props: ['href', 'title', 'description'],
  template: `<a :href="href" class="entry">
    <h2>{{ title }}</h2>
    <p>{{ description }}</p>
  </a>`
})


/* Vue instance */

var app = new Vue({
  el: '#app',
  data: {
    entryList: [
      { 
        title: "Set×Set", 
        description: "An online version of the card game Set.", 
        href: "http://setset.herokuapp.com/" 
      },
      { 
        title: "Nona", 
        description: "A 3D nonogram puzzle generator.", 
        href: "https://timmngo.github.io/nona/" 
      },
      { 
        title: "Babble", 
        description: "A familiar word game.", 
        href: "https://timmngo.github.io/babble/" 
      },
      { 
        title: "Struc", 
        description: "A simple 2D structural analysis tool.", 
        href: "https://timmngo.github.io/struc/" 
      },
      { 
        title: "SmoothLife", 
        description: "A WebGL shader for SmoothLife.", 
        href: "https://timmngo.github.io/smoothlife-shader/" 
      },
      { 
        title: "notes", 
        description: "", 
        href: "https://timmngo.github.io/notes/" 
      },
    ]
  }
})
