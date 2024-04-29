import { useState, useEffect, useRef } from 'react';
import { Toaster, toast } from 'sonner';
import { DisplayGuess, DisplayWins } from './components/display';
import './App.css'
import NotePlayer from './noteplayer';
import { play } from './sound';

const myPanel = [
  [0,0,0,],
  [0,0,0,],
  [0,0,0,],
  [0,0,0,],
]
const outPosition = 2
const maxGuess = 30
const guessNumber = () => (Math.floor(Math.random() * maxGuess))

function binaryStringToNumber(binaryString) {
  return parseInt(binaryString, 2);
}

function numberToBinaryString(number) {
  return number.toString(2);
}

function App() {
  return (
    <>
      <Toaster />
      <Panel className='Panel'/>
      <NotePlayer />
      <Footer />
    </>
  )
}

function Panel() {
  const wins = useRef(null);
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
      wins.current = wins.current + 1;
      if (wins.current === 10) {
        play('c~~BAG~E~~/EGc~B~~AGF/EDE~/////AGFE/D/E/F/A/G~~FED/C~~////DDAA~~~////c~B~G~~~/////CCFF~~~///A~G~F~~E~~') // fly me to the moon
        toast("congratulations you won 🎉");
      } else {
        play('c~G')
      }
      setGuess(guessNumber);
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

    nextPanel[rowIndex] = nextGate;
    setPanel(nextPanel);
  }

  return (
    // <h2>{guess ? guess : 'guess the number'}</h2>
    <section className='my-panel'>
      <h2>{sum.decimal ? sum.decimal : 'flip the bits to get:'}</h2>
      <DisplayGuess guess={guess}/>
      {myPanel.map((_, rowIndex) => (
      <section key={rowIndex} className='row'>
          <Row key={rowIndex} gate={panel[rowIndex]} rowIndex={rowIndex} onClick={handleInClick}/>
      </section>
      ))}
      <DisplayWins wins={wins}/>
    </section>
  )
}

function Row({ gate, rowIndex, onClick }) {
  const sounds = [['e', 'E#'], ['c', 'C#']];

  function handleInClick(columnIndex, note) {
    onClick(rowIndex, columnIndex);
    play(note);
  }

  return (
    <>
      <In
        value={gate[0]}
        type={TYPE.blue}
        handleClick={() => handleInClick(0, sounds[0][gate[0]])}
      />
      <In
        value={gate[1]}
        type={TYPE.green}
        handleClick={() => handleInClick(1, sounds[1][gate[1]])}
      />
    </>
  );
}

const TYPE = {
  green: "green",
  blue: "blue"
};

function In({value, type, handleClick}) {
  const style = {color: TYPE[type]}
  return <button onClick={handleClick} style={style}>{value ? value : "0"}</button>
}

function Footer() {
  return (
    <footer>
      <p>Binary addition game, source code:</p>
      <ul>
        <li><a href="https://github.com/M11K3AS/binary-game">GitHub</a></li>
        <li><a href="https://www.linkedin.com/in/bernartdmiqueas">LinkedIn</a></li>
      </ul>
    </footer>
  )
}

export default App
