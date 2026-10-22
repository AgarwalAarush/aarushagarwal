import test from "node:test";
import assert from "node:assert/strict";
import { getActiveSection } from "./activeSection.mjs";

const positions = (experienceTop) => [
  { id: "top", top: experienceTop - 2400 },
  { id: "research", top: experienceTop - 1400 },
  { id: "experience", top: experienceTop },
  { id: "projects", top: experienceTop + 2200 },
];

test("Experience stays selected at the scroll-mt-10 landing position", () => {
  for (const height of [320, 600, 900, 1200]) {
    for (const top of [39.5, 40, 40.5]) {
      assert.equal(getActiveSection(positions(top), height), "experience");
    }
  }
});

test("smooth scrolling crosses the boundary once, in either direction", () => {
  const journey = [600, 300, 109, 108, 80, 40];
  const expected = ["research", "research", "research", "experience", "experience", "experience"];
  assert.deepEqual(journey.map((top) => getActiveSection(positions(top), 900)), expected);
  assert.deepEqual(journey.toReversed().map((top) => getActiveSection(positions(top), 900)), expected.toReversed());
});

test("long sections stay active until the next heading reaches the reading position", () => {
  assert.equal(getActiveSection(positions(-1700), 900), "experience");
  assert.equal(getActiveSection(positions(-2160), 900), "projects");
  assert.equal(getActiveSection([{ id: "top", top: 0 }, { id: "research", top: 950 }], 900), "top");
});
