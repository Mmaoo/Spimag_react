import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { addItem, addArea, updateArea, deleteArea, getMyAreas } from './api.js';

class ItemAddPage extends Component {

    state = {
            name: '',
            package: '',
            amount: '',
            error: '',
            area: '', // index of selected area in dropdown list
            areas: [], // list of areas
            areaEdit: '', // index of edited area in dropdown list
            areaEditName: '', // text of input in add/edit mode
            areaEdited: 0, // 0 - dont edit, 1 - add new, 2 - edit existed
        }

    componentDidMount(){
        getMyAreas().then( (res)=>{
//             console.log(res);
            this.setState({areas:res.areas});
//             console.log(this.state.items);
        });
    }

    onAddClick = (event) => {
        event.preventDefault();
        if(this.state.name === ''
                || this.state.amount === ''){
            this.setState({error: 'Uzupełnij pola'});
            return;
        }

        const item = {
            name: this.state.name,
            package: this.state.package,
            amount: this.state.amount,
        }
        if(this.state.areas[this.state.area] != null)
            item.area = this.state.areas[this.state.area];

        console.log(item);

        addItem(item).then((res) => {
//             console.log(res);
            if(res.status === "success"){
                this.toItemListPage.click();
            }else{
                if(res.exception === 'invalid field'){
                    if(res.errors != null) this.setState({error:res.errors});
                    else this.setState({error:"Dane nieprawidłowe"});
                }else this.setState({error:res.exception});
            }
        }).catch(e=>{
            console.log(e);
            this.setState({error:"Błąd dodawania"});
        });
    }

    render(){
        return (
            <div id="solid">
                <Link to="/item/list" ref={elem => this.toItemListPage = elem} hidden></Link>
                <h1>Dodawanie Przetworów</h1>
                <form onSubmit={this.onAddClick}>
                    <label>
                        <p>Nazwa</p>
                        <input value={this.state.name} type="text"
                            onChange={(event) => this.setState({ name: event.target.value })} />
                    </label>
                    <label>
                        <p>Paczka</p>
                        <input value={this.state.package} type="text"
                            onChange={(event) => this.setState({ package: event.target.value })} />
                    </label>
                    <label>
                        <p>Liczba przedmiotów</p>
                        <input value={this.state.amount} type="number"
                            onChange={(event) => this.setState({ amount: event.target.value })} />
                    </label><br />
                    <label>
                        <p>Obszar</p>
                        <select name="obszar" onChange={(event) => this.setState({area:event.target.value})} value={this.state.area}>
                        <option value=''>Wybierz obszar</option>
                        {this.state.areas.map( (area,i) =>
                            <option key={area.id} value={i}>
                                {area.name}
                            </option>
                        )}
                        </select>
                        {this.state.areaEdited == 0 && this.printObszarButtons()}
                        {this.state.areaEdited == 1 && this.printObszarAdd()}
                        {this.state.areaEdited == 2 && this.printObszarEdit()}
                        </label><br /><br />
                    <input type="submit" value="Dodaj" /><br /><br />
                    <span className="error">{this.state.error}</span>
                </form>
            </div>
        )
    }

    onAddAreaClick = () => {
        this.setState({areaEdited: 1});
    }

    onEditAreaClick = () => {
        if(this.state.area === '') return;
        this.setState({areaEdited: 2,
            areaEdit: this.state.area,
            areaEditName: this.state.areas[this.state.area].name,
        });
    }

    onRejectAreaClick = () => {
        this.setState({
            areaEdit: '',
            areaEdited: 0,
        });
    }

    onDeleteAreaClick = () => {
        if(this.state.area == '') return null;

        deleteArea(this.state.areas[this.state.area]).then((res) => {
            console.log(res);
            if(res.status === "success"){
                this.setState({
                    areas: this.state.areas.filter((area,i) => (i != this.state.area)),
                    area: '',
                });
            }else{
                this.setState({error:"Błąd usuwania"});
            }
        }).catch(e=>{
            console.log(e);
            this.setState({error:"Błąd usuwania"});
        });
    }

    onSaveAddAreaClick = () => {
        if(this.state.areaName === '') return null;

        const area = {
            name: this.state.areaEditName,
        }

        addArea(area).then((res) => {
            if(res.status === "success"){
                this.setState({
                    areas: [...this.state.areas,
                            {id:res.id, name:this.state.areaEditName}],
                    area: this.state.areas.length,
                    areaEdit: '',
                    areaEditName: '',
                });
                this.onRejectAreaClick();
            }else{
                this.setState({error:res.exception});
            }
        }).catch(e=>{
            console.log(e);
            this.setState({error:"Błąd dodawania"});
        });
    }

    onSaveEditAreaClick = () => {
        if(this.state.areaName === '') return null;

        const area = {
            id: this.state.areas[this.state.areaEdit].id,
            name: this.state.areaEditName,
        }

        updateArea(area).then((res) => {
            console.log(res);
            if(res.status === "success"){
                let areas = [...this.state.areas];
                let newArea = {...areas[this.state.areaEdit],
                            name: area.name};
                areas[this.state.areaEdit] = newArea;
                this.setState({
                    areas: areas,
                    areaEditName: '',
                });
                console.log(this.state);
                this.onRejectAreaClick();
            }else{
                this.setState({error:res.exception});
            }
        }).catch(e=>{
            console.log(e);
            this.setState({error:"Błąd aktualizacji"});
        });
    }

    printObszarButtons = () => {
        return(
            <span>
               <button type="button" onClick={this.onAddAreaClick}>Nowy</button>
               {this.state.area !== '' && <button type="button" onClick={this.onEditAreaClick}>Edytuj</button>}
               {this.state.area !== '' && <button type="button" onClick={this.onDeleteAreaClick}>Usuń</button>}
           </span>)
    }

    printObszarAdd = () => {
        return(
            <span>
               <input type="text" onChange={(event) => this.setState({areaEditName:event.target.value})} value={this.state.areaEditName} />
               <button type="button" onClick={this.onSaveAddAreaClick}>Zapisz</button>
               <button type="button" onClick={this.onRejectAreaClick}>Anuluj</button>
           </span>)
    }

    printObszarEdit = () => {
        return(
            <span>
               <input type="text" onChange={(event) => this.setState({areaEditName:event.target.value})} value={this.state.areaEditName} />
               <button type="button" onClick={this.onSaveEditAreaClick}>Zapisz</button>
               <button type="button" onClick={this.onRejectAreaClick}>Anuluj</button>
           </span>)
    }
}
export default ItemAddPage;