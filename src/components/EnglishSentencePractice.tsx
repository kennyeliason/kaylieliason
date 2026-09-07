import { useState } from 'react';

type SentenceType = 'Simple' | 'Compound' | 'Complex' | 'Compound-Complex';
type FigurativeType = 'Simile' | 'Metaphor' | 'Personification' | 'Hyperbole' | 'Idiom';
type PartOfSpeechType =
  | 'Noun'
  | 'Verb'
  | 'Pronoun'
  | 'Conjunction'
  | 'Coordinating Conjunction'
  | 'Subordinating Conjunction'
  | 'Adjective'
  | 'Adverb'
  | 'Preposition'
  | 'Interjection';
type EssayType =
  | 'Personal Narrative'
  | 'Persuasive/Argumentative'
  | 'Descriptive'
  | 'Expository'
  | 'Compare and Contrast'
  | 'Attention Getter'
  | 'Organization'
  | 'Conventions'
  | 'Content and Support'
  | 'Originality';
type SentenceRuleAnswer =
  | 'Comma + FANBOYS'
  | 'Semicolon'
  | 'No comma before because'
  | 'Comma after opener'
  | 'Appositive commas'
  | 'Semicolon + transition + comma'
  | 'Comma splice'
  | 'Complete sentence';
type PracticeTab = 'structure' | 'parts' | 'essays' | 'figurative';
type StructureMode = 'types' | 'punctuation';
type PunctuationMark = '' | ',' | ';';

type Question = {
  sentence: string;
  answer: SentenceType;
  explanation: string;
};

type VocabEntry = {
  word: string;
  definition: string;
  example: string;
};

type VocabQuestion = {
  word: string;
  definition: string;
  example: string;
  options: string[];
};

type FigurativeQuestion = {
  sentence: string;
  answer: FigurativeType;
  explanation: string;
};

type PartOfSpeechQuestion = {
  sentence: string;
  prompt: string;
  answer: string;
  explanation: string;
  options?: string[];
};

type EssayQuestion = {
  sentence: string;
  answer: EssayType;
  explanation: string;
};

type SentenceRuleQuestion = {
  sentence: string;
  answer: SentenceRuleAnswer;
  explanation: string;
  options: SentenceRuleAnswer[];
};

type PunctuationQuestion = {
  text: string;
  answers: Record<number, PunctuationMark>;
  explanation: string;
};

const sentenceTypes: SentenceType[] = ['Simple', 'Compound', 'Complex', 'Compound-Complex'];
const figurativeTypes: FigurativeType[] = ['Simile', 'Metaphor', 'Personification', 'Hyperbole', 'Idiom'];
const partOfSpeechTypes: PartOfSpeechType[] = [
  'Noun',
  'Verb',
  'Pronoun',
  'Conjunction',
  'Coordinating Conjunction',
  'Subordinating Conjunction',
  'Adjective',
  'Adverb',
  'Preposition',
  'Interjection',
];
const essayTypes: EssayType[] = [
  'Personal Narrative',
  'Persuasive/Argumentative',
  'Descriptive',
  'Expository',
  'Compare and Contrast',
  'Attention Getter',
  'Organization',
  'Conventions',
  'Content and Support',
  'Originality',
];
const QUESTION_COUNT = 24;
const QUESTIONS_PER_TYPE = QUESTION_COUNT / sentenceTypes.length;
const FIGURATIVE_QUESTION_COUNT = 20;
const FIGURATIVE_PER_TYPE = FIGURATIVE_QUESTION_COUNT / figurativeTypes.length;
const PUNCTUATION_QUESTION_COUNT = 10;

const simpleQuestions: Question[] = [
  { sentence: 'The dog barked at the mail carrier.', answer: 'Simple', explanation: 'One independent clause only.' },
  { sentence: 'Kayli reviewed her notes before class.', answer: 'Simple', explanation: 'One independent clause only.' },
  { sentence: 'The bus arrived right on time.', answer: 'Simple', explanation: 'One independent clause only.' },
  { sentence: 'My little brother built a fort in the living room.', answer: 'Simple', explanation: 'One independent clause only.' },
  { sentence: 'The cookies smelled amazing.', answer: 'Simple', explanation: 'One independent clause only.' },
  { sentence: 'We found our seats before sunset.', answer: 'Simple', explanation: 'One independent clause only.' },
  { sentence: 'The players ran onto the field.', answer: 'Simple', explanation: 'One independent clause only.' },
  { sentence: 'Mia read the chapter carefully.', answer: 'Simple', explanation: 'One independent clause only.' },
  { sentence: 'The library opened early this morning.', answer: 'Simple', explanation: 'One independent clause only.' },
  { sentence: 'The candles flickered in the dark.', answer: 'Simple', explanation: 'One independent clause only.' },
  { sentence: 'Our team practiced after school.', answer: 'Simple', explanation: 'One independent clause only.' },
  { sentence: 'The students lined up quietly.', answer: 'Simple', explanation: 'One independent clause only.' },
  { sentence: 'Ouch!', answer: 'Simple', explanation: 'A one-word interjection can be a simple sentence when it expresses a complete thought.' },
  { sentence: 'The nervous student answered carefully.', answer: 'Simple', explanation: 'One independent clause with a subject and verb.' },
  { sentence: 'My English teacher explained appositives after lunch.', answer: 'Simple', explanation: 'One complete sentence with no extra dependent or second independent clause.' },
];

const compoundQuestions: Question[] = [
  { sentence: 'The bell rang, and everyone hurried to class.', answer: 'Compound', explanation: 'Two independent clauses joined by a comma and a coordinating conjunction.' },
  { sentence: 'I studied for the test, but I still felt nervous.', answer: 'Compound', explanation: 'Two independent clauses joined by a comma and a coordinating conjunction.' },
  { sentence: 'Mom packed snacks, and Dad filled the cooler.', answer: 'Compound', explanation: 'Two independent clauses joined by a comma and a coordinating conjunction.' },
  { sentence: 'The sun set behind the mountains, and the sky turned orange.', answer: 'Compound', explanation: 'Two independent clauses joined by a comma and a coordinating conjunction.' },
  { sentence: 'Noah finished his homework, so he turned on the game.', answer: 'Compound', explanation: 'Two independent clauses joined by a comma and a coordinating conjunction.' },
  { sentence: 'The rain stopped, but the sidewalk stayed wet.', answer: 'Compound', explanation: 'Two independent clauses joined by a comma and a coordinating conjunction.' },
  { sentence: 'The teacher asked a question, and the class answered together.', answer: 'Compound', explanation: 'Two independent clauses joined by a comma and a coordinating conjunction.' },
  { sentence: 'We could leave now, or we could wait for the rest of the group.', answer: 'Compound', explanation: 'Two independent clauses joined by a comma and a coordinating conjunction.' },
  { sentence: 'The movie ended, and everyone clapped.', answer: 'Compound', explanation: 'Two independent clauses joined by a comma and a coordinating conjunction.' },
  { sentence: 'Ava brought the drinks, and Jaden carried the chairs.', answer: 'Compound', explanation: 'Two independent clauses joined by a comma and a coordinating conjunction.' },
  { sentence: 'The hallway was noisy, but she stayed focused.', answer: 'Compound', explanation: 'Two independent clauses joined by a comma and a coordinating conjunction.' },
  { sentence: 'I set an alarm, so I would not miss the bus.', answer: 'Compound', explanation: 'Two independent clauses joined by a comma and a coordinating conjunction.' },
  { sentence: 'I needed to buy eggs; I stopped at the store.', answer: 'Compound', explanation: 'Two complete sentences can be connected with a semicolon.' },
  { sentence: 'Kayli studied the notes, and she finished the quiz.', answer: 'Compound', explanation: 'Two independent clauses are connected with a comma plus the coordinating conjunction "and."' },
  { sentence: 'The paragraph was organized, but the conclusion needed more detail.', answer: 'Compound', explanation: 'Two complete thoughts are joined correctly with a comma and "but."' },
];

const complexQuestions: Question[] = [
  { sentence: 'Because the rain started early, the game was delayed.', answer: 'Complex', explanation: 'One dependent clause plus one independent clause.' },
  { sentence: 'Although I was tired, I finished my homework.', answer: 'Complex', explanation: 'One dependent clause plus one independent clause.' },
  { sentence: 'When the movie ended, we walked to the car.', answer: 'Complex', explanation: 'One dependent clause plus one independent clause.' },
  { sentence: 'If you call me later, I will explain the assignment.', answer: 'Complex', explanation: 'One dependent clause plus one independent clause.' },
  { sentence: 'Since the library was closed, we studied at home.', answer: 'Complex', explanation: 'One dependent clause plus one independent clause.' },
  { sentence: 'After we ate dinner, Dad washed the dishes.', answer: 'Complex', explanation: 'One dependent clause plus one independent clause.' },
  { sentence: 'Even though the test was hard, she stayed calm.', answer: 'Complex', explanation: 'One dependent clause plus one independent clause.' },
  { sentence: 'While the baby slept, Mom folded the laundry.', answer: 'Complex', explanation: 'One dependent clause plus one independent clause.' },
  { sentence: 'Before the concert began, we found our seats.', answer: 'Complex', explanation: 'One dependent clause plus one independent clause.' },
  { sentence: 'Unless you hurry, the bus will leave without us.', answer: 'Complex', explanation: 'One dependent clause plus one independent clause.' },
  { sentence: 'When the timer beeped, the cookies were ready.', answer: 'Complex', explanation: 'One dependent clause plus one independent clause.' },
  { sentence: 'Because the power went out, we lit candles in the kitchen.', answer: 'Complex', explanation: 'One dependent clause plus one independent clause.' },
  { sentence: 'Since I was running late, I called to postpone the meeting.', answer: 'Complex', explanation: 'A subordinating conjunction starts a dependent clause, then the independent clause finishes the thought.' },
  { sentence: 'I called to postpone the meeting because I was running late.', answer: 'Complex', explanation: 'One independent clause is joined to a dependent clause that starts with "because."' },
  { sentence: 'After the teacher explained the rule, the comma finally made sense.', answer: 'Complex', explanation: 'The sentence has one dependent clause and one independent clause.' },
];

