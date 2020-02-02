const name = 'Josh Perez';
const element = <h1>Hello, {name}</h1>;

function Square(props) {
  if (props.void === true) {
    return <div key={props.key} className={`square square-void ${props.class} ${props.color}`}>
    <div className="entry">
    </div>
  </div>
  }
  if (props.primary) {
    return <a key={props.key} className={`square square-content ${props.class} ${props.color}`} href={props.href}>
      <div>
        <div className="entry entry-first">
            <h2>{ props.title }</h2>
        </div>
      </div>
    </a>
  }
  if (props.title !== undefined) {
    return <a key={props.key} className={`square ${props.class} ${props.color}`} href={props.href}>
      <div>
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
    </a>
  }
  return <div key={props.key} className={`square ${props.class} ${props.color}`}>
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
  { size: 0, void: true },
  { 
    size: 1, 
    color: "mustard",
    title: "Tim Ngo", 
    description: "", 
    href: "https://timmngo.github.io", 
    primary: true 
  },
  { size: 0, void: true },
  { 
    size: 2, 
    color: "curacao",
    title: "Struc", 
    description: "A simple 2D structural analysis tool.", 
    href: "https://timmngo.github.io/struc/" 
  },
  { size: 0 },
  { 
    size: 2, 
    color: "lime",
    title: "Nona", 
    description: "A 3D nonogram puzzle generator.", 
    href: "https://timmngo.github.io/nona/" 
  },
  { size: 0, void: true },
  { size: 0 },
  { size: 0 },
  { size: 0, void: true },
  { size: 1 },
  { size: 0 },
  { 
    size: 2, 
    color: "salmon",
    title: "Set×Set", 
    description: "An online implementation of the card game Set.", 
    href: "http://setset.herokuapp.com/" 
  },
  { size: 0 },
  { size: 0 },
  { size: 0 },
  { size: 0, void: true },
  { size: 0 },
  { size: 0, void: true },
  { size: 0 },
  { size: 0 },
  { 
    size: 2, 
    color: "fuchsia",	
    title: "SmoothLife", 
    description: "A WebGL shader for SmoothLife.", 
    href: "https://timmngo.github.io/smoothlife-shader/" 
  },
  { size: 0 },
  { size: 0 },
  { size: 0, void: true },
  { size: 0 },
  { size: 1 },
  { size: 0 },
  { size: 0, void: true	 },
  { size: 0 },
  { size: 0, void: true },
  { size: 0, void: true },
]

const squareList = squareData.map((data, index) => Square(
  Object.assign(data, {
    key: index,
    class: sizes[data.size],
  })
))

ReactDOM.render(
  squareList,
  document.getElementById("root")
);