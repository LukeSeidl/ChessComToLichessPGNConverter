import './App.css';
import React, { useState } from 'react';
import Grid from '@mui/material/Grid';



function App() {
  var [chessComPGN, setchessComPGN] = useState('Paste PGN Here');
  var [lichessPGN, setlichessPGN] = useState();
  const handleChangeC = event => setchessComPGN(event.target.value);
  const handleChangeL = event => setlichessPGN(event.target.value);
  const formatTimeRemaining = (timeRemaining, moveTime) => {
      var milliseconds = Math.round((timeRemaining - Math.trunc(timeRemaining))*10)/10;
      var hours = Math.trunc((timeRemaining - milliseconds)/ 3600);
      var minutes = Math.trunc(((timeRemaining - milliseconds) - (hours*3600))/60);
      var seconds = Math.trunc((timeRemaining - milliseconds) - (hours*3600)-(minutes*60));
      var hoursString = hours < 10 ? "0" + hours.toString() : hours.toString();
      var minutesString = minutes < 10 ? "0" + minutes.toString() : minutes.toString();
      var secondsString = seconds < 10 ? "0" + seconds.toString() : seconds.toString();
      return hoursString + ':' + minutesString + ":" + secondsString;
  }
  const convertPGN = () => {
    var convertedPGN = chessComPGN;
    var startIdx = convertedPGN.indexOf('[%timestamp');
    var timeControlStart = chessComPGN.indexOf('[TimeControl "')
    var timeControlEnd = chessComPGN.indexOf('"]', timeControlStart);
    var timeControl = chessComPGN.substring(timeControlStart + 14, timeControlEnd);
    var baseTimeControl = timeControl.indexOf('+') >= 0 ? timeControl.substring(0,timeControl.indexOf('+')) : timeControl;
    var increment = parseInt(timeControl.indexOf('+') >= 0 ? timeControl.substring(timeControl.indexOf('+') + 1): 0);
    var timeRemainingWhite = baseTimeControl;
    var timeRemainingBlack = baseTimeControl;
    var timeRemaining = null;
    var turn = 'w';
    while(startIdx >= 0){
      var moveTime = convertedPGN.substring(startIdx + 12, convertedPGN.indexOf(']', startIdx));
      moveTime = moveTime/10;
      if (turn === 'w'){
        timeRemaining = timeRemainingWhite;
      }
      else{
        timeRemaining = timeRemainingBlack;
      }
      timeRemaining = Math.round((timeRemaining - moveTime + increment) * 10)/10;
      var formattedTime = formatTimeRemaining(timeRemaining, moveTime);
      convertedPGN = convertedPGN.substring(0, startIdx + 12) + formattedTime + convertedPGN.substring(startIdx + 12 + (moveTime*10).toString().length);
      convertedPGN = convertedPGN.replace('[%timestamp', '[%clk');
      startIdx = convertedPGN.indexOf('[%timestamp', startIdx)
      if(turn === 'w'){
        timeRemainingWhite = timeRemaining;
        turn = 'b';
      }
      else{
        timeRemainingBlack = timeRemaining;
        turn = 'w'
      }
    }
    setlichessPGN(convertedPGN);
  }
  const copyPGN = () => {
    /* Get the text field */
    var copyText = document.getElementById("convertedPGN");
  
    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /* For mobile devices */
  
     /* Copy the text inside the text field */
     document.execCommand("copy");
  }

  return (
    <div className="App">
      <header className="App-header">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <h1>PGN Converter</h1>
          </Grid>
          <Grid item xs={6}>
            <label className="centerDisplay">
              Chess.com PGN 
            </label>
            <textarea onFocus={event => {event.target.select();}} 
                      onMouseUp={() => {return false}} 
                      className="textAreaInput" value={chessComPGN} onChange={handleChangeC} />
            <input className="centerDisplay button" type="button" value="Convert" onClick={convertPGN}/>
          </Grid>
          <Grid item xs={6}>
           <label className="centerDisplay">
              Lichess PGN 
            </label>
            <textarea className="textAreaInput" id="convertedPGN" value={lichessPGN} onChange={handleChangeL}/>
            <input className="centerDisplay button" type="button" value="Copy To Clipboard" onClick={copyPGN}/>
          </Grid>
        </Grid>
      </header>
    </div>
  );
}

export default App;