const compoundComplexQuestions: Question[] = [
  { sentence: 'Because the rain started early, the game was delayed, and the fans opened their umbrellas.', answer: 'Compound-Complex', explanation: 'It has one dependent clause and two independent clauses.' },
  { sentence: 'Although I was tired, I finished my homework, and I packed my bag for tomorrow.', answer: 'Compound-Complex', explanation: 'It has one dependent clause and two independent clauses.' },
  { sentence: 'When the movie ended, we walked to the car, but Dad went back for his jacket.', answer: 'Compound-Complex', explanation: 'It has one dependent clause and two independent clauses.' },
  { sentence: 'If you call me later, I will explain the assignment, and I will send you my notes.', answer: 'Compound-Complex', explanation: 'It has one dependent clause and two independent clauses.' },
  { sentence: 'Since the library was closed, we studied at home, and we met online to compare answers.', answer: 'Compound-Complex', explanation: 'It has one dependent clause and two independent clauses.' },
  { sentence: 'After we ate dinner, Dad washed the dishes, and Mom packed tomorrow\'s lunches.', answer: 'Compound-Complex', explanation: 'It has one dependent clause and two independent clauses.' },
  { sentence: 'Even though the test was hard, she stayed calm, and she finished on time.', answer: 'Compound-Complex', explanation: 'It has one dependent clause and two independent clauses.' },
  { sentence: 'While the baby slept, Mom folded the laundry, and I cleaned the kitchen table.', answer: 'Compound-Complex', explanation: 'It has one dependent clause and two independent clauses.' },
  { sentence: 'Before the concert began, we found our seats, and we bought drinks for the show.', answer: 'Compound-Complex', explanation: 'It has one dependent clause and two independent clauses.' },
  { sentence: 'Unless you hurry, the bus will leave without us, and we will miss first period.', answer: 'Compound-Complex', explanation: 'It has one dependent clause and two independent clauses.' },
  { sentence: 'When the timer beeped, the cookies were ready, and the whole kitchen smelled amazing.', answer: 'Compound-Complex', explanation: 'It has one dependent clause and two independent clauses.' },
  { sentence: 'Because the power went out, we lit candles in the kitchen, and we played cards by the window.', answer: 'Compound-Complex', explanation: 'It has one dependent clause and two independent clauses.' },
  { sentence: 'Because I was late, my mom grounded me, so I will not sleep over this weekend.', answer: 'Compound-Complex', explanation: 'It has a dependent clause plus two complete sentences connected with "so."' },
  { sentence: 'When the essay began, the hook caught my attention, and the thesis explained the topic.', answer: 'Compound-Complex', explanation: 'It has one dependent clause and two independent clauses.' },
  { sentence: 'Although the draft was messy, Kayli revised the body paragraph, and the essay became clearer.', answer: 'Compound-Complex', explanation: 'It combines a dependent clause with two independent clauses.' },
];

const sentenceRuleQuestions: SentenceRuleQuestion[] = [
  {
    sentence: 'I went to the store, for I needed to buy eggs and strawberries.',
    answer: 'Comma + FANBOYS',
    explanation: 'For is a coordinating conjunction here. Two complete sentences are connected with a comma plus FANBOYS.',
    options: ['Comma + FANBOYS', 'No comma before because', 'Comma splice', 'Appositive commas'],
  },
  {
    sentence: 'I needed to buy eggs; I went to the store.',
    answer: 'Semicolon',
    explanation: 'A semicolon can correctly connect two complete sentences that are closely related.',
    options: ['Semicolon', 'Comma + FANBOYS', 'Comma after opener', 'Complete sentence'],
  },
  {
    sentence: 'I went to the store because I needed eggs.',
    answer: 'No comma before because',
    explanation: 'The notes say not to put a comma before because when it comes in the middle of the sentence.',
    options: ['No comma before because', 'Comma + FANBOYS', 'Comma splice', 'Appositive commas'],
  },
  {
    sentence: 'Because I needed eggs, I went to the store.',
    answer: 'Comma after opener',
    explanation: 'When a dependent clause comes first, put a comma after it before the independent clause.',
    options: ['Comma after opener', 'No comma before because', 'Semicolon', 'Complete sentence'],
  },
  {
    sentence: 'Ms. Donnelly, my English teacher, explained the sentence rule.',
    answer: 'Appositive commas',
    explanation: 'The phrase "my English teacher" renames Ms. Donnelly, so it is set off with commas.',
    options: ['Appositive commas', 'Comma splice', 'Comma + FANBOYS', 'No comma before because'],
  },
  {
    sentence: 'I will not do any of my assignments; therefore, I will fail.',
    answer: 'Semicolon + transition + comma',
    explanation: 'Transition words like therefore and however need a semicolon before them and a comma after them when joining two complete sentences.',
    options: ['Semicolon + transition + comma', 'Comma + FANBOYS', 'Comma after opener', 'Comma splice'],
  },
  {
    sentence: 'I love to read; however, I do not always like what is assigned.',
    answer: 'Semicolon + transition + comma',
    explanation: 'However is a transition word, so it uses a semicolon before and comma after.',
    options: ['Semicolon + transition + comma', 'Semicolon', 'No comma before because', 'Complete sentence'],
  },
  {
    sentence: 'I went to the store, I needed eggs.',
    answer: 'Comma splice',
    explanation: 'Two complete sentences cannot be connected with only a comma. That mistake is called a comma splice.',
    options: ['Comma splice', 'Comma + FANBOYS', 'Appositive commas', 'Comma after opener'],
  },
  {
    sentence: 'You farted.',
    answer: 'Complete sentence',
    explanation: 'It is short, but it has a noun/pronoun idea and a verb, and it expresses a complete thought.',
    options: ['Complete sentence', 'Comma splice', 'Appositive commas', 'Semicolon'],
  },
  {
    sentence: 'Tomorrow, at 3:15pm, I will go to the dentist.',
    answer: 'Comma after opener',
    explanation: 'Introductory time phrases at the start of a sentence are set off with commas.',
    options: ['Comma after opener', 'No comma before because', 'Comma + FANBOYS', 'Semicolon'],
  },
  {
    sentence: 'In the Age of Reason, a time period from 1685 to 1815, people valued science over superstition.',
    answer: 'Appositive commas',
    explanation: 'The appositive phrase explains the Age of Reason, so commas go around it.',
    options: ['Appositive commas', 'Comma splice', 'Complete sentence', 'No comma before because'],
  },
  {
    sentence: 'I went to the store, and I bought two pairs of shoes.',
    answer: 'Comma + FANBOYS',
    explanation: 'This uses a comma and the coordinating conjunction "and" to join two complete thoughts.',
    options: ['Comma + FANBOYS', 'Semicolon + transition + comma', 'No comma before because', 'Comma splice'],
  },
];

const punctuationQuestions: PunctuationQuestion[] = [
  {
    text: 'I went to the store for I needed to buy eggs and strawberries.',
    answers: { 4: ',' },
    explanation: 'Use a comma before a coordinating conjunction when it connects two complete sentences.',
  },
  {
    text: 'I needed to buy eggs I went to the store.',
    answers: { 4: ';' },
    explanation: 'A semicolon can connect two complete sentences that belong together.',
  },
  {
    text: 'I went to the store because I needed eggs.',
    answers: {},
    explanation: 'Do not put a comma before because when it comes in the middle of the sentence.',
  },
  {
    text: 'Because I needed eggs I went to the store.',
    answers: { 3: ',' },
    explanation: 'When a dependent clause comes first, put a comma after it.',
  },
  {
    text: 'Ms. Donnelly my English teacher explained the rule.',
    answers: { 1: ',', 4: ',' },
    explanation: 'An appositive renames a noun, so commas go around it.',
  },
  {
    text: 'I will not do any of my assignments therefore I will fail.',
    answers: { 7: ';', 8: ',' },
    explanation: 'With transition words like therefore, use a semicolon before the transition and a comma after it.',
  },
  {
    text: 'I love to read however I do not always like what is assigned.',
    answers: { 3: ';', 4: ',' },
    explanation: 'However connects two complete sentences with a semicolon before it and a comma after it.',
  },
  {
    text: 'Tomorrow at 3:15pm I will go to the dentist.',
    answers: { 0: ',', 3: ',' },
    explanation: 'Introductory time words and phrases at the start of a sentence are set off with commas.',
  },
  {
    text: 'In the Age of Reason a time period from 1685 to 1815 people valued science over superstition.',
    answers: { 4: ',', 11: ',' },
    explanation: 'The appositive phrase explains the Age of Reason, so it gets commas around it.',
  },
  {
    text: 'I went to the store and I bought two pairs of shoes.',
    answers: { 4: ',' },
    explanation: 'Use comma plus FANBOYS when joining two complete sentences.',
  },
  {
    text: 'Although the test was hard she stayed calm.',
    answers: { 4: ',' },
    explanation: 'When a dependent clause starts the sentence, put a comma after it.',
  },
  {
    text: 'She stayed calm and she finished on time.',
    answers: { 2: ',' },
    explanation: 'Use a comma before and when it joins two complete sentences.',
  },
  {
    text: 'The library was closed so we studied at home.',
    answers: { 3: ',' },
    explanation: 'So is a coordinating conjunction here, so it needs a comma before it.',
  },
  {
    text: 'I called to postpone because I was running late.',
    answers: {},
    explanation: 'Because comes in the middle, so this sentence does not need a comma there.',
  },
  {
    text: 'Since the bus was late we missed the first bell.',
    answers: { 4: ',' },
    explanation: 'Since starts a dependent clause, so the comma goes after the opener.',
  },
  {
    text: 'Beau my brother carried the chairs.',
    answers: { 0: ',', 2: ',' },
    explanation: 'The appositive "my brother" renames Beau, so commas go around it.',
  },
  {
    text: 'Kayli my favorite student finished the essay.',
    answers: { 0: ',', 3: ',' },
    explanation: 'The appositive phrase adds extra description, so it is set off with commas.',
  },
  {
    text: 'I did my homework however I forgot to turn it in.',
    answers: { 3: ';', 4: ',' },
    explanation: 'However connects two complete thoughts with a semicolon before it and a comma after it.',
  },
  {
    text: 'The bell rang therefore everyone hurried to class.',
    answers: { 2: ';', 3: ',' },
    explanation: 'Therefore needs a semicolon before it and a comma after it when joining two complete sentences.',
  },
  {
    text: 'Before the concert began we found our seats and we bought drinks.',
    answers: { 3: ',', 7: ',' },
    explanation: 'The opener gets a comma, and the two complete sentences are joined with comma plus and.',
  },
  {
    text: 'The rain stopped but the sidewalk stayed wet.',
    answers: { 2: ',' },
    explanation: 'But joins two complete thoughts, so it needs a comma before it.',
  },
  {
    text: 'During lunch there was a fight.',
    answers: { 1: ',' },
    explanation: 'During lunch is an introductory phrase, so it gets a comma after it.',
  },
  {
    text: 'Above everything else she was a good student.',
    answers: { 2: ',' },
    explanation: 'The introductory phrase comes first, so put a comma after it.',
  },
  {
    text: 'I set an alarm so I would not miss the bus.',
    answers: { 3: ',' },
    explanation: 'So connects two complete thoughts, so use a comma before it.',
  },
  {
    text: 'The movie ended everyone clapped.',
    answers: { 2: ';' },
    explanation: 'A semicolon can join two complete sentences without using a conjunction.',
  },
  {
    text: 'I love grammar because punctuation helps readers.',
    answers: {},
    explanation: 'Because comes in the middle, so it usually does not need a comma before it.',
  },
  {
    text: 'Next Thursday we will go to the opening of the restaurant.',
    answers: { 1: ',' },
    explanation: 'The opening time phrase goes at the start, so add a comma after it.',
  },
  {
    text: 'My dad a patient coach helped me practice.',
    answers: { 1: ',', 4: ',' },
    explanation: 'The phrase "a patient coach" renames or describes my dad, so commas go around it.',
  },
];

