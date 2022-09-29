import React, { useState, useEffect } from "react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import {
  Button,
  Flex,
  Heading,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Text,
  TextField,
  View,
  withAuthenticator,
} from "@aws-amplify/ui-react";
import { DataStore } from '@aws-amplify/datastore';
import { Note } from './models';


const App = ({ signOut }) => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const models = await DataStore.query(Note);
    setNotes(models);
  }

  async function createNote(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    await DataStore.save(
      new Note({
        open: parseInt(form.get("open")),
        high: parseInt(form.get("high")),
        low: parseInt(form.get("low")),
        close: parseInt(form.get("close"))
      })
    );
    fetchNotes();
    event.target.reset();
  }

  async function deleteNote({ id }) {
    const newNotes = notes.filter((note) => note.id !== id);
    setNotes(newNotes);
    const modelToDelete = await DataStore.query(Note, id);
    DataStore.delete(modelToDelete);
  }

  
  return (
    <View className="App">
      <Heading level={1}>My Notes App</Heading>
      <View as="form" margin="3rem 0" onSubmit={createNote}>
        <Flex direction="row" justifyContent="center">
          <TextField
            name="open"
            placeholder="Open"
            label="open"
            labelHidden
            variation="quiet"
            required
          />
          <TextField
            name="high"
            placeholder="High"
            label="high"
            labelHidden
            variation="quiet"
            required
          />
          <TextField
            name="low"
            placeholder="Low"
            label="low"
            labelHidden
            variation="quiet"
            required
          />
          <TextField
            name="close"
            placeholder="Close"
            label="close"
            labelHidden
            variation="quiet"
            required
          />
          <Button type="submit" variation="primary">
            Create Note
          </Button>
        </Flex>
      </View>
      <Heading level={2}>Current Notes</Heading>
      <View margin="3rem 0">
        <Table 
          caption = ""
          highlightOnHover={true}>
          <TableHead>
            <TableRow>
              <TableCell as="th">Open</TableCell>
              <TableCell as="th">High</TableCell>
              <TableCell as="th">Low</TableCell>
              <TableCell as="th">Close</TableCell>
              <TableCell as="th">Delete Note</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notes.map((note) => (
              <TableRow key={note.id}>
                <TableCell>{note.open}</TableCell>
                <TableCell>{note.high}</TableCell>
                <TableCell>{note.low}</TableCell>
                <TableCell>{note.close}</TableCell>
                <TableCell>
                  <Button variation="link" onClick={() => deleteNote(note)}>
                    Delete note
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </View>
      <Button onClick={signOut}>Sign Out</Button>
    </View>
  );
};

export default withAuthenticator(App);