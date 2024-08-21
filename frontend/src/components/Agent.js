import React from 'react';
import '../App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Agent() {
  return (
    <div>
      <section id="agents" className="agents">
        <div className="agents-container">
          <div className="agents-title">
            <h3>Meet Our Agents</h3>
            <p>In this space market-facing, yet UI work flows, or bake it in.<br/>Red flag we need a recap by eod, cob or whatever comes first agile at the end of the day.</p>
          </div>
          <div className="agents-grid">
            <div className="agent-card">
              <div className="agent-image">
                <img src="https://media.istockphoto.com/id/1487286434/de/foto/portr%C3%A4t-einer-jungen-l%C3%A4chelnden-programmiererin-die-mit-computern-in-einem-it-b%C3%BCro-auf-ihrem.webp?b=1&s=612x612&w=0&k=20&c=b182rDwlu3lM2AM-P47LOcg04kPYGkFtvgoIqX5VRAA=" alt="Agent"/>
              </div>
              <div className="agent-info">
                <p className="agent-role">Agent</p>
                <div className="agent-details">
                  <p className="agent-name">Mr. Mohammed Turki</p>
                  <div className="agent-social" style={{display:'flex'}}>
                    <a href="#"><i class="fa-brands fa-facebook-f fa-beat" style={{color:'#0e4977' }}></i></a>
                    <a href="#"><i class="fa-brands fa-twitter fa-beat" style={{color:'#0e4977' }}></i></a>
                    <a href='#'><i class="fa-brands fa-instagram fa-beat" style={{color:'#0e4977' }}></i></a>
                   
                  </div>
                </div>
              </div>
            </div>
            <div className="agent-card">
              <div className="agent-image">
                <img src="https://media.istockphoto.com/id/1919246997/de/foto/gl%C3%BCcklicher-junger-mann-aus-dem-nahen-osten-sitzt-am-schreibtisch-im-b%C3%BCro.webp?b=1&s=612x612&w=0&k=20&c=97hFAhWN_5t8Uwya-N5cOrpcAHnG9aEov28Jx86PB5s=" alt="Agent"/>
              </div>
              <div className="agent-info">
                <p className="agent-role">Agent</p>
                <div className="agent-details">
                  <p className="agent-name">Mr. Josepg Skywalker</p>
                  <div className="agent-social" style={{display:'flex'}}>
                    <a href="#"><i class="fa-brands fa-facebook-f fa-beat" style={{color:'#0e4977' }}></i></a>
                    <a href="#"><i class="fa-brands fa-twitter fa-beat" style={{color:'#0e4977' }}></i></a>
                    <a href='#'><i class="fa-brands fa-instagram fa-beat" style={{color:'#0e4977' }}></i></a>
                   
                  </div>
                </div>
              </div>
            </div>
            <div className="agent-card">
              <div className="agent-image">
                <img src="https://media.istockphoto.com/id/1322050853/de/foto/programmierer-frau-codierung-auf-computer.webp?b=1&s=612x612&w=0&k=20&c=rDJkzQGs6ZW_pTfh2KjsO5Pi8JdbfKEUyu0uW_vpSxc=" alt="Agent"/>
              </div>
              <div className="agent-info">
                <p className="agent-role">Agent</p>
                <div className="agent-details">
                  <p className="agent-name">Mrs. Rouba Kanaan</p>
                  <div className="agent-social" style={{display:'flex'}}>
                    <a href="#"><i class="fa-brands fa-facebook-f fa-beat" style={{color:'#0e4977' }}></i></a>
                    <a href="#"><i class="fa-brands fa-twitter fa-beat" style={{color:'#0e4977' }}></i></a>
                    <a href='#'><i class="fa-brands fa-instagram fa-beat" style={{color:'#0e4977' }}></i></a>
                   
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