const partOfSpeechQuestions: PartOfSpeechQuestion[] = [
  {
    sentence: 'Jacob carried the notebook to class.',
    prompt: 'What part of speech is "Jacob"?',
    answer: 'Noun',
    explanation: 'Jacob names a person. A noun names a person, place, thing, or idea.',
  },
  {
    sentence: 'The pencil rolled under the desk.',
    prompt: 'What part of speech is "pencil"?',
    answer: 'Noun',
    explanation: 'Pencil names a thing, so it is a noun.',
  },
  {
    sentence: 'Kayli wrote the sentence carefully.',
    prompt: 'What part of speech is "wrote"?',
    answer: 'Verb',
    explanation: 'Wrote is the action in the sentence. Verbs show action or link the subject to more information.',
  },
  {
    sentence: 'The cookies were warm.',
    prompt: 'What part of speech is "were"?',
    answer: 'Verb',
    explanation: 'Were is a linking verb. The notes say linking verbs include am, is, are, was, were, be, being, and been.',
  },
  {
    sentence: 'She finished the essay before dinner.',
    prompt: 'What part of speech is "She"?',
    answer: 'Pronoun',
    explanation: 'She takes the place of a noun, so it is a pronoun.',
  },
  {
    sentence: 'I packed my notes, and I put them in my binder.',
    prompt: 'What part of speech is "and"?',
    answer: 'Coordinating Conjunction',
    explanation: 'And joins words or sentence parts. It is one of the FANBOYS coordinating conjunctions.',
  },
  {
    sentence: 'Because the quiz was hard, I studied again.',
    prompt: 'What part of speech is "Because"?',
    answer: 'Subordinating Conjunction',
    explanation: 'Because is a subordinating conjunction. It starts a dependent clause.',
  },
  {
    sentence: 'The bright marker highlighted the rule.',
    prompt: 'What part of speech is "bright"?',
    answer: 'Adjective',
    explanation: 'Bright describes the noun marker. Adjectives describe nouns.',
  },
  {
    sentence: 'The teacher spoke clearly.',
    prompt: 'What part of speech is "clearly"?',
    answer: 'Adverb',
    explanation: 'Clearly describes how the teacher spoke. Adverbs describe verbs and often end in -ly.',
  },
  {
    sentence: 'The paper fell under the binder.',
    prompt: 'What part of speech is "under"?',
    answer: 'Preposition',
    explanation: 'Under begins the phrase "under the binder." Prepositions begin phrases that add detail.',
  },
  {
    sentence: 'Ouch! I stubbed my toe.',
    prompt: 'What part of speech is "Ouch"?',
    answer: 'Interjection',
    explanation: 'Ouch expresses strong feeling and can stand alone with an exclamation point.',
  },
  {
    sentence: 'My teacher, Ms. Donnelly, explained the rubric.',
    prompt: 'Which word is a noun?',
    answer: 'Noun',
    explanation: 'Teacher and Ms. Donnelly are nouns because they name a person or title.',
  },
  {
    sentence: 'The student is focused.',
    prompt: 'What part of speech is "is"?',
    answer: 'Verb',
    explanation: 'Is is a linking verb because it connects the subject to a description.',
  },
  {
    sentence: 'They reviewed their notes after school.',
    prompt: 'What part of speech is "They"?',
    answer: 'Pronoun',
    explanation: 'They replaces a noun, so it is a pronoun.',
  },
  {
    sentence: 'I wanted to go outside, but I finished my homework first.',
    prompt: 'What part of speech is "but"?',
    answer: 'Coordinating Conjunction',
    explanation: 'But is a coordinating conjunction. It connects two complete thoughts when used with a comma.',
  },
  {
    sentence: 'The long essay needed a stronger conclusion.',
    prompt: 'What part of speech is "long"?',
    answer: 'Adjective',
    explanation: 'Long describes the noun essay.',
  },
  {
    sentence: 'Kayli quickly fixed the comma splice.',
    prompt: 'What part of speech is "quickly"?',
    answer: 'Adverb',
    explanation: 'Quickly describes how Kayli fixed it, so it is an adverb.',
  },
  {
    sentence: 'During lunch, there was a fight.',
    prompt: 'What part of speech is "During"?',
    answer: 'Preposition',
    explanation: 'During starts the phrase "During lunch," which adds detail about time.',
  },
  {
    sentence: 'Wow! That sentence is compound-complex.',
    prompt: 'What part of speech is "Wow"?',
    answer: 'Interjection',
    explanation: 'Wow is an interjection because it shows strong feeling.',
  },
  {
    sentence: 'For, and, nor, but, or, yet, so are FANBOYS.',
    prompt: 'What part of speech are FANBOYS?',
    answer: 'Coordinating Conjunction',
    explanation: 'FANBOYS are coordinating conjunctions used to connect words or complete sentences.',
  },
  {
    sentence: 'Nouns can name general things like teacher or specific things like Ms. Donnelly.',
    prompt: 'What are the two types of nouns?',
    answer: 'Common and Proper Nouns',
    explanation: 'Common nouns name general people, places, things, or ideas. Proper nouns name specific ones.',
    options: ['Common and Proper Nouns', 'Action and Linking Verbs', 'Coordinating and Subordinating Conjunctions', 'Adjectives and Adverbs'],
  },
  {
    sentence: 'Some verbs show action, and some verbs connect the subject to a description.',
    prompt: 'What are the two types of verbs?',
    answer: 'Action and Linking Verbs',
    explanation: 'Action verbs show what someone or something does. Linking verbs connect the subject to more information.',
    options: ['Action and Linking Verbs', 'Common and Proper Nouns', 'Coordinating and Subordinating Conjunctions', 'Prepositions and Interjections'],
  },
  {
    sentence: 'For, and, nor, but, or, yet, so are one group. Because, when, if, and although are another group.',
    prompt: 'What are the two types of conjunctions from the notes?',
    answer: 'Coordinating and Subordinating Conjunctions',
    explanation: 'Coordinating conjunctions are FANBOYS. Subordinating conjunctions start dependent clauses.',
    options: ['Coordinating and Subordinating Conjunctions', 'Common and Proper Nouns', 'Action and Linking Verbs', 'Adjectives and Adverbs'],
  },
];

