const element = <h1>Hello, {name}</h1>;

function Header(props) {
  return <header key={1} className={'header'}>
    <a className={`square square-content entry entry-first ${props.class} ${props.color}`} href={props.href}>
      <h2>{ props.title }</h2>
    </a>
  </header>
}

function Main() {
  return <main key={2} className={'main'}>
    { squareList }
  </main>
}

function Square(props) {
  if (props.void === true) {
    return <div key={props.key} className={`square square-void ${props.color}`}>
    <div className="entry">
    </div>
  </div>
  }
  if (props.title !== undefined) {
    return <a key={props.key} className={`square ${props.color}`} href={props.href}>
      <div className="entry">
        {props.title === undefined  ? (
          <img src="img/dots.png" />
        ) : (
          <React.Fragment>
            <h4>{ props.title }</h4>
            <p>{ props.description }</p>
          </React.Fragment>	
        )}
      </div>
    </a>
  }
  return <div key={props.key} className={`square ${props.color}`}>
    <div className="entry">
      {props.title === undefined  ? (
        <img src="img/dots.png" />
      ) : (
        <React.Fragment>
          <h4>{ props.title }</h4>
          <p>{ props.description }</p>
        </React.Fragment>	
      )}
    </div>
  </div>
}

const sizes = ["", "square-med", "square-large square-content"]

const squareData = [
  { 
    size: 2, 
    title: "Struc", 
    description: "A simple 2D structural analysis tool.", 
    href: "https://timmngo.github.io/struc/" 
  },
  { 
    size: 2, 
    title: "Nona", 
    description: "A 3D nonogram puzzle generator.", 
    href: "https://timmngo.github.io/nona/" 
  },
  { 
    size: 2, 
    title: "Set×Set", 
    description: "An online implementation of the card game Set.", 
    href: "http://setset.herokuapp.com/" 
  },
  { 
    size: 2, 
    title: "SmoothLife", 
    description: "A WebGL shader for SmoothLife.", 
    href: "https://timmngo.github.io/smoothlife-shader/" 
  },
]

let squareList = squareData.map((data, index) => Square(
  Object.assign(data, {
    key: index
  })
))

ReactDOM.render([
  Header({ 
    size: 1, 
    color: "white",
    title: "Tim\nNgo", 
    href: "https://timmngo.github.io"
  }), 
  Main(squareList)
], document.getElementById("root"));
