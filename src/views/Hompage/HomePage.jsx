import { Link } from "react-router-dom";
import { SiteBanner } from "../../components/SiteBanner";
import classes from "./HomePage.module.css";
import { getRandomInt } from "../../functions";
import { AlbumsOptions } from "../../components/AlbumsOptions";
import { NewReleases } from "../../components/NewReleases/NewReleases";
import songsInAlbums from "../../songsInAlbums.json";


export const HomePage = () => {
  return (
    <div className={classes.allErasImg}>
      <NewReleases />
      <SiteBanner />
      <Link
        to={`/songquiz`}
        state={{
          songNum: getRandomInt(songsInAlbums.flatMap(album => album.songs).length),
          numOfSongs: songsInAlbums.flatMap(album => album.songs).length
          
        }}
      >
        <button className="lg:px-8 pop-shadow lg:py-2 py-4 px-32 text-orange-100 whitespace-nowrap text-4xl lg:text-xl lg:font-mono rounded-full bg-violet-300 hover:bg-violet-400 active:bg-violet-500 focus:outline-none focus:ring focus:ring-violet-100 ">
          take me to a random song quiz
        </button>
      </Link>
      <AlbumsOptions numOfSongs={songsInAlbums.flatMap(album => album.songs).length} />
    </div>
  );
};
