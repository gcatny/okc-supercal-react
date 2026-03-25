import { useState, useCallback, useEffect } from 'react';
import { votesDB, getVoteCount, addVote, removeVote } from '../services/firebase';

function hasVotedLocal(key) {
  try {
    const v = JSON.parse(localStorage.getItem('okcsupercal_votes') || '{}');
    return !!v[key];
  } catch { return false; }
}

function setVotedLocal(key, voted) {
  try {
    const v = JSON.parse(localStorage.getItem('okcsupercal_votes') || '{}');
    if (voted) v[key] = 1; else delete v[key];
    localStorage.setItem('okcsupercal_votes', JSON.stringify(v));
  } catch {}
}

export function useVoting() {
  const [voteCounts, setVoteCounts] = useState({});
  const [votedKeys, setVotedKeys] = useState({});

  const loadVoteCount = useCallback(async (key) => {
    const count = await getVoteCount(key);
    setVoteCounts(prev => ({ ...prev, [key]: count }));
    setVotedKeys(prev => ({ ...prev, [key]: hasVotedLocal(key) }));
  }, []);

  const toggleVote = useCallback(async (key) => {
    const alreadyVoted = hasVotedLocal(key);
    if (alreadyVoted) {
      await removeVote(key);
      setVotedLocal(key, false);
      setVotedKeys(prev => ({ ...prev, [key]: false }));
    } else {
      await addVote(key);
      setVotedLocal(key, true);
      setVotedKeys(prev => ({ ...prev, [key]: true }));
    }
    // Refresh count
    const count = await getVoteCount(key);
    setVoteCounts(prev => ({ ...prev, [key]: count }));
    return !alreadyVoted; // returns true if just voted
  }, []);

  return { voteCounts, votedKeys, loadVoteCount, toggleVote };
}
