import React, { useEffect, useState } from 'react';
import Tmdb from './tmdb';
import MovieRow from './components/MovieRow'
import FeaturedMovie from './components/FeaturedMovie';

import './App.css';
import Header from './components/Header';

export default function App() {

  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(() =>{
    const loadAll = async () => {
      //Pegando a lista TOTAL
      let list = await Tmdb.getHomeList();
      setMovieList(list);

      //Pegando o Featured - Destaque
      let originals = list.filter(i=>i.slug === 'originals');
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1));
      let chosen = originals[0].items.results[randomChosen];

      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
      setFeaturedData(chosenInfo);
    }
    
    loadAll();
  },[])

  useEffect(() =>{
    const scrollListener = () => {
      if(window.scrollY > 10){
        setBlackHeader(true);
      } else {
        setBlackHeader(false);
      }
    }

    window.addEventListener('scroll', scrollListener);
    return ()=>{
      window.removeEventListener('scroll', scrollListener);
    }
  }, [])

  return (
    <div className="page">

      <Header black={blackHeader}/>

      {featuredData && 
        <FeaturedMovie item={featuredData} />
      }

      <section className="lists">
        {movieList.map((item, key)=>(
          <MovieRow key={key} title={item.title} items={item.items}/>
        ))}
      </section>

      <footer>
        Feito por Rafael Aragão pela aula do professor <a href="https://www.youtube.com/channel/UCw9mYSlqKRXI6l4vH-tAYpQ"><span>Bonieky</span></a><br/>
        Direitos de Imagem para Netflix<br/>
        Dados utilizados da API do site <a href="https://www.themoviedb.org/"><span>themoviedb.org</span></a>
      </footer>
      
      {movieList.length <= 0 &&
        <div className="loading">
          <img src="https://media.filmelier.com/noticias/br/2020/03/Netflix_LoadTime.gif" alt="Loading Films" />
        </div>
      }
    </div>
  );
}