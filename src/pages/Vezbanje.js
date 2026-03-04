import React, { useState, useEffect, useCallback } from 'react';
import './Vezbanje.css';

const NIVOI = ['Laki 😊', 'Srednji 🤔', 'Teški 🔥'];
const OPERACIJE = ['+', '-', '×', '÷'];

function generateTask(nivo) {
  const op = OPERACIJE[Math.floor(Math.random() * (nivo === 0 ? 2 : nivo === 1 ? 3 : 4))];
  let a, b, result;
  const max = nivo === 0 ? 10 : nivo === 1 ? 50 : 100;

  if (op === '+') {
    a = Math.floor(Math.random() * max) + 1;
    b = Math.floor(Math.random() * max) + 1;
    result = a + b;
  } else if (op === '-') {
    a = Math.floor(Math.random() * max) + max / 2;
    b = Math.floor(Math.random() * (max / 2)) + 1;
    result = a - b;
  } else if (op === '×') {
    a = Math.floor(Math.random() * (nivo === 1 ? 10 : 20)) + 1;
    b = Math.floor(Math.random() * 10) + 1;
    result = a * b;
  } else {
    b = Math.floor(Math.random() * 9) + 1;
    result = Math.floor(Math.random() * (nivo === 1 ? 10 : 20)) + 1;
    a = b * result;
  }

  // Generate 4 choices
  const choices = new Set([result]);
  while (choices.size < 4) {
    const delta = Math.floor(Math.random() * (nivo + 1) * 5) + 1;
    const wrong = result + (Math.random() > 0.5 ? delta : -delta);
    if (wrong > 0 && wrong !== result) choices.add(wrong);
  }

  const choiceArr = Array.from(choices).sort(() => Math.random() - 0.5);

  return { a, b, op, result, choices: choiceArr };
}