const figurativeQuestions: FigurativeQuestion[] = [
  { sentence: 'Her smile was as bright as the sun.', answer: 'Simile', explanation: 'This is a simile because it compares two unlike things using "as."' },
  { sentence: 'The classroom was a zoo after lunch.', answer: 'Metaphor', explanation: 'This is a metaphor because it directly says one thing is another.' },
  { sentence: 'The wind whispered through the trees.', answer: 'Personification', explanation: 'This is personification because the wind is given a human action.' },
  { sentence: 'I have told you a million times to clean your room.', answer: 'Hyperbole', explanation: 'This is hyperbole because it uses obvious exaggeration.' },
  { sentence: 'After the surprise quiz, Kayli said it was a piece of cake.', answer: 'Idiom', explanation: 'This is an idiom because the phrase means something other than its literal words.' },
  { sentence: 'He ran like lightning to catch the bus.', answer: 'Simile', explanation: 'This is a simile because it compares his speed to lightning using "like."' },
  { sentence: 'Time is a thief that steals our weekends.', answer: 'Metaphor', explanation: 'This is a metaphor because it says time is a thief without using "like" or "as."' },
  { sentence: 'The alarm clock screamed at 6:00 a.m.', answer: 'Personification', explanation: 'This is personification because the alarm clock is described as if it can scream.' },
  { sentence: 'This backpack weighs a ton.', answer: 'Hyperbole', explanation: 'This is hyperbole because the speaker exaggerates the backpack\'s weight.' },
  { sentence: 'When the project finally worked, we were on cloud nine.', answer: 'Idiom', explanation: 'This is an idiom because "on cloud nine" means very happy, not literally in the sky.' },
  { sentence: 'The lake was as smooth as glass.', answer: 'Simile', explanation: 'This is a simile because it compares the lake to glass using "as."' },
  { sentence: 'My little brother is a tornado when he cleans his room.', answer: 'Metaphor', explanation: 'This is a metaphor because it directly compares him to a tornado.' },
  { sentence: 'The moon followed us home.', answer: 'Personification', explanation: 'This is personification because the moon is given the human ability to follow.' },
  { sentence: 'I waited forever for the bell to ring.', answer: 'Hyperbole', explanation: 'This is hyperbole because "forever" is an exaggeration.' },
  { sentence: 'Before the game, our coach told us to keep our eyes peeled.', answer: 'Idiom', explanation: 'This is an idiom because it means to watch carefully, not literally peel your eyes.' },
  { sentence: 'The baby slept like a rock.', answer: 'Simile', explanation: 'This is a simile because it uses "like" to make a comparison.' },
  { sentence: 'Her voice was music to the audience.', answer: 'Metaphor', explanation: 'This is a metaphor because it directly compares her voice to music.' },
  { sentence: 'The old floorboards groaned under our feet.', answer: 'Personification', explanation: 'This is personification because the floorboards are given a human-like action.' },
  { sentence: 'I am starving to death after practice.', answer: 'Hyperbole', explanation: 'This is hyperbole because the speaker exaggerates how hungry they feel.' },
  { sentence: 'When the teacher changed the deadline, the whole class breathed a sigh of relief.', answer: 'Idiom', explanation: 'This is an idiom because the phrase means everyone felt relieved.' },
];

const essayQuestions: EssayQuestion[] = [
  {
    sentence: 'Which essay type tells about a real experience from the writer\'s life in first person?',
    answer: 'Personal Narrative',
    explanation: 'A personal narrative is first person and focuses on a specific real event, experience, or time.',
  },
  {
    sentence: 'Which essay type uses logic, evidence, and counterarguments to prove a point?',
    answer: 'Persuasive/Argumentative',
    explanation: 'Argumentative writing proves a point with evidence. Persuasive writing tries to convince the reader.',
  },
  {
    sentence: 'Which essay type uses imagery and sensory details to show what something is like?',
    answer: 'Descriptive',
    explanation: 'Descriptive writing creates a detailed picture using the five senses and vivid language.',
  },
  {
    sentence: 'Which essay type explains, describes, or informs the reader using facts?',
    answer: 'Expository',
    explanation: 'Expository writing teaches or explains using facts and logical reasoning.',
  },
  {
    sentence: 'Which essay type explains similarities and differences between two or more topics?',
    answer: 'Compare and Contrast',
    explanation: 'Compare means show similarities. Contrast means show differences.',
  },
  {
    sentence: 'What is the first sentence of an essay called when it hooks the reader with a simile, metaphor, quote, or sourced fact?',
    answer: 'Attention Getter',
    explanation: 'The attention getter hooks the reader before the thesis explains the topic.',
  },
  {
    sentence: 'Which rubric area checks that the essay has an intro paragraph, body paragraph, and concluding paragraph?',
    answer: 'Organization',
    explanation: 'Organization is about putting the essay in the correct order and building each paragraph clearly.',
  },
  {
    sentence: 'Which rubric area covers grammar, punctuation, word choice, spelling, and avoiding contractions in formal writing?',
    answer: 'Conventions',
    explanation: 'Conventions are the correctness rules that make writing clean and readable.',
  },
  {
    sentence: 'Which rubric area means using valid facts, evidence, and sources to prove your point?',
    answer: 'Content and Support',
    explanation: 'Content and support are the proof. Each body paragraph needs factual support and commentary.',
  },
  {
    sentence: 'Which rubric area means writing in your own way instead of copying what everyone else says?',
    answer: 'Originality',
    explanation: 'Originality means making the essay intelligent, relatable, and your own.',
  },
  {
    sentence: 'The first sentence of every body paragraph tells what the paragraph will be about. Which rubric area does that belong to?',
    answer: 'Organization',
    explanation: 'That is the topic sentence, and it helps organize the body paragraph.',
  },
  {
    sentence: 'Which rubric area includes restating the thesis, summarizing the main points, and referring back to the attention getter?',
    answer: 'Organization',
    explanation: 'Those are pieces of a concluding paragraph, so they fit under organization.',
  },
  {
    sentence: 'Which essay type uses ethos, pathos, and logos?',
    answer: 'Persuasive/Argumentative',
    explanation: 'Ethos, pathos, and logos are persuasion and argument tools.',
  },
  {
    sentence: 'Which part of the intro comes before the thesis and should make the reader want to keep reading?',
    answer: 'Attention Getter',
    explanation: 'The hook catches attention first. The thesis at the end of the intro reveals the exact topic.',
  },
];

const vocabEntries: VocabEntry[] = [
  {
    word: 'jaded',
    definition: 'worn out; dulled, as from overindulgence',
    example: 'Even the sun did not cheer our jaded spirits as we trudged through the snow.',
  },
  {
    word: 'jargon',
    definition: 'vocabulary distinctive to a particular group of people',
    example: 'While the jargon of the musicians first amused Sara, she later became irritated with its constant use.',
  },
  {
    word: 'judicious',
    definition: 'showing sound judgment',
    example: 'A judicious manager should treat everyone the same way and not show favoritism.',
  },
  {
    word: 'kindred',
    definition: 'related by birth; of like nature',
    example: 'The boy and his dog were kindred spirits who spent the day running and jumping in the woods.',
  },
  {
    word: 'knead',
    definition: 'to work dough or clay into a uniform mixture',
    example: 'It is easier to knead bread dough with an electric mixer than by hand.',
  },
  {
    word: 'lacerate',
    definition: 'to tear flesh jaggedly',
    example: 'Harsh criticism can cut into one\'s pride just as easily as a sharp knife can lacerate the skin.',
  },
  {
    word: 'lackadaisical',
    definition: 'uninterested; listless',
    example: 'The workers, usually lackadaisical by late afternoon, suddenly moved with great energy.',
  },
  {
    word: 'lackey',
    definition: 'a slavish follower',
    example: 'I will not deal with a lackey; I\'ll talk to the boss or no one.',
  },
  {
    word: 'laggard',
    definition: 'a slow person, especially one who falls behind',
    example: 'If you continue to be such a laggard, you\'ll never get out of school.',
  },
  {
    word: 'lament',
    definition: 'to mourn',
    example: 'Thousands of devoted fans lamented the death of the popular singer.',
  },
  {
    word: 'lampoon',
    definition: 'a written satire used to ridicule or attack someone',
    example: 'The lampoon he wrote in the school newspaper angered the football coach and the principal.',
  },
  {
    word: 'languish',
    definition: 'to become weak or feeble',
    example: 'When one becomes depressed, it is easy to languish and lose all hope.',
  },
  {
    word: 'lateral',
    definition: 'to the side',
    example: 'The quarterback made a lateral pass to the fullback.',
  },
  {
    word: 'lax',
    definition: 'careless or negligent',
    example: 'Don\'t become too lax in your studies, or you\'ll fail.',
  },
  {
    word: 'lethal',
    definition: 'deadly; fatal',
    example: 'Because the fumes from the lethal gas were overpowering, many people collapsed.',
  },
  {
    word: 'licentious',
    definition: 'morally unrestrained',
    example: 'Like St. Augustine, many people desire to give up a licentious life, but not just yet.',
  },
  {
    word: 'macabre',
    definition: 'horrible; grim',
    example: 'Dr. Jekyll\'s clean-cut features faded and were replaced by the macabre face of the hideous Mr. Hyde.',
  },
  {
    word: 'mandarin',
    definition: 'an influential person',
    example: 'There were nine classes of mandarins in the Chinese Empire.',
  },
  {
    word: 'martial',
    definition: 'warlike; military',
    example: 'After being defeated, the small country was ruled by martial law for several months.',
  },
  {
    word: 'melee',
    definition: 'a noisy, confused fight',
    example: 'By the time the police arrived, the melee was over.',
  },
  {
    word: 'mendicant',
    definition: 'a beggar',
    example: 'Although he was a mendicant, he begged not for himself but for the poor and hungry.',
  },
  {
    word: 'mesmerize',
    definition: 'to hypnotize',
    example: 'The exquisite music and spinning dancers mesmerized the audience.',
  },
  {
    word: 'minion',
    definition: 'a fawning, servile follower',
    example: 'Although only a minion who usually ran errands, on occasion he filled in for the "great one."',
  },
  {
    word: 'mitigate',
    definition: 'to make less severe; to become milder',
    example: 'The death of the two recruits did not serve to mitigate the rigors of our basic training.',
  },
  {
    word: 'modicum',
    definition: 'a small amount',
    example: 'A modicum of relief from the heat came in the form of a sudden shower.',
  },
  {
    word: 'nadir',
    definition: 'the lowest point',
    example: 'Because of the violence and inhumanity, many thought that civilization had reached its nadir during this period.',
  },
  {
    word: 'narcissistic',
    definition: 'conceited; having excessive self-love and self-absorption',
    example: 'The child star\'s narcissistic attitude kept her from having any friends.',
  },
  {
    word: 'nefarious',
    definition: 'very wicked',
    example: 'One of the most nefarious characters of the Old West was Billy the Kid.',
  },
  {
    word: 'nemesis',
    definition: 'someone or something a person cannot conquer; a hated enemy',
    example: 'Do you know the name of Sherlock Holmes\' nemesis?',
  },
  {
    word: 'neophyte',
    definition: 'a beginner',
    example: 'Although only a neophyte, she outshone the more seasoned performers.',
  },
];

function shuffle<T>(items: T[]) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function takeRandom<T>(items: T[], count: number) {
  return shuffle(items).slice(0, count);
}

