import React, { useState } from 'react';
import './CityGuide.css';

const CityGuide = () => {
  const [selectedCity, setSelectedCity] = useState(null);

  const cities = [
    {
      name: 'Düsseldorf',
      description: 'A vibrant city in western Germany known for its fashion industry, art scene, and modern architecture. The Rhine River promenade is a must-see.',
      image: 'https://media.istockphoto.com/id/901469416/de/foto/d%C3%BCsseldorfer-medienhafen-in-deutschland.webp?b=1&s=612x612&w=0&k=20&c=cVKS3f0lSWzHOZtJWW8y_q_f_uD9cWS16DuW5A6PlpY=', // Replace with actual image URL
    },
    {
      name: 'Berlin',
      description: 'The capital of Germany, famous for its history, vibrant arts scene, and modern landmarks like the Berlin Wall and Brandenburg Gate.',
      image: 'https://media.istockphoto.com/id/636008560/de/foto/berliner-stadtbild-bei-sonnenuntergang-brandenburger-tor.webp?b=1&s=612x612&w=0&k=20&c=2Ag2D4rlFrOFV5emiwrTlphevZ23MNXnXlsB3e-kj6U=', // Replace with actual image URL
    },
    {
      name: 'Köln',
      description: 'A major cultural hub in western Germany, known for its impressive cathedral, museums, and vibrant carnival.',
      image: 'https://media.istockphoto.com/id/624394918/de/foto/k%C3%B6lner-dom-in-der-nacht-deutschland.webp?b=1&s=612x612&w=0&k=20&c=Oygy1IQQSG4gVzJp-Lw0jD5f0IgWV0NJxvmvuxqVOOo=', // Replace with actual image URL
    },
    {
      name: 'Hamburg',
      description: 'A major port city in northern Germany, known for its harbor, Elbphilharmonie concert hall, and vibrant nightlife.',
      image: 'https://media.istockphoto.com/id/1319049336/de/foto/hamburg-hafen-city-und-skyline-der-stadt.webp?b=1&s=612x612&w=0&k=20&c=0xAHXXwbzKAlDI7Dj5fJjGDmu_jSSLjfAlcn3Nh_si0=', // Replace with actual image URL
    },
    {
      name: 'Flensburg',
      description: 'A picturesque town in northern Germany, close to the Danish border, known for its charming harbor, historic buildings, and maritime history.',
      image: 'https://media.istockphoto.com/id/1327326019/de/foto/segelboote-im-flensburger-hafen-st-jorgen-kirche-im-hintergrund-schleswig-holstein-in.webp?b=1&s=612x612&w=0&k=20&c=l48aVrXRKGo0YRc70E6TaF6FG6YLPgpp6E-C82QJuw0=', // Replace with actual image URL
    },
    {
      name: 'Stuttgart',
      description: 'The capital of the state of Baden-Württemberg, known for its automotive industry, vineyards, and the Stuttgart TV tower.',
      image: 'https://media.istockphoto.com/id/1286460967/de/foto/stuttgart-tv-tower-skyline-luftbild-ansicht-stadt-architektur-reisen.webp?b=1&s=612x612&w=0&k=20&c=PnFXcIN6T1MiBbyLysmS-lAcRN71bUUOiLCkw-D8JFU=', // Replace with actual image URL
    },
    {
      name: 'Schwerin',
      description: 'A charming city in northern Germany, known for the beautiful Schwerin Castle surrounded by lakes.',
      image: 'https://media.istockphoto.com/id/1958156268/de/foto/the-cityscape-of-schwerin-germany.jpg?s=612x612&w=0&k=20&c=Zkak99RbfOmhEZjTWpU9CjDknpUgzOef192pKDtAYfo=', // Replace with actual image URL
    },
    {
      name: 'Mainz',
      description: 'A city on the Rhine River, known for its historic old town, Romanesque cathedral, and vibrant wine culture.',
      image: 'https://media.istockphoto.com/id/1594168692/de/foto/mainz-kathedrale.webp?b=1&s=612x612&w=0&k=20&c=QcyX5JNkP20EID_oQCDjnbsEHQN0mUnKb88vm3jsUMM=', // Replace with actual image URL
    },
    {
      name: 'Magdeburg',
      description: 'The capital city of Saxony-Anhalt, known for its Gothic cathedral and the modernist Green Citadel designed by Friedensreich Hundertwasser.',
      image: 'https://media.istockphoto.com/id/468168068/de/foto/magdeburg-die-skyline.webp?b=1&s=612x612&w=0&k=20&c=FfpN5_hqrIwMQObMPZa_f5IdiM2yv2atEdzfrKVhj1M=', // Replace with actual image URL
    },
    {
      name: 'Hannover',
      description: 'A city in northern Germany, known for its trade fairs, royal gardens of Herrenhausen, and a reconstructed old town.',
      image: 'https://media.istockphoto.com/id/1462733539/de/foto/altes-rathaus-hannover-niedersachsen-deutschland.webp?b=1&s=612x612&w=0&k=20&c=Ny87I5an4cb5sdFddEdO11yVJFfwdC6em5zoKAv_vtY=', // Replace with actual image URL
    },
    {
      name: 'Erfurt',
      description: 'The capital of Thuringia, known for its well-preserved medieval city center, including the Erfurt Cathedral and the Krämerbrücke bridge.',
      image: 'https://media.istockphoto.com/id/1552651861/de/foto/domplatz-in-erfurt-th%C3%BCringen-deutschland.webp?b=1&s=612x612&w=0&k=20&c=dohjygz82pLMD9gqmlr7EiADYBHNEbXdSBS4hFBD9AY=', // Replace with actual image URL
    },
    {
      name: 'Paris',
      description: 'The capital of France, known for its art, gastronomy, and culture. Must-see places include the Eiffel Tower, Louvre Museum, and Notre-Dame Cathedral.',
      image: 'https://media.istockphoto.com/id/2153347966/de/foto/eiffel-tower-in-paris-france-on-a-sunny-day.webp?b=1&s=612x612&w=0&k=20&c=P88jjLYvBhRpjuQBYCY1tMKMPW5rZHjoq5c5DBxetBM=', // Replace with actual image URL
    },
    {
      name: 'Malmö',
      description: 'A vibrant city in southern Sweden, known for its modern architecture, waterfront, and the Öresund Bridge connecting it to Copenhagen.',
      image: 'https://media.istockphoto.com/id/2091393445/de/foto/malmo-old-lighthouse-a-beautiful-lighthouse-in-the-center-of-the-swedish-city.webp?b=1&s=612x612&w=0&k=20&c=xkWgR73pvZ_c_aOIAQfyI19je2lQZo9bdqc1mF5s9Ug=', // Replace with actual image URL
    },
    {
      name: 'Rome',
      description: 'The capital of Italy, famous for its nearly 3,000 years of globally influential art, architecture, and culture. Key sites include the Colosseum and Vatican City.',
      image: 'https://media.istockphoto.com/id/683962492/de/foto/sonnenaufgang-am-kolosseum-rom-italien.webp?b=1&s=612x612&w=0&k=20&c=OyZg6CZ90KbtLnHWprz-JKoioiJWOHimI-kn8ySGodw=', // Replace with actual image URL
    },
    {
      name: 'Luxembourg',
      description: 'A small European country known for its fortified medieval old town perched on sheer cliffs, and as a major financial center.',
      image: 'https://media.istockphoto.com/id/2158626450/de/foto/luxembourg-city-and-adolphe-bridge-view-in-autumn.webp?b=1&s=612x612&w=0&k=20&c=HfTxP4AFk3TkwwTJwU25QfOcRqs689O_jPVE9jpqc1w=', // Replace with actual image URL
    },
    {
      name: 'Madrid',
      description: 'The capital of Spain, known for its Royal Palace, Prado Museum, and vibrant nightlife.',
      image: 'https://media.istockphoto.com/id/1489511553/de/foto/crystal-palace-im-retiro-park-madrid-spanien.webp?b=1&s=612x612&w=0&k=20&c=FhNbhbUtYOP5rTBnzgNuSD09WBKc1MgCyGBf6STB1WM=', // Replace with actual image URL
    },
    {
      name: 'Athens',
      description: 'The capital of Greece, known as the cradle of Western civilization. Key sites include the Acropolis and Parthenon.',
      image: 'https://media.istockphoto.com/id/1812368315/de/foto/parthenon-auf-der-akropolis-in-athen-griechenland-bei-sonnenuntergang.webp?b=1&s=612x612&w=0&k=20&c=hG60l74zzeUrdPPs2PTCg_bPI3y3OVtam8lTSa2-YNU=', // Replace with actual image URL
    },
    {
      name: 'Amsterdam',
      description: 'The capital of the Netherlands, famous for its canals, historic houses, museums, and vibrant cultural scene.',
      image: 'https://media.istockphoto.com/id/1401388169/de/foto/tulpen-und-windm%C3%BChlen.webp?b=1&s=612x612&w=0&k=20&c=2-D3Fab2KkxiqJ12EMF9ADcnSCTiJNpBoReF0BLidm8=', // Replace with actual image URL
    },
  ];

  return (
    <div className="city-guide-container" style={{marginTop:"150px"}}>
      <div className="city-list">
        {cities.map((city, index) => (
          <div
            key={index}
            className={`city-item ${selectedCity === city.name ? 'active' : ''}`}
            onClick={() => setSelectedCity(city.name)}
          >
            {city.name}
          </div>
        ))}
      </div>
      <div className="city-details">
        {selectedCity ? (
          cities
            .filter((city) => city.name === selectedCity)
            .map((city, index) => (
              <div key={index}>
                <h2>{city.name}</h2>
                <img src={city.image} alt={city.name} />
                <p>{city.description}</p>
              </div>
            ))
        ) : (
          <p>Select a city to view details.</p>
        )}
      </div>
    </div>
  );
};

export default CityGuide;
