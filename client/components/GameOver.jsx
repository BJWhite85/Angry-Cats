import React, { useEffect, useState } from 'react';

const GameOver = ({score}) => {
  console.log()
  const clickCloseModal = () => {
    show(false);
  }

  return (
    <div id="gameOver">
      <h3 id="Title">Game Over</h3>
      <div id="scoreNum">Your Score Was {score}</div>
    </div>
  )
}

export default GameOver;