import React from 'react'
import { stripLowerCase } from '../../helpers';

const Controls = ({ addUser, clearUsers, resetScores, setQuestions, users, clickerKeys, setClickerKey, possibleOtherKeys }) => {

  const processCsv = () => {
    var fileUpload = document.getElementById("fileUpload");
    fileUpload.click()
}

const onFileChange = e => {
  var fileUpload = document.getElementById("fileUpload");
  var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
    if (regex.test(fileUpload.value.toLowerCase())) {
        if (typeof (FileReader) != "undefined") {
            var reader = new FileReader();
            reader.onload = function (e) {
                setQuestions(e.target.result)
            }
            reader.readAsText(fileUpload.files[0]);
        } else {
            alert("This browser does not support HTML5.");
        }
    } else {
        alert("Please upload a valid CSV file.");
    }
}


  return (
    <div style={{height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
      <div>
        <h2>Controls</h2>
        <div>
          <div style={{display: 'none'}}>
            <input type="file" id="fileUpload" onChange={onFileChange} accept=".csv"/>
          </div>
          <button onClick={processCsv}>Import Questions CSV</button>
          <button onClick={() => setQuestions('')}>Clear Questions</button>
        </div>
        <div>

        </div>

      </div>
      {users && users.length > 0 && <div style={{overflow: 'auto'}}>
        Clicker Keys:
        <div>
          {users.map(u => {

            const stripped = stripLowerCase(clickerKeys[u])
            const display = clickerKeys[u] === ' ' ? 'Spc' : (stripped || `Set`)

            return <div key={u} style={{marginTop: 10}}>
              <button style={{display: 'inline-block', padding: '6px 0px', width: '2rem', marginRight: '0.5rem'}} onClick={() => {
                let p = window.prompt(`Enter a single key to set as the clicker for ${u}`)
                if((p && p.length === 1) || possibleOtherKeys.includes(p)) {
                  setClickerKey(u, p)
                } else {
                  alert('Please enter a valid key for the clicker. Either a single character or one of the following: ' + possibleOtherKeys.join(', ') + '.')
                }
                }}>{display}</button>{u}
            </div>
          })}
        </div>
      </div>}
      
      <div>
          {clearUsers && <button onClick={clearUsers}>Clear Players</button>}
          {resetScores && <button onClick={resetScores}>Reset Scores</button>}
          {addUser && <button onClick={addUser}>Add Player</button>}
      </div>

    </div>
  )
}


export default Controls