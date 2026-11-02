import test from 'node:test';
import assert from 'node:assert/strict';
import {
  resolveText,
  evaluateKickSession,
  calculateGestationalMoon,
  wipeAllFootprints,
} from './compass.js';

test('resolveText handles English, Amharic, Oromo, and Harari placeholder', () => {
  const sample = {
    en: 'Emergency',
    am: 'ድንገት',
    om: 'Hatattama',
    har: 'አስቸኳይ [HARARI_SLOT]',
  };

  assert.equal(resolveText(sample, 'en'), 'Emergency');
  assert.equal(resolveText(sample, 'am'), 'ድንገት');
  assert.equal(resolveText(sample, 'om'), 'Hatattama');
  assert.equal(resolveText(sample, 'har'), 'ድንገት');

  // Harari empty fallback
  const emptyHarari = {
    en: 'Clinic',
    am: 'ክሊኒክ',
    om: 'Buufata',
    har: '',
  };
  assert.ok(resolveText(emptyHarari, 'har').includes('ክሊኒክ'));
});

test('evaluateKickSession identifies healthy completion at 10 kicks', () => {
  const result = evaluateKickSession(10, 45);
  assert.equal(result.status, 'healthy');
  assert.ok(result.message.en.includes('10 movements'));
});

test('evaluateKickSession alerts when under 10 kicks after 120 minutes', () => {
  const result = evaluateKickSession(4, 125);
  assert.equal(result.status, 'alert');
  assert.ok(result.message.en.includes('Contact'));
});

test('calculateGestationalMoon maps months to trimesters correctly', () => {
  assert.equal(calculateGestationalMoon(2).trimester, 1);
  assert.equal(calculateGestationalMoon(5).trimester, 2);
  assert.equal(calculateGestationalMoon(8).trimester, 3);
});

test('wipeAllFootprints resets everything to zero/null', () => {
  const wiped = wipeAllFootprints();
  assert.equal(wiped.activeMonth, null);
  assert.equal(wiped.kickCount, 0);
  assert.equal(wiped.safeAdult, null);
});
