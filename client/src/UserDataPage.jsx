import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser, updateUser } from './api';

class UserDataPage extends Component {

    state = {
        editData: false,
        name: '',
        surname: '',
        editPassword: false,
        oldPassword: '',
        password: '',
        password2: '',
        error: '',
    }

    onEditDataClick = () => {
        this.setState({
            name: getCurrentUser().name,
            surname: getCurrentUser().surname,
            editData: true,
            editPassword: false,
        });
    }

    onEditDataSubmit = (event) => {
        event.preventDefault();
        console.log('onEditDataSubmit');
        if(this.state.name == ''
                || this.state.surname == ''){
            this.setState({error: 'Uzupełnij pola'});
            return;
        }
        this.setState({error: ''});

        const user = {
            name: this.state.name,
            surname: this.state.surname,
        }

        updateUser(user).then((res) => {
            console.log(res);
            if(res.status === 'success'){
                localStorage.setItem('login', res.login);
                localStorage.setItem('name', res.name);
                localStorage.setItem('surname', res.surname);
                this.setState({editData:false});
            }else{
                if(res.exception === 'invalid field'){
                    if(res.errors != null) this.setState({error:res.errors});
                    else this.setState({error:"Dane nieprawidłowe"});
                }else this.setState({error:"Błąd aktualizacji"});
            }
        }).catch(e=>{
            console.log(e);
        });
    }

    onEditPasswordClick = () => {
        this.setState({
            editData: false,
            editPassword: true,
        });
    }

    onEditPasswordSubmit = (event) => {
        event.preventDefault();
        console.log('onEditDataSubmit');
        console.log(this.state.password+", "+this.state.password2+", "+this.state.oldPassword)
        if(this.state.oldPassword == ''
                || this.state.password == ''
                || this.state.password2 == ''){
            this.setState({error: 'Uzupełnij pola'});
            return;
        }

        if(this.state.password !== this.state.password2){
            this.setState({error: 'Hasła nie są zgodne'});
            return;
        }

        this.setState({error: ''});

        const user = {
            password: this.state.password,
            oldPassword: this.state.oldPassword,
        }

        updateUser(user).then((res) => {
            console.log(res);
            if(res.status == "success"){
                this.setState({editPassword:false});
            }else{
                if(res.exception == "bad old password") this.setState({error: "Stare hasło nie jest poprawne"});
                else this.setState({error: "Błąd logowania"});
            }
        }).catch(e=>{
            console.log(e);
            this.setState({error: "Błąd logowania"});
        });
    }


    render(){
        return (
            <div id="solid">
                <h1>Dane użytkownika</h1>
                {!this.state.editData && !this.state.editPassword && this.printUserData()}
                {this.state.editData && this.printUserDataEdit()}
                {this.state.editPassword && this.printUserPasswordEdit()}
            </div>
        )
    }

    printUserData = () => {
            return(<div><p>
                    <span>Imię: {getCurrentUser().name}</span><br />
                    <span>Nazwisko: {getCurrentUser().surname}</span><br /><br />
                    <button onClick={this.onEditDataClick}>Edytuj dane osobowe</button><br />
                    <button onClick={this.onEditPasswordClick}>Zmień hasło</button><br />
                   </p></div>)
        }

    printUserDataEdit = () => {
        return(<div><form onSubmit={this.onEditDataSubmit}>
                    <label>
                        <p>Imię</p>
                        <input value={this.state.name} type="text"
                            onChange={(event) => this.setState({ name: event.target.value })} />
                      </label>
                      <label>
                          <p>Nazwisko</p>
                          <input value={this.state.surname} type="text"
                              onChange={(event) => this.setState({ surname: event.target.value })} />
                      </label><br /><br /><br />
                      <input type="submit" value="Zapisz" />
                      <button onClick={() => this.setState({editData:false})}>Anuluj</button><br /><br />
                      <span className="error">{this.state.error}</span>
                </form></div>)
    }

    printUserPasswordEdit = () => {
        return(<div><form onSubmit={this.onEditPasswordSubmit}>
                    <label>
                        <p>Stare hasło</p>
                        <input value={this.state.oldPassword} type="password"
                            onChange={(event) => this.setState({ oldPassword: event.target.value })} />
                      </label><br />
                    <label>
                        <p>Nowe hasło</p>
                        <input value={this.state.password} type="password"
                            onChange={(event) => this.setState({ password: event.target.value })} />
                      </label>
                      <label>
                          <p>Powtórz hasło</p>
                          <input value={this.state.password2} type="password"
                              onChange={(event) => this.setState({ password2: event.target.value })} />
                      </label><br /><br /><br />
                      <input type="submit" value="Zapisz" />
                      <button onClick={() => this.setState({editPassword:false})}>Anuluj</button><br /><br />
                      <span className="error">{this.state.error}</span>
                </form></div>)
    }
}

export default UserDataPage;