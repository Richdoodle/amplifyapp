import { ModelInit, MutableModel } from "@aws-amplify/datastore";

type NoteMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
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