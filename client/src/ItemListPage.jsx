import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getMyItems, getMyItemsByArea, updateItem, deleteItem, addArea, updateArea, deleteArea, getMyAreas } from './api.js';

class ItemListPage extends Component {

    state = {
            pathArea: '', // area to show its items
            items: [],
            show: '',
            error: '',

            itemEdited: false,
            name: '',
            package: '',
            amount: '',

            area: '', // index of selected area in dropdown list
            areas: [], // list of areas
            areaEdit: '', // index of edited area in dropdown list
            areaEditName: '', // text of input in add/edit mode
            areaEdited: 0, // 0 - dont edit, 1 - add new, 2 - edit existed
        }

    componentDidMount(){
        getMyItems().then( (res)=>{
            this.setState({items:res.items});
//             console.log(this.state.items);
        });

        getMyAreas().then( (res) => {
            this.setState({areas: res.areas});
        });
    }

//     onAddClick = () => {
//         console.log("onAddClick");
//     }

    onItemClick = (i) => {
//         console.log("onItemClick "+i);
//         var item = this.state.items(i);
        this.setState({
            show: i,
        });
        this.onEditRejectClick();
    }

    itemMinus = () => {
        if(this.state.show === '' ||
            this.state.items[this.state.show].amount <= 0) return;
        const item = {
            id: this.state.items[this.state.show].id,
            amount: this.state.items[this.state.show].amount-1,
        }

        updateItem(item).then((res) => {
            if(res.status === "success"){
                let items = [...this.state.items];
                let newItem = {...items[this.state.show],
                            amount: item.amount};
                items[this.state.show] = newItem;
                this.setState({items});
            }else{
                this.setState({error:"Błąd aktualizacji"});
            }
        }).catch(e=>{
            console.log(e);
            this.setState({error:"Błąd aktualizacji"});
        });
    }

    itemPlus = () => {
        if(this.state.show === '') return;

        const item = {
            id: this.state.items[this.state.show].id,
            amount: this.state.items[this.state.show].amount+1,
        }

        updateItem(item).then((res) => {
            if(res.status === "success"){
                let items = [...this.state.items];
                let newItem = {...items[this.state.show],
                            amount: item.amount};
                items[this.state.show] = newItem;
                this.setState({items});
            }else{
                this.setState({error:"Błąd aktualizacji"});
            }
        }).catch(e=>{
            console.log(e);
            this.setState({error:"Błąd aktualizacji"});
        });
    }

    onDeleteClick = () => {
        const item = {
            id: this.state.items[this.state.show].id,
        }

        deleteItem(item).then((res) => {
            if(res.status === "success"){
                this.setState({
                    items: this.state.items.filter((item,i) => (i != this.state.show)),
                    show: '',
                });
//                 let items = [...this.state.items];
//                 let newItem = {...items[this.state.show],
//                             amount: item.amount};
//                 items[this.state.show] = newItem;
//                 this.setState({items});
            }else{
                this.setState({error:"Błąd usuwania"});
            }
        }).catch(e=>{
            console.log(e);
            this.setState({error:"Błąd usuwania"});
        });
    }

    onEditClick = () => {
        this.setState({
            name: this.state.items[this.state.show].name,
            package: this.state.items[this.state.show].package,
            amount: this.state.items[this.state.show].amount,
            area: this.state.items[this.state.show].area != null ?
                this.state.areas.indexOf(
                    this.state.areas.filter(
                        (area) => (area.id == this.state.items[this.state.show].area.id))[0])
                : '',
            itemEdited: true,
        });

//         console.log(this.state);
    }

    onChangePathAreaClicked = (areaId) => {
//         console.log("pathArea="+areaId);
        getMyItemsByArea(areaId).then( (res)=>{
            this.setState({
                show: '',
                pathArea: this.state.areas.indexOf(this.state.areas.filter((area) => area.id == areaId)[0]),
                items: res.items,
            });
        });
    }

    clearPathArea = () => {
        getMyItems().then( (res)=>{
            this.setState({
                show: '',
                pathArea: '',
                items: res.items,
            });
        });
    }

//     onChangePathAreaClicked = (areaId) => {
//             console.log("pathArea="+areaId);
//             getMyItemsByArea(areaId).then( (res)=>{
//                 this.setState({
//                     show: '',
//                     pathArea: areaId,
//                     items:res.items,
//                 });
//     //             console.log(this.state.items);
//             });
//         }