function buildDeck() {
  return shuffle([
    ...takeRandom(simpleQuestions, QUESTIONS_PER_TYPE),
    ...takeRandom(compoundQuestions, QUESTIONS_PER_TYPE),
    ...takeRandom(complexQuestions, QUESTIONS_PER_TYPE),
    ...takeRandom(compoundComplexQuestions, QUESTIONS_PER_TYPE),
  ]);
}

function buildVocabDeck() {
  return shuffle(vocabEntries).map((entry) => {
    const wrongOptions = shuffle(
      vocabEntries
        .filter((candidate) => candidate.word !== entry.word)
        .map((candidate) => candidate.definition),
    ).slice(0, 3);

    return {
      word: entry.word,
      definition: entry.definition,
      example: entry.example,
      options: shuffle([entry.definition, ...wrongOptions]),
    };
  });
}

function buildFigurativeDeck() {
  const grouped = figurativeTypes.flatMap((type) =>
    takeRandom(
      figurativeQuestions.filter((question) => question.answer === type),
      FIGURATIVE_PER_TYPE,
    ),
  );

  return shuffle(grouped).map((entry) => ({
    ...entry,
    options: shuffle(figurativeTypes),
  }));
}

function buildPartsDeck() {
  return shuffle(partOfSpeechQuestions).map((entry) => ({
    ...entry,
    options: shuffle(entry.options ?? partOfSpeechTypes),
  }));
}

function buildPunctuationDeck() {
  return takeRandom(punctuationQuestions, PUNCTUATION_QUESTION_COUNT);
}

function buildSentenceRulesDeck() {
  return shuffle(sentenceRuleQuestions).map((entry) => ({
    ...entry,
    options: shuffle(entry.options),
  }));
}

function buildEssayDeck() {
  return shuffle(essayQuestions).map((entry) => ({
    ...entry,
    options: shuffle([
      entry.answer,
      ...shuffle(essayTypes.filter((type) => type !== entry.answer)).slice(0, 3),
    ]),
  }));
}

function getPunctuationWords(question?: PunctuationQuestion) {
  return question?.text.split(' ') ?? [];
}

function getPunctuationAnswer(question: PunctuationQuestion, slotIndex: number): PunctuationMark {
  return question.answers[slotIndex] ?? '';
}

