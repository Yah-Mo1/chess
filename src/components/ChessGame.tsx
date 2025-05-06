"use client";
import { useState, useEffect, useCallback } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

export default function ChessGame() {
  const [game, setGame] = useState<Chess>(new Chess());
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [gameStatus, setGameStatus] = useState<string>("ongoing");
  const [fen, setFen] = useState<string>(game.fen());

  // Reset the game to initial state
  const resetGame = useCallback(() => {
    const newGame = new Chess();
    setGame(newGame);
    setMoveHistory([]);
    setGameStatus("ongoing");
    setFen(newGame.fen());
  }, []);

  // Make a move
  function makeAMove(move: { from: string; to: string; promotion?: string }) {
    try {
      const result = game.move(move);
      if (result) {
        setGame(game);
        setFen(game.fen());
        setMoveHistory([...moveHistory, result.san]);
        updateGameStatus();
        return true;
      }
    } catch (error) {
      return false;
    }
    return false;
  }

  // Update game status (checkmate, draw, etc.)
  function updateGameStatus() {
    if (game.isGameOver()) {
      if (game.isCheckmate()) {
        setGameStatus(
          `Checkmate! ${game.turn() === "w" ? "Black" : "White"} wins`
        );
      } else if (game.isDraw()) {
        let reason = "Game ended in a draw";
        if (game.isStalemate()) reason = "Draw by stalemate";
        if (game.isThreefoldRepetition())
          reason = "Draw by threefold repetition";
        if (game.isInsufficientMaterial())
          reason = "Draw by insufficient material";
        setGameStatus(reason);
      }
    } else {
      if (game.isCheck()) {
        setGameStatus(
          `Check! ${game.turn() === "w" ? "White" : "Black"} to move`
        );
      } else {
        setGameStatus(`${game.turn() === "w" ? "White" : "Black"} to move`);
      }
    }
  }

  // Handle piece drop
  function onDrop(sourceSquare: string, targetSquare: string) {
    const move = {
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to queen for simplicity
    };

    return makeAMove(move);
  }

  // Computer move (random)
  function makeRandomMove() {
    const possibleMoves = game.moves();
    if (possibleMoves.length > 0) {
      const randomIndex = Math.floor(Math.random() * possibleMoves.length);
      const move = possibleMoves[randomIndex];
      game.move(move);
      setGame(game);
      setFen(game.fen());
      setMoveHistory([...moveHistory, move]);
      updateGameStatus();
    }
  }

  // Auto-move for black pieces (simple AI)
  useEffect(() => {
    if (game.turn() === "b" && !game.isGameOver()) {
      const timer = setTimeout(() => {
        makeRandomMove();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [fen]);

  return (
    <div className="chess-game">
      <h1>Chess Game</h1>
      <div className="game-container">
        <div className="chessboard-container">
          <Chessboard
            position={fen}
            onPieceDrop={onDrop}
            boardWidth={600}
            customBoardStyle={{
              borderRadius: "4px",
              boxShadow: "0 5px 15px rgba(0, 0, 0, 0.5)",
            }}
            customDarkSquareStyle={{ backgroundColor: "#779556" }}
            customLightSquareStyle={{ backgroundColor: "#ebecd0" }}
          />
        </div>
        <div className="game-info">
          <div className="game-status">{gameStatus}</div>
          <button onClick={resetGame} className="reset-button">
            Reset Game
          </button>
          <div className="move-history">
            <h3>Move History</h3>
            <div className="moves">
              {moveHistory.map((move, index) => (
                <div key={index} className="move">
                  {index % 2 === 0 ? `${Math.floor(index / 2) + 1}.` : ""}{" "}
                  {move}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
