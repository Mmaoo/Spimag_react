import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { login } from './api.js'

class LoginPage extends Component {

    state = {
        login: '',
        password: '',
        error: '',
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if(this.state.login === ''
                || this.state.password === ''){
            this.setState({error: "Wprowadź dane"});
            return;
        }

        this.setState({error: ""});

        const user = {
            login: this.state.login,
            password: this.state.password,
        }

        login(user).then((res) => {
//             console.log(res);
            if(res.status === "success"){
                localStorage.setItem('token', res.token);
                localStorage.setItem('login', res.login);
                localStorage.setItem('name', res.name);
                localStorage.setItem('surname', res.surname);
                //window.location.href = "/item/list";
                this.toItemListPage.click();
                //this.toMainPage.click();

            }else{
                this.setState({error: "Dane nieprawidłowe"});
            }
        }).catch(e=>{
            console.log(e);
            this.setState({error: "Błąd logowania"});
        });
    }

//     hell = async (event) => {
//         console.log(localStorage.getItem('token'));
//         hello().then((res) => {
//             console.log(res);
//         }).catch(e=>{
//             console.log(e);
//         });
//         console.log(getCurrentUser());
//     }

    render(){

        return (
            <div id="solid">
                <Link to="/" ref={elem => this.toMainPage = elem} hidden></Link>
                <Link to="/item/list" ref={elem => this.toItemListPage = elem} hidden></Link>
                <h1>Logowanie</h1>
                <form>
                  <label>
                    <p>Username</p>
                    <input value={this.state.login} type="text"
                        onChange={(event) => this.setState({ login: event.target.value })} />
                  </label>
                  <label>
                    <p>Password</p>
                    <input value={this.state.password} type="password"
                        onChange={(event) => this.setState({ password: event.target.value })} />
                  </label><br /><br />
                  <button onClick={this.handleSubmit}>Zaloguj</button><br /><br />
                  <span className="error">{this.state.error}</span>
                </form>
            </div>
        )
    }
	
}
export default LoginPage;