export default function EnglishSentencePractice() {
  const [activeTab, setActiveTab] = useState<PracticeTab>('structure');
  const [structureMode, setStructureMode] = useState<StructureMode>('types');
  const [deck, setDeck] = useState(() => buildDeck());
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<SentenceType | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [punctuationDeck, setPunctuationDeck] = useState(() => buildPunctuationDeck());
  const [punctuationIndex, setPunctuationIndex] = useState(0);
  const [punctuationMarks, setPunctuationMarks] = useState<PunctuationMark[]>([]);
  const [punctuationSubmitted, setPunctuationSubmitted] = useState(false);
  const [punctuationCorrectCount, setPunctuationCorrectCount] = useState(0);
  const [punctuationStreak, setPunctuationStreak] = useState(0);
  const [sentenceRulesDeck, setSentenceRulesDeck] = useState(() => buildSentenceRulesDeck());
  const [sentenceRulesIndex, setSentenceRulesIndex] = useState(0);
  const [sentenceRulesSelected, setSentenceRulesSelected] = useState<SentenceRuleAnswer | null>(null);
  const [sentenceRulesCorrectCount, setSentenceRulesCorrectCount] = useState(0);
  const [sentenceRulesStreak, setSentenceRulesStreak] = useState(0);
  const [partsDeck, setPartsDeck] = useState(() => buildPartsDeck());
  const [partsIndex, setPartsIndex] = useState(0);
  const [partsSelected, setPartsSelected] = useState<string | null>(null);
  const [partsCorrectCount, setPartsCorrectCount] = useState(0);
  const [partsStreak, setPartsStreak] = useState(0);
  const [essayDeck, setEssayDeck] = useState(() => buildEssayDeck());
  const [essayIndex, setEssayIndex] = useState(0);
  const [essaySelected, setEssaySelected] = useState<EssayType | null>(null);
  const [essayCorrectCount, setEssayCorrectCount] = useState(0);
  const [essayStreak, setEssayStreak] = useState(0);
  const [figurativeDeck, setFigurativeDeck] = useState(() => buildFigurativeDeck());
  const [figurativeIndex, setFigurativeIndex] = useState(0);
  const [figurativeSelected, setFigurativeSelected] = useState<FigurativeType | null>(null);
  const [figurativeCorrectCount, setFigurativeCorrectCount] = useState(0);
  const [figurativeStreak, setFigurativeStreak] = useState(0);

  const current = deck[index];
  const isDone = index >= deck.length;
  const isCorrect = selected === current?.answer;
  const answered = selected !== null;
  const progress = deck.length === 0 ? 0 : Math.round((index / deck.length) * 100);

  const currentPunctuation = punctuationDeck[punctuationIndex];
  const currentPunctuationWords = getPunctuationWords(currentPunctuation);
  const punctuationDone = punctuationIndex >= punctuationDeck.length;
  const punctuationIsCorrect = currentPunctuation
    ? currentPunctuationWords
      .slice(0, -1)
      .every((_, slotIndex) => (punctuationMarks[slotIndex] ?? '') === getPunctuationAnswer(currentPunctuation, slotIndex))
    : false;
  const punctuationProgress =
    punctuationDeck.length === 0 ? 0 : Math.round((punctuationIndex / punctuationDeck.length) * 100);

  const currentSentenceRule = sentenceRulesDeck[sentenceRulesIndex];
  const sentenceRulesDone = sentenceRulesIndex >= sentenceRulesDeck.length;
  const sentenceRulesIsCorrect = sentenceRulesSelected === currentSentenceRule?.answer;
  const sentenceRulesAnswered = sentenceRulesSelected !== null;
  const sentenceRulesProgress =
    sentenceRulesDeck.length === 0 ? 0 : Math.round((sentenceRulesIndex / sentenceRulesDeck.length) * 100);

  const currentParts = partsDeck[partsIndex];
  const partsDone = partsIndex >= partsDeck.length;
  const partsIsCorrect = partsSelected === currentParts?.answer;
  const partsAnswered = partsSelected !== null;
  const partsProgress = partsDeck.length === 0 ? 0 : Math.round((partsIndex / partsDeck.length) * 100);
  const currentEssay = essayDeck[essayIndex];
  const essayDone = essayIndex >= essayDeck.length;
  const essayIsCorrect = essaySelected === currentEssay?.answer;
  const essayAnswered = essaySelected !== null;
  const essayProgress = essayDeck.length === 0 ? 0 : Math.round((essayIndex / essayDeck.length) * 100);
  const currentFigurative = figurativeDeck[figurativeIndex];
  const figurativeDone = figurativeIndex >= figurativeDeck.length;
  const figurativeIsCorrect = figurativeSelected === currentFigurative?.answer;
  const figurativeAnswered = figurativeSelected !== null;
  const figurativeProgress = figurativeDeck.length === 0 ? 0 : Math.round((figurativeIndex / figurativeDeck.length) * 100);

  function handleAnswer(choice: SentenceType) {
    if (answered || !current) return;
    setSelected(choice);
    if (choice === current.answer) {
      setCorrectCount((count) => count + 1);
      setStreak((count) => count + 1);
      return;
    }
    setStreak(0);
  }

  function nextQuestion() {
    if (!answered) return;
    setSelected(null);
    setIndex((value) => value + 1);
  }

  function restart() {
    setDeck(buildDeck());
    setIndex(0);
    setSelected(null);
    setCorrectCount(0);
    setStreak(0);
  }

  function cyclePunctuation(slotIndex: number) {
    if (punctuationSubmitted) return;
    const choices: PunctuationMark[] = ['', ',', ';'];
    setPunctuationMarks((marks) => {
      const slotCount = Math.max(currentPunctuationWords.length - 1, 0);
      const paddedMarks = Array.from({ length: slotCount }, (_, index) => marks[index] ?? '') as PunctuationMark[];
      return paddedMarks.map((mark, index) => {
        if (index !== slotIndex) return mark;
        return choices[(choices.indexOf(mark) + 1) % choices.length];
      });
    });
  }

  function submitPunctuation() {
    if (punctuationSubmitted || !currentPunctuation) return;
    setPunctuationSubmitted(true);
    if (punctuationIsCorrect) {
      setPunctuationCorrectCount((count) => count + 1);
      setPunctuationStreak((count) => count + 1);
      return;
    }
    setPunctuationStreak(0);
  }

  function nextPunctuationQuestion() {
    if (!punctuationSubmitted) return;
    const nextIndex = punctuationIndex + 1;
    const nextQuestion = punctuationDeck[nextIndex];
    setPunctuationIndex(nextIndex);
    setPunctuationMarks([]);
    setPunctuationSubmitted(false);
  }

  function restartPunctuation() {
    const nextDeck = buildPunctuationDeck();
    setPunctuationDeck(nextDeck);
    setPunctuationIndex(0);
    setPunctuationMarks([]);
    setPunctuationSubmitted(false);
    setPunctuationCorrectCount(0);
    setPunctuationStreak(0);
  }

  function handleSentenceRulesAnswer(choice: SentenceRuleAnswer) {
    if (sentenceRulesAnswered || !currentSentenceRule) return;
    setSentenceRulesSelected(choice);
    if (choice === currentSentenceRule.answer) {
      setSentenceRulesCorrectCount((count) => count + 1);
      setSentenceRulesStreak((count) => count + 1);
      return;
    }
    setSentenceRulesStreak(0);
  }

  function nextSentenceRuleQuestion() {
    if (!sentenceRulesAnswered) return;
    setSentenceRulesSelected(null);
    setSentenceRulesIndex((value) => value + 1);
  }

  function restartSentenceRules() {
    setSentenceRulesDeck(buildSentenceRulesDeck());
    setSentenceRulesIndex(0);
    setSentenceRulesSelected(null);
    setSentenceRulesCorrectCount(0);
    setSentenceRulesStreak(0);
  }

  function handleFigurativeAnswer(choice: FigurativeType) {
    if (figurativeAnswered || !currentFigurative) return;
    setFigurativeSelected(choice);
    if (choice === currentFigurative.answer) {
      setFigurativeCorrectCount((count) => count + 1);
      setFigurativeStreak((count) => count + 1);
      return;
    }
    setFigurativeStreak(0);
  }

  function nextFigurativeQuestion() {
    if (!figurativeAnswered) return;
    setFigurativeSelected(null);
    setFigurativeIndex((value) => value + 1);
  }

  function restartFigurative() {
    setFigurativeDeck(buildFigurativeDeck());
    setFigurativeIndex(0);
    setFigurativeSelected(null);
    setFigurativeCorrectCount(0);
    setFigurativeStreak(0);
  }

  function handlePartsAnswer(choice: string) {
    if (partsAnswered || !currentParts) return;
    setPartsSelected(choice);
    if (choice === currentParts.answer) {
      setPartsCorrectCount((count) => count + 1);
      setPartsStreak((count) => count + 1);
      return;
    }
    setPartsStreak(0);
  }

  function nextPartsQuestion() {
    if (!partsAnswered) return;
    setPartsSelected(null);
    setPartsIndex((value) => value + 1);
  }

  function restartParts() {
    setPartsDeck(buildPartsDeck());
    setPartsIndex(0);
    setPartsSelected(null);
    setPartsCorrectCount(0);
    setPartsStreak(0);
  }

  function handleEssayAnswer(choice: EssayType) {
    if (essayAnswered || !currentEssay) return;
    setEssaySelected(choice);
    if (choice === currentEssay.answer) {
      setEssayCorrectCount((count) => count + 1);
      setEssayStreak((count) => count + 1);
      return;
    }
    setEssayStreak(0);
  }

  function nextEssayQuestion() {
    if (!essayAnswered) return;
    setEssaySelected(null);
    setEssayIndex((value) => value + 1);
  }

  function restartEssay() {
    setEssayDeck(buildEssayDeck());
    setEssayIndex(0);
    setEssaySelected(null);
    setEssayCorrectCount(0);
    setEssayStreak(0);
  }

  return (
    <div className="english-app">
      <div className="glow glow-a" />
      <div className="glow glow-b" />

      <main className="shell">
        <section className="hero">
          <div className="tab-row">
            <button
              className={activeTab === 'structure' ? 'tab-bubble active' : 'tab-bubble'}
              onClick={() => setActiveTab('structure')}
            >
              Sentence Structure
            </button>
            <button
              className={activeTab === 'parts' ? 'tab-bubble active' : 'tab-bubble'}
              onClick={() => setActiveTab('parts')}
            >
              Grammar Basics
            </button>
            <button
              className={activeTab === 'essays' ? 'tab-bubble active' : 'tab-bubble'}
              onClick={() => setActiveTab('essays')}
            >
              Essay Writing
            </button>
            <button
              className={activeTab === 'figurative' ? 'tab-bubble active' : 'tab-bubble'}
              onClick={() => setActiveTab('figurative')}
            >
              Figurative Language
            </button>
          </div>

          <div className="eyebrow">
            {activeTab === 'structure'
              ? 'Sentence Structure'
              : activeTab === 'figurative'
                ? 'Figurative Language'
                : activeTab === 'essays'
                  ? 'Essay Writing'
                  : 'Grammar Basics'}
          </div>
          <h1>
            {activeTab === 'structure'
              ? 'Sentence Structure Trainer'
              : activeTab === 'figurative'
                ? 'Figurative Language Trainer'
                : activeTab === 'essays'
                  ? 'Essay Writing Trainer'
                  : 'Parts of Speech Trainer'}
          </h1>
          <p className="hero-copy">
            {activeTab === 'structure'
              ? 'Read each sentence and choose whether it is simple, compound, complex, or compound-complex. Watch for complete sentences, FANBOYS, semicolons, and dependent clauses.'
              : activeTab === 'figurative'
                ? 'Read each sentence and choose which type of figurative language it uses.'
                : activeTab === 'essays'
                  ? 'Review essay types and rubric pieces like attention getters, organization, conventions, support, and originality.'
                  : 'Use the notes to spot nouns, verbs, pronouns, conjunctions, adjectives, adverbs, prepositions, and interjections.'}
          </p>

          {activeTab === 'structure' && (
            <div className="hint-grid">
              <div className="hint-card">
                <strong>Simple</strong>
                <span>1 independent clause</span>
              </div>
              <div className="hint-card">
                <strong>Compound</strong>
                <span>2 complete sentences joined by a semicolon or comma + FANBOYS</span>
              </div>
              <div className="hint-card">
                <strong>Complex</strong>
                <span>1 independent clause + 1 dependent clause that often starts with a subordinating conjunction</span>
              </div>
              <div className="hint-card">
                <strong>Compound-Complex</strong>
                <span>2 independent + 1 dependent clause</span>
              </div>
            </div>
          )}

          {activeTab === 'parts' && (
            <div className="hint-grid parts-hint-grid">
              <div className="hint-card">
                <strong>Nouns</strong>
                <span>People, places, things, or ideas. Common nouns name general things. Proper nouns name specific ones.</span>
              </div>
              <div className="hint-card">
                <strong>Verbs</strong>
                <span>Action or linking words. Complete sentences need a noun/pronoun and a verb.</span>
              </div>
              <div className="hint-card">
                <strong>Pronouns</strong>
                <span>Words that replace nouns, like he, she, it, they, we, us, and me.</span>
              </div>
              <div className="hint-card">
                <strong>Conjunctions</strong>
                <span>Connecting words. FANBOYS are coordinating conjunctions. Because, when, if, and although are subordinating conjunctions.</span>
              </div>
              <div className="hint-card">
                <strong>Adjectives</strong>
                <span>Words that describe nouns.</span>
              </div>
              <div className="hint-card">
                <strong>Adverbs</strong>
                <span>Words that describe verbs. They often end in -ly, like quickly or carefully.</span>
              </div>
              <div className="hint-card">
                <strong>Prepositions</strong>
                <span>Words that begin detail phrases, like during, above, across, after, against, among, and around.</span>
              </div>
              <div className="hint-card">
                <strong>Interjections</strong>
                <span>Strong-feeling words, often one-word sentences with an exclamation point, like Ouch!</span>
              </div>
            </div>
          )}

          {activeTab === 'essays' && (
            <div className="hint-grid essay-hint-grid">
              <div className="hint-card">
                <strong>Essay Types</strong>
                <span>Personal narrative, persuasive/argumentative, descriptive, expository, and compare/contrast each have a different purpose.</span>
              </div>
              <div className="hint-card">
                <strong>Intro</strong>
                <span>Start with an attention getter, then build toward a clear thesis at the end of the first paragraph.</span>
              </div>
              <div className="hint-card">
                <strong>Body</strong>
                <span>Begin with a topic sentence, then use valid support and commentary to prove the thesis.</span>
              </div>
              <div className="hint-card">
                <strong>Conclusion</strong>
                <span>Restate the thesis, summarize the main points, and connect back to the attention getter.</span>
              </div>
            </div>
          )}

          {activeTab === 'figurative' && (
            <div className="hint-grid">
              <div className="hint-card">
                <strong>Simile</strong>
                <span>Comparison using like or as</span>
              </div>
              <div className="hint-card">
                <strong>Metaphor</strong>
                <span>Direct comparison without like or as</span>
              </div>
              <div className="hint-card">
                <strong>Personification</strong>
                <span>Gives human traits to nonhuman things</span>
              </div>
              <div className="hint-card">
                <strong>Hyperbole</strong>
                <span>Extreme exaggeration</span>
              </div>
              <div className="hint-card hint-card-wide">
                <strong>Idiom</strong>
                <span>A phrase that means something different from the literal words</span>
              </div>
            </div>
          )}
        </section>

        {activeTab === 'structure' ? (
          <section className="board">
            <div className="mode-row">
              <button
                className={structureMode === 'types' ? 'mode-card active' : 'mode-card'}
                onClick={() => setStructureMode('types')}
              >
                <strong>Sentence Type</strong>
                <span>Pick simple, compound, complex, or compound-complex.</span>
              </button>
              <button
                className={structureMode === 'punctuation' ? 'mode-card active' : 'mode-card'}
                onClick={() => setStructureMode('punctuation')}
              >
                <strong>Commas and Semicolons</strong>
                <span>Click between words to add commas or semicolons.</span>
              </button>
            </div>

            {structureMode === 'types' ? (
              <>
            <div className="stats">
              <div className="stat-chip">Score: {correctCount}/{deck.length}</div>
              <div className="stat-chip">Streak: {streak}</div>
              <div className="stat-chip">Progress: {progress}%</div>
            </div>

            <div className="progress-track" aria-hidden="true">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>

            {isDone ? (
              <div className="result-card">
                <p className="result-label">Finished</p>
                <h2>You got {correctCount} out of {deck.length}</h2>
                <p className="result-copy">
                  {correctCount === deck.length
                    ? 'Perfect. You crushed it.'
                    : correctCount >= deck.length * 0.8
                      ? 'Nice work. You are in solid shape.'
                      : 'Run it again once or twice and the patterns will start to stick.'}
                </p>
                <button className="primary-btn" onClick={restart}>Try Again</button>
              </div>
            ) : (
              <div className="question-card">
                <div className="question-topline">Question {index + 1} of {deck.length}</div>
                <p className="sentence">{current.sentence}</p>

                <div className="answer-grid">
                  {sentenceTypes.map((type) => {
                    let className = 'answer-btn';
                    if (answered && type === current.answer) className += ' correct';
                    if (answered && selected === type && type !== current.answer) className += ' wrong';

                    return (
                      <button
                        key={type}
                        className={className}
                        onClick={() => handleAnswer(type)}
                        disabled={answered}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>

                {answered && (
                  <div className={isCorrect ? 'feedback success' : 'feedback error'}>
                    <p className="feedback-title">
                      {isCorrect ? 'Correct' : `Not quite. The answer is ${current.answer}.`}
                    </p>
                    <p className="feedback-copy">{current.explanation}</p>
                    <button className="primary-btn" onClick={nextQuestion}>
                      {index === deck.length - 1 ? 'See Score' : 'Next Sentence'}
                    </button>
                  </div>
                )}
              </div>
            )}
              </>
            ) : (
              <>
            <div className="stats">
              <div className="stat-chip">Score: {punctuationCorrectCount}/{punctuationDeck.length}</div>
              <div className="stat-chip">Streak: {punctuationStreak}</div>
              <div className="stat-chip">Progress: {punctuationProgress}%</div>
            </div>

            <div className="progress-track" aria-hidden="true">
              <div className="progress-fill" style={{ width: `${punctuationProgress}%` }} />
            </div>

            {punctuationDone ? (
              <div className="result-card">
                <p className="result-label">Finished</p>
                <h2>You got {punctuationCorrectCount} out of {punctuationDeck.length}</h2>
                <p className="result-copy">
                  {punctuationCorrectCount === punctuationDeck.length
                    ? 'Perfect. Those punctuation rules are locked in.'
                    : punctuationCorrectCount >= punctuationDeck.length * 0.8
                      ? 'Nice work. The punctuation patterns are getting easier to spot.'
                      : 'Run it again and focus on where the sentence parts connect.'}
                </p>
                <button className="primary-btn" onClick={restartPunctuation}>Try Again</button>
              </div>
            ) : (
              <div className="question-card">
                <div className="question-topline">Question {punctuationIndex + 1} of {punctuationDeck.length}</div>
                <p className="parts-prompt">Add the correct punctuation by clicking between the words.</p>

                <div className="punctuation-builder">
                  {currentPunctuationWords.map((word, wordIndex) => (
                    <span key={`${word}-${wordIndex}`} className="punctuation-piece">
                      <span>{word}</span>
                      {wordIndex < currentPunctuationWords.length - 1 && (
                      <button
                        className={
                          punctuationSubmitted
                            ? (punctuationMarks[wordIndex] ?? '') === getPunctuationAnswer(currentPunctuation, wordIndex)
                              ? 'punctuation-slot correct'
                              : 'punctuation-slot wrong'
                            : 'punctuation-slot'
                        }
                        onClick={() => cyclePunctuation(wordIndex)}
                        disabled={punctuationSubmitted}
                        aria-label={`Punctuation after ${word}`}
                      >
                        {punctuationMarks[wordIndex]}
                      </button>
                      )}
                    </span>
                  ))}
                </div>

                {!punctuationSubmitted ? (
                  <button className="primary-btn" onClick={submitPunctuation}>Check It</button>
                ) : (
                  <div className={punctuationIsCorrect ? 'feedback success' : 'feedback error'}>
                    <p className="feedback-title">
                      {punctuationIsCorrect ? 'Correct' : 'Not quite. Check the punctuation spots.'}
                    </p>
                    <p className="feedback-copy">{currentPunctuation.explanation}</p>
                    <button className="primary-btn" onClick={nextPunctuationQuestion}>
                      {punctuationIndex === punctuationDeck.length - 1 ? 'See Score' : 'Next Question'}
                    </button>
                  </div>
                )}
              </div>
            )}
              </>
            )}
          </section>
        ) : activeTab === 'essays' ? (
          <section className="board">
            <div className="stats">
              <div className="stat-chip">Score: {essayCorrectCount}/{essayDeck.length}</div>
              <div className="stat-chip">Streak: {essayStreak}</div>
              <div className="stat-chip">Progress: {essayProgress}%</div>
            </div>

            <div className="progress-track" aria-hidden="true">
              <div className="progress-fill" style={{ width: `${essayProgress}%` }} />
            </div>

            {essayDone ? (
              <div className="result-card">
                <p className="result-label">Finished</p>
                <h2>You got {essayCorrectCount} out of {essayDeck.length}</h2>
                <p className="result-copy">
                  {essayCorrectCount === essayDeck.length
                    ? 'Perfect. You know the essay notes cold.'
                    : essayCorrectCount >= essayDeck.length * 0.8
                      ? 'Nice work. The essay types and rubric parts are mostly sticking.'
                      : 'Run it again and focus on the job each essay part is supposed to do.'}
                </p>
                <button className="primary-btn" onClick={restartEssay}>Try Again</button>
              </div>
            ) : (
              <div className="question-card">
                <div className="question-topline">Question {essayIndex + 1} of {essayDeck.length}</div>
                <p className="sentence parts-sentence">{currentEssay.sentence}</p>

                <div className="answer-grid answer-grid-essay">
                  {currentEssay.options.map((option) => {
                    let className = 'answer-btn';
                    if (essayAnswered && option === currentEssay.answer) className += ' correct';
                    if (essayAnswered && essaySelected === option && option !== currentEssay.answer) className += ' wrong';

                    return (
                      <button
                        key={option}
                        className={className}
                        onClick={() => handleEssayAnswer(option)}
                        disabled={essayAnswered}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>

                {essayAnswered && (
                  <div className={essayIsCorrect ? 'feedback success' : 'feedback error'}>
                    <p className="feedback-title">
                      {essayIsCorrect ? 'Correct' : `Not quite. The answer is ${currentEssay.answer}.`}
                    </p>
                    <p className="feedback-copy">{currentEssay.explanation}</p>
                    <button className="primary-btn" onClick={nextEssayQuestion}>
                      {essayIndex === essayDeck.length - 1 ? 'See Score' : 'Next Question'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
        ) : activeTab === 'figurative' ? (
          <section className="board">
            <div className="stats">
              <div className="stat-chip">Score: {figurativeCorrectCount}/{figurativeDeck.length}</div>
              <div className="stat-chip">Streak: {figurativeStreak}</div>
              <div className="stat-chip">Progress: {figurativeProgress}%</div>
            </div>

            <div className="progress-track" aria-hidden="true">
              <div className="progress-fill" style={{ width: `${figurativeProgress}%` }} />
            </div>

            {figurativeDone ? (
              <div className="result-card">
                <p className="result-label">Finished</p>
                <h2>You got {figurativeCorrectCount} out of {figurativeDeck.length}</h2>
                <p className="result-copy">
                  {figurativeCorrectCount === figurativeDeck.length
                    ? 'Perfect. You spotted every one.'
                    : figurativeCorrectCount >= figurativeDeck.length * 0.8
                      ? 'Nice work. You are catching the patterns.'
                      : 'Run it again and focus on the clue words in each sentence.'}
                </p>
                <button className="primary-btn" onClick={restartFigurative}>Try Again</button>
              </div>
            ) : (
              <div className="question-card">
                <div className="question-topline">Question {figurativeIndex + 1} of {figurativeDeck.length}</div>
                <p className="sentence">{currentFigurative.sentence}</p>

                <div className="answer-grid answer-grid-figurative">
                  {currentFigurative.options.map((type) => {
                    let className = 'answer-btn';
                    if (figurativeAnswered && type === currentFigurative.answer) className += ' correct';
                    if (figurativeAnswered && figurativeSelected === type && type !== currentFigurative.answer) className += ' wrong';

                    return (
                      <button
                        key={type}
                        className={className}
                        onClick={() => handleFigurativeAnswer(type)}
                        disabled={figurativeAnswered}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>

                {figurativeAnswered && (
                  <div className={figurativeIsCorrect ? 'feedback success' : 'feedback error'}>
                    <p className="feedback-title">
                      {figurativeIsCorrect ? 'Correct' : `Not quite. The answer is ${currentFigurative.answer}.`}
                    </p>
                    <p className="feedback-copy">{currentFigurative.explanation}</p>
                    <button className="primary-btn" onClick={nextFigurativeQuestion}>
                      {figurativeIndex === figurativeDeck.length - 1 ? 'See Score' : 'Next Sentence'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
        ) : (
          <section className="board">
            <div className="stats">
              <div className="stat-chip">Score: {partsCorrectCount}/{partsDeck.length}</div>
              <div className="stat-chip">Streak: {partsStreak}</div>
              <div className="stat-chip">Progress: {partsProgress}%</div>
            </div>

            <div className="progress-track" aria-hidden="true">
              <div className="progress-fill" style={{ width: `${partsProgress}%` }} />
            </div>

            {partsDone ? (
              <div className="result-card">
                <p className="result-label">Finished</p>
                <h2>You got {partsCorrectCount} out of {partsDeck.length}</h2>
                <p className="result-copy">
                  {partsCorrectCount === partsDeck.length
                    ? 'Perfect. You know these grammar basics cold.'
                    : partsCorrectCount >= partsDeck.length * 0.8
                      ? 'Nice work. One more round and the parts of speech should stick.'
                      : 'Run it again and focus on what job each word is doing in the sentence.'}
                </p>
                <button className="primary-btn" onClick={restartParts}>Try Again</button>
              </div>
            ) : (
              <div className="question-card">
                <div className="question-topline">Question {partsIndex + 1} of {partsDeck.length}</div>
                <p className="parts-prompt">{currentParts.prompt}</p>
                <p className="sentence parts-sentence">{currentParts.sentence}</p>

                <div className="answer-grid answer-grid-parts">
                  {currentParts.options.map((option) => {
                    let className = 'answer-btn';
                    if (partsAnswered && option === currentParts.answer) className += ' correct';
                    if (partsAnswered && partsSelected === option && option !== currentParts.answer) className += ' wrong';

                    return (
                      <button
                        key={option}
                        className={className}
                        onClick={() => handlePartsAnswer(option)}
                        disabled={partsAnswered}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>

                {partsAnswered && (
                  <div className={partsIsCorrect ? 'feedback success' : 'feedback error'}>
                    <p className="feedback-title">
                      {partsIsCorrect ? 'Correct' : `Not quite. The answer is ${currentParts.answer}.`}
                    </p>
                    <p className="feedback-copy">{currentParts.explanation}</p>
                    <button className="primary-btn" onClick={nextPartsQuestion}>
                      {partsIndex === partsDeck.length - 1 ? 'See Score' : 'Next Question'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
        )}
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Manrope:wght@400;500;700;800&display=swap');

        :global(body) {
          margin: 0;
          min-height: 100vh;
          background:
            radial-gradient(circle at top, rgba(255, 244, 196, 0.9), transparent 28%),
            radial-gradient(circle at 80% 20%, rgba(255, 170, 144, 0.45), transparent 25%),
            linear-gradient(160deg, #fff7ec 0%, #ffe8d2 45%, #ffd7b8 100%);
          color: #3c2c1c;
        }

        .english-app {
          position: relative;
          overflow: hidden;
          min-height: 100vh;
          font-family: 'Manrope', sans-serif;
        }

        .glow {
          position: fixed;
          border-radius: 999px;
          filter: blur(40px);
          opacity: 0.5;
          pointer-events: none;
        }

        .glow-a {
          width: 18rem;
          height: 18rem;
          background: rgba(255, 123, 90, 0.32);
          top: -4rem;
          left: -3rem;
        }

        .glow-b {
          width: 22rem;
          height: 22rem;
          background: rgba(255, 214, 102, 0.26);
          right: -5rem;
          bottom: -4rem;
        }

        .shell {
          position: relative;
          z-index: 1;
          max-width: 58rem;
          margin: 0 auto;
          padding: 2rem 1rem 3rem;
        }

        .hero {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .tab-row {
          display: flex;
          justify-content: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .tab-bubble {
          border: 1px solid rgba(167, 103, 57, 0.18);
          background: rgba(255, 255, 255, 0.72);
          color: #9b4d1f;
          padding: 0.8rem 1.15rem;
          border-radius: 999px;
          font: inherit;
          font-weight: 800;
          cursor: pointer;
          transition: transform 160ms ease, background 160ms ease, box-shadow 160ms ease;
        }

        .tab-bubble:hover {
          transform: translateY(-1px);
        }

        .tab-bubble.active {
          background: linear-gradient(135deg, #ff9d6c 0%, #ffbf7d 100%);
          color: #fffaf3;
          box-shadow: 0 12px 24px rgba(155, 77, 31, 0.2);
        }

        .eyebrow {
          display: inline-block;
          padding: 0.45rem 0.8rem;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.72);
          border: 1px solid rgba(167, 103, 57, 0.18);
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #9b4d1f;
        }

        h1 {
          margin: 0.9rem 0 0.6rem;
          font-family: 'Fredoka', sans-serif;
          font-size: clamp(2.3rem, 7vw, 4.6rem);
          line-height: 0.95;
          color: #7c2d12;
        }

        .hero-copy {
          max-width: 38rem;
          margin: 0 auto;
          font-size: 1rem;
          line-height: 1.6;
          color: #6c4a2e;
        }

        .hint-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.8rem;
          margin-top: 1.4rem;
        }

        .hint-card,
        .question-card,
        .result-card,
        .board {
          background: rgba(255, 255, 255, 0.78);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(167, 103, 57, 0.16);
          box-shadow: 0 18px 45px rgba(122, 63, 24, 0.12);
        }

        .hint-card {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          padding: 1rem;
          border-radius: 1.1rem;
          text-align: left;
        }

        .hint-card-wide {
          grid-column: 1 / -1;
        }

        .hint-card strong {
          font-size: 1rem;
          color: #7c2d12;
        }

        .hint-card span {
          font-size: 0.92rem;
          color: #7a5a3d;
        }

        .board {
          padding: 1rem;
          border-radius: 1.6rem;
        }

        .stats {
          display: flex;
          flex-wrap: wrap;
          gap: 0.7rem;
          margin-bottom: 0.9rem;
        }

        .mode-row {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.8rem;
          margin-bottom: 1rem;
        }

        .mode-card {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          min-height: 5.25rem;
          padding: 1rem;
          border-radius: 1.1rem;
          border: 1px solid rgba(167, 103, 57, 0.16);
          background: rgba(255, 255, 255, 0.72);
          color: #7c2d12;
          font: inherit;
          text-align: left;
          cursor: pointer;
        }

        .mode-card strong {
          font-size: 1rem;
        }

        .mode-card span {
          font-size: 0.9rem;
          line-height: 1.4;
          color: #6c4a2e;
        }

        .mode-card.active {
          background: linear-gradient(135deg, #ff9d6c 0%, #ffbf7d 100%);
          color: #fffaf3;
          box-shadow: 0 12px 24px rgba(155, 77, 31, 0.2);
        }

        .mode-card.active span {
          color: #fffaf3;
        }

        .stat-chip {
          padding: 0.65rem 0.9rem;
          border-radius: 999px;
          background: #fff8f0;
          border: 1px solid rgba(167, 103, 57, 0.15);
          font-weight: 700;
          font-size: 0.92rem;
          color: #7c2d12;
        }

        .progress-track {
          height: 0.8rem;
          border-radius: 999px;
          background: rgba(255, 233, 211, 0.9);
          overflow: hidden;
          margin-bottom: 1rem;
        }

        .progress-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #fb923c, #f97316, #ea580c);
          transition: width 180ms ease;
        }

        .question-card,
        .result-card {
          border-radius: 1.4rem;
          padding: 1.2rem;
        }

        .question-topline,
        .result-label {
          font-size: 0.85rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #b45309;
        }

        .sentence {
          margin: 0.9rem 0 1rem;
          font-size: clamp(1.3rem, 4vw, 2rem);
          line-height: 1.4;
          font-weight: 800;
          color: #3c2c1c;
        }

        .vocab-word {
          text-transform: lowercase;
        }

        .parts-prompt {
          margin: 0.65rem 0 0;
          font-size: 1.05rem;
          line-height: 1.5;
          font-weight: 800;
          color: #9b4d1f;
        }

        .parts-sentence {
          margin-top: 0.45rem;
        }

        .punctuation-builder {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.25rem 0.4rem;
          margin: 1.1rem 0 0.2rem;
          font-size: clamp(1.25rem, 3.5vw, 1.75rem);
          line-height: 1.6;
          font-weight: 800;
          color: #3c2c1c;
        }

        .punctuation-piece {
          display: inline-flex;
          align-items: center;
          gap: 0.15rem;
          flex-wrap: wrap;
        }

        .punctuation-slot {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 1.65rem;
          height: 2.25rem;
          border-radius: 999px;
          border: 1px solid rgba(156, 86, 38, 0.18);
          background: rgba(255, 248, 240, 0.45);
          color: #9b4d1f;
          font: inherit;
          font-size: 1.35rem;
          font-weight: 900;
          cursor: pointer;
        }

        .punctuation-slot:hover:enabled {
          background: #fff8f0;
          border-color: rgba(156, 86, 38, 0.5);
        }

        .punctuation-slot.correct {
          border-style: solid;
          background: #bbf7d0;
          color: #166534;
        }

        .punctuation-slot.wrong {
          border-style: solid;
          background: #fecaca;
          color: #991b1b;
        }

        .answer-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.8rem;
        }

        .answer-grid-figurative {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .answer-grid-parts,
        .answer-grid-rules,
        .answer-grid-essay {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .answer-btn,
        .primary-btn {
          border: 0;
          cursor: pointer;
          font: inherit;
          transition: transform 140ms ease, box-shadow 140ms ease, background 140ms ease;
        }

        .answer-btn {
          min-height: 4rem;
          padding: 1rem;
          border-radius: 1.1rem;
          background: linear-gradient(180deg, #fffdf8 0%, #fff2e3 100%);
          border: 1px solid rgba(167, 103, 57, 0.18);
          font-weight: 800;
          font-size: 1rem;
          color: #7c2d12;
          box-shadow: inset 0 -4px 0 rgba(234, 88, 12, 0.08);
          text-align: left;
        }

        .answer-btn:hover:enabled,
        .primary-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 24px rgba(122, 63, 24, 0.12);
        }

        .answer-btn.correct {
          background: linear-gradient(180deg, #dcfce7 0%, #bbf7d0 100%);
          color: #166534;
        }

        .answer-btn.wrong {
          background: linear-gradient(180deg, #fee2e2 0%, #fecaca 100%);
          color: #991b1b;
        }

        .answer-btn:disabled {
          cursor: default;
        }

        .feedback {
          margin-top: 1rem;
          padding: 1rem;
          border-radius: 1rem;
        }

        .feedback.success {
          background: rgba(220, 252, 231, 0.72);
          border: 1px solid rgba(34, 197, 94, 0.18);
        }

        .feedback.error {
          background: rgba(254, 226, 226, 0.72);
          border: 1px solid rgba(239, 68, 68, 0.18);
        }

        .feedback-title {
          margin: 0 0 0.35rem;
          font-weight: 800;
        }

        .feedback-copy,
        .result-copy {
          margin: 0;
          line-height: 1.6;
          color: #5b4330;
        }

        .primary-btn {
          margin-top: 0.9rem;
          padding: 0.95rem 1.1rem;
          border-radius: 999px;
          background: linear-gradient(135deg, #f97316, #ea580c);
          color: white;
          font-weight: 800;
        }

        .result-card h2 {
          margin: 0.55rem 0;
          font-family: 'Fredoka', sans-serif;
          color: #7c2d12;
          font-size: clamp(1.8rem, 5vw, 2.6rem);
        }

        @media (max-width: 640px) {
          .shell {
            padding: 1rem 0.8rem 2rem;
          }

          .mode-row {
            grid-template-columns: 1fr;
          }

          .hint-grid,
          .answer-grid,
          .answer-grid-figurative,
          .answer-grid-parts,
          .answer-grid-rules,
          .answer-grid-essay {
            grid-template-columns: 1fr;
          }

          .board,
          .question-card,
          .result-card {
            border-radius: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}
