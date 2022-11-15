import React, { useState, useEffect } from "react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import {
  Button,
  Divider,
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
import { Note, Trades, Portfolio } from './models';
import { API, Hub } from 'aws-amplify';
import ChartViewer from "./ChartViewer";

const App = ({ signOut }) => {
  const [notes, setNotes] = useState([]);
  const [trades, setTrades] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [chartData, setChartData] = useState([]);

  async function updateData(){
    var chartData = [];
    const data = await DataStore.query(Note);
    if (data.length > 0){
      data.forEach(function(value){
        chartData.push({
          x: new Date(value.updatedAt),
          y: [value.open, value.high, value.low, value.close]
        })
      });
    } else {
      chartData = [];
    }
    setChartData(chartData);
  }

  useEffect(() => {
    fetchNotes();
    fetchPortfolio();
    fetchTrades();
    updateData();
    const notesSubscription = DataStore.observe(Note).subscribe(msg => {
      console.log(msg.model, msg.opType, msg.element);
      if (msg.opType === 'INSERT'){
        fetchNotes();
        updateData();
        const size = 10
        DataStore.query(Note).then((notes) => {
          if (notes.length > size){
            deleteExtra(notes, size);
          }
        });
      }
    });

    const tradeSubscription = DataStore.observe(Trades).subscribe(msg => {
      if (msg.opType === 'INSERT'){
        fetchTrades();
      }
    })

    const portfolioSubscription = DataStore.observe(Portfolio).subscribe(msg => {
      console.log(msg.model, msg.opType, msg.element);
      fetchPortfolio();
    })

    DataStore.query(Trades).then((trades) => {
      const today = new Date();
      trades.forEach((element) => {
        let tradeDate = new Date(element.createdAt);
        if (tradeDate.getDate() !== today.getDate()) {
          deleteTrade(element.id);
        }
      })
    })

    DataStore.query(Note).then((notes) => {
      const today = new Date();
      notes.forEach((element) => {
        let noteDate = new Date(element.createdAt);
        if (noteDate.getDate() !== today.getDate()) {
          deleteNote(element.id);
        }
      })
    })

    return () => {
      notesSubscription.unsubscribe();
      tradeSubscription.unsubscribe();
      portfolioSubscription.unsubscribe();
    };
  }, []);

  async function fetchNotes() {
    const models = await DataStore.query(Note);
    setNotes(models);
  }

  async function fetchTrades() {
    const models = await DataStore.query(Trades);
    setTrades(models);
  }

  async function fetchPortfolio() {
    const models = await DataStore.query(Portfolio);
    setPortfolio(models);
  }

  async function deleteExtra(notes, size){
    while (notes.length > size){
      notes = await deleteNote(notes[0])
    }
  }

  async function deleteNote({ id }) {
    const newNotes = notes.filter((note) => note.id !== id);
    setNotes(newNotes);
    const modelToDelete = await DataStore.query(Note, id);
    DataStore.delete(modelToDelete);
    return await DataStore.query(Note)
  }

  async function deleteTrade( id ) {
    const newTrades = trades.filter((trade) => trade.id !== id);
    setTrades(newTrades);
    const tradeToDelete = await DataStore.query(Trades, id);
    DataStore.delete(tradeToDelete);
  }
  
  return (
    <View className="App">
      <Flex direction="column" alignItems="center" border="5px solid black" minHeight="100vh" maxHeight="100vh">
        <Heading level={3}>Trader App</Heading>
        <View width="98%" height="60vh" border="2px solid black">
          <ChartViewer data={chartData} />
        </View>
        <Flex as="div" direction="row" border="2px solid black" width="98%" height="25vh">
          <View className='tableContainer'>
            <Table highlightOnHover={true} variation="striped" size="small">
              <TableHead>
                <TableRow>
                  <TableCell as="th">Ticker</TableCell>
                  <TableCell as="th">Action</TableCell>
                  <TableCell as="th">Fill</TableCell>
                  <TableCell as="th">Quantity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {trades.map((trade) => (
                  <TableRow key={trade.id}>
                    <TableCell>{trade.ticker}</TableCell>
                    <TableCell>{trade.action}</TableCell>
                    <TableCell>{trade.fill}</TableCell>
                    <TableCell>{trade.quantity}</TableCell>
                  </TableRow>
                )).reverse()}
              </TableBody>
            </Table>
          </View>
          <View border="2px solid black" width="40vw" height="25vh">
            <Table 
              highlightOnHover={true}>
              <TableHead>
                <TableRow>
                  <TableCell as="th">Balance</TableCell>
                  <TableCell as="th">Daily Profit</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {portfolio.map((portfolio) => (
                  <TableRow key={portfolio.id}>
                    <TableCell>{Math.floor(portfolio.balance * 100) / 100}</TableCell>
                    <TableCell>{Math.floor(portfolio.dailyProfit * 100) / 100}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </View>
        </Flex>

        {/*
        <Divider size="large" orientation="horizontal" />
        <View as="form" margin="3rem 0" onSubmit={createNoteForm}>
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
        <Divider size="large" orientation="horizontal" />
        <Heading level={4}>Current Notes</Heading>
      <Button onClick={signOut}>Sign Out</Button>
      */}
      </Flex>
    </View>
  );
};

export default withAuthenticator(App);