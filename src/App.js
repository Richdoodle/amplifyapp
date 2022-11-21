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
  View
} from "@aws-amplify/ui-react";
import { Note, Trades, Portfolio } from './models';
import { API, Hub, Predicates, DataStore, SortDirection } from 'aws-amplify';
import ChartViewer from "./ChartViewer";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [trades, setTrades] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [tradeChartData, setTradeChartData] = useState([]);

  useEffect(() => {
    const size = 20
    fetchNotes();
    fetchPortfolio();
    fetchTrades();
    updateData(size);
    updateTradeChartData();
    const notesSubscription = DataStore.observe(Note).subscribe(msg => {
      console.log(msg.model, msg.opType, msg.element);
      if (msg.opType === 'INSERT'){
        fetchNotes();
        DataStore.query(Note, Predicates.ALL, {
          sort: s => s.dateTime(SortDirection.ASCENDING)
        }).then((notes) => {
          if (notes.length > size){
            deleteExtra(notes, size);
          }
        });
        
      }
      updateData(size);
    });

    const tradeSubscription = DataStore.observe(Trades).subscribe(msg => {
      if (msg.opType === 'INSERT'){
        fetchTrades();
        updateTradeChartData();
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

    DataStore.query(Portfolio).then((portfolio) => {
      const today = new Date();
      portfolio.forEach((element) => {
        let date = new Date(element.updatedAt);
        if (date.getDate() !== today.getDate()) {
          updatePortfolio(element.id);
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

  async function updateData(size){
    var chartData = [];
    const data = await DataStore.query(Note, Predicates.ALL, {
      page: 0,
      limit: size,
      sort: s => s.dateTime(SortDirection.ASCENDING)
    });

    if (data.length > 0){
      data.forEach(function(value){
        var y = new Date(value.dateTime).getTime();
        chartData.push({
          x: new Date(y),
          y: [value.open, value.high, value.low, value.close]
        })
      });
    } else {
      chartData = [];
    }
    setChartData(chartData);
  }

  async function updateTradeChartData(){
    var chartData = [];
    const data = await DataStore.query(Trades, Predicates.ALL, {
      sort: s => s.dateTime(SortDirection.ASCENDING)
    });

    if (data.length > 0){
      data.forEach(function(value){
        if (value.action === "BOT" || value.action === "BUY"){
          chartData.push({
            x: new Date(value.dateTime).setHours((new Date(value.dateTime).getHours()) - 8),
            borderColor: '#00E396',
            label: {
              borderColor: '#00E396',
              style: {
                fontSize: '12px',
                color: '#fff',
                background: '#00E396'
              },
              orientation: 'horizontal',
              offsetY: 7,
              text: String(value.action) + " " + String(value.quantity) + "@" + String(Math.floor(value.fill * 100) / 100)
            }
          },)
        } else {
          chartData.push({
            x: new Date(value.dateTime).setHours((new Date(value.dateTime).getHours()) - 8),
            borderColor: '#e30035',
            label: {
              borderColor: '#e30035',
              style: {
                fontSize: '12px',
                color: '#fff',
                background: '#e30035'
              },
              orientation: 'horizontal',
              offsetY: 7,
              text: String(value.action) + " " + String(value.quantity) + "@" + String(Math.floor(value.fill * 100) / 100)
            }
          },)
        }
      });
    } else {
      chartData = [];
    }
    setTradeChartData(chartData);
  }

  async function fetchNotes() {
    const models = await DataStore.query(Note);
    setNotes(models);
  }

  async function fetchTrades() {
    const models = await DataStore.query(Trades, Predicates.ALL, {
      sort: s => s.dateTime(SortDirection.ASCENDING)
    });
    setTrades(models);
  }

  async function fetchPortfolio() {
    const models = await DataStore.query(Portfolio);
    setPortfolio(models);
  }

  async function deleteExtra(data, size){
    while (data.length > size){
      const newNotes = notes.filter((note) => note.id !== data[0].id);
      setNotes(newNotes);
      const modelToDelete = await DataStore.query(Note, data[0].id);
      DataStore.delete(modelToDelete);
      data =  await DataStore.query(Note)
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

  async function updatePortfolio( id ) {
    const origional = await DataStore.query(Portfolio, id);
    await DataStore.save(
      Portfolio.copyOf(origional, updated => {
        updated.dailyProfit = 0
      })
    );
  }
  
  function getTime(PreDate){
    return(new Date(PreDate).toLocaleTimeString());
  }

  return (
    <View className="App">
      <Flex direction="column" alignItems="center" border="5px solid black" minHeight="100vh" maxHeight="100vh">
        <Heading level={3}>Trader App</Heading>
        <View width="98%" height="60vh" border="2px solid black">
          <ChartViewer bars={chartData} xaxis={tradeChartData} />
        </View>
        <Flex as="div" direction="row" border="2px solid black" width="98%" height="25vh">
          <View className='tableContainer'>
            <Table highlightOnHover={true} variation="striped" size="small">
              <TableHead>
                <TableRow>
                <TableCell as="th">Time</TableCell>
                  <TableCell as="th">Ticker</TableCell>
                  <TableCell as="th">Action</TableCell>
                  <TableCell as="th">Fill</TableCell>
                  <TableCell as="th">Quantity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {trades.map((trade) => (
                  <TableRow key={trade.id}>
                    <TableCell>{getTime(trade.dateTime)}</TableCell>
                    <TableCell>{trade.ticker}</TableCell>
                    <TableCell>{trade.action}</TableCell>
                    <TableCell>{Math.floor(trade.fill * 100) / 100}</TableCell>
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
      </Flex>
    </View>
  );
};

export default App;