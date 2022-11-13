import { ModelInit, MutableModel } from "@aws-amplify/datastore";

type TradesMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type PortfolioMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type NoteMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Trades {
  readonly id: string;
  readonly ticker?: string | null;
  readonly action?: string | null;
  readonly quantity?: number | null;
  readonly fill?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Trades, TradesMetaData>);
  static copyOf(source: Trades, mutator: (draft: MutableModel<Trades, TradesMetaData>) => MutableModel<Trades, TradesMetaData> | void): Trades;
}

export declare class Portfolio {
  readonly id: string;
  readonly balance?: number | null;
  readonly dailyProfit?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Portfolio, PortfolioMetaData>);
  static copyOf(source: Portfolio, mutator: (draft: MutableModel<Portfolio, PortfolioMetaData>) => MutableModel<Portfolio, PortfolioMetaData> | void): Portfolio;
}

export declare class Note {
  readonly id: string;
  readonly open?: number | null;
  readonly high?: number | null;
  readonly low?: number | null;
  readonly close?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Note, NoteMetaData>);
  static copyOf(source: Note, mutator: (draft: MutableModel<Note, NoteMetaData>) => MutableModel<Note, NoteMetaData> | void): Note;
}