import './App.css';
import { useState } from 'react';
import {ButtonGroup, Button, Container, Row} from 'react-bootstrap';
import { IoReload } from "react-icons/io5";
import { MdContentPasteGo } from "react-icons/md";
import { MdContentCopy } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { MdHourglassBottom } from "react-icons/md";
import { MdSend } from "react-icons/md";

function emptyPattern() {
  return Array(20).fill().map(() => Array(40).fill(0));
}

function App() {
  // 40 x 40 array, initialize to all 0s
  const [pattern, setPattern] = useState(emptyPattern());
  const [sendState, setSendState] = useState("unsent");

  function send(i) {
    (async () => {
      setSendState("sending");

      fetch('/api/setrow', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(pattern[i])
        }).then(response => {
          if(!response.ok) throw new Error(response.status);
          else return response.json();
        }).then(data => {
          console.log("got response", data);
          setSendState("sent");
        });
    })();
  }

  function clearRow(i) {
    const newPattern = pattern.map((row, k) => {
      if (k === i) {
        return Array(40).fill(0);
      } else {
        return row;
      }
    });
    setPattern(newPattern);
  }

  function toggle(i, j) {
    const newPattern = pattern.map((row, k) => {
      return row.map((value, l) => {
        if (k === i && l === j) {
          return value === 0 ? 1 : 0;
        } else {
          return value;
        }
      });
    });
    setPattern(newPattern);
  }

  function set(i, j, newval) {
    const newPattern = pattern.map((row, k) => {
      return row.map((value, l) => {
        if (k === i && l === j) {
          return newval;
        } else {
          return value;
        }
      });
    });
    setPattern(newPattern);
  }

  function removeRow(i) {
    const newPattern = pattern.filter((row, k) => {
      return k !== i;
    });
    if (i === 0) {
      setSendState("unsent");
    }
    if (newPattern.length < 20) {
      newPattern.push(Array(40).fill(0));
    }
    setPattern(newPattern);
  }

  function copyRow(i) {
    navigator.clipboard.writeText(pattern[i].join(""));

  }
  function pasteRow(i) {
    navigator.clipboard.readText().then(text => {
      const newPattern = pattern.map((row, k) => {
        if (k === i) {
          return text.split("").map((c) => parseInt(c));
        } else {
          return row;
        }
      });
      setPattern(newPattern);
    });
  }

  function loadPattern(cycle) {
    let offset = 0;
    let newPattern = emptyPattern();
    for (let i = 0; i < pattern.length; i++) {
      for (let j = 0; j < pattern[i].length; j++) {
        if ((j - offset) % cycle === 0) {
          newPattern[i][j] = 0;
        } else {
          newPattern[i][j] = 1;
        }
      }
      offset += 1;
    }
    setPattern(newPattern);
  }

  const rows = pattern.map((row, i) => {
    let cl = () => { clearRow(i);}
    let rm = () => { removeRow(i);}
    let cp = () => { copyRow(i);}
    let ps = () => { pasteRow(i);}
    let sn = () => { send(i);}

    function copyButton() {
      return <Button variant="primary" size="sm" title="Copy" onClick={cp}><MdContentCopy /></Button>
    }
    function pasteButton() {
      return <Button variant="primary" size="sm" title="Paste" onClick={ps}><MdContentPasteGo /></Button>
    }
    function clearButton() {
      return <Button variant="danger" size="sm" title="Clear" onClick={cl}><RiDeleteBack2Fill /></Button>
    }
    function deleteRowButton() {
      return <Button variant="danger" size="sm" title="Clear" onClick={rm}><MdDeleteForever /></Button>
    }
    function reloadButton() {
      return <Button variant="success" size="sm" title="Resend" onClick={sn}><IoReload /></Button>
    }
    function sendButton() {
      return <Button variant="success" size="sm" title="Send" onClick={sn}><MdSend /></Button>
    }
    function sendingButton() {
      return <Button variant="primary" size="sm" title="Sending" disabled><MdHourglassBottom /></Button>
    }
  
    function getActions() {
      let buttons = []
      if (i !== 0) {
          buttons.push(copyButton(), pasteButton(), clearButton(), deleteRowButton());
      } else {
        if (sendState === "sent") {
          buttons.push(reloadButton());
        } else if (sendState === "sending") {
          buttons.push(sendingButton());
        } else {
          buttons.push(sendButton());
        }
        buttons.push(copyButton(), pasteButton(), deleteRowButton());
      }
      return <ButtonGroup>{buttons}</ButtonGroup>
    }

    return (
      <Row key={"row" + i}>
      <ButtonGroup>
        {
          row.map((value, j) => {
            return (
              <Button 
                key={i + "-" + j}
                size="sm"
                variant={pattern[i][j] ? "primary" : "outline-primary"} 
                onClick={() => toggle(i, j)}></Button>
            );
          })
        }
        {getActions()}
      </ButtonGroup>
      </Row>
    );
  });

  return (
    <Container fluid>
      <div>
          <Button variant="info" size="sm" title="Load Twill" onClick={() => loadPattern(2)}>Load Plain Weave</Button>
          <Button variant="info" size="sm" title="Load Twill" onClick={() => loadPattern(3)}>Load 2:1 Twill</Button>
          <Button variant="info" size="sm" title="Load Twill" onClick={() => loadPattern(4)}>Load 3:1 Twill</Button>
      </div>
      {rows}
    </Container>
  );
}

export default App;
