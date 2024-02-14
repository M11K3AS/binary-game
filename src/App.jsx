import { useState, useEffect } from 'react';
import './App.css'

const panel_length = 3;
const panel_height = 4;
const arrNum = panel_height * panel_length;
const panel = Array(arrNum).fill(null)
const myPanel = [
  [0,0,0,],
  [0,0,0,],
  [0,0,0,],
  [0,0,0,],
]
const outPosition = 2
const maxGuess = 30
const guessNumber = () => (Math.floor(Math.random() * maxGuess))

// const initialPanel = Array.from({ length: 4 }, () => Array(3).fill(null));

function binaryStringToNumber(binaryString) {
  return parseInt(binaryString, 2);
}

function numberToBinaryString(number) {
  return number.toString(2);
}

function App() {
  return (
    <>
      <Panel />
    </>
  )
}

function Panel() {
  const [panel, setPanel] = useState(myPanel);
  const [sum, setSum] = useState({decimal: 0, binary: 0});
  const [guess, setGuess] = useState(guessNumber);

  useEffect(() => {
    const nextGuess = guess
    // Calculate sum whenever the panel state changes
    const gatesInColumn0 = panel.map(innerList => innerList[0]);
    const gatesInColumn1 = panel.map(innerList => innerList[1]);

    const binaryStringColumn0 = gatesInColumn0.reverse().join('');
    const binaryStringColumn1 = gatesInColumn1.reverse().join('');

    const decimalNumberColumn0 = binaryStringToNumber(binaryStringColumn0);
    const decimalNumberColumn1 = binaryStringToNumber(binaryStringColumn1);

    const decimalSum = decimalNumberColumn0 + decimalNumberColumn1;

    const binarySum = Number(numberToBinaryString(decimalSum))
    const sum = {decimal: decimalSum, binary: binarySum}

    if (sum.decimal === nextGuess) {
      alert("you won")
      setGuess(guessNumber)
    }

    setSum(sum);
  }, [panel,guess]);


  function handleInClick(rowIndex, columnIndex) {
    const nextPanel = [...panel];
    const nextGate = [...nextPanel[rowIndex]];

    if (nextGate[columnIndex] !== outPosition) {
      if (nextGate[columnIndex] === 1) {
        nextGate[columnIndex] = 0;
      } else {
        nextGate[columnIndex] = 1;
      }
    }
    // // set OutPosition
    // if (nextGate[0] + nextGate[1] !== outPosition) {
    //   nextGate[outPosition] = 1;
    // } else {
    //   nextGate[outPosition] = 0;
    // }

    nextPanel[rowIndex] = nextGate;
    setPanel(nextPanel);
  }
  return (
    <section className='my-panel'>
      <h1>{sum.decimal ? sum.decimal : 'make a sum'}</h1>
      <h2>{guess ? guess : 'guess the number'}</h2>
      {myPanel.map((_, rowIndex) => (
      <section key={rowIndex} className='row'>
          <Row key={rowIndex} gate={panel[rowIndex]} rowIndex={rowIndex} onClick={handleInClick}/>
      </section>
      ))}
      <p>{sum.binary ? sum.binary : ':('}</p>
    </section>
  )
}

function Row({gate, rowIndex, onClick}) {
  // const [gate, setGate] = useState(Array(3).fill(null));
  function handleInClick(columnIndex) {
    onClick(rowIndex, columnIndex);
  }
  return (
    <>
      <In value={gate[0]} type={TYPE.blue} handleClick={() => (handleInClick(0))} />
      <In value={gate[1]} type={TYPE.green} handleClick={() => (handleInClick(1))} />
    </>
  )
}

const TYPE = {
  green: "green",
  blue: "blue"
};

function In({value, type, handleClick}) {
  const style = {color: TYPE[type]}
  return <button onClick={handleClick} style={style}>{value ? value : "0"}</button>
}
function Out({value}) {
  return <button>{value ? value : "0"}</button>
}

export default App
