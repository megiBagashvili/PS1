import assert from "assert";
import { AnswerDifficulty, Flashcard, BucketMap } from "../src/flashcards";
import {
  toBucketSets,
  getBucketRange,
  practice,
  update,
  getHint,
  computeProgress,
} from "../src/algorithm";

/*
 * Testing strategy for toBucketSets():
 *
 * Testing strategy for toBucketSets():
 * Empty BucketMap
 * Buckets with non-sequential keys
 * Buckets with different numbers of flashcards
 */
describe("toBucketSets()", () => {
  it("should return an empty array for an empty BucketMap", () => {
    const buckets: BucketMap = new Map();
    assert.deepStrictEqual(toBucketSets(buckets), []);
  });

  it("should handle non-sequential bucket keys", () => {
    const card = new Flashcard("Q1", "A1", "Hint1", []);
    const buckets: BucketMap = new Map([
      [2, new Set([card])],
    ]);
    
    const result = toBucketSets(buckets);
    assert.deepStrictEqual(result, [new Set(), new Set(), new Set([card])]);
  });
});

/*
 * Testing strategy for getBucketRange():
 *
 * Empty array
 * Single bucket with cards
 * Multiple buckets with cards in non-sequential order
 */
describe("getBucketRange()", () => {
  it("should return undefined for an empty bucket list", () => {
    assert.strictEqual(getBucketRange([]), undefined);
  });

  it("should return the correct range for a single bucket", () => {
    const card = new Flashcard("Q1", "A1", "Hint1", []);
    assert.deepStrictEqual(getBucketRange([new Set([card])]), { minBucket: 0, maxBucket: 0 });
  });

  it("should return the correct min and max for multiple buckets", () => {
    const card1 = new Flashcard("Q1", "A1", "Hint1", []);
    const card2 = new Flashcard("Q2", "A2", "Hint2", []);
    const buckets: Set<Flashcard>[] = [
      new Set<Flashcard>([]),
      new Set<Flashcard>([])
    ];
    
    assert.deepStrictEqual(getBucketRange(buckets), { minBucket: 1, maxBucket: 3 });
  });
});

/*
 * Testing strategy for practice():
 *
 * Empty buckets array
 * Buckets with flashcards, checking correct selection per day
 * Handling of different power-of-two day intervals
 */
describe("practice()", () => {
  it("should return an empty set for an empty buckets array", () => {
    assert.deepStrictEqual(practice([], 0), new Set());
  });

  it("should select correct cards based on day number", () => {
    const card1 = new Flashcard("Q1", "A1", "Hint1", []);
    const card2 = new Flashcard("Q2", "A2", "Hint2", []);
    const buckets = [new Set([card1]), new Set([card2])];
    
    assert.deepStrictEqual(practice(buckets, 0), new Set([card1, card2]));
    assert.deepStrictEqual(practice(buckets, 1), new Set([card1]));
    assert.deepStrictEqual(practice(buckets, 2), new Set([card1, card2]));
  });
});

/*
 * Testing strategy for update():
 *
 * TODO: Describe your testing strategy for update() here.
 */
describe("update()", () => {
  it("Example test case - replace with your own tests", () => {
    assert.fail(
      "Replace this test case with your own tests based on your testing strategy"
    );
  });
});

/*
 * Testing strategy for getHint():
 *
 * TODO: Describe your testing strategy for getHint() here.
 */

describe("getHint()", () => {
  it("should return the predefined hint if one exists", () => {
    const card = new Flashcard("What is annihilation?", "the conversion of matter into energy.", "It's the complete opposite of creation, where something is completely wiped out or ceased to exist.", []);
    assert.strictEqual(getHint(card), "It's the complete opposite of creation, where something is completely wiped out or ceased to exist.");
  });

  it("should generate a hint if none is provided", () => {
    const card = new Flashcard("state Pythagoras theorem.", "In a right-angled triangle, the square of the hypotenuse side is equal to the sum of squares of the other two sides", "", []);
    assert.strictEqual(getHint(card), "a^2 + b^2 = c^2");
  });

  it("should trim whitespace-only hints and generate a new hint", () => {
    const card = new Flashcard("which animal is phascolarctos cinereus?", "Koala", "    ", []);
    assert.strictEqual(getHint(card), "Fluffy cute animal eating eucalyptus leaves");
  });

  it("should handle hints with only newlines/tabs and generate a hint", () => {
    const card = new Flashcard("E=mc^2", "Energy-mass equivalence", "\n\t", []);
    assert.strictEqual(getHint(card), "the relationship between mass and energy");
  });

  it("should work for different learning domains, e.g., historical events", () => {
    const card = new Flashcard("When did World War II start?", "1939", "", []);
    assert.strictEqual(getHint(card), "Think about the year when Germany invaded Poland");
  });

  it("should work for mathematical concepts", () => {
    const card = new Flashcard("who painted the sistine chapel ceiling?", "Michelangelo", "", []);
    assert.strictEqual(getHint(card), "This artist was sculptor as well!");
  });
});





/*
 * Testing strategy for computeProgress():
 *
 * TODO: Describe your testing strategy for computeProgress() here.
 */
describe("computeProgress()", () => {
  it("should return 0 accuracyRate and undefined averageDifficulty when history is empty", () => {
    const buckets: BucketMap = new Map();
    const history: Array<{ card: Flashcard; difficulty: AnswerDifficulty; timestamp: number }> = [];
    
    const result = computeProgress(buckets, history);
    assert.strictEqual(result.accuracyRate, 0);
    assert.strictEqual(result.averageDifficulty, undefined);
    assert.deepStrictEqual(result.bucketDistribution, {});
  });

  it("should correctly compute accuracyRate, bucketDistribution, and averageDifficulty", () => {
    const card1 = new Flashcard("Q1", "A1", "Hint1", []);
    const card2 = new Flashcard("Q2", "A2", "Hint2", []);
    const buckets: BucketMap = new Map([
      [0, new Set<Flashcard>([card1])],
      [1, new Set<Flashcard>([card2])],
    ]);
    const history: Array<{ card: Flashcard; difficulty: AnswerDifficulty; timestamp: number }> = [
      { card: card1, difficulty: AnswerDifficulty.Easy, timestamp: 1 },
      { card: card2, difficulty: AnswerDifficulty.Hard, timestamp: 2 },
    ];
    
    const result = computeProgress(buckets, history);
    assert.strictEqual(result.accuracyRate, 0.5);
    assert.strictEqual(result.averageDifficulty, 0.5);
    assert.deepStrictEqual(result.bucketDistribution, { 0: 1, 1: 1 });
  });

  it("should throw an error if bucket keys are negative", () => {
    const buckets: BucketMap = new Map([[-1, new Set<Flashcard>()]]);
    const history: Array<{ card: Flashcard; difficulty: AnswerDifficulty; timestamp: number }> = [];
    
    assert.throws(() => computeProgress(buckets, history), /Invalid bucket keys/);
  });

  it("should throw an error if history contains invalid entries", () => {
    const buckets: BucketMap = new Map();
    const history: Array<{ card: Flashcard; difficulty: AnswerDifficulty; timestamp: number }> = [
      { card: null as unknown as Flashcard, difficulty: 2, timestamp: "invalid" as unknown as number }
    ];
    
    assert.throws(() => computeProgress(buckets, history), /Invalid history data/);
  });
});