export default function Vezbanje() {
  const [nivo, setNivo] = useState(0);
  const [task, setTask] = useState(null);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'
  const [showResult, setShowResult] = useState(false);
  const [timer, setTimer] = useState(15);
  const [timerActive, setTimerActive] = useState(false);
  const [history, setHistory] = useState([]);

  const nextTask = useCallback(() => {
    setTask(generateTask(nivo));
    setSelected(null);
    setFeedback(null);
    setTimer(15);
    setTimerActive(true);
  }, [nivo]);

  useEffect(() => {
    nextTask();
  }, [nivo]);

  useEffect(() => {
    if (!timerActive || timer <= 0) {
      if (timer <= 0 && !selected) {
        // Time's up
        setFeedback('wrong');
        setTotal(t => t + 1);
        setStreak(0);
        setTimerActive(false);
        setShowResult(true);
      }
      return;
    }
    const id = setTimeout(() => setTimer(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timer, timerActive, selected]);

  const handleAnswer = (choice) => {
    if (selected !== null) return;
    setSelected(choice);
    setTimerActive(false);
    const correct = choice === task.result;

    if (correct) {
      setFeedback('correct');
      setScore(s => s + 1);
      setStreak(s => {
        const ns = s + 1;
        if (ns > bestStreak) setBestStreak(ns);
        return ns;
      });
    } else {
      setFeedback('wrong');
      setStreak(0);
    }
    setTotal(t => t + 1);
    setHistory(h => [...h.slice(-4), { task: `${task.a} ${task.op} ${task.b}`, result: task.result, choice, correct }]);
    setShowResult(true);

    setTimeout(() => {
      setShowResult(false);
      nextTask();
    }, 1800);
  };

  if (!task) return <div className="vezbanje-loading">Učitavam zadatak... ⏳</div>;

  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  return (
    <div className="vezbanje-page page-enter">

      {/* Header */}
      <div className="vez-header">
        <div>
          <span className="vez-badge">🧮 Interaktivno vežbanje</span>
          <h1>Matematički kviz</h1>
          <p>Reši što više zadataka i skupi bodove!</p>
        </div>

        {/* Level select */}
        <div className="nivo-select">
          {NIVOI.map((n, i) => (
            <button
              key={n}
              className={`nivo-btn ${nivo === i ? 'active' : ''}`}
              onClick={() => { setNivo(i); setScore(0); setTotal(0); setStreak(0); setHistory([]); }}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Score bar */}
      <div className="score-bar">
        <div className="score-item">
          <span className="score-icon">🎯</span>
          <span className="score-num">{score}</span>
          <span className="score-label">Tačno</span>
        </div>
        <div className="score-item">
          <span className="score-icon">📊</span>
          <span className="score-num">{percentage}%</span>
          <span className="score-label">Uspješnost</span>
        </div>
        <div className="score-item">
          <span className="score-icon">🔥</span>
          <span className="score-num">{streak}</span>
          <span className="score-label">Niz tačnih</span>
        </div>
        <div className="score-item">
          <span className="score-icon">⭐</span>
          <span className="score-num">{bestStreak}</span>
          <span className="score-label">Rekord niza</span>
        </div>
      </div>

      {/* Quiz card */}
      <div className={`quiz-card ${feedback}`}>

        {/* Timer ring */}
        <div className="timer-ring">
          <svg viewBox="0 0 44 44">
            <circle cx="22" cy="22" r="18" fill="none" stroke="#EDE9FE" strokeWidth="4" />
            <circle
              cx="22" cy="22" r="18" fill="none"
              stroke={timer > 8 ? '#7C3AED' : timer > 4 ? '#F97316' : '#EF4444'}
              strokeWidth="4"
              strokeDasharray={`${(timer / 15) * 113} 113`}
              strokeLinecap="round"
              transform="rotate(-90 22 22)"
            />
          </svg>
          <span className="timer-num" style={{color: timer > 8 ? '#7C3AED' : timer > 4 ? '#F97316' : '#EF4444'}}>
            {timer}
          </span>
        </div>

        {/* Task display */}
        <div className="task-display">
          <span className="task-a">{task.a}</span>
          <span className="task-op" style={{
            color: task.op==='+' ? '#10B981' : task.op==='-' ? '#EF4444' : task.op==='×' ? '#7C3AED' : '#F97316'
          }}>
            {task.op}
          </span>
          <span className="task-b">{task.b}</span>
          <span className="task-eq">=</span>
          <span className="task-q">?</span>
        </div>

        {/* Streak badge */}
        {streak >= 3 && (
          <div className="streak-badge">🔥 Niz od {streak}! Super si!</div>
        )}

        {/* Answer choices */}
        <div className="choices-grid">
          {task.choices.map((choice, i) => {
            let cls = 'choice-btn';
            if (selected !== null) {
              if (choice === task.result) cls += ' correct';
              else if (choice === selected) cls += ' wrong';
              else cls += ' dimmed';
            }
            return (
              <button
                key={i}
                className={cls}
                onClick={() => handleAnswer(choice)}
                disabled={selected !== null}
              >
                {choice}
              </button>
            );
          })}
        </div>

        {/* Feedback overlay */}
        {showResult && (
          <div className={`feedback-overlay ${feedback}`}>
            {feedback === 'correct'
              ? <><span>🎉</span><p>Tačno! +1 poen!</p></>
              : <><span>😅</span><p>Netačno! Odgovor: {task.result}</p></>
            }
          </div>
        )}
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="history-section">
          <h3>Prethodni zadaci</h3>
          <div className="history-list">
            {[...history].reverse().map((h, i) => (
              <div key={i} className={`history-item ${h.correct ? 'correct' : 'wrong'}`}>
                <span className="hist-eq">{h.task} = {h.result}</span>
                <span className="hist-ans">Tvoj odgovor: {h.choice}</span>
                <span className="hist-icon">{h.correct ? '✅' : '❌'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="tips-section">
        <h3>💡 Saveti za brže računanje</h3>
        <div className="tips-grid">
          {[
            { icon: '➕', tip: 'Za sabiranje: kreni od većeg broja i dodaj manji!', color: '#10B981' },
            { icon: '✖️', tip: 'Za množenje: nauči tablicu množenja napamet!', color: '#7C3AED' },
            { icon: '➗', tip: 'Za deljenje: pitaj se "Koji broj × delilac = dividend?"', color: '#F97316' },
            { icon: '🧠', tip: 'Redovno vežbanje = brže računanje!', color: '#EC4899' },
          ].map((t, i) => (
            <div className="tip-card" key={i} style={{'--tip-color': t.color}}>
              <span className="tip-icon">{t.icon}</span>
              <p>{t.tip}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
