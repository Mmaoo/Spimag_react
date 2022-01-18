import React, { Component } from 'react';
import imgPrzetwory from './images/przetwory.jpg';

class MainPage extends Component {

    render(){
        return (
            <div id="solid">
                <h1>Strona poświęcona przetworom</h1>
				<img src={imgPrzetwory} alt="przetwory"/>
            </div>
        )
    }
	
}
export default MainPage;