import type { NextPage } from "next";
import Head from "next/head";
import ChessGame from "../components/ChessGame";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Chess Game</title>
        <meta name="description" content="Interactive Chess Game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <ChessGame />
      </main>

      <footer className={styles.footer}>
        <p>Chess Game © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Home;
