const e = React.createElement;

/* Components */

class Header extends React.Component {
  render() {
    return e("header", { key: 0, className: "header" },
      e('a', { href: this.props.href }, 
        e('h2', null, this.props.title)
      )
    );
  }
}

class Main extends React.Component {
  render() {
    return e("main", { key: 1, className: "main" }, this.props.children);
  }
}

class Entry extends React.Component {
  render() {
    return e("a", { key: this.props.key, className: "entry", href: this.props.href }, 
      e("h4", null, this.props.title),
      e("p", null, this.props.description)
    )
  }
}

/* Data */

const EntryData = [
  { 
    title: "Struc", 
    description: "A simple 2D structural analysis tool.", 
    href: "https://timmngo.github.io/struc/" 
  },
  { 
    title: "Nona", 
    description: "A 3D nonogram puzzle generator.", 
    href: "https://timmngo.github.io/nona/" 
  },
  { 
    title: "Set×Set", 
    description: "An online version of the card game Set.", 
    href: "http://setset.herokuapp.com/" 
  },
  { 
    title: "Babble", 
    description: "A familiar word game.", 
    href: "https://timmngo.github.io/babble/" 
  },
  { 
    title: "SmoothLife", 
    description: "A WebGL shader for SmoothLife.", 
    href: "https://timmngo.github.io/smoothlife-shader/" 
  },
]

let EntryList = EntryData.map((data, index) => 
  e(Entry, Object.assign(data, { key: index })
))

/* Render */

ReactDOM.render(
  [
    e(Header, { title: "Tim\nNgo", href: "https://timmngo.github.io" }),
    e(Main, null, EntryList)
  ], 
  document.getElementById("root")
);