    render(){
        return (
            <div id="solid">
                <div>
                    <h1>Przetwory</h1>
                    <button><Link to="/item/add">Dodaj nowy</Link></button><br />
                    { this.state.pathArea !== '' && <span>Wybrano obszar {this.state.areas[this.state.pathArea].name}  <button onClick={this.clearPathArea}>Wyczyść</button></span>}
                    <table>
                        <thead>
                            <tr>
                                <th>Nazwa</th>
                                <th>Opakowanie</th>
                                <th>Liczba przedmiotów</th>
                                <td>Obszar</td>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.state.items.map( (item,i) =>
                            <tr key={item.id} onClick={() => this.onItemClick(i)} className="item">
                                <td>{item.name}</td>
                                <td>{item.package}</td>
                                <td>{item.amount}</td>
                                <td>{item.area != null ? <span onClick={() => this.onChangePathAreaClicked(item.area.id)}>{item.area.name}</span> : <span>brak</span>}</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
                { this.state.show !== '' && <div>
                    <h3>{this.state.items[this.state.show].name}</h3>
                    {!this.state.itemEdited && this.printItemShow()}
                    {this.state.itemEdited && this.printItemEdit()}
                </div>}
            </div>
        )
    }

    onEditSaveClick = () => {
        if(this.state.name === ''
                || this.state.amount === ''){
            this.setState({error: 'Uzupełnij pola'});
            return;
        }

        const item = {
            id: this.state.items[this.state.show].id,
            name: this.state.name,
            package: this.state.package,
            amount: this.state.amount,
        }
        if(this.state.areas[this.state.area] != null)
            item.area = this.state.areas[this.state.area];

        console.log(item);

        updateItem(item).then((res) => {
            console.log(res);
            if(res.status === "success"){
                let items = [...this.state.items];
                let newItem = {...items[this.state.show],
                            name: item.name,
                            package: item.package,
                            amount: parseInt(item.amount)};
                if(item.area != null) newItem.area = item.area;
                items[this.state.show] = newItem;
                this.setState({
                    items: items,
                    name: '',
                    package: '',
                    amount: '',
                });
                this.onEditRejectClick();
            }else{
                if(res.exception === 'invalid field'){
                    if(res.errors != null) this.setState({error:res.errors});
                    else this.setState({error:"Dane nieprawidłowe"});
                }else this.setState({error:"Błąd dodawania"});
            }
        }).catch(e=>{
            console.log(e);
            this.setState({error:"Błąd dodawania"});
        });
    }

    onEditRejectClick = () => {
        this.setState({itemEdited: false,error:''});
        this.onRejectAreaClick();
    }

    printItemShow(){
        return(
            <div>
                <table><tbody>
                    <tr><td>Opakowanie</td><td>{this.state.items[this.state.show].package}</td></tr>
                    <tr><td>Ilość</td><td>{this.state.items[this.state.show].amount}</td>
                    <td><button onClick={this.itemMinus}>-</button> &nbsp; <button onClick={this.itemPlus}>+</button></td></tr>
                    {this.state.items[this.state.show].area != null && <tr><td>Obszar</td><td>{this.state.items[this.state.show].area.name}</td></tr>}
                </tbody></table>
                <button onClick={this.onEditClick}>Edytuj</button>
                <button onClick={this.onDeleteClick}>Usuń</button>
            </div>
        )
    }

    printItemEdit(){
        return(
            <div>
                <form>
                <table><tbody>
                    <tr><td>Nazwa</td><td><input type="text" value={this.state.name} onChange={(event) => this.setState({name:event.target.value})} /></td></tr>
                    <tr><td>Opakowanie</td><td><input type="text" value={this.state.package} onChange={(event) => this.setState({package:event.target.value})} /></td></tr>
                    <tr><td>Ilość</td><td><input type="number" value={this.state.amount} onChange={(event) => this.setState({amount:event.target.value})} /></td></tr>
                    <tr><td>Obszar</td><td>
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
                    </td></tr>
                </tbody></table>
                </form>
                <button onClick={this.onEditSaveClick}>Zapisz</button>
                <button onClick={this.onEditRejectClick}>Anuluj</button>
                <span className="error">{this.state.error}</span>
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
                error: '',
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
export default ItemListPage;