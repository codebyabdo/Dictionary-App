interface Phonetic {
  text: string;
  audio?: string;
}

interface Meaning {
  partOfSpeech: string;
  definitions: {
    definition: string;
    example?: string;
  }[];
}

interface DictionaryResponse {
  word: string;
  phonetic?: string;
  phonetics?: Phonetic[];
  meanings: Meaning[];
}

export default DictionaryResponse;
