import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { register } from './api.js';

class RegisterPage extends Component {

    state = {
            login: '',
            password: '',
            password2: '',
            name: '',
            surname: '',
            error: '',
        }
        
    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({error: ''});

        if(this.state.login === ''
                || this.state.password === ''
                || this.state.password2 === ''
                || this.state.name === ''
                || this.state.surname === ''){
            this.setState({error: 'Uzupełnij pola'});
            return;
        }

        if(this.state.password !== this.state.password2){
            this.setState({error: 'Hasła nie są zgodne'});
            return;
        }

        const user = {
            login: this.state.login,
            password: this.state.password,
            name: this.state.name,
            surname: this.state.surname,
        }

        register(user).then((res) => {
            console.log(res);
            if(res.status === "success"){
                this.toLogin.click();
            }else{
                if(res.exception === 'invalid field'){
                    if(res.errors != null) this.setState({error:res.errors});
                    else this.setState({error:"Dane nieprawidłowe"});
                }else this.setState({error:"Wybrany login jest już zarezerwowany"});
            }
        }).catch(e=>{
            console.log(e);
            this.setState({error:"Wystąpił błąd. Spróbuj ponownie później."});
        });

    }

    render(){
        return (
            <div id="solid">
                <Link to="/login" ref={elem => this.toLogin = elem} hidden></Link>
                <h1>Rejestracja</h1>
                <form onSubmit={this.handleSubmit}>
                  <label>
                    <p>Imię</p>
                    <input value={this.state.name} type="text"
                        onChange={(event) => this.setState({ name: event.target.value })} />
                  </label>
                  <label>
                      <p>Nazwisko</p>
                      <input value={this.state.surname} type="text"
                          onChange={(event) => this.setState({ surname: event.target.value })} />
                  </label>
                  <label>
                    <p>Login</p>
                    <input value={this.state.login} type="text"
                        onChange={(event) => this.setState({ login: event.target.value })} />
                  </label>
                  <label>
                    <p>Hasło</p>
                    <input value={this.state.password} type="password"
                        onChange={(event) => this.setState({ password: event.target.value })} />
                  </label>
                  <label>
                      <p>Powtórz hasło</p>
                      <input value={this.state.password2} type="password"
                          onChange={(event) => this.setState({ password2: event.target.value })} />
                  </label><br /><br />
                  <input type="submit" value="Zarejestruj" /><br /><br />
                  <span className="error">{this.state.error}</span>
                </form>
            </div>
        )
    }
	
}
export default RegisterPage;