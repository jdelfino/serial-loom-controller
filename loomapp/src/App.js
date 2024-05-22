import './App.css';
import { useState } from 'react';
import {ButtonGroup, Button, Container, Row, SplitButton, Dropdown} from 'react-bootstrap';

function App() {
  // 40 x 40 array, initialize to all 0s
  const [pattern, setPattern] = useState(Array(20).fill(Array(40).fill(0)));
  const [sendState, setSendState] = useState("unsent");

  function send(i) {
    (async () => {
      setSendState("sending");
      console.log("sending ", i);
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
    console.log("copy", i, pattern[i]);
    navigator.clipboard.writeText(pattern[i].join(""));

  }
  function pasteRow(i) {
    console.log("pasting to ", i);
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

  const rows = pattern.map((row, i) => {
    let cl = () => { clearRow(i);}
    let rm = () => { removeRow(i);}
    let cp = () => { copyRow(i);}
    let ps = () => { pasteRow(i);}
    let sn = () => { send(i);}

    function getActions() {
      if (i !== 0) {
        return (
          <SplitButton
            as={ButtonGroup}
            key={"bg-" + i}
            variant="danger"
            title="Clear"
            onClick={cl}
          >
            <Dropdown.Item eventKey="1"><div onClick={cl}>Clear</div></Dropdown.Item>
            <Dropdown.Item eventKey="2"><div onClick={rm}>Remove</div></Dropdown.Item>
            <Dropdown.Item eventKey="3"><div onClick={cp}>Copy</div></Dropdown.Item>
            <Dropdown.Item eventKey="4"><div onClick={ps}>Paste</div></Dropdown.Item>
          </SplitButton>
        );        
      } else if (sendState === "sent") {
        return (
          <SplitButton
            as={ButtonGroup}
            key={"bg-" + i}
            variant="success"
            title="Remove"
            size="sm"
            onClick={rm}
          >
            <Dropdown.Item eventKey="1"><div onClick={cl}>Clear</div></Dropdown.Item>
            <Dropdown.Item eventKey="2"><div onClick={rm}>Remove</div></Dropdown.Item>
            <Dropdown.Item eventKey="3"><div onClick={cp}>Copy</div></Dropdown.Item>
            <Dropdown.Item eventKey="4"><div onClick={ps}>Paste</div></Dropdown.Item>
          </SplitButton>
        );
      } else if (sendState === "sending") {
        return (
          <SplitButton
            as={ButtonGroup}
            key={"bg-" + i}
            variant="success"
            disabled
            title="(Sending)"
            size="sm"
            onClick={rm}
          >
            <Dropdown.Item disabled eventKey="1"><div onClick={cl}>Clear</div></Dropdown.Item>
            <Dropdown.Item disabled eventKey="2"><div onClick={rm}>Remove</div></Dropdown.Item>
            <Dropdown.Item disabled eventKey="3"><div onClick={cp}>Copy</div></Dropdown.Item>
            <Dropdown.Item disabled eventKey="4"><div onClick={ps}>Paste</div></Dropdown.Item>
          </SplitButton>
        );        
      } else {
        return (
          <SplitButton
            as={ButtonGroup}
            key={"bg-" + i}
            variant="success"
            title="Send"
            onClick={sn}
          >
            <Dropdown.Item eventKey="1"><div onClick={cl}>Clear</div></Dropdown.Item>
            <Dropdown.Item eventKey="2"><div onClick={rm}>Remove</div></Dropdown.Item>
            <Dropdown.Item eventKey="3"><div onClick={cp}>Copy</div></Dropdown.Item>
            <Dropdown.Item eventKey="4"><div onClick={ps}>Paste</div></Dropdown.Item>
          </SplitButton>  
        );      
      }
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
      {rows}
    </Container>
  );
}

export default App;
