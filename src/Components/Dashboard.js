import React, { useEffect, useState } from "react";
import play from "../Assets/icon-play.svg";

export const Dashboard = () => {
  const [search, setSearch] = useState("dictionary");
  const [meaning, setMeaning] = useState([]);
  const [audio, setAudio] = useState(null);
  const fetchWord = async (word) => {
    let response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "content-type": "application/json",
        },
      }
    ).then((res) => res.json());
    setMeaning(response);
  };

  console.log(meaning);

  function playAudio(url) {
    const newAudio = new Audio(url);
    newAudio.play();
    setAudio(newAudio);
  }

  useEffect(() => {
    fetchWord(search);
  }, []);

  return (
    <div className="dash-container">
      <header>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="34"
          height="38"
          viewBox="0 0 34 38"
        >
          <g
            fill="none"
            fill-rule="evenodd"
            stroke="#838383"
            stroke-linecap="round"
            stroke-width="1.5"
          >
            <path d="M1 33V5a4 4 0 0 1 4-4h26.8A1.2 1.2 0 0 1 33 2.2v26.228M5 29h28M5 37h28" />
            <path stroke-linejoin="round" d="M5 37a4 4 0 1 1 0-8" />
            <path d="M11 9h12" />
          </g>
        </svg>
      </header>

      <div className="search-container">
        <input
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for any word..."
          className="search"
          value={search}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          onClick={() => {
            fetchWord(search);
          }}
        >
          <path
            fill="none"
            stroke="#A445ED"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="m12.663 12.663 3.887 3.887M1 7.664a6.665 6.665 0 1 0 13.33 0 6.665 6.665 0 0 0-13.33 0Z"
          />
        </svg>
      </div>
      {meaning.length > 0 && (
        <>
          <div className="keyword-container">
            <div>
              <h1>{meaning && meaning[0].word}</h1>
              <p className="phonetic">{meaning && meaning[0].phonetic}</p>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="75"
              height="75"
              viewBox="0 0 75 75"
              onClick={() => {
                let selectedAudio = meaning[0].phonetics.find((audio)=>audio.audio !== "") 
                if (selectedAudio) {
                  return playAudio(selectedAudio.audio);
                }

                // meaning[0].phonetics.forEach((audio) => {
                //   if (audio.audio !== "") {
                //     return playAudio(`${audio.audio}`);
                //   }
                // });
              }}
            >
              <g fill="#A445ED" fillRule="evenodd">
                <circle cx="37.5" cy="37.5" r="37.5" opacity=".25" />
                <path d="M29 27v21l21-10.5z" />
              </g>
            </svg>
          </div>

          {meaning &&
            meaning[0].meanings.map((meaning) => {
              return (
                <div className="part-of-speech-container">
                  <div className="part-of-speech">
                    <h4>{meaning.partOfSpeech}</h4>
                    <hr
                      style={{
                        color: "red",
                        backgroundColor: "#757575",
                        width: "80%",
                        height: 1,
                        opacity: 0.5,
                      }}
                    />
                  </div>

                  <div className="meaning-container">
                    <h4>Meaning</h4>
                    <ul>
                      {meaning.definitions.map((def) => {
                        return (
                          <li>
                            <p>{def.definition}</p>
                            <span>{def.example}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {meaning.synonyms.length > 0 && (
                    <div className="synonyms-container">
                      <h3>Synonyms</h3>
                      <div className="synonyms-wrapper">
                        {meaning.synonyms.map((synonym) => {
                          return (
                            <p
                              className="synonym"
                              onClick={async () => {
                                await fetchWord(synonym);
                                window.scrollTo(0, 0);
                                setSearch(synonym);
                              }}
                            >
                              {synonym}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

          <div className="source-container">
            <p>Source</p>
            <a href={`${meaning && meaning[0].sourceUrls[0]}`}>
              {meaning && meaning[0].sourceUrls[0]}
            </a>
          </div>
        </>
      )}
    </div>
  );
};
