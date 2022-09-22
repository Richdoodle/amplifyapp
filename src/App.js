import { withAuthenticator } from '@aws-amplify/ui-react';
import "@aws-amplify/ui-react/styles.css";
import { API } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import './App.css';
import { createNote as createNoteMutation, deleteNote as deleteNoteMutation } from './graphql/mutations';
import { listNotes } from './graphql/queries';


const initialFormState = { open: '', high: '', low: '', close: ''}

function App({ signOut }) {
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchNotes();
  }, []);
  
  async function fetchNotes() {
    const apiData = await API.graphql({ query: listNotes });
    setNotes(apiData.data.listNotes.items);
  }

  async function createNote() {
    if (!formData.open || !formData.high || !formData.low || !formData.close) return;
    await API.graphql({ query: createNoteMutation, variables: { input: formData } });
    setNotes([ ...notes, formData ]);
    setFormData(initialFormState);
  }

  async function deleteNote({ id }) {
    const newNotesArray = notes.filter(note => note.id !== id);
    setNotes(newNotesArray);
    await API.graphql({ query: deleteNoteMutation, variables: { input: { id } }});
  }
  
  return (
    <div className="App">
      <h1>My Notes App</h1>
      <div style={{marginBottom: 30}}>
        <input
          onChange={e => setFormData({ ...formData, 'open': e.target.value})}
          placeholder="Open"
          value={formData.open}
        />
        <input
          onChange={e => setFormData({ ...formData, 'high': e.target.value})}
          placeholder="High"
          value={formData.high}
        />
        <input
          onChange={e => setFormData({ ...formData, 'low': e.target.value})}
          placeholder="Low"
          value={formData.low}
        />
        <input
          onChange={e => setFormData({ ...formData, 'close': e.target.value})}
          placeholder="Close"
          value={formData.close}
        />
        <button onClick={createNote}>Create Note</button>
      </div>
      <div style={{marginBottom: 30}}>
        <table>
          <thead>
            <tr>
              <th>Open</th>
              <th>High</th>
              <th>Low</th>
              <th>Close</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {
            notes.map(note => (
              <tr key={note.id}>
                <td>{note.open}</td>
                <td>{note.high}</td>
                <td>{note.low}</td>
                <td>{note.close}</td>
                <td><button onClick={() => deleteNote(note)}>Delete note</button></td>
              </tr>
            ))
            }
          </tbody>
        </table>
      </div>
      <div>
      {
        
      }
      </div>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}

export default withAuthenticator(App);