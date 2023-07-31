// eslint-disable-next-line no-unused-vars
import React from 'react';

export function TaskTimer(props) {
  const { startTimer, stopTimer, min, sec } = props;

  return (
    <>
      <button
        type="button"
        aria-label="play button"
        className="icon icon-play"
        onClick={startTimer}
      />
      <button
        type="button"
        aria-label="pause button"
        className="icon icon-pause"
        onClick={stopTimer}
      />
      <div className="timer">{`${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}`}</div>
    </>
  );
}